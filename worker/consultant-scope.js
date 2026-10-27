// Deterministic project scope from validated consultant answers: technology recommendation,
// pages and templates, the economic and professional tiers, complexity, confidence and the
// points that need a human review. No AI and no prices here.
import { FEATURES, SUGGESTIONS_BY_TYPE, SUGGESTION_REASONS } from "./consultant-flow.js";

const L = (fa, en) => ({ fa, en });

export const TEMPLATES = {
  shop: L("فروشگاه و دسته‌بندی", "Shop and category"),
  product: L("صفحه محصول", "Product page"),
  checkout: L("سبد خرید و پرداخت", "Cart and checkout"),
  account: L("حساب کاربری", "User account"),
  order_tracking: L("پیگیری سفارش", "Order tracking"),
  blog: L("فهرست و صفحه مقاله", "Blog list and post"),
  service: L("صفحه خدمت", "Service page"),
  portfolio_item: L("فهرست و صفحه نمونه‌کار", "Portfolio list and item"),
  booking_flow: L("مسیر رزرو", "Booking flow"),
  user_panel: L("پنل کاربر", "User panel"),
  course: L("فهرست و صفحه دوره", "Course list and page"),
  lesson: L("صفحه درس", "Lesson page"),
  quiz: L("آزمون", "Quiz"),
  dashboard: L("داشبورد", "Dashboard"),
  records: L("فهرست و جزئیات داده‌ها", "Record list and detail"),
  roles_admin: L("مدیریت نقش‌ها", "Role management"),
  page: L("صفحه محتوایی عمومی", "General content page"),
};

const STATIC_PAGES = {
  corporate: [L("خانه", "Home"), L("درباره ما", "About"), L("تماس", "Contact"), L("خدمات", "Services")],
  ecommerce: [L("خانه", "Home"), L("درباره ما", "About"), L("تماس", "Contact"), L("قوانین و پرسش‌های متداول", "Terms and FAQ")],
  booking: [L("خانه", "Home"), L("درباره ما", "About"), L("تماس", "Contact"), L("خدمات", "Services")],
  education: [L("خانه", "Home"), L("درباره ما", "About"), L("تماس", "Contact"), L("دوره‌ها", "Courses")],
  platform: [L("صفحه معرفی", "Landing page"), L("ورود و ثبت‌نام", "Sign in and sign up")],
  portfolio: [L("خانه", "Home"), L("درباره من", "About"), L("تماس", "Contact")],
  unsure: [L("خانه", "Home"), L("درباره ما", "About"), L("تماس", "Contact")],
};

/** Upper bound of each size band, per project type. `null` for unknown: the engine widens the range instead. */
const SIZE_COUNTS = {
  corporate: { s: 3, m: 8, l: 15, xl: 20 },
  ecommerce: { s: 50, m: 200, l: 1000, xl: 2000 },
  booking: { s: 3, m: 10, l: 30, xl: 50 },
  education: { s: 5, m: 20, l: 50, xl: 80 },
  platform: { s: 2, m: 5, l: 10, xl: 15 },
  portfolio: { s: 10, m: 30, l: 80, xl: 120 },
  unsure: { s: 5, m: 12, l: 30, xl: 40 },
};
/** Assumed when the size is unknown (the middle band), so the estimate still has a scope. */
const UNKNOWN_SIZE = "m";

const HEAVY_FEATURES = new Set(["api_integration", "ai", "web3_wallet", "roles", "dashboard"]);

function templatesFor(projectType, features) {
  const has = (feature) => features.includes(feature);
  const list = [];
  const add = (id, when = true) => { if (when && !list.includes(id)) list.push(id); };
  switch (projectType) {
    case "ecommerce":
      add("shop"); add("product"); add("checkout", has("cart") || has("online_payment"));
      add("account", has("user_accounts")); add("order_tracking", has("shipping_tracking")); add("blog", has("blog"));
      break;
    case "corporate":
      add("service"); add("portfolio_item", has("portfolio")); add("blog", has("blog"));
      break;
    case "booking":
      add("service"); add("booking_flow", has("booking_calendar")); add("user_panel", has("user_panel"));
      break;
    case "education":
      add("course"); add("lesson", has("video_lessons")); add("quiz", has("quizzes")); add("account", has("user_accounts"));
      break;
    case "platform":
      add("records"); add("dashboard", has("dashboard")); add("user_panel", has("user_panel")); add("roles_admin", has("roles"));
      break;
    case "portfolio":
      add("portfolio_item", has("portfolio") || has("gallery")); add("blog", has("blog"));
      break;
    default:
      add("page"); add("blog", has("blog"));
  }
  return list;
}

