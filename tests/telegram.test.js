import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import worker, { retryFailedTelegramNotifications } from "../worker/index.js";
import {
  TelegramService,
  createCampaignCallbackData,
  splitTelegramText,
} from "../worker/telegram-service.js";
import { network } from "./network.js";

const TELEGRAM_ENV = {
  TELEGRAM_BOT_TOKEN: "test-telegram-token",
  TELEGRAM_ADMIN_CHAT_ID: "10001",
  TELEGRAM_ADMIN_USER_ID: "20002",
  TELEGRAM_WEBHOOK_SECRET: "test-webhook-secret",
  TELEGRAM_TIMEOUT_MS: "1000",
  TELEGRAM_MAX_ATTEMPTS: "2",
};

function runtimeEnv(overrides = {}) {
  return {
    ...env,
    ...TELEGRAM_ENV,
    CONTENT_AI_PROVIDER: "workers_ai",
    WORKERS_AI_CONTENT_MODEL: "@cf/qwen/qwen3-30b-a3b-fp8",
    WORKERS_AI_FALLBACK_MODEL: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    AI: { run: async () => ({ response: JSON.stringify(validBundle()) }) },
    ...overrides,
  };
}

function validBundle() {
  const card = (title) => ({ headline: title, body: "توضیح فارسی کاربردی", visual: "نمای حرفه‌ای راست به چپ" });
  return {
    campaignTitle: "کمپین طراحی سایت هوشمند",
    targetAudience: "مدیران کسب‌وکار ایرانی",
    contentGoal: "آگاهی درباره طراحی سایت و اتوماسیون",
    mainHook: "سایت شما می‌تواند بخشی از فرایند فروش باشد.",
    mainMessage: "طراحی سایت و اتوماسیون هوش مصنوعی یک مسیر منسجم می‌سازند.",
    callToAction: "برای بررسی نیاز خود گفتگو کنید.",
    reelScript: { durationSeconds: 20, scenes: [
      { visual: "نمای مدیر", dialogue: "کارهای تکراری را شناسایی کنید." },
      { visual: "نمای سایت", dialogue: "یک مسیر دیجیتال منسجم بسازید." },
    ] },
    storyFrames: [card("فریم اول"), card("فریم دوم"), card("فریم سوم")],
    carouselSlides: [card("اسلاید اول"), card("اسلاید دوم"), card("اسلاید سوم"), card("اسلاید چهارم"), card("اسلاید پنجم")],
    instagramCaption: "سایت هدفمند برای مسیر دیجیتال منسجم.",
    facebookCaption: "طراحی سایت را با فرایند کسب‌وکار هماهنگ کنید.",
    linkedinPost: "زیرساخت دیجیتال برای مدیران و کسب‌وکارهای B2B اهمیت دارد.",
    telegramPost: "سایت و اتوماسیون را یکپارچه ببینید.",
    youtubeTitle: "طراحی سایت و اتوماسیون هوش مصنوعی",
    youtubeDescription: "مروری فارسی بر ساخت زیرساخت دیجیتال منسجم.",
    threadsPost: "سایت خوب در فرایند کسب‌وکار نقش دارد.",
    hashtags: ["#طراحی_سایت", "#اتوماسیون", "#هوش_مصنوعی"],
    visualDirection: "مینیمال و مناسب چیدمان راست به چپ",
    voiceoverScript: "یک مسیر دیجیتال منسجم برای کسب‌وکار خود بسازید.",
    subtitles: [
      { startSecond: 0, endSecond: 10, text: "کارهای تکراری را شناسایی کنید." },
      { startSecond: 10, endSecond: 20, text: "یک مسیر دیجیتال منسجم بسازید." },
    ],
  };
}

