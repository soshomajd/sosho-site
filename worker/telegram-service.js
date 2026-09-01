import {
  ServiceError,
  fetchWithTimeout,
  getIntegerEnv,
  isRetryableStatus,
  logEvent,
  retryWithBackoff,
} from "./core.js";

const TELEGRAM_TEXT_LIMIT = 4096;
const TELEGRAM_CAPTION_LIMIT = 1024;
const SAFE_CHUNK_LIMIT = 3800;
const CALLBACK_PATTERN = /^c:([argv]):([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/iu;
const ACTION_CODES = { approve: "a", reject: "r", regenerate: "g", view: "v" };
const CODE_ACTIONS = { a: "approve", r: "reject", g: "regenerate", v: "view" };

export function isTelegramConfigured(env) {
  return Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_ADMIN_CHAT_ID);
}

export function isTelegramWebhookConfigured(env) {
  return Boolean(
    isTelegramConfigured(env) && env.TELEGRAM_ADMIN_USER_ID && env.TELEGRAM_WEBHOOK_SECRET
  );
}

export function createCampaignCallbackData(action, campaignId) {
  const code = ACTION_CODES[action];
  const uuid = String(campaignId).replace(/^campaign_/u, "");
  const value = `c:${code}:${uuid}`;
  if (!code || !CALLBACK_PATTERN.test(value) || new TextEncoder().encode(value).byteLength > 64) {
    throw new ServiceError("invalid_callback_data", { status: 400 });
  }
  return value;
}

export function parseCampaignCallbackData(value) {
  if (typeof value !== "string" || new TextEncoder().encode(value).byteLength > 64) return null;
  const match = value.match(CALLBACK_PATTERN);
  if (!match) return null;
  return { action: CODE_ACTIONS[match[1].toLowerCase()], campaignId: `campaign_${match[2]}` };
}

export function splitTelegramText(text, limit = SAFE_CHUNK_LIMIT) {
  if (text === undefined || text === null) return [];
  const normalized = String(text).trim();
  if (!normalized) return [];
  if (normalized.length <= limit) return [normalized];
  const chunks = [];
  let remaining = normalized;
  while (remaining.length > limit) {
    let cut = remaining.lastIndexOf("\n", limit);
    if (cut < Math.floor(limit * 0.5)) cut = remaining.lastIndexOf(" ", limit);
    if (cut < 1) cut = limit;
    const previousCodeUnit = remaining.charCodeAt(cut - 1);
    if (previousCodeUnit >= 0xd800 && previousCodeUnit <= 0xdbff) cut -= 1;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function validateInlineKeyboard(keyboard) {
  for (const row of keyboard?.inline_keyboard ?? []) {
    for (const button of row) {
      if (new TextEncoder().encode(button.callback_data || "").byteLength > 64) {
        throw new ServiceError("invalid_callback_data", { status: 400 });
      }
    }
  }
}

export function validateTelegramUpdate(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false };
  const keys = Object.keys(value);
  if (keys.some((key) => !["update_id", "callback_query"].includes(key))) return { ok: false };
  if (!Number.isSafeInteger(value.update_id) || value.update_id < 0) return { ok: false };
  const callback = value.callback_query;
  if (!callback || typeof callback !== "object" || Array.isArray(callback)) return { ok: false };
  if (Object.keys(callback).some((key) => !["id", "from", "message", "data", "chat_instance"].includes(key))) {
    return { ok: false };
  }
  if (typeof callback.id !== "string" || callback.id.length < 1 || callback.id.length > 256) return { ok: false };
  if (!callback.from || !Number.isSafeInteger(callback.from.id)) return { ok: false };
  if (!callback.message?.chat || !Number.isSafeInteger(callback.message.chat.id)) return { ok: false };
  const parsed = parseCampaignCallbackData(callback.data);
  if (!parsed) return { ok: false };
  return {
    ok: true,
    value: {
      updateId: String(value.update_id),
      callbackId: callback.id,
      userId: String(callback.from.id),
      chatId: String(callback.message.chat.id),
      ...parsed,
    },
  };
}

export class TelegramService {
  constructor(env, { fetcher = fetch } = {}) {
    this.env = env;
    this.fetcher = fetcher;
  }

  async request(method, body, requestId, { multipart = false } = {}) {
    if (!isTelegramConfigured(this.env)) {
      throw new ServiceError("telegram_not_configured", { status: 503 });
    }
    const startedAt = Date.now();
    return retryWithBackoff(async (attempt) => {
      const response = await fetchWithTimeout(
        this.fetcher,
        `https://api.telegram.org/bot${this.env.TELEGRAM_BOT_TOKEN}/${method}`,
        {
          method: "POST",
          ...(multipart ? {} : { headers: { "content-type": "application/json" } }),
          body: multipart ? body : JSON.stringify(body),
        },
        getIntegerEnv(this.env, "TELEGRAM_TIMEOUT_MS", 5000, { min: 1000, max: 30_000 })
      );
      if (!response.ok) {
        throw new ServiceError(`telegram_http_${response.status}`, {
          status: 502,
          retryable: isRetryableStatus(response.status),
        });
      }
      const payload = await response.json().catch(() => null);
      if (!payload?.ok) throw new ServiceError("telegram_invalid_response", { status: 502 });
      logEvent("info", "provider_request_succeeded", {
        requestId,
        provider: "telegram",
        attempt,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      return payload.result;
    }, {
      maxAttempts: getIntegerEnv(this.env, "TELEGRAM_MAX_ATTEMPTS", 3, { min: 1, max: 5 }),
      baseDelayMs: getIntegerEnv(this.env, "RETRY_BASE_DELAY_MS", 250, { min: 1, max: 5000 }),
      maxDelayMs: 5000,
      onRetry: ({ attempt, delayMs, error }) => logEvent("warn", "provider_request_retry", {
        requestId,
        provider: "telegram",
        attempt,
        retryInMs: delayMs,
        code: error?.code || "provider_error",
      }),
    });
  }

  async sendText(text, { replyMarkup, requestId, chatId = this.env.TELEGRAM_ADMIN_CHAT_ID } = {}) {
    const chunks = splitTelegramText(text);
    let result = null;
    for (let index = 0; index < chunks.length; index += 1) {
      result = await this.request("sendMessage", {
        chat_id: chatId,
        text: chunks[index].slice(0, TELEGRAM_TEXT_LIMIT),
        disable_web_page_preview: true,
        ...(replyMarkup && index === chunks.length - 1 ? { reply_markup: replyMarkup } : {}),
      }, requestId);
    }
    return result;
  }

  sendInlineKeyboard(text, keyboard, requestId) {
    validateInlineKeyboard(keyboard);
    return this.sendText(text, { replyMarkup: keyboard, requestId });
  }

  sendPhoto(
    { bytes, mimeType, filename = "campaign-main-image" },
    { caption, replyMarkup, requestId, chatId = this.env.TELEGRAM_ADMIN_CHAT_ID } = {}
  ) {
    if (!(bytes instanceof Uint8Array) || bytes.byteLength < 1) {
      throw new ServiceError("invalid_image_output", { status: 502 });
    }
    validateInlineKeyboard(replyMarkup);
    const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
    const form = new FormData();
    form.append("chat_id", String(chatId));
    const captionChunk = splitTelegramText(caption, TELEGRAM_CAPTION_LIMIT)[0];
    if (captionChunk) form.append("caption", captionChunk);
    if (replyMarkup) form.append("reply_markup", JSON.stringify(replyMarkup));
    form.append("photo", new Blob([bytes], { type: mimeType }), `${filename}.${extension}`);
    return this.request("sendPhoto", form, requestId, { multipart: true });
  }

  answerCallbackQuery(callbackQueryId, text, requestId) {
    return this.request("answerCallbackQuery", {
      callback_query_id: callbackQueryId,
      text: String(text || "").slice(0, 200),
    }, requestId);
  }
}

export function campaignApprovalKeyboard(campaignId) {
  return {
    inline_keyboard: [
      [
        { text: "Approve", callback_data: createCampaignCallbackData("approve", campaignId) },
        { text: "Reject", callback_data: createCampaignCallbackData("reject", campaignId) },
      ],
      [
        { text: "Regenerate", callback_data: createCampaignCallbackData("regenerate", campaignId) },
        { text: "View Details", callback_data: createCampaignCallbackData("view", campaignId) },
      ],
    ],
  };
}