function recommendArchitecture(answers) {
  const { projectType, features, style, size } = answers;
  const heavy = features.filter((feature) => HEAVY_FEATURES.has(feature));
  if (projectType === "unsure") {
    return {
      id: null,
      reason: L("نوع پروژه هنوز مشخص نیست؛ انتخاب فناوری بعد از یک جلسه کوتاه کارشناسی انجام می‌شود.", "The project type is not settled yet; the technology is chosen after a short consultation."),
    };
  }
  if (projectType === "platform" || heavy.length > 0) {
    return {
      id: "custom",
      reason: L(
        "منطق اختصاصی، نقش‌های کاربری یا اتصال به سرویس‌های دیگر با توسعه اختصاصی تمیزتر و قابل گسترش‌تر ساخته می‌شود.",
        "Custom logic, user roles or connections to other services are cleaner and easier to extend with custom development."
      ),
    };
  }
  if (style === "interactive_3d" || style === "creative_motion") {
    return {
      id: "custom",
      reason: L(
        "انیمیشن و تجربه سه‌بعدی در کد اختصاصی سبک‌تر و روان‌تر از قالب‌های آماده اجرا می‌شود.",
        "Motion and 3D run lighter and smoother in custom code than in ready-made themes."
      ),
      alternative: { id: "wordpress", note: L("اگر حرکت ساده کافی است، وردپرس هم ممکن است.", "If simple motion is enough, WordPress is also possible.") },
    };
  }
  if (projectType === "ecommerce") {
    return {
      id: "woocommerce",
      reason: L(
        "ووکامرس مدیریت محصول، سفارش و پرداخت را آماده دارد و تیم شما خودش می‌تواند آن را اداره کند.",
        "WooCommerce already handles products, orders and payments, and your team can run it themselves."
      ),
      alternative: size === "xl"
        ? { id: "custom", note: L("با تعداد محصول بسیار زیاد، توسعه اختصاصی هم ارزش بررسی دارد.", "With a very large catalogue, custom development is worth considering.") }
        : undefined,
    };
  }
  if ((projectType === "booking" && features.includes("capacity") && (size === "l" || size === "xl")) ||
      (projectType === "education" && (size === "l" || size === "xl") && (features.includes("quizzes") || features.includes("certificates")))) {
    return {
      id: "custom",
      reason: L(
        "با این حجم و این امکانات، افزونه‌های آماده محدود می‌شوند و منطق اختصاصی پایدارتر است.",
        "At this size and with these features, ready-made plugins become limiting and custom logic is more reliable."
      ),
    };
  }
  return {
    id: "wordpress",
    reason: L(
      "وردپرس برای این نوع سایت سریع راه می‌افتد و تیم شما محتوا را بدون برنامه‌نویس به‌روز می‌کند.",
      "WordPress launches quickly for this kind of site and your team can update content without a developer."
    ),
    alternative: { id: "custom", note: L("اگر بعداً امکانات اختصاصی بخواهید، توسعه اختصاصی هم ممکن است.", "If you later need custom features, custom development is also possible.") },
  };
}

const STYLE_WEIGHT = { minimal: 0, modern: 0, suggest: 0, reference: 1, luxury: 1, creative_motion: 2, interactive_3d: 3 };
const ECONOMIC_STYLE = { minimal: "minimal", modern: "modern", suggest: "modern", reference: "modern", luxury: "modern", creative_motion: "modern", interactive_3d: "modern" };

function complexityOf(answers) {
  const heavy = answers.features.filter((feature) => HEAVY_FEATURES.has(feature)).length;
  const score =
    answers.features.length * 0.6 +
    heavy * 1.5 +
    ({ s: 0, m: 0.5, l: 1.5, xl: 2.5, unknown: 0.5 }[answers.size] ?? 0) +
    (STYLE_WEIGHT[answers.style] ?? 0) +
    (answers.features.includes("multilingual") ? 1 : 0) +
    (answers.projectType === "platform" ? 2 : 0);
  return score < 4 ? "low" : score < 8 ? "medium" : "high";
}

