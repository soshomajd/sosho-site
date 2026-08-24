import { describe, expect, it } from "vitest";

import {
  ServiceError,
  fallbackReply,
  retryWithBackoff,
  validateSalesResponse,
  validateWebsiteChatInput,
} from "../worker/core.js";

function validSalesResponse(reply = "Which features do you need?") {
  return {
    reply,
    stage: "discovery",
    projectType: "unknown",
    recommendedTier: "unknown",
    extracted: {
      businessName: null,
      businessActivity: null,
      goal: null,
      pagesAndFeatures: null,
      designStyle: null,
      contentStatus: null,
      languages: null,
      budgetToman: null,
      deadline: null,
      contactName: null,
      phone: null,
      preferredChannel: null,
    },
    missingFields: ["goal"],
    quickReplies: ["Online sales"],
    isComplete: false,
    confidence: 0.5,
  };
}

describe("website chat validation", () => {
  it("accepts the exact public request contract", () => {
    const result = validateWebsiteChatInput({
      conversationId: "conv_550e8400-e29b-41d4-a716-446655440000",
      locale: "fa",
      message: "  فروشگاه می‌خواهم  ",
    });
    expect(result).toEqual({
      ok: true,
      value: {
        conversationId: "conv_550e8400-e29b-41d4-a716-446655440000",
        locale: "fa",
        message: "فروشگاه می‌خواهم",
      },
    });
  });

  it.each(["source", "externalUserId", "messageCount", "instagramUserId"])(
    "rejects the forged %s field",
    (field) => {
      const result = validateWebsiteChatInput({
        conversationId: "conv_550e8400-e29b-41d4-a716-446655440000",
        locale: "en",
        message: "I need a website",
        [field]: "forged",
      });
      expect(result.ok).toBe(false);
      expect(result.issues).toContainEqual({ path: field, code: "unknown_field" });
    }
  );

  it("enforces the schema length before trimming", () => {
    const result = validateWebsiteChatInput({
      conversationId: "conv_550e8400-e29b-41d4-a716-446655440000",
      locale: "en",
      message: `a${" ".repeat(2000)}`,
    });
    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({ path: "message", code: "invalid_length" });
  });
});

describe("provider response safeguards", () => {
  it("rejects invented prices and delivery commitments", () => {
    expect(validateSalesResponse(validSalesResponse("The exact price is 20,000 dollars."))).toEqual({
      ok: false,
      code: "invented_price",
    });
    expect(validateSalesResponse(validSalesResponse("We will deliver within 5 days."))).toEqual({
      ok: false,
      code: "invented_delivery_commitment",
    });
  });

  it("returns deterministic bilingual fallback replies", () => {
    expect(fallbackReply("fa", 1).reply).toContain("هدف اصلی");
    expect(fallbackReply("en", 2).reply).toContain("features");
  });

  it("retries retryable failures with exponential backoff", async () => {
    const attempts = [];
    const delays = [];
    const result = await retryWithBackoff(
      async (attempt) => {
        attempts.push(attempt);
        if (attempt < 3) throw new ServiceError("temporary", { retryable: true });
        return "ok";
      },
      {
        maxAttempts: 3,
        baseDelayMs: 5,
        sleep: async (delay) => delays.push(delay),
      }
    );
    expect(result).toBe("ok");
    expect(attempts).toEqual([1, 2, 3]);
    expect(delays).toEqual([5, 10]);
  });
});
