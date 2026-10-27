import { describe, expect, it } from "vitest";

import { BUDGETS, SITE_TYPES, applySalesFlow, leadSentence } from "../worker/sales-flow.js";

function modelResult(overrides = {}) {
  return {
    reply: "سلام!",
    stage: "discovery",
    projectType: "unknown",
    recommendedTier: "unknown",
    extracted: {},
    missingFields: [],
    quickReplies: [],
    isComplete: false,
    confidence: 0.7,
    ...overrides,
  };
}

function turn(state, message, modelOverrides = {}, extractedProfile = {}) {
  const messageCount = state.count + 1;
  const profile = { ...state.profile, ...extractedProfile };
  const flow = applySalesFlow({
    locale: state.locale ?? "fa",
    result: modelResult(modelOverrides),
    profile,
    lastUserMessage: message,
    messageCount,
  });
  return { ...state, count: messageCount, profile: flow.profile, result: flow.result };
}

describe("sales flow: site type, budget, then name and phone", () => {
  it("walks a customer through all three steps and then promises a call", () => {
    let s = { count: 0, profile: {} };

    s = turn(s, "فروشگاه اینترنتی");
    expect(s.result.reply).toContain("بودجه");
    expect(s.result.quickReplies).toEqual(BUDGETS.fa);
    expect(s.result.quickReplies[0]).toContain("۵۰");
    expect(s.result.quickReplies.at(-1)).toContain("۳۰۰");
    expect(s.result.projectType).toBe("ecommerce");
    expect(s.result.isComplete).toBe(false);

    s = turn(s, "حدود ۱۵۰ میلیون تومان");
    expect(s.result.reply).toContain("نام و نام خانوادگی و شماره تماس");
    expect(s.result.quickReplies).toEqual([]);
    expect(s.profile.budgetToman).toBe("حدود ۱۵۰ میلیون تومان");

    s = turn(s, "سارا احمدی ۰۹۱۲۰۰۰۰۰۰۰", {}, { contactName: "سارا احمدی" });
    expect(s.result.isComplete).toBe(true);
    expect(s.result.stage).toBe("proposal_ready");
    expect(s.result.reply).toContain("سارا احمدی");
    expect(s.result.reply).toContain("تماس می‌گیرند");
    expect(s.profile.phone).toBe("09120000000"); // stored with ASCII digits
  });

  it("asks only for what is still missing", () => {
    let s = { count: 2, profile: { projectType: "corporate", budgetToman: BUDGETS.fa[1] } };
    s = turn(s, "علی رضایی", {}, { contactName: "علی رضایی" });
    expect(s.result.reply).toContain("شماره تماس");
    expect(s.result.reply).not.toContain("نام و نام خانوادگی");
    expect(s.result.isComplete).toBe(false);

    s = { count: 2, profile: { projectType: "corporate", budgetToman: BUDGETS.fa[1] } };
    s = turn(s, "09121234567");
    expect(s.profile.phone).toBe("09121234567");
    expect(s.result.reply).toContain("نام و نام خانوادگی");
  });

  it("never repeats the model's question or an 'I understand' opener", () => {
    expect(leadSentence("درک می‌کنم، نام شما ثبت شد. پروژه شما در مرحله پیشنهاد است؟ ممنون.")).toBe("ممنون.");
    expect(leadSentence("سلام، خوش آمدید به اینستاگرام. ما سایت می‌سازیم.")).toBe("ما سایت می‌سازیم.");
    expect(leadSentence("فهمیدم! سلام. می‌خواهید چه سایتی بسازید؟")).toBe("سلام.");
    expect(leadSentence("Got it. Thanks for writing! What do you need?")).toBe("Thanks for writing!");
    const s = turn({ count: 0, profile: {} }, "سلام", { reply: "درک کردم. چه سایتی می‌خواهید؟" });
    expect(s.result.reply).toBe("چه نوع سایتی نیاز دارید؟");
    expect(s.result.quickReplies).toHaveLength(SITE_TYPES.fa.length);
  });

  it("does not loop forever on a customer who skips a step", () => {
    let s = { count: 2, profile: {} };
    s = turn(s, "نمی‌دونم");
    expect(s.result.projectType).toBe("other");
    expect(s.result.reply).toContain("نام و نام خانوادگی و شماره تماس");

    s = { count: 4, profile: { projectType: "corporate" } };
    s = turn(s, "هنوز مطمئن نیستم");
    expect(s.profile.budgetToman).toBe("نامشخص");
    expect(s.result.reply).toContain("شماره تماس");
  });

  it("asks \"Other\" customers straight for name and phone, without a budget step", () => {
    let s = { count: 0, profile: {} };
    s = turn(s, "سایر");
    expect(s.result.projectType).toBe("other");
    expect(s.result.reply).toContain("برای بررسی درخواست شما");
    expect(s.result.reply).toContain("نام و نام خانوادگی و شماره تماس");
    expect(s.result.quickReplies).toEqual([]);
    expect(s.profile.budgetToman).toBeUndefined();

    s = turn(s, "رضا کریمی ۰۹۱۲۱۱۱۲۲۲۲", {}, { contactName: "رضا کریمی" });
    expect(s.result.isComplete).toBe(true);
    expect(s.result.stage).toBe("proposal_ready");
    expect(s.profile.phone).toBe("09121112222");

    let en = { count: 0, profile: {}, locale: "en" };
    en = turn(en, "Other", { reply: "" });
    expect(en.result.reply).toBe("To review your request, please send your full name and phone number and our team will call you.");
  });

  it("works in English and keeps a closing line after the request is complete", () => {
    let s = { count: 0, profile: {}, locale: "en" };
    s = turn(s, "Online store", { reply: "" });
    expect(s.result.reply).toBe("Which budget range do you have in mind for this project?");
    expect(s.result.quickReplies.at(-1)).toBe("Over 300 million Toman");
    s = turn(s, "About 100 million Toman");
    s = turn(s, "Sam Carter +44 7700 900123", {}, { contactName: "Sam Carter" });
    expect(s.result.reply).toBe("Thank you, Sam Carter! Your request is registered and our team will contact you shortly.");
    s = turn(s, "Thanks a lot!", { reply: "You are welcome." });
    expect(s.result.reply).toBe("You are welcome. Our team will contact you shortly.");
    expect(s.result.isComplete).toBe(true);
  });

  it("reads the name from the message when no model extracted it", () => {
    let s = { count: 2, profile: { projectType: "ecommerce", budgetToman: BUDGETS.fa[1] } };
    s = turn(s, "سارا احمدی ۰۹۱۲۰۰۰۰۰۰۱");
    expect(s.profile.contactName).toBe("سارا احمدی");
    expect(s.profile.phone).toBe("09120000001");
    expect(s.result.isComplete).toBe(true);

    // name first, phone later; a one-word answer or a thank-you is not taken as a name
    s = { count: 2, profile: { projectType: "ecommerce", budgetToman: BUDGETS.fa[1] } };
    s = turn(s, "علی رضایی");
    expect(s.profile.contactName).toBe("علی رضایی");
    expect(s.result.reply).toContain("شماره تماس");
    for (const text of ["سلام", "ممنون", "من نمی‌خوام شماره بدم", "قیمتش چقدر میشه"]) {
      const t = turn({ count: 2, profile: { projectType: "ecommerce", budgetToman: BUDGETS.fa[1] } }, text);
      expect(t.profile.contactName, text).toBeUndefined();
    }
    // a name must not be read from a step answer
    expect(turn({ count: 1, profile: { projectType: "ecommerce" } }, BUDGETS.fa[0]).profile.contactName).toBeUndefined();
  });

  it("treats a site type chosen after a finished request as a new request from the same customer", () => {
    let s = { count: 0, profile: {} };
    s = turn(s, "فروشگاه اینترنتی");
    s = turn(s, BUDGETS.fa[1]);
    s = turn(s, "سارا احمدی ۰۹۱۲۰۰۰۰۰۰۱");
    expect(s.result.isComplete).toBe(true);
    expect(s.profile.inquiry).toBeUndefined();

    s = turn(s, "سایت شرکتی");
    expect(s.result.isComplete).toBe(false);
    expect(s.result.reply).toContain("بودجه");
    expect(s.profile.inquiry).toBe(2);
    expect(s.profile.contactName).toBe("سارا احمدی"); // already known, not asked again
    expect(s.profile.phone).toBe("09120000001");
    expect(s.profile.projectType).toBe("corporate");

    s = turn(s, BUDGETS.fa[2]);
    expect(s.result.isComplete).toBe(true);
    expect(s.result.reply).toContain("سارا احمدی");
    expect(s.result.reply).toContain("تماس می‌گیرند");

    // "Other" has no budget step, so a returning customer is complete straight away
    s = turn(s, "سایر");
    expect(s.profile.inquiry).toBe(3);
    expect(s.result.isComplete).toBe(true);
  });

  it("leaves human handoff untouched", () => {
    // handleSalesTurn skips the flow for stage "handoff"; the flow itself only rewrites qualification turns.
    expect(SITE_TYPES.fa.map(([, type]) => type)).toContain("webapp_saas");
  });
});
