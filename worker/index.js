import {
  SALES_RESPONSE_SCHEMA,
  ServiceError,
  addDaysIso,
  createConversationId,
  createId,
  fallbackReply,
  fetchWithTimeout,
  getIntegerEnv,
  getWindowStart,
  hashIdentifier,
  isPlainRecord,
  isRetryableStatus,
  logEvent,
  parseJson,
  readOpenAIErrorDiagnostics,
  retryWithBackoff,
  validateSalesResponse,
  validateWebsiteChatInput,
} from "./core.js";
import {
  adminSessionCookie,
  clearAdminSessionCookie,
  createAdminSession,
  getAdminCampaigns,
  getAdminCampaignDetail,
  getAdminConversationDetail,
  getAdminConversations,
  getAdminLeads,
  getAdminOverview,
  requireAdminBearer,
  requireAdminSessionAction,
  requireDashboardAdmin,
  verifyAdminToken,
} from "./admin-dashboard.js";
import {
  approveCampaign,
  regenerateCampaign,
  rejectCampaign,
} from "./campaign-actions.js";
import {
  requestConversationHandoff,
  requestsHumanHandoff,
  takeOverConversation,
} from "./conversation-actions.js";
import {
  ContentGenerationService,
  validateCreateCampaignInput,
} from "./content-generation.js";
import {
  ImageGenerationService,
  createMainImageR2Key,
} from "./image-generation.js";
import {
  TelegramService,
  campaignApprovalKeyboard,
  isTelegramConfigured,
  isTelegramWebhookConfigured,
  validateTelegramUpdate,
} from "./telegram-service.js";

const REQUIRED_TABLES = [
  "leads",
  "conversations",
  "messages",
  "webhook_events",
  "rate_limit_counters",
  "content_campaigns",
  "content_items",
  "content_media",
  "campaign_action_audit",
  "conversation_action_audit",
  "telegram_updates",
  "telegram_notifications",
];

const CAMPAIGN_ID_PATTERN =
  /^campaign_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
const IDEMPOTENCY_KEY_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function now() {
  return new Date().toISOString();
}

function addSecondsIso(seconds) {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

function json(data, status = 200, requestId, additionalHeaders = {}) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    ...additionalHeaders,
  };
  if (requestId) headers["x-request-id"] = requestId;
  return new Response(JSON.stringify(requestId ? { ...data, requestId } : data), {
    status,
    headers,
  });
}

function requireDatabase(env) {
  if (!env.DB) throw new ServiceError("database_not_configured", { status: 503 });
  return env.DB;
}

const TELEGRAM_NOTIFICATION_MAX_ATTEMPTS = 5;
const TELEGRAM_NOTIFICATION_RETRY_SECONDS = 300;
const TELEGRAM_NOTIFICATION_RETRY_BATCH_SIZE = 20;

function telegramNotificationClaimToken() {
  return `claim:${crypto.randomUUID()}`;
}

function telegramNotificationErrorCode(error) {
  return String(error?.code || "telegram_error").slice(0, 100);
}

