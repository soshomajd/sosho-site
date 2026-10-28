import { describe, expect, it } from "vitest";

import { fallbackSummary, interpretFreeText, summarizeProject } from "../worker/consultant-ai.js";
import { consultantConfig, validateConsultantAnswers } from "../worker/consultant-flow.js";
import { buildConsultantReport } from "../worker/consultant-report.js";
import { buildScope } from "../worker/consultant-scope.js";
import { TARIFF_TEMPLATE, estimateProject, publicEstimate, validateTariff } from "../worker/pricing-engine.js";
import { answersFor, testTariff } from "./fixtures/consultant-tariff.js";

function validated(answers, tariff = testTariff()) {
  const result = validateConsultantAnswers(answers, tariff);
  expect(result.ok, JSON.stringify(result.issues)).toBe(true);
  return result.value;
}

function run(answers, tariff = testTariff()) {
  const value = validated(answers, tariff);
  const scope = buildScope(value);
  return { answers: value, scope, estimate: estimateProject({ scope, answers: value, tariff, tariffVersion: 7 }) };
}

describe("consultant questions", () => {
  it("serves six questions plus the content follow-up, adaptive options and no internal pricing", () => {
    const config = consultantConfig("fa", testTariff());
    expect(Object.keys(config.questions)).toEqual(["projectType", "goal", "features", "size", "style", "budget", "content"]);
    expect(config.questions.features.byType.ecommerce.map((o) => o.id)).toContain("cart");
    expect(config.questions.features.byType.platform.map((o) => o.id)).toContain("web3_wallet");
    expect(config.questions.size.byType.ecommerce.label).toBe("تقریباً چند محصول دارید؟");
    expect(config.questions.size.byType.corporate.options.at(-1)).toEqual({ id: "unknown", label: "نمی‌دانم" });
    expect(config.questions.budget.options.map((o) => o.id)).toEqual(["b1", "b2", "b3", "suggest"]);
    expect(config.pricingConfigured).toBe(true);
    expect(JSON.stringify(config)).not.toMatch(/hourlyRate|baseHours|1000000/u);
    // without a tariff only "your suggestion" is offered for the budget
    expect(consultantConfig("en", null).questions.budget.options.map((o) => o.id)).toEqual(["suggest"]);
  });

  it("rejects unknown keys, options from another project type and bad URLs", () => {
    const bad = validateConsultantAnswers({ ...answersFor.corporate(), features: ["cart"], hack: 1, referenceUrl: "javascript:alert(1)" }, testTariff());
    expect(bad.ok).toBe(false);
    expect(bad.issues.map((issue) => issue.path)).toEqual(expect.arrayContaining(["hack", "features", "referenceUrl"]));
    const ok = validateConsultantAnswers({ ...answersFor.corporate(), style: "reference", referenceUrl: "example.com/page" }, testTariff());
    expect(ok.value.referenceUrl).toBe("https://example.com/page");
  });
});

describe("project scope", () => {
  it("recommends WooCommerce for a store, WordPress for a company site and custom for a platform", () => {
    expect(run(answersFor.ecommerce()).scope.architecture.id).toBe("woocommerce");
    expect(run(answersFor.corporate()).scope.architecture.id).toBe("wordpress");
    expect(run(answersFor.platform()).scope.architecture.id).toBe("custom");
    expect(run({ ...answersFor.corporate(), style: "interactive_3d" }).scope.architecture.id).toBe("custom");
  });

  it("recommends React Native for a mobile app, with a web app as the lighter alternative, and prices screens like pages", () => {
    const { scope, estimate } = run(answersFor.mobile());
    expect(scope.architecture.id).toBe("mobile");
    expect(scope.architecture.alternative.id).toBe("custom");
    expect(scope.tiers.economic.features).toEqual(["user_accounts", "online_payment", "admin_panel"]);
    expect(scope.tiers.economic.deferred).toEqual(["push_notifications"]);
    expect(scope.tiers.economic.templates).toEqual(["app_screens", "account", "checkout", "admin_panel"]);
    expect(scope.needsReview.some((item) => item.en.includes("stores"))).toBe(true);
    // hours: (base 160 + (3 static + 12 screens) * 4 + 4 templates * 10 + 3 core features * 10) * design 1 * content * (1 + qa 0.2)
    const content = testTariff().content[scope.content ?? "unknown"];
    expect(estimate.status).toBe("estimated");
    expect(estimate.tiers.economic.hours).toBe(Math.round((160 + 15 * 4 + 40 + 30) * content * 1.2));
    expect(estimate.tiers.economic.monthly).toBe(3_000_000);
  });

  it("splits essential and later-phase features and adds explained professional extras", () => {
    const { scope } = run(answersFor.ecommerce());
    expect(scope.twoTiers).toBe(true);
    expect(scope.tiers.economic.features).toEqual(["online_payment", "cart", "user_accounts"]);
    expect(scope.tiers.economic.deferred).toEqual(["inventory"]);
    expect(scope.tiers.professional.features).toEqual(expect.arrayContaining(["inventory", "product_filters"]));
    expect(scope.tiers.professional.added.every((item) => item.reason.fa && item.reason.en)).toBe(true);
    expect(scope.tiers.economic.templates).toEqual(expect.arrayContaining(["shop", "product", "checkout", "account"]));
  });

  it("asks for a consultation instead of guessing when the customer is not sure", () => {
    const { scope, estimate } = run({ projectType: "unsure", goal: "other", features: [], size: "unknown", style: "suggest", budget: "suggest", timeframe: "flexible" });
    expect(scope.architecture.id).toBeNull();
    expect(scope.consultationRecommended).toBe(true);
    expect(scope.twoTiers).toBe(false);
    expect(estimate).toMatchObject({ status: "needs_review", reason: "consultation" });
  });

  it("lowers confidence and lists review points for unknown answers", () => {
    const sure = run(answersFor.corporate()).scope;
    const vague = run({ ...answersFor.corporate(), size: "unknown", content: "unknown", featuresNote: "اتصال به نرم‌افزار حسابداری" }).scope;
    expect(["high", "medium"]).toContain(sure.confidence);
    expect(vague.confidence).toBe("low");
    expect(vague.sizeAssumed).toBe(true);
    expect(vague.needsReview.map((item) => item.fa).join(" ")).toContain("نرم‌افزار حسابداری");
  });
});

