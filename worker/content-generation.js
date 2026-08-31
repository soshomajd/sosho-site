import {
  ServiceError,
  fetchWithTimeout,
  getIntegerEnv,
  isPlainRecord,
  isRetryableStatus,
  logEvent,
  readOpenAIErrorDiagnostics,
  retryWithBackoff,
} from "./core.js";
import { WorkersAiContentProvider } from "./workers-ai-content-provider.js";

const BUNDLE_KEYS = [
  "campaignTitle",
  "targetAudience",
  "contentGoal",
  "mainHook",
  "mainMessage",
  "callToAction",
  "reelScript",
  "storyFrames",
  "carouselSlides",
  "instagramCaption",
  "facebookCaption",
  "linkedinPost",
  "telegramPost",
  "youtubeTitle",
  "youtubeDescription",
  "threadsPost",
  "hashtags",
  "visualDirection",
  "voiceoverScript",
  "subtitles",
];

const TEXT_SCHEMA = { type: "string", minLength: 1, maxLength: 4000 };
const CAMPAIGN_INPUT_KEYS = new Set([
  "topic",
  "targetAudience",
  "goal",
  "language",
  "scheduledAt",
]);

export const CONTENT_BUNDLE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: BUNDLE_KEYS,
  properties: {
    campaignTitle: { type: "string", minLength: 1, maxLength: 160 },
    targetAudience: { type: "string", minLength: 1, maxLength: 500 },
    contentGoal: { type: "string", minLength: 1, maxLength: 500 },
    mainHook: { type: "string", minLength: 1, maxLength: 500 },
    mainMessage: { type: "string", minLength: 1, maxLength: 2000 },
    callToAction: { type: "string", minLength: 1, maxLength: 500 },
    reelScript: {
      type: "object",
      additionalProperties: false,
      required: ["durationSeconds", "scenes"],
      properties: {
        durationSeconds: { type: "integer", minimum: 15, maximum: 30 },
        scenes: {
          type: "array",
          minItems: 2,
          maxItems: 8,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["visual", "dialogue"],
            properties: { visual: TEXT_SCHEMA, dialogue: TEXT_SCHEMA },
          },
        },
      },
    },
    storyFrames: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["headline", "body", "visual"],
        properties: { headline: TEXT_SCHEMA, body: TEXT_SCHEMA, visual: TEXT_SCHEMA },
      },
    },
    carouselSlides: {
      type: "array",
      minItems: 5,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["headline", "body", "visual"],
        properties: { headline: TEXT_SCHEMA, body: TEXT_SCHEMA, visual: TEXT_SCHEMA },
      },
    },
    instagramCaption: TEXT_SCHEMA,
    facebookCaption: TEXT_SCHEMA,
    linkedinPost: TEXT_SCHEMA,
    telegramPost: TEXT_SCHEMA,
    youtubeTitle: { type: "string", minLength: 1, maxLength: 160 },
    youtubeDescription: TEXT_SCHEMA,
    threadsPost: TEXT_SCHEMA,
    hashtags: {
      type: "array",
      minItems: 3,
      maxItems: 20,
      items: { type: "string", pattern: "^#[^\\s#]{1,60}$" },
    },
    visualDirection: TEXT_SCHEMA,
    voiceoverScript: TEXT_SCHEMA,
    subtitles: {
      type: "array",
      minItems: 1,
      maxItems: 20,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["startSecond", "endSecond", "text"],
        properties: {
          startSecond: { type: "number", minimum: 0, maximum: 30 },
          endSecond: { type: "number", minimum: 0, maximum: 30 },
          text: TEXT_SCHEMA,
        },
      },
    },
  },
};

function exactKeys(value, expected) {
  if (!isPlainRecord(value)) return false;
  const actual = Object.keys(value).sort();
  const sortedExpected = [...expected].sort();
  return actual.length === sortedExpected.length &&
    actual.every((key, index) => key === sortedExpected[index]);
}

function boundedText(value, max = 4000) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

export function validateCreateCampaignInput(value) {
  const issues = [];
  if (!isPlainRecord(value)) return { ok: false, issues: [{ path: "$", code: "object_required" }] };
  for (const key of Object.keys(value)) {
    if (!CAMPAIGN_INPUT_KEYS.has(key)) issues.push({ path: key, code: "unknown_field" });
  }
  for (const key of ["topic", "targetAudience", "goal"]) {
    if (!boundedText(value[key], 1000)) issues.push({ path: key, code: "invalid_text" });
  }
  if (value.language !== "fa") issues.push({ path: "language", code: "invalid_language" });
  if (value.scheduledAt !== undefined && value.scheduledAt !== null &&
      (typeof value.scheduledAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(value.scheduledAt) ||
       Number.isNaN(Date.parse(value.scheduledAt)))) {
    issues.push({ path: "scheduledAt", code: "invalid_datetime" });
  }
  if (issues.length > 0) return { ok: false, issues };
  return {
    ok: true,
    value: {
      topic: value.topic.trim(),
      targetAudience: value.targetAudience.trim(),
      goal: value.goal.trim(),
      language: "fa",
      scheduledAt: value.scheduledAt ?? null,
    },
  };
}