async function insertGeneratedCampaign(id) {
  const timestamp = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO content_campaigns (
        id, topic, target_audience, goal, language, status, created_at, updated_at
      ) VALUES (?, 'موضوع', 'مدیران', 'آگاهی', 'fa', 'generated', ?, ?)`
    ).bind(id, timestamp, timestamp),
    env.DB.prepare(
      `INSERT INTO content_items (
        id, campaign_id, content_type, platform, content_json,
        validation_status, created_at, updated_at
      ) VALUES (?, ?, 'content_bundle', 'multi_platform', ?, 'valid', ?, ?)`
    ).bind(`content_${crypto.randomUUID()}`, id, JSON.stringify(validBundle()), timestamp, timestamp),
  ]);
}

function telegramUpdate(campaignId, action, { updateId = 1, callbackId = "callback-1", userId = 20002, chatId = 10001 } = {}) {
  return {
    update_id: updateId,
    callback_query: {
      id: callbackId,
      from: { id: userId },
      message: { chat: { id: chatId } },
      chat_instance: "instance",
      data: createCampaignCallbackData(action, campaignId),
    },
  };
}

async function postTelegram(body, { secret = "test-webhook-secret", currentEnv = runtimeEnv() } = {}) {
  const ctx = createExecutionContext();
  const response = await worker.fetch(new Request("https://example.com/api/webhooks/telegram", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-telegram-bot-api-secret-token": secret,
    },
    body: JSON.stringify(body),
  }), currentEnv, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

function mockTelegram(onMethod = () => {}) {
  network.use(http.post(/https:\/\/api\.telegram\.org\/bot[^/]+\/.+/u, ({ request }) => {
    onMethod(new URL(request.url).pathname.split("/").at(-1));
    return HttpResponse.json({ ok: true, result: { message_id: 1 } });
  }));
}

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM campaign_action_audit"),
    env.DB.prepare("DELETE FROM telegram_updates"),
    env.DB.prepare("DELETE FROM telegram_notifications"),
    env.DB.prepare("DELETE FROM content_items"),
    env.DB.prepare("DELETE FROM content_campaigns"),
    env.DB.prepare("DELETE FROM webhook_events"),
    env.DB.prepare("DELETE FROM messages"),
    env.DB.prepare("DELETE FROM conversations"),
    env.DB.prepare("DELETE FROM leads"),
    env.DB.prepare("DELETE FROM rate_limit_counters"),
  ]);
});

describe("Telegram service", () => {
  it("splits long messages safely and retries transient failures", async () => {
    expect(splitTelegramText("الف ".repeat(2000)).every((part) => part.length <= 3800)).toBe(true);
    let attempts = 0;
    const service = new TelegramService(runtimeEnv(), { fetcher: async () => {
      attempts += 1;
      if (attempts === 1) return new Response(null, { status: 503 });
      return Response.json({ ok: true, result: true });
    } });
    await expect(service.sendText("پیام", { requestId: "req_retry" })).resolves.toBe(true);
    expect(attempts).toBe(2);
  });

  it("enforces timeout and never logs the bot token", async () => {
    const spies = [vi.spyOn(console, "log"), vi.spyOn(console, "warn"), vi.spyOn(console, "error")];
    const service = new TelegramService(runtimeEnv({ TELEGRAM_MAX_ATTEMPTS: "1" }), {
      fetcher: (_url, init) => new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
      }),
    });
    await expect(service.sendText("پیام", { requestId: "req_timeout" })).rejects.toMatchObject({ code: "provider_timeout" });
    expect(spies.flatMap((spy) => spy.mock.calls).flat().join(" ")).not.toContain("test-telegram-token");
    spies.forEach((spy) => spy.mockRestore());
  });

  it("uploads a private image with multipart data and an inline keyboard", async () => {
    let submitted;
    const service = new TelegramService(runtimeEnv(), { fetcher: async (_url, init) => {
      submitted = init;
      return Response.json({ ok: true, result: { message_id: 12 } });
    } });
    const campaignId = `campaign_${crypto.randomUUID()}`;
    const result = await service.sendPhoto(
      { bytes: new Uint8Array([0xff, 0xd8, 0xff, 0xd9]), mimeType: "image/jpeg" },
      {
        caption: "Image preview",
        replyMarkup: {
          inline_keyboard: [[{
            text: "Approve",
            callback_data: createCampaignCallbackData("approve", campaignId),
          }]],
        },
        requestId: "req_photo",
      }
    );
    expect(result.message_id).toBe(12);
    expect(submitted.headers).toBeUndefined();
    expect(submitted.body).toBeInstanceOf(FormData);
    expect(submitted.body.get("chat_id")).toBe("10001");
    expect(submitted.body.get("caption")).toBe("Image preview");
    expect(submitted.body.get("photo")).toBeInstanceOf(Blob);
    expect(submitted.body.get("photo").type).toBe("image/jpeg");
    expect(JSON.parse(submitted.body.get("reply_markup")).inline_keyboard).toHaveLength(1);
  });
});

describe("Telegram webhook and campaign approval", () => {
  it("rejects an invalid webhook secret", async () => {
    const response = await postTelegram({}, { secret: "wrong" });
    expect(response.status).toBe(401);
  });

  it.each([{ userId: 999, chatId: 10001 }, { userId: 20002, chatId: 999 }])(
    "rejects unauthorized admin identity %#",
    async ({ userId, chatId }) => {
      const id = `campaign_${crypto.randomUUID()}`;
      const response = await postTelegram(telegramUpdate(id, "approve", { userId, chatId }));
      expect(response.status).toBe(403);
    }
  );

  it("approves and rejects generated campaigns", async () => {
    mockTelegram();
    const approvedId = `campaign_${crypto.randomUUID()}`;
    const rejectedId = `campaign_${crypto.randomUUID()}`;
    await insertGeneratedCampaign(approvedId);
    await insertGeneratedCampaign(rejectedId);
    expect((await postTelegram(telegramUpdate(approvedId, "approve"))).status).toBe(200);
    expect((await postTelegram(telegramUpdate(rejectedId, "reject", { updateId: 2, callbackId: "callback-2" }))).status).toBe(200);
    expect(await env.DB.prepare("SELECT approval_status FROM content_campaigns WHERE id = ?").bind(approvedId).first("approval_status")).toBe("approved");
    expect(await env.DB.prepare("SELECT approval_status FROM content_campaigns WHERE id = ?").bind(rejectedId).first("approval_status")).toBe("rejected");
  });

  it("deduplicates repeated updates and callbacks", async () => {
    let answers = 0;
    mockTelegram((method) => { if (method === "answerCallbackQuery") answers += 1; });
    const id = `campaign_${crypto.randomUUID()}`;
    await insertGeneratedCampaign(id);
    const update = telegramUpdate(id, "approve");
    expect((await postTelegram(update)).status).toBe(200);
    const duplicate = await postTelegram(update);
    expect((await duplicate.json()).duplicate).toBe(true);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM telegram_updates").first("total")).toBe(1);
    expect(answers).toBe(2);
  });

  it("regenerates only once for the same callback", async () => {
    let workersAiCalls = 0;
    mockTelegram();
    const currentEnv = runtimeEnv({
      AI: { run: async () => {
        workersAiCalls += 1;
        return { response: JSON.stringify(validBundle()) };
      } },
    });
    const id = `campaign_${crypto.randomUUID()}`;
    await insertGeneratedCampaign(id);
    const update = telegramUpdate(id, "regenerate", { updateId: 4, callbackId: "callback-regen" });
    await postTelegram(update, { currentEnv });
    await postTelegram(update, { currentEnv });
    expect(workersAiCalls).toBe(1);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM content_items WHERE campaign_id = ?").bind(id).first("total")).toBe(2);
  });

  it("shares transition rules between Dashboard and Telegram", async () => {
    mockTelegram();
    const id = `campaign_${crypto.randomUUID()}`;
    await insertGeneratedCampaign(id);
    const login = await worker.fetch(new Request("https://example.com/api/admin/session", {
      method: "POST",
      headers: { origin: "https://example.com", "content-type": "application/json" },
      body: JSON.stringify({ token: "test-admin-token" }),
    }), env, createExecutionContext());
    const session = await login.json();
    const cookie = login.headers.get("set-cookie").split(";")[0];
    const approved = await worker.fetch(new Request(
      `https://example.com/api/admin/campaigns/${id}/approve`,
      {
        method: "POST",
        headers: {
          origin: "https://example.com",
          cookie,
          "content-type": "application/json",
          "idempotency-key": crypto.randomUUID(),
          "x-csrf-token": session.csrfToken,
        },
        body: "{}",
      }
    ), env, createExecutionContext());
    expect(approved.status).toBe(200);

    const telegramReject = telegramUpdate(id, "reject", {
      updateId: 91,
      callbackId: "callback-after-dashboard",
    });
    expect((await postTelegram(telegramReject)).status).toBe(200);
    expect(await env.DB.prepare(
      "SELECT approval_status FROM content_campaigns WHERE id = ?"
    ).bind(id).first("approval_status")).toBe("approved");
    expect(await env.DB.prepare(
      "SELECT status FROM telegram_updates WHERE update_id = '91'"
    ).first("status")).toBe("failed");
  });

  it("200-acks a well-formed update it does not handle instead of retry-storming", async () => {
    const response = await postTelegram({ update_id: 5001, message: { text: "سلام" } });
    expect(response.status).toBe(200);
    expect((await response.json()).ignored).toBe(true);
  });

  it("still 400s a payload that is not a Telegram update", async () => {
    const response = await postTelegram({ not_an_update: true });
    expect(response.status).toBe(400);
  });

  it("defers Telegram regenerate so the webhook returns before generation finishes", async () => {
    let workersAiCalls = 0;
    mockTelegram();
    const currentEnv = runtimeEnv({
      AI: { run: async () => {
        workersAiCalls += 1;
        return { response: JSON.stringify(validBundle()) };
      } },
    });
    const id = `campaign_${crypto.randomUUID()}`;
    await insertGeneratedCampaign(id);
    const response = await postTelegram(
      telegramUpdate(id, "regenerate", { updateId: 77, callbackId: "callback-defer" }),
      { currentEnv }
    );
    expect(response.status).toBe(200);
    // postTelegram drains ctx.waitUntil, so the background job has finished here.
    expect(workersAiCalls).toBe(1);
    expect(await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM content_items WHERE campaign_id = ?"
    ).bind(id).first("total")).toBe(2);
    expect(await env.DB.prepare(
      "SELECT outcome FROM campaign_action_audit WHERE operation_key = 'telegram:77'"
    ).first("outcome")).toBe("succeeded");
  });

  it("re-drives a failed Telegram notification from its stored payload", async () => {
    let sends = 0;
    network.use(http.post(/https:\/\/api\.telegram\.org\/bot[^/]+\/.+/u, () => {
      sends += 1;
      return HttpResponse.json({ ok: true, result: { message_id: 1 } });
    }));
    const past = new Date(Date.now() - 60_000).toISOString();
    await env.DB.prepare(
      `INSERT INTO telegram_notifications (
        event_key, notification_type, entity_id, status, attempt_count,
        message_text, keyboard_json, next_retry_at, created_at, updated_at
      ) VALUES ('sales:handoff:conv-x', 'handoff', 'lead-x', 'failed', 1, 'نیاز به پیگیری انسانی', NULL, ?, ?, ?)`
    ).bind(past, past, past).run();
    const result = await retryFailedTelegramNotifications(runtimeEnv(), "req-retry");
    expect(result.retried).toBe(1);
    expect(sends).toBe(1);
    expect(await env.DB.prepare(
      "SELECT status FROM telegram_notifications WHERE event_key = 'sales:handoff:conv-x'"
    ).first("status")).toBe("sent");
  });

  it("works as optional integration when Telegram is not configured", async () => {
    const response = await postTelegram({}, { currentEnv: env });
    expect(response.status).toBe(503);
  });
});

