import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import worker from "../worker/index.js";
import { cleanupConsultantRequests, flushConsultantReports } from "../worker/consultant.js";
import { isTelegramConfigured } from "../worker/telegram-service.js";
import { answersFor, testTariff } from "./fixtures/consultant-tariff.js";
import { network } from "./network.js";

const TELEGRAM = { TELEGRAM_BOT_TOKEN: "test-telegram-token", TELEGRAM_ADMIN_CHAT_ID: "10001", TELEGRAM_TIMEOUT_MS: "1000", TELEGRAM_MAX_ATTEMPTS: "2" };
const SUMMARY = "مشتری یک سایت برای معرفی خدمات و جذب مشتری می‌خواهد.";

function runtimeEnv(overrides = {}) {
  return {
    ...env,
    ...TELEGRAM,
    AI: { run: async () => ({ response: JSON.stringify({ summary: SUMMARY, ambiguities: [] }) }) },
    ...overrides,
  };
}

let telegramTexts = [];
function mockTelegram() {
  network.use(http.post(/https:\/\/api\.telegram\.org\/bot[^/]+\/.+/u, async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    telegramTexts.push(String(body.text ?? ""));
    return HttpResponse.json({ ok: true, result: { message_id: telegramTexts.length } });
  }));
}

async function call(path, { method = "POST", body, headers = {}, currentEnv = runtimeEnv(), ip = "203.0.113.50" } = {}) {
  const ctx = createExecutionContext();
  const response = await worker.fetch(new Request(`https://example.com${path}`, {
    method,
    headers: { "content-type": "application/json", origin: "https://example.com", "cf-connecting-ip": ip, ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  }), currentEnv, ctx);
  await waitOnExecutionContext(ctx);
  return { status: response.status, body: await response.json().catch(() => null), headers: response.headers };
}

async function adminSession(currentEnv = runtimeEnv()) {
  const login = await call("/api/admin/session", { body: { token: "test-admin-token" }, currentEnv });
  expect(login.status).toBe(200);
  const cookie = login.headers.get("set-cookie").split(";")[0];
  return { cookie, csrf: login.body.csrfToken };
}

async function saveTariff(config, note = "test", currentEnv = runtimeEnv()) {
  const { cookie, csrf } = await adminSession(currentEnv);
  return call("/api/admin/consultant/tariffs", { method: "PUT", body: { config, note }, headers: { cookie, "x-csrf-token": csrf }, currentEnv });
}

const estimateBody = (overrides = {}) => ({ locale: "fa", answers: answersFor.corporate(), consent: true, clientRequestId: crypto.randomUUID(), ...overrides });
const notifications = (like) => env.DB.prepare("SELECT event_key, status FROM telegram_notifications WHERE substr(event_key, 1, ?) = ? ORDER BY event_key").bind(like.length, like).all().then((r) => r.results);

beforeEach(async () => {
  telegramTexts = [];
  await env.DB.batch([
    env.DB.prepare("DELETE FROM consultant_requests"),
    env.DB.prepare("DELETE FROM pricing_tariffs"),
    env.DB.prepare("DELETE FROM telegram_notifications"),
    env.DB.prepare("DELETE FROM rate_limit_counters"),
  ]);
});

describe("consultant config and tariffs", () => {
  it("works without a tariff: questions are served, the budget offers only 'your suggestion', and prices say needs review", async () => {
    const config = await call("/api/consultant/config?locale=fa", { method: "GET" });
    expect(config.status).toBe(200);
    expect(config.body.pricingConfigured).toBe(false);
    expect(config.body.questions.budget.options.map((o) => o.id)).toEqual(["suggest"]);
    const estimate = await call("/api/consultant/estimate", { body: estimateBody({ consent: false, answers: { ...answersFor.corporate(), budget: "suggest" } }) });
    expect(estimate.status).toBe(200);
    expect(estimate.body.estimate).toEqual({ status: "needs_review", reason: "no_tariff", confidence: expect.any(String) });
    expect(estimate.body.scope.architecture.id).toBe("wordpress");
    expect(estimate.body.stored).toBe(false);
  });

  it("lets only a signed-in admin save tariffs, validates them, versions them and the estimate follows the new rates", async () => {
    expect((await call("/api/admin/consultant/tariffs", { method: "GET" })).status).toBe(401);
    const invalid = await saveTariff({ ...testTariff(), hourlyRate: null });
    expect(invalid.status).toBe(400);
    expect(invalid.body.issues).toContain("hourlyRate");
    expect((await saveTariff(testTariff(), "v1")).body.version).toBeGreaterThan(0);
    const first = await call("/api/consultant/estimate", { body: estimateBody({ consent: false }) });
    expect(first.body.estimate.status).toBe("estimated");
    expect(JSON.stringify(first.body)).not.toMatch(/"hours"|hourlyRate/u);
    await saveTariff(testTariff({ hourlyRate: 3_000_000 }), "v2");
    const second = await call("/api/consultant/estimate", { body: estimateBody({ consent: false }) });
    expect(second.body.estimate.tiers.economic.oneTime.min).toBeGreaterThan(first.body.estimate.tiers.economic.oneTime.min * 2.5);
    const { cookie } = await adminSession();
    const listed = await call("/api/admin/consultant/tariffs", { method: "GET", headers: { cookie } });
    expect(listed.body.active.note).toBe("v2");
    expect(listed.body.history).toHaveLength(2);
    expect(listed.body.template.hourlyRate).toBeNull();
  });
});

describe("consultant requests", () => {
  beforeEach(async () => {
    await saveTariff(testTariff());
    mockTelegram();
  });

  it("stores only with consent, sends the report once, and a double submit creates nothing new", async () => {
    const before = await env.DB.prepare("SELECT COUNT(*) AS n FROM consultant_requests").first("n");
    await call("/api/consultant/estimate", { body: estimateBody({ consent: false }) });
    expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM consultant_requests").first("n")).toBe(before);

    const body = estimateBody({ answers: answersFor.ecommerce() });
    const created = await call("/api/consultant/estimate", { body });
    expect(created.status).toBe(201);
    expect(created.body.consultantId).toMatch(/^cr_/u);
    expect(created.body.publicRef).toMatch(/^SOS-[A-Z2-9]{6}$/u);
    expect(created.body.updateToken).toMatch(/^[A-Za-z0-9_-]{43}$/u);
    expect(created.body.summary).toEqual({ text: SUMMARY, ambiguities: [], source: "model" });
    const row = await env.DB.prepare("SELECT * FROM consultant_requests WHERE id = ?").bind(created.body.consultantId).first();
    expect(row.update_token_hash).not.toContain(created.body.updateToken);
    expect(row.telegram_state).toBe("sent");
    expect(row.contact_value).toBeNull();
    const sent = await notifications(`consultant:${created.body.consultantId}:0:`);
    expect(sent.length).toBeGreaterThanOrEqual(1);
    expect(sent.every((item) => item.status === "sent")).toBe(true);
    const report = telegramTexts.join("\n");
    expect(report).toContain(created.body.publicRef);
    expect(report).toContain("ووکامرس");
    expect(report).toContain("/admin/consultant/detail?id=");
    expect(report).toContain("اطلاعات تماس هنوز ثبت نشده است.");

    const textsBefore = telegramTexts.length;
    const again = await call("/api/consultant/estimate", { body });
    expect(again.body).toMatchObject({ consultantId: created.body.consultantId, duplicate: true });
    expect(again.body.updateToken).toBeUndefined();
    expect(telegramTexts.length).toBe(textsBefore);
  });

  it("records a tier choice and contact details with the token, notifying once per real change", async () => {
    const created = await call("/api/consultant/estimate", { body: estimateBody({ answers: answersFor.ecommerce() }) });
    const { consultantId: requestId, updateToken } = created.body;
    const path = `/api/consultant/requests/${requestId}`;

    expect((await call(path, { body: { updateToken: "x".repeat(43), action: "select", tier: "economic" } })).status).toBe(404);
    const selected = await call(path, { body: { updateToken, action: "select", tier: "professional" } });
    expect(selected.body).toMatchObject({ status: "tier_selected", selectedTier: "professional", changed: true });
    const same = await call(path, { body: { updateToken, action: "select", tier: "professional" } });
    expect(same.body.changed).toBe(false);
    expect((await notifications(`consultant:${requestId}:1:`)).length).toBeGreaterThanOrEqual(1);
    expect(await notifications(`consultant:${requestId}:2:`)).toEqual([]);

    expect((await call(path, { body: { updateToken, action: "contact", name: "سارا احمدی", contact: "09120000000" } })).body.error).toBe("consent_required");
    const badPhone = await call(path, { body: { updateToken, action: "contact", name: "سارا احمدی", contact: "123", consent: true } });
    expect(badPhone.status).toBe(400);
    const contact = await call(path, { body: { updateToken, action: "contact", name: "سارا احمدی", contact: "۰۹۱۲۰۰۰۰۰۰۰", notes: "عصرها تماس بگیرید", consent: true } });
    expect(contact.body).toMatchObject({ status: "contact_submitted", selectedTier: "professional", changed: true });
    const row = await env.DB.prepare("SELECT contact_value, contact_consent_at FROM consultant_requests WHERE id = ?").bind(requestId).first();
    expect(row.contact_value).toBe("09120000000");
    expect(row.contact_consent_at).toBeTruthy();
    expect(telegramTexts.join("\n")).toContain("09120000000");
    expect(telegramTexts.join("\n")).toContain("به‌روزرسانی درخواست برآورد");
  });

  it("re-estimates the same request after the customer edits answers, instead of creating a second one", async () => {
    const created = await call("/api/consultant/estimate", { body: estimateBody() });
    const edited = await call("/api/consultant/estimate", {
      body: { locale: "fa", answers: { ...answersFor.corporate(), features: ["services_pages"] }, consent: true, consultantId: created.body.consultantId, updateToken: created.body.updateToken },
    });
    expect(edited.status).toBe(200);
    expect(edited.body.consultantId).toBe(created.body.consultantId);
    expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM consultant_requests").first("n")).toBe(1);
    expect(await env.DB.prepare("SELECT update_seq FROM consultant_requests").first("update_seq")).toBe(1);
  });

  it("keeps the request and parks the report while Telegram is not configured, then sends it from the cron", async () => {
    const offline = runtimeEnv({ TELEGRAM_BOT_TOKEN: "", TELEGRAM_ADMIN_CHAT_ID: "" });
    const created = await call("/api/consultant/estimate", { body: estimateBody(), currentEnv: offline });
    expect(created.status).toBe(201);
    expect(await env.DB.prepare("SELECT telegram_state FROM consultant_requests").first("telegram_state")).toBe("awaiting_config");
    expect(telegramTexts).toHaveLength(0);
    expect(await flushConsultantReports(offline, env.DB, { notify: () => ({ status: "sent" }), isTelegramConfigured })).toEqual({ flushed: 0 });
    const online = runtimeEnv();
    let notified = 0;
    const result = await flushConsultantReports(online, env.DB, { notify: async () => { notified += 1; return { status: "sent" }; }, isTelegramConfigured });
    expect(result).toEqual({ flushed: 1 });
    expect(notified).toBeGreaterThanOrEqual(1);
    expect(await env.DB.prepare("SELECT telegram_state FROM consultant_requests").first("telegram_state")).toBe("sent");
  });

  it("never lets the AI set a price: a summary with money is replaced and the numbers come from the tariff", async () => {
    const priced = runtimeEnv({ AI: { run: async () => ({ response: JSON.stringify({ summary: "هزینه این پروژه ۵ میلیون تومان است و در ۲ هفته تحویل می‌شود.", ambiguities: [] }) }) } });
    const result = await call("/api/consultant/estimate", { body: estimateBody({ consent: false }), currentEnv: priced });
    expect(result.body.summary.source).toBe("fallback");
    expect(result.body.summary.text).not.toMatch(/تومان|میلیون/u);
    const failing = runtimeEnv({ AI: { run: async () => { throw new Error("down"); } } });
    const down = await call("/api/consultant/estimate", { body: estimateBody({ consent: false }), currentEnv: failing });
    expect(down.status).toBe(200);
    expect(down.body.summary.source).toBe("fallback");
    expect(down.body.estimate.status).toBe("estimated");
  });

  it("interprets free text when AI is up, and answers null (not an error) when it is down", async () => {
    const up = runtimeEnv({ AI: { run: async () => ({ response: JSON.stringify({ projectType: "booking", goal: "booking", features: ["booking_calendar"], size: "s", style: "none", note: "" }) }) } });
    const ok = await call("/api/consultant/interpret", { body: { locale: "fa", text: "سالن زیبایی دارم و نوبت‌دهی آنلاین می‌خواهم" }, currentEnv: up });
    expect(ok.body.interpretation).toEqual({ projectType: "booking", goal: "booking", features: ["booking_calendar"], size: "s", style: null, note: null });
    const down = await call("/api/consultant/interpret", { body: { locale: "fa", text: "سلام" }, currentEnv: runtimeEnv({ AI: undefined }) });
    expect(down.status).toBe(200);
    expect(down.body.interpretation).toBeNull();
  });

  it("rejects other origins, bad payloads and too many requests", async () => {
    expect((await call("/api/consultant/estimate", { body: estimateBody(), headers: { origin: "https://evil.example" } })).status).toBe(403);
    expect((await call("/api/consultant/estimate", { body: { ...estimateBody(), extra: 1 } })).status).toBe(400);
    const badAnswers = await call("/api/consultant/estimate", { body: estimateBody({ answers: { ...answersFor.corporate(), projectType: "spaceship" } }) });
    expect(badAnswers.status).toBe(400);
    expect(badAnswers.body.error).toBe("invalid_answers");
    const limited = runtimeEnv({ CONSULTANT_ESTIMATE_IP_HOURLY_LIMIT: "2" });
    const statuses = [];
    for (let i = 0; i < 3; i += 1) statuses.push((await call("/api/consultant/estimate", { body: estimateBody({ consent: false }), currentEnv: limited, ip: "198.51.100.77" })).status);
    expect(statuses).toEqual([200, 200, 429]);
  });
});

describe("consultant admin", () => {
  beforeEach(async () => {
    await saveTariff(testTariff());
    mockTelegram();
  });

  it("lists, shows and updates requests only for a signed-in admin with CSRF", async () => {
    const created = await call("/api/consultant/estimate", { body: estimateBody({ answers: answersFor.platform() }) });
    const id = created.body.consultantId;
    expect((await call("/api/admin/consultant/requests", { method: "GET" })).status).toBe(401);
    const { cookie, csrf } = await adminSession();
    const list = await call("/api/admin/consultant/requests", { method: "GET", headers: { cookie } });
    expect(list.body.items[0]).toMatchObject({ id, status: "estimated", projectType: "پلتفرم یا وب‌اپلیکیشن اختصاصی" });
    expect(list.body.openTotal).toBe(1);
    const detail = await call(`/api/admin/consultant/requests/${id}`, { method: "GET", headers: { cookie } });
    expect(detail.body.item.estimate.tiers.professional.hours).toBeGreaterThan(0);
    expect(detail.body.item.scope.architecture.id).toBe("custom");
    expect((await call(`/api/admin/consultant/requests/${id}`, { body: { status: "contacted" }, headers: { cookie } })).status).toBe(403);
    const updated = await call(`/api/admin/consultant/requests/${id}`, { body: { status: "contacted" }, headers: { cookie, "x-csrf-token": csrf } });
    expect(updated.body.item.status).toBe("contacted");
    expect((await call(`/api/admin/consultant/requests/${id}`, { body: { status: "nonsense" }, headers: { cookie, "x-csrf-token": csrf } })).status).toBe(400);
  });

  it("tests the Telegram connection from the admin panel, and reports when it is not configured", async () => {
    const { cookie, csrf } = await adminSession();
    const sent = await call("/api/admin/consultant/telegram-test", { body: {}, headers: { cookie, "x-csrf-token": csrf } });
    expect(sent.body).toMatchObject({ configured: true, sent: true });
    expect(telegramTexts.at(-1)).toContain("پیام آزمایشی");
    const offline = runtimeEnv({ TELEGRAM_BOT_TOKEN: "" });
    const session = await adminSession(offline);
    const off = await call("/api/admin/consultant/telegram-test", { body: {}, headers: { cookie: session.cookie, "x-csrf-token": session.csrf }, currentEnv: offline });
    expect(off.body).toMatchObject({ configured: false, sent: false });
  });

  it("retention deletes expired requests and blanks contact details after the personal-data window", async () => {
    const created = await call("/api/consultant/estimate", { body: estimateBody() });
    await call(`/api/consultant/requests/${created.body.consultantId}`, { body: { updateToken: created.body.updateToken, action: "contact", name: "علی", contact: "info@example.com", consent: true } });
    await env.DB.prepare("UPDATE consultant_requests SET pii_expires_at = '2000-01-01T00:00:00.000Z'").run();
    await cleanupConsultantRequests(env.DB);
    const row = await env.DB.prepare("SELECT contact_name, contact_value FROM consultant_requests").first();
    expect(row).toEqual({ contact_name: null, contact_value: null });
    await env.DB.prepare("UPDATE consultant_requests SET expires_at = '2000-01-01T00:00:00.000Z'").run();
    await cleanupConsultantRequests(env.DB);
    expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM consultant_requests").first("n")).toBe(0);
  });
});
