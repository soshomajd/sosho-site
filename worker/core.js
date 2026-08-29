export const WEBSITE_CHAT_REQUEST_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["conversationId", "locale", "message"],
  properties: {
    conversationId: {
      type: "string",
      pattern:
        "^conv_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$",
    },
    locale: { type: "string", enum: ["fa", "en"] },
    message: { type: "string", minLength: 1, maxLength: 2000 },
  },
};

export const SALES_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "reply",
    "stage",
    "projectType",
    "recommendedTier",
    "extracted",
    "missingFields",
    "quickReplies",
    "isComplete",
    "confidence",
  ],
  properties: {
    reply: { type: "string" },
    stage: {
      type: "string",
      enum: ["discovery", "qualification", "proposal_ready", "handoff"],
    },
    projectType: {
      type: "string",
      enum: [
        "landing",
        "corporate",
        "ecommerce",
        "booking",
        "marketplace",
        "portfolio",
        "blog_media",
        "learning",
        "webapp_saas",
        "ai",
        "web3",
        "other",
        "unknown",
      ],
    },
    recommendedTier: {
      type: "string",
      enum: ["economic", "professional", "exclusive", "unknown"],
    },
    extracted: {
      type: "object",
      additionalProperties: false,
      required: [
        "businessName",
        "businessActivity",
        "goal",
        "pagesAndFeatures",
        "designStyle",
        "contentStatus",
        "languages",
        "budgetToman",
        "deadline",
        "contactName",
        "phone",
        "preferredChannel",
      ],
      properties: {
        businessName: { type: ["string", "null"] },
        businessActivity: { type: ["string", "null"] },
        goal: { type: ["string", "null"] },
        pagesAndFeatures: { type: ["string", "null"] },
        designStyle: { type: ["string", "null"] },
        contentStatus: { type: ["string", "null"] },
        languages: { type: ["string", "null"] },
        budgetToman: { type: ["string", "null"] },
        deadline: { type: ["string", "null"] },
        contactName: { type: ["string", "null"] },
        phone: { type: ["string", "null"] },
        preferredChannel: { type: ["string", "null"] },
      },
    },
    missingFields: { type: "array", items: { type: "string" } },
    quickReplies: { type: "array", items: { type: "string" } },
    isComplete: { type: "boolean" },
    confidence: { type: "number" },
  },
};

const WEBSITE_CHAT_KEYS = Object.keys(WEBSITE_CHAT_REQUEST_SCHEMA.properties);
const WEBSITE_CHAT_KEY_SET = new Set(WEBSITE_CHAT_KEYS);
const WEBSITE_LOCALES = new Set(WEBSITE_CHAT_REQUEST_SCHEMA.properties.locale.enum);
const CONVERSATION_ID_PATTERN = new RegExp(
  WEBSITE_CHAT_REQUEST_SCHEMA.properties.conversationId.pattern,
  "i"
);
const STAGES = new Set(["discovery", "qualification", "proposal_ready", "handoff"]);
const PROJECT_TYPES = new Set([
  "landing",
  "corporate",
  "ecommerce",
  "booking",
  "marketplace",
  "portfolio",
  "blog_media",
  "learning",
  "webapp_saas",
  "ai",
  "web3",
  "other",
  "unknown",
]);
const TIERS = new Set(["economic", "professional", "exclusive", "unknown"]);
export const EXTRACTED_FIELDS = [
  "businessName",
  "businessActivity",
  "goal",
  "pagesAndFeatures",
  "designStyle",
  "contentStatus",
  "languages",
  "budgetToman",
  "deadline",
  "contactName",
  "phone",
  "preferredChannel",
];
const EXTRACTED_FIELD_SET = new Set(EXTRACTED_FIELDS);

const SAFE_LOG_FIELDS = new Set([
  "requestId",
  "provider",
  "providerRequestId",
  "providerErrorType",
  "providerErrorCode",
  "attempt",
  "status",
  "code",
  "durationMs",
  "retryInMs",
  "channel",
  "ready",
  "count",
]);

