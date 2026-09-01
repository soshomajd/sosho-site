import { ServiceError, parseJson } from "./core.js";
import { campaignActionAvailability } from "./campaign-actions.js";
import { validateContentBundle } from "./content-generation.js";

const ADMIN_SESSION_COOKIE = "sosho_admin_session";
const ADMIN_SESSION_VERSION = 1;
const ADMIN_SESSION_DEFAULT_TTL_SECONDS = 8 * 60 * 60;
const ADMIN_SESSION_MAX_TTL_SECONDS = 24 * 60 * 60;
const CAMPAIGN_STATUSES = new Set([
  "draft",
  "generating",
  "generated",
  "approved",
  "rejected",
  "failed",
]);
const LEAD_STATUSES = new Set(["discovery", "qualification", "proposal_ready", "handoff"]);
const SOURCES = new Set(["website", "instagram"]);
const CONVERSATION_STATUSES = new Set(["active", "closed"]);
const HANDOFF_FILTERS = new Set(["true", "false"]);

function encodeBase64Url(value) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/gu, "");
}

function decodeBase64Url(value) {
  if (typeof value !== "string" || value.length < 1 || value.length > 2048 ||
      !/^[A-Za-z0-9_-]+$/u.test(value)) return null;
  const padded = value.replace(/-/gu, "+").replace(/_/gu, "/") +
    "=".repeat((4 - (value.length % 4)) % 4);
  try {
    return Uint8Array.from(atob(padded), (character) => character.codePointAt(0));
  } catch {
    return null;
  }
}

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
}

async function csrfTokenForSession(secret, sessionValue) {
  return encodeBase64Url(await hmac(secret, `csrf:${sessionValue}`));
}

async function constantTimeTextEquals(provided, expected) {
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(provided))),
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(expected))),
  ]);
  return crypto.subtle.timingSafeEqual(
    new Uint8Array(providedHash),
    new Uint8Array(expectedHash)
  );
}

function readCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    if (part.slice(0, separator).trim() === name) return part.slice(separator + 1).trim();
  }
  return null;
}

export async function verifyAdminToken(provided, env) {
  if (!env.ADMIN_API_TOKEN) {
    throw new ServiceError("admin_auth_not_configured", { status: 503 });
  }
  return constantTimeTextEquals(provided || "", env.ADMIN_API_TOKEN);
}

export async function requireAdminBearer(request, env) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!(await verifyAdminToken(token, env))) {
    throw new ServiceError("unauthorized", { status: 401 });
  }
}

export async function createAdminSession(env, currentTimeMs = Date.now()) {
  if (!env.ADMIN_API_TOKEN) {
    throw new ServiceError("admin_auth_not_configured", { status: 503 });
  }
  const expiresAt = currentTimeMs + ADMIN_SESSION_DEFAULT_TTL_SECONDS * 1000;
  const payload = encodeBase64Url(JSON.stringify({
    v: ADMIN_SESSION_VERSION,
    exp: expiresAt,
    nonce: crypto.randomUUID(),
  }));
  const signature = encodeBase64Url(await hmac(env.ADMIN_API_TOKEN, payload));
  const value = `${payload}.${signature}`;
  return {
    value,
    expiresAt,
    csrfToken: await csrfTokenForSession(env.ADMIN_API_TOKEN, value),
  };
}

export async function verifyAdminSession(request, env, currentTimeMs = Date.now()) {
  if (!env.ADMIN_API_TOKEN) {
    throw new ServiceError("admin_auth_not_configured", { status: 503 });
  }
  const value = readCookie(request, ADMIN_SESSION_COOKIE);
  if (!value || value.length > 4096) return null;
  const parts = value.split(".");
  if (parts.length !== 2) return null;
  const providedSignature = decodeBase64Url(parts[1]);
  if (!providedSignature || providedSignature.byteLength !== 32) return null;
  const expectedSignature = await hmac(env.ADMIN_API_TOKEN, parts[0]);
  if (!crypto.subtle.timingSafeEqual(providedSignature, expectedSignature)) return null;
  const payloadBytes = decodeBase64Url(parts[0]);
  if (!payloadBytes) return null;
  let payload;
  try {
    payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(payloadBytes));
  } catch {
    return null;
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload) ||
      Object.keys(payload).sort().join(",") !== "exp,nonce,v" ||
      payload.v !== ADMIN_SESSION_VERSION || !Number.isSafeInteger(payload.exp) ||
      typeof payload.nonce !== "string" || payload.nonce.length > 64 ||
      payload.exp <= currentTimeMs ||
      payload.exp > currentTimeMs + ADMIN_SESSION_MAX_TTL_SECONDS * 1000) {
    return null;
  }
  return {
    expiresAt: payload.exp,
    csrfToken: await csrfTokenForSession(env.ADMIN_API_TOKEN, value),
  };
}