function needsReviewOf(answers) {
  const items = [];
  const push = (fa, en) => items.push(L(fa, en));
  if (answers.projectType === "unsure") push("نوع پروژه هنوز مشخص نیست؛ یک جلسه کوتاه کارشناسی پیشنهاد می‌شود.", "The project type is not settled; a short consultation is recommended.");
  if (answers.size === "unknown") push("ابعاد پروژه مشخص نیست؛ برای برآورد، اندازه متوسط فرض شده است.", "The project size is unknown; a medium size was assumed for the estimate.");
  if (answers.content === "unknown" || answers.content === "none") push("وضعیت محتوا (متن و عکس) باید روشن شود؛ تولید محتوا جدا بررسی می‌شود.", "The content (text and images) needs clarifying; content creation is reviewed separately.");
  if (answers.featuresNote) push(`امکانات دیگری که نوشتید: «${answers.featuresNote}»`, `Other features you wrote: “${answers.featuresNote}”`);
  if (answers.goal === "other") push(answers.goalNote ? `هدف ذکرشده: «${answers.goalNote}»` : "هدف دقیق پروژه باید مشخص شود.", answers.goalNote ? `Stated goal: “${answers.goalNote}”` : "The exact goal needs to be defined.");
  if (answers.style === "reference") push(answers.referenceUrl ? "سایت نمونه‌ای که فرستادید باید بررسی شود." : "سایت نمونه هنوز ارسال نشده است.", answers.referenceUrl ? "The reference site you sent needs a review." : "No reference site has been sent yet.");
  if (answers.features.includes("api_integration")) push("سرویس‌هایی که باید به آن‌ها وصل شد و مستندات آن‌ها بررسی شود.", "The services to connect to, and their documentation, need a review.");
  if (answers.features.includes("ai")) push("کاربرد دقیق هوش مصنوعی و هزینه مصرف ماهانه آن بررسی شود.", "The exact AI use and its monthly usage cost need a review.");
  if (answers.features.includes("web3_wallet")) push("شبکه، نوع دارایی و ملاحظات مقرراتی Web3 بررسی شود.", "The network, asset type and regulatory side of Web3 need a review.");
  if (answers.features.includes("online_payment")) push("درگاه پرداخت و مدارک لازم برای آن مشخص شود.", "The payment gateway and the documents it needs must be settled.");
  return items;
}

function confidenceOf(answers, complexity) {
  let points = 3;
  if (answers.size === "unknown") points -= 1;
  if (answers.content === "unknown") points -= 0.5;
  if (answers.featuresNote || (answers.goal === "other" && !answers.goalNote)) points -= 0.5;
  if (answers.style === "reference" || answers.style === "suggest") points -= 0.25;
  if (answers.projectType === "platform") points -= 0.75;
  if (complexity === "high") points -= 0.75;
  if (answers.projectType === "unsure") points = 0;
  return points >= 2.25 ? "high" : points >= 1.25 ? "medium" : "low";
}

/** Builds the scope used by the card, the report and the pricing engine. */
export function buildScope(answers) {
  const architecture = recommendArchitecture(answers);
  const complexity = complexityOf(answers);
  const confidence = confidenceOf(answers, complexity);
  const size = answers.size === "unknown" ? UNKNOWN_SIZE : answers.size;
  const count = SIZE_COUNTS[answers.projectType]?.[size] ?? 0;
  const multilingual = answers.features.includes("multilingual");

  // The economic tier keeps the chosen core features; the rest move to a later phase.
  const coreFeatures = answers.features.filter((feature) => FEATURES[feature]?.core);
  const economicFeatures = coreFeatures.length ? coreFeatures : answers.features.slice(0, 2);
  const deferredFeatures = answers.features.filter((feature) => !economicFeatures.includes(feature));
  const added = (SUGGESTIONS_BY_TYPE[answers.projectType] ?? [])
    .filter((feature) => !answers.features.includes(feature))
    .slice(0, 2)
    .map((id) => ({ id, reason: SUGGESTION_REASONS[id] ?? L("ارزش افزوده برای کاربر", "Added value for users") }));
  const professionalFeatures = [...answers.features, ...added.map((item) => item.id)];

  const economicStyle = ECONOMIC_STYLE[answers.style] ?? "modern";
  const professionalStyle = answers.style === "suggest" || answers.style === "reference" ? "modern_plus" : answers.style;
  const designDiffers = economicStyle !== answers.style && answers.style !== "suggest" && answers.style !== "minimal";
  const twoTiers = answers.projectType !== "unsure" && (deferredFeatures.length > 0 || added.length > 0 || designDiffers);

  const tier = (features, designLevel) => ({
    features,
    templates: templatesFor(answers.projectType, features),
    staticPages: STATIC_PAGES[answers.projectType]?.length ?? 3,
    designLevel,
  });

  return {
    projectType: answers.projectType,
    goal: answers.goal,
    architecture,
    complexity,
    confidence,
    consultationRecommended: answers.projectType === "unsure" || (complexity === "high" && confidence === "low"),
    sizeAssumed: answers.size === "unknown",
    itemCount: count,
    multilingual,
    content: answers.content,
    staticPages: STATIC_PAGES[answers.projectType] ?? STATIC_PAGES.unsure,
    twoTiers,
    tiers: {
      economic: { ...tier(economicFeatures, economicStyle), deferred: deferredFeatures },
      professional: { ...tier(professionalFeatures, professionalStyle), added, deferred: [] },
    },
    needsReview: needsReviewOf(answers),
  };
}
