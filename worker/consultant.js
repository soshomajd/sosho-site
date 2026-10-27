// Project consultant ("برآورد هوشمند پروژه"): persistence, public handlers, the Telegram report
// queue and the admin side. Rate limits and the AI quota are applied by the router in index.js;
// Telegram sending is injected (deps.notify) so this module never imports the router.
import { ServiceError, addDaysIso, createId, getIntegerEnv, isPlainRecord, logEvent, parseJson } from "./core.js";
import { buildConsultantReport } from "./consultant-report.js";
import { buildScope, TEMPLATES } from "./consultant-scope.js";
import {
  CONTENT_QUESTION_TYPES,
  budgetOptions,
  consultantConfig,
  labelFor,
  sizeLabel,
  validateConsultantAnswers,
} from "./consultant-flow.js";
import { interpretFreeText, summarizeProject } from "./consultant-ai.js";
import { TARIFF_TEMPLATE, estimateProject, publicEstimate, validateTariff } from "./pricing-engine.js";

export const CONSULTANT_ID_PATTERN = /^cr_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{40,60}$/u;
const EMAIL_PATTERN = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/u;
export const CONSULTANT_STATUSES = ["estimated", "tier_selected", "contact_submitted", "in_review", "contacted", "won", "lost", "archived"];
const ADMIN_STATUSES = new Set(CONSULTANT_STATUSES);
const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const now = () => new Date().toISOString();

function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/gu, "");
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function tokenMatches(token, hash) {
  if (typeof token !== "string" || !TOKEN_PATTERN.test(token) || typeof hash !== "string") return false;
  const provided = new TextEncoder().encode(await sha256Hex(token));
  const expected = new TextEncoder().encode(hash);
  return provided.byteLength === expected.byteLength && crypto.subtle.timingSafeEqual(provided, expected);
}

function publicRef() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `SOS-${[...bytes].map((byte) => REF_ALPHABET[byte % REF_ALPHABET.length]).join("")}`;
}

const toAsciiDigits = (value) =>
  String(value).replace(/[۰-۹٠-٩]/gu, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit) >= 0 ? "۰۱۲۳۴۵۶۷۸۹".indexOf(digit) : "٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

function cleanLine(value, max) {
  if (typeof value !== "string") return null;
  const text = value.replace(/[\u0000-\u001f\u007f]/gu, " ").replace(/\s+/gu, " ").trim();
  return text && text.length <= max ? text : null;
}

/** Phone (10–14 digits, any digit script) or email; returns the normalised value or null. */
export function normalizeContactValue(value) {
  const text = cleanLine(value, 200);
  if (!text) return null;
  if (EMAIL_PATTERN.test(text)) return text.toLowerCase();
  const ascii = toAsciiDigits(text);
  const digits = ascii.replace(/\D/gu, "");
  if (!/^[+\d\s().-]+$/u.test(ascii) || digits.length < 10 || digits.length > 14) return null;
  return ascii.replace(/\s+/gu, " ").trim();
}

// ---------- tariffs ----------

export async function getActiveTariff(db) {
  const row = await db.prepare("SELECT version, config_json, note, created_at FROM pricing_tariffs ORDER BY version DESC LIMIT 1").first();
  if (!row) return null;
  const config = parseJson(row.config_json, null);
  const validated = validateTariff(config);
  if (!validated.ok) {
    logEvent("warn", "consultant_tariff_invalid", { code: "stored_tariff_invalid" });
    return null;
  }
  return { version: Number(row.version), config: validated.value, note: row.note, createdAt: row.created_at };
}

export async function saveTariff(db, body) {
  if (!isPlainRecord(body) || Object.keys(body).some((key) => key !== "config" && key !== "note")) {
    throw new ServiceError("invalid_request", { status: 400 });
  }
  const validated = validateTariff(body.config);
  if (!validated.ok) return { ok: false, issues: validated.issues.slice(0, 60) };
  const note = body.note === undefined || body.note === null ? null : cleanLine(body.note, 200);
  const result = await db
    .prepare("INSERT INTO pricing_tariffs (config_json, note, created_at) VALUES (?, ?, ?) RETURNING version")
    .bind(JSON.stringify(validated.value), note, now())
    .first();
  return { ok: true, version: Number(result.version) };
}

