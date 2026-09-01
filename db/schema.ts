/**
 * D1 schema source of truth: db/migrations/*.sql.
 * These types mirror the latest migration for application/tooling use only.
 */
export const D1_SCHEMA_SOURCE = "db/migrations/*.sql" as const;

export type LeadRow = {
  id: string;
  source: "website" | "instagram";
  locale: "fa" | "en";
  instagram_user_id: string | null;
  status: string;
  project_type: string | null;
  tier: string | null;
  budget: string | null;
  requirements_json: string;
  created_at: string;
  updated_at: string;
  pii_expires_at: string | null;
  anonymized_at: string | null;
};

export type ConversationRow = {
  id: string;
  lead_id: string;
  channel: "website" | "instagram";
  status: "active" | "closed";
  created_at: string;
  updated_at: string;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  metadata_json: string;
  created_at: string;
  expires_at: string | null;
  external_event_id: string | null;
};

export type WebhookEventRow = {
  id: string;
  channel: "instagram";
  external_event_id: string;
  payload_json: string;
  status: "received" | "processing" | "processed" | "failed";
  attempt_count: number;
  request_id: string | null;
  created_at: string;
  updated_at: string | null;
  processing_started_at: string | null;
  processed_at: string | null;
  failed_at: string | null;
  next_retry_at: string | null;
  last_error: string | null;
  response_text: string | null;
  conversation_id: string | null;
  payload_expires_at: string | null;
  payload_purged_at: string | null;
  expires_at: string | null;
};

export type RateLimitCounterRow = {
  scope_key: string;
  window_start: number;
  window_seconds: number;
  count: number;
  updated_at: string;
  expires_at: string;
};

export type ContentCampaignRow = {
  id: string;
  topic: string;
  target_audience: string;
  goal: string;
  language: "fa";
  status: "draft" | "generating" | "generated" | "failed";
  approval_status: "pending" | "approved" | "rejected";
  approval_decided_at: string | null;
  rejection_reason: string | null;
  approval_telegram_user_id: string | null;
  approval_callback_id: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TelegramUpdateRow = {
  update_id: string;
  callback_id: string | null;
  callback_action: "approve" | "reject" | "regenerate" | "view" | null;
  campaign_id: string | null;
  status: "processing" | "processed" | "failed";
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  last_error: string | null;
};

export type TelegramNotificationRow = {
  event_key: string;
  notification_type: string;
  entity_id: string | null;
  status: "pending" | "sent" | "failed";
  attempt_count: number;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  last_error: string | null;
  message_text: string | null;
  keyboard_json: string | null;
  next_retry_at: string | null;
};

export type ContentItemRow = {
  id: string;
  campaign_id: string;
  content_type: "content_bundle";
  platform: "multi_platform";
  content_json: string;
  validation_status: "valid" | "invalid";
  provider: string | null;
  model: string | null;
  created_at: string;
  updated_at: string;
};

export type CampaignActionAuditRow = {
  id: string;
  operation_key: string;
  campaign_id: string;
  action: "approve" | "reject" | "regenerate";
  actor_type: "dashboard" | "telegram";
  actor_key: string;
  status: "processing" | "completed";
  outcome: "succeeded" | "noop" | "failed" | null;
  reason: string | null;
  error_code: string | null;
  created_at: string;
  completed_at: string | null;
};

export type ContentMediaRow = {
  id: string;
  campaign_id: string;
  media_type: "main_image";
  r2_key: string;
  mime_type: "image/jpeg" | "image/png" | "image/webp" | null;
  byte_size: number | null;
  status: "generating" | "stored" | "failed";
  provider: string;
  model: string;
  attempt_count: number;
  telegram_preview_status: "blocked" | "pending" | "sent" | "failed";
  created_at: string;
  updated_at: string;
  stored_at: string | null;
  last_error: string | null;
  superseded_at: string | null;
};

export type LeadRequirements = {
  businessName: string | null;
  businessActivity: string | null;
  goal: string | null;
  pagesAndFeatures: string | null;
  designStyle: string | null;
  contentStatus: string | null;
  languages: string | null;
  budgetToman: string | null;
  deadline: string | null;
  contactName: string | null;
  phone: string | null;
  preferredChannel: string | null;
};
