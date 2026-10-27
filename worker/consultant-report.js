// Telegram report for a consultant request. Plain text (no parse_mode), so customer text can
// never inject markup; split into parts that each fit one Telegram message.
import { labelFor, sizeLabel } from "./consultant-flow.js";
import { TEMPLATES } from "./consultant-scope.js";

const PART_LIMIT = 3800;
const MAX_PARTS = 5;

const TECH = { wordpress: "وردپرس", woocommerce: "ووکامرس", custom: "توسعه اختصاصی" };
const STATUS = {
  estimated: "برآورد شد",
  tier_selected: "نسخه انتخاب شد",
  contact_submitted: "اطلاعات تماس ثبت شد",
  in_review: "در حال بررسی",
  contacted: "تماس گرفته شد",
  won: "قرارداد بسته شد",
  lost: "از دست رفت",
  archived: "بایگانی",
};
const CONFIDENCE = { high: "بالا", medium: "متوسط", low: "پایین" };
const COMPLEXITY = { low: "ساده", medium: "متوسط", high: "بالا" };

const money = (value, currency) => `${Number(value).toLocaleString("fa-IR")} ${currency?.label?.fa ?? ""}`.trim();
const line = (label, value) => (value === null || value === undefined || value === "" ? null : `${label}: ${value}`);

function tierBlock(id, scopeTier, estimateTier, currency) {
  const title = id === "economic" ? "نسخه اقتصادی / MVP" : "نسخه حرفه‌ای";
  const features = scopeTier.features.map((feature) => labelFor("feature", feature, "fa"));
  const templates = scopeTier.templates.map((template) => TEMPLATES[template]?.fa ?? template);
  return [
    `— ${title} —`,
    line("امکانات", features.join("، ") || "پایه"),
    line("قالب‌های پویا", `${templates.length.toLocaleString("fa-IR")} (${templates.join("، ")})`),
    line("صفحات اصلی", scopeTier.staticPages.toLocaleString("fa-IR")),
    scopeTier.added?.length ? line("افزوده‌ها", scopeTier.added.map((item) => `${labelFor("feature", item.id, "fa")} (${item.reason.fa})`).join("؛ ")) : null,
    scopeTier.deferred?.length ? line("به فاز بعد", scopeTier.deferred.map((feature) => labelFor("feature", feature, "fa")).join("، ")) : null,
    estimateTier ? line("بازه قیمت", `${money(estimateTier.oneTime.min, currency)} تا ${money(estimateTier.oneTime.max, currency)}`) : null,
    estimateTier ? line("زمان اجرا", `${estimateTier.weeks.min.toLocaleString("fa-IR")} تا ${estimateTier.weeks.max.toLocaleString("fa-IR")} هفته`) : null,
    estimateTier ? line("ساعت کار (داخلی)", estimateTier.hours.toLocaleString("fa-IR")) : null,
    estimateTier ? line("هزینه ماهانه", money(estimateTier.monthly, currency)) : null,
  ].filter(Boolean).join("\n");
}

