import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import worker from "../worker/index.js";
import { network } from "./network.js";

const timestamp = "2026-09-01T08:00:00.000Z";

function conversationId(value) {
  return `conv_550e8400-e29b-41d4-a716-44665545${value.toString().padStart(4, "0")}`;
}

async function postChat(id, message, runtimeEnv = env) {
  const ctx = createExecutionContext();
  const response = await worker.fetch(new Request("https://example.com/api/sales/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.com",
      "cf-connecting-ip": "203.0.113.55",
    },
    body: JSON.stringify({ conversationId: id, locale: "fa", message }),
  }), runtimeEnv, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

async function seedConversation(id, state = "ai_active") {
  const leadId = `lead_${crypto.randomUUID()}`;
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO leads (
        id, source, locale, status, requirements_json, created_at, updated_at
      ) VALUES (?, 'website', 'fa', 'discovery', '{}', ?, ?)`
    ).bind(leadId, timestamp, timestamp),
    env.DB.prepare(
      `INSERT INTO conversations (
        id, lead_id, channel, status, handoff_state, created_at, updated_at
      ) VALUES (?, ?, 'website', 'active', ?, ?, ?)`
    ).bind(id, leadId, state, timestamp, timestamp),
  ]);
  return leadId;
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

async function takeOver(id, { session, csrfToken = session?.csrfToken, key = crypto.randomUUID() } = {}) {
  return worker.fetch(new Request(
    `https://example.com/api/admin/conversations/${encodeURIComponent(id)}/take-over`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://example.com",
        ...(session?.cookie ? { cookie: session.cookie } : {}),
        ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
        "idempotency-key": key,
      },
      body: "{}",
    }
  ), env, createExecutionContext());
}

function handoffModelResponse() {
  return {
    reply: "درخواست شما به مدیر ارجاع شد.",
    stage: "handoff",
    projectType: "corporate",
    recommendedTier: "professional",
    extracted: {
      businessName: null,
      businessActivity: null,
      goal: null,
      pagesAndFeatures: null,
      designStyle: null,
      contentStatus: null,
      languages: null,
      budgetToman: null,
      deadline: null,
      contactName: null,
      phone: null,
      preferredChannel: null,
    },
    missingFields: [],
    quickReplies: [],
    isComplete: false,
    confidence: 0.4,
  };
}

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM conversation_action_audit"),
    env.DB.prepare("DELETE FROM telegram_notifications"),
    env.DB.prepare("DELETE FROM webhook_events"),
    env.DB.prepare("DELETE FROM messages"),
    env.DB.prepare("DELETE FROM conversations"),
    env.DB.prepare("DELETE FROM leads"),
    env.DB.prepare("DELETE FROM rate_limit_counters"),
  ]);
});