export async function getAdminTariffs(db) {
  const active = await getActiveTariff(db);
  const history = await db.prepare("SELECT version, note, created_at FROM pricing_tariffs ORDER BY version DESC LIMIT 15").all();
  return {
    active: active ? { version: active.version, note: active.note, createdAt: active.createdAt, config: active.config } : null,
    template: TARIFF_TEMPLATE,
    history: (history.results ?? []).map((row) => ({ version: Number(row.version), note: row.note, createdAt: row.created_at })),
  };
}

// ---------- public handlers ----------

export async function handleConsultantConfig(env, db, locale) {
  const tariff = await getActiveTariff(db);
  return consultantConfig(locale === "en" ? "en" : "fa", tariff?.config ?? null);
}

export async function handleConsultantInterpret(env, body, { requestId, reserveQuota }) {
  if (!isPlainRecord(body) || Object.keys(body).some((key) => !["locale", "text", "projectType"].includes(key))) {
    throw new ServiceError("invalid_request", { status: 400 });
  }
  const locale = body.locale === "en" ? "en" : "fa";
  const text = cleanLine(body.text, 500);
  if (!text || text.length < 2) throw new ServiceError("invalid_request", { status: 400 });
  try {
    return { interpretation: await interpretFreeText(env, { locale, text, projectType: typeof body.projectType === "string" ? body.projectType : null, requestId, reserveQuota }) };
  } catch (error) {
    // No AI (or it failed): the customer keeps answering with the options; the text stays as a note.
    logEvent("warn", "consultant_interpret_unavailable", { requestId, code: error?.code || "interpret_failed" });
    return { interpretation: null };
  }
}

/** Localised scope for the customer card (no internal numbers). */
export function presentScope(scope, locale) {
  const lang = locale === "en" ? "en" : "fa";
  const feature = (id) => ({ id, label: labelFor("feature", id, lang) });
  const tier = (value) => ({
    features: value.features.map(feature),
    templates: value.templates.map((id) => TEMPLATES[id]?.[lang] ?? id),
    staticPages: value.staticPages,
    added: (value.added ?? []).map((item) => ({ ...feature(item.id), reason: item.reason[lang] })),
    deferred: (value.deferred ?? []).map(feature),
    designLevel: value.designLevel,
  });
  return {
    projectType: { id: scope.projectType, label: labelFor("projectType", scope.projectType, lang) },
    goal: { id: scope.goal, label: labelFor("goal", scope.goal, lang) },
    architecture: scope.architecture?.id
      ? {
          id: scope.architecture.id,
          reason: scope.architecture.reason[lang],
          alternative: scope.architecture.alternative ? { id: scope.architecture.alternative.id, note: scope.architecture.alternative.note[lang] } : null,
        }
      : { id: null, reason: scope.architecture?.reason?.[lang] ?? "", alternative: null },
    complexity: scope.complexity,
    confidence: scope.confidence,
    consultationRecommended: scope.consultationRecommended,
    twoTiers: scope.twoTiers,
    staticPages: scope.staticPages.map((page) => page[lang]),
    tiers: { economic: tier(scope.tiers.economic), professional: tier(scope.tiers.professional) },
    needsReview: scope.needsReview.map((item) => item[lang]),
    sizeAssumed: scope.sizeAssumed,
  };
}

function siteBase(env) {
  const first = String(env.PUBLIC_SITE_ORIGINS || "").split(",")[0]?.trim();
  return first && /^https?:\/\//u.test(first) ? first.replace(/\/$/u, "") : "https://sosho-studio.net";
}

function budgetLabelFor(tariff, budgetId) {
  const option = budgetOptions(tariff).find((item) => item.id === budgetId);
  return option?.label?.fa ?? budgetId;
}

async function loadRequest(db, id) {
  return db.prepare("SELECT * FROM consultant_requests WHERE id = ?").bind(id).first();
}

/**
 * Sends (or parks) the Telegram report for the request's current state. Each part has its own
 * outbox key, so a retried HTTP request or a cron flush never sends the same part twice.
 */
