const SCHEMA_STATEMENTS = __SCHEMA_STATEMENTS__;

const SALES_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "reply",
    "stage",
    "projectType",
    "recommendedTier",
    "extracted",
    "missingFields",
    "quickReplies",
    "isComplete",
    "confidence",
  ],
  properties: {
    reply: { type: "string" },
    stage: {
      type: "string",
      enum: ["discovery", "qualification", "proposal_ready", "handoff"],
    },
    projectType: {
      type: "string",
      enum: [
        "landing",
        "corporate",
        "ecommerce",
        "booking",
        "marketplace",
        "portfolio",
        "blog_media",
        "learning",
        "webapp_saas",
        "ai",
        "web3",
        "other",
        "unknown",
      ],
    },
    recommendedTier: {
      type: "string",
      enum: ["economic", "professional", "exclusive", "unknown"],
    },
    extracted: {
      type: "object",
      additionalProperties: false,
      required: [
        "businessName",
        "businessActivity",
        "goal",
        "pagesAndFeatures",
        "designStyle",
        "contentStatus",
        "languages",
        "budgetToman",
        "deadline",
        "contactName",
        "phone",
        "preferredChannel",
      ],
      properties: {
        businessName: { type: ["string", "null"] },
        businessActivity: { type: ["string", "null"] },
        goal: { type: ["string", "null"] },
        pagesAndFeatures: { type: ["string", "null"] },
        designStyle: { type: ["string", "null"] },
        contentStatus: { type: ["string", "null"] },
        languages: { type: ["string", "null"] },
        budgetToman: { type: ["string", "null"] },
        deadline: { type: ["string", "null"] },
        contactName: { type: ["string", "null"] },
        phone: { type: ["string", "null"] },
        preferredChannel: { type: ["string", "null"] },
      },
    },
    missingFields: { type: "array", items: { type: "string" } },
    quickReplies: { type: "array", items: { type: "string" } },
    isComplete: { type: "boolean" },
    confidence: { type: "number" },
  },
};

let schemaPromise;

