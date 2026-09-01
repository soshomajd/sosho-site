import { createExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it, vi } from "vitest";

import worker from "../worker/index.js";

const timestamp = "2026-08-31T10:00:00.000Z";

async function api(path, {
  method = "GET",
  body,
  token = "test-admin-token",
  cookie,
  csrfToken,
  idempotencyKey,
  origin = "https://example.com",
  runtimeEnv = env,
} = {}) {
  const headers = { accept: "application/json", origin };
  if (token !== null) headers.authorization = `Bearer ${token}`;
  if (cookie) headers.cookie = cookie;
  if (csrfToken) headers["x-csrf-token"] = csrfToken;
  if (idempotencyKey) headers["idempotency-key"] = idempotencyKey;
  if (body !== undefined) headers["content-type"] = "application/json";
  return worker.fetch(new Request(`https://example.com${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  }), runtimeEnv, createExecutionContext());
}

async function adminSession() {
  const response = await api("/api/admin/session", {
    method: "POST",
    token: null,
    body: { token: "test-admin-token" },
  });
  const payload = await response.json();
  return {
    cookie: response.headers.get("set-cookie").split(";")[0],
    csrfToken: payload.csrfToken,
  };
}

function operationKey() {
  return crypto.randomUUID();
}

async function insertLead({
  id,
  source = "website",
  status = "discovery",
  projectType = null,
  budget = null,
  requirements = {},
  instagramUserId = null,
  updatedAt = timestamp,
}) {
  await env.DB.prepare(
    `INSERT INTO leads (
      id, source, locale, instagram_user_id, status, project_type, budget,
      requirements_json, created_at, updated_at
    ) VALUES (?, ?, 'fa', ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    source,
    instagramUserId,
    status,
    projectType,
    budget,
    JSON.stringify(requirements),
    timestamp,
    updatedAt
  ).run();
}

async function insertCampaign({ id, status = "draft", approvalStatus = "pending", topic = "موضوع" }) {
  await env.DB.prepare(
    `INSERT INTO content_campaigns (
      id, topic, target_audience, goal, language, status, created_at, updated_at,
      approval_status
    ) VALUES (?, ?, 'مدیران کسب‌وکار', 'آگاهی از خدمات', 'fa', ?, ?, ?, ?)`
  ).bind(id, topic, status, timestamp, timestamp, approvalStatus).run();
}

function validBundle() {
  return {
    campaignTitle: "کمپین طراحی سایت هوشمند",
    targetAudience: "مدیران کسب‌وکارهای ایرانی",
    contentGoal: "معرفی طراحی سایت و اتوماسیون هوش مصنوعی",
    mainHook: "سایت شما می‌تواند بخشی از فرایند فروش باشد.",
    mainMessage: "طراحی سایت هدفمند و اتوماسیون هوش مصنوعی مسیر ارتباط را منسجم می‌کند.",
    callToAction: "برای بررسی نیاز کسب‌وکار خود گفتگو کنید.",
    reelScript: {
      durationSeconds: 20,
      scenes: [
        { visual: "نمای فرایند کاری", dialogue: "فرایندهای تکراری را بهتر مدیریت کنید." },
        { visual: "نمای رابط سایت", dialogue: "سایت و اتوماسیون را یکپارچه ببینید." },
      ],
    },
    storyFrames: Array.from({ length: 3 }, (_, index) => ({
      headline: `فریم ${index + 1}`,
      body: "پیام کاربردی برای مدیران",
      visual: "چیدمان مینیمال راست به چپ",
    })),
    carouselSlides: Array.from({ length: 5 }, (_, index) => ({
      headline: `اسلاید ${index + 1}`,
      body: "توضیح طراحی سایت و اتوماسیون",
      visual: "تصویر حرفه‌ای و ساده",
    })),
    instagramCaption: "سایت هدفمند نقطه شروع یک مسیر دیجیتال منسجم است.",
    facebookCaption: "طراحی سایت و اتوماسیون را در یک مسیر منسجم ببینید.",
    linkedinPost: "برای مدیران B2B، وب‌سایت بخشی از زیرساخت فروش و عملیات است.",
    telegramPost: "سایت و اتوماسیون هوش مصنوعی می‌توانند هماهنگ کار کنند.",
    youtubeTitle: "طراحی سایت و اتوماسیون هوش مصنوعی",
    youtubeDescription: "در این ویدیو مسیر ساخت زیرساخت دیجیتال را مرور می‌کنیم.",
    threadsPost: "سایت خوب فقط زیبا نیست؛ باید در فرایند کسب‌وکار نقش داشته باشد.",
    hashtags: ["#طراحی_سایت", "#هوش_مصنوعی", "#اتوماسیون"],
    visualDirection: "مینیمال، حرفه‌ای و مناسب چیدمان راست به چپ",
    voiceoverScript: "یک مسیر دیجیتال منسجم برای کسب‌وکار خود بسازید.",
    subtitles: [
      { startSecond: 0, endSecond: 10, text: "سایت شما بخشی از فرایند فروش است." },
      { startSecond: 10, endSecond: 20, text: "طراحی و اتوماسیون را یکپارچه کنید." },
    ],
  };
}

async function campaignAction(campaignId, action, {
  session,
  body = {},
  key = operationKey(),
  runtimeEnv = env,
  csrfToken = session?.csrfToken,
  cookie = session?.cookie,
  origin = "https://example.com",
} = {}) {
  return api(`/api/admin/campaigns/${campaignId}/${action}`, {
    method: "POST",
    token: null,
    body,
    cookie,
    csrfToken,
    idempotencyKey: key,
    origin,
    runtimeEnv,
  });
}

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM conversation_action_audit"),
    env.DB.prepare("DELETE FROM campaign_action_audit"),
    env.DB.prepare("DELETE FROM content_media"),
    env.DB.prepare("DELETE FROM content_items"),
    env.DB.prepare("DELETE FROM content_campaigns"),
    env.DB.prepare("DELETE FROM messages"),
    env.DB.prepare("DELETE FROM conversations"),
    env.DB.prepare("DELETE FROM leads"),
    env.DB.prepare("DELETE FROM rate_limit_counters"),
  ]);
});