export async function queueConsultantReport(env, db, id, deps, { requestId } = {}) {
  const row = await loadRequest(db, id);
  if (!row) return { status: "missing" };
  if (!deps.isTelegramConfigured(env)) {
    await db.prepare("UPDATE consultant_requests SET telegram_state = 'awaiting_config' WHERE id = ?").bind(id).run();
    return { status: "awaiting_config" };
  }
  if (Number(row.telegram_reported_seq) >= Number(row.update_seq)) return { status: "up_to_date" };
  const answers = parseJson(row.answers_json, {});
  const scope = parseJson(row.scope_json, {});
  const stored = parseJson(row.estimate_json, {});
  const parts = buildConsultantReport({
    request: row,
    answers,
    scope,
    estimate: stored.estimate,
    summary: stored.summary,
    adminUrl: `${siteBase(env)}/admin/consultant/detail?id=${encodeURIComponent(row.id)}`,
    budgetLabel: stored.budgetLabel ?? answers.budget,
    kind: Number(row.telegram_reported_seq) < 0 ? "created" : "update",
  });
  let failed = false;
  for (let index = 0; index < parts.length; index += 1) {
    const outcome = await deps.notify(env, {
      eventKey: `consultant:${row.id}:${row.update_seq}:p${index + 1}`,
      type: Number(row.telegram_reported_seq) < 0 ? "consultant_created" : "consultant_updated",
      entityId: row.id,
      text: parts[index],
      requestId,
    });
    if (outcome?.status === "failed") failed = true;
  }
  // Failed parts stay in the outbox and are retried by the 5-minute cron.
  await db
    .prepare("UPDATE consultant_requests SET telegram_state = ?, telegram_reported_seq = ? WHERE id = ? AND update_seq = ?")
    .bind(failed ? "failed" : "sent", Number(row.update_seq), id, Number(row.update_seq))
    .run();
  return { status: failed ? "failed" : "sent" };
}

/** Cron: sends reports that were parked while Telegram was not configured. */
export async function flushConsultantReports(env, db, deps, requestId) {
  if (!deps.isTelegramConfigured(env)) return { flushed: 0 };
  const rows = await db
    .prepare("SELECT id FROM consultant_requests WHERE telegram_state = 'awaiting_config' ORDER BY updated_at ASC LIMIT 10")
    .all();
  let flushed = 0;
  for (const row of rows.results ?? []) {
    const outcome = await queueConsultantReport(env, db, row.id, deps, { requestId });
    if (outcome.status === "sent") flushed += 1;
  }
  return { flushed };
}

const ESTIMATE_KEYS = new Set(["locale", "answers", "consent", "clientRequestId", "consultantId", "updateToken"]);

/**
 * Validates answers, builds the scope, prices it, writes a summary and (with consent) stores
 * the request and queues the Telegram report. Re-estimating with the request id and token
 * updates the same request instead of creating a second one.
 */
