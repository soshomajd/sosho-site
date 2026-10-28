// Deterministic price and time engine for the project consultant. Every number comes from the
// admin-managed tariff (D1 table pricing_tariffs); there is no price in code and the AI never
// produces one. Without a valid tariff the result is "needs_review" instead of a guess.
import { FEATURES } from "./consultant-flow.js";

export const ARCHITECTURES = ["wordpress", "woocommerce", "custom", "mobile"];
export const DESIGN_LEVELS = ["minimal", "modern", "modern_plus", "luxury", "creative_motion", "interactive_3d"];
const CONTENT_STATES = ["ready", "partial", "none", "unknown"];
const CONFIDENCE = ["high", "medium", "low"];
const ITEM_TYPES = new Set(["ecommerce", "education", "booking", "portfolio"]);

/** Empty template for the admin editor: the shape only, every amount left for the owner to fill. */
export const TARIFF_TEMPLATE = {
  currency: { code: "IRT", label: { fa: "تومان", en: "Toman" } },
  roundTo: null,
  hourlyRate: null,
  architectures: Object.fromEntries(
    ARCHITECTURES.map((id) => [id, { baseHours: null, staticPageHours: null, templateHours: null, itemHoursPer100: null, moduleHours: null, featureFactor: null }])
  ),
  features: Object.fromEntries(Object.keys(FEATURES).map((id) => [id, { hours: null, oneTimeCost: 0, monthlyCost: 0 }])),
  design: Object.fromEntries(DESIGN_LEVELS.map((id) => [id, null])),
  multilingualFactor: null,
  content: Object.fromEntries(CONTENT_STATES.map((id) => [id, null])),
  qaShare: null,
  designShare: null,
  uncertainty: Object.fromEntries(CONFIDENCE.map((id) => [id, null])),
  recurring: { hostingMonthly: Object.fromEntries(ARCHITECTURES.map((id) => [id, null])), domainYearly: null, supportMonthly: null },
  team: { hoursPerDay: null, workDaysPerWeek: null, parallelDevelopers: null, discoveryDays: null, feedbackRounds: { economic: null, professional: null }, feedbackDaysPerRound: null, bufferShare: null },
  budgetBands: [],
};

