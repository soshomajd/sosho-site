import { createExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import worker from "../worker/index.js";
import {
  buildCampaignImagePrompt,
  validateAndDecodeBase64Image,
} from "../worker/image-generation.js";
import {
  DEFAULT_WORKERS_AI_IMAGE_MODEL,
  WorkersAiImageProvider,
} from "../worker/workers-ai-image-provider.js";
import { network } from "./network.js";

function validBundle() {
  const card = (headline) => ({
    headline,
    body: "توضیح فارسی کاربردی",
    visual: "نمای حرفه‌ای مینیمال",
  });
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
    carouselSlides: [
      card("اسلاید اول"),
      card("اسلاید دوم"),
      card("اسلاید سوم"),
      card("اسلاید چهارم"),
      card("اسلاید پنجم"),
    ],
    instagramCaption: "سایت هدفمند برای مسیر دیجیتال منسجم.",
    facebookCaption: "طراحی سایت را با فرایند کسب‌وکار هماهنگ کنید.",
    linkedinPost: "زیرساخت دیجیتال برای مدیران و کسب‌وکارهای B2B اهمیت دارد.",
    telegramPost: "سایت و اتوماسیون را یکپارچه ببینید.",
    youtubeTitle: "طراحی سایت و اتوماسیون هوش مصنوعی",
    youtubeDescription: "مروری فارسی بر ساخت زیرساخت دیجیتال منسجم.",
    threadsPost: "وب‌سایت باید در فرایند کسب‌وکار نقش داشته باشد.",
    hashtags: ["#طراحی_سایت", "#هوش_مصنوعی", "#اتوماسیون"],
    visualDirection: "فضای مینیمال و حرفه‌ای با جای خالی برای متن راست به چپ",
    voiceoverScript: "یک مسیر دیجیتال منسجم برای کسب‌وکار بسازید.",
    subtitles: [{ startSecond: 0, endSecond: 10, text: "یک مسیر دیجیتال منسجم بسازید." }],
  };
}

function toBase64(bytes) {
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}

function jpegBase64(byteSize = 64) {
  const bytes = new Uint8Array(byteSize);
  bytes.set([0xff, 0xd8, 0xff, 0xe0]);
  bytes.set([0xff, 0xd9], byteSize - 2);
  return toBase64(bytes);
}

function imageRuntime(run, overrides = {}) {
  return {
    ...env,
    IMAGE_AI_PROVIDER: "workers_ai",
    WORKERS_AI_IMAGE_MODEL: DEFAULT_WORKERS_AI_IMAGE_MODEL,
    IMAGE_AI_TIMEOUT_MS: "1000",
    IMAGE_MAX_BYTES: "5000000",
    AI: { run },
    ...overrides,
  };
}

async function insertApprovedCampaign() {
  const campaignId = `campaign_${crypto.randomUUID()}`;
  const itemId = `content_${crypto.randomUUID()}`;
  const timestamp = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO content_campaigns (
        id, topic, target_audience, goal, language, status, approval_status,
        approval_decided_at, created_at, updated_at
      ) VALUES (?, 'اتوماسیون هوش مصنوعی', 'مدیران کسب‌وکار', 'افزایش آگاهی',
                'fa', 'generated', 'approved', ?, ?, ?)`
    ).bind(campaignId, timestamp, timestamp, timestamp),
    env.DB.prepare(
      `INSERT INTO content_items (
        id, campaign_id, content_type, platform, content_json,
        validation_status, created_at, updated_at
      ) VALUES (?, ?, 'content_bundle', 'multi_platform', ?, 'valid', ?, ?)`
    ).bind(itemId, campaignId, JSON.stringify(validBundle()), timestamp, timestamp),
  ]);
  return campaignId;
}

async function generateImage(campaignId, runtimeEnv) {
  return worker.fetch(new Request(
    `https://example.com/api/content/campaigns/${campaignId}/generate-image`,
    { method: "POST", headers: { authorization: "Bearer test-admin-token" } }
  ), runtimeEnv, createExecutionContext());
}

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM telegram_notifications"),
    env.DB.prepare("DELETE FROM content_media"),
    env.DB.prepare("DELETE FROM content_items"),
    env.DB.prepare("DELETE FROM content_campaigns"),
  ]);
});

