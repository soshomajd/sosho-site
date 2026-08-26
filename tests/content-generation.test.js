import { createExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import worker from "../worker/index.js";
import {
  findContentPolicyViolation,
  validateContentBundle,
  validateCreateCampaignInput,
} from "../worker/content-generation.js";
import { network } from "./network.js";

function validBundle() {
  return {
    campaignTitle: "مسیر هوشمند رشد کسب‌وکار",
    targetAudience: "مدیران کسب‌وکارهای ایرانی",
    contentGoal: "آشنایی با طراحی سایت و اتوماسیون هوش مصنوعی",
    mainHook: "سایت شما می‌تواند بیشتر از یک ویترین باشد.",
    mainMessage: "طراحی سایت هدفمند در کنار اتوماسیون هوش مصنوعی فرایندهای تکراری را ساده‌تر می‌کند.",
    callToAction: "برای بررسی نیاز کسب‌وکار خود با ما گفتگو کنید.",
    reelScript: {
      durationSeconds: 20,
      scenes: [
        { visual: "نمای مدیر درگیر کارهای تکراری", dialogue: "زمان تیم شما کجا صرف می‌شود؟" },
        { visual: "نمای سایت و گردش کار", dialogue: "سایت و اتوماسیون را یکپارچه طراحی کنید." },
      ],
    },
    storyFrames: Array.from({ length: 3 }, (_, index) => ({
      headline: `فریم ${index + 1}`,
      body: "یک پیام روشن برای کسب‌وکار",
      visual: "چیدمان مینیمال با جهت راست به چپ",
    })),
    carouselSlides: Array.from({ length: 5 }, (_, index) => ({
      headline: `اسلاید ${index + 1}`,
      body: "توضیح کاربردی درباره سایت و اتوماسیون",
      visual: "تصویر ساده و حرفه‌ای",
    })),
    instagramCaption: "سایت هدفمند، نقطه شروع یک فرایند دیجیتال منسجم است.",
    facebookCaption: "با ترکیب طراحی سایت و اتوماسیون، مسیر ارتباط با مخاطب را منسجم کنید.",
    linkedinPost: "برای مدیران B2B، وب‌سایت باید بخشی از فرایند عملیاتی و فروش باشد.",
    telegramPost: "طراحی سایت و اتوماسیون هوش مصنوعی می‌توانند کنار هم کار کنند.",
    youtubeTitle: "طراحی سایت در کنار اتوماسیون هوش مصنوعی",
    youtubeDescription: "در این ویدیو مسیر طراحی یک زیرساخت دیجیتال منسجم را مرور می‌کنیم.",
    threadsPost: "سایت خوب فقط زیبا نیست؛ باید در فرایند کسب‌وکار نقش داشته باشد.",
    hashtags: ["#طراحی_سایت", "#هوش_مصنوعی", "#اتوماسیون"],
    visualDirection: "مینیمال، حرفه‌ای، فارسی و مناسب چیدمان راست به چپ",
    voiceoverScript: "زمان تیم را از کارهای تکراری آزاد کنید و یک مسیر دیجیتال منسجم بسازید.",
    subtitles: [
      { startSecond: 0, endSecond: 10, text: "زمان تیم شما کجا صرف می‌شود؟" },
      { startSecond: 10, endSecond: 20, text: "سایت و اتوماسیون را یکپارچه کنید." },
    ],
  };
}

async function api(path, { method = "GET", body, token = "test-admin-token", runtimeEnv = env } = {}) {
  const headers = {};
  if (token !== null) headers.authorization = `Bearer ${token}`;
  if (body !== undefined) headers["content-type"] = "application/json";
  return worker.fetch(new Request(`https://example.com${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  }), runtimeEnv, createExecutionContext());
}

async function createCampaign(overrides = {}) {
  const response = await api("/api/content/campaigns", {
    method: "POST",
    body: {
      topic: "کاربرد طراحی سایت و هوش مصنوعی",
      targetAudience: "مدیران کسب‌وکار",
      goal: "افزایش آگاهی",
      language: "fa",
      ...overrides,
    },
  });
  return { response, payload: await response.json() };
}

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM content_items"),
    env.DB.prepare("DELETE FROM content_campaigns"),
  ]);
});

describe("content validation", () => {
  it("strictly validates campaign input", () => {
    expect(validateCreateCampaignInput({
      topic: "موضوع",
      targetAudience: "مخاطب",
      goal: "هدف",
      language: "fa",
      internalStatus: "generated",
    })).toMatchObject({ ok: false, issues: [{ path: "internalStatus", code: "unknown_field" }] });
  });

  it("validates the complete content bundle", () => {
    expect(validateContentBundle(validBundle())).toEqual({ ok: true, value: validBundle() });
    expect(validateContentBundle({ ...validBundle(), storyFrames: [] })).toEqual({
      ok: false,
      code: "invalid_story_frames",
    });
  });

  it("rejects fabricated claims before persistence", () => {
    const bundle = { ...validBundle(), mainMessage: "رشد ۹۰٪ را تضمین می‌کنیم." };
    expect(findContentPolicyViolation(bundle)).toBe("invented_statistic");
    expect(validateContentBundle(bundle)).toEqual({ ok: false, code: "invented_statistic" });
  });
});

describe("admin content campaign API", () => {
  it("creates and retrieves a draft campaign", async () => {
    const { response, payload } = await createCampaign();
    expect(response.status).toBe(201);
    expect(payload.campaign.status).toBe("draft");
    expect(payload.contentItem).toBeNull();
    const fetched = await api(`/api/content/campaigns/${payload.campaign.id}`);
    expect(fetched.status).toBe(200);
    expect((await fetched.json()).campaign.topic).toBe("کاربرد طراحی سایت و هوش مصنوعی");
  });

  it("rejects invalid input without writing a campaign", async () => {
    const { response } = await createCampaign({ language: "en", status: "generated" });
    expect(response.status).toBe(400);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM content_campaigns").first("total")).toBe(0);
  });

  it("prevents access without the admin token", async () => {
    const response = await api("/api/content/campaigns", {
      method: "POST",
      body: { topic: "موضوع", targetAudience: "مخاطب", goal: "هدف", language: "fa" },
      token: null,
    });
    expect(response.status).toBe(401);
    expect((await response.json()).error).toBe("unauthorized");
  });

  it("generates, validates, stores, and transitions the campaign", async () => {
    network.use(http.post("https://api.openai.com/v1/responses", () => HttpResponse.json({
      status: "completed",
      output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify(validBundle()) }] }],
    })));
    const { payload } = await createCampaign();
    const response = await api(`/api/content/campaigns/${payload.campaign.id}/generate`, { method: "POST" });
    const generated = await response.json();
    expect(response.status).toBe(200);
    expect(generated.campaign.status).toBe("generated");
    expect(generated.contentItem.validationStatus).toBe("valid");
    expect(generated.contentItem.content.reelScript.durationSeconds).toBe(20);
    expect((await api(`/api/content/campaigns/${payload.campaign.id}/generate`, { method: "POST" })).status).toBe(409);
  });

  it("returns configuration_missing and marks the campaign failed when OpenAI is absent", async () => {
    const { payload } = await createCampaign();
    const response = await api(`/api/content/campaigns/${payload.campaign.id}/generate`, {
      method: "POST",
      runtimeEnv: { ...env, OPENAI_API_KEY: "" },
    });
    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe("configuration_missing");
    expect(await env.DB.prepare("SELECT status FROM content_campaigns WHERE id = ?")
      .bind(payload.campaign.id).first("status")).toBe("failed");
  });

  it("keeps the existing sales chat contract working", async () => {
    network.use(http.post("https://api.openai.com/v1/responses", () => new HttpResponse(null, { status: 503 })));
    const response = await worker.fetch(new Request("https://example.com/api/sales/chat", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://example.com", "cf-connecting-ip": "198.51.100.77" },
      body: JSON.stringify({
        conversationId: "conv_550e8400-e29b-41d4-a716-446655440077",
        locale: "fa",
        message: "برای کسب‌وکارم سایت می‌خواهم",
      }),
    }), env, createExecutionContext());
    expect(response.status).toBe(200);
    expect((await response.json()).stage).toBe("discovery");
  });
});
