import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import worker, { consumeRateLimit, processDueWebhookRetries } from "../worker/index.js";
import { network } from "./network.js";

const GRAPH_URL = "https://graph.instagram.com/:version/me/messages";

function conversationId(value) {
  return `conv_550e8400-e29b-41d4-a716-44665544${value.toString().padStart(4, "0")}`;
}

function mockOpenAiFailure() {
  network.use(http.post("https://api.openai.com/v1/responses", () => new HttpResponse(null, { status: 503 })));
}

async function postChat(id, message = "I need a website", ip = "203.0.113.10") {
  const ctx = createExecutionContext();
  const response = await worker.fetch(
    new Request("https://example.com/api/sales/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://example.com",
        "cf-connecting-ip": ip,
      },
      body: JSON.stringify({ conversationId: id, locale: "en", message }),
    }),
    env,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return response;
}

async function signMetaBody(body) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("test-meta-secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return `sha256=${[...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}`;
}

async function postWebhook(eventId, senderId = "ig-user-1") {
  const body = JSON.stringify({
    object: "instagram",
    entry: [
      {
        messaging: [
          {
            sender: { id: senderId },
            message: { mid: eventId, text: "برای کسب‌وکارم سایت می‌خواهم" },
          },
        ],
      },
    ],
  });
  const ctx = createExecutionContext();
  const response = await worker.fetch(
    new Request("https://example.com/api/meta/webhook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hub-signature-256": await signMetaBody(body),
      },
      body,
    }),
    env,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return response;
}

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM webhook_events"),
    env.DB.prepare("DELETE FROM messages"),
    env.DB.prepare("DELETE FROM conversations"),
    env.DB.prepare("DELETE FROM leads"),
    env.DB.prepare("DELETE FROM rate_limit_counters"),
  ]);
});

describe("website sales API", () => {
  it("increments shared quota counters atomically", async () => {
    const options = {
      key: "openai:global:test",
      limit: 2,
      windowSeconds: 3600,
      currentTimeMs: 1_800_000_000_000,
    };
    expect((await consumeRateLimit(env.DB, options)).allowed).toBe(true);
    expect((await consumeRateLimit(env.DB, options)).allowed).toBe(true);
    expect((await consumeRateLimit(env.DB, options)).allowed).toBe(false);
  });

  it("rejects client-owned internal fields before writing data", async () => {
    const ctx = createExecutionContext();
    const response = await worker.fetch(
      new Request("https://example.com/api/sales/chat", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://example.com" },
        body: JSON.stringify({
          conversationId: conversationId(1),
          locale: "en",
          message: "Hello",
          source: "instagram",
          externalUserId: "forged",
          messageCount: 99,
        }),
      }),
      env,
      ctx
    );
    expect(response.status).toBe(400);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM leads").first("total")).toBe(0);
  });

  it("stores a lead and continues the same conversation", async () => {
    mockOpenAiFailure();
    const id = conversationId(2);
    const first = await postChat(id);
    const second = await postChat(id, "It should sell products");
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect((await first.json()).conversationId).toBe(id);
    expect((await second.json()).conversationId).toBe(id);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM leads").first("total")).toBe(1);
    expect(
      await env.DB.prepare("SELECT COUNT(*) AS total FROM conversations").first("total")
    ).toBe(1);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM messages").first("total")).toBe(4);
  });

  it("enforces the IP limit before creating another lead", async () => {
    mockOpenAiFailure();
    const id = conversationId(3);
    expect((await postChat(id)).status).toBe(200);
    expect((await postChat(id, "Second")).status).toBe(200);
    expect((await postChat(conversationId(30), "Third")).status).toBe(429);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM leads").first("total")).toBe(1);
  });

  it("enforces the conversation limit independently of IP", async () => {
    mockOpenAiFailure();
    const id = conversationId(31);
    expect((await postChat(id, "First", "203.0.113.31")).status).toBe(200);
    expect((await postChat(id, "Second", "203.0.113.32")).status).toBe(200);
    expect((await postChat(id, "Third", "203.0.113.33")).status).toBe(429);
  });

  it("retries OpenAI and accepts a policy-safe structured response", async () => {
    let calls = 0;
    network.use(
      http.post("https://api.openai.com/v1/responses", () => {
        calls += 1;
        if (calls === 1) return new HttpResponse(null, { status: 503 });
        return HttpResponse.json({
          status: "completed",
          output: [
            {
              type: "message",
              content: [
                {
                  type: "output_text",
                  text: JSON.stringify({
                    reply: "Which features do you need?",
                    stage: "qualification",
                    projectType: "corporate",
                    recommendedTier: "professional",
                    extracted: {
                      businessName: null,
                      businessActivity: null,
                      goal: "Brand presence",
                      pagesAndFeatures: null,
                      designStyle: null,
                      contentStatus: null,
                      languages: "English",
                      budgetToman: null,
                      deadline: null,
                      contactName: null,
                      phone: null,
                      preferredChannel: null,
                    },
                    missingFields: ["pagesAndFeatures"],
                    quickReplies: ["Contact form"],
                    isComplete: false,
                    confidence: 0.8,
                  }),
                },
              ],
            },
          ],
        });
      })
    );
    const response = await postChat(conversationId(4));
    expect(response.status).toBe(200);
    expect((await response.json()).reply).toBe("Which features do you need?");
    expect(calls).toBe(2);
  });

  it("reports real readiness and adds a request id", async () => {
    const ctx = createExecutionContext();
    const response = await worker.fetch(
      new Request("https://example.com/api/health"),
      { ...env, AI: { run: async () => ({ response: "{}" }) } },
      ctx
    );
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.ready).toBe(true);
    expect(payload.checks.database).toBe(true);
    expect(payload.checks.migrations).toBe(true);
    expect(payload.checks.contentAi).toBe(true);
    expect(payload.checks.workersAi).toBe(true);
    expect(response.headers.get("x-request-id")).toBe(payload.requestId);
  });

  it("stays ready on staging when ArvanCloud media storage is deliberately unconfigured", async () => {
    const ctx = createExecutionContext();
    const response = await worker.fetch(
      new Request("https://example.com/api/health"),
      {
        ...env,
        ENVIRONMENT: "staging",
        ARVAN_S3_ACCESS_KEY: undefined,
        AI: { run: async () => ({ response: "{}" }) },
      },
      ctx
    );
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.ready).toBe(true);
    expect(payload.checks.mediaStorage).toBe(false);
    expect(payload.missing).not.toContain("MEDIA");
  });
});