export async function handleConsultantEstimate(env, db, body, { requestId, reserveQuota, waitUntil, deps }) {
  if (!isPlainRecord(body) || Object.keys(body).some((key) => !ESTIMATE_KEYS.has(key))) {
    throw new ServiceError("invalid_request", { status: 400 });
  }
  const locale = body.locale === "en" ? "en" : "fa";
  if (body.consent !== undefined && typeof body.consent !== "boolean") throw new ServiceError("invalid_request", { status: 400 });
  const consent = body.consent === true;
  const tariff = await getActiveTariff(db);
  const validation = validateConsultantAnswers(body.answers, tariff?.config ?? null);
  if (!validation.ok) return { status: 400, payload: { error: "invalid_answers", issues: validation.issues } };
  const answers = validation.value;
  if (!CONTENT_QUESTION_TYPES.has(answers.projectType)) answers.content = answers.content ?? "unknown";

  const scope = buildScope(answers);
  const estimate = estimateProject({ scope, answers, tariff: tariff?.config ?? null, tariffVersion: tariff?.version ?? null });
  const summary = await summarizeProject(env, { locale, answers, scope, requestId, reserveQuota });
  const response = {
    scope: presentScope(scope, locale),
    estimate: publicEstimate(estimate),
    summary: { text: summary.summary, ambiguities: summary.ambiguities, source: summary.source },
  };
  if (!consent) return { status: 200, payload: { ...response, stored: false } };

  const stored = JSON.stringify({ estimate, summary, budgetLabel: budgetLabelFor(tariff?.config, answers.budget) });
  const timestamp = now();

  // Re-estimate of an existing request (after "edit answers").
  if (body.consultantId !== undefined) {
    if (typeof body.consultantId !== "string" || !CONSULTANT_ID_PATTERN.test(body.consultantId)) throw new ServiceError("invalid_request", { status: 400 });
    const row = await loadRequest(db, body.consultantId);
    if (!row || !(await tokenMatches(body.updateToken, row.update_token_hash))) throw new ServiceError("not_found", { status: 404 });
    await db
      .prepare(
        `UPDATE consultant_requests
         SET answers_json = ?, scope_json = ?, estimate_json = ?, tariff_version = ?, ai_summary = ?, ai_source = ?,
             locale = ?, selected_tier = NULL, status = CASE WHEN contact_value IS NULL THEN 'estimated' ELSE status END,
             update_seq = update_seq + 1, updated_at = ?
         WHERE id = ?`
      )
      .bind(JSON.stringify(answers), JSON.stringify(scope), stored, tariff?.version ?? null, summary.summary, summary.source, locale, timestamp, row.id)
      .run();
    waitUntil?.(queueConsultantReport(env, db, row.id, deps, { requestId }));
    return { status: 200, payload: { ...response, stored: true, consultantId: row.id, publicRef: row.public_ref } };
  }

  if (typeof body.clientRequestId !== "string" || !UUID_PATTERN.test(body.clientRequestId)) throw new ServiceError("invalid_request", { status: 400 });
  // A double submit (same clientRequestId) returns the first request and sends nothing new.
  const existing = await db.prepare("SELECT id, public_ref FROM consultant_requests WHERE client_request_id = ?").bind(body.clientRequestId).first();
  if (existing) return { status: 200, payload: { ...response, stored: true, consultantId: existing.id, publicRef: existing.public_ref, duplicate: true } };

  const id = createId("cr");
  const token = base64Url(crypto.getRandomValues(new Uint8Array(32)));
  const tokenHash = await sha256Hex(token);
  let ref = publicRef();
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      await db
        .prepare(
          `INSERT INTO consultant_requests (
            id, public_ref, client_request_id, locale, status, answers_json, scope_json, estimate_json,
            tariff_version, ai_summary, ai_source, processing_consent_at, update_token_hash, update_seq,
            telegram_state, telegram_reported_seq, created_at, updated_at, pii_expires_at, expires_at
          ) VALUES (?, ?, ?, ?, 'estimated', ?, ?, ?, ?, ?, ?, ?, ?, 0, 'queued', -1, ?, ?, ?, ?)`
        )
        .bind(
          id, ref, body.clientRequestId, locale, JSON.stringify(answers), JSON.stringify(scope), stored,
          tariff?.version ?? null, summary.summary, summary.source, timestamp, tokenHash, timestamp, timestamp,
          addDaysIso(new Date(), getIntegerEnv(env, "LEAD_PII_RETENTION_DAYS", 365, { min: 1, max: 3650 })),
          addDaysIso(new Date(), getIntegerEnv(env, "CONSULTANT_RETENTION_DAYS", 365, { min: 1, max: 3650 }))
        )
        .run();
      break;
    } catch (error) {
      const message = String(error?.message || "");
      if (message.includes("client_request_id")) {
        const winner = await db.prepare("SELECT id, public_ref FROM consultant_requests WHERE client_request_id = ?").bind(body.clientRequestId).first();
        if (winner) return { status: 200, payload: { ...response, stored: true, consultantId: winner.id, publicRef: winner.public_ref, duplicate: true } };
      }
      if (attempt === 3 || !message.includes("public_ref")) throw error;
      ref = publicRef();
    }
  }
  // Stored first; the report goes out after the response and a Telegram failure never loses the request.
  waitUntil?.(queueConsultantReport(env, db, id, deps, { requestId }));
  return { status: 201, payload: { ...response, stored: true, consultantId: id, publicRef: ref, updateToken: token } };
}

