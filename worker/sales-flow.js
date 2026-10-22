// The Sales Chat has exactly three steps: which kind of site, the budget band, then the
// customer's full name and phone number so the team can call them back. The application
// asks every question and shows the answer options itself; the model only writes one
// short sentence in reply to what the customer just said and extracts fields. That keeps
// the chat short, stops the model from repeating or inventing questions, and never
// puts a price in a reply (the budget bands are options the customer picks, not quotes).

export const SITE_TYPES = {
  fa: [
    ["فروشگاه اینترنتی", "ecommerce"],
    ["سایت شرکتی", "corporate"],
    ["صفحه فرود (لندینگ)", "landing"],
    ["نمونه‌کار و پورتفولیو", "portfolio"],
    ["رزرو و نوبت‌دهی آنلاین", "booking"],
    ["مارکت‌پلیس", "marketplace"],
    ["آموزش آنلاین", "learning"],
    ["وب‌اپ یا سیستم اختصاصی", "webapp_saas"],
    ["هوش مصنوعی یا وب۳", "ai"],
    ["سایر", "other"],
  ],
  en: [
    ["Online store", "ecommerce"],
    ["Company website", "corporate"],
    ["Landing page", "landing"],
    ["Portfolio", "portfolio"],
    ["Online booking", "booking"],
    ["Marketplace", "marketplace"],
    ["Online courses", "learning"],
    ["Custom web app or system", "webapp_saas"],
    ["AI or Web3", "ai"],
    ["Other", "other"],
  ],
};

export const BUDGETS = {
  fa: [
    "حدود ۵۰ میلیون تومان",
    "حدود ۱۰۰ میلیون تومان",
    "حدود ۱۵۰ میلیون تومان",
    "حدود ۲۰۰ میلیون تومان",
    "بالای ۳۰۰ میلیون تومان",
  ],
  en: [
    "About 50 million Toman",
    "About 100 million Toman",
    "About 150 million Toman",
    "About 200 million Toman",
    "Over 300 million Toman",
  ],
};

const TEXT = {
  fa: {
    type: "چه نوع سایتی نیاز دارید؟",
    budget: "بودجه‌ای که برای این پروژه در نظر دارید در کدام بازه است؟",
    contact: "برای هماهنگی، لطفاً نام و نام خانوادگی و شماره تماس خود را بفرستید.",
    name: "لطفاً نام و نام خانوادگی خود را هم بفرستید.",
    phone: "لطفاً شماره تماس خود را هم بفرستید.",
    thanks: (name) => `ممنون${name ? ` ${name}` : ""}! درخواست شما ثبت شد و همکاران ما به‌زودی با شما تماس می‌گیرند.`,
    closing: "همکاران ما به‌زودی با شما تماس می‌گیرند.",
    unknownBudget: "نامشخص",
  },
  en: {
    type: "What kind of website do you need?",
    budget: "Which budget range do you have in mind for this project?",
    contact: "To arrange a call, please send your full name and phone number.",
    name: "Please send your full name as well.",
    phone: "Please send your phone number as well.",
    thanks: (name) => `Thank you${name ? `, ${name}` : ""}! Your request is registered and our team will contact you shortly.`,
    closing: "Our team will contact you shortly.",
    unknownBudget: "not stated",
  },
};

const DIGIT_MAP = new Map([..."۰۱۲۳۴۵۶۷۸۹"].map((d, i) => [d, String(i)]).concat([..."٠١٢٣٤٥٦٧٨٩"].map((d, i) => [d, String(i)])));
const toAsciiDigits = (value) => String(value ?? "").replace(/[۰-۹٠-٩]/gu, (d) => DIGIT_MAP.get(d) ?? d);

// Filler openers and any sentence that asks for information: the application asks the
// questions itself, so a model sentence like "please enter your phone" would double up.
const BANNED_OPENER =
  /(?:درک\s*(?:می‌?\s*کنم|کردم)|فهمیدم|متوجه\s*شدم|می‌?فهمم|لطفا|لطفاً|وارد\s*کنید|بفرستید|ارسال\s*کنید|بگویید|تماس\s*می‌?گیر|اینستاگرام|contact you|will call|instagram|i understand|i see|understood|got it|please|enter your|send us|tell us)/iu;

// Compare typed or tapped text with option labels ignoring Arabic/Persian letter variants, digits and spacing.
function canon(value) {
  return toAsciiDigits(value)
    .replace(/[يى]/gu, "ی")
    .replace(/ك/gu, "ک")
    .replace(/[‌‎‏]/gu, "")
    .replace(/\s+/gu, " ")
    .trim()
    .toLowerCase();
}