describe("Instagram webhook", () => {
  it("rate-limits each Instagram user", async () => {
    mockOpenAiFailure();
    let sends = 0;
    network.use(
      http.post(GRAPH_URL, () => {
        sends += 1;
        return HttpResponse.json({ message_id: `reply-${sends}` });
      })
    );
    await postWebhook("event-rate-1", "ig-rate-limited");
    await postWebhook("event-rate-2", "ig-rate-limited");
    await postWebhook("event-rate-3", "ig-rate-limited");
    expect(sends).toBe(2);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM leads").first("total")).toBe(1);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM messages").first("total")).toBe(4);
  });

  it("deduplicates a successfully processed event", async () => {
    mockOpenAiFailure();
    let sends = 0;
    network.use(
      http.post(GRAPH_URL, () => {
        sends += 1;
        return HttpResponse.json({ recipient_id: "ig-user-1", message_id: "reply-1" });
      })
    );
    expect((await postWebhook("event-1")).status).toBe(200);
    expect((await postWebhook("event-1")).status).toBe(200);
    expect(sends).toBe(1);
    expect(
      await env.DB.prepare("SELECT COUNT(*) AS total FROM webhook_events").first("total")
    ).toBe(1);
    expect(
      await env.DB.prepare("SELECT status FROM webhook_events WHERE external_event_id = ?")
        .bind("event-1")
        .first("status")
    ).toBe("processed");
  });

  it("retries failed delivery without duplicating the sales turn", async () => {
    mockOpenAiFailure();
    let sends = 0;
    network.use(
      http.post(GRAPH_URL, () => {
        sends += 1;
        return new HttpResponse(null, { status: 503 });
      })
    );
    await postWebhook("event-retry", "ig-retry");
    const failed = await env.DB.prepare(
      "SELECT status, response_text FROM webhook_events WHERE external_event_id = 'event-retry'"
    ).first();
    expect(failed.status).toBe("failed");
    expect(failed.response_text).toBeTruthy();
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM messages").first("total")).toBe(2);

    await env.DB.prepare(
      `UPDATE webhook_events
       SET next_retry_at = '2000-01-01T00:00:00.000Z', response_text = NULL
       WHERE external_event_id = 'event-retry'`
    ).run();
    network.use(http.post(GRAPH_URL, () => HttpResponse.json({ message_id: "reply-ok" })));
    await processDueWebhookRetries(env, "req_test_retry");

    expect(
      await env.DB.prepare("SELECT status FROM webhook_events WHERE external_event_id = 'event-retry'")
        .first("status")
    ).toBe("processed");
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM messages").first("total")).toBe(2);
    expect(sends).toBe(2);
  });

  it("reuses an existing lead when it has no active conversation", async () => {
    mockOpenAiFailure();
    network.use(http.post(GRAPH_URL, () => HttpResponse.json({ message_id: "reply-existing" })));
    const createdAt = new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO leads (
          id, source, locale, instagram_user_id, status, requirements_json,
          created_at, updated_at, pii_expires_at
        ) VALUES ('lead-existing', 'instagram', 'fa', 'ig-existing', 'discovery', '{}', ?, ?, ?)`
      ).bind(createdAt, createdAt, "2099-01-01T00:00:00.000Z"),
      env.DB.prepare(
        `INSERT INTO conversations (id, lead_id, channel, status, created_at, updated_at)
         VALUES ('conv-old', 'lead-existing', 'instagram', 'closed', ?, ?)`
      ).bind(createdAt, createdAt),
    ]);
    await postWebhook("event-existing", "ig-existing");
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM leads").first("total")).toBe(1);
    expect(
      await env.DB.prepare(
        "SELECT COUNT(*) AS total FROM conversations WHERE lead_id = 'lead-existing' AND status = 'active'"
      ).first("total")
    ).toBe(1);
  });
});