describe("conversation human handoff", () => {
  it("moves a direct human request to handoff_requested", async () => {
    const id = conversationId(1);
    const response = await postChat(id, "می‌خواهم با یک انسان صحبت کنم");
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ stage: "handoff", conversationId: id });
    expect(await env.DB.prepare(
      "SELECT handoff_state FROM conversations WHERE id = ?"
    ).bind(id).first("handoff_state")).toBe("handoff_requested");
    expect(await env.DB.prepare(
      "SELECT role FROM messages WHERE conversation_id = ?"
    ).bind(id).first("role")).toBe("user");
  });

  it("still returns the acknowledgement when two tabs trigger handoff on the same conversation", async () => {
    const id = conversationId(11);
    await seedConversation(id, "ai_active");
    const responses = await Promise.all([
      postChat(id, "می‌خواهم با یک انسان صحبت کنم"),
      postChat(id, "لطفا من را به یک انسان وصل کنید"),
    ]);
    for (const response of responses) {
      expect(response.status).toBe(200);
      expect((await response.json()).stage).toBe("handoff");
    }
    expect(await env.DB.prepare(
      "SELECT handoff_state FROM conversations WHERE id = ?"
    ).bind(id).first("handoff_state")).toBe("handoff_requested");
    expect(await env.DB.prepare(
      `SELECT COUNT(*) AS total FROM conversation_action_audit
       WHERE conversation_id = ? AND outcome = 'succeeded'`
    ).bind(id).first("total")).toBe(1);
  });

  it("uses the Sales Chat handoff result as a server-side trigger", async () => {
    let modelCalls = 0;
    network.use(http.post("https://api.openai.com/v1/responses", () => {
      modelCalls += 1;
      return HttpResponse.json({
        status: "completed",
        output: [{ type: "message", content: [{
          type: "output_text",
          text: JSON.stringify(handoffModelResponse()),
        }] }],
      });
    }));
    const id = conversationId(2);
    const response = await postChat(id, "سوال من نیاز به تصمیم مدیریتی دارد");
    expect(response.status).toBe(200);
    expect(modelCalls).toBe(1);
    expect(await env.DB.prepare(
      "SELECT handoff_state FROM conversations WHERE id = ?"
    ).bind(id).first("handoff_state")).toBe("handoff_requested");
    expect(await env.DB.prepare(
      "SELECT actor_type FROM conversation_action_audit WHERE conversation_id = ?"
    ).bind(id).first("actor_type")).toBe("sales_service");
  });

  it("pauses AI and still stores every new user message", async () => {
    const id = conversationId(3);
    await seedConversation(id, "handoff_requested");
    let modelCalls = 0;
    network.use(http.post("https://api.openai.com/v1/responses", () => {
      modelCalls += 1;
      return new HttpResponse(null, { status: 500 });
    }));
    const response = await postChat(id, "این پیام جدید را برای مدیر ذخیره کن");
    expect(response.status).toBe(200);
    expect((await response.json()).stage).toBe("handoff");
    expect(modelCalls).toBe(0);
    expect(await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM messages WHERE conversation_id = ? AND role = 'user'"
    ).bind(id).first("total")).toBe(1);
    expect(await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM messages WHERE conversation_id = ? AND role = 'assistant'"
    ).bind(id).first("total")).toBe(0);
  });

  it("sends the Telegram handoff notification only once", async () => {
    const id = conversationId(4);
    await seedConversation(id);
    let sends = 0;
    network.use(http.post(/https:\/\/api\.telegram\.org\/bot[^/]+\/.+/u, () => {
      sends += 1;
      return HttpResponse.json({ ok: true, result: { message_id: sends } });
    }));
    const runtimeEnv = {
      ...env,
      TELEGRAM_BOT_TOKEN: "test-telegram-token",
      TELEGRAM_ADMIN_CHAT_ID: "10001",
      TELEGRAM_TIMEOUT_MS: "1000",
      TELEGRAM_MAX_ATTEMPTS: "1",
    };
    expect((await postChat(id, "لطفا من را به اپراتور وصل کنید", runtimeEnv)).status).toBe(200);
    expect((await postChat(id, "پیام دوم برای مدیر", runtimeEnv)).status).toBe(200);
    expect(sends).toBe(1);
    expect(await env.DB.prepare(
      `SELECT COUNT(*) AS total FROM telegram_notifications
       WHERE notification_type = 'handoff' AND entity_id IS NOT NULL`
    ).first("total")).toBe(1);
  });

  it("shows handoff_requested conversations as Needs attention", async () => {
    const id = conversationId(5);
    await seedConversation(id, "handoff_requested");
    const response = await worker.fetch(new Request(
      "https://example.com/api/admin/conversations?handoff=true",
      { headers: { authorization: "Bearer test-admin-token", origin: "https://example.com" } }
    ), env, createExecutionContext());
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      items: [{ id, handoffState: "handoff_requested", needsAttention: true, aiStatus: "paused" }],
    });
  });

  it("takes over a waiting conversation with a valid session and CSRF token", async () => {
    const id = conversationId(6);
    await seedConversation(id, "handoff_requested");
    const session = await adminSession();
    const response = await takeOver(id, { session });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      operation: { action: "take_over", outcome: "succeeded", duplicate: false },
      conversation: { handoffState: "human_active", needsAttention: false },
      allowedActions: { takeOver: false },
    });
    expect(await env.DB.prepare(
      `SELECT handoff_state, human_owner_key, human_taken_over_at
       FROM conversations WHERE id = ?`
    ).bind(id).first()).toMatchObject({
      handoff_state: "human_active",
      human_owner_key: "admin_session",
    });
  });

  it("allows only one concurrent Take over to own the transition", async () => {
    const id = conversationId(7);
    await seedConversation(id, "handoff_requested");
    const session = await adminSession();
    const responses = await Promise.all([
      takeOver(id, { session }),
      takeOver(id, { session }),
    ]);
    expect(responses.map((response) => response.status).sort()).toEqual([200, 409]);
    expect(await env.DB.prepare(
      `SELECT COUNT(*) AS total FROM conversation_action_audit
       WHERE conversation_id = ? AND action = 'take_over' AND outcome = 'succeeded'`
    ).bind(id).first("total")).toBe(1);
    expect(await env.DB.prepare(
      "SELECT human_owner_key FROM conversations WHERE id = ?"
    ).bind(id).first("human_owner_key")).toBe("admin_session");
  });

  it("rejects Take over without a session or with invalid CSRF", async () => {
    const id = conversationId(8);
    await seedConversation(id, "handoff_requested");
    const unauthorized = await takeOver(id);
    expect(unauthorized.status).toBe(401);
    const session = await adminSession();
    const invalidCsrf = await takeOver(id, { session, csrfToken: "invalid" });
    expect(invalidCsrf.status).toBe(403);
    expect(await env.DB.prepare(
      "SELECT handoff_state FROM conversations WHERE id = ?"
    ).bind(id).first("handoff_state")).toBe("handoff_requested");
  });

  it("rejects and audits an invalid Take over transition", async () => {
    const id = conversationId(9);
    await seedConversation(id, "ai_active");
    const session = await adminSession();
    const response = await takeOver(id, { session });
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ error: "invalid_conversation_transition" });
    expect(await env.DB.prepare(
      `SELECT action, actor_type, from_state, to_state, outcome, error_code
       FROM conversation_action_audit WHERE conversation_id = ?`
    ).bind(id).first()).toMatchObject({
      action: "take_over",
      actor_type: "dashboard",
      from_state: "handoff_requested",
      to_state: "human_active",
      outcome: "failed",
      error_code: "invalid_conversation_transition",
    });
  });

  it("audits the handoff and Take over transition with safe actors and timestamps", async () => {
    const id = conversationId(10);
    await seedConversation(id);
    await postChat(id, "با مدیر صحبت کنم لطفا");
    const session = await adminSession();
    expect((await takeOver(id, { session })).status).toBe(200);
    const rows = await env.DB.prepare(
      `SELECT action, actor_type, actor_key, from_state, to_state,
              status, outcome, created_at, completed_at
       FROM conversation_action_audit WHERE conversation_id = ? ORDER BY created_at ASC`
    ).bind(id).all();
    expect(rows.results).toHaveLength(2);
    expect(rows.results[0]).toMatchObject({
      action: "request_handoff",
      actor_type: "sales_user",
      actor_key: "conversation_user",
      from_state: "ai_active",
      to_state: "handoff_requested",
      status: "completed",
      outcome: "succeeded",
    });
    expect(rows.results[1]).toMatchObject({
      action: "take_over",
      actor_type: "dashboard",
      actor_key: "admin_session",
      from_state: "handoff_requested",
      to_state: "human_active",
      status: "completed",
      outcome: "succeeded",
    });
    expect(rows.results.every((row) => row.created_at && row.completed_at)).toBe(true);
  });
});