// Always resolves to a status object. A failing Telegram send (or a D1 error while
// bookkeeping it) must never propagate into content persistence, Sales Chat, or
// Instagram processing.
async function sendTelegramNotificationOnce(
  env,
  { eventKey, type, entityId, text, keyboard, photo, requestId }
) {
  if (!isTelegramConfigured(env)) return { status: "disabled" };
  try {
    const db = requireDatabase(env);
    const timestamp = now();
    const claimToken = telegramNotificationClaimToken();
    const keyboardJson = keyboard ? JSON.stringify(keyboard) : null;
    const inserted = await db
      .prepare(
        `INSERT OR IGNORE INTO telegram_notifications (
          event_key, notification_type, entity_id, status, attempt_count,
          message_text, keyboard_json, next_retry_at, created_at, updated_at, last_error
        ) VALUES (?, ?, ?, 'pending', 1, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        eventKey,
        type,
        entityId ?? null,
        typeof text === "string" ? text.slice(0, 8192) : null,
        keyboardJson,
        addSecondsIso(TELEGRAM_NOTIFICATION_RETRY_SECONDS),
        timestamp,
        timestamp,
        claimToken
      )
      .run();
    if (Number(inserted.meta?.changes ?? 0) === 0) return { status: "duplicate" };
    try {
      const telegram = new TelegramService(env);
      if (photo) {
        await telegram.sendPhoto(photo, { caption: text, replyMarkup: keyboard, requestId });
      } else if (keyboard) await telegram.sendInlineKeyboard(text, keyboard, requestId);
      else await telegram.sendText(text, { requestId });
    } catch (error) {
      await db
        .prepare(
          `UPDATE telegram_notifications
           SET status = 'failed', last_error = ?,
               next_retry_at = CASE WHEN attempt_count >= ? THEN NULL ELSE ? END,
               updated_at = ?
           WHERE event_key = ? AND status = 'pending' AND last_error = ?`
        )
        .bind(
          telegramNotificationErrorCode(error),
          TELEGRAM_NOTIFICATION_MAX_ATTEMPTS,
          addSecondsIso(TELEGRAM_NOTIFICATION_RETRY_SECONDS),
          now(),
          eventKey,
          claimToken
        )
        .run();
      logEvent("warn", "telegram_notification_failed", {
        requestId,
        provider: "telegram",
        code: error?.code || "telegram_error",
      });
      return { status: "failed" };
    }
    const completedAt = now();
    const completed = await db
      .prepare(
        `UPDATE telegram_notifications
         SET status = 'sent', sent_at = ?, last_error = NULL,
             next_retry_at = NULL, updated_at = ?
         WHERE event_key = ? AND status = 'pending' AND last_error = ?`
      )
      .bind(completedAt, completedAt, eventKey, claimToken)
      .run();
    if (Number(completed.meta?.changes ?? 0) === 0) {
      logEvent("warn", "telegram_notification_claim_lost", {
        requestId,
        provider: "telegram",
        code: "claim_lost",
      });
      return { status: "failed" };
    }
    return { status: "sent" };
  } catch (error) {
    logEvent("warn", "telegram_notification_bookkeeping_failed", {
      requestId,
      provider: "telegram",
      code: error?.code || "notification_error",
    });
    return { status: "failed" };
  }
}

// Re-drives Telegram notifications whose first send attempt failed. Text and the
// inline keyboard are replayed from the stored row; image previews fall back to a
// text message that still carries the approval buttons.
// The conditional UPDATE is the claim: pending + a future next_retry_at is its
// lease, and last_error temporarily holds the non-secret owner token. Attempts are
// consumed before network I/O, so a crashed isolate can be reclaimed after the
// lease without allowing another live sweep to finalize the same row.
async function claimTelegramNotificationRetry(db) {
  const claimedAt = now();
  const claimToken = telegramNotificationClaimToken();
  const row = await db
    .prepare(
      `UPDATE telegram_notifications
       SET status = 'pending', attempt_count = attempt_count + 1,
           last_error = ?, next_retry_at = ?, updated_at = ?
       WHERE event_key = (
         SELECT event_key
         FROM telegram_notifications
         WHERE attempt_count < ? AND message_text IS NOT NULL
           AND (
             (status = 'failed' AND (next_retry_at IS NULL OR next_retry_at <= ?))
             OR (status = 'pending' AND next_retry_at IS NOT NULL AND next_retry_at <= ?)
           )
         ORDER BY updated_at ASC, event_key ASC
         LIMIT 1
       )
       RETURNING event_key, message_text, keyboard_json, attempt_count`
    )
    .bind(
      claimToken,
      addSecondsIso(TELEGRAM_NOTIFICATION_RETRY_SECONDS),
      claimedAt,
      TELEGRAM_NOTIFICATION_MAX_ATTEMPTS,
      claimedAt,
      claimedAt
    )
    .first();
  return row ? { ...row, claimToken } : null;
}

export async function retryFailedTelegramNotifications(env, requestId) {
  if (!isTelegramConfigured(env)) return { retried: 0 };
  const db = requireDatabase(env);
  let retried = 0;
  for (let index = 0; index < TELEGRAM_NOTIFICATION_RETRY_BATCH_SIZE; index += 1) {
    const row = await claimTelegramNotificationRetry(db);
    if (!row) break;
    let keyboard = null;
    if (row.keyboard_json) {
      try {
        keyboard = JSON.parse(row.keyboard_json);
      } catch {
        keyboard = null;
      }
    }
    try {
      const telegram = new TelegramService(env);
      if (keyboard) await telegram.sendInlineKeyboard(row.message_text, keyboard, requestId);
      else await telegram.sendText(row.message_text, { requestId });
    } catch (error) {
      await db
        .prepare(
          `UPDATE telegram_notifications
           SET status = 'failed', last_error = ?,
               next_retry_at = CASE WHEN attempt_count >= ? THEN NULL ELSE ? END,
               updated_at = ?
           WHERE event_key = ? AND status = 'pending' AND last_error = ?`
        )
        .bind(
          telegramNotificationErrorCode(error),
          TELEGRAM_NOTIFICATION_MAX_ATTEMPTS,
          addSecondsIso(TELEGRAM_NOTIFICATION_RETRY_SECONDS),
          now(),
          row.event_key,
          row.claimToken
        )
        .run();
      logEvent("warn", "telegram_notification_retry_failed", {
        requestId,
        provider: "telegram",
        code: error?.code || "telegram_error",
      });
      continue;
    }
    const completedAt = now();
    const completed = await db
      .prepare(
        `UPDATE telegram_notifications
         SET status = 'sent', sent_at = ?, last_error = NULL,
             next_retry_at = NULL, updated_at = ?
         WHERE event_key = ? AND status = 'pending' AND last_error = ?`
      )
      .bind(completedAt, completedAt, row.event_key, row.claimToken)
      .run();
    if (Number(completed.meta?.changes ?? 0) > 0) {
      retried += 1;
    } else {
      logEvent("warn", "telegram_notification_retry_claim_lost", {
        requestId,
        provider: "telegram",
        code: "claim_lost",
      });
    }
  }
  return { retried };
}

async function sendCampaignImagePreview(env, db, service, campaign, bundle, media, requestId) {
  let previewStatus = "blocked";
  if (isTelegramConfigured(env)) {
    try {
      const stored = await service.storage.getPrivateObject(media.r2_key);
      if (!stored) throw new ServiceError("media_storage_failed", { status: 502 });
      const bytes = new Uint8Array(await stored.arrayBuffer());
      if (bytes.byteLength !== media.byte_size) {
        throw new ServiceError("media_storage_failed", { status: 502 });
      }
      const notification = await sendTelegramNotificationOnce(env, {
        eventKey: `content_image_preview:${campaign.id}:${media.id}`,
        type: "content_image_preview",
        entityId: campaign.id,
        text: contentPreviewText(campaign, bundle),
        keyboard: campaignApprovalKeyboard(campaign.id),
        photo: {
          bytes,
          mimeType: media.mime_type,
          filename: "sosho-campaign-main-image",
        },
        requestId,
      });
      previewStatus = notification.status === "sent" || notification.status === "duplicate"
        ? "sent"
        : notification.status === "failed" ? "failed" : "blocked";
    } catch (error) {
      previewStatus = "failed";
      logEvent("warn", "telegram_image_preview_failed", {
        requestId,
        provider: "telegram",
        code: error?.code || "telegram_error",
      });
    }
  }
  try {
    await db
      .prepare(
        `UPDATE content_media SET telegram_preview_status = ?, updated_at = ? WHERE id = ?`
      )
      .bind(previewStatus, now(), media.id)
      .run();
  } catch (error) {
    logEvent("warn", "media_preview_status_update_failed", {
      requestId,
      code: error?.code || "database_error",
    });
  }
  return previewStatus;
}

function contentPreviewText(campaign, bundle) {
  return [
    "پیش‌نمایش محتوای جدید",
    `عنوان: ${bundle.campaignTitle}`,
    `مخاطب: ${bundle.targetAudience}`,
    `هوک: ${bundle.mainHook}`,
    `دعوت به اقدام: ${bundle.callToAction}`,
    "محتواها: ریل، استوری، کاروسل، کپشن شبکه‌ها، یوتیوب، تردز و زیرنویس",
    `Campaign ID: ${campaign.id}`,
  ].join("\n");
}

function contentDetailsText(campaign, bundle) {
  return [
    `جزئیات Campaign: ${campaign.id}`,
    `عنوان: ${bundle.campaignTitle}`,
    `مخاطب: ${bundle.targetAudience}`,
    `هدف: ${bundle.contentGoal}`,
    `هوک: ${bundle.mainHook}`,
    `پیام اصلی: ${bundle.mainMessage}`,
    `CTA: ${bundle.callToAction}`,
    `Instagram: ${bundle.instagramCaption}`,
    `LinkedIn: ${bundle.linkedinPost}`,
    `Telegram: ${bundle.telegramPost}`,
    `YouTube: ${bundle.youtubeTitle}\n${bundle.youtubeDescription}`,
    `جهت بصری: ${bundle.visualDirection}`,
  ].join("\n\n");
}

async function createContentCampaign(env, input) {
  const id = createId("campaign");
  const timestamp = now();
  await requireDatabase(env)
    .prepare(
      `INSERT INTO content_campaigns (
        id, topic, target_audience, goal, language, status, scheduled_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?)`
    )
    .bind(id, input.topic, input.targetAudience, input.goal, input.language,
      input.scheduledAt, timestamp, timestamp)
    .run();
  return getContentCampaign(env, id);
}

function serializeContentMedia(row) {
  return row ? {
    id: row.id,
    campaignId: row.campaign_id,
    mediaType: row.media_type,
    r2Key: row.r2_key,
    mimeType: row.mime_type,
    byteSize: row.byte_size,
    status: row.status,
    provider: row.provider,
    model: row.model,
    attemptCount: row.attempt_count,
    telegramPreviewStatus: row.telegram_preview_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    storedAt: row.stored_at,
    lastError: row.last_error,
    supersededAt: row.superseded_at ?? null,
  } : null;
}

async function getMainImageRow(db, campaignId) {
  return db
    .prepare(
      `SELECT id, campaign_id, media_type, r2_key, mime_type, byte_size, status,
              provider, model, attempt_count, telegram_preview_status,
              created_at, updated_at, stored_at, last_error, superseded_at
       FROM content_media
       WHERE campaign_id = ? AND media_type = 'main_image'
       LIMIT 1`
    )
    .bind(campaignId)
    .first();
}

async function getContentCampaign(env, id) {
  const db = requireDatabase(env);
  const campaign = await db
    .prepare(
      `SELECT id, topic, target_audience, goal, language, status, approval_status,
              approval_decided_at, rejection_reason,
              approval_telegram_user_id, approval_callback_id,
              scheduled_at, created_at, updated_at
       FROM content_campaigns WHERE id = ? LIMIT 1`
    )
    .bind(id)
    .first();
  if (!campaign) throw new ServiceError("campaign_not_found", { status: 404 });
  const item = await db
    .prepare(
      `SELECT id, campaign_id, content_type, platform, content_json,
              validation_status, provider, model, created_at, updated_at
       FROM content_items
       WHERE campaign_id = ? AND validation_status = 'valid'
       ORDER BY created_at DESC LIMIT 1`
    )
    .bind(id)
    .first();
  const mainImage = await getMainImageRow(db, id);
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
      approvalTelegramUserId: campaign.approval_telegram_user_id,
      approvalCallbackId: campaign.approval_callback_id,
      scheduledAt: campaign.scheduled_at,
      createdAt: campaign.created_at,
      updatedAt: campaign.updated_at,
    },
    contentItem: item ? {
      id: item.id,
      campaignId: item.campaign_id,
      contentType: item.content_type,
      platform: item.platform,
      content: parseJson(item.content_json, null),
      validationStatus: item.validation_status,
      provider: item.provider,
      model: item.model,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    } : null,
    mainImage: serializeContentMedia(mainImage),
  };
}

async function generateContentCampaign(env, id, requestId, { regenerate = false } = {}) {
  const db = requireDatabase(env);
  const claimed = await db
    .prepare(
      `UPDATE content_campaigns
       SET status = 'generating', approval_status = 'pending',
           approval_decided_at = NULL, rejection_reason = NULL,
           approval_telegram_user_id = NULL, approval_callback_id = NULL,
           updated_at = ?
       WHERE id = ? AND status IN (${regenerate ? "'generated', 'failed'" : "'draft', 'failed'"})
       RETURNING id, topic, target_audience, goal, language`
    )
    .bind(now(), id)
    .first();
  if (!claimed) {
    const existing = await db.prepare("SELECT status FROM content_campaigns WHERE id = ?").bind(id).first();
    if (!existing) throw new ServiceError("campaign_not_found", { status: 404 });
    throw new ServiceError("invalid_campaign_state", { status: 409 });
  }
  try {
    const service = new ContentGenerationService(env);
    const bundle = await service.generate(claimed, requestId);
    const generation = service.getLastRun() || {};
    const completedAt = now();
    const itemId = createId("content");
    const statements = [
      db
        .prepare(
          `INSERT INTO content_items (
            id, campaign_id, content_type, platform, content_json,
            validation_status, provider, model, created_at, updated_at
          ) VALUES (?, ?, 'content_bundle', 'multi_platform', ?, 'valid', ?, ?, ?, ?)`
        )
        .bind(
          itemId,
          id,
          JSON.stringify(bundle),
          typeof generation.provider === "string" ? generation.provider.slice(0, 80) : null,
          typeof generation.model === "string" ? generation.model.slice(0, 200) : null,
          completedAt,
          completedAt
        ),
      db
        .prepare(
          `UPDATE content_campaigns
           SET status = 'generated', approval_status = 'pending',
               approval_decided_at = NULL, approval_telegram_user_id = NULL,
               approval_callback_id = NULL, updated_at = ?
           WHERE id = ? AND status = 'generating'`
        )
        .bind(completedAt, id),
    ];
    if (regenerate) {
      // The stored main image was rendered from the previous bundle's prompt; mark
      // it superseded so a fresh generate-image call rebuilds it.
      statements.push(
        db
          .prepare(
            `UPDATE content_media
             SET superseded_at = ?, telegram_preview_status = 'blocked', updated_at = ?
             WHERE campaign_id = ? AND media_type = 'main_image'
               AND status = 'stored' AND superseded_at IS NULL`
          )
          .bind(completedAt, completedAt, id)
      );
    }
    await db.batch(statements);
    const generated = await getContentCampaign(env, id);
    await sendTelegramNotificationOnce(env, {
      eventKey: `content_preview:${id}:${itemId}`,
      type: "content_preview",
      entityId: id,
      text: contentPreviewText(generated.campaign, bundle),
      keyboard: campaignApprovalKeyboard(id),
      requestId,
    });
    return generated;
  } catch (error) {
    await db
      .prepare(
        `UPDATE content_campaigns SET status = 'failed', updated_at = ?
         WHERE id = ? AND status = 'generating'`
      )
      .bind(now(), id)
      .run();
    throw error;
  }
}

async function claimMainImageGeneration(db, campaignId, descriptor) {
  const existing = await getMainImageRow(db, campaignId);
  if (existing?.status === "stored" && !existing.superseded_at) {
    return { row: existing, reused: true };
  }
  if (existing?.status === "generating") {
    throw new ServiceError("image_generation_in_progress", { status: 409 });
  }
  const timestamp = now();
  const reclaimable =
    existing?.status === "failed" ||
    (existing?.status === "stored" && Boolean(existing.superseded_at));
  if (reclaimable) {
    const claimed = await db
      .prepare(
        `UPDATE content_media
         SET status = 'generating', provider = ?, model = ?, attempt_count = attempt_count + 1,
             mime_type = NULL, byte_size = NULL, stored_at = NULL, last_error = NULL,
             superseded_at = NULL, updated_at = ?, telegram_preview_status = 'blocked'
         WHERE id = ? AND (status = 'failed' OR (status = 'stored' AND superseded_at IS NOT NULL))
         RETURNING id, campaign_id, media_type, r2_key, mime_type, byte_size, status,
                   provider, model, attempt_count, telegram_preview_status,
                   created_at, updated_at, stored_at, last_error, superseded_at`
      )
      .bind(descriptor.provider, descriptor.model, timestamp, existing.id)
      .first();
    if (!claimed) throw new ServiceError("image_generation_in_progress", { status: 409 });
    return { row: claimed, reused: false };
  }
  const mediaId = createId("media");
  const inserted = await db
    .prepare(
      `INSERT OR IGNORE INTO content_media (
        id, campaign_id, media_type, r2_key, status, provider, model,
        attempt_count, telegram_preview_status, created_at, updated_at
      ) VALUES (?, ?, 'main_image', ?, 'generating', ?, ?, 1, 'blocked', ?, ?)`
    )
    .bind(
      mediaId,
      campaignId,
      createMainImageR2Key(campaignId),
      descriptor.provider,
      descriptor.model,
      timestamp,
      timestamp
    )
    .run();
  if (Number(inserted.meta?.changes ?? 0) === 0) {
    const concurrent = await getMainImageRow(db, campaignId);
    if (concurrent?.status === "stored") return { row: concurrent, reused: true };
    throw new ServiceError("image_generation_in_progress", { status: 409 });
  }
  return { row: await getMainImageRow(db, campaignId), reused: false };
}

async function generateCampaignMainImage(env, campaignId, requestId) {
  const db = requireDatabase(env);
  const details = await getContentCampaign(env, campaignId);
  if (details.campaign.status !== "generated") {
    throw new ServiceError("invalid_campaign_state", { status: 409 });
  }
  if (details.campaign.approvalStatus !== "approved") {
    throw new ServiceError("campaign_not_approved", { status: 409 });
  }
  if (!details.contentItem?.content) {
    throw new ServiceError("content_not_found", { status: 404 });
  }
  if (details.mainImage?.status === "stored" && !details.mainImage.supersededAt) {
    return { ...details, imageGeneration: { reused: true } };
  }
  if (details.mainImage?.status === "generating") {
    throw new ServiceError("image_generation_in_progress", { status: 409 });
  }

  const service = new ImageGenerationService(env);
  service.assertConfigured();
  const claim = await claimMainImageGeneration(db, campaignId, service.descriptor);
  if (claim.reused) {
    return { ...(await getContentCampaign(env, campaignId)), imageGeneration: { reused: true } };
  }
  let generated;
  try {
    generated = await service.generateAndStore({
      campaign: details.campaign,
      bundle: details.contentItem.content,
      r2Key: claim.row.r2_key,
      requestId,
    });
    const completedAt = now();
    const updated = await db
      .prepare(
        `UPDATE content_media
         SET status = 'stored', mime_type = ?, byte_size = ?, provider = ?, model = ?,
             stored_at = ?, updated_at = ?, last_error = NULL
         WHERE id = ? AND status = 'generating'`
      )
      .bind(
        generated.mimeType,
        generated.byteSize,
        generated.provider,
        generated.model,
        completedAt,
        completedAt,
        claim.row.id
      )
      .run();
    if (Number(updated.meta?.changes ?? 0) === 0) {
      throw new ServiceError("media_metadata_failed", { status: 502 });
    }
  } catch (error) {
    await db
      .prepare(
        `UPDATE content_media
         SET status = 'failed', last_error = ?, updated_at = ?
         WHERE id = ? AND status = 'generating'`
      )
      .bind(String(error?.code || "image_generation_failed").slice(0, 100), now(), claim.row.id)
      .run();
    throw error;
  }
  const storedMedia = await getMainImageRow(db, campaignId);
  await sendCampaignImagePreview(
    env,
    db,
    service,
    details.campaign,
    details.contentItem.content,
    storedMedia,
    requestId
  );
  return { ...(await getContentCampaign(env, campaignId)), imageGeneration: { reused: false } };
}

function getRetentionDays(env, name, fallback) {
  return getIntegerEnv(env, name, fallback, { min: 1, max: 3650 });
}

function getAllowedOrigins(env) {
  const configured = String(
    env.PUBLIC_SITE_ORIGINS || "https://sosho-studio.net,https://www.sosho-studio.net"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (env.ENVIRONMENT !== "production") {
    configured.push("http://localhost:3000", "http://127.0.0.1:3000");
  }
  return new Set(configured);
}

function isAllowedWebsiteRequest(request, env) {
  const origin = request.headers.get("origin");
  if (origin) return getAllowedOrigins(env).has(origin);
  return env.ENVIRONMENT !== "production" || request.headers.get("sec-fetch-site") === "same-origin";
}

async function readTextBody(request, maxBytes) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > maxBytes) {
    throw new ServiceError("payload_too_large", { status: 413 });
  }
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new ServiceError("payload_too_large", { status: 413 });
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

async function readJsonBody(request, maxBytes) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    throw new ServiceError("unsupported_media_type", { status: 415 });
  }
  const text = await readTextBody(request, maxBytes);
  try {
    return JSON.parse(text);
  } catch {
    throw new ServiceError("invalid_json", { status: 400 });
  }
}

async function requireNoRequestBody(request) {
  try {
    await readTextBody(request, 0);
  } catch (error) {
    if (error instanceof ServiceError && error.code === "payload_too_large") {
      throw new ServiceError("request_body_not_allowed", { status: 400 });
    }
    throw error;
  }
}

async function findWebsiteConversation(env, conversationId) {
  return requireDatabase(env)
    .prepare(
      `SELECT c.id AS conversation_id, c.lead_id, c.handoff_state,
              l.requirements_json
       FROM conversations c
       JOIN leads l ON l.id = c.lead_id
       WHERE c.id = ? AND c.channel = 'website' AND c.status = 'active'
       LIMIT 1`
    )
    .bind(conversationId)
    .first();
}

async function findConversationById(env, conversationId) {
  return requireDatabase(env)
    .prepare("SELECT id, channel, status FROM conversations WHERE id = ? LIMIT 1")
    .bind(conversationId)
    .first();
}

async function findInstagramLead(env, externalUserId) {
  return requireDatabase(env)
    .prepare(
      `SELECT l.id AS lead_id, l.requirements_json,
         (SELECT c.id
          FROM conversations c
          WHERE c.lead_id = l.id AND c.channel = 'instagram' AND c.status = 'active'
          ORDER BY c.updated_at DESC
          LIMIT 1) AS conversation_id,
         (SELECT c.handoff_state
          FROM conversations c
          WHERE c.lead_id = l.id AND c.channel = 'instagram' AND c.status = 'active'
          ORDER BY c.updated_at DESC
          LIMIT 1) AS handoff_state
       FROM leads l
       WHERE l.instagram_user_id = ?
       LIMIT 1`
    )
    .bind(externalUserId)
    .first();
}

async function createConversationForLead(env, leadId, channel) {
  const conversationId = createConversationId();
  const createdAt = now();
  await requireDatabase(env)
    .prepare(
      `INSERT INTO conversations (id, lead_id, channel, status, created_at, updated_at)
       VALUES (?, ?, ?, 'active', ?, ?)`
    )
    .bind(conversationId, leadId, channel, createdAt, createdAt)
    .run();
  return conversationId;
}

async function createLeadAndConversation(
  env,
  { locale, channel, externalUserId = null, conversationId = createConversationId() }
) {
  const db = requireDatabase(env);
  const leadId = createId("lead");
  const createdAt = now();
  const piiExpiresAt = addDaysIso(
    new Date(createdAt),
    getRetentionDays(env, "LEAD_PII_RETENTION_DAYS", 365)
  );

  await db.batch([
    db
      .prepare(
        `INSERT INTO leads (
          id, source, locale, instagram_user_id, status, requirements_json,
          created_at, updated_at, pii_expires_at
        ) VALUES (?, ?, ?, ?, 'discovery', '{}', ?, ?, ?)`
      )
      .bind(
        leadId,
        channel,
        locale,
        externalUserId,
        createdAt,
        createdAt,
        piiExpiresAt
      ),
    db
      .prepare(
        `INSERT INTO conversations (
          id, lead_id, channel, status, created_at, updated_at
        ) VALUES (?, ?, ?, 'active', ?, ?)`
      )
      .bind(conversationId, leadId, channel, createdAt, createdAt),
  ]);

  return {
    conversation_id: conversationId,
    lead_id: leadId,
    requirements_json: "{}",
    handoff_state: "ai_active",
    is_new_lead: true,
  };
}

async function resolveWebsiteConversation(env, { conversationId, locale }) {
  const existing = await findWebsiteConversation(env, conversationId);
  if (existing) return existing;
  const collision = await findConversationById(env, conversationId);
  return createLeadAndConversation(env, {
    locale,
    channel: "website",
    conversationId: collision ? createConversationId() : conversationId,
  });
}

async function resolveInstagramConversation(env, { externalUserId, locale }) {
  const lead = await findInstagramLead(env, externalUserId);
  if (lead?.conversation_id) return lead;
  if (lead?.lead_id) {
    const conversationId = await createConversationForLead(env, lead.lead_id, "instagram");
    return { ...lead, conversation_id: conversationId, handoff_state: "ai_active" };
  }
  return createLeadAndConversation(env, {
    locale,
    channel: "instagram",
    externalUserId,
  });
}

async function insertMessage(
  env,
  conversationId,
  role,
  content,
  metadata = {},
  externalEventId = null
) {
  const db = requireDatabase(env);
  const createdAt = now();
  const expiresAt = addDaysIso(
    new Date(createdAt),
    getRetentionDays(env, "MESSAGE_RETENTION_DAYS", 180)
  );
  const inserted = await db
    .prepare(
      `INSERT OR IGNORE INTO messages (
        id, conversation_id, role, content, metadata_json, created_at,
        expires_at, external_event_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      createId("msg"),
      conversationId,
      role,
      content,
      JSON.stringify(metadata),
      createdAt,
      expiresAt,
      externalEventId
    )
    .run();
  if (Number(inserted.meta?.changes ?? 0) > 0) {
    await db
      .prepare("UPDATE conversations SET updated_at = ? WHERE id = ?")
      .bind(createdAt, conversationId)
      .run();
    return true;
  }
  return false;
}

async function findWebhookTurnMessage(env, conversationId, externalEventId, role) {
  return requireDatabase(env)
    .prepare(
      `SELECT content, metadata_json
       FROM messages
       WHERE conversation_id = ? AND external_event_id = ? AND role = ?
       LIMIT 1`
    )
    .bind(conversationId, externalEventId, role)
    .first();
}

async function getHistory(env, conversationId) {
  const result = await requireDatabase(env)
    .prepare(
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

async function countConversationUserMessages(env, conversationId) {
  const result = await requireDatabase(env)
    .prepare(
      `SELECT COUNT(*) AS total
       FROM messages
       WHERE conversation_id = ? AND role = 'user'`
    )
    .bind(conversationId)
    .first();
  return Number(result?.total ?? 0);
}

export async function consumeRateLimit(
  db,
  { key, limit, windowSeconds, currentTimeMs = Date.now() }
) {
  const windowStart = getWindowStart(currentTimeMs, windowSeconds);
  const updatedAt = new Date(currentTimeMs).toISOString();
  const expiresAt = new Date(windowStart + windowSeconds * 1000 + 86_400_000).toISOString();
  const row = await db
    .prepare(
      `INSERT INTO rate_limit_counters (
        scope_key, window_start, window_seconds, count, updated_at, expires_at
      ) VALUES (?, ?, ?, 1, ?, ?)
      ON CONFLICT(scope_key, window_start, window_seconds)
      DO UPDATE SET count = count + 1, updated_at = excluded.updated_at,
                    expires_at = excluded.expires_at
      RETURNING count`
    )
    .bind(key, windowStart, windowSeconds, updatedAt, expiresAt)
    .first();
  const count = Number(row?.count ?? limit + 1);
  return { allowed: count <= limit, count, limit, windowStart };
}

async function hashedRateKey(env, scope, value) {
  const salt = env.RATE_LIMIT_SALT || (env.ENVIRONMENT !== "production" ? "local-development" : "");
  if (!salt) throw new ServiceError("rate_limit_not_configured", { status: 503 });
  return `${scope}:${await hashIdentifier(value, salt)}`;
}

async function enforceAdminLoginRateLimit(request, env) {
  const ipAddress =
    request.headers.get("cf-connecting-ip") ||
    (env.ENVIRONMENT !== "production"
      ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      : null) ||
    "unknown";
  const key = await hashedRateKey(env, "admin_login", ipAddress);
  return consumeRateLimit(requireDatabase(env), {
    key,
    limit: 10,
    windowSeconds: 15 * 60,
  });
}

async function enforceWebsiteIpRateLimit(env, input) {
  const db = requireDatabase(env);
  const ipKey = await hashedRateKey(env, "website_ip", input.ipAddress || "unknown");
  const result = await consumeRateLimit(db, {
    key: ipKey,
    limit: getIntegerEnv(env, "CHAT_IP_HOURLY_LIMIT", 60, { min: 1, max: 10_000 }),
    windowSeconds: 3600,
  });
  return { allowed: result.allowed, scope: "ip" };
}

async function enforceConversationRateLimit(env, conversationId) {
  const result = await consumeRateLimit(requireDatabase(env), {
    key: `website_conversation:${conversationId}`,
    limit: getIntegerEnv(env, "CHAT_CONVERSATION_HOURLY_LIMIT", 30, {
      min: 1,
      max: 10_000,
    }),
    windowSeconds: 3600,
  });
  return { allowed: result.allowed, scope: "conversation" };
}

async function enforceInstagramRateLimit(env, externalUserId) {
  const instagramKey = await hashedRateKey(env, "instagram_user", externalUserId);
  const instagramResult = await consumeRateLimit(requireDatabase(env), {
    key: instagramKey,
    limit: getIntegerEnv(env, "INSTAGRAM_USER_HOURLY_LIMIT", 30, {
      min: 1,
      max: 10_000,
    }),
    windowSeconds: 3600,
  });
  return { allowed: instagramResult.allowed, scope: "instagram_user" };
}

async function reserveOpenAiQuota(env) {
  const db = requireDatabase(env);
  const hourly = await consumeRateLimit(db, {
    key: "openai:global:hourly",
    limit: getIntegerEnv(env, "OPENAI_HOURLY_LIMIT", 100, { min: 1, max: 1_000_000 }),
    windowSeconds: 3600,
  });
  if (!hourly.allowed) return { allowed: false, scope: "hourly" };
  const daily = await consumeRateLimit(db, {
    key: "openai:global:daily",
    limit: getIntegerEnv(env, "OPENAI_DAILY_LIMIT", 500, { min: 1, max: 10_000_000 }),
    windowSeconds: 86_400,
  });
  if (!daily.allowed) return { allowed: false, scope: "daily" };
  return { allowed: true };
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

async function callSalesModel(
  env,
  { locale, history, profile, messageCount, conversationId, requestId }
) {
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

  const safetyIdentifier = await hashIdentifier(
    conversationId,
    env.RATE_LIMIT_SALT || "openai-safety"
  );
  const startedAt = Date.now();
  return retryWithBackoff(
    async (attempt) => {
      const quota = await reserveOpenAiQuota(env);
      if (!quota.allowed) {
        throw new ServiceError(`openai_${quota.scope}_quota_exceeded`, { status: 429 });
      }
      const response = await fetchWithTimeout(
        fetch,
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${env.OPENAI_API_KEY}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: env.OPENAI_MODEL || "gpt-5.6-luna",
            store: false,
            max_output_tokens: getIntegerEnv(env, "OPENAI_MAX_OUTPUT_TOKENS", 1200, {
              min: 200,
              max: 8000,
            }),
            safety_identifier: safetyIdentifier,
            instructions,
            input: history.map((message) => ({ role: message.role, content: message.content })),
            text: {
              format: {
                type: "json_schema",
                name: "sosho_sales_turn",
                strict: true,
                schema: SALES_RESPONSE_SCHEMA,
              },
            },
          }),
        },
        getIntegerEnv(env, "OPENAI_TIMEOUT_MS", 8000, { min: 1000, max: 30_000 })
      );
      if (!response.ok) {
        const diagnostics = await readOpenAIErrorDiagnostics(response);
        logEvent("warn", "provider_request_failed", {
          requestId,
          provider: "openai",
          attempt,
          status: response.status,
          durationMs: Date.now() - startedAt,
          ...diagnostics,
        });
        throw new ServiceError(`openai_http_${response.status}`, {
          status: response.status,
          retryable: isRetryableStatus(response.status),
        });
      }
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new ServiceError("openai_invalid_json", { status: 502, retryable: true });
      }
      if (payload.status && payload.status !== "completed") {
        throw new ServiceError(`openai_${payload.status}`, { status: 502, retryable: true });
      }
      const outputText = extractOutputText(payload);
      if (!outputText) {
        throw new ServiceError("openai_empty_output", { status: 502, retryable: true });
      }
      let structured;
      try {
        structured = JSON.parse(outputText);
      } catch {
        throw new ServiceError("openai_unparseable_output", { status: 502, retryable: true });
      }
      const validated = validateSalesResponse(structured);
      if (!validated.ok) {
        throw new ServiceError(validated.code, { status: 502, retryable: true });
      }
      logEvent("info", "provider_request_succeeded", {
        requestId,
        provider: "openai",
        attempt,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      return validated.value;
    },
    {
      maxAttempts: getIntegerEnv(env, "OPENAI_MAX_ATTEMPTS", 3, { min: 1, max: 5 }),
      baseDelayMs: getIntegerEnv(env, "RETRY_BASE_DELAY_MS", 250, { min: 1, max: 5000 }),
      maxDelayMs: 5000,
      onRetry: ({ attempt, delayMs, error }) =>
        logEvent("warn", "provider_request_retry", {
          requestId,
          provider: "openai",
          attempt,
          retryInMs: delayMs,
          code: error?.code || "provider_error",
        }),
    }
  );
}

function mergeProfile(current, extracted) {
  const next = { ...current };
  for (const [key, value] of Object.entries(extracted ?? {})) {
    if (typeof value === "string" && value.trim()) next[key] = value.trim();
  }
  return next;
}

async function updateLead(env, leadId, result, profile) {
  await requireDatabase(env)
    .prepare(
      `UPDATE leads
       SET status = ?, project_type = ?, tier = ?, budget = ?,
           requirements_json = ?, updated_at = ?
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

function salesNotificationText(type, input, conversation, result, profile) {
  const labels = {
    lead_created: "سرنخ جدید",
    proposal_ready: "پیشنهاد آماده بررسی",
    handoff: "نیاز به دخالت مدیر",
    provider_failed: "شکست Provider فروش",
  };
  const contact = [profile.contactName, profile.phone, profile.preferredChannel]
    .filter((value) => typeof value === "string" && value.trim())
    .join(" | ");
  return [
    labels[type] || "رویداد فروش",
    `منبع: ${input.channel}`,
    `نوع پروژه: ${result.projectType || "نامشخص"}`,
    `بودجه: ${profile.budgetToman || "ثبت نشده"}`,
    `سطح پیشنهادی: ${result.recommendedTier || "نامشخص"}`,
    `مرحله: ${result.stage}`,
    `Conversation ID: ${conversation.conversation_id}`,
    ...(contact ? [`تماس: ${contact}`] : []),
  ].join("\n");
}

async function notifySalesEvent(env, type, input, conversation, result, profile) {
  return sendTelegramNotificationOnce(env, {
    eventKey: `sales:${type}:${conversation.conversation_id}`,
    type,
    entityId: conversation.lead_id,
    text: salesNotificationText(type, input, conversation, result, profile),
    requestId: input.requestId,
  });
}

function handoffAcknowledgement(locale) {
  return {
    reply: locale === "fa"
      ? "پیام شما ثبت شد. ادامه گفتگو به مدیر سپرده شده است."
      : "Your message is saved. A manager will continue this conversation.",
    stage: "handoff",
    projectType: "unknown",
    recommendedTier: "unknown",
    extracted: {},
    missingFields: [],
    quickReplies: [],
    isComplete: false,
    confidence: 1,
  };
}

function queueSalesNotifications(
  env,
  notificationTypes,
  input,
  conversation,
  result,
  profile,
  waitUntil
) {
  if (notificationTypes.length < 1) return;
  const flushNotifications = async () => {
    for (const notificationType of notificationTypes) {
      try {
        await notifySalesEvent(env, notificationType, input, conversation, result, profile);
      } catch (error) {
        logEvent("warn", "sales_notification_failed", {
          requestId: input.requestId,
          provider: "telegram",
          code: error?.code || "notification_error",
        });
      }
    }
  };
  if (typeof waitUntil === "function") waitUntil(flushNotifications());
  else return flushNotifications();
}

export async function handleSalesTurn(env, input, waitUntil) {
  requireDatabase(env);
  if (input.channel === "website") {
    const ipRateLimit = await enforceWebsiteIpRateLimit(env, input);
    if (!ipRateLimit.allowed) {
      logEvent("warn", "sales_rate_limited", {
        requestId: input.requestId,
        channel: input.channel,
        code: ipRateLimit.scope,
      });
      return { error: "rate_limited", status: 429 };
    }
  }
  const conversation =
    input.channel === "instagram"
      ? await resolveInstagramConversation(env, input)
      : await resolveWebsiteConversation(env, input);
  if (input.externalEventId) {
    const completed = await findWebhookTurnMessage(
      env,
      conversation.conversation_id,
      input.externalEventId,
      "assistant"
    );
    if (completed) {
      const metadata = parseJson(completed.metadata_json, {});
      return {
        conversationId: conversation.conversation_id,
        reply: completed.content,
        stage: metadata.stage || "discovery",
        quickReplies: Array.isArray(metadata.quickReplies) ? metadata.quickReplies : [],
        isComplete: metadata.isComplete === true,
        status: 200,
      };
    }
  }
  const existingUser = input.externalEventId
    ? await findWebhookTurnMessage(
        env,
        conversation.conversation_id,
        input.externalEventId,
        "user"
      )
    : null;
  if (!existingUser) {
    const rateLimit =
      input.channel === "website"
        ? await enforceConversationRateLimit(env, conversation.conversation_id)
        : await enforceInstagramRateLimit(env, input.externalUserId);
    if (!rateLimit.allowed) {
      logEvent("warn", "sales_rate_limited", {
        requestId: input.requestId,
        channel: input.channel,
        code: rateLimit.scope,
      });
      return { error: "rate_limited", status: 429 };
    }
    await insertMessage(
      env,
      conversation.conversation_id,
      "user",
      input.message,
      { channel: input.channel, requestId: input.requestId },
      input.externalEventId
    );
  }
  const profile = parseJson(conversation.requirements_json, {});
  const aiPaused = conversation.handoff_state === "handoff_requested" ||
    conversation.handoff_state === "human_active";
  const directHandoffRequest = conversation.handoff_state === "ai_active" &&
    requestsHumanHandoff(input.message);
  if (aiPaused || directHandoffRequest) {
    let handoffStarted = false;
    if (directHandoffRequest) {
      // The user's message is already persisted above. A concurrent duplicate
      // trigger for this same conversation (e.g. two open tabs sharing the
      // localStorage conversationId) can lose the claim race and throw
      // operation_in_progress/invalid_conversation_transition; that must not
      // surface as a raw error to the chat widget when the winning request is
      // already handling the transition and its notification.
      try {
        const transition = await requestConversationHandoff(requireDatabase(env), {
          conversationId: conversation.conversation_id,
          operationKey: `handoff:${conversation.conversation_id}`,
          actor: { type: "sales_user", key: "conversation_user" },
        });
        handoffStarted = transition.outcome === "succeeded";
        conversation.handoff_state = transition.conversation.handoff_state;
      } catch (error) {
        logEvent("warn", "handoff_request_race", {
          requestId: input.requestId,
          channel: input.channel,
          code: error?.code || "handoff_request_failed",
        });
      }
    }
    const result = handoffAcknowledgement(input.locale);
    const notificationTypes = [];
    if (conversation.is_new_lead) notificationTypes.push("lead_created");
    if (handoffStarted) notificationTypes.push("handoff");
    await queueSalesNotifications(
      env,
      notificationTypes,
      input,
      conversation,
      result,
      profile,
      waitUntil
    );
    return {
      conversationId: conversation.conversation_id,
      reply: result.reply,
      stage: result.stage,
      quickReplies: result.quickReplies,
      isComplete: result.isComplete,
      suppressExternalReply: input.channel !== "website",
      status: 200,
    };
  }
  const history = await getHistory(env, conversation.conversation_id);
  const messageCount = await countConversationUserMessages(env, conversation.conversation_id);
  let result;
  let providerFailed = false;
  try {
    result = await callSalesModel(env, {
      locale: input.locale,
      history,
      profile,
      messageCount,
      conversationId: conversation.conversation_id,
      requestId: input.requestId,
    });
  } catch (error) {
    providerFailed = true;
    logEvent("warn", "sales_model_fallback", {
      requestId: input.requestId,
      provider: "openai",
      code: error?.code || "provider_error",
      channel: input.channel,
    });
    result = fallbackReply(input.locale, messageCount);
  }
  const updatedProfile = mergeProfile(profile, result.extracted);
  await updateLead(env, conversation.lead_id, result, updatedProfile);
  await insertMessage(
    env,
    conversation.conversation_id,
    "assistant",
    result.reply,
    {
      stage: result.stage,
      confidence: result.confidence,
      quickReplies: result.quickReplies,
      isComplete: result.isComplete,
      requestId: input.requestId,
    },
    input.externalEventId
  );
  if (result.stage === "handoff") {
    await requestConversationHandoff(requireDatabase(env), {
      conversationId: conversation.conversation_id,
      operationKey: `handoff:${conversation.conversation_id}`,
      actor: { type: "sales_service", key: "sales_model" },
    });
  }
  const notificationTypes = [];
  if (conversation.is_new_lead) notificationTypes.push("lead_created");
  if (result.stage === "proposal_ready" || result.isComplete) notificationTypes.push("proposal_ready");
  if (result.stage === "handoff") notificationTypes.push("handoff");
  if (providerFailed) notificationTypes.push("provider_failed");
  // On the website request path this runs after the response so a slow Telegram
  // bot never inflates user-facing chat latency; the Instagram path already runs
  // the whole turn inside ctx.waitUntil.
  await queueSalesNotifications(
    env,
    notificationTypes,
    input,
    conversation,
    result,
    updatedProfile,
    waitUntil
  );
  return {
    conversationId: conversation.conversation_id,
    reply: result.reply,
    stage: result.stage,
    quickReplies: result.quickReplies,
    isComplete: result.isComplete,
    status: 200,
  };
}

export async function verifyMetaSignature(body, signature, appSecret) {
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

function extractInstagramEvents(payload) {
  const events = [];
  for (const entry of Array.isArray(payload?.entry) ? payload.entry : []) {
    for (const event of Array.isArray(entry?.messaging) ? entry.messaging : []) {
      const text = event?.message?.text;
      const senderId = event?.sender?.id;
      const eventId = event?.message?.mid;
      if (event?.message?.is_echo) continue;
      if (
        typeof text !== "string" ||
        text.trim().length < 1 ||
        text.length > 2000 ||
        typeof senderId !== "string" ||
        senderId.length > 500 ||
        typeof eventId !== "string" ||
        eventId.length > 500
      ) continue;
      events.push({ eventId, payload: event });
    }
  }
  return events;
}

export async function registerInstagramEvents(env, payload, requestId) {
  const db = requireDatabase(env);
  const receivedAt = now();
  const payloadExpiresAt = addDaysIso(
    new Date(receivedAt),
    getRetentionDays(env, "WEBHOOK_PAYLOAD_RETENTION_DAYS", 7)
  );
  const expiresAt = addDaysIso(
    new Date(receivedAt),
    getRetentionDays(env, "WEBHOOK_EVENT_RETENTION_DAYS", 90)
  );
  const events = extractInstagramEvents(payload);
  for (const event of events) {
    await db
      .prepare(
        `INSERT OR IGNORE INTO webhook_events (
          id, channel, external_event_id, payload_json, status, attempt_count,
          request_id, created_at, updated_at, payload_expires_at, expires_at
        ) VALUES (?, 'instagram', ?, ?, 'received', 0, ?, ?, ?, ?, ?)`
      )
      .bind(
        createId("webhook"),
        event.eventId,
        JSON.stringify(event.payload),
        requestId,
        receivedAt,
        receivedAt,
        payloadExpiresAt,
        expiresAt
      )
      .run();
  }
  return events.map((event) => event.eventId);
}

async function claimWebhookEvent(env, eventId, requestId) {
  const current = now();
  const staleBefore = new Date(
    Date.now() - getIntegerEnv(env, "WEBHOOK_PROCESSING_TIMEOUT_SECONDS", 120, {
      min: 30,
      max: 3600,
    }) * 1000
  ).toISOString();
  const maxAttempts = getIntegerEnv(env, "WEBHOOK_MAX_ATTEMPTS", 8, { min: 1, max: 25 });
  return requireDatabase(env)
    .prepare(
      `UPDATE webhook_events
       SET status = 'processing', attempt_count = attempt_count + 1,
           processing_started_at = ?, updated_at = ?, request_id = ?,
           next_retry_at = NULL, last_error = NULL
       WHERE external_event_id = ?
         AND attempt_count < ?
         AND (
           status = 'received'
           OR (status = 'failed' AND (next_retry_at IS NULL OR next_retry_at <= ?))
           OR (status = 'processing' AND processing_started_at <= ?)
         )
       RETURNING id, external_event_id, payload_json, attempt_count,
                 response_text, conversation_id`
    )
    .bind(current, current, requestId, eventId, maxAttempts, current, staleBefore)
    .first();
}

async function saveWebhookResponse(env, eventId, responseText, conversationId) {
  await requireDatabase(env)
    .prepare(
      `UPDATE webhook_events
       SET response_text = ?, conversation_id = ?, updated_at = ?
       WHERE external_event_id = ? AND status = 'processing'`
    )
    .bind(responseText, conversationId, now(), eventId)
    .run();
}

async function markWebhookProcessed(env, eventId) {
  const completedAt = now();
  await requireDatabase(env)
    .prepare(
      `UPDATE webhook_events
       SET status = 'processed', processed_at = ?, updated_at = ?,
           processing_started_at = NULL, next_retry_at = NULL, last_error = NULL
       WHERE external_event_id = ? AND status = 'processing'`
    )
    .bind(completedAt, completedAt, eventId)
    .run();
}

async function markWebhookFailed(env, eventId, attemptCount, errorCode, retryable) {
  const failedAt = now();
  const maxAttempts = getIntegerEnv(env, "WEBHOOK_MAX_ATTEMPTS", 8, { min: 1, max: 25 });
  const baseDelaySeconds = getIntegerEnv(env, "WEBHOOK_RETRY_BASE_SECONDS", 60, {
    min: 5,
    max: 3600,
  });
  const retryDelaySeconds = Math.min(3600, baseDelaySeconds * 2 ** Math.max(0, attemptCount - 1));
  const nextRetryAt = !retryable || attemptCount >= maxAttempts
    ? null
    : new Date(Date.now() + retryDelaySeconds * 1000).toISOString();
  await requireDatabase(env)
    .prepare(
      `UPDATE webhook_events
       SET status = 'failed', failed_at = ?, updated_at = ?,
           processing_started_at = NULL, next_retry_at = ?, last_error = ?
       WHERE external_event_id = ?`
    )
    .bind(failedAt, failedAt, nextRetryAt, String(errorCode).slice(0, 100), eventId)
    .run();
}

async function sendInstagramMessage(env, recipientId, text, requestId) {
  if (!env.META_INSTAGRAM_ACCESS_TOKEN) {
    throw new ServiceError("instagram_not_configured", { status: 503 });
  }
  const version = env.META_GRAPH_VERSION || "v26.0";
  const startedAt = Date.now();
  return retryWithBackoff(
    async (attempt) => {
      const response = await fetchWithTimeout(
        fetch,
        `https://graph.instagram.com/${version}/me/messages`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${env.META_INSTAGRAM_ACCESS_TOKEN}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            recipient: { id: recipientId },
            message: { text: text.slice(0, 1000) },
          }),
        },
        getIntegerEnv(env, "META_TIMEOUT_MS", 8000, { min: 1000, max: 30_000 })
      );
      if (!response.ok) {
        throw new ServiceError(`instagram_http_${response.status}`, {
          status: response.status,
          retryable: isRetryableStatus(response.status),
        });
      }
      logEvent("info", "provider_request_succeeded", {
        requestId,
        provider: "instagram",
        attempt,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      return true;
    },
    {
      maxAttempts: getIntegerEnv(env, "META_MAX_ATTEMPTS", 3, { min: 1, max: 5 }),
      baseDelayMs: getIntegerEnv(env, "RETRY_BASE_DELAY_MS", 250, { min: 1, max: 5000 }),
      maxDelayMs: 5000,
      onRetry: ({ attempt, delayMs, error }) =>
        logEvent("warn", "provider_request_retry", {
          requestId,
          provider: "instagram",
          attempt,
          retryInMs: delayMs,
          code: error?.code || "provider_error",
        }),
    }
  );
}

