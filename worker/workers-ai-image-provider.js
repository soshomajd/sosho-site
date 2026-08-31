import {
  ServiceError,
  getIntegerEnv,
  isPlainRecord,
  logEvent,
} from "./core.js";

export const DEFAULT_WORKERS_AI_IMAGE_MODEL =
  "@cf/black-forest-labs/flux-1-schnell";

function providerStatus(error) {
  for (const value of [error?.status, error?.statusCode, error?.cause?.status]) {
    const status = Number(value);
    if (Number.isInteger(status) && status >= 100 && status <= 599) return status;
  }
  return null;
}

async function runWithTimeout(ai, model, input, timeoutMs) {
  const controller = new AbortController();
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      controller.abort();
      reject(new ServiceError("workers_ai_image_timeout", { status: 502 }));
    }, timeoutMs);
  });
  try {
    return await Promise.race([
      Promise.resolve(ai.run(model, input, { signal: controller.signal })),
      timeout,
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
}

export class WorkersAiImageProvider {
  constructor(env) {
    this.env = env;
    this.name = "workers_ai";
    this.model = env.WORKERS_AI_IMAGE_MODEL || DEFAULT_WORKERS_AI_IMAGE_MODEL;
  }

  assertConfigured() {
    if (!this.env.AI || typeof this.env.AI.run !== "function") {
      throw new ServiceError("configuration_missing", { status: 503 });
    }
  }

  async generate(prompt, requestId) {
    this.assertConfigured();
    const startedAt = Date.now();
    try {
      const output = await runWithTimeout(
        this.env.AI,
        this.model,
        { prompt, steps: 4 },
        getIntegerEnv(this.env, "IMAGE_AI_TIMEOUT_MS", 60_000, {
          min: 1_000,
          max: 120_000,
        })
      );
      if (!isPlainRecord(output) || typeof output.image !== "string" || !output.image.trim()) {
        throw new ServiceError("invalid_image_output", { status: 502 });
      }
      logEvent("info", "image_generation_succeeded", {
        requestId,
        provider: this.name,
        attempt: 1,
        durationMs: Date.now() - startedAt,
      });
      return {
        base64: output.image,
        provider: this.name,
        model: this.model,
      };
    } catch (error) {
      if (error instanceof ServiceError && error.code === "configuration_missing") throw error;
      logEvent("warn", "provider_request_failed", {
        requestId,
        provider: this.name,
        attempt: 1,
        status: providerStatus(error) ?? undefined,
        code: error instanceof ServiceError ? error.code : "workers_ai_image_request_failed",
        durationMs: Date.now() - startedAt,
      });
      throw new ServiceError("image_generation_failed", { status: 502 });
    }
  }
}
