import { createExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import worker from "../worker/index.js";
import {
  CONTENT_BUNDLE_SCHEMA,
  OpenAiContentProvider,
  findContentPolicyViolation,
  validateContentBundle,
  validateCreateCampaignInput,
} from "../worker/content-generation.js";
import {
  DEFAULT_WORKERS_AI_CONTENT_MODEL,
  DEFAULT_WORKERS_AI_FALLBACK_MODEL,
} from "../worker/workers-ai-content-provider.js";
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

function workersAiRuntime(run, overrides = {}) {
  return {
    ...env,
    CONTENT_AI_PROVIDER: "workers_ai",
    WORKERS_AI_CONTENT_MODEL: DEFAULT_WORKERS_AI_CONTENT_MODEL,
    WORKERS_AI_FALLBACK_MODEL: DEFAULT_WORKERS_AI_FALLBACK_MODEL,
    AI: { run },
    ...overrides,
  };
}

function qwenOutput(bundle) {
  return {
    choices: [{ message: { role: "assistant", content: JSON.stringify(bundle) } }],
  };
}

function englishBundle() {
  const map = (value) => {
    if (typeof value === "string") return value.startsWith("#") ? "#website" : "English content";
    if (Array.isArray(value)) return value.map(map);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, map(item)]));
    }
    return value;
  };
  return map(validBundle());
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

  it("requires Persian content in the content bundle", () => {
    expect(validateContentBundle({ ...validBundle(), facebookCaption: "English content" })).toEqual({
      ok: false,
      code: "persian_content_required",
    });
    expect(validateContentBundle(englishBundle())).toEqual({
      ok: false,
      code: "persian_content_required",
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
    const run = vi.fn(async () => qwenOutput(validBundle()));
    const { payload } = await createCampaign();
    const response = await api(`/api/content/campaigns/${payload.campaign.id}/generate`, {
      method: "POST",
      runtimeEnv: workersAiRuntime(run),
    });
    const generated = await response.json();
    expect(response.status).toBe(200);
    expect(generated.campaign.status).toBe("generated");
    expect(generated.contentItem.validationStatus).toBe("valid");
    expect(generated.contentItem.content.reelScript.durationSeconds).toBe(20);
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0]).toBe(DEFAULT_WORKERS_AI_CONTENT_MODEL);
    expect(run.mock.calls[0][1].response_format).toEqual({
      type: "json_schema",
      json_schema: CONTENT_BUNDLE_SCHEMA,
    });
    expect((await api(`/api/content/campaigns/${payload.campaign.id}/generate`, {
      method: "POST",
      runtimeEnv: workersAiRuntime(run),
    })).status).toBe(409);
  });

  it("uses the fallback model once after invalid primary output", async () => {
    const run = vi.fn(async (model) => model === DEFAULT_WORKERS_AI_CONTENT_MODEL
      ? { response: "not-json" }
      : { response: JSON.stringify(validBundle()) });
    const { payload } = await createCampaign();
    const response = await api(`/api/content/campaigns/${payload.campaign.id}/generate`, {
      method: "POST",
      runtimeEnv: workersAiRuntime(run),
    });
    expect(response.status).toBe(200);
    expect(run.mock.calls.map(([model]) => model)).toEqual([
      DEFAULT_WORKERS_AI_CONTENT_MODEL,
      DEFAULT_WORKERS_AI_FALLBACK_MODEL,
    ]);
  });

  it("fails safely when both Workers AI models fail", async () => {
    const run = vi.fn(async (model) => {
      if (model === DEFAULT_WORKERS_AI_CONTENT_MODEL) return { response: "not-json" };
      throw Object.assign(new Error("sensitive upstream failure"), { status: 503 });
    });
    const { payload } = await createCampaign();
    const response = await api(`/api/content/campaigns/${payload.campaign.id}/generate`, {
      method: "POST",
      runtimeEnv: workersAiRuntime(run),
    });
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ error: "content_generation_failed" });
    expect(run).toHaveBeenCalledTimes(2);
    expect(await env.DB.prepare("SELECT status FROM content_campaigns WHERE id = ?")
      .bind(payload.campaign.id).first("status")).toBe("failed");
  });

  it("does not call OpenAI while Workers AI is selected", async () => {
    let openAiCalls = 0;
    network.use(http.post("https://api.openai.com/v1/responses", () => {
      openAiCalls += 1;
      return new HttpResponse(null, { status: 403 });
    }));
    const run = vi.fn(async () => qwenOutput(validBundle()));
    const { payload } = await createCampaign();
    const response = await api(`/api/content/campaigns/${payload.campaign.id}/generate`, {
      method: "POST",
      runtimeEnv: workersAiRuntime(run, { OPENAI_API_KEY: "unused-openai-key" }),
    });
    expect(response.status).toBe(200);
    expect(openAiCalls).toBe(0);
  });

  it("accepts a zero-byte generate body while rejecting actual content", async () => {
    const run = vi.fn(async () => qwenOutput(validBundle()));
    const emptyBodyCampaign = await createCampaign();
    const emptyBodyResponse = await worker.fetch(new Request(
      `https://example.com/api/content/campaigns/${emptyBodyCampaign.payload.campaign.id}/generate`,
      {
        method: "POST",
        headers: { authorization: "Bearer test-admin-token" },
        body: "",
      }
    ), workersAiRuntime(run), createExecutionContext());
    expect(emptyBodyResponse.status).toBe(200);

    const contentCampaign = await createCampaign();
    const contentResponse = await api(
      `/api/content/campaigns/${contentCampaign.payload.campaign.id}/generate`,
      { method: "POST", body: { unexpected: true }, runtimeEnv: workersAiRuntime(run) }
    );
    expect(contentResponse.status).toBe(400);
    expect((await contentResponse.json()).error).toBe("request_body_not_allowed");
  });

  it("returns configuration_missing and marks the campaign failed when AI binding is absent", async () => {
    const { payload } = await createCampaign();
    const response = await api(`/api/content/campaigns/${payload.campaign.id}/generate`, {
      method: "POST",
      runtimeEnv: { ...env, CONTENT_AI_PROVIDER: "workers_ai", AI: undefined },
    });
    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe("configuration_missing");
    expect(await env.DB.prepare("SELECT status FROM content_campaigns WHERE id = ?")
      .bind(payload.campaign.id).first("status")).toBe("failed");
  });

  it("does not retry an OpenAI unsupported-country 403", async () => {
    const fetcher = vi.fn(async () => HttpResponse.json({
      error: {
        type: "request_forbidden",
        code: "unsupported_country_region_territory",
        message: "sensitive upstream detail",
      },
    }, { status: 403 }));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const service = new OpenAiContentProvider({
      OPENAI_API_KEY: "test-openai-key",
      OPENAI_MODEL: "gpt-5.6-luna",
      OPENAI_MAX_ATTEMPTS: "3",
      RETRY_BASE_DELAY_MS: "1",
    }, { fetcher });
    await expect(service.generate({
      topic: "موضوع",
      target_audience: "مدیران",
      goal: "آگاهی",
    }, "req_openai_no_retry")).rejects.toMatchObject({ code: "openai_http_403" });
    warn.mockRestore();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("logs safe OpenAI failure diagnostics without provider messages or request content", async () => {
    network.use(http.post("https://api.openai.com/v1/responses", () => HttpResponse.json({
      error: {
        type: "request_forbidden",
        code: "unsupported_country_region_territory",
        message: "Sensitive upstream detail with sk-test-secret",
      },
    }, {
      status: 403,
      headers: { "x-request-id": "req_openai_403" },
    })));
    const spies = [
      vi.spyOn(console, "log").mockImplementation(() => {}),
      vi.spyOn(console, "warn").mockImplementation(() => {}),
      vi.spyOn(console, "error").mockImplementation(() => {}),
    ];
    const { payload } = await createCampaign({ topic: "sensitive-campaign-topic" });
    const response = await api(`/api/content/campaigns/${payload.campaign.id}/generate`, {
      method: "POST",
      runtimeEnv: { ...env, CONTENT_AI_PROVIDER: "openai" },
    });
    const responsePayload = await response.json();
    const output = spies.flatMap((spy) => spy.mock.calls).flat().join(" ");
    const records = spies
      .flatMap((spy) => spy.mock.calls)
      .flat()
      .map((entry) => JSON.parse(entry));
    spies.forEach((spy) => spy.mockRestore());

    expect(response.status).toBe(502);
    expect(responsePayload.error).toBe("openai_http_403");
    expect(records).toContainEqual(expect.objectContaining({
      event: "provider_request_failed",
      provider: "openai",
      providerRequestId: "req_openai_403",
      providerErrorType: "request_forbidden",
      providerErrorCode: "unsupported_country_region_territory",
      status: 403,
    }));
    expect(output).not.toContain("sk-test-secret");
    expect(output).not.toContain("Sensitive upstream detail");
    expect(output).not.toContain("sensitive-campaign-topic");
    expect(JSON.stringify(responsePayload)).not.toContain("unsupported_country_region_territory");
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
