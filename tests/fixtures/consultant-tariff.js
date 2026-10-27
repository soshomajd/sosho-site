// TEST DATA ONLY. A complete tariff with round numbers so tests can check the arithmetic.
// These are not SoSho Studio prices; real tariffs are entered by the owner in the admin panel.
import { FEATURES } from "../../worker/consultant-flow.js";

export function testTariff(overrides = {}) {
  const architecture = (base) => ({ baseHours: base, staticPageHours: 4, templateHours: 10, itemHoursPer100: 2, moduleHours: 20, featureFactor: 1 });
  return {
    currency: { code: "IRT", label: { fa: "تومان", en: "Toman" } },
    roundTo: 1_000_000,
    hourlyRate: 1_000_000,
    architectures: { wordpress: architecture(40), woocommerce: architecture(60), custom: architecture(120) },
    features: Object.fromEntries(Object.keys(FEATURES).map((id) => [id, { hours: 10, oneTimeCost: 0, monthlyCost: 0 }])),
    design: { minimal: 0.9, modern: 1, modern_plus: 1.2, luxury: 1.3, creative_motion: 1.5, interactive_3d: 2 },
    multilingualFactor: 1.3,
    content: { ready: 1, partial: 1.1, none: 1.25, unknown: 1.15 },
    qaShare: 0.2,
    designShare: 0.3,
    uncertainty: { high: 0.1, medium: 0.2, low: 0.35 },
    recurring: { hostingMonthly: { wordpress: 1_000_000, woocommerce: 2_000_000, custom: 3_000_000 }, domainYearly: 1_000_000, supportMonthly: 5_000_000 },
    team: { hoursPerDay: 6, workDaysPerWeek: 5, parallelDevelopers: 2, discoveryDays: 3, feedbackRounds: { economic: 1, professional: 2 }, feedbackDaysPerRound: 3, bufferShare: 0.15 },
    budgetBands: [
      { id: "b1", label: { fa: "تا ۵۰ میلیون", en: "Up to 50 million" }, min: 0, max: 50_000_000 },
      { id: "b2", label: { fa: "۵۰ تا ۲۰۰ میلیون", en: "50 to 200 million" }, min: 50_000_000, max: 200_000_000 },
      { id: "b3", label: { fa: "بیش از ۲۰۰ میلیون", en: "Over 200 million" }, min: 200_000_000, max: null },
    ],
    ...overrides,
  };
}

export const answersFor = {
  corporate: () => ({ projectType: "corporate", goal: "leads", features: ["services_pages", "blog", "consultation_form"], size: "m", style: "modern", budget: "b2", timeframe: "1_2_months", content: "partial" }),
  ecommerce: () => ({ projectType: "ecommerce", goal: "sales", features: ["online_payment", "cart", "user_accounts", "inventory"], size: "m", style: "modern", budget: "b2", timeframe: "1_2_months", content: "ready" }),
  booking: () => ({ projectType: "booking", goal: "booking", features: ["booking_calendar", "online_payment", "notifications"], size: "s", style: "minimal", budget: "suggest", timeframe: "flexible" }),
  platform: () => ({ projectType: "platform", goal: "operations", features: ["user_panel", "roles", "dashboard", "api_integration"], size: "m", style: "modern", budget: "b3", timeframe: "3_plus_months" }),
};
