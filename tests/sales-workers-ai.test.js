import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import worker, { resolveSalesProvider } from "../worker/index.js";
import { normalizeSalesOutput } from "../worker/workers-ai-sales-provider.js";
import { network } from "./network.js";

const EXTRACTED_KEYS = [
  "businessName", "businessActivity", "goal", "pagesAndFeatures", "designStyle", "contentStatus",
  "languages", "budgetToman", "deadline", "contactName", "phone", "preferredChannel",
];

function salesTurn(overrides = {}) {
  return {
    reply: "سلام! هدف اصلی شما از ساخت سایت چیست؟",
    stage: "discovery",
    projectType: "unknown",
    recommendedTier: "unknown",
    extracted: Object.fromEntries(EXTRACTED_KEYS.map((key) => [key, null])),
    missingFields: ["goal"],
    quickReplies: ["فروش بیشتر", "معرفی برند"],
    isComplete: false,
    confidence: 0.6,
    ...overrides,
  };
}

// No OpenAI key: Sales Chat must run on the Cloudflare AI binding alone.
function workersAiEnv(run, extra = {}) {
  return { ...env, OPENAI_API_KEY: undefined, AI: { run }, ...extra };
}

let ipCounter = 0;

async function postChat(runtimeEnv, id, message = "یک سایت فروشگاهی می‌خواهم") {
  ipCounter += 1;
  const ctx = createExecutionContext();
  const response = await worker.fetch(
    new Request("https://example.com/api/sales/chat", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://example.com",
        "cf-connecting-ip": `198.51.100.${ipCounter}`,
      },
      body: JSON.stringify({ conversationId: id, locale: "fa", message }),
    }),
    runtimeEnv,
    ctx
  );
  await waitOnExecutionContext(ctx);
  return response;
}

const id = (n) => `conv_650e8400-e29b-41d4-a716-44665544${n.toString().padStart(4, "0")}`;

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare("DELETE FROM messages"),
    env.DB.prepare("DELETE FROM conversations"),
    env.DB.prepare("DELETE FROM leads"),
    env.DB.prepare("DELETE FROM rate_limit_counters"),
  ]);
});

describe("sales provider selection", () => {
  it("prefers OpenAI when its key is set, otherwise the Cloudflare AI binding", () => {
    const ai = { run: async () => ({}) };
    expect(resolveSalesProvider({ OPENAI_API_KEY: "k", AI: ai })).toBe("openai");
    expect(resolveSalesProvider({ AI: ai })).toBe("workers_ai");
    expect(resolveSalesProvider({ OPENAI_API_KEY: "k", AI: ai, SALES_AI_PROVIDER: "workers_ai" })).toBe("workers_ai");
    expect(resolveSalesProvider({ AI: ai, SALES_AI_PROVIDER: "openai" })).toBeNull();
    expect(resolveSalesProvider({})).toBeNull();
  });

  it("reports the chat available when only the AI binding exists", async () => {
    const ctx = createExecutionContext();
    const response = await worker.fetch(
      new Request("https://example.com/api/sales/status"),
      workersAiEnv(async () => ({})),
      ctx
    );
    await waitOnExecutionContext(ctx);
    expect((await response.json()).available).toBe(true);
  });
});