export async function processStoredWebhookEvent(env, eventId, requestId) {
  const claimed = await claimWebhookEvent(env, eventId, requestId);
  if (!claimed) return { status: "skipped" };
  try {
    const event = parseJson(claimed.payload_json, null);
    const senderId = event?.sender?.id;
    const text = event?.message?.text;
    if (typeof senderId !== "string" || typeof text !== "string") {
      throw new ServiceError("invalid_stored_webhook", { status: 400 });
    }
    let responseText = claimed.response_text;
    let conversationId = claimed.conversation_id;
    if (!responseText) {
      const result = await handleSalesTurn(env, {
        locale: env.INSTAGRAM_DEFAULT_LOCALE === "en" ? "en" : "fa",
        message: text.trim(),
        channel: "instagram",
        externalUserId: senderId,
        externalEventId: eventId,
        requestId,
      });
      if (result.error === "rate_limited") {
        await markWebhookProcessed(env, eventId);
        return { status: "rate_limited" };
      }
      if (result.error) {
        throw new ServiceError(result.error, { status: result.status || 500, retryable: true });
      }
      responseText = result.reply;
      conversationId = result.conversationId;
      if (result.suppressExternalReply) {
        await saveWebhookResponse(env, eventId, null, conversationId);
        await markWebhookProcessed(env, eventId);
        logEvent("info", "instagram_webhook_processed", {
          requestId,
          channel: "instagram",
          status: "processed",
        });
        return { status: "processed", conversationId, replySuppressed: true };
      }
      await saveWebhookResponse(env, eventId, responseText, conversationId);
    }
    await sendInstagramMessage(env, senderId, responseText, requestId);
    await markWebhookProcessed(env, eventId);
    logEvent("info", "instagram_webhook_processed", {
      requestId,
      channel: "instagram",
      status: "processed",
    });
    return { status: "processed", conversationId };
  } catch (error) {
    const errorCode = error?.code || error?.message || "webhook_processing_error";
    await markWebhookFailed(
      env,
      eventId,
      Number(claimed.attempt_count || 1),
      errorCode,
      error instanceof ServiceError ? error.retryable : true
    );
    logEvent("error", "instagram_webhook_failed", {
      requestId,
      channel: "instagram",
      status: "failed",
      code: errorCode,
      attempt: Number(claimed.attempt_count || 1),
    });
    return { status: "failed", code: errorCode };
  }
}

