// Structured question flow of the project consultant ("برآورد هوشمند پروژه").
// The Worker owns every question and option so the frontend, the AI interpreter and the
// pricing engine all work from one list. Six main questions, at most one follow-up.

const L = (fa, en) => ({ fa, en });

export const PROJECT_TYPES = ["corporate", "ecommerce", "portfolio", "booking", "education", "platform", "unsure"];

export const PROJECT_TYPE_OPTIONS = [
  { id: "corporate", label: L("سایت شرکتی", "Company website") },
  { id: "ecommerce", label: L("فروشگاه اینترنتی", "Online store") },
  { id: "portfolio", label: L("سایت شخصی یا نمونه‌کار", "Personal or portfolio site") },
  { id: "booking", label: L("سایت رزرو و خدمات", "Booking and services site") },
  { id: "education", label: L("سایت آموزشی", "Education site") },
  { id: "platform", label: L("پلتفرم یا وب‌اپلیکیشن اختصاصی", "Custom platform or web app") },
  { id: "unsure", label: L("هنوز مطمئن نیستم", "Not sure yet") },
];

export const GOAL_OPTIONS = [
  { id: "brand", label: L("معرفی برند", "Present the brand") },
  { id: "leads", label: L("جذب مشتری و دریافت سفارش", "Win customers and enquiries") },
  { id: "sales", label: L("فروش اینترنتی", "Sell online") },
  { id: "booking", label: L("رزرو خدمات", "Take bookings") },
  { id: "education", label: L("ارائه محتوای آموزشی", "Deliver learning content") },
  { id: "operations", label: L("مدیریت کاربران و فرایندها", "Manage users and processes") },
  { id: "other", label: L("هدف دیگری دارم", "Something else") },
];

/** Every feature the consultant knows. `core` features stay in the economic tier when chosen. */
export const FEATURES = {
  online_payment: { label: L("پرداخت آنلاین", "Online payment"), core: true },
  user_accounts: { label: L("حساب کاربری", "User accounts"), core: true },
  cart: { label: L("سبد خرید", "Shopping cart"), core: true },
  product_filters: { label: L("فیلتر و جستجوی محصولات", "Product filters and search"), core: true },
  inventory: { label: L("مدیریت موجودی", "Stock management"), core: false },
  shipping_tracking: { label: L("ارسال و پیگیری سفارش", "Shipping and order tracking"), core: false },
  services_pages: { label: L("معرفی خدمات", "Service pages"), core: true },
  portfolio: { label: L("نمونه‌کارها", "Portfolio"), core: true },
  blog: { label: L("وبلاگ", "Blog"), core: false },
  consultation_form: { label: L("فرم درخواست مشاوره", "Consultation request form"), core: true },
  multilingual: { label: L("چندزبانه", "Multiple languages"), core: false },
  cms: { label: L("پنل مدیریت محتوا", "Content management panel"), core: true },
  booking_calendar: { label: L("تقویم رزرو", "Booking calendar"), core: true },
  user_panel: { label: L("پنل کاربران", "User panel"), core: true },
  notifications: { label: L("پیامک یا ایمیل اطلاع‌رسانی", "SMS or email notifications"), core: false },
  capacity: { label: L("مدیریت ظرفیت", "Capacity management"), core: false },
  roles: { label: L("نقش‌ها و سطح دسترسی", "Roles and permissions"), core: true },
  dashboard: { label: L("داشبورد", "Dashboard"), core: true },
  api_integration: { label: L("اتصال API", "API integration"), core: false },
  ai: { label: L("هوش مصنوعی", "AI features"), core: false },
  web3_wallet: { label: L("کیف پول و Web3", "Wallet and Web3"), core: false },
  course_catalog: { label: L("فهرست دوره‌ها", "Course catalogue"), core: true },
  video_lessons: { label: L("درس‌های ویدیویی", "Video lessons"), core: true },
  quizzes: { label: L("آزمون و تمرین", "Quizzes and exercises"), core: false },
  certificates: { label: L("گواهی پایان دوره", "Completion certificates"), core: false },
  gallery: { label: L("گالری تصاویر", "Image gallery"), core: true },
  contact_form: { label: L("فرم تماس", "Contact form"), core: true },
  seo_setup: { label: L("راه‌اندازی سئو و آنالیتیکس", "SEO and analytics setup"), core: false },
};