describe("admin dashboard authentication", () => {
  it("prevents unauthorized dashboard access", async () => {
    const response = await api("/api/admin/overview", { token: null });
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: "unauthorized" });
  });

  it("exchanges the admin token for an opaque secure session cookie", async () => {
    const response = await api("/api/admin/session", {
      method: "POST",
      token: null,
      body: { token: "test-admin-token" },
    });
    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("sosho_admin_session=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Strict");
    expect(setCookie).toContain("Secure");
    expect(setCookie).not.toContain("test-admin-token");
    const sessionPayload = await response.json();
    expect(sessionPayload.csrfToken).toMatch(/^[A-Za-z0-9_-]+$/u);
    expect(JSON.stringify(sessionPayload)).not.toContain("test-admin-token");

    const cookie = setCookie.split(";")[0];
    const authenticated = await api("/api/admin/overview", { token: null, cookie });
    expect(authenticated.status).toBe(200);
  });

  it("strictly validates login input", async () => {
    const response = await api("/api/admin/session", {
      method: "POST",
      token: null,
      body: { token: "test-admin-token", remember: true },
    });
    expect(response.status).toBe(400);
  });
});

describe("admin overview and campaign reads", () => {
  it("returns real overview counts and recent activities", async () => {
    await insertCampaign({ id: "campaign_draft", status: "draft" });
    await insertCampaign({ id: "campaign_generated", status: "generated", approvalStatus: "approved" });
    await insertCampaign({ id: "campaign_failed", status: "failed", approvalStatus: "rejected" });
    await insertLead({ id: "lead_active" });
    await insertLead({ id: "lead_handoff", status: "handoff" });
    await env.DB.prepare(
      "INSERT INTO conversations (id, lead_id, channel, status, created_at, updated_at) VALUES ('conv_admin_1', 'lead_active', 'website', 'active', ?, ?)"
    ).bind(timestamp, timestamp).run();
    await env.DB.prepare(
      `INSERT INTO conversations (
        id, lead_id, channel, status, handoff_state, handoff_requested_at,
        created_at, updated_at
      ) VALUES ('conv_admin_handoff', 'lead_handoff', 'website', 'active',
        'handoff_requested', ?, ?, ?)`
    ).bind(timestamp, timestamp, timestamp).run();

    const response = await api("/api/admin/overview");
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.campaigns).toEqual({
      total: 3,
      draft: 1,
      generating: 0,
      generated: 1,
      approved: 1,
      rejected: 1,
      failed: 1,
    });
    expect(payload.leads).toBe(2);
    expect(payload.activeConversations).toBe(2);
    expect(payload.humanHandoffs).toBe(1);
    expect(payload.recentActivities.length).toBeGreaterThan(0);
  });

  it("returns a complete empty state without fabricated data", async () => {
    const response = await api("/api/admin/overview");
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      campaigns: { total: 0, draft: 0, generating: 0, generated: 0, approved: 0, rejected: 0, failed: 0 },
      leads: 0,
      activeConversations: 0,
      humanHandoffs: 0,
      recentActivities: [],
    });
  });

  it("paginates and filters campaign statuses with bounded queries", async () => {
    await insertCampaign({ id: "campaign_a", status: "draft", topic: "الف" });
    await insertCampaign({ id: "campaign_b", status: "draft", topic: "ب" });
    await insertCampaign({ id: "campaign_c", status: "generated", approvalStatus: "approved" });

    const response = await api("/api/admin/campaigns?status=draft&page=2&limit=1");
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.items).toHaveLength(1);
    expect(payload.items[0].status).toBe("draft");
    expect(payload.pagination).toMatchObject({ page: 2, pageSize: 1, total: 2, totalPages: 2 });

    expect((await api("/api/admin/campaigns?limit=51")).status).toBe(400);
    expect((await api("/api/admin/campaigns?unknown=true")).status).toBe(400);
  });

  it("reports the R2 activation blocker without failing campaign reads", async () => {
    await insertCampaign({ id: "campaign_r2", status: "generated", approvalStatus: "approved" });
    const response = await api("/api/admin/campaigns", {
      runtimeEnv: { ...env, MEDIA: undefined },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      mediaCapability: "activation_required",
      items: [{ id: "campaign_r2", media: null }],
    });
  });
});