async function processWebhookIds(env, eventIds, requestId) {
  const results = [];
  for (const eventId of eventIds) {
    results.push(await processStoredWebhookEvent(env, eventId, requestId));
  }
  return results;
}

export async function processDueWebhookRetries(env, requestId) {
  const current = now();
  const staleBefore = new Date(
    Date.now() - getIntegerEnv(env, "WEBHOOK_PROCESSING_TIMEOUT_SECONDS", 120, {
      min: 30,
      max: 3600,
    }) * 1000
  ).toISOString();
  const maxAttempts = getIntegerEnv(env, "WEBHOOK_MAX_ATTEMPTS", 8, { min: 1, max: 25 });
  const rows = await requireDatabase(env)
    .prepare(
      `SELECT external_event_id
       FROM webhook_events
       WHERE attempt_count < ?
         AND (
           status = 'received'
           OR (status = 'failed' AND next_retry_at IS NOT NULL AND next_retry_at <= ?)
           OR (status = 'processing' AND processing_started_at <= ?)
         )
       ORDER BY updated_at ASC
       LIMIT 25`
    )
    .bind(maxAttempts, current, staleBefore)
    .all();
  return processWebhookIds(
    env,
    (rows.results ?? []).map((row) => row.external_event_id),
    requestId
  );
}