describe("Workers AI image provider", () => {
  it("generates an image with the configured Flux model", async () => {
    const run = vi.fn(async () => ({ image: jpegBase64() }));
    const provider = new WorkersAiImageProvider(imageRuntime(run));
    const output = await provider.generate("A professional abstract technology scene", "req_image");
    expect(output.model).toBe(DEFAULT_WORKERS_AI_IMAGE_MODEL);
    expect(output.base64).toBe(jpegBase64());
    expect(run).toHaveBeenCalledWith(
      DEFAULT_WORKERS_AI_IMAGE_MODEL,
      { prompt: "A professional abstract technology scene", steps: 4 },
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it("builds a bounded prompt with explicit no-text and negative-space rules", () => {
    const prompt = buildCampaignImagePrompt({
      topic: "طراحی سایت",
      targetAudience: "مدیران ایرانی",
    }, validBundle());
    expect(prompt.length).toBeLessThanOrEqual(2048);
    expect(prompt).toContain("Do not render any text");
    expect(prompt).toContain("negative space");
    expect(prompt).toContain("Iranian business decision-makers");
  });
});

describe("image output validation", () => {
  it("validates Base64 and detects the binary image type", () => {
    const result = validateAndDecodeBase64Image(jpegBase64());
    expect(result.mimeType).toBe("image/jpeg");
    expect(result.byteSize).toBe(64);
    expect([...result.bytes.slice(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
  });

  it("rejects malformed and oversized image output", () => {
    expect(() => validateAndDecodeBase64Image("not-base64"))
      .toThrow(expect.objectContaining({ code: "invalid_image_output" }));
    expect(() => validateAndDecodeBase64Image(jpegBase64(96), 64))
      .toThrow(expect.objectContaining({ code: "image_too_large" }));
  });
});

describe("approved campaign main image API", () => {
  it("does not generate an image before campaign approval", async () => {
    const campaignId = await insertApprovedCampaign();
    await env.DB.prepare(
      "UPDATE content_campaigns SET approval_status = 'pending' WHERE id = ?"
    ).bind(campaignId).run();
    const run = vi.fn(async () => ({ image: jpegBase64() }));
    const response = await generateImage(campaignId, imageRuntime(run));
    expect(response.status).toBe(409);
    expect((await response.json()).error).toBe("campaign_not_approved");
    expect(run).not.toHaveBeenCalled();
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM content_media").first("total"))
      .toBe(0);
  });

  it("returns configuration_missing when the AI binding is absent", async () => {
    const campaignId = await insertApprovedCampaign();
    const response = await generateImage(campaignId, imageRuntime(vi.fn(), { AI: undefined }));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe("configuration_missing");
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM content_media").first("total"))
      .toBe(0);
  });

  it("returns configuration_missing when the R2 binding is absent", async () => {
    const campaignId = await insertApprovedCampaign();
    const response = await generateImage(
      campaignId,
      imageRuntime(vi.fn(), { MEDIA: undefined })
    );
    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe("configuration_missing");
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM content_media").first("total"))
      .toBe(0);
  });

  it("stores the image in R2 and its safe metadata in D1", async () => {
    const campaignId = await insertApprovedCampaign();
    const bytes = jpegBase64(80);
    const response = await generateImage(campaignId, imageRuntime(async () => ({ image: bytes })));
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.mainImage).toMatchObject({
      campaignId,
      mediaType: "main_image",
      mimeType: "image/jpeg",
      byteSize: 80,
      status: "stored",
      provider: "workers_ai",
      model: DEFAULT_WORKERS_AI_IMAGE_MODEL,
      telegramPreviewStatus: "blocked",
    });
    expect(payload.mainImage).not.toHaveProperty("url");
    const stored = await env.MEDIA.get(payload.mainImage.r2Key);
    expect(stored).not.toBeNull();
    expect(stored.httpMetadata.contentType).toBe("image/jpeg");
    expect(stored.customMetadata.campaignId).toBe(campaignId);
    expect(new Uint8Array(await stored.arrayBuffer()).byteLength).toBe(80);
    expect(await env.DB.prepare(
      "SELECT COUNT(*) AS total FROM content_media WHERE campaign_id = ? AND status = 'stored'"
    ).bind(campaignId).first("total")).toBe(1);
  });

  it("reads the private R2 image and sends one multipart Telegram preview", async () => {
    const campaignId = await insertApprovedCampaign();
    let requestMethod;
    let photoSize;
    let photoType;
    let keyboard;
    let sends = 0;
    network.use(http.post(/https:\/\/api\.telegram\.org\/bot[^/]+\/.+/u, async ({ request }) => {
      requestMethod = new URL(request.url).pathname.split("/").at(-1);
      const form = await request.formData();
      const photo = form.get("photo");
      photoSize = photo.size;
      photoType = photo.type;
      keyboard = JSON.parse(form.get("reply_markup"));
      sends += 1;
      return HttpResponse.json({ ok: true, result: { message_id: 19 } });
    }));
    const currentEnv = imageRuntime(async () => ({ image: jpegBase64(80) }), {
      TELEGRAM_BOT_TOKEN: "test-telegram-token",
      TELEGRAM_ADMIN_CHAT_ID: "10001",
    });
    const response = await generateImage(campaignId, currentEnv);
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.mainImage.telegramPreviewStatus).toBe("sent");
    expect(requestMethod).toBe("sendPhoto");
    expect(photoSize).toBe(80);
    expect(photoType).toBe("image/jpeg");
    expect(keyboard.inline_keyboard.flat().map((button) => button.text))
      .toEqual(["Approve", "Reject", "Regenerate", "View Details"]);
    expect(sends).toBe(1);
    expect(await env.DB.prepare(
      `SELECT status FROM telegram_notifications
       WHERE entity_id = ? AND notification_type = 'content_image_preview'`
    ).bind(campaignId).first("status")).toBe("sent");
  });

  it("returns the stored record without generating a duplicate", async () => {
    const campaignId = await insertApprovedCampaign();
    const run = vi.fn(async () => ({ image: jpegBase64() }));
    const currentEnv = imageRuntime(run);
    const first = await generateImage(campaignId, currentEnv);
    const firstPayload = await first.json();
    const second = await generateImage(campaignId, currentEnv);
    const secondPayload = await second.json();
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(firstPayload.imageGeneration.reused).toBe(false);
    expect(secondPayload.imageGeneration.reused).toBe(true);
    expect(secondPayload.mainImage.id).toBe(firstPayload.mainImage.id);
    expect(run).toHaveBeenCalledTimes(1);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM content_media").first("total"))
      .toBe(1);
  });

  it("rebuilds a superseded image after the campaign text is regenerated", async () => {
    const campaignId = await insertApprovedCampaign();
    const run = vi.fn(async () => ({ image: jpegBase64() }));
    const currentEnv = imageRuntime(run);
    const first = await generateImage(campaignId, currentEnv);
    const firstPayload = await first.json();
    expect(firstPayload.imageGeneration.reused).toBe(false);
    // A text regeneration marks the stored image as superseded.
    await env.DB.prepare(
      "UPDATE content_media SET superseded_at = ? WHERE campaign_id = ?"
    ).bind(new Date().toISOString(), campaignId).run();
    const second = await generateImage(campaignId, currentEnv);
    const secondPayload = await second.json();
    expect(second.status).toBe(200);
    expect(secondPayload.imageGeneration.reused).toBe(false);
    expect(secondPayload.mainImage.id).toBe(firstPayload.mainImage.id);
    expect(secondPayload.mainImage.supersededAt).toBeNull();
    expect(run).toHaveBeenCalledTimes(2);
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM content_media").first("total"))
      .toBe(1);
    const third = await generateImage(campaignId, currentEnv);
    expect((await third.json()).imageGeneration.reused).toBe(true);
    expect(run).toHaveBeenCalledTimes(2);
  });

  it("rejects invalid model image data and records a safe failure", async () => {
    const campaignId = await insertApprovedCampaign();
    const response = await generateImage(
      campaignId,
      imageRuntime(async () => ({ image: "not-base64" }))
    );
    expect(response.status).toBe(502);
    expect((await response.json()).error).toBe("invalid_image_output");
    expect(await env.DB.prepare("SELECT status FROM content_media WHERE campaign_id = ?")
      .bind(campaignId).first("status")).toBe("failed");
  });

  it("rejects oversized model output before R2 storage", async () => {
    const campaignId = await insertApprovedCampaign();
    const put = vi.fn();
    const response = await generateImage(campaignId, imageRuntime(
      async () => ({ image: jpegBase64(96) }),
      { IMAGE_MAX_BYTES: "64", MEDIA: { put, get: vi.fn() } }
    ));
    expect(response.status).toBe(502);
    expect((await response.json()).error).toBe("image_too_large");
    expect(put).not.toHaveBeenCalled();
  });

  it("fails safely when Workers AI throws an internal error", async () => {
    const campaignId = await insertApprovedCampaign();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const response = await generateImage(campaignId, imageRuntime(async () => {
      throw Object.assign(new Error("secret provider detail"), { status: 503 });
    }));
    const payload = await response.json();
    const logs = warn.mock.calls.flat().join(" ");
    warn.mockRestore();
    expect(response.status).toBe(502);
    expect(payload.error).toBe("image_generation_failed");
    expect(JSON.stringify(payload)).not.toContain("secret provider detail");
    expect(logs).not.toContain("secret provider detail");
    expect(await env.DB.prepare("SELECT last_error FROM content_media WHERE campaign_id = ?")
      .bind(campaignId).first("last_error")).toBe("image_generation_failed");
  });
});