export class ServiceError extends Error {
  constructor(code, { status = 500, retryable = false } = {}) {
    super(code);
    this.name = "ServiceError";
    this.code = code;
    this.status = status;
    this.retryable = retryable;
  }
}

export function isPlainRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parseJson(value, fallback = {}) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function createConversationId() {
  return createId("conv");
}

export function isConversationId(value) {
  return typeof value === "string" && CONVERSATION_ID_PATTERN.test(value);
}

export function validateWebsiteChatInput(input) {
  const issues = [];
  if (!isPlainRecord(input)) {
    return { ok: false, issues: [{ path: "$", code: "object_required" }] };
  }

  for (const key of Object.keys(input)) {
    if (!WEBSITE_CHAT_KEY_SET.has(key)) issues.push({ path: key, code: "unknown_field" });
  }

  if (!isConversationId(input.conversationId)) {
    issues.push({ path: "conversationId", code: "invalid_conversation_id" });
  }
  if (!WEBSITE_LOCALES.has(input.locale)) {
    issues.push({ path: "locale", code: "invalid_locale" });
  }
  if (typeof input.message !== "string") {
    issues.push({ path: "message", code: "string_required" });
  }

  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (
    typeof input.message === "string" &&
    (message.length < WEBSITE_CHAT_REQUEST_SCHEMA.properties.message.minLength ||
      input.message.length > WEBSITE_CHAT_REQUEST_SCHEMA.properties.message.maxLength)
  ) {
    issues.push({ path: "message", code: "invalid_length" });
  }

  if (issues.length > 0) return { ok: false, issues };
  return {
    ok: true,
    value: {
      conversationId: input.conversationId,
      locale: input.locale,
      message,
    },
  };
}