export async function runRetentionCleanup(env, requestId) {
  const db = requireDatabase(env);
  const current = now();
  const messageCutoff = addDaysIso(new Date(), -getRetentionDays(env, "MESSAGE_RETENTION_DAYS", 180));
  const leadCutoff = addDaysIso(new Date(), -getRetentionDays(env, "LEAD_PII_RETENTION_DAYS", 365));
  const webhookCutoff = addDaysIso(new Date(), -getRetentionDays(env, "WEBHOOK_EVENT_RETENTION_DAYS", 90));
  await db.batch([
    db.prepare("DELETE FROM messages WHERE expires_at <= ? OR created_at <= ?").bind(current, messageCutoff),
    db
      .prepare(
        `UPDATE webhook_events
         SET payload_json = '{}', response_text = NULL, payload_purged_at = ?, updated_at = ?
         WHERE payload_purged_at IS NULL AND payload_expires_at <= ?`
      )
      .bind(current, current, current),
    db.prepare("DELETE FROM webhook_events WHERE expires_at <= ? OR created_at <= ?").bind(current, webhookCutoff),
    db.prepare("DELETE FROM rate_limit_counters WHERE expires_at <= ?").bind(current),
  ]);
  const leads = await db
    .prepare(
      `SELECT id, requirements_json
       FROM leads
       WHERE anonymized_at IS NULL AND (pii_expires_at <= ? OR created_at <= ?)
       LIMIT 100`
    )
    .bind(current, leadCutoff)
    .all();
  for (const lead of leads.results ?? []) {
    const profile = parseJson(lead.requirements_json, {});
    for (const field of ["businessName", "contactName", "phone", "preferredChannel"]) {
      if (Object.hasOwn(profile, field)) profile[field] = null;
    }
    await db
      .prepare(
        `UPDATE leads
         SET instagram_user_id = NULL, requirements_json = ?, anonymized_at = ?,
             updated_at = ?, status = 'retained_anonymized'
         WHERE id = ? AND anonymized_at IS NULL`
      )
      .bind(JSON.stringify(profile), current, current, lead.id)
      .run();
  }
  logEvent("info", "retention_cleanup_completed", {
    requestId,
    count: Number(leads.results?.length ?? 0),
  });
}