/** Options for question 3, by project type ("other" is always added by the client as free text). */
export const FEATURES_BY_TYPE = {
  ecommerce: ["online_payment", "user_accounts", "cart", "product_filters", "inventory", "shipping_tracking", "multilingual", "blog"],
  corporate: ["services_pages", "portfolio", "blog", "consultation_form", "multilingual", "cms"],
  booking: ["booking_calendar", "online_payment", "user_panel", "notifications", "capacity", "multilingual"],
  platform: ["user_panel", "roles", "dashboard", "api_integration", "online_payment", "ai", "web3_wallet"],
  education: ["course_catalog", "video_lessons", "online_payment", "user_accounts", "quizzes", "certificates"],
  portfolio: ["gallery", "portfolio", "blog", "contact_form", "multilingual", "cms"],
  unsure: ["consultation_form", "blog", "online_payment", "user_accounts", "multilingual", "cms"],
};

/** Features worth offering in the professional tier when not chosen, with the value they add. */
export const SUGGESTIONS_BY_TYPE = {
  ecommerce: ["product_filters", "shipping_tracking", "seo_setup"],
  corporate: ["blog", "seo_setup"],
  booking: ["notifications", "seo_setup"],
  platform: ["dashboard", "notifications"],
  education: ["quizzes", "seo_setup"],
  portfolio: ["blog", "seo_setup"],
  unsure: [],
};

export const SUGGESTION_REASONS = {
  product_filters: L("مشتری محصول را سریع‌تر پیدا می‌کند", "Customers find products faster"),
  shipping_tracking: L("سؤال‌های «سفارشم کجاست» کمتر می‌شود", "Fewer “where is my order” questions"),
  seo_setup: L("صفحه‌ها از روز اول برای گوگل آماده‌اند", "Pages are ready for Google from day one"),
  blog: L("محتوای منظم برای جذب مخاطب از جست‌وجو", "Regular content to attract search visitors"),
  notifications: L("یادآوری خودکار، غیبت و تماس تلفنی را کم می‌کند", "Automatic reminders reduce no-shows and calls"),
  dashboard: L("وضعیت کار را در یک نگاه می‌بینید", "See the state of the business at a glance"),
  quizzes: L("یادگیری عملی‌تر و ماندگارتر", "More practical, lasting learning"),
};

/** Question 4 depends on the project type; sizes are always s, m, l, xl or unknown. */
export const SIZE_QUESTION = {
  ecommerce: { label: L("تقریباً چند محصول دارید؟", "Roughly how many products do you have?"), bands: ["۱ تا ۵۰|1–50", "۵۰ تا ۲۰۰|50–200", "۲۰۰ تا ۱۰۰۰|200–1,000", "بیش از ۱۰۰۰|Over 1,000"] },
  corporate: { label: L("چند خدمت یا بخش اصلی دارید؟", "How many services or main sections do you have?"), bands: ["۱ تا ۳|1–3", "۴ تا ۸|4–8", "۹ تا ۱۵|9–15", "بیش از ۱۵|Over 15"] },
  booking: { label: L("چند نوع خدمت یا رزرو ارائه می‌دهید؟", "How many kinds of service or booking do you offer?"), bands: ["۱ تا ۳|1–3", "۴ تا ۱۰|4–10", "۱۱ تا ۳۰|11–30", "بیش از ۳۰|Over 30"] },
  education: { label: L("حدوداً چند دوره دارید؟", "Roughly how many courses do you have?"), bands: ["۱ تا ۵|1–5", "۶ تا ۲۰|6–20", "۲۱ تا ۵۰|21–50", "بیش از ۵۰|Over 50"] },
  platform: { label: L("تقریباً چند نقش کاربری یا بخش اصلی نیاز دارید؟", "Roughly how many user roles or main sections do you need?"), bands: ["۱ تا ۲|1–2", "۳ تا ۵|3–5", "۶ تا ۱۰|6–10", "بیش از ۱۰|Over 10"] },
  portfolio: { label: L("حدوداً چند نمونه‌کار یا بخش نمایش می‌دهید؟", "Roughly how many projects or sections will you show?"), bands: ["۱ تا ۱۰|1–10", "۱۱ تا ۳۰|11–30", "۳۱ تا ۸۰|31–80", "بیش از ۸۰|Over 80"] },
  unsure: { label: L("سایت تقریباً چند بخش اصلی دارد؟", "Roughly how many main sections will the site have?"), bands: ["کم (تا ۵)|Few (up to 5)", "متوسط (۶ تا ۱۲)|Medium (6–12)", "زیاد (۱۳ تا ۳۰)|Many (13–30)", "خیلی زیاد|Very many"] },
};
export const SIZES = ["s", "m", "l", "xl", "unknown"];