export async function requireAdminSessionAction(request, env) {
  const session = await verifyAdminSession(request, env);
  if (!session) throw new ServiceError("unauthorized", { status: 401 });
  const provided = request.headers.get("x-csrf-token") || "";
  if (provided.length < 1 || provided.length > 128 ||
      !(await constantTimeTextEquals(provided, session.csrfToken))) {
    throw new ServiceError("invalid_csrf", { status: 403 });
  }
  return { type: "session", ...session };
}

export async function requireDashboardAdmin(request, env) {
  if ((request.headers.get("authorization") || "").startsWith("Bearer ")) {
    await requireAdminBearer(request, env);
    return { type: "bearer", expiresAt: null };
  }
  const session = await verifyAdminSession(request, env);
  if (!session) throw new ServiceError("unauthorized", { status: 401 });
  return { type: "session", ...session };
}

export function adminSessionCookie(request, value, maxAgeSeconds) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=${value}; Path=/api/admin; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Strict${secure}`;
}

export function clearAdminSessionCookie(request) {
  return adminSessionCookie(request, "", 0);
}

function ensureAllowedParams(url, allowed) {
  for (const key of url.searchParams.keys()) {
    if (!allowed.has(key) || url.searchParams.getAll(key).length !== 1) {
      throw new ServiceError("invalid_request", { status: 400 });
    }
  }
}

function parsePositiveInteger(value, fallback, { min, max }) {
  if (value === null || value === "") return fallback;
  if (!/^\d+$/u.test(value)) throw new ServiceError("invalid_request", { status: 400 });
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new ServiceError("invalid_request", { status: 400 });
  }
  return parsed;
}

function parseEnum(value, allowed) {
  if (value === null || value === "") return null;
  if (!allowed.has(value)) throw new ServiceError("invalid_request", { status: 400 });
  return value;
}

function paginationFrom(url) {
  const page = parsePositiveInteger(url.searchParams.get("page"), 1, { min: 1, max: 100_000 });
  const pageSize = parsePositiveInteger(url.searchParams.get("limit"), 20, { min: 1, max: 50 });
  return { page, pageSize, offset: (page - 1) * pageSize };
}

function paginationMeta(page, pageSize, total) {
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };
}

function firstResult(result) {
  return result?.results?.[0] ?? {};
}

function resultRows(result) {
  return result?.results ?? [];
}

function compactId(id) {
  const value = String(id || "");
  return value.length > 10 ? value.slice(-8) : value;
}

function boundedOptionalText(value, maxLength = 120) {
  if (typeof value !== "string") return null;
  const normalized = value.replace(/\s+/gu, " ").trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function mediaCapability(env) {
  return env.MEDIA && typeof env.MEDIA.get === "function" && typeof env.MEDIA.put === "function"
    ? "available"
    : "activation_required";
}

function aiStatusFromLatestRole(role) {
  if (role === "assistant") return "responded";
  if (role === "user") return "waiting";
  return "not_started";
}

function redactMessage(value) {
  return String(value || "")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu, "[email hidden]")
    .replace(/(?:\+?\d[\d\s().-]{7,}\d)/gu, "[contact hidden]")
    .replace(
      /(?:[+\u0660-\u0669\u06f0-\u06f9][\u0660-\u0669\u06f0-\u06f9\s().-]{7,}[\u0660-\u0669\u06f0-\u06f9])/gu,
      "[contact hidden]"
    )
    .slice(0, 800);
}

export async function getAdminOverview(db) {
  const [campaignCounts, leadCount, activeConversations, handoffs, campaigns, leads, conversations] =
    await db.batch([
      db.prepare(
        `SELECT COUNT(*) AS total,
                SUM(status = 'draft') AS draft,
                SUM(status = 'generating') AS generating,
                SUM(status = 'generated') AS generated,
                SUM(status = 'failed') AS failed,
                SUM(approval_status = 'approved') AS approved,
                SUM(approval_status = 'rejected') AS rejected
         FROM content_campaigns`
      ),
      db.prepare("SELECT COUNT(*) AS total FROM leads"),
      db.prepare("SELECT COUNT(*) AS total FROM conversations WHERE status = 'active'"),
      db.prepare("SELECT COUNT(*) AS total FROM leads WHERE status = 'handoff'"),
      db.prepare(
        `SELECT id, topic AS label, status, updated_at
         FROM content_campaigns ORDER BY updated_at DESC, id DESC LIMIT 5`
      ),
      db.prepare(
        `SELECT id, source AS label, status, updated_at
         FROM leads ORDER BY updated_at DESC, id DESC LIMIT 5`
      ),
      db.prepare(
        `SELECT id, channel AS label, status, updated_at
         FROM conversations ORDER BY updated_at DESC, id DESC LIMIT 5`
      ),
    ]);
  const campaignRow = firstResult(campaignCounts);
  const activities = [
    ...resultRows(campaigns).map((row) => ({ type: "campaign", ...row })),
    ...resultRows(leads).map((row) => ({ type: "lead", ...row, label: compactId(row.id) })),
    ...resultRows(conversations).map((row) => ({ type: "conversation", ...row })),
  ]
    .sort((left, right) => String(right.updated_at).localeCompare(String(left.updated_at)))
    .slice(0, 12)
    .map((row) => ({
      type: row.type,
      id: row.id,
      label: boundedOptionalText(row.label, 160),
      status: row.status,
      occurredAt: row.updated_at,
    }));
  return {
    campaigns: {
      total: Number(campaignRow.total ?? 0),
      draft: Number(campaignRow.draft ?? 0),
      generating: Number(campaignRow.generating ?? 0),
      generated: Number(campaignRow.generated ?? 0),
      approved: Number(campaignRow.approved ?? 0),
      rejected: Number(campaignRow.rejected ?? 0),
      failed: Number(campaignRow.failed ?? 0),
    },
    leads: Number(firstResult(leadCount).total ?? 0),
    activeConversations: Number(firstResult(activeConversations).total ?? 0),
    humanHandoffs: Number(firstResult(handoffs).total ?? 0),
    recentActivities: activities,
  };
}

export async function getAdminCampaigns(db, env, url) {
  ensureAllowedParams(url, new Set(["page", "limit", "status"]));
  const { page, pageSize, offset } = paginationFrom(url);
  const status = parseEnum(url.searchParams.get("status"), CAMPAIGN_STATUSES);
  const where = [];
  const bindings = [];
  if (status === "approved" || status === "rejected") {
    where.push("cc.approval_status = ?");
    bindings.push(status);
  } else if (status) {
    where.push("cc.status = ?");
    bindings.push(status);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [countResult, listResult] = await db.batch([
    db.prepare(`SELECT COUNT(*) AS total FROM content_campaigns cc ${whereSql}`).bind(...bindings),
    db.prepare(
      `SELECT cc.id, cc.topic, cc.target_audience, cc.status, cc.approval_status,
              cc.created_at, cc.updated_at, ci.content_json,
              ci.provider AS content_provider, ci.model AS content_model,
              cm.status AS media_status, cm.telegram_preview_status,
              cm.provider AS media_provider, cm.model AS media_model
       FROM content_campaigns cc
       LEFT JOIN content_items ci ON ci.id = (
         SELECT item.id FROM content_items item
         WHERE item.campaign_id = cc.id AND item.validation_status = 'valid'
         ORDER BY item.created_at DESC, item.id DESC LIMIT 1
       )
       LEFT JOIN content_media cm
         ON cm.campaign_id = cc.id AND cm.media_type = 'main_image'
       ${whereSql}
       ORDER BY cc.updated_at DESC, cc.id DESC
       LIMIT ? OFFSET ?`
    ).bind(...bindings, pageSize, offset),
  ]);
  const total = Number(firstResult(countResult).total ?? 0);
  const items = resultRows(listResult).map((row) => {
    const content = parseJson(row.content_json, null);
    return {
      id: row.id,
      title: boundedOptionalText(content?.campaignTitle, 160) || row.topic,
      topic: row.topic,
      targetAudience: row.target_audience,
      status: row.status,
      approvalStatus: row.approval_status,
      provider: row.content_provider ?? null,
      model: row.content_model ?? null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      media: row.media_status ? {
        status: row.media_status,
        telegramPreviewStatus: row.telegram_preview_status,
      } : null,
    };
  });
  return {
    items,
    pagination: paginationMeta(page, pageSize, total),
    filters: { status },
    mediaCapability: mediaCapability(env),
  };
}

export async function getAdminCampaignDetail(db, env, campaignId) {
  if (typeof campaignId !== "string" || campaignId.length > 100 ||
      !/^campaign_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu
        .test(campaignId)) {
    throw new ServiceError("invalid_campaign_id", { status: 400 });
  }
  const campaign = await db.prepare(
    `SELECT id, topic, target_audience, goal, language, status, approval_status,
            approval_decided_at, rejection_reason, scheduled_at, created_at, updated_at
     FROM content_campaigns WHERE id = ? LIMIT 1`
  ).bind(campaignId).first();
  if (!campaign) throw new ServiceError("campaign_not_found", { status: 404 });
  const [contentItem, media] = await Promise.all([
    db.prepare(
      `SELECT id, content_type, platform, content_json, validation_status,
              provider, model, created_at, updated_at
       FROM content_items
       WHERE campaign_id = ? AND validation_status = 'valid'
       ORDER BY created_at DESC, id DESC LIMIT 1`
    ).bind(campaignId).first(),
    db.prepare(
      `SELECT id, media_type, mime_type, byte_size, status, provider, model,
              attempt_count, telegram_preview_status, created_at, updated_at, stored_at
       FROM content_media
       WHERE campaign_id = ? AND media_type = 'main_image' LIMIT 1`
    ).bind(campaignId).first(),
  ]);
  const parsedContent = contentItem ? parseJson(contentItem.content_json, null) : null;
  const contentValidation = parsedContent ? validateContentBundle(parsedContent) : { ok: false };
  const content = contentValidation.ok ? contentValidation.value : null;
  return {
    campaign: {
      id: campaign.id,
      topic: campaign.topic,
      targetAudience: campaign.target_audience,
      goal: campaign.goal,
      language: campaign.language,
      status: campaign.status,
      approvalStatus: campaign.approval_status,
      approvalDecidedAt: campaign.approval_decided_at,
      rejectionReason: campaign.rejection_reason,
      scheduledAt: campaign.scheduled_at,
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
    },
    contentItem: contentItem ? {
      id: contentItem.id,
      contentType: contentItem.content_type,
      platform: contentItem.platform,
      content,
      validationStatus: contentItem.validation_status,
      provider: contentItem.provider,
      model: contentItem.model,
      createdAt: contentItem.created_at,
      updatedAt: contentItem.updated_at,
    } : null,
    media: media ? {
      id: media.id,
      mediaType: media.media_type,
      mimeType: media.mime_type,
      byteSize: media.byte_size,
      status: media.status,
      provider: media.provider,
      model: media.model,
      attemptCount: media.attempt_count,
      telegramPreviewStatus: media.telegram_preview_status,
      createdAt: media.created_at,
      updatedAt: media.updated_at,
      storedAt: media.stored_at,
    } : null,
    mediaCapability: mediaCapability(env),
    allowedActions: campaignActionAvailability(campaign),
  };
}

export async function getAdminLeads(db, url) {
  ensureAllowedParams(url, new Set(["page", "limit", "status", "source"]));
  const { page, pageSize, offset } = paginationFrom(url);
  const status = parseEnum(url.searchParams.get("status"), LEAD_STATUSES);
  const source = parseEnum(url.searchParams.get("source"), SOURCES);
  const where = [];
  const bindings = [];
  if (status) {
    where.push("status = ?");
    bindings.push(status);
  }
  if (source) {
    where.push("source = ?");
    bindings.push(source);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [countResult, listResult] = await db.batch([
    db.prepare(`SELECT COUNT(*) AS total FROM leads ${whereSql}`).bind(...bindings),
    db.prepare(
      `SELECT id, source, status, project_type, budget, requirements_json,
              anonymized_at, created_at, updated_at
       FROM leads ${whereSql}
       ORDER BY updated_at DESC, id DESC
       LIMIT ? OFFSET ?`
    ).bind(...bindings, pageSize, offset),
  ]);
  const total = Number(firstResult(countResult).total ?? 0);
  const items = resultRows(listResult).map((row) => {
    const requirements = parseJson(row.requirements_json, {});
    const recordedName = row.anonymized_at
      ? null
      : boundedOptionalText(requirements.contactName || requirements.businessName, 80);
    return {
      id: row.id,
      safeIdentifier: compactId(row.id),
      displayName: recordedName,
      source: row.source,
      projectType: row.project_type ?? null,
      budget: row.budget ?? null,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });
  return {
    items,
    pagination: paginationMeta(page, pageSize, total),
    filters: { status, source },
  };
}

export async function getAdminConversations(db, url) {
  ensureAllowedParams(url, new Set(["page", "limit", "status", "channel", "handoff"]));
  const { page, pageSize, offset } = paginationFrom(url);
  const status = parseEnum(url.searchParams.get("status"), CONVERSATION_STATUSES);
  const channel = parseEnum(url.searchParams.get("channel"), SOURCES);
  const handoff = parseEnum(url.searchParams.get("handoff"), HANDOFF_FILTERS);
  const where = [];
  const bindings = [];
  if (status) {
    where.push("c.status = ?");
    bindings.push(status);
  }
  if (channel) {
    where.push("c.channel = ?");
    bindings.push(channel);
  }
  if (handoff) where.push(handoff === "true" ? "l.status = 'handoff'" : "l.status != 'handoff'");
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [countResult, listResult] = await db.batch([
    db.prepare(
      `SELECT COUNT(*) AS total
       FROM conversations c JOIN leads l ON l.id = c.lead_id ${whereSql}`
    ).bind(...bindings),
    db.prepare(
      `SELECT c.id, c.channel, c.status, c.created_at, c.updated_at,
              l.status AS lead_status,
              COUNT(m.id) AS message_count,
              MAX(m.created_at) AS last_message_at,
              (SELECT latest.role FROM messages latest
               WHERE latest.conversation_id = c.id
               ORDER BY latest.created_at DESC, latest.rowid DESC LIMIT 1) AS latest_role
       FROM conversations c
       JOIN leads l ON l.id = c.lead_id
       LEFT JOIN messages m ON m.conversation_id = c.id
       ${whereSql}
       GROUP BY c.id, c.channel, c.status, c.created_at, c.updated_at, l.status
       ORDER BY c.updated_at DESC, c.id DESC
       LIMIT ? OFFSET ?`
    ).bind(...bindings, pageSize, offset),
  ]);
  const total = Number(firstResult(countResult).total ?? 0);
  const items = resultRows(listResult).map((row) => ({
    id: row.id,
    safeIdentifier: compactId(row.id),
    channel: row.channel,
    status: row.status,
    aiStatus: aiStatusFromLatestRole(row.latest_role),
    humanHandoff: row.lead_status === "handoff",
    lastMessageAt: row.last_message_at ?? null,
    messageCount: Number(row.message_count ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
  return {
    items,
    pagination: paginationMeta(page, pageSize, total),
    filters: { status, channel, handoff },
  };
}

export async function getAdminConversationDetail(db, conversationId) {
  if (typeof conversationId !== "string" || conversationId.length < 1 ||
      conversationId.length > 100 || !/^[a-z0-9_-]+$/iu.test(conversationId)) {
    throw new ServiceError("invalid_conversation_id", { status: 400 });
  }
  const conversation = await db.prepare(
    `SELECT c.id, c.channel, c.status, c.created_at, c.updated_at,
            l.status AS lead_status,
            (SELECT COUNT(*) FROM messages counted WHERE counted.conversation_id = c.id)
              AS message_count,
            (SELECT latest.role FROM messages latest
             WHERE latest.conversation_id = c.id
             ORDER BY latest.created_at DESC, latest.rowid DESC LIMIT 1) AS latest_role
     FROM conversations c
     JOIN leads l ON l.id = c.lead_id
     WHERE c.id = ? LIMIT 1`
  ).bind(conversationId).first();
  if (!conversation) throw new ServiceError("conversation_not_found", { status: 404 });
  const messageResult = await db.prepare(
    `SELECT role, content, metadata_json, created_at
     FROM messages WHERE conversation_id = ?
     ORDER BY created_at DESC, rowid DESC LIMIT 50`
  ).bind(conversationId).all();
  const messages = [...(messageResult.results ?? [])].reverse().map((row) => {
    const metadata = parseJson(row.metadata_json, {});
    return {
      role: row.role,
      contentPreview: redactMessage(row.content),
      stage: boundedOptionalText(metadata.stage, 40),
      createdAt: row.created_at,
    };
  });
  return {
    conversation: {
      id: conversation.id,
      safeIdentifier: compactId(conversation.id),
      channel: conversation.channel,
      status: conversation.status,
      aiStatus: aiStatusFromLatestRole(conversation.latest_role),
      humanHandoff: conversation.lead_status === "handoff",
      messageCount: Number(conversation.message_count ?? 0),
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at,
    },
    messages,
    messagesTruncated: Number(conversation.message_count ?? 0) > messages.length,
  };
}