function validCard(value) {
  return exactKeys(value, ["headline", "body", "visual"]) &&
    boundedText(value.headline) && boundedText(value.body) && boundedText(value.visual);
}

function collectStrings(value, result = []) {
  if (typeof value === "string") result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, result));
  else if (isPlainRecord(value)) Object.values(value).forEach((item) => collectStrings(item, result));
  return result;
}

function requiredPersianStrings(bundle) {
  const fields = [
    "campaignTitle", "targetAudience", "contentGoal", "mainHook", "mainMessage",
    "callToAction", "instagramCaption", "facebookCaption", "linkedinPost", "telegramPost",
    "youtubeTitle", "youtubeDescription", "threadsPost", "visualDirection", "voiceoverScript",
  ];
  return [
    ...fields.map((key) => bundle[key]),
    ...bundle.reelScript.scenes.flatMap((scene) => [scene.visual, scene.dialogue]),
    ...bundle.storyFrames.flatMap((frame) => [frame.headline, frame.body, frame.visual]),
    ...bundle.carouselSlides.flatMap((slide) => [slide.headline, slide.body, slide.visual]),
    ...bundle.subtitles.map((subtitle) => subtitle.text),
  ];
}

export function findContentPolicyViolation(bundle) {
  const text = collectStrings(bundle).join("\n");
  const digits = "0-9۰-۹٠-٩";
  const inventedAmount = new RegExp(
    `[${digits}][${digits}\\s,.٬]{0,20}(?:تومان|ریال|دلار|یورو|usd|eur|tomans?|rials?)`,
    "iu"
  );
  const inventedMetric = new RegExp(
    `(?:بیش از|بالاتر از|افزایش|رشد|کاهش|نرخ|more than|over|increase|growth|rate).{0,30}[${digits}]+\\s*(?:٪|%|برابر|x|مشتری|پروژه|clients?|projects?)`,
    "iu"
  );
  const inventedClient = /(?:مشتریان ما شامل|برای برندهای? (?:بزرگ|معتبر)|همکاری با برندهای?|our clients include|trusted by|worked with brands?)/iu;
  const guarantee = /(?:تضمین (?:می|خواهیم)|تضمینی|صددرصد تضمین|قول (?:می|خواهیم)|we guarantee|guaranteed|we promise)/iu;
  if (inventedAmount.test(text)) return "invented_price";
  if (inventedMetric.test(text)) return "invented_statistic";
  if (inventedClient.test(text)) return "invented_client_claim";
  if (guarantee.test(text)) return "unsupported_guarantee";
  return null;
}