describe("pricing engine", () => {
  it("returns needs_review, never a number, when no tariff is set", () => {
    const value = validated({ ...answersFor.corporate(), budget: "suggest" }, null);
    const scope = buildScope(value);
    const estimate = estimateProject({ scope, answers: value, tariff: null });
    expect(estimate).toEqual({ status: "needs_review", reason: "no_tariff", tariffVersion: null, confidence: scope.confidence });
    expect(publicEstimate(estimate)).toEqual({ status: "needs_review", reason: "no_tariff", confidence: scope.confidence });
  });

  it("computes the arithmetic from the tariff: hours, ranges, rounding and the tier gap", () => {
    const { estimate, scope } = run(answersFor.corporate());
    // economic: base 40 + pages (4 static + 8 services) * 4 + templates (service, blog? no: blog deferred) ...
    const economic = estimate.tiers.economic;
    const professional = estimate.tiers.professional;
    expect(estimate.status).toBe("estimated");
    expect(estimate.tariffVersion).toBe(7);
    expect(economic.oneTime.min % 1_000_000).toBe(0);
    expect(economic.oneTime.min).toBeLessThan(economic.oneTime.max);
    expect(professional.oneTime.min).toBeGreaterThan(economic.oneTime.min);
    expect(professional.weeks.max).toBeGreaterThanOrEqual(economic.weeks.max);
    // hours: (40 + 12*4 + 1 template*10 + 2 core features*10) * design 1 * content 1.1 * (1 + qa 0.2)
    expect(scope.tiers.economic.templates).toEqual(["service"]);
    expect(economic.hours).toBe(Math.round((40 + 12 * 4 + 10 + 20) * 1.1 * 1.2));
  });

  it("changes with the tariff (the admin can change prices without code)", () => {
    const cheap = run(answersFor.ecommerce()).estimate.tiers.economic.oneTime.min;
    const dear = run(answersFor.ecommerce(), testTariff({ hourlyRate: 2_000_000 })).estimate.tiers.economic.oneTime.min;
    expect(dear).toBeGreaterThan(cheap * 1.8);
  });

  it("widens the range when the estimate is less certain, and flags features without a tariff", () => {
    const sure = run(answersFor.corporate()).estimate.tiers.economic.oneTime;
    const vague = run({ ...answersFor.corporate(), size: "unknown", content: "unknown", featuresNote: "x y" }).estimate;
    expect((vague.tiers.economic.oneTime.max - vague.tiers.economic.oneTime.min)).toBeGreaterThan(sure.max - sure.min);
    const tariff = testTariff();
    delete tariff.features.inventory;
    const partial = run(answersFor.ecommerce(), tariff).estimate;
    expect(partial.status).toBe("partial");
    expect(partial.missingFeatures).toEqual(["inventory"]);
  });

  it("keeps one-time and recurring costs apart and compares the customer's budget and date without mixing them", () => {
    const { estimate } = run({ ...answersFor.ecommerce(), budget: "b1", timeframe: "asap" });
    expect(estimate.tiers.economic.monthly).toBe(2_000_000); // WooCommerce hosting, no feature extras
    expect(estimate.recurring).toEqual({ domainYearly: 1_000_000, supportMonthly: 5_000_000 });
    expect(estimate.budgetFit).toBe("below");
    expect(estimate.timelineFit).toBe("tight");
    expect(run({ ...answersFor.ecommerce(), timeframe: "flexible" }).estimate.timelineFit).toBe("flexible");
  });

  it("uses team capacity: more parallel developers shorten the build", () => {
    const one = run(answersFor.platform(), testTariff({ team: { ...testTariff().team, parallelDevelopers: 1 } })).estimate.tiers.professional.weeks.max;
    const three = run(answersFor.platform(), testTariff({ team: { ...testTariff().team, parallelDevelopers: 3 } })).estimate.tiers.professional.weeks.max;
    expect(three).toBeLessThan(one);
  });

  it("never exposes hours in the public estimate", () => {
    const shown = publicEstimate(run(answersFor.platform()).estimate);
    expect(JSON.stringify(shown)).not.toMatch(/hours/u);
    expect(shown.tiers.professional).toEqual({ oneTime: expect.any(Object), weeks: expect.any(Object), monthly: expect.any(Number) });
  });

  it("validates tariffs: the empty template is invalid, a complete tariff is valid, unknown features are rejected", () => {
    expect(validateTariff(TARIFF_TEMPLATE).ok).toBe(false);
    expect(validateTariff(testTariff()).ok).toBe(true);
    const unknown = validateTariff({ ...testTariff(), features: { teleport: { hours: 1 } } });
    expect(unknown.ok).toBe(false);
    expect(unknown.issues.join(" ")).toContain("teleport");
    expect(validateTariff({ ...testTariff(), hourlyRate: -5 }).issues).toContain("hourlyRate");
  });
});