function hasExactKeys(value, keys) {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function isNullableBoundedString(value, maxLength = 500) {
  return value === null || (typeof value === "string" && value.length <= maxLength);
}

export function findBusinessPolicyViolation(reply) {
  if (typeof reply !== "string") return "reply_not_string";

  const digits = "0-9۰-۹٠-٩";
  const currencyAmount = new RegExp(
    `[${digits}][${digits}\\s,.٬]{0,20}(?:تومان|ریال|دلار|یورو|usd|eur|tomans?|rials?)`,
    "iu"
  );
  const labelledAmount = new RegExp(
    `(?:قیمت|هزینه|مبلغ|price|cost|fee)\\s*(?:قطعی|نهایی|exact|final|is|will be|:|-)?\\s*[$€£]?[${digits}]`,
    "iu"
  );
  const deliveryPromise = new RegExp(
    `(?:تحویل|آماده|تکمیل|deliver|complete|finish).{0,28}(?:ظرف|در|within|in)\\s*[$€£]?[${digits}].{0,12}(?:روز|هفته|ماه|day|week|month)`,
    "iu"
  );
  const guarantee = /(?:تضمین می(?:‌|\s)*کن(?:م|یم)|قول می(?:‌|\s)*ده(?:م|یم)|we guarantee|i guarantee|we promise|i promise)/iu;

  if (currencyAmount.test(reply) || labelledAmount.test(reply)) return "invented_price";
  if (deliveryPromise.test(reply)) return "invented_delivery_commitment";
  if (guarantee.test(reply)) return "unsupported_guarantee";
  return null;
}

export function validateSalesResponse(value) {
  const rootKeys = [
    "reply",
    "stage",
    "projectType",
    "recommendedTier",
    "extracted",
    "missingFields",
    "quickReplies",
    "isComplete",
    "confidence",
  ];
  if (!isPlainRecord(value) || !hasExactKeys(value, rootKeys)) {
    return { ok: false, code: "invalid_response_shape" };
  }
  if (typeof value.reply !== "string" || value.reply.trim().length < 1 || value.reply.length > 1800) {
    return { ok: false, code: "invalid_reply" };
  }
  if (!STAGES.has(value.stage)) return { ok: false, code: "invalid_stage" };
  if (!PROJECT_TYPES.has(value.projectType)) return { ok: false, code: "invalid_project_type" };
  if (!TIERS.has(value.recommendedTier)) return { ok: false, code: "invalid_tier" };
  if (!isPlainRecord(value.extracted) || !hasExactKeys(value.extracted, EXTRACTED_FIELDS)) {
    return { ok: false, code: "invalid_extracted_fields" };
  }
  for (const [key, fieldValue] of Object.entries(value.extracted)) {
    const maxLength = key === "phone" ? 100 : 500;
    if (!isNullableBoundedString(fieldValue, maxLength)) {
      return { ok: false, code: "invalid_extracted_value" };
    }
  }
  if (
    !Array.isArray(value.missingFields) ||
    value.missingFields.length > EXTRACTED_FIELDS.length ||
    value.missingFields.some((field) => typeof field !== "string" || !EXTRACTED_FIELD_SET.has(field))
  ) {
    return { ok: false, code: "invalid_missing_fields" };
  }
  if (
    !Array.isArray(value.quickReplies) ||
    value.quickReplies.length > 4 ||
    value.quickReplies.some((reply) => typeof reply !== "string" || reply.length < 1 || reply.length > 120)
  ) {
    return { ok: false, code: "invalid_quick_replies" };
  }
  if (typeof value.isComplete !== "boolean") return { ok: false, code: "invalid_completion" };
  if (typeof value.confidence !== "number" || value.confidence < 0 || value.confidence > 1) {
    return { ok: false, code: "invalid_confidence" };
  }

  const policyViolation = findBusinessPolicyViolation(value.reply);
  if (policyViolation) return { ok: false, code: policyViolation };
  return { ok: true, value: { ...value, reply: value.reply.trim() } };
}

export function fallbackReply(locale, messageCount) {
  const fa = locale === "fa";
  const questions = fa
    ? [
        ["هدف اصلی شما از ساخت سایت چیست؟", ["فروش بیشتر", "معرفی برند", "ارائه خدمات"]],
        ["چه امکانات مهمی باید داخل سایت وجود داشته باشد؟", ["فرم تماس", "فروش آنلاین", "رزرو آنلاین"]],
        ["تقریباً به چند صفحه نیاز دارید؟", ["۱ تا ۵ صفحه", "۶ تا ۱۲ صفحه", "هنوز نمی‌دانم"]],
        ["چه سبک طراحی را می‌پسندید؟ اگر نمونه‌ای دارید لینک آن را بفرستید.", ["مینیمال", "لوکس", "خلاق و متفاوت"]],
        ["متن، لوگو و تصاویر سایت آماده هستند؟", ["همه آماده است", "بخشی آماده است", "نیاز به تولید محتوا دارم"]],
        ["حدود بودجه‌ای که برای پروژه در نظر گرفته‌اید چقدر است؟", ["اقتصادی", "حرفه‌ای", "اختصاصی"]],
        ["چه زمانی می‌خواهید سایت آماده شود؟", ["کمتر از یک ماه", "۱ تا ۲ ماه", "زمان انعطاف‌پذیر است"]],
        ["برای تکمیل درخواست، نام و شماره تماس خود را بفرستید.", []],
      ]
    : [
        ["What is the main goal of your website?", ["More sales", "Brand presence", "Offer services"]],
        ["Which important features should the website include?", ["Contact forms", "Online sales", "Online booking"]],
        ["Roughly how many pages do you need?", ["1–5 pages", "6–12 pages", "Not sure yet"]],
        ["Which design style do you prefer? Share a reference link if you have one.", ["Minimal", "Premium", "Bold and creative"]],
        ["Are the copy, logo, and images ready?", ["Everything is ready", "Partly ready", "I need content support"]],
        ["Which budget level fits the project?", ["Economic", "Professional", "Exclusive"]],
        ["When would you like the website to be ready?", ["Under one month", "1–2 months", "Flexible"]],
        ["Please send your name and phone number to complete the request.", []],
      ];

  const numericCount = Number.isFinite(Number(messageCount)) ? Number(messageCount) : 1;
  const index = Math.max(0, Math.min(Math.floor(numericCount) - 1, questions.length));
  const complete = index >= questions.length;
  return {
    reply: complete
      ? fa
        ? "ممنون. اطلاعات اولیه ثبت شد. خلاصه نیازمندی و پیشنهاد مناسب برای شما آماده می‌شود."
        : "Thank you. Your initial request is registered and we’ll prepare the right scope and recommendation."
      : questions[index][0],
    stage: complete ? "proposal_ready" : "discovery",
    projectType: "unknown",
    recommendedTier: "unknown",
    extracted: Object.fromEntries(EXTRACTED_FIELDS.map((field) => [field, null])),
    missingFields: [],
    quickReplies: complete ? [] : questions[index][1],
    isComplete: complete,
    confidence: 0,
  };
}

export function getIntegerEnv(env, name, fallback, { min = 1, max = 1_000_000 } = {}) {
  const raw = env?.[name];
  if (raw === undefined || raw === null || raw === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return fallback;
  return parsed;
}

export function addDaysIso(date, days) {
  return new Date(date.getTime() + days * 86_400_000).toISOString();
}

export function getWindowStart(nowMs, windowSeconds) {
  const windowMs = windowSeconds * 1000;
  return Math.floor(nowMs / windowMs) * windowMs;
}

export async function hashIdentifier(value, salt = "") {
  const encoded = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function logEvent(level, event, details = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    level,
    event,
  };
  for (const [key, value] of Object.entries(details)) {
    if (SAFE_LOG_FIELDS.has(key) && value !== undefined && value !== null) record[key] = value;
  }
  const writer = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  writer(JSON.stringify(record));
}

function safeProviderDiagnostic(value, maxLength = 100) {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  if (
    normalized.length < 1 ||
    normalized.length > maxLength ||
    !/^[a-z0-9_.:-]+$/iu.test(normalized)
  ) {
    return undefined;
  }
  return normalized;
}

async function readBoundedResponseText(response, maxBytes) {
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (declaredLength > maxBytes || !response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return "";
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } catch {
    return "";
  }
}

export async function readOpenAIErrorDiagnostics(response, maxBytes = 16_384) {
  const diagnostics = {};
  const providerRequestId = safeProviderDiagnostic(
    response.headers.get("x-request-id"),
    200
  );
  if (providerRequestId) diagnostics.providerRequestId = providerRequestId;

  const text = await readBoundedResponseText(response, maxBytes);
  if (!text) return diagnostics;

  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    return diagnostics;
  }
  const providerError = isPlainRecord(payload) && isPlainRecord(payload.error)
    ? payload.error
    : null;
  if (!providerError) return diagnostics;

  const providerErrorType = safeProviderDiagnostic(providerError.type);
  const providerErrorCode = safeProviderDiagnostic(providerError.code);
  if (providerErrorType) diagnostics.providerErrorType = providerErrorType;
  if (providerErrorCode) diagnostics.providerErrorCode = providerErrorCode;
  return diagnostics;
}

export function isRetryableStatus(status) {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

function defaultSleep(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function retryWithBackoff(operation, options = {}) {
  const maxAttempts = Math.max(1, options.maxAttempts ?? 3);
  const baseDelayMs = Math.max(0, options.baseDelayMs ?? 250);
  const maxDelayMs = Math.max(baseDelayMs, options.maxDelayMs ?? 4000);
  const sleep = options.sleep ?? defaultSleep;

  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      const retryable = options.shouldRetry ? options.shouldRetry(error) : error?.retryable === true;
      if (!retryable || attempt >= maxAttempts) throw error;
      const delayMs = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
      options.onRetry?.({ attempt, delayMs, error });
      await sleep(delayMs);
    }
  }
  throw lastError;
}

export async function fetchWithTimeout(fetcher, url, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);
  try {
    return await fetcher(url, { ...init, signal: controller.signal });
  } catch {
    if (controller.signal.aborted) {
      throw new ServiceError("provider_timeout", { status: 504, retryable: true });
    }
    throw new ServiceError("provider_network_error", { status: 502, retryable: true });
  } finally {
    clearTimeout(timer);
  }
}