export function digitsOf(value) {
  return toAsciiDigits(value).replace(/\D/gu, "");
}

export function isValidPhone(value) {
  const digits = digitsOf(value);
  return digits.length >= 10 && digits.length <= 14;
}

function isValidName(value) {
  return typeof value === "string" && value.trim().length >= 2 && !/^[\d\s+()-]+$/u.test(toAsciiDigits(value));
}

function findPhone(message) {
  const match = toAsciiDigits(message).match(/\+?\d[\d\s().-]{8,16}\d/u);
  return match && isValidPhone(match[0]) ? match[0].trim() : null;
}

/** First one or two sentences of the model's reply that are not questions or "I understand" filler. */
export function leadSentence(text) {
  const parts = String(text ?? "")
    .replace(/\s+/gu, " ")
    .trim()
    .split(/(?<=[.!؟?۔])\s+/u);
  const kept = parts.filter((part) => part && !/[؟?]/u.test(part) && !BANNED_OPENER.test(part));
  return (kept[0] ?? "").slice(0, 160).trim();
}

/** Scripted reply used when no model answered (no AI configured, or it failed). */
export function scriptedFlowReply(locale, messageCount) {
  const t = TEXT[locale === "fa" ? "fa" : "en"];
  const lang = locale === "fa" ? "fa" : "en";
  const count = Number.isFinite(Number(messageCount)) ? Math.floor(Number(messageCount)) : 1;
  // The widget greeting already asked for the site type, so the first answer moves on to budget.
  if (count <= 1) return { reply: t.budget, quickReplies: [...BUDGETS[lang]], stage: "qualification", isComplete: false };
  if (count === 2) return { reply: t.contact, quickReplies: [], stage: "qualification", isComplete: false };
  return { reply: t.thanks(""), quickReplies: [], stage: "proposal_ready", isComplete: true };
}

/**
 * Applies the three-step flow to a model result and the lead profile.
 * Returns the result to store/send and the updated profile.
 */
export function applySalesFlow({ locale, result, profile, lastUserMessage, messageCount }) {
  const lang = locale === "fa" ? "fa" : "en";
  const t = TEXT[lang];
  const message = String(lastUserMessage ?? "").trim();
  const next = { ...profile };

  const chip = SITE_TYPES[lang].find(([label]) => canon(label) === canon(message));
  if (chip) next.projectType = chip[1];
  else if (!next.projectType && result.projectType && result.projectType !== "unknown") {
    next.projectType = result.projectType;
  }
  // Do not loop on a customer who cannot or will not answer a step.
  if (!next.projectType && messageCount >= 3) next.projectType = "other";

  const budgetChip = BUDGETS[lang].find((label) => canon(label) === canon(message));
  if (budgetChip) next.budgetToman = budgetChip;
  if (!next.budgetToman && messageCount >= 5) next.budgetToman = t.unknownBudget;

  if (!isValidPhone(next.phone)) {
    const phone = findPhone(message);
    if (phone) next.phone = phone;
    else delete next.phone;
  }
  if (next.phone) next.phone = toAsciiDigits(next.phone).trim();
  if (!isValidName(next.contactName)) delete next.contactName;

  // The model's sentence is only a lead-in for a real, free-text message (a question or a
  // few words about the project). After a tapped option, a greeting or a thank-you it adds
  // nothing and has been seen to invent or repeat text, so the fixed question stands alone.
  const wordCount = message.split(/\s+/u).filter(Boolean).length;
  const lead = chip || budgetChip || wordCount < 3 ? "" : leadSentence(result.reply);
  const sentence = lead && !/[.!۔]$/u.test(lead) ? `${lead}.` : lead;
  const compose = (question) => [sentence, question].filter(Boolean).join(" ");
  let reply;
  let quickReplies = [];
  let complete = false;

  if (!next.projectType) {
    reply = compose(t.type);
    quickReplies = SITE_TYPES[lang].map(([label]) => label);
  } else if (!next.budgetToman) {
    reply = compose(t.budget);
    quickReplies = [...BUDGETS[lang]];
  } else if (!next.contactName || !next.phone) {
    reply = compose(!next.contactName && !next.phone ? t.contact : !next.contactName ? t.name : t.phone);
  } else {
    complete = true;
    reply = next.flowDone ? compose(t.closing) : t.thanks(String(next.contactName).trim());
    next.flowDone = true;
  }

  return {
    profile: next,
    result: {
      ...result,
      reply,
      quickReplies,
      stage: complete ? "proposal_ready" : "qualification",
      isComplete: complete,
      projectType: next.projectType ?? "unknown",
    },
  };
}