describe("consultant AI", () => {
  const fakeAi = (payload) => ({ run: async () => ({ response: JSON.stringify(payload) }) });

  it("maps free text to options and drops anything outside the allowed lists", async () => {
    const result = await interpretFreeText(
      { AI: fakeAi({ projectType: "ecommerce", goal: "sales", features: ["cart", "web3_wallet", "made_up"], size: "l", style: "none", note: "اتصال به دیجی‌کالا" }) },
      { locale: "fa", text: "یک فروشگاه با ۵۰۰ محصول می‌خواهم", projectType: null }
    );
    expect(result).toEqual({ projectType: "ecommerce", goal: "sales", features: ["cart"], size: "l", style: null, note: "اتصال به دیجی‌کالا" });
  });

  it("throws away a summary that mentions money or a deadline and uses the deterministic one", async () => {
    const { answers, scope } = run(answersFor.corporate());
    const priced = await summarizeProject({ AI: fakeAi({ summary: "این پروژه حدود ۸۰ میلیون تومان هزینه دارد و در ۳ هفته تحویل می‌شود.", ambiguities: [] }) }, { locale: "fa", answers, scope });
    expect(priced.source).toBe("fallback");
    expect(priced.summary).toBe(fallbackSummary(answers, scope, "fa"));
    const clean = await summarizeProject({ AI: fakeAi({ summary: "مشتری یک سایت شرکتی برای جذب مشتری می‌خواهد و وبلاگ را مهم می‌داند.", ambiguities: ["تعداد زبان‌ها"] }) }, { locale: "fa", answers, scope });
    expect(clean).toEqual({ summary: "مشتری یک سایت شرکتی برای جذب مشتری می‌خواهد و وبلاگ را مهم می‌داند.", ambiguities: ["تعداد زبان‌ها"], source: "model" });
    const down = await summarizeProject({}, { locale: "en", answers, scope });
    expect(down.source).toBe("fallback");
    expect(down.summary).toContain("Suggested approach: WordPress");
  });
});

describe("Telegram report", () => {
  it("contains the answers, both tiers, prices, review points and the admin link, in parts that fit Telegram", () => {
    const { answers, scope, estimate } = run({ ...answersFor.ecommerce(), notes: "x".repeat(400), featuresNote: "اتصال به حسابداری" });
    const parts = buildConsultantReport({
      request: { public_ref: "SOS-ABC123", status: "estimated", created_at: new Date().toISOString(), locale: "fa", contact_name: "سارا", contact_value: "09120000000", selected_tier: "economic" },
      answers, scope, estimate,
      summary: { summary: "خلاصه", ambiguities: ["مورد مبهم"], source: "model" },
      adminUrl: "https://example.com/admin/consultant/detail?id=cr_x",
      budgetLabel: "۵۰ تا ۲۰۰ میلیون",
      kind: "created",
    });
    const text = parts.join("\n");
    expect(parts.every((part) => part.length <= 4096)).toBe(true);
    for (const expected of ["SOS-ABC123", "سارا", "09120000000", "فروشگاه اینترنتی", "نسخه اقتصادی", "نسخه حرفه‌ای", "بازه قیمت", "ووکامرس", "اتصال به حسابداری", "مورد مبهم", "https://example.com/admin/consultant/detail?id=cr_x", "۵۰ تا ۲۰۰ میلیون"]) {
      expect(text).toContain(expected);
    }
  });
});
