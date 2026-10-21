import {
  SALES_RESPONSE_SCHEMA,
  ServiceError,
  getIntegerEnv,
  logEvent,
  validateSalesResponse,
} from "./core.js";
import {
  DEFAULT_WORKERS_AI_CONTENT_MODEL,
  DEFAULT_WORKERS_AI_FALLBACK_MODEL,
  extractStructuredOutput,
  runWithTimeout,
} from "./workers-ai-content-provider.js";

const PROPS = SALES_RESPONSE_SCHEMA.properties;
const EXTRACTED_FIELDS = PROPS.extracted.required;

const asEnum = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);

/**
 * Open-weight models follow a JSON schema loosely: they invent field names in
 * `missingFields`, return a quick reply as a number, or overshoot a length. Repair
 * those shape slips before validation. This never touches `reply` text, so the
 * business-policy checks (no prices, delivery promises, or guarantees) stay strict.
 */
export function normalizeSalesOutput(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const extracted = {};
  for (const key of EXTRACTED_FIELDS) {
    const raw = value.extracted?.[key];
    const asText = typeof raw === "number" ? String(raw) : raw;
    extracted[key] = typeof asText === "string" && asText.trim() ? asText.trim().slice(0, key === "phone" ? 100 : 500) : null;
  }
  const confidence = Number(value.confidence);
  return {
    reply: value.reply,
    stage: asEnum(value.stage, PROPS.stage.enum, "qualification"),
    projectType: asEnum(value.projectType, PROPS.projectType.enum, "unknown"),
    recommendedTier: asEnum(value.recommendedTier, PROPS.recommendedTier.enum, "unknown"),
    extracted,
    missingFields: Array.isArray(value.missingFields)
      ? [...new Set(value.missingFields.filter((field) => EXTRACTED_FIELDS.includes(field)))]
      : [],
    quickReplies: Array.isArray(value.quickReplies)
      ? value.quickReplies
          .filter((reply) => typeof reply === "string" && reply.trim())
          .map((reply) => reply.trim().slice(0, 120))
          .slice(0, 4)
      : [],
    isComplete: value.isComplete === true,
    confidence: Number.isFinite(confidence) ? Math.min(1, Math.max(0, confidence)) : 0.5,
  };
}

/**
 * With thinking switched off, Qwen3 on Workers AI returns the finished JSON in
 * `message.reasoning` and leaves `message.content` null. Read either one.
 */
export function extractSalesOutput(output) {
  const message = output?.choices?.[0]?.message;
  if (message && typeof message === "object" && !message.content) {
    const text = message.reasoning ?? message.reasoning_content;
    if (typeof text === "string" && text.trim()) return extractStructuredOutput(text);
  }
  return extractStructuredOutput(output);
}

/**
 * One Sales Chat turn through the Cloudflare `AI` binding, so the assistant works
 * without an OpenAI account. Primary model first, one fallback model on a retryable
 * failure. The reply goes through the same schema and business-policy validation
 * as the OpenAI path (no invented prices, delivery promises, or guarantees).
 */
export async function callWorkersAiSalesModel(env, { instructions, history, requestId }) {
  if (!env.AI || typeof env.AI.run !== "function") {
    throw new ServiceError("configuration_missing", { status: 503 });
  }
  const models = [
    env.WORKERS_AI_SALES_MODEL || env.WORKERS_AI_CONTENT_MODEL || DEFAULT_WORKERS_AI_CONTENT_MODEL,
    env.WORKERS_AI_FALLBACK_MODEL || DEFAULT_WORKERS_AI_FALLBACK_MODEL,
  ];
  const baseInput = {
    messages: [
      { role: "system", content: instructions },
      ...history.map((message) => ({ role: message.role, content: message.content })),
    ],
    max_tokens: getIntegerEnv(env, "WORKERS_AI_SALES_MAX_TOKENS", 1200, { min: 200, max: 4000 }),
    temperature: 0.3,
    response_format: { type: "json_schema", json_schema: SALES_RESPONSE_SCHEMA },
  };
  const inputFor = (model) =>
    /qwen3/i.test(model)
      ? { ...baseInput, chat_template_kwargs: { enable_thinking: false } }
      : baseInput;
  const timeoutMs = getIntegerEnv(env, "WORKERS_AI_SALES_TIMEOUT_MS", 25_000, {
    min: 2000,
    max: 60_000,
  });
  const startedAt = Date.now();
  for (let index = 0; index < models.length; index += 1) {
    const attempt = index + 1;
    try {
      const output = await runWithTimeout(env.AI, models[index], inputFor(models[index]), timeoutMs);
      const validated = validateSalesResponse(normalizeSalesOutput(extractSalesOutput(output)));
      if (!validated.ok) {
        throw new ServiceError(validated.code, { status: 502, retryable: true });
      }
      logEvent("info", "provider_request_succeeded", {
        requestId,
        provider: "workers_ai",
        attempt,
        durationMs: Date.now() - startedAt,
      });
      return validated.value;
    } catch (error) {
      logEvent("warn", "provider_request_failed", {
        requestId,
        provider: "workers_ai",
        attempt,
        code: error?.code || "workers_ai_request_failed",
        durationMs: Date.now() - startedAt,
      });
      if (index === 0) continue;
      throw new ServiceError("sales_model_failed", { status: 502 });
    }
  }
  throw new ServiceError("sales_model_failed", { status: 502 });
}