function constantTimeEqual(left, right) {
  const a = String(left || "");
  const b = String(right || "");
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

function isExpectedTelegramCampaignForeignKeyError(error) {
  const seen = new Set();
  let current = error;
  while (current && !seen.has(current)) {
    seen.add(current);
    const message = current instanceof Error
      ? current.message
      : typeof current === "string" ? current : "";
    if (/foreign key constraint failed/iu.test(message)) return true;
    current = typeof current === "object" ? current.cause : null;
  }
  return false;
}

async function claimTelegramUpdate(env, update, requestId) {
  const timestamp = now();
  try {
    const inserted = await requireDatabase(env)
      .prepare(
        `INSERT OR IGNORE INTO telegram_updates (
          update_id, callback_id, callback_action, campaign_id, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'processing', ?, ?)`
      )
      .bind(
        update.updateId,
        update.callbackId,
        update.action,
        update.campaignId,
        timestamp,
        timestamp
      )
      .run();
    return Number(inserted.meta?.changes ?? 0) > 0;
  } catch (error) {
    // INSERT OR IGNORE does not suppress a dangling campaign foreign key. That
    // known callback race is safe to acknowledge; every other D1 failure must
    // remain visible and fail closed so Telegram can retry it later.
    if (isExpectedTelegramCampaignForeignKeyError(error)) {
      logEvent("warn", "telegram_update_claim_rejected", {
        requestId,
        provider: "telegram",
        code: "campaign_not_found",
      });
      return false;
    }
    logEvent("error", "telegram_update_claim_failed", {
      requestId,
      provider: "telegram",
      code: "database_error",
    });
    throw new ServiceError("telegram_update_claim_failed", {
      status: 503,
      retryable: true,
    });
  }
}

async function finishTelegramUpdate(env, updateId, status, errorCode = null) {
  const timestamp = now();
  await requireDatabase(env)
    .prepare(
      `UPDATE telegram_updates
       SET status = ?, processed_at = ?, updated_at = ?, last_error = ?
       WHERE update_id = ?`
    )
    .bind(status, timestamp, timestamp, errorCode, updateId)
    .run();
}

async function processTelegramCallback(env, update, ctx, requestId) {
  const telegram = new TelegramService(env);
  let answer = "انجام شد";
  let status = "processed";
  let errorCode = null;
  try {
    if (update.action === "approve") {
      await approveCampaign(requireDatabase(env), {
        campaignId: update.campaignId,
        operationKey: `telegram:${update.updateId}`,
        actor: { type: "telegram", key: "configured_admin" },
        telegramUserId: update.userId,
        telegramCallbackId: update.callbackId,
      });
      answer = "محتوا تأیید شد";
    } else if (update.action === "reject") {
      await rejectCampaign(requireDatabase(env), {
        campaignId: update.campaignId,
        operationKey: `telegram:${update.updateId}`,
        actor: { type: "telegram", key: "configured_admin" },
        reason: "رد از طریق تلگرام",
        telegramUserId: update.userId,
        telegramCallbackId: update.callbackId,
      });
      answer = "محتوا رد شد";
    } else if (update.action === "regenerate") {
      const outcome = await regenerateCampaign(requireDatabase(env), {
        campaignId: update.campaignId,
        operationKey: `telegram:${update.updateId}`,
        actor: { type: "telegram", key: "configured_admin" },
        generate: () => generateContentCampaign(
          env,
          update.campaignId,
          requestId,
          { regenerate: true }
        ),
        // Workers AI content generation can outrun Telegram's webhook timeout, so
        // run it after the 200 response instead of inside the webhook turn.
        background: ctx
          ? (task) => ctx.waitUntil(
              task
                .then((taskResult) => {
                  if (taskResult?.ok) return undefined;
                  return sendTelegramNotificationOnce(env, {
                    eventKey: `content_regenerate_failed:${update.campaignId}:${update.updateId}`,
                    type: "content_regenerate_failed",
                    entityId: update.campaignId,
                    text: `تولید دوباره محتوا برای کمپین ${update.campaignId} ناموفق بود.`,
                    requestId,
                  });
                })
                .catch(() => undefined)
            )
          : undefined,
      });
      answer = outcome.outcome === "started"
        ? "تولید دوباره در حال انجام است"
        : "محتوا دوباره تولید شد";
    } else if (update.action === "view") {
      const campaign = await getContentCampaign(env, update.campaignId);
      if (!campaign.contentItem?.content) throw new ServiceError("content_not_found", { status: 404 });
      await telegram.sendText(contentDetailsText(campaign.campaign, campaign.contentItem.content), {
        requestId,
      });
      answer = "جزئیات ارسال شد";
    }
  } catch (error) {
    status = "failed";
    errorCode = String(error?.code || "callback_failed").slice(0, 100);
    answer = "عملیات انجام نشد";
    logEvent("warn", "telegram_callback_failed", {
      requestId,
      provider: "telegram",
      code: errorCode,
    });
  }
  await finishTelegramUpdate(env, update.updateId, status, errorCode);
  try {
    await telegram.answerCallbackQuery(update.callbackId, answer, requestId);
  } catch (error) {
    logEvent("warn", "telegram_callback_answer_failed", {
      requestId,
      provider: "telegram",
      code: error?.code || "telegram_error",
    });
  }
}

async function handleTelegramWebhook(request, env, ctx, requestId) {
  if (!isTelegramWebhookConfigured(env)) {
    throw new ServiceError("telegram_not_configured", { status: 503 });
  }
  if (!constantTimeEqual(
    request.headers.get("x-telegram-bot-api-secret-token"),
    env.TELEGRAM_WEBHOOK_SECRET
  )) {
    throw new ServiceError("invalid_telegram_secret", { status: 401 });
  }
  const body = await readJsonBody(request, 65_536);
  const validation = validateTelegramUpdate(body);
  if (!validation.ok) {
    // The secret token already proved this came from Telegram. Any well-formed
    // update we do not handle (a plain message, my_chat_member, a malformed
    // callback) must be 200-acked, otherwise Telegram retry-storms it.
    if (isPlainRecord(body) && Number.isSafeInteger(body.update_id) && body.update_id >= 0) {
      return { accepted: true, ignored: true };
    }
    throw new ServiceError("invalid_telegram_update", { status: 400 });
  }
  const update = validation.value;
  if (update.chatId !== String(env.TELEGRAM_ADMIN_CHAT_ID) ||
      update.userId !== String(env.TELEGRAM_ADMIN_USER_ID)) {
    throw new ServiceError("telegram_admin_forbidden", { status: 403 });
  }
  const claimed = await claimTelegramUpdate(env, update, requestId);
  if (!claimed) {
    try {
      await new TelegramService(env).answerCallbackQuery(update.callbackId, "قبلاً پردازش شده", requestId);
    } catch {
      // The update remains deduplicated even if Telegram cannot receive the acknowledgement.
    }
    return { accepted: true, duplicate: true };
  }
  await processTelegramCallback(env, update, ctx, requestId);
  return { accepted: true, duplicate: false };
}

async function getReadiness(env) {
  const missing = [];
  if (!env.DB) missing.push("DB");
  const contentProvider = String(env.CONTENT_AI_PROVIDER || "workers_ai").trim().toLowerCase();
  const imageProvider = String(env.IMAGE_AI_PROVIDER || "workers_ai").trim().toLowerCase();
  const workersAiReady = Boolean(env.AI && typeof env.AI.run === "function");
  const contentAiReady = contentProvider === "workers_ai"
    ? workersAiReady
    : contentProvider === "openai" && Boolean(env.OPENAI_API_KEY);
  const imageAiReady = imageProvider === "workers_ai" && workersAiReady;
  const mediaStorageReady = Boolean(
    env.ARVAN_S3_ACCESS_KEY && env.ARVAN_S3_SECRET_KEY &&
    env.ARVAN_S3_ENDPOINT && env.ARVAN_S3_BUCKET
  );
  // Staging deliberately ships without ArvanCloud credentials until image
  // generation is activated there; the dashboard reports "activation required"
  // and image endpoints return configuration_missing, but /api/health must not
  // be a permanent 503.
  const mediaActivationDeferred = String(env.ENVIRONMENT || "").toLowerCase() === "staging";
  if (!contentAiReady) {
    if (contentProvider === "workers_ai") missing.push("AI");
    else if (contentProvider === "openai") missing.push("OPENAI_API_KEY");
    else missing.push("CONTENT_AI_PROVIDER");
  }
  if (!imageAiReady && !mediaActivationDeferred) {
    if (imageProvider === "workers_ai") missing.push("AI");
    else missing.push("IMAGE_AI_PROVIDER");
  }
  if (!mediaStorageReady && !mediaActivationDeferred) missing.push("MEDIA");
  if (!env.ADMIN_API_TOKEN) missing.push("ADMIN_API_TOKEN");
  if (!env.RATE_LIMIT_SALT) missing.push("RATE_LIMIT_SALT");
  if (!env.META_VERIFY_TOKEN) missing.push("META_VERIFY_TOKEN");
  if (!env.META_APP_SECRET) missing.push("META_APP_SECRET");
  if (!env.META_INSTAGRAM_ACCESS_TOKEN) missing.push("META_INSTAGRAM_ACCESS_TOKEN");
  let databaseReady = false;
  let migrationsReady = false;
  if (env.DB) {
    try {
      await env.DB.prepare("SELECT 1 AS healthy").first();
      databaseReady = true;
    } catch {
      databaseReady = false;
    }
    if (databaseReady) {
      try {
        const tables = await env.DB.prepare(
          `SELECT COUNT(*) AS total
           FROM sqlite_master
           WHERE type = 'table' AND name IN (
             'leads', 'conversations', 'messages', 'webhook_events', 'rate_limit_counters',
             'content_campaigns', 'content_items', 'content_media',
             'campaign_action_audit', 'conversation_action_audit',
             'telegram_updates', 'telegram_notifications'
           )`
        ).first();
        migrationsReady = Number(tables?.total ?? 0) === REQUIRED_TABLES.length;
        if (migrationsReady) {
          await env.DB.batch([
            env.DB.prepare("SELECT pii_expires_at, anonymized_at FROM leads LIMIT 1"),
            env.DB.prepare("SELECT expires_at, external_event_id FROM messages LIMIT 1"),
            env.DB.prepare(
              `SELECT handoff_state, handoff_requested_at, human_owner_key,
                      human_taken_over_at FROM conversations LIMIT 1`
            ),
            env.DB.prepare(
              `SELECT attempt_count, next_retry_at, response_text,
                      payload_expires_at, expires_at
               FROM webhook_events LIMIT 1`
            ),
            env.DB.prepare(
              "SELECT scope_key, window_start, window_seconds, expires_at FROM rate_limit_counters LIMIT 1"
            ),
            env.DB.prepare(
              `SELECT topic, target_audience, goal, language, status, scheduled_at,
                      approval_status, approval_decided_at, approval_telegram_user_id,
                      approval_callback_id, rejection_reason
               FROM content_campaigns LIMIT 1`
            ),
            env.DB.prepare(
              `SELECT campaign_id, content_type, platform, content_json,
                      validation_status, provider, model
               FROM content_items LIMIT 1`
            ),
            env.DB.prepare(
              `SELECT campaign_id, media_type, r2_key, mime_type, byte_size, status,
                      provider, model, attempt_count, telegram_preview_status,
                      stored_at, last_error, superseded_at
               FROM content_media LIMIT 1`
            ),
            env.DB.prepare(
              "SELECT update_id, callback_id, callback_action, campaign_id, status FROM telegram_updates LIMIT 1"
            ),
            env.DB.prepare(
              `SELECT event_key, notification_type, entity_id, status,
                      message_text, keyboard_json, next_retry_at
               FROM telegram_notifications LIMIT 1`
            ),
            env.DB.prepare(
              `SELECT operation_key, campaign_id, action, actor_type, actor_key,
                      status, outcome, reason, error_code
               FROM campaign_action_audit LIMIT 1`
            ),
            env.DB.prepare(
              `SELECT operation_key, conversation_id, action, actor_type, actor_key,
                      from_state, to_state, status, outcome, error_code
               FROM conversation_action_audit LIMIT 1`
            ),
          ]);
        }
      } catch {
        migrationsReady = false;
      }
    }
  }
  if (!databaseReady) missing.push("DB_CONNECTION");
  else if (!migrationsReady) missing.push("D1_MIGRATIONS");
  return {
    ready: missing.length === 0,
    checks: {
      database: databaseReady,
      migrations: migrationsReady,
      contentAi: contentAiReady,
      imageAi: imageAiReady,
      mediaStorage: mediaStorageReady,
      workersAi: workersAiReady,
      openai: Boolean(env.OPENAI_API_KEY),
      adminAuth: Boolean(env.ADMIN_API_TOKEN),
      rateLimitPrivacy: Boolean(env.RATE_LIMIT_SALT),
      instagram: Boolean(
        env.META_VERIFY_TOKEN && env.META_APP_SECRET && env.META_INSTAGRAM_ACCESS_TOKEN
      ),
      telegram: isTelegramWebhookConfigured(env),
    },
    missing: [...new Set(missing)],
  };
}

function apiErrorResponse(error, requestId) {
  const status = error instanceof ServiceError ? error.status : 500;
  const code = error instanceof ServiceError ? error.code : "internal_error";
  logEvent(status >= 500 ? "error" : "warn", "api_request_failed", {
    requestId,
    status,
    code,
  });
  return json({ error: code }, status, requestId);
}

export async function handleApi(request, env, ctx, url, requestId) {
  try {
    if (url.pathname === "/api/webhooks/telegram" && request.method === "POST") {
      requireDatabase(env);
      return json(await handleTelegramWebhook(request, env, ctx, requestId), 200, requestId);
    }
    if (url.pathname === "/api/admin/session") {
      if (request.method === "POST") {
        requireDatabase(env);
        if (!isAllowedWebsiteRequest(request, env)) {
          throw new ServiceError("origin_not_allowed", { status: 403 });
        }
        const rateLimit = await enforceAdminLoginRateLimit(request, env);
        if (!rateLimit.allowed) throw new ServiceError("rate_limited", { status: 429 });
        const body = await readJsonBody(request, 2048);
        if (!isPlainRecord(body) || Object.keys(body).length !== 1 ||
            typeof body.token !== "string" || body.token.length < 1 || body.token.length > 1024) {
          throw new ServiceError("invalid_request", { status: 400 });
        }
        if (!(await verifyAdminToken(body.token, env))) {
          throw new ServiceError("unauthorized", { status: 401 });
        }
        const session = await createAdminSession(env);
        const maxAge = Math.max(1, Math.floor((session.expiresAt - Date.now()) / 1000));
        return json(
          {
            authenticated: true,
            expiresAt: new Date(session.expiresAt).toISOString(),
            csrfToken: session.csrfToken,
          },
          200,
          requestId,
          { "set-cookie": adminSessionCookie(request, session.value, maxAge) }
        );
      }
      if (request.method === "GET") {
        const auth = await requireDashboardAdmin(request, env);
        return json({
          authenticated: true,
          expiresAt: auth.expiresAt ? new Date(auth.expiresAt).toISOString() : null,
          csrfToken: auth.type === "session" ? auth.csrfToken : null,
        }, 200, requestId);
      }
      if (request.method === "DELETE") {
        if (!isAllowedWebsiteRequest(request, env)) {
          throw new ServiceError("origin_not_allowed", { status: 403 });
        }
        return json(
          { authenticated: false },
          200,
          requestId,
          { "set-cookie": clearAdminSessionCookie(request) }
        );
      }
      return json({ error: "method_not_allowed" }, 405, requestId);
    }
    if (url.pathname === "/api/admin/overview") {
      if (request.method !== "GET") {
        return json({ error: "method_not_allowed" }, 405, requestId);
      }
      await requireDashboardAdmin(request, env);
      return json(await getAdminOverview(requireDatabase(env)), 200, requestId);
    }
    if (url.pathname === "/api/admin/campaigns") {
      if (request.method !== "GET") {
        return json({ error: "method_not_allowed" }, 405, requestId);
      }
      await requireDashboardAdmin(request, env);
      return json(await getAdminCampaigns(requireDatabase(env), env, url), 200, requestId);
    }
    const adminCampaignRoute = url.pathname.match(
      /^\/api\/admin\/campaigns\/([^/]+)(?:\/(approve|reject|regenerate))?$/u
    );
    if (adminCampaignRoute) {
      let campaignId;
      try {
        campaignId = decodeURIComponent(adminCampaignRoute[1]);
      } catch {
        throw new ServiceError("invalid_campaign_id", { status: 400 });
      }
      if (!CAMPAIGN_ID_PATTERN.test(campaignId)) {
        throw new ServiceError("invalid_campaign_id", { status: 400 });
      }
      const action = adminCampaignRoute[2] || null;
      if (!action) {
        if (request.method !== "GET") {
          return json({ error: "method_not_allowed" }, 405, requestId);
        }
        await requireDashboardAdmin(request, env);
        return json(
          await getAdminCampaignDetail(requireDatabase(env), env, campaignId),
          200,
          requestId
        );
      }
      if (request.method !== "POST") {
        return json({ error: "method_not_allowed" }, 405, requestId);
      }
      const origin = request.headers.get("origin");
      if (!origin || !isAllowedWebsiteRequest(request, env)) {
        throw new ServiceError("origin_not_allowed", { status: 403 });
      }
      await requireAdminSessionAction(request, env);
      const body = await readJsonBody(request, 4096);
      if (!isPlainRecord(body)) throw new ServiceError("invalid_request", { status: 400 });
      const operationKey = request.headers.get("idempotency-key") || "";
      if (!IDEMPOTENCY_KEY_PATTERN.test(operationKey)) {
        throw new ServiceError("invalid_idempotency_key", { status: 400 });
      }
      const actionOptions = {
        campaignId,
        operationKey: `dashboard:${operationKey}`,
        actor: { type: "dashboard", key: "admin_session" },
      };
      let operation;
      if (action === "approve") {
        if (Object.keys(body).length !== 0) {
          throw new ServiceError("invalid_request", { status: 400 });
        }
        operation = await approveCampaign(requireDatabase(env), actionOptions);
      } else if (action === "reject") {
        const keys = Object.keys(body);
        if (keys.length > 1 || (keys.length === 1 && keys[0] !== "reason")) {
          throw new ServiceError("invalid_request", { status: 400 });
        }
        operation = await rejectCampaign(requireDatabase(env), {
          ...actionOptions,
          reason: body.reason,
        });
      } else {
        if (Object.keys(body).length !== 0) {
          throw new ServiceError("invalid_request", { status: 400 });
        }
        operation = await regenerateCampaign(requireDatabase(env), {
          ...actionOptions,
          generate: () => generateContentCampaign(env, campaignId, requestId, {
            regenerate: true,
          }),
        });
      }
      return json({
        operation: {
          action: operation.action,
          outcome: operation.outcome,
          duplicate: operation.duplicate,
        },
        ...(await getAdminCampaignDetail(requireDatabase(env), env, campaignId)),
      }, 200, requestId);
    }
    if (url.pathname === "/api/admin/leads") {
      if (request.method !== "GET") {
        return json({ error: "method_not_allowed" }, 405, requestId);
      }
      await requireDashboardAdmin(request, env);
      return json(await getAdminLeads(requireDatabase(env), url), 200, requestId);
    }
    if (url.pathname === "/api/admin/conversations") {
      if (request.method !== "GET") {
        return json({ error: "method_not_allowed" }, 405, requestId);
      }
      await requireDashboardAdmin(request, env);
      return json(await getAdminConversations(requireDatabase(env), url), 200, requestId);
    }
    const adminConversationRoute = url.pathname.match(
      /^\/api\/admin\/conversations\/([^/]+)(?:\/(take-over))?$/u
    );
    if (adminConversationRoute) {
      let conversationId;
      try {
        conversationId = decodeURIComponent(adminConversationRoute[1]);
      } catch {
        throw new ServiceError("invalid_conversation_id", { status: 400 });
      }
      const action = adminConversationRoute[2] || null;
      if (!action) {
        if (request.method !== "GET") {
          return json({ error: "method_not_allowed" }, 405, requestId);
        }
        await requireDashboardAdmin(request, env);
        return json(
          await getAdminConversationDetail(requireDatabase(env), conversationId),
          200,
          requestId
        );
      }
      if (request.method !== "POST") {
        return json({ error: "method_not_allowed" }, 405, requestId);
      }
      const origin = request.headers.get("origin");
      if (!origin || !isAllowedWebsiteRequest(request, env)) {
        throw new ServiceError("origin_not_allowed", { status: 403 });
      }
      await requireAdminSessionAction(request, env);
      const body = await readJsonBody(request, 2048);
      if (!isPlainRecord(body) || Object.keys(body).length !== 0) {
        throw new ServiceError("invalid_request", { status: 400 });
      }
      const operationKey = request.headers.get("idempotency-key") || "";
      if (!IDEMPOTENCY_KEY_PATTERN.test(operationKey)) {
        throw new ServiceError("invalid_idempotency_key", { status: 400 });
      }
      const operation = await takeOverConversation(requireDatabase(env), {
        conversationId,
        operationKey: `dashboard:${operationKey}`,
        actor: { type: "dashboard", key: "admin_session" },
      });
      return json({
        operation: {
          action: operation.action,
          outcome: operation.outcome,
          duplicate: operation.duplicate,
        },
        ...(await getAdminConversationDetail(requireDatabase(env), conversationId)),
      }, 200, requestId);
    }
    if (url.pathname === "/api/content/campaigns" && request.method === "POST") {
      await requireAdminBearer(request, env);
      requireDatabase(env);
      const body = await readJsonBody(request, 8192);
      const validation = validateCreateCampaignInput(body);
      if (!validation.ok) {
        return json({ error: "invalid_request", issues: validation.issues }, 400, requestId);
      }
      return json(await createContentCampaign(env, validation.value), 201, requestId);
    }
    const imageRoute = url.pathname.match(
      /^\/api\/content\/campaigns\/([^/]+)\/generate-image$/u
    );
    if (imageRoute) {
      await requireAdminBearer(request, env);
      const campaignId = decodeURIComponent(imageRoute[1]);
      if (!CAMPAIGN_ID_PATTERN.test(campaignId)) {
        throw new ServiceError("invalid_campaign_id", { status: 400 });
      }
      if (request.method === "POST") {
        await requireNoRequestBody(request);
        return json(await generateCampaignMainImage(env, campaignId, requestId), 200, requestId);
      }
      return json({ error: "method_not_allowed" }, 405, requestId);
    }
    const contentRoute = url.pathname.match(/^\/api\/content\/campaigns\/([^/]+)(\/generate)?$/u);
    if (contentRoute) {
      await requireAdminBearer(request, env);
      const campaignId = decodeURIComponent(contentRoute[1]);
      if (!CAMPAIGN_ID_PATTERN.test(campaignId)) {
        throw new ServiceError("invalid_campaign_id", { status: 400 });
      }
      if (!contentRoute[2] && request.method === "GET") {
        return json(await getContentCampaign(env, campaignId), 200, requestId);
      }
      if (contentRoute[2] === "/generate" && request.method === "POST") {
        await requireNoRequestBody(request);
        return json(await generateContentCampaign(env, campaignId, requestId), 200, requestId);
      }
      return json({ error: "method_not_allowed" }, 405, requestId);
    }
    if (request.method === "GET" && url.pathname === "/api/health") {
      const readiness = await getReadiness(env);
      logEvent(readiness.ready ? "info" : "warn", "readiness_checked", {
        requestId,
        ready: readiness.ready,
      });
      return json(readiness, readiness.ready ? 200 : 503, requestId);
    }
    if (url.pathname === "/api/meta/webhook" && request.method === "GET") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");
      if (mode === "subscribe" && token && token === env.META_VERIFY_TOKEN && challenge) {
        return new Response(challenge, {
          status: 200,
          headers: { "x-request-id": requestId, "cache-control": "no-store" },
        });
      }
      return new Response("Forbidden", {
        status: 403,
        headers: { "x-request-id": requestId, "cache-control": "no-store" },
      });
    }
    if (url.pathname === "/api/meta/webhook" && request.method === "POST") {
      requireDatabase(env);
      if (!env.META_APP_SECRET || !env.META_INSTAGRAM_ACCESS_TOKEN) {
        throw new ServiceError("instagram_not_configured", { status: 503 });
      }
      const body = await readTextBody(request, 262_144);
      const validSignature = await verifyMetaSignature(
        body,
        request.headers.get("x-hub-signature-256"),
        env.META_APP_SECRET
      );
      if (!validSignature) throw new ServiceError("invalid_signature", { status: 401 });
      const payload = parseJson(body, null);
      if (!payload) throw new ServiceError("invalid_json", { status: 400 });
      const eventIds = await registerInstagramEvents(env, payload, requestId);
      ctx.waitUntil(processWebhookIds(env, eventIds, requestId));
      return json({ accepted: true, eventCount: eventIds.length }, 200, requestId);
    }
    if (url.pathname === "/api/sales/chat" && request.method === "POST") {
      requireDatabase(env);
      if (!isAllowedWebsiteRequest(request, env)) {
        throw new ServiceError("origin_not_allowed", { status: 403 });
      }
      const body = await readJsonBody(request, 8192);
      const validation = validateWebsiteChatInput(body);
      if (!validation.ok) {
        return json({ error: "invalid_request", issues: validation.issues }, 400, requestId);
      }
      const result = await handleSalesTurn(
        env,
        {
          ...validation.value,
          channel: "website",
          ipAddress:
            request.headers.get("cf-connecting-ip") ||
            (env.ENVIRONMENT !== "production"
              ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
              : null) ||
            "unknown",
          requestId,
        },
        ctx ? (promise) => ctx.waitUntil(promise) : undefined
      );
      if (result.error) return json({ error: result.error }, result.status, requestId);
      const payload = { ...result };
      delete payload.status;
      delete payload.suppressExternalReply;
      return json(payload, 200, requestId);
    }
    return json({ error: "not_found" }, 404, requestId);
  } catch (error) {
    return apiErrorResponse(error, requestId);
  }
}

