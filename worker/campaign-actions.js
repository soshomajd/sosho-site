import { ServiceError, createId } from "./core.js";

const ACTIONS = new Set(["approve", "reject", "regenerate"]);
const ACTOR_TYPES = new Set(["dashboard", "telegram"]);
const OPERATION_KEY_PATTERN = /^[A-Za-z0-9:_-]{8,160}$/u;
const CAMPAIGN_ID_PATTERN =
  /^campaign_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function timestamp() {
  return new Date().toISOString();
}

function validateIdentity({ campaignId, action, operationKey, actor }) {
  if (!CAMPAIGN_ID_PATTERN.test(campaignId || "")) {
    throw new ServiceError("invalid_campaign_id", { status: 400 });
  }
  if (!ACTIONS.has(action) || !OPERATION_KEY_PATTERN.test(operationKey || "") ||
      !actor || !ACTOR_TYPES.has(actor.type) ||
      typeof actor.key !== "string" || actor.key.length < 1 || actor.key.length > 80) {
    throw new ServiceError("invalid_request", { status: 400 });
  }
}

export function validateRejectionReason(value) {
  if (typeof value !== "string") return { ok: false };
  const reason = value.replace(/\s+/gu, " ").trim();
  if (reason.length < 3 || reason.length > 300 || /[<>\p{C}]/u.test(reason)) {
    return { ok: false };
  }
  return { ok: true, value: reason };
}

export function campaignActionAvailability(campaign) {
  const generated = campaign?.status === "generated";
  const pending = campaign?.approval_status === "pending" ||
    campaign?.approvalStatus === "pending";
  return {
    approve: generated && pending,
    reject: generated && pending,
    regenerate: generated || campaign?.status === "failed",
  };
}

async function getCampaignState(db, campaignId) {
  return db.prepare(
    `SELECT id, status, approval_status, rejection_reason, updated_at
     FROM content_campaigns WHERE id = ? LIMIT 1`
  ).bind(campaignId).first();
}

async function claimAudit(db, { campaignId, action, operationKey, actor, reason }) {
  const createdAt = timestamp();
  const inserted = await db.prepare(
    `INSERT OR IGNORE INTO campaign_action_audit (
      id, operation_key, campaign_id, action, actor_type, actor_key,
      status, reason, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'processing', ?, ?)`
  ).bind(
    createId("audit"),
    operationKey,
    campaignId,
    action,
    actor.type,
    actor.key,
    reason ?? null,
    createdAt
  ).run();
  if (Number(inserted.meta?.changes ?? 0) > 0) return { duplicate: false };
  const existing = await db.prepare(
    `SELECT campaign_id, action, status, outcome
     FROM campaign_action_audit WHERE operation_key = ? LIMIT 1`
  ).bind(operationKey).first();
  if (!existing || existing.campaign_id !== campaignId || existing.action !== action) {
    throw new ServiceError("idempotency_key_conflict", { status: 409 });
  }
  if (existing.status === "processing") {
    throw new ServiceError("operation_in_progress", { status: 409 });
  }
  return { duplicate: true, outcome: existing.outcome };
}

async function finishAudit(db, operationKey, outcome, errorCode = null) {
  await db.prepare(
    `UPDATE campaign_action_audit
     SET status = 'completed', outcome = ?, error_code = ?, completed_at = ?
     WHERE operation_key = ? AND status = 'processing'`
  ).bind(outcome, errorCode, timestamp(), operationKey).run();
}