const isNum = (value, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;

/** Full validation of an admin tariff. Returns { ok, value } or { ok: false, issues: [path] }. */
export function validateTariff(config) {
  const issues = [];
  const need = (path, value, range) => { if (!isNum(value, range)) issues.push(path); };
  if (!config || typeof config !== "object" || Array.isArray(config)) return { ok: false, issues: ["(root)"] };
  const c = config;
  if (!c.currency || typeof c.currency.code !== "string" || !/^[A-Z]{3,8}$/u.test(c.currency.code)) issues.push("currency.code");
  for (const lang of ["fa", "en"]) {
    if (typeof c.currency?.label?.[lang] !== "string" || !c.currency.label[lang].trim() || c.currency.label[lang].length > 30) issues.push(`currency.label.${lang}`);
  }
  need("roundTo", c.roundTo, { min: 1 });
  need("hourlyRate", c.hourlyRate, { min: 0.000001 });
  for (const id of ARCHITECTURES) {
    const a = c.architectures?.[id];
    for (const key of ["baseHours", "staticPageHours", "templateHours", "itemHoursPer100", "moduleHours"]) need(`architectures.${id}.${key}`, a?.[key], { max: 100_000 });
    need(`architectures.${id}.featureFactor`, a?.featureFactor, { min: 0.05, max: 10 });
  }
  if (!c.features || typeof c.features !== "object" || Array.isArray(c.features)) issues.push("features");
  else {
    for (const [id, feature] of Object.entries(c.features)) {
      if (!FEATURES[id]) { issues.push(`features.${id} (unknown feature)`); continue; }
      need(`features.${id}.hours`, feature?.hours, { max: 100_000 });
      if (feature?.oneTimeCost !== undefined) need(`features.${id}.oneTimeCost`, feature.oneTimeCost);
      if (feature?.monthlyCost !== undefined) need(`features.${id}.monthlyCost`, feature.monthlyCost);
    }
  }
  for (const id of DESIGN_LEVELS) need(`design.${id}`, c.design?.[id], { min: 0.2, max: 10 });
  need("multilingualFactor", c.multilingualFactor, { min: 1, max: 5 });
  for (const id of CONTENT_STATES) need(`content.${id}`, c.content?.[id], { min: 0.2, max: 5 });
  need("qaShare", c.qaShare, { max: 2 });
  need("designShare", c.designShare, { max: 0.9 });
  for (const id of CONFIDENCE) need(`uncertainty.${id}`, c.uncertainty?.[id], { max: 0.9 });
  for (const id of ARCHITECTURES) need(`recurring.hostingMonthly.${id}`, c.recurring?.hostingMonthly?.[id]);
  need("recurring.domainYearly", c.recurring?.domainYearly);
  if (c.recurring?.supportMonthly !== undefined && c.recurring?.supportMonthly !== null) need("recurring.supportMonthly", c.recurring.supportMonthly);
  need("team.hoursPerDay", c.team?.hoursPerDay, { min: 1, max: 24 });
  need("team.workDaysPerWeek", c.team?.workDaysPerWeek, { min: 1, max: 7 });
  need("team.parallelDevelopers", c.team?.parallelDevelopers, { min: 1, max: 50 });
  need("team.discoveryDays", c.team?.discoveryDays, { max: 365 });
  need("team.feedbackRounds.economic", c.team?.feedbackRounds?.economic, { max: 20 });
  need("team.feedbackRounds.professional", c.team?.feedbackRounds?.professional, { max: 20 });
  need("team.feedbackDaysPerRound", c.team?.feedbackDaysPerRound, { max: 60 });
  need("team.bufferShare", c.team?.bufferShare, { max: 2 });
  if (c.budgetBands !== undefined) {
    if (!Array.isArray(c.budgetBands) || c.budgetBands.length > 12) issues.push("budgetBands");
    else c.budgetBands.forEach((band, index) => {
      if (typeof band?.id !== "string" || !/^[a-z0-9_]{1,40}$/u.test(band.id) || band.id === "suggest") issues.push(`budgetBands.${index}.id`);
      for (const lang of ["fa", "en"]) if (typeof band?.label?.[lang] !== "string" || !band.label[lang].trim() || band.label[lang].length > 80) issues.push(`budgetBands.${index}.label.${lang}`);
      if (band?.min !== null && band?.min !== undefined) need(`budgetBands.${index}.min`, band.min);
      if (band?.max !== null && band?.max !== undefined) need(`budgetBands.${index}.max`, band.max);
    });
  }
  return issues.length ? { ok: false, issues } : { ok: true, value: c };
}

const roundTo = (value, step) => Math.max(step, Math.round(value / step) * step);

function tierHours(scope, tier, tariff, architectureId) {
  const arch = tariff.architectures[architectureId];
  // Company sections and app screens are priced like pages.
  const contentPages = tier.staticPages + (scope.projectType === "corporate" || scope.projectType === "mobile" ? scope.itemCount : 0);
  const itemHours = ITEM_TYPES.has(scope.projectType) ? (scope.itemCount / 100) * arch.itemHoursPer100 : 0;
  const moduleHours = scope.projectType === "platform" ? scope.itemCount * arch.moduleHours : 0;
  const missing = [];
  let featureHours = 0;
  let oneTimeExtras = 0;
  let monthlyExtras = 0;
  for (const feature of tier.features) {
    const price = tariff.features?.[feature];
    if (!price || !isNum(price.hours)) { missing.push(feature); continue; }
    featureHours += price.hours * arch.featureFactor;
    oneTimeExtras += price.oneTimeCost ?? 0;
    monthlyExtras += price.monthlyCost ?? 0;
  }
  const base = arch.baseHours + contentPages * arch.staticPageHours + tier.templates.length * arch.templateHours + itemHours + moduleHours;
  const design = tariff.design[tier.designLevel] ?? tariff.design.modern;
  const multilingual = tier.features.includes("multilingual") ? tariff.multilingualFactor : 1;
  const build = (base + featureHours) * design * multilingual * tariff.content[scope.content ?? "unknown"];
  return { hours: build * (1 + tariff.qaShare), oneTimeExtras, monthlyExtras, missing };
}

function tierTimeline(hours, rounds, tariff, spread) {
  const team = tariff.team;
  const designDays = (hours * tariff.designShare) / team.hoursPerDay;
  // Development is split across the team; design, feedback rounds and discovery are on the critical path.
  const buildDays = (hours * (1 - tariff.designShare)) / (team.hoursPerDay * team.parallelDevelopers);
  const workdays = (team.discoveryDays + designDays + buildDays + rounds * team.feedbackDaysPerRound) * (1 + team.bufferShare);
  const weeks = workdays / team.workDaysPerWeek;
  return {
    min: Math.max(1, Math.floor(weeks * (1 - spread / 2))),
    max: Math.max(1, Math.ceil(weeks * (1 + spread / 2))),
  };
}

const DESIRED_WEEKS = { asap: 4, "1_2_months": 9, "3_plus_months": 13, flexible: null };

/**
 * Prices the economic and professional tiers of a scope.
 * Internal fields (hours) are kept for the admin view; `publicEstimate` strips them.
 */
export function estimateProject({ scope, answers, tariff, tariffVersion = null }) {
  if (!tariff) return { status: "needs_review", reason: "no_tariff", tariffVersion: null, confidence: scope.confidence };
  const architectureId = scope.architecture?.id;
  if (!architectureId || scope.projectType === "unsure") {
    return { status: "needs_review", reason: "consultation", tariffVersion, confidence: scope.confidence };
  }
  const spreadBase = tariff.uncertainty[scope.confidence] ?? tariff.uncertainty.low;
  const result = { status: "estimated", tariffVersion, confidence: scope.confidence, architecture: architectureId, currency: tariff.currency, tiers: {}, missingFeatures: [] };
  const tierIds = scope.twoTiers ? ["economic", "professional"] : ["professional"];
  for (const id of tierIds) {
    const tier = scope.tiers[id];
    const { hours, oneTimeExtras, monthlyExtras, missing } = tierHours(scope, tier, tariff, architectureId);
    // A feature without a tariff entry still counts in the scope; the range widens and the result says so.
    const spread = Math.min(0.9, spreadBase + (missing.length ? 0.1 : 0));
    const cost = hours * tariff.hourlyRate + oneTimeExtras;
    result.tiers[id] = {
      hours: Math.round(hours),
      oneTime: { min: roundTo(cost * (1 - spread), tariff.roundTo), max: roundTo(cost * (1 + spread), tariff.roundTo) },
      weeks: tierTimeline(hours, tariff.team.feedbackRounds[id], tariff, spread),
      monthly: roundTo(tariff.recurring.hostingMonthly[architectureId] + monthlyExtras, tariff.roundTo),
    };
    result.missingFeatures.push(...missing.filter((feature) => !result.missingFeatures.includes(feature)));
  }
  if (result.missingFeatures.length) result.status = "partial";
  result.recurring = {
    domainYearly: tariff.recurring.domainYearly,
    supportMonthly: tariff.recurring.supportMonthly ?? null,
  };

  const cheapest = result.tiers.economic ?? result.tiers.professional;
  const band = (tariff.budgetBands ?? []).find((item) => item.id === answers.budget);
  if (band && (isNum(band.min) || isNum(band.max))) {
    if (isNum(band.max) && band.max < cheapest.oneTime.min) result.budgetFit = "below";
    else if (result.tiers.professional && isNum(band.min) && band.min >= result.tiers.professional.oneTime.min) result.budgetFit = "professional";
    else result.budgetFit = "fits";
  } else result.budgetFit = "unknown";
  // The customer's wished date is compared, never used as the estimate itself.
  const desired = DESIRED_WEEKS[answers.timeframe] ?? null;
  result.timelineFit = desired === null ? "flexible" : desired < cheapest.weeks.min ? "tight" : "fits";
  return result;
}

/** What the public API may return: ranges only, no hours (hours times price would reveal the rate). */
export function publicEstimate(estimate) {
  if (!estimate || estimate.status === "needs_review") {
    return { status: "needs_review", reason: estimate?.reason ?? "no_tariff", confidence: estimate?.confidence ?? "low" };
  }
  const tiers = {};
  for (const [id, tier] of Object.entries(estimate.tiers)) {
    tiers[id] = { oneTime: tier.oneTime, weeks: tier.weeks, monthly: tier.monthly };
  }
  return {
    status: estimate.status,
    confidence: estimate.confidence,
    architecture: estimate.architecture,
    currency: estimate.currency,
    tiers,
    recurring: estimate.recurring,
    budgetFit: estimate.budgetFit,
    timelineFit: estimate.timelineFit,
    missingFeatures: estimate.missingFeatures,
  };
}
