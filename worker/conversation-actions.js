import { ServiceError, createId } from "./core.js";

const CONVERSATION_ID_PATTERN = /^[a-z0-9_-]{1,100}$/iu;
const OPERATION_KEY_PATTERN = /^[A-Za-z0-9:_-]{8,160}$/u;
const ACTOR_TYPES = new Set(["sales_user", "sales_service", "dashboard"]);

function timestamp() {
  return new Date().toISOString();
}

function validateIdentity({ conversationId, operationKey, actor }) {
  if (!CONVERSATION_ID_PATTERN.test(conversationId || "")) {
    throw new ServiceError("invalid_conversation_id", { status: 400 });
  }
  if (!OPERATION_KEY_PATTERN.test(operationKey || "") || !actor ||
      !ACTOR_TYPES.has(actor.type) || typeof actor.key !== "string" ||
      actor.key.length < 1 || actor.key.length > 80) {
    throw new ServiceError("invalid_request", { status: 400 });
  }
}

async function getConversationState(db, conversationId) {
  return db.prepare(
    `SELECT id, lead_id, handoff_state, handoff_requested_at,
            human_owner_key, human_taken_over_at, updated_at
     FROM conversations WHERE id = ? LIMIT 1`
  ).bind(conversationId).first();
}

async function claimAudit(db, {
  conversationId,
  action,
  operationKey,
  actor,
  fromState,
  toState,
}) {
  const inserted = await db.prepare(
    `INSERT OR IGNORE INTO conversation_action_audit (
      id, operation_key, conversation_id, action, actor_type, actor_key,
      from_state, to_state, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'processing', ?)`
  ).bind(
    createId("conversation_audit"),
    operationKey,
    conversationId,
    action,
    actor.type,
    actor.key,
    fromState,
    toState,
    timestamp()
  ).run();
  if (Number(inserted.meta?.changes ?? 0) > 0) return { duplicate: false };
  const existing = await db.prepare(
    `SELECT conversation_id, action, actor_type, actor_key, status, outcome
     FROM conversation_action_audit WHERE operation_key = ? LIMIT 1`
  ).bind(operationKey).first();
  if (!existing || existing.conversation_id !== conversationId ||
      existing.action !== action || existing.actor_type !== actor.type ||
      existing.actor_key !== actor.key) {
    throw new ServiceError("idempotency_key_conflict", { status: 409 });
  }
  if (existing.status === "processing") {
    throw new ServiceError("operation_in_progress", { status: 409 });
  }
  return { duplicate: true, outcome: existing.outcome };
}

async function finishAudit(db, operationKey, outcome, errorCode = null) {
  await db.prepare(
    `UPDATE conversation_action_audit
     SET status = 'completed', outcome = ?, error_code = ?, completed_at = ?
     WHERE operation_key = ? AND status = 'processing'`
  ).bind(outcome, errorCode, timestamp(), operationKey).run();
}

export function requestsHumanHandoff(message) {
  if (typeof message !== "string") return false;
  const normalized = message.replace(/\s+/gu, " ").trim().toLocaleLowerCase("en-US");
  if (!normalized || normalized.length > 2000) return false;
  const shortRequest = /^(?:human|agent|manager|support|operator|representative|انسان|آدم|ادم|مدیر|پشتیبان|اپراتور|مشاور)$/iu;
  if (shortRequest.test(normalized)) return true;
  const english = /(?:talk|speak|connect|chat|transfer|want|need).{0,40}(?:human|person|agent|manager|support|operator|representative)|(?:human|person|agent|manager|support|operator|representative).{0,40}(?:talk|speak|connect|chat|please|want|need)/iu;
  const persian = /(?:صحبت|گفتگو|گفت و گو|وصل|ارتباط|تماس|می.?خواهم|می.?خوام).{0,40}(?:انسان|آدم|ادم|مدیر|پشتیبان|اپراتور|مشاور)|(?:انسان|آدم|ادم|مدیر|پشتیبان|اپراتور|مشاور).{0,40}(?:صحبت|گفتگو|گفت و گو|وصل|ارتباط|تماس|کنید|کنین|می.?خواهم|می.?خوام)/iu;
  return english.test(normalized) || persian.test(normalized);
}

export async function requestConversationHandoff(db, options) {
  const { conversationId, operationKey, actor } = options;
  const action = "request_handoff";
  validateIdentity({ conversationId, operationKey, actor });
  const existingState = await getConversationState(db, conversationId);
  if (!existingState) throw new ServiceError("conversation_not_found", { status: 404 });
  const claimed = await claimAudit(db, {
    conversationId,
    action,
    operationKey,
    actor,
    fromState: "ai_active",
    toState: "handoff_requested",
  });
  if (claimed.duplicate) {
    return { action, outcome: claimed.outcome, duplicate: true, conversation: existingState };
  }

  const changedAt = timestamp();
  const changed = await db.prepare(
    `UPDATE conversations
     SET handoff_state = 'handoff_requested', handoff_requested_at = ?,
         human_owner_key = NULL, human_taken_over_at = NULL, updated_at = ?
     WHERE id = ? AND status = 'active' AND handoff_state = 'ai_active'
     RETURNING id, lead_id, handoff_state, handoff_requested_at,
               human_owner_key, human_taken_over_at, updated_at`
  ).bind(changedAt, changedAt, conversationId).first();
  if (!changed) {
    const state = await getConversationState(db, conversationId);
    const errorCode = state ? "invalid_conversation_transition" : "conversation_not_found";
    await finishAudit(db, operationKey, "failed", errorCode);
    throw new ServiceError(errorCode, { status: state ? 409 : 404 });
  }
  await db.prepare(
    `UPDATE leads SET status = 'handoff', updated_at = ? WHERE id = ?`
  ).bind(changedAt, changed.lead_id).run();
  await finishAudit(db, operationKey, "succeeded");
  return { action, outcome: "succeeded", duplicate: false, conversation: changed };
}

export async function takeOverConversation(db, options) {
  const { conversationId, operationKey, actor } = options;
  const action = "take_over";
  validateIdentity({ conversationId, operationKey, actor });
  if (!(await getConversationState(db, conversationId))) {
    throw new ServiceError("conversation_not_found", { status: 404 });
  }
  const claimed = await claimAudit(db, {
    conversationId,
    action,
    operationKey,
    actor,
    fromState: "handoff_requested",
    toState: "human_active",
  });
  if (claimed.duplicate) {
    return {
      action,
      outcome: claimed.outcome,
      duplicate: true,
      conversation: await getConversationState(db, conversationId),
    };
  }

  const changedAt = timestamp();
  const changed = await db.prepare(
    `UPDATE conversations
     SET handoff_state = 'human_active', human_owner_key = ?,
         human_taken_over_at = ?, updated_at = ?
     WHERE id = ? AND status = 'active' AND handoff_state = 'handoff_requested'
       AND human_owner_key IS NULL
     RETURNING id, lead_id, handoff_state, handoff_requested_at,
               human_owner_key, human_taken_over_at, updated_at`
  ).bind(actor.key, changedAt, changedAt, conversationId).first();
  if (!changed) {
    const state = await getConversationState(db, conversationId);
    const errorCode = state ? "invalid_conversation_transition" : "conversation_not_found";
    await finishAudit(db, operationKey, "failed", errorCode);
    throw new ServiceError(errorCode, { status: state ? 409 : 404 });
  }
  await finishAudit(db, operationKey, "succeeded");
  return { action, outcome: "succeeded", duplicate: false, conversation: changed };
}
