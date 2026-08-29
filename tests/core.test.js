import { describe, expect, it, vi } from "vitest";

import {
  ServiceError,
  fallbackReply,
  logEvent,
  readOpenAIErrorDiagnostics,
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
  it("extracts only bounded OpenAI error diagnostics", async () => {
    const response = Response.json({
      error: {
        type: "request_forbidden",
        code: "unsupported_country_region_territory",
        message: "Sensitive provider message with sk-test-secret",
        param: "sensitive prompt value",
      },
    }, {
      status: 403,
      headers: { "x-request-id": "req_safe_403" },
    });

    await expect(readOpenAIErrorDiagnostics(response)).resolves.toEqual({
      providerRequestId: "req_safe_403",
      providerErrorType: "request_forbidden",
      providerErrorCode: "unsupported_country_region_territory",
    });

    const oversized = new Response(JSON.stringify({
      error: { code: "must_not_be_read", message: "x".repeat(20_000) },
    }), {
      status: 403,
      headers: { "x-request-id": "req_oversized" },
    });
    await expect(readOpenAIErrorDiagnostics(oversized)).resolves.toEqual({
      providerRequestId: "req_oversized",
    });
  });

  it("allows safe provider diagnostics without logging secrets or messages", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    logEvent("warn", "provider_request_failed", {
      requestId: "req_worker",
      provider: "openai",
      providerRequestId: "req_provider",
      providerErrorType: "request_forbidden",
      providerErrorCode: "permission_denied",
      authorization: "Bearer sk-test-secret",
      message: "Sensitive provider message",
      prompt: "Sensitive prompt",
    });
    const output = warning.mock.calls.flat().join(" ");
    warning.mockRestore();

    expect(JSON.parse(output)).toMatchObject({
      event: "provider_request_failed",
      providerRequestId: "req_provider",
      providerErrorType: "request_forbidden",
      providerErrorCode: "permission_denied",
    });
    expect(output).not.toContain("sk-test-secret");
    expect(output).not.toContain("Sensitive provider message");
    expect(output).not.toContain("Sensitive prompt");
  });

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