function now() {
  return new Date().toISOString();
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function parseJson(value, fallback = {}) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

async function ensureSchema(env) {
  if (!env.DB) return false;
  if (!schemaPromise) {
    schemaPromise = env.DB.batch(
      SCHEMA_STATEMENTS.map((statement) => env.DB.prepare(statement))
    ).catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  await schemaPromise;
  return true;
}

async function findConversation(env, conversationId, externalUserId) {
  if (!(await ensureSchema(env))) return null;

  if (conversationId) {
    const existing = await env.DB.prepare(
      `SELECT c.id AS conversation_id, c.lead_id, l.requirements_json
       FROM conversations c
       JOIN leads l ON l.id = c.lead_id
       WHERE c.id = ? AND c.status = 'active'
       LIMIT 1`
    )
      .bind(conversationId)
      .first();
    if (existing) return existing;
  }

  if (externalUserId) {
    return env.DB.prepare(
      `SELECT c.id AS conversation_id, c.lead_id, l.requirements_json
       FROM leads l
       JOIN conversations c ON c.lead_id = l.id
       WHERE l.instagram_user_id = ? AND c.channel = 'instagram' AND c.status = 'active'
       ORDER BY c.updated_at DESC
       LIMIT 1`
    )
      .bind(externalUserId)
      .first();
  }

  return null;
}

async function createConversation(env, { locale, source, externalUserId }) {
  const leadId = createId("lead");
  const conversationId = createId("conv");
  const createdAt = now();

  if (await ensureSchema(env)) {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO leads (
          id, source, locale, instagram_user_id, status, requirements_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'discovery', '{}', ?, ?)`
      ).bind(leadId, source, locale, externalUserId ?? null, createdAt, createdAt),
      env.DB.prepare(
        `INSERT INTO conversations (
          id, lead_id, channel, status, created_at, updated_at
        ) VALUES (?, ?, ?, 'active', ?, ?)`
      ).bind(conversationId, leadId, source, createdAt, createdAt),
    ]);
  }

  return {
    conversation_id: conversationId,
    lead_id: leadId,
    requirements_json: "{}",
  };
}

async function resolveConversation(env, input) {
  return (
    (await findConversation(env, input.conversationId, input.externalUserId)) ??
    createConversation(env, input)
  );
}

async function insertMessage(env, conversationId, role, content, metadata = {}) {
  if (!(await ensureSchema(env))) return;
  const createdAt = now();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO messages (id, conversation_id, role, content, metadata_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      createId("msg"),
      conversationId,
      role,
      content,
      JSON.stringify(metadata),
      createdAt
    ),
    env.DB.prepare("UPDATE conversations SET updated_at = ? WHERE id = ?").bind(
      createdAt,
      conversationId
    ),
  ]);
}

async function getHistory(env, conversationId) {
  if (!(await ensureSchema(env))) return [];
  const result = await env.DB.prepare(
    `SELECT role, content
     FROM messages
     WHERE conversation_id = ?
     ORDER BY rowid DESC
     LIMIT 20`
  )
    .bind(conversationId)
    .all();
  return [...(result.results ?? [])].reverse();
}

async function countRecentUserMessages(env, conversationId) {
  if (!(await ensureSchema(env))) return 0;
  const result = await env.DB.prepare(
    `SELECT COUNT(*) AS total
     FROM messages
     WHERE conversation_id = ? AND role = 'user' AND created_at >= ?`
  )
    .bind(conversationId, new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .first();
  return Number(result?.total ?? 0);
}

function fallbackReply(locale, messageCount) {
  const fa = locale === "fa";
  const questions = fa
    ? [
        ["هدف اصلی شما از ساخت سایت چیست؟", ["فروش بیشتر", "معرفی برند", "ارائه خدمات"]],
        ["چه امکانات مهمی باید داخل سایت وجود داشته باشد؟", ["فرم تماس", "فروش آنلاین", "رزرو آنلاین"]],
        ["تقریباً به چند صفحه نیاز دارید؟", ["۱ تا ۵ صفحه", "۶ تا ۱۲ صفحه", "هنوز نمی‌دانم"]],
        ["چه سبک طراحی را می‌پسندید؟ اگر نمونه‌ای دارید لینک آن را بفرستید.", ["مینیمال", "لوکس", "خلاق و متفاوت"]],
        ["متن، لوگو و تصاویر سایت آماده هستند؟", ["همه آماده است", "بخشی آماده است", "نیاز به تولید محتوا دارم"]],
        ["حدود بودجه‌ای که برای پروژه در نظر گرفته‌اید چقدر است؟", ["اقتصادی", "حرفه‌ای", "اختصاصی"]],
        ["چه زمانی می‌خواهید سایت آماده شود؟", ["کمتر از یک ماه", "۱ تا ۲ ماه", "زمان انعطاف‌پذیر است"]],
        ["برای تکمیل درخواست، نام و شماره تماس خود را بفرستید.", []],
      ]
    : [
        ["What is the main goal of your website?", ["More sales", "Brand presence", "Offer services"]],
        ["Which important features should the website include?", ["Contact forms", "Online sales", "Online booking"]],
        ["Roughly how many pages do you need?", ["1–5 pages", "6–12 pages", "Not sure yet"]],
        ["Which design style do you prefer? Share a reference link if you have one.", ["Minimal", "Premium", "Bold and creative"]],
        ["Are the copy, logo, and images ready?", ["Everything is ready", "Partly ready", "I need content support"]],
        ["Which budget level fits the project?", ["Economic", "Professional", "Exclusive"]],
        ["When would you like the website to be ready?", ["Under one month", "1–2 months", "Flexible"]],
        ["Please send your name and phone number to complete the request.", []],
      ];

  const index = Math.max(0, Math.min(messageCount - 1, questions.length));
  const complete = index >= questions.length;
  return {
    reply: complete
      ? fa
        ? "ممنون. اطلاعات اولیه ثبت شد. خلاصه نیازمندی و پیشنهاد مناسب برای شما آماده می‌شود."
        : "Thank you. Your initial request is registered and we’ll prepare the right scope and recommendation."
      : questions[index][0],
    stage: complete ? "proposal_ready" : "discovery",
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
    missingFields: [],
    quickReplies: complete ? [] : questions[index][1],
    isComplete: complete,
    confidence: 0,
  };
}

function extractOutputText(response) {
  for (const item of response.output ?? []) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  return "";
}

async function callSalesModel(env, { locale, history, profile, messageCount }) {
  if (!env.OPENAI_API_KEY) return fallbackReply(locale, messageCount);

  const isFa = locale === "fa";
  const instructions = `You are the autonomous sales consultant for SoSho Studio, a web design and development studio serving Iran.
Reply in ${isFa ? "natural Persian" : "clear English"}.
Your job is to qualify requests for every website category: landing pages, corporate websites, portfolios, ecommerce, booking, marketplaces, learning platforms, media sites, SaaS/web apps, AI systems, and Web3 projects.
Ask exactly one high-value question per turn. Do not repeat information already collected. Be concise, warm, and consultative.
Collect: business name/activity, business goal, project type, pages/features, design style/references, content readiness, languages, budget in toman, deadline, contact name, phone, and preferred contact channel.
Recommend economic for simple/template-led work, professional for custom business websites and stores, and exclusive for complex custom systems, marketplaces, AI, Web3, or advanced integrations.
Never invent or promise an exact price, discount, deadline, legal term, or technical feature. Exact pricing is calculated later by deterministic business rules.
When the essential scope and contact details are complete, set isComplete=true and stage=proposal_ready, then give a compact summary instead of asking another question.
If the user asks something unrelated, answer briefly and guide them back to their website request.
Existing extracted profile: ${JSON.stringify(profile)}.`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-5.6-luna",
      store: false,
      max_output_tokens: 1200,
      instructions,
      input: history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      text: {
        format: {
          type: "json_schema",
          name: "sosho_sales_turn",
          strict: true,
          schema: SALES_RESPONSE_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI response failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  const payload = await response.json();
  const outputText = extractOutputText(payload);
  if (!outputText) throw new Error("OpenAI returned no structured output");
  return JSON.parse(outputText);
}

function mergeProfile(current, extracted) {
  const next = { ...current };
  for (const [key, value] of Object.entries(extracted ?? {})) {
    if (typeof value === "string" && value.trim()) next[key] = value.trim();
  }
  return next;
}

async function updateLead(env, leadId, result, profile) {
  if (!(await ensureSchema(env))) return;
  await env.DB.prepare(
    `UPDATE leads
     SET status = ?, project_type = ?, tier = ?, budget = ?, requirements_json = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(
      result.stage,
      result.projectType === "unknown" ? null : result.projectType,
      result.recommendedTier === "unknown" ? null : result.recommendedTier,
      profile.budgetToman ?? null,
      JSON.stringify(profile),
      now(),
      leadId
    )
    .run();
}

async function handleSalesTurn(env, input) {
  const locale = input.locale === "en" ? "en" : "fa";
  const message = String(input.message ?? "").trim();
  if (!message || message.length > 2000) {
    return { error: "invalid_message", status: 400 };
  }

  const conversation = await resolveConversation(env, {
    conversationId: input.conversationId,
    externalUserId: input.externalUserId,
    locale,
    source: input.source === "instagram" ? "instagram" : "website",
  });

  const recentMessages = await countRecentUserMessages(env, conversation.conversation_id);
  if (recentMessages >= 30) return { error: "rate_limited", status: 429 };

  await insertMessage(env, conversation.conversation_id, "user", message, {
    source: input.source,
  });

  const storedHistory = await getHistory(env, conversation.conversation_id);
  const history = storedHistory.length
    ? storedHistory
    : [{ role: "user", content: message }];
  const messageCount = storedHistory.length
    ? storedHistory.filter((item) => item.role === "user").length
    : Number(input.messageCount ?? 1);
  const profile = parseJson(conversation.requirements_json, {});

  let result;
  try {
    result = await callSalesModel(env, {
      locale,
      history,
      profile,
      messageCount,
    });
  } catch {
    result = fallbackReply(locale, messageCount);
  }

  const updatedProfile = mergeProfile(profile, result.extracted);
  await updateLead(env, conversation.lead_id, result, updatedProfile);
  await insertMessage(env, conversation.conversation_id, "assistant", result.reply, {
    stage: result.stage,
    confidence: result.confidence,
  });

  return {
    conversationId: conversation.conversation_id,
    leadId: conversation.lead_id,
    reply: result.reply,
    stage: result.stage,
    quickReplies: result.quickReplies,
    isComplete: result.isComplete,
    status: 200,
  };
}

async function verifyMetaSignature(body, signature, appSecret) {
  if (!signature?.startsWith("sha256=") || !appSecret) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const expected = `sha256=${[...new Uint8Array(signed)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}`;
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  }
  return mismatch === 0;
}

async function rememberWebhook(env, eventId, payload) {
  if (!(await ensureSchema(env)) || !eventId) return true;
  const result = await env.DB.prepare(
    `INSERT OR IGNORE INTO webhook_events
     (id, channel, external_event_id, payload_json, status, created_at)
     VALUES (?, 'instagram', ?, ?, 'received', ?)`
  )
    .bind(createId("webhook"), eventId, JSON.stringify(payload), now())
    .run();
  return Number(result.meta?.changes ?? 0) > 0;
}

async function sendInstagramMessage(env, recipientId, text) {
  if (!env.META_INSTAGRAM_ACCESS_TOKEN) return;
  const version = env.META_GRAPH_VERSION || "v26.0";
  const response = await fetch(`https://graph.instagram.com/${version}/me/messages`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.META_INSTAGRAM_ACCESS_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text: text.slice(0, 1000) },
    }),
  });
  if (!response.ok) throw new Error(`Instagram send failed (${response.status})`);
}