export const STYLE_OPTIONS = [
  { id: "minimal", label: L("ساده و مینیمال", "Simple and minimal") },
  { id: "modern", label: L("مدرن و حرفه‌ای", "Modern and professional") },
  { id: "luxury", label: L("لوکس و خاص", "Luxury and distinctive") },
  { id: "creative_motion", label: L("خلاقانه و انیمیشنی", "Creative with motion") },
  { id: "interactive_3d", label: L("سه‌بعدی و تعاملی", "3D and interactive") },
  { id: "reference", label: L("نمونه سایت دارم", "I have a reference site") },
  { id: "suggest", label: L("پیشنهاد شما", "Your suggestion") },
];

export const TIMEFRAME_OPTIONS = [
  { id: "asap", label: L("هر چه زودتر (کمتر از یک ماه)", "As soon as possible (under a month)") },
  { id: "1_2_months", label: L("یک تا دو ماه", "One to two months") },
  { id: "3_plus_months", label: L("سه ماه یا بیشتر", "Three months or more") },
  { id: "flexible", label: L("انعطاف دارم / پیشنهاد شما", "Flexible / your suggestion") },
];

/** Only asked when content matters for the type; the one optional follow-up question. */
export const CONTENT_OPTIONS = [
  { id: "ready", label: L("متن و عکس‌ها آماده است", "Text and images are ready") },
  { id: "partial", label: L("بخشی آماده است", "Some of it is ready") },
  { id: "none", label: L("نیاز به تولید محتوا دارم", "I need content to be created") },
  { id: "unknown", label: L("نمی‌دانم", "I don't know") },
];
export const CONTENT_QUESTION_TYPES = new Set(["corporate", "ecommerce", "education", "portfolio"]);

const TEXT_LIMIT = 500;
const URL_LIMIT = 300;

function cleanText(value, limit = TEXT_LIMIT) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return undefined;
  const text = value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/gu, "").replace(/\s+/gu, " ").trim();
  if (!text) return null;
  return text.length > limit ? undefined : text;
}

