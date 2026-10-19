import { createExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";

import { validateContactMessageInput } from "../worker/core.js";
import worker, { runRetentionCleanup } from "../worker/index.js";

const validMessage = {
  name: "سارا احمدی",
  contact: "09120000000",
  message: "سلام، برای طراحی یک فروشگاه اینترنتی مشاوره می‌خواهم.",
  locale: "fa",
};

let ipCounter = 0;

function postContact(body, { ip, origin = "https://example.com", runtimeEnv = env } = {}) {
  ipCounter += 1;
  const headers = {
    "content-type": "application/json",
    "cf-connecting-ip": ip ?? `198.51.100.${ipCounter}`,
  };
  if (origin) headers.origin = origin;
  return worker.fetch(new Request("https://example.com/api/contact", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }), runtimeEnv, createExecutionContext());
}

async function adminApi(path, { method = "GET", body, session, origin = "https://example.com" } = {}) {
  const headers = { accept: "application/json", origin };
  if (session) {
    headers.cookie = session.cookie;
    if (session.csrfToken && method !== "GET") headers["x-csrf-token"] = session.csrfToken;
  } else {
    headers.authorization = "Bearer test-admin-token";
  }
  if (body !== undefined) headers["content-type"] = "application/json";
  return worker.fetch(new Request(`https://example.com${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  }), env, createExecutionContext());
}

async function adminSession() {
  const response = await worker.fetch(new Request("https://example.com/api/admin/session", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://example.com" },
    body: JSON.stringify({ token: "test-admin-token" }),
  }), env, createExecutionContext());
  const payload = await response.json();
  return {
    cookie: response.headers.get("set-cookie").split(";")[0],
    csrfToken: payload.csrfToken,
  };
}

async function storedMessages() {
  const result = await env.DB.prepare(
    "SELECT * FROM contact_messages ORDER BY created_at ASC"
  ).all();
  return result.results;
}

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM contact_messages"),
    env.DB.prepare("DELETE FROM rate_limit_counters"),
  ]);
});

describe("validateContactMessageInput", () => {
  it("accepts a name, an email or phone, and a message", () => {
    expect(validateContactMessageInput(validMessage).ok).toBe(true);
    expect(validateContactMessageInput({
      ...validMessage,
      contact: "sara@example.com",
      locale: "en",
    }).ok).toBe(true);
    expect(validateContactMessageInput({
      ...validMessage,
      contact: "+98 912 026 5102",
    }).ok).toBe(true);
    expect(validateContactMessageInput({
      ...validMessage,
      contact: "۰۹۱۲۰۰۰۰۰۰۰",
    }).ok).toBe(true);
  });

  it("rejects unknown fields, bad contacts, and short or oversized text", () => {
    const rejected = [
      { ...validMessage, source: "instagram" },
      { ...validMessage, contact: "not-a-contact" },
      { ...validMessage, contact: "12345" },
      { ...validMessage, name: "س" },
      { ...validMessage, message: "کوتاه" },
      { ...validMessage, message: "x".repeat(2001) },
      { ...validMessage, locale: "de" },
      { ...validMessage, company: 42 },
    ];
    for (const input of rejected) {
      expect(validateContactMessageInput(input).ok).toBe(false);
    }
    expect(validateContactMessageInput("nope").ok).toBe(false);
  });

  it("flags the honeypot field as spam without failing validation", () => {
    const result = validateContactMessageInput({ ...validMessage, company: "ACME" });
    expect(result.ok).toBe(true);
    expect(result.spam).toBe(true);
    expect(validateContactMessageInput({ ...validMessage, company: "" }).spam).toBe(false);
  });
});

describe("POST /api/contact", () => {
  it("stores a valid message as new", async () => {
    const response = await postContact(validMessage);
    expect(response.status).toBe(201);
    const payload = await response.json();
    expect(payload.received).toBe(true);
    expect(payload.requestId).toBeTruthy();
    const rows = await storedMessages();
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: validMessage.name,
      contact: validMessage.contact,
      message: validMessage.message,
      locale: "fa",
      status: "new",
    });
    expect(rows[0].id).toMatch(/^contact_[0-9a-f-]{36}$/u);
    expect(Date.parse(rows[0].expires_at)).toBeGreaterThan(Date.now());
  });

  it("answers a honeypot hit like a success but stores nothing", async () => {
    const response = await postContact({ ...validMessage, company: "Spam Inc" });
    expect(response.status).toBe(201);
    expect(await storedMessages()).toHaveLength(0);
  });

  it("rejects invalid input with 400 and stores nothing", async () => {
    const response = await postContact({ ...validMessage, contact: "xx" });
    expect(response.status).toBe(400);
    expect((await response.json()).error).toBe("invalid_request");
    expect(await storedMessages()).toHaveLength(0);
  });

  it("rejects disallowed origins and non-JSON bodies", async () => {
    const forbidden = await postContact(validMessage, { origin: "https://evil.example" });
    expect(forbidden.status).toBe(403);
    const wrongType = await worker.fetch(new Request("https://example.com/api/contact", {
      method: "POST",
      headers: { "content-type": "text/plain", origin: "https://example.com" },
      body: "hello",
    }), env, createExecutionContext());
    expect(wrongType.status).toBe(415);
    expect(await storedMessages()).toHaveLength(0);
  });

  it("rate limits repeated submissions from one address", async () => {
    const limited = { ...env, CONTACT_IP_HOURLY_LIMIT: "2" };
    const statuses = [];
    for (let index = 0; index < 3; index += 1) {
      statuses.push((await postContact(validMessage, { ip: "203.0.113.9", runtimeEnv: limited })).status);
    }
    expect(statuses).toEqual([201, 201, 429]);
    expect(await storedMessages()).toHaveLength(2);
  });

  it("fails closed with 503 when the database is unavailable", async () => {
    const response = await postContact(validMessage, { runtimeEnv: { ...env, DB: undefined } });
    expect(response.status).toBe(503);
  });
});

describe("admin contact messages", () => {
  async function seed(overrides = {}) {
    const id = `contact_${crypto.randomUUID()}`;
    const timestamp = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO contact_messages (
        id, name, contact, message, locale, status, created_at, updated_at, expires_at
      ) VALUES (?, ?, ?, ?, 'fa', ?, ?, ?, ?)`
    ).bind(
      id,
      overrides.name ?? validMessage.name,
      validMessage.contact,
      validMessage.message,
      overrides.status ?? "new",
      overrides.createdAt ?? timestamp,
      timestamp,
      new Date(Date.now() + 86_400_000).toISOString()
    ).run();
    return id;
  }

  it("requires admin authentication to list messages", async () => {
    const response = await worker.fetch(
      new Request("https://example.com/api/admin/contact-messages", {
        headers: { accept: "application/json" },
      }),
      env,
      createExecutionContext()
    );
    expect(response.status).toBe(401);
  });

  it("lists messages newest first with a status filter and new count", async () => {
    await seed({ name: "قدیمی", createdAt: "2026-01-01T00:00:00.000Z" });
    await seed({ name: "جدید", createdAt: "2026-02-01T00:00:00.000Z" });
    await seed({ name: "بایگانی", status: "archived", createdAt: "2026-03-01T00:00:00.000Z" });

    const all = await (await adminApi("/api/admin/contact-messages")).json();
    expect(all.items.map((item) => item.name)).toEqual(["بایگانی", "جدید", "قدیمی"]);
    expect(all.newTotal).toBe(2);
    expect(all.items[0]).toMatchObject({ contact: validMessage.contact, message: validMessage.message });

    const onlyNew = await (await adminApi("/api/admin/contact-messages?status=new")).json();
    expect(onlyNew.items.map((item) => item.name)).toEqual(["جدید", "قدیمی"]);
    expect(onlyNew.pagination.total).toBe(2);

    const invalid = await adminApi("/api/admin/contact-messages?status=bogus");
    expect(invalid.status).toBe(400);
  });

  it("changes status only with a session, CSRF token, and allowed origin", async () => {
    const id = await seed();
    const session = await adminSession();

    const noCsrf = await adminApi(`/api/admin/contact-messages/${id}`, {
      method: "POST",
      body: { status: "read" },
      session: { cookie: session.cookie },
    });
    expect(noCsrf.status).toBe(403);

    const badOrigin = await adminApi(`/api/admin/contact-messages/${id}`, {
      method: "POST",
      body: { status: "read" },
      session,
      origin: "https://evil.example",
    });
    expect(badOrigin.status).toBe(403);

    const bearerOnly = await adminApi(`/api/admin/contact-messages/${id}`, {
      method: "POST",
      body: { status: "read" },
    });
    expect([401, 403]).toContain(bearerOnly.status);

    expect((await storedMessages())[0].status).toBe("new");
  });

  it("marks messages read and replied and stamps the timestamps once", async () => {
    const id = await seed();
    const session = await adminSession();

    const read = await adminApi(`/api/admin/contact-messages/${id}`, {
      method: "POST",
      body: { status: "read" },
      session,
    });
    expect(read.status).toBe(200);
    const readItem = (await read.json()).item;
    expect(readItem.status).toBe("read");
    expect(readItem.readAt).toBeTruthy();
    expect(readItem.repliedAt).toBeNull();

    const replied = await adminApi(`/api/admin/contact-messages/${id}`, {
      method: "POST",
      body: { status: "replied" },
      session,
    });
    const repliedItem = (await replied.json()).item;
    expect(repliedItem.status).toBe("replied");
    expect(repliedItem.readAt).toBe(readItem.readAt);
    expect(repliedItem.repliedAt).toBeTruthy();

    const archived = await adminApi(`/api/admin/contact-messages/${id}`, {
      method: "POST",
      body: { status: "archived" },
      session,
    });
    expect((await archived.json()).item.status).toBe("archived");
  });

  it("rejects bad ids, bad status values, extra fields, and unknown messages", async () => {
    const id = await seed();
    const session = await adminSession();
    const post = (path, body) => adminApi(path, { method: "POST", body, session });

    expect((await post("/api/admin/contact-messages/not-an-id", { status: "read" })).status).toBe(400);
    expect((await post(`/api/admin/contact-messages/${id}`, { status: "deleted" })).status).toBe(400);
    expect((await post(`/api/admin/contact-messages/${id}`, { status: "read", extra: 1 })).status).toBe(400);
    expect((await post(`/api/admin/contact-messages/contact_${crypto.randomUUID()}`, { status: "read" })).status).toBe(404);
  });

  it("deletes expired messages during retention cleanup", async () => {
    const keepId = await seed({ name: "نگه‌داری" });
    const expiredId = await seed({ name: "منقضی" });
    await env.DB.prepare("UPDATE contact_messages SET expires_at = ? WHERE id = ?")
      .bind("2020-01-01T00:00:00.000Z", expiredId)
      .run();

    await runRetentionCleanup(env, "req_test");

    const ids = (await storedMessages()).map((row) => row.id);
    expect(ids).toContain(keepId);
    expect(ids).not.toContain(expiredId);
  });
});