describe("Telegram outbound integration", () => {
  it("sends a content preview after generation", async () => {
    let sends = 0;
    mockTelegram((method) => { if (method === "sendMessage") sends += 1; });
    const currentEnv = runtimeEnv();
    const created = await worker.fetch(new Request("https://example.com/api/content/campaigns", {
      method: "POST",
      headers: { authorization: "Bearer test-admin-token", "content-type": "application/json" },
      body: JSON.stringify({ topic: "موضوع", targetAudience: "مدیران", goal: "آگاهی", language: "fa" }),
    }), currentEnv, createExecutionContext());
    const id = (await created.json()).campaign.id;
    const generated = await worker.fetch(new Request(`https://example.com/api/content/campaigns/${id}/generate`, {
      method: "POST", headers: { authorization: "Bearer test-admin-token" },
    }), currentEnv, createExecutionContext());
    expect(generated.status).toBe(200);
    expect(sends).toBe(1);
    expect(await env.DB.prepare("SELECT status FROM telegram_notifications WHERE entity_id = ?").bind(id).first("status")).toBe("sent");
  });

  it("sends a deduplicated new-lead notification without breaking sales chat", async () => {
    let sends = 0;
    mockTelegram((method) => { if (method === "sendMessage") sends += 1; });
    network.use(http.post("https://api.openai.com/v1/responses", () => new HttpResponse(null, { status: 503 })));
    const ctx = createExecutionContext();
    const response = await worker.fetch(new Request("https://example.com/api/sales/chat", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://example.com", "cf-connecting-ip": "203.0.113.90" },
      body: JSON.stringify({ conversationId: "conv_550e8400-e29b-41d4-a716-446655440090", locale: "fa", message: "سایت می‌خواهم" }),
    }), runtimeEnv(), ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);
    expect(sends).toBeGreaterThanOrEqual(1);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM telegram_notifications WHERE notification_type = 'lead_created'").first("total")).toBe(1);
  });
});