async function processInstagramWebhook(env, payload) {
  for (const entry of payload.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      const text = event.message?.text;
      const senderId = event.sender?.id;
      const eventId = event.message?.mid;
      if (!text || !senderId || event.message?.is_echo) continue;
      if (!(await rememberWebhook(env, eventId, event))) continue;

      const result = await handleSalesTurn(env, {
        locale: "fa",
        message: text,
        source: "instagram",
        externalUserId: senderId,
        messageCount: 1,
      });
      if (!result.error && result.reply) {
        await sendInstagramMessage(env, senderId, result.reply);
      }
    }
  }
}

async function handleApi(request, env, ctx, url) {
  if (request.method === "GET" && url.pathname === "/api/health") {
    return json({
      ok: true,
      aiConfigured: Boolean(env.OPENAI_API_KEY),
      databaseConfigured: Boolean(env.DB),
      instagramConfigured: Boolean(
        env.META_APP_SECRET && env.META_VERIFY_TOKEN && env.META_INSTAGRAM_ACCESS_TOKEN
      ),
    });
  }

  if (url.pathname === "/api/meta/webhook" && request.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token && token === env.META_VERIFY_TOKEN && challenge) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  if (url.pathname === "/api/meta/webhook" && request.method === "POST") {
    const body = await request.text();
    const validSignature = await verifyMetaSignature(
      body,
      request.headers.get("x-hub-signature-256"),
      env.META_APP_SECRET
    );
    if (!validSignature) return new Response("Unauthorized", { status: 401 });
    const payload = parseJson(body, null);
    if (!payload) return new Response("Bad Request", { status: 400 });
    ctx.waitUntil(processInstagramWebhook(env, payload));
    return new Response("EVENT_RECEIVED", { status: 200 });
  }

  if (url.pathname === "/api/sales/chat" && request.method === "POST") {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }
    const result = await handleSalesTurn(env, body);
    if (result.error) return json({ error: result.error }, result.status);
    const payload = { ...result };
    delete payload.status;
    return json(payload);
  }

  return json({ error: "not_found" }, 404);
}

const worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, ctx, url);
    }

    if (url.pathname === "/") {
      return Response.redirect(new URL("/fa", url), 308);
    }

    let response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const candidates = url.pathname.endsWith("/")
      ? [url.pathname + "index.html"]
      : [url.pathname + ".html", url.pathname + "/index.html"];

    for (const pathname of candidates) {
      const candidateUrl = new URL(url);
      candidateUrl.pathname = pathname;
      response = await env.ASSETS.fetch(new Request(candidateUrl, request));
      if (response.status !== 404) return response;
    }

    const firstSegment = url.pathname.split("/").filter(Boolean)[0];
    if (firstSegment !== "fa" && firstSegment !== "en" && !url.pathname.includes(".")) {
      const localized = new URL(url);
      localized.pathname = "/fa" + url.pathname;
      return Response.redirect(localized, 308);
    }

    return response;
  },
};

export default worker;