/** Accepts only public http(s) URLs; the consultant never fetches them, it only shows them to the team. */
export function cleanReferenceUrl(value) {
  const text = cleanText(value, URL_LIMIT);
  if (!text) return text;
  const candidate = /^https?:\/\//iu.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".") || url.username || url.password) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

/** Budget bands come from the active tariff; without a tariff only "suggest" is offered. */
export function budgetOptions(tariff) {
  const bands = Array.isArray(tariff?.budgetBands) ? tariff.budgetBands : [];
  return [
    ...bands.map((band) => ({ id: band.id, label: band.label })),
    { id: "suggest", label: L("پیشنهاد شما", "Your suggestion") },
  ];
}

/** The public question list for the widget. Never includes rates or internal pricing. */
export function consultantConfig(locale, tariff) {
  const lang = locale === "en" ? "en" : "fa";
  const pick = (list) => list.map((option) => ({ id: option.id, label: option.label[lang] }));
  return {
    questions: {
      projectType: { label: lang === "fa" ? "چه چیزی می‌خواهید بسازید؟" : "What do you want to build?", options: pick(PROJECT_TYPE_OPTIONS) },
      goal: { label: lang === "fa" ? "مهم‌ترین هدف پروژه چیست؟" : "What is the main goal of the project?", options: pick(GOAL_OPTIONS) },
      features: {
        label: lang === "fa" ? "به چه امکاناتی نیاز دارید؟" : "Which features do you need?",
        byType: Object.fromEntries(
          Object.entries(FEATURES_BY_TYPE).map(([type, ids]) => [type, ids.map((id) => ({ id, label: FEATURES[id].label[lang] }))])
        ),
      },
      size: {
        byType: Object.fromEntries(
          Object.entries(SIZE_QUESTION).map(([type, question]) => [
            type,
            {
              label: question.label[lang],
              options: [
                ...question.bands.map((band, index) => ({ id: SIZES[index], label: band.split("|")[lang === "fa" ? 0 : 1] })),
                { id: "unknown", label: lang === "fa" ? "نمی‌دانم" : "I don't know" },
              ],
            },
          ])
        ),
      },
      style: { label: lang === "fa" ? "چه سبک طراحی‌ای می‌پسندید؟" : "Which design style do you like?", options: pick(STYLE_OPTIONS) },
      budget: {
        label: lang === "fa" ? "بودجه و زمان دلخواهتان چقدر است؟" : "What budget and timing do you have in mind?",
        options: budgetOptions(tariff).map((option) => ({ id: option.id, label: option.label?.[lang] ?? option.id })),
        timeframes: pick(TIMEFRAME_OPTIONS),
      },
      content: {
        label: lang === "fa" ? "محتوای سایت (متن و عکس) چقدر آماده است؟" : "How ready is the site content (text and images)?",
        options: pick(CONTENT_OPTIONS),
        forTypes: [...CONTENT_QUESTION_TYPES],
      },
    },
    currencyLabel: tariff?.currency?.label?.[lang] ?? null,
    pricingConfigured: Boolean(tariff),
  };
}

const ids = (list) => new Set(list.map((option) => option.id));
const TYPE_IDS = ids(PROJECT_TYPE_OPTIONS);
const GOAL_IDS = ids(GOAL_OPTIONS);
const STYLE_IDS = ids(STYLE_OPTIONS);
const TIMEFRAME_IDS = ids(TIMEFRAME_OPTIONS);
const CONTENT_IDS = ids(CONTENT_OPTIONS);
const ANSWER_KEYS = new Set([
  "projectType", "projectTypeNote", "goal", "goalNote", "features", "featuresNote", "size",
  "style", "referenceUrl", "styleNote", "budget", "timeframe", "timeframeNote", "content", "notes",
]);

/**
 * Validates a complete answer set. Returns { ok, value } or { ok: false, issues }.
 * Unknown keys, unknown option ids and over-long text are rejected rather than repaired.
 */
export function validateConsultantAnswers(input, tariff) {
  const issues = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, issues: [{ path: "answers", code: "invalid_type" }] };
  for (const key of Object.keys(input)) if (!ANSWER_KEYS.has(key)) issues.push({ path: key, code: "unknown_field" });

  const value = {};
  if (!TYPE_IDS.has(input.projectType)) issues.push({ path: "projectType", code: "invalid_option" });
  else value.projectType = input.projectType;
  if (!GOAL_IDS.has(input.goal)) issues.push({ path: "goal", code: "invalid_option" });
  else value.goal = input.goal;

  const allowedFeatures = new Set(FEATURES_BY_TYPE[value.projectType] ?? []);
  if (!Array.isArray(input.features) || input.features.length > 12) issues.push({ path: "features", code: "invalid_list" });
  else {
    const unique = [...new Set(input.features)];
    if (unique.some((feature) => !allowedFeatures.has(feature))) issues.push({ path: "features", code: "invalid_option" });
    else value.features = unique;
  }
  if (!SIZES.includes(input.size)) issues.push({ path: "size", code: "invalid_option" });
  else value.size = input.size;
  if (!STYLE_IDS.has(input.style)) issues.push({ path: "style", code: "invalid_option" });
  else value.style = input.style;

  const budgetIds = ids(budgetOptions(tariff));
  if (!budgetIds.has(input.budget)) issues.push({ path: "budget", code: "invalid_option" });
  else value.budget = input.budget;
  if (!TIMEFRAME_IDS.has(input.timeframe)) issues.push({ path: "timeframe", code: "invalid_option" });
  else value.timeframe = input.timeframe;

  if (input.content !== undefined && input.content !== null) {
    if (!CONTENT_IDS.has(input.content)) issues.push({ path: "content", code: "invalid_option" });
    else value.content = input.content;
  }
  if (!value.content) value.content = "unknown";

  for (const key of ["projectTypeNote", "goalNote", "featuresNote", "styleNote", "timeframeNote", "notes"]) {
    const text = cleanText(input[key]);
    if (text === undefined) issues.push({ path: key, code: "invalid_text" });
    else if (text) value[key] = text;
  }
  const url = cleanReferenceUrl(input.referenceUrl);
  if (url === undefined) issues.push({ path: "referenceUrl", code: "invalid_url" });
  else if (url) value.referenceUrl = url;
  if (value.goal === "other" && !value.goalNote) value.goalNote = null;

  return issues.length ? { ok: false, issues } : { ok: true, value };
}

/** Label lookup for reports and the summary card. */
export function labelFor(kind, id, locale) {
  const lang = locale === "en" ? "en" : "fa";
  const lists = { projectType: PROJECT_TYPE_OPTIONS, goal: GOAL_OPTIONS, style: STYLE_OPTIONS, timeframe: TIMEFRAME_OPTIONS, content: CONTENT_OPTIONS };
  if (kind === "feature") return FEATURES[id]?.label[lang] ?? id;
  return lists[kind]?.find((option) => option.id === id)?.label[lang] ?? id;
}

export function sizeLabel(projectType, size, locale) {
  const lang = locale === "en" ? "en" : "fa";
  if (size === "unknown") return lang === "fa" ? "نامشخص" : "Unknown";
  const band = SIZE_QUESTION[projectType]?.bands[SIZES.indexOf(size)];
  return band ? band.split("|")[lang === "fa" ? 0 : 1] : size;
}