async function completeDecision(db, options) {
  const {
    campaignId,
    action,
    operationKey,
    actor,
    reason = null,
    telegramUserId = null,
    telegramCallbackId = null,
  } = options;
  validateIdentity({ campaignId, action, operationKey, actor });
  if (!(await getCampaignState(db, campaignId))) {
    throw new ServiceError("campaign_not_found", { status: 404 });
  }
  const claimed = await claimAudit(db, {
    campaignId,
    action,
    operationKey,
    actor,
    reason,
  });
  if (claimed.duplicate) {
    const state = await getCampaignState(db, campaignId);
    if (!state) throw new ServiceError("campaign_not_found", { status: 404 });
    return { action, outcome: claimed.outcome, duplicate: true, campaign: state };
  }

  const decision = action === "approve" ? "approved" : "rejected";
  const decidedAt = timestamp();
  const changed = await db.prepare(
    `UPDATE content_campaigns
     SET approval_status = ?, approval_decided_at = ?, rejection_reason = ?,
         approval_telegram_user_id = ?, approval_callback_id = ?, updated_at = ?
     WHERE id = ? AND status = 'generated' AND approval_status = 'pending'
     RETURNING id, status, approval_status, rejection_reason, updated_at`
  ).bind(
    decision,
    decidedAt,
    action === "reject" ? reason : null,
    telegramUserId,
    telegramCallbackId,
    decidedAt,
    campaignId
  ).first();
  if (changed) {
    await finishAudit(db, operationKey, "succeeded");
    return { action, outcome: "succeeded", duplicate: false, campaign: changed };
  }

  const state = await getCampaignState(db, campaignId);
  if (!state) {
    await finishAudit(db, operationKey, "failed", "campaign_not_found");
    throw new ServiceError("campaign_not_found", { status: 404 });
  }
  if (state.status === "generated" && state.approval_status === decision) {
    await finishAudit(db, operationKey, "noop");
    return { action, outcome: "noop", duplicate: false, campaign: state };
  }
  await finishAudit(db, operationKey, "failed", "invalid_campaign_state");
  throw new ServiceError("invalid_campaign_state", { status: 409 });
}

export async function approveCampaign(db, options) {
  return completeDecision(db, { ...options, action: "approve", reason: null });
}

export async function rejectCampaign(db, options) {
  const validation = validateRejectionReason(options.reason);
  if (!validation.ok) {
    throw new ServiceError("invalid_rejection_reason", { status: 400 });
  }
  return completeDecision(db, {
    ...options,
    action: "reject",
    reason: validation.value,
  });
}

export async function regenerateCampaign(db, options) {
  const { campaignId, operationKey, actor, generate, background } = options;
  const action = "regenerate";
  validateIdentity({ campaignId, action, operationKey, actor });
  if (typeof generate !== "function") {
    throw new ServiceError("invalid_request", { status: 400 });
  }
  if (!(await getCampaignState(db, campaignId))) {
    throw new ServiceError("campaign_not_found", { status: 404 });
  }
  const claimed = await claimAudit(db, { campaignId, action, operationKey, actor });
  if (claimed.duplicate) {
    const state = await getCampaignState(db, campaignId);
    if (!state) throw new ServiceError("campaign_not_found", { status: 404 });
    return { action, outcome: claimed.outcome, duplicate: true, generated: null };
  }

  const state = await getCampaignState(db, campaignId);
  if (!state) {
    await finishAudit(db, operationKey, "failed", "campaign_not_found");
    throw new ServiceError("campaign_not_found", { status: 404 });
  }
  if (!campaignActionAvailability(state).regenerate) {
    await finishAudit(db, operationKey, "failed", "invalid_campaign_state");
    throw new ServiceError("invalid_campaign_state", { status: 409 });
  }

  const runGeneration = async () => {
    try {
      const generated = await generate();
      await finishAudit(db, operationKey, "succeeded");
      return { ok: true, generated };
    } catch (error) {
      await finishAudit(
        db,
        operationKey,
        "failed",
        String(error?.code || "content_generation_failed").slice(0, 100)
      );
      return { ok: false, error };
    }
  };

  // When a background runner is supplied (Telegram callbacks, where the caller
  // must return before Telegram's webhook timeout), the audit row is already
  // claimed as 'processing'; generation and its finishAudit finish out of band.
  if (typeof background === "function") {
    background(runGeneration());
    return { action, outcome: "started", duplicate: false, generated: null };
  }

  const result = await runGeneration();
  if (result.ok) {
    return { action, outcome: "succeeded", duplicate: false, generated: result.generated };
  }
  throw result.error;
}