/** Builds the full report and returns it split into message parts. */
export function buildConsultantReport({ request, answers, scope, estimate, summary, adminUrl, budgetLabel, kind }) {
  const head = kind === "update" ? `🔄 به‌روزرسانی درخواست برآورد ${request.public_ref}` : `🧭 درخواست برآورد جدید ${request.public_ref}`;
  const contact = request.contact_name || request.contact_value
    ? [line("نام", request.contact_name), line("تماس", request.contact_value), line("توضیحات", request.contact_notes)].filter(Boolean).join("\n")
    : "اطلاعات تماس هنوز ثبت نشده است.";
  const priced = estimate && estimate.status !== "needs_review";
  const tierIds = scope.twoTiers ? ["economic", "professional"] : ["professional"];

  const sections = [
    [
      head,
      line("وضعیت", STATUS[request.status] ?? request.status),
      line("تاریخ ثبت", new Date(request.created_at).toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })),
      line("زبان", request.locale === "fa" ? "فارسی" : "انگلیسی"),
      line("نسخه انتخاب‌شده", request.selected_tier ? (request.selected_tier === "economic" ? "اقتصادی" : "حرفه‌ای") : null),
    ].filter(Boolean).join("\n"),
    `👤 مشتری\n${contact}`,
    [
      "📋 پاسخ‌ها",
      line("نوع پروژه", labelFor("projectType", answers.projectType, "fa")),
      line("توضیح نوع پروژه", answers.projectTypeNote),
      line("هدف", labelFor("goal", answers.goal, "fa")),
      line("توضیح هدف", answers.goalNote),
      line("امکانات", answers.features.map((feature) => labelFor("feature", feature, "fa")).join("، ") || "—"),
      line("امکانات دیگر", answers.featuresNote),
      line("ابعاد", sizeLabel(answers.projectType, answers.size, "fa")),
      line("سبک طراحی", labelFor("style", answers.style, "fa")),
      line("سایت نمونه", answers.referenceUrl),
      line("توضیح سبک", answers.styleNote),
      line("محتوا", labelFor("content", answers.content, "fa")),
      line("بودجه مشتری", budgetLabel),
      line("زمان دلخواه", labelFor("timeframe", answers.timeframe, "fa")),
      line("توضیح زمان", answers.timeframeNote),
      line("یادداشت", answers.notes),
    ].filter(Boolean).join("\n"),
    [
      "🛠 تحلیل",
      line("فناوری پیشنهادی", scope.architecture?.id ? `${TECH[scope.architecture.id]} — ${scope.architecture.reason.fa}` : scope.architecture?.reason?.fa),
      line("پیچیدگی", COMPLEXITY[scope.complexity]),
      line("اطمینان برآورد", CONFIDENCE[scope.confidence]),
      scope.consultationRecommended ? "جلسه کارشناسی پیشنهاد می‌شود." : null,
      scope.twoTiers ? null : "این پروژه به دو سطح منطقی تقسیم نمی‌شود؛ یک پیشنهاد ارائه شد.",
    ].filter(Boolean).join("\n"),
    [
      priced ? "💰 برآورد (از موتور قیمت)" : "💰 برآورد: نیازمند بررسی کارشناسی (تعرفه تنظیم نشده یا پروژه نیاز به جلسه دارد)",
      ...(priced ? tierIds.map((id) => tierBlock(id, scope.tiers[id], estimate.tiers[id], estimate.currency)) : tierIds.map((id) => tierBlock(id, scope.tiers[id], null, null))),
      priced && estimate.missingFeatures?.length ? line("امکانات بدون تعرفه", estimate.missingFeatures.map((f) => labelFor("feature", f, "fa")).join("، ")) : null,
      priced ? line("تطابق بودجه", { below: "کمتر از نسخه اقتصادی", fits: "مناسب", professional: "کافی برای نسخه حرفه‌ای", unknown: "نامشخص" }[estimate.budgetFit]) : null,
      priced ? line("زمان دلخواه", { tight: "کوتاه‌تر از برآورد", fits: "مناسب", flexible: "منعطف" }[estimate.timelineFit]) : null,
      priced && estimate.tariffVersion ? line("نسخه تعرفه", estimate.tariffVersion) : null,
    ].filter(Boolean).join("\n\n"),
    [
      "⚠️ موارد نیازمند بررسی",
      ...(scope.needsReview.length ? scope.needsReview.map((item) => `• ${item.fa}`) : ["• موردی ثبت نشده است."]),
      ...(summary?.ambiguities ?? []).map((item) => `• ${item}`),
    ].join("\n"),
    `🤖 خلاصه${summary?.source === "model" ? " هوش مصنوعی" : ""}\n${summary?.summary ?? request.ai_summary ?? "—"}`,
    `🔗 جزئیات در پنل مدیریت:\n${adminUrl}`,
  ];

  const parts = [];
  let current = "";
  for (const section of sections) {
    const piece = section.length > PART_LIMIT ? `${section.slice(0, PART_LIMIT - 20)}…` : section;
    if (current && current.length + piece.length + 2 > PART_LIMIT) {
      parts.push(current);
      current = piece;
    } else current = current ? `${current}\n\n${piece}` : piece;
  }
  if (current) parts.push(current);
  if (parts.length > MAX_PARTS) {
    const kept = parts.slice(0, MAX_PARTS);
    kept[MAX_PARTS - 1] = `${kept[MAX_PARTS - 1]}\n\n(ادامه در پنل مدیریت: ${adminUrl})`;
    return kept;
  }
  return parts.map((part, index) => (parts.length > 1 ? `(${(index + 1).toLocaleString("fa-IR")}/${parts.length.toLocaleString("fa-IR")})\n${part}` : part));
}