describe("safe lead and conversation reads", () => {
  it("does not expose full contact data in lead responses", async () => {
    await insertLead({
      id: "lead_private_12345678",
      source: "instagram",
      status: "qualification",
      projectType: "corporate",
      budget: "professional",
      instagramUserId: "sensitive-instagram-id",
      requirements: {
        contactName: "نام مدیر",
        phone: "+98 912 123 4567",
        email: "private@example.com",
      },
    });
    const response = await api("/api/admin/leads?source=instagram&status=qualification");
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toContain("نام مدیر");
    expect(text).not.toContain("+98 912 123 4567");
    expect(text).not.toContain("private@example.com");
    expect(text).not.toContain("sensitive-instagram-id");
    expect(text).not.toContain("requirements");
  });

  it("returns conversation AI and handoff state with redacted details", async () => {
    await insertLead({ id: "lead_handoff", status: "handoff" });
    await env.DB.prepare(
      `INSERT INTO conversations (
        id, lead_id, channel, status, handoff_state, handoff_requested_at,
        created_at, updated_at
      ) VALUES ('conv_admin_detail', 'lead_handoff', 'website', 'active',
        'handoff_requested', ?, ?, ?)`
    ).bind(timestamp, timestamp, timestamp).run();
    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO messages (id, conversation_id, role, content, metadata_json, created_at) VALUES ('msg_1', 'conv_admin_detail', 'user', ?, '{}', ?)"
      ).bind("شماره من +98 912 123 4567 و ایمیل private@example.com است", timestamp),
      env.DB.prepare(
        "INSERT INTO messages (id, conversation_id, role, content, metadata_json, created_at) VALUES ('msg_2', 'conv_admin_detail', 'assistant', 'پیام دریافت شد', ?, ?)"
      ).bind(JSON.stringify({ stage: "handoff", phone: "should-not-pass" }), "2026-08-31T10:01:00.000Z"),
    ]);

    const list = await api("/api/admin/conversations?handoff=true&limit=10&page=1");
    expect(list.status).toBe(200);
    expect(await list.json()).toMatchObject({
      items: [{
        id: "conv_admin_detail",
        humanHandoff: true,
        needsAttention: true,
        handoffState: "handoff_requested",
        aiStatus: "paused",
        messageCount: 2,
      }],
    });

    const detail = await api("/api/admin/conversations/conv_admin_detail");
    expect(detail.status).toBe(200);
    const text = await detail.text();
    expect(text).toContain("[contact hidden]");
    expect(text).toContain("[email hidden]");
    expect(text).not.toContain("+98 912 123 4567");
    expect(text).not.toContain("private@example.com");
    expect(text).not.toContain("should-not-pass");
  });
});

