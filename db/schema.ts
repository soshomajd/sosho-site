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