describe("sales chat on Workers AI", () => {
  it("answers from the model without calling OpenAI and stores the turn", async () => {
    const openai = vi.fn(() => new HttpResponse(null, { status: 500 }));
    network.use(http.post("https://api.openai.com/v1/responses", openai));
    const run = vi.fn(async () => ({ response: JSON.stringify(salesTurn()) }));
    const response = await postChat(workersAiEnv(run), id(1));
    const body = await response.json();
    expect(response.status).toBe(200);
    // The model's question is dropped; the app asks step one (site type) with fixed options.
    expect(body.reply).toBe("سلام! چه نوع سایتی نیاز دارید؟");
    expect(body.quickReplies).toHaveLength(10);
    expect(openai).not.toHaveBeenCalled();
    const [model, input] = run.mock.calls[0];
    expect(model).toBe("@cf/qwen/qwen3-30b-a3b-fp8");
    expect(input.messages[0].role).toBe("system");
    expect(input.messages.at(-1)).toEqual({ role: "user", content: "یک سایت فروشگاهی می‌خواهم" });
    expect(input.response_format.type).toBe("json_schema");
    expect(await env.DB.prepare("SELECT COUNT(*) AS total FROM messages").first("total")).toBe(2);
  });

  it("falls back to the second model when the first fails", async () => {
    const run = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error("boom"), { status: 503 }))
      .mockResolvedValueOnce({ response: JSON.stringify(salesTurn({ reply: "پاسخ مدل دوم" })) });
    const response = await postChat(workersAiEnv(run), id(2));
    expect((await response.json()).reply).toBe("پاسخ مدل دوم. چه نوع سایتی نیاز دارید؟");
    expect(run.mock.calls.map(([model]) => model)).toEqual([
      "@cf/qwen/qwen3-30b-a3b-fp8",
      "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    ]);
  });

  it("rejects a reply that invents a price and uses the scripted question instead", async () => {
    const run = vi.fn(async () => ({
      response: JSON.stringify(salesTurn({ reply: "قیمت این سایت ۵۰ میلیون تومان است." })),
    }));
    const response = await postChat(workersAiEnv(run), id(3));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.reply).not.toContain("میلیون");
    expect(body.reply.length).toBeGreaterThan(5);
  });

  it("serves the scripted question when the model returns garbage twice", async () => {
    const run = vi.fn(async () => ({ response: "not json" }));
    const response = await postChat(workersAiEnv(run), id(4));
    expect(response.status).toBe(200);
    expect(run).toHaveBeenCalledTimes(2);
    expect((await response.json()).reply.length).toBeGreaterThan(5);
  });

  it("stops calling the model once the hourly cap is reached", async () => {
    const run = vi.fn(async () => ({ response: JSON.stringify(salesTurn()) }));
    const capped = workersAiEnv(run, { WORKERS_AI_SALES_HOURLY_LIMIT: "1" });
    expect((await postChat(capped, id(5))).status).toBe(200);
    expect((await postChat(capped, id(6))).status).toBe(200);
    expect(run).toHaveBeenCalledTimes(1);
  });
});

describe("sales output handling for open-weight models", () => {
  it("reads the JSON from message.reasoning when content is null and turns thinking off for Qwen3 only", async () => {
    const run = vi.fn(async () => ({
      choices: [{ message: { content: null, reasoning: JSON.stringify(salesTurn({ reply: "از reasoning آمد" })) } }],
    }));
    const response = await postChat(workersAiEnv(run), id(7));
    expect((await response.json()).reply).toBe("از reasoning آمد. چه نوع سایتی نیاز دارید؟");
    expect(run.mock.calls[0][1].chat_template_kwargs).toEqual({ enable_thinking: false });

    const llamaRun = vi.fn(async () => ({ response: JSON.stringify(salesTurn()) }));
    await postChat(workersAiEnv(llamaRun, { WORKERS_AI_SALES_MODEL: "@cf/meta/llama-3.3-70b-instruct-fp8-fast" }), id(8));
    expect(llamaRun.mock.calls[0][1].chat_template_kwargs).toBeUndefined();
  });

  it("repairs shape slips such as invented missingFields and oversized quick replies", () => {
    const fixed = normalizeSalesOutput(
      salesTurn({
        stage: "nonsense",
        projectType: "shop",
        missingFields: ["goal", "colour_palette", "goal"],
        quickReplies: ["الف", "", 42, "ب", "ج", "د", "ه"],
        confidence: 7,
        extracted: { goal: "فروش بیشتر", phone: 912, unknownKey: "x" },
      })
    );
    expect(fixed.stage).toBe("qualification");
    expect(fixed.projectType).toBe("unknown");
    expect(fixed.missingFields).toEqual(["goal"]);
    expect(fixed.quickReplies).toEqual(["الف", "ب", "ج", "د"]);
    expect(fixed.confidence).toBe(1);
    expect(Object.keys(fixed.extracted)).toEqual(EXTRACTED_KEYS);
    expect(fixed.extracted.phone).toBe("912");
    expect(fixed.extracted.goal).toBe("فروش بیشتر");
  });

  it("still blocks a price written with Persian digits and a magnitude word", async () => {
    for (const reply of ["هزینه حدود ۵۰ میلیون تومان است.", "قیمت 3 هزار تومان می‌شود."]) {
      const run = vi.fn(async () => ({ response: JSON.stringify(salesTurn({ reply })) }));
      const body = await (await postChat(workersAiEnv(run), id(9 + reply.length))).json();
      expect(body.reply).not.toBe(reply);
    }
  });
});
