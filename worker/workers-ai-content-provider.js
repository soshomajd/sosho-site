import {
  ServiceError,
  getIntegerEnv,
  isPlainRecord,
  isRetryableStatus,
  logEvent,
} from "./core.js";

export const DEFAULT_WORKERS_AI_CONTENT_MODEL = "@cf/qwen/qwen3-30b-a3b-fp8";
export const DEFAULT_WORKERS_AI_FALLBACK_MODEL =
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

const WORKERS_AI_TIMEOUT_MS = 45_000;

function providerStatus(error) {
  for (const value of [error?.status, error?.statusCode, error?.cause?.status]) {
    const status = Number(value);
    if (Number.isInteger(status) && status >= 100 && status <= 599) return status;
  }
  return null;
}

function normalizeProviderError(error) {
  if (error instanceof ServiceError) return error;
  const status = providerStatus(error);
  return new ServiceError("workers_ai_request_failed", {
    status: 502,
    retryable: status === null || isRetryableStatus(status),
  });
}

async function runWithTimeout(ai, model, input, timeoutMs) {
  const controller = new AbortController();
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(new ServiceError("workers_ai_timeout", { status: 502, retryable: true }));
    }, timeoutMs);
  });
  try {
    return await Promise.race([
      Promise.resolve(ai.run(model, input, { signal: controller.signal })),
      timeout,
    ]);
  } catch (error) {
    throw normalizeProviderError(error);
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseJsonText(value) {
  if (isPlainRecord(value)) return value;
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ServiceError("workers_ai_unparseable_output", {
      status: 502,
      retryable: true,
    });
  }
  try {
    const parsed = JSON.parse(value);
    if (!isPlainRecord(parsed)) throw new Error("object_required");
    return parsed;
  } catch {
    throw new ServiceError("workers_ai_unparseable_output", {
      status: 502,
      retryable: true,
    });
  }
}

function extractStructuredOutput(output) {
  if (typeof output === "string") return parseJsonText(output);
  if (!isPlainRecord(output)) {
    throw new ServiceError("workers_ai_invalid_output", { status: 502, retryable: true });
  }
  if (Object.hasOwn(output, "response")) return parseJsonText(output.response);
  const content = output.choices?.[0]?.message?.content;
  return parseJsonText(content);
}

function buildInput(campaign, schema, maxTokens) {
  const instructions = `You create Persian marketing content for SoSho Studio and the Iranian market.
Create one coherent campaign about website design services and AI automation, tailored to the supplied topic, audience, and goal.
Write natural, correct Persian suitable for RTL display. Keep LinkedIn professional and B2B. Write distinct copy for every network.
The Reel must fit 15 to 30 seconds. Story must have 3 to 5 frames. Carousel must have 5 to 8 slides.
Never invent statistics, prices, discounts, named clients, portfolio claims, guarantees, delivery promises, or unsupported results.
Return only the structured content bundle requested by the JSON schema.`;
  return {
    messages: [
      { role: "system", content: instructions },
      {
        role: "user",
        content: `موضوع: ${campaign.topic}\nمخاطب هدف: ${campaign.target_audience}\nهدف: ${campaign.goal}`,
      },
    ],
    max_tokens: maxTokens,
    temperature: 0.4,
    response_format: {
      type: "json_schema",
      json_schema: schema,
    },
  };
}

export class WorkersAiContentProvider {
  constructor(env, { schema, validate }) {
    this.env = env;
    this.schema = schema;
    this.validate = validate;
  }

  async generate(campaign, requestId) {
    if (!this.env.AI || typeof this.env.AI.run !== "function") {
      throw new ServiceError("configuration_missing", { status: 503 });
    }
    const models = [
      this.env.WORKERS_AI_CONTENT_MODEL || DEFAULT_WORKERS_AI_CONTENT_MODEL,
      this.env.WORKERS_AI_FALLBACK_MODEL || DEFAULT_WORKERS_AI_FALLBACK_MODEL,
    ];
    const input = buildInput(
      campaign,
      this.schema,
      getIntegerEnv(this.env, "CONTENT_OPENAI_MAX_OUTPUT_TOKENS", 6000, {
        min: 1000,
        max: 12_000,
      })
    );
    const startedAt = Date.now();
    for (let index = 0; index < models.length; index += 1) {
      const attempt = index + 1;
      try {
        const output = await runWithTimeout(
          this.env.AI,
          models[index],
          input,
          WORKERS_AI_TIMEOUT_MS
        );
        const parsed = extractStructuredOutput(output);
        const validation = this.validate(parsed);
        if (!validation.ok) {
          throw new ServiceError(validation.code, { status: 502, retryable: true });
        }
        logEvent("info", "content_generation_succeeded", {
          requestId,
          provider: "workers_ai",
          attempt,
          durationMs: Date.now() - startedAt,
        });
        return validation.value;
      } catch (caught) {
        const error = normalizeProviderError(caught);
        logEvent("warn", "provider_request_failed", {
          requestId,
          provider: "workers_ai",
          attempt,
          status: providerStatus(caught) ?? undefined,
          code: error.code,
          durationMs: Date.now() - startedAt,
        });
        if (index === 0 && error.retryable) continue;
        throw new ServiceError("content_generation_failed", { status: 502 });
      }
    }
    throw new ServiceError("content_generation_failed", { status: 502 });
  }
}