/** Customer updates with the request token: choose a tier, or leave contact details. */
export async function handleConsultantUpdate(env, db, id, body, { requestId, waitUntil, deps }) {
  if (!CONSULTANT_ID_PATTERN.test(id) || !isPlainRecord(body)) throw new ServiceError("invalid_request", { status: 400 });
  const row = await loadRequest(db, id);
  if (!row || !(await tokenMatches(body.updateToken, row.update_token_hash))) throw new ServiceError("not_found", { status: 404 });
  const scope = parseJson(row.scope_json, {});
  const timestamp = now();
  let changed = false;

  if (body.action === "select") {
    if (Object.keys(body).some((key) => !["updateToken", "action", "tier"].includes(key))) throw new ServiceError("invalid_request", { status: 400 });
    const allowed = scope.twoTiers ? ["economic", "professional"] : ["professional"];
    if (!allowed.includes(body.tier)) throw new ServiceError("invalid_request", { status: 400 });
    if (row.selected_tier !== body.tier) {
      await db
        .prepare(
          `UPDATE consultant_requests SET selected_tier = ?, status = CASE WHEN status = 'estimated' THEN 'tier_selected' ELSE status END,
             update_seq = update_seq + 1, updated_at = ? WHERE id = ?`
        )
        .bind(body.tier, timestamp, id)
        .run();
      changed = true;
    }
  } else if (body.action === "contact") {
    if (Object.keys(body).some((key) => !["updateToken", "action", "name", "contact", "notes", "consent", "tier"].includes(key))) {
      throw new ServiceError("invalid_request", { status: 400 });
    }
    if (body.consent !== true) return { status: 400, payload: { error: "consent_required" } };
    const name = cleanLine(body.name, 80);
    const contact = normalizeContactValue(body.contact);
    const notes = body.notes === undefined || body.notes === null || body.notes === "" ? null : cleanLine(body.notes, 600);
    const issues = [];
    if (!name || name.length < 2) issues.push({ path: "name", code: "invalid_name" });
    if (!contact) issues.push({ path: "contact", code: "invalid_contact" });
    if (body.notes && !notes) issues.push({ path: "notes", code: "invalid_text" });
    if (body.tier !== undefined && body.tier !== null && !["economic", "professional"].includes(body.tier)) issues.push({ path: "tier", code: "invalid_option" });
    if (issues.length) return { status: 400, payload: { error: "invalid_contact", issues } };
    const tier = body.tier ?? row.selected_tier ?? null;
    if (row.contact_name !== name || row.contact_value !== contact || (row.contact_notes ?? null) !== notes || row.selected_tier !== tier) {
      await db
        .prepare(
          `UPDATE consultant_requests
           SET contact_name = ?, contact_value = ?, contact_notes = ?, contact_consent_at = ?, selected_tier = ?,
               status = CASE WHEN status IN ('estimated', 'tier_selected') THEN 'contact_submitted' ELSE status END,
               update_seq = update_seq + 1, updated_at = ?
           WHERE id = ?`
        )
        .bind(name, contact, notes, timestamp, tier, timestamp, id)
        .run();
      changed = true;
    }
  } else {
    throw new ServiceError("invalid_request", { status: 400 });
  }
  if (changed) waitUntil?.(queueConsultantReport(env, db, id, deps, { requestId }));
  const updated = await loadRequest(db, id);
  return { status: 200, payload: { consultantId: id, publicRef: updated.public_ref, status: updated.status, selectedTier: updated.selected_tier, changed } };
}

// ---------- admin ----------

function pageArgs(url) {
  const page = Math.max(1, Math.min(10_000, Number.parseInt(url.searchParams.get("page") || "1", 10) || 1));
  const pageSize = Math.max(1, Math.min(50, Number.parseInt(url.searchParams.get("limit") || "20", 10) || 20));
  return { page, pageSize, offset: (page - 1) * pageSize };
}

function rangeOf(stored, tier) {
  const value = stored?.estimate?.tiers?.[tier];
  return value ? { min: value.oneTime.min, max: value.oneTime.max, weeksMin: value.weeks.min, weeksMax: value.weeks.max } : null;
}

function adminListItem(row) {
  const answers = parseJson(row.answers_json, {});
  const stored = parseJson(row.estimate_json, {});
  return {
    id: row.id,
    publicRef: row.public_ref,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    locale: row.locale,
    status: row.status,
    projectType: labelFor("projectType", answers.projectType, "fa"),
    selectedTier: row.selected_tier,
    contactName: row.contact_name,
    contactValue: row.contact_value,
    estimateStatus: stored?.estimate?.status ?? "needs_review",
    currency: stored?.estimate?.currency?.label?.fa ?? null,
    economic: rangeOf(stored, "economic"),
    professional: rangeOf(stored, "professional"),
    telegramState: row.telegram_state,
  };
}