const worker = {
  async fetch(request, env, ctx) {
    const requestId = createId("req");
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, ctx, url, requestId);
    }
    if (url.pathname === "/") return Response.redirect(new URL("/fa", url), 308);
    if (!env.ASSETS) return new Response("Not Found", { status: 404 });
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
    if (firstSegment !== "fa" && firstSegment !== "en" && firstSegment !== "admin" &&
        !url.pathname.includes(".")) {
      const localized = new URL(url);
      localized.pathname = "/fa" + url.pathname;
      return Response.redirect(localized, 308);
    }
    return response;
  },
  async scheduled(controller, env, ctx) {
    const requestId = createId("req");
    if (!env.DB) {
      logEvent("error", "scheduled_task_failed", {
        requestId,
        code: "database_not_configured",
      });
      return;
    }
    if (controller.cron === "*/5 * * * *") {
      ctx.waitUntil(processDueWebhookRetries(env, requestId));
      ctx.waitUntil(
        retryFailedTelegramNotifications(env, requestId).catch((error) =>
          logEvent("warn", "telegram_notification_retry_sweep_failed", {
            requestId,
            code: error?.code || "retry_error",
          })
        )
      );
      return;
    }
    ctx.waitUntil(runRetentionCleanup(env, requestId));
  },
};

export default worker;