describe("secure campaign management actions", () => {
  it("requires an admin session for every write action", async () => {
    const id = `campaign_${crypto.randomUUID()}`;
    await insertCampaign({ id, status: "generated" });
    const response = await campaignAction(id, "approve", {
      csrfToken: "not-a-session-token",
      key: operationKey(),
    });
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: "unauthorized" });
    const bearerOnly = await api(`/api/admin/campaigns/${id}/approve`, {
      method: "POST",
      body: {},
      csrfToken: "not-a-session-token",
      idempotencyKey: operationKey(),
    });
    expect(bearerOnly.status).toBe(401);
  });

  it("rejects a missing or invalid CSRF token", async () => {
    const id = `campaign_${crypto.randomUUID()}`;
    await insertCampaign({ id, status: "generated" });
    const session = await adminSession();
    const response = await campaignAction(id, "approve", {
      session,
      csrfToken: "invalid-csrf-token",
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ error: "invalid_csrf" });
  });

  it("requires an allowed Origin and JSON Content-Type", async () => {
    const id = `campaign_${crypto.randomUUID()}`;
    await insertCampaign({ id, status: "generated" });
    const session = await adminSession();
    const wrongOrigin = await campaignAction(id, "approve", {
      session,
      origin: "https://attacker.example",
    });
    expect(wrongOrigin.status).toBe(403);
    expect(await wrongOrigin.json()).toMatchObject({ error: "origin_not_allowed" });

    const plainText = await worker.fetch(new Request(
      `https://example.com/api/admin/campaigns/${id}/approve`,
      {
        method: "POST",
        headers: {
          origin: "https://example.com",
          cookie: session.cookie,
          "content-type": "text/plain",
          "idempotency-key": operationKey(),
          "x-csrf-token": session.csrfToken,
        },
        body: "{}",
      }
    ), env, createExecutionContext());
    expect(plainText.status).toBe(415);
    expect(await plainText.json()).toMatchObject({ error: "unsupported_media_type" });
  });

  it("approves once and returns the same result for the same idempotency key", async () => {
    const id = `campaign_${crypto.randomUUID()}`;
    await insertCampaign({ id, status: "generated" });
    const session = await adminSession();
    const key = operationKey();
    const first = await campaignAction(id, "approve", { session, key });
    const second = await campaignAction(id, "approve", { session, key });
    expect(first.status).toBe(200);
    expect(await first.json()).toMatchObject({
      operation: { action: "approve", outcome: "succeeded", duplicate: false },
      campaign: { approvalStatus: "approved" },
    });
    expect(second.status).toBe(200);
    expect(await second.json()).toMatchObject({
      operation: { action: "approve", outcome: "succeeded", duplicate: true },
      campaign: { approvalStatus: "approved" },
    });
    expect(await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM campaign_action_audit WHERE campaign_id = ?"
    ).bind(id).first("total")).toBe(1);
  });

  it("rejects with one validated reason and records a safe audit event", async () => {
    const id = `campaign_${crypto.randomUUID()}`;
    await insertCampaign({ id, status: "generated" });
    const session = await adminSession();
    const key = operationKey();
    const response = await campaignAction(id, "reject", {
      session,
      body: { reason: "نیاز به بازنویسی دعوت به اقدام" },
      key,
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      campaign: {
        approvalStatus: "rejected",
        rejectionReason: "نیاز به بازنویسی دعوت به اقدام",
      },
    });
    const duplicate = await campaignAction(id, "reject", {
      session,
      body: { reason: "نیاز به بازنویسی دعوت به اقدام" },
      key,
    });
    expect(duplicate.status).toBe(200);
    expect(await duplicate.json()).toMatchObject({
      operation: { action: "reject", outcome: "succeeded", duplicate: true },
      campaign: { approvalStatus: "rejected" },
    });
    expect(await env.DB.prepare(
      `SELECT action, actor_type, actor_key, outcome, reason
       FROM campaign_action_audit WHERE campaign_id = ?`
    ).bind(id).first()).toMatchObject({
      action: "reject",
      actor_type: "dashboard",
      actor_key: "admin_session",
      outcome: "succeeded",
      reason: "نیاز به بازنویسی دعوت به اقدام",
    });
  });

  it("rejects an empty reason and HTML injection", async () => {
    const id = `campaign_${crypto.randomUUID()}`;
    await insertCampaign({ id, status: "generated" });
    const session = await adminSession();
    const missing = await campaignAction(id, "reject", { session, body: {} });
    const empty = await campaignAction(id, "reject", { session, body: { reason: "" } });
    const html = await campaignAction(id, "reject", {
      session,
      body: { reason: "<img src=x onerror=alert(1)>" },
    });
    expect(missing.status).toBe(400);
    expect(await missing.json()).toMatchObject({ error: "invalid_rejection_reason" });
    expect(empty.status).toBe(400);
    expect(await empty.json()).toMatchObject({ error: "invalid_rejection_reason" });
    expect(html.status).toBe(400);
    expect(await html.json()).toMatchObject({ error: "invalid_rejection_reason" });
    expect(await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM campaign_action_audit WHERE campaign_id = ?"
    ).bind(id).first("total")).toBe(0);
  });

  it("regenerates text, stores actual provider/model, and resets approval", async () => {
    const id = `campaign_${crypto.randomUUID()}`;
    await insertCampaign({ id, status: "generated", approvalStatus: "rejected" });
    const session = await adminSession();
    const run = vi.fn(async () => ({ response: JSON.stringify(validBundle()) }));
    const response = await campaignAction(id, "regenerate", {
      session,
      runtimeEnv: { ...env, AI: { run } },
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      operation: { action: "regenerate", outcome: "succeeded" },
      campaign: { status: "generated", approvalStatus: "pending" },
      contentItem: {
        provider: "workers_ai",
        model: "@cf/qwen/qwen3-30b-a3b-fp8",
      },
    });
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("prevents concurrent regenerate jobs", async () => {
    const id = `campaign_${crypto.randomUUID()}`;
    await insertCampaign({ id, status: "generated" });
    const session = await adminSession();
    let release;
    let markStarted;
    const started = new Promise((resolve) => { markStarted = resolve; });
    const run = vi.fn(() => {
      markStarted();
      return new Promise((resolve) => {
        release = () => resolve({ response: JSON.stringify(validBundle()) });
      });
    });
    const runtimeEnv = { ...env, AI: { run } };
    const firstPromise = campaignAction(id, "regenerate", { session, runtimeEnv });
    await started;
    const second = await campaignAction(id, "regenerate", { session, runtimeEnv });
    expect(second.status).toBe(409);
    expect(await second.json()).toMatchObject({ error: "invalid_campaign_state" });
    release();
    expect((await firstPromise).status).toBe(200);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid state transitions and audits the result", async () => {
    const id = `campaign_${crypto.randomUUID()}`;
    await insertCampaign({ id, status: "draft" });
    const session = await adminSession();
    const response = await campaignAction(id, "approve", { session });
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ error: "invalid_campaign_state" });
    expect(await env.DB.prepare(
      "SELECT outcome, error_code FROM campaign_action_audit WHERE campaign_id = ?"
    ).bind(id).first()).toMatchObject({
      outcome: "failed",
      error_code: "invalid_campaign_state",
    });
  });

  it("returns safe full campaign details without Telegram identifiers", async () => {
    const id = `campaign_${crypto.randomUUID()}`;
    await insertCampaign({ id, status: "generated" });
    await env.DB.prepare(
      `INSERT INTO content_items (
        id, campaign_id, content_type, platform, content_json, validation_status,
        provider, model, created_at, updated_at
      ) VALUES (?, ?, 'content_bundle', 'multi_platform', ?, 'valid', ?, ?, ?, ?)`
    ).bind(
      `content_${crypto.randomUUID()}`,
      id,
      JSON.stringify(validBundle()),
      "workers_ai",
      "@cf/qwen/qwen3-30b-a3b-fp8",
      timestamp,
      timestamp
    ).run();
    const response = await api(`/api/admin/campaigns/${id}`, {
      runtimeEnv: { ...env, MEDIA: undefined },
    });
    expect(response.status).toBe(200);
    const text = await response.text();
    const payload = JSON.parse(text);
    expect(payload).toMatchObject({
      campaign: { id, status: "generated" },
      contentItem: {
        provider: "workers_ai",
        model: "@cf/qwen/qwen3-30b-a3b-fp8",
        content: { campaignTitle: "کمپین طراحی سایت هوشمند" },
      },
      mediaCapability: "activation_required",
      allowedActions: { approve: true, reject: true, regenerate: true },
    });
    expect(text).not.toContain("approvalTelegramUserId");
    expect(text).not.toContain("approvalCallbackId");
  });
});