export async function getAdminConsultantRequests(db, url) {
  for (const key of url.searchParams.keys()) {
    if (!["page", "limit", "status"].includes(key)) throw new ServiceError("invalid_request", { status: 400 });
  }
  const status = url.searchParams.get("status") || "";
  if (status && !ADMIN_STATUSES.has(status)) throw new ServiceError("invalid_request", { status: 400 });
  const { page, pageSize, offset } = pageArgs(url);
  const where = status ? "WHERE status = ?" : "";
  const binds = status ? [status] : [];
  const [rows, total, fresh] = await db.batch([
    db.prepare(`SELECT * FROM consultant_requests ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...binds, pageSize, offset),
    db.prepare(`SELECT COUNT(*) AS total FROM consultant_requests ${where}`).bind(...binds),
    db.prepare("SELECT COUNT(*) AS total FROM consultant_requests WHERE status IN ('estimated', 'tier_selected', 'contact_submitted')"),
  ]);
  const count = Number(total.results?.[0]?.total ?? 0);
  const totalPages = count === 0 ? 0 : Math.ceil(count / pageSize);
  return {
    items: (rows.results ?? []).map(adminListItem),
    pagination: { page, pageSize, total: count, totalPages, hasPrevious: page > 1, hasNext: page < totalPages },
    openTotal: Number(fresh.results?.[0]?.total ?? 0),
  };
}

export async function getAdminConsultantDetail(db, id) {
  if (!CONSULTANT_ID_PATTERN.test(id)) throw new ServiceError("invalid_request", { status: 400 });
  const row = await loadRequest(db, id);
  if (!row) throw new ServiceError("not_found", { status: 404 });
  const answers = parseJson(row.answers_json, {});
  const scope = parseJson(row.scope_json, {});
  const stored = parseJson(row.estimate_json, {});
  return {
    item: {
      ...adminListItem(row),
      answers: {
        projectType: labelFor("projectType", answers.projectType, "fa"),
        projectTypeNote: answers.projectTypeNote ?? null,
        goal: labelFor("goal", answers.goal, "fa"),
        goalNote: answers.goalNote ?? null,
        features: (answers.features ?? []).map((feature) => labelFor("feature", feature, "fa")),
        featuresNote: answers.featuresNote ?? null,
        size: sizeLabel(answers.projectType, answers.size, "fa"),
        style: labelFor("style", answers.style, "fa"),
        referenceUrl: answers.referenceUrl ?? null,
        styleNote: answers.styleNote ?? null,
        content: labelFor("content", answers.content, "fa"),
        budget: stored.budgetLabel ?? answers.budget,
        timeframe: labelFor("timeframe", answers.timeframe, "fa"),
        timeframeNote: answers.timeframeNote ?? null,
        notes: answers.notes ?? null,
      },
      scope: presentScope(scope, "fa"),
      estimate: stored.estimate ?? null,
      summary: stored.summary ?? { summary: row.ai_summary, ambiguities: [], source: row.ai_source },
      contactNotes: row.contact_notes,
      contactConsentAt: row.contact_consent_at,
      processingConsentAt: row.processing_consent_at,
      tariffVersion: row.tariff_version,
      updateSeq: Number(row.update_seq),
    },
  };
}

export async function updateAdminConsultantStatus(db, id, status) {
  if (!CONSULTANT_ID_PATTERN.test(id) || !ADMIN_STATUSES.has(status)) throw new ServiceError("invalid_request", { status: 400 });
  const result = await db.prepare("UPDATE consultant_requests SET status = ?, updated_at = ? WHERE id = ?").bind(status, now(), id).run();
  if (Number(result.meta?.changes ?? 0) === 0) throw new ServiceError("not_found", { status: 404 });
  return getAdminConsultantDetail(db, id);
}

/** Retention: drop expired requests and blank contact details after the PII window. */
export async function cleanupConsultantRequests(db) {
  const current = now();
  await db.batch([
    db.prepare("DELETE FROM consultant_requests WHERE expires_at <= ?").bind(current),
    db
      .prepare(
        `UPDATE consultant_requests SET contact_name = NULL, contact_value = NULL, contact_notes = NULL
         WHERE pii_expires_at <= ? AND (contact_name IS NOT NULL OR contact_value IS NOT NULL OR contact_notes IS NOT NULL)`
      )
      .bind(current),
  ]);
}
