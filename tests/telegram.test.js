import { createExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import worker from "../worker/index.js";
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
  return { ...env, ...TELEGRAM_ENV, ...overrides };
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
  return worker.fetch(new Request("https://example.com/api/webhooks/telegram", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-telegram-bot-api-secret-token": secret,
    },
    body: JSON.stringify(body),
  }), currentEnv, createExecutionContext());
}

function mockTelegram(onMethod = () => {}) {
  network.use(http.post(/https:\/\/api\.telegram\.org\/bot[^/]+\/.+/u, ({ request }) => {
    onMethod(new URL(request.url).pathname.split("/").at(-1));
    return HttpResponse.json({ ok: true, result: { message_id: 1 } });
  }));
}

beforeEach(async () => {
  await env.DB.batch([
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
    let openAiCalls = 0;
    mockTelegram();
    network.use(http.post("https://api.openai.com/v1/responses", () => {
      openAiCalls += 1;
      return HttpResponse.json({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(validBundle()) }] }] });
    }));
    const id = `campaign_${crypto.randomUUID()}`;
    await insertGeneratedCampaign(id);
    const update = telegramUpdate(id, "regenerate", { updateId: 4, callbackId: "callback-regen" });
    await postTelegram(update);
    await postTelegram(update);
    expect(openAiCalls).toBe(1);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM content_items WHERE campaign_id = ?").bind(id).first("total")).toBe(2);
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
    network.use(http.post("https://api.openai.com/v1/responses", () => HttpResponse.json({
      status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(validBundle()) }] }],
    })));
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
    const response = await worker.fetch(new Request("https://example.com/api/sales/chat", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://example.com", "cf-connecting-ip": "203.0.113.90" },
      body: JSON.stringify({ conversationId: "conv_550e8400-e29b-41d4-a716-446655440090", locale: "fa", message: "سایت می‌خواهم" }),
    }), runtimeEnv(), createExecutionContext());
    expect(response.status).toBe(200);
    expect(sends).toBeGreaterThanOrEqual(1);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM telegram_notifications WHERE notification_type = 'lead_created'").first("total")).toBe(1);
  });
});