export function validateContentBundle(value) {
  if (!exactKeys(value, BUNDLE_KEYS)) return { ok: false, code: "invalid_bundle_shape" };
  for (const key of [
    "campaignTitle", "targetAudience", "contentGoal", "mainHook", "mainMessage",
    "callToAction", "instagramCaption", "facebookCaption", "linkedinPost", "telegramPost",
    "youtubeTitle", "youtubeDescription", "threadsPost", "visualDirection", "voiceoverScript",
  ]) {
    if (!boundedText(value[key], key === "campaignTitle" || key === "youtubeTitle" ? 160 : 4000)) {
      return { ok: false, code: `invalid_${key}` };
    }
  }
  if (!exactKeys(value.reelScript, ["durationSeconds", "scenes"]) ||
      !Number.isInteger(value.reelScript.durationSeconds) ||
      value.reelScript.durationSeconds < 15 || value.reelScript.durationSeconds > 30 ||
      !Array.isArray(value.reelScript.scenes) || value.reelScript.scenes.length < 2 ||
      value.reelScript.scenes.length > 8 ||
      value.reelScript.scenes.some((scene) => !exactKeys(scene, ["visual", "dialogue"]) ||
        !boundedText(scene.visual) || !boundedText(scene.dialogue))) {
    return { ok: false, code: "invalid_reel_script" };
  }
  if (!Array.isArray(value.storyFrames) || value.storyFrames.length < 3 ||
      value.storyFrames.length > 5 || value.storyFrames.some((frame) => !validCard(frame))) {
    return { ok: false, code: "invalid_story_frames" };
  }
  if (!Array.isArray(value.carouselSlides) || value.carouselSlides.length < 5 ||
      value.carouselSlides.length > 8 || value.carouselSlides.some((slide) => !validCard(slide))) {
    return { ok: false, code: "invalid_carousel_slides" };
  }
  if (!Array.isArray(value.hashtags) || value.hashtags.length < 3 || value.hashtags.length > 20 ||
      value.hashtags.some((tag) => typeof tag !== "string" || !/^#[^\s#]{1,60}$/u.test(tag))) {
    return { ok: false, code: "invalid_hashtags" };
  }
  if (!Array.isArray(value.subtitles) || value.subtitles.length < 1 || value.subtitles.length > 20 ||
      value.subtitles.some((subtitle) => !exactKeys(subtitle, ["startSecond", "endSecond", "text"]) ||
        typeof subtitle.startSecond !== "number" || typeof subtitle.endSecond !== "number" ||
        subtitle.startSecond < 0 || subtitle.endSecond > value.reelScript.durationSeconds ||
        subtitle.startSecond >= subtitle.endSecond || !boundedText(subtitle.text))) {
    return { ok: false, code: "invalid_subtitles" };
  }
  if (requiredPersianStrings(value).some((text) => !/[\u0600-\u06FF]/u.test(text))) {
    return { ok: false, code: "persian_content_required" };
  }
  const policyViolation = findContentPolicyViolation(value);
  if (policyViolation) return { ok: false, code: policyViolation };
  return { ok: true, value };
}

function extractOutputText(response) {
  for (const item of response.output ?? []) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  return "";
}

export class OpenAiContentProvider {
  constructor(env, { fetcher = fetch } = {}) {
    this.env = env;
    this.fetcher = fetcher;
  }

  async generate(campaign, requestId) {
    if (!this.env.OPENAI_API_KEY) {
      throw new ServiceError("configuration_missing", { status: 503 });
    }
    const instructions = `You create Persian marketing content for SoSho Studio and the Iranian market.
Create one coherent campaign about website design services and AI automation, tailored to the supplied topic, audience, and goal.
Write natural, correct Persian suitable for RTL display. Keep LinkedIn professional and B2B. Write distinct copy for every network.
The Reel must fit 15 to 30 seconds. Story must have 3 to 5 frames. Carousel must have 5 to 8 slides.
Never invent statistics, prices, discounts, named clients, portfolio claims, guarantees, delivery promises, or unsupported results.
Return only the structured content bundle requested by the schema.`;
    const startedAt = Date.now();
    return retryWithBackoff(async (attempt) => {
      const response = await fetchWithTimeout(
        this.fetcher,
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: this.env.OPENAI_MODEL || "gpt-5.6-luna",
            store: false,
            max_output_tokens: getIntegerEnv(this.env, "CONTENT_OPENAI_MAX_OUTPUT_TOKENS", 6000, {
              min: 1000,
              max: 12000,
            }),
            instructions,
            input: [{
              role: "user",
              content: `موضوع: ${campaign.topic}\nمخاطب هدف: ${campaign.target_audience}\nهدف: ${campaign.goal}`,
            }],
            text: {
              format: {
                type: "json_schema",
                name: "sosho_content_bundle",
                strict: true,
                schema: CONTENT_BUNDLE_SCHEMA,
              },
            },
          }),
        },
        getIntegerEnv(this.env, "OPENAI_TIMEOUT_MS", 8000, { min: 1000, max: 60_000 })
      );
      if (!response.ok) {
        const diagnostics = await readOpenAIErrorDiagnostics(response);
        logEvent("warn", "provider_request_failed", {
          requestId,
          provider: "openai",
          attempt,
          status: response.status,
          durationMs: Date.now() - startedAt,
          ...diagnostics,
        });
        throw new ServiceError(`openai_http_${response.status}`, {
          status: 502,
          retryable: isRetryableStatus(response.status),
        });
      }
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new ServiceError("openai_invalid_json", { status: 502, retryable: true });
      }
      if (payload.status && payload.status !== "completed") {
        throw new ServiceError(`openai_${payload.status}`, { status: 502, retryable: true });
      }
      const outputText = extractOutputText(payload);
      let parsed;
      try {
        parsed = JSON.parse(outputText);
      } catch {
        throw new ServiceError("openai_unparseable_output", { status: 502, retryable: true });
      }
      const validation = validateContentBundle(parsed);
      if (!validation.ok) throw new ServiceError(validation.code, { status: 502 });
      logEvent("info", "content_generation_succeeded", {
        requestId,
        provider: "openai",
        attempt,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      return validation.value;
    }, {
      maxAttempts: getIntegerEnv(this.env, "OPENAI_MAX_ATTEMPTS", 3, { min: 1, max: 5 }),
      baseDelayMs: getIntegerEnv(this.env, "RETRY_BASE_DELAY_MS", 250, { min: 1, max: 5000 }),
      maxDelayMs: 5000,
    });
  }
}

export class ContentGenerationService {
  constructor(env, { fetcher = fetch } = {}) {
    this.env = env;
    this.fetcher = fetcher;
  }

  async generate(campaign, requestId) {
    const provider = String(this.env.CONTENT_AI_PROVIDER || "workers_ai").trim().toLowerCase();
    if (provider === "workers_ai") {
      return new WorkersAiContentProvider(this.env, {
        schema: CONTENT_BUNDLE_SCHEMA,
        validate: validateContentBundle,
      }).generate(campaign, requestId);
    }
    if (provider === "openai") {
      return new OpenAiContentProvider(this.env, { fetcher: this.fetcher })
        .generate(campaign, requestId);
    }
    throw new ServiceError("configuration_missing", { status: 503 });
  }
}
