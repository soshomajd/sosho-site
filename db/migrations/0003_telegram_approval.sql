ALTER TABLE content_campaigns ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending'
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));
-- statement-breakpoint
ALTER TABLE content_campaigns ADD COLUMN approval_decided_at TEXT;
-- statement-breakpoint
ALTER TABLE content_campaigns ADD COLUMN approval_telegram_user_id TEXT;
-- statement-breakpoint
ALTER TABLE content_campaigns ADD COLUMN approval_callback_id TEXT;
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS telegram_updates (
  update_id TEXT PRIMARY KEY,
  callback_id TEXT UNIQUE,
  callback_action TEXT,
  campaign_id TEXT,
  status TEXT NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'processed', 'failed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  processed_at TEXT,
  last_error TEXT,
  FOREIGN KEY (campaign_id) REFERENCES content_campaigns(id) ON DELETE SET NULL
);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS telegram_notifications (
  event_key TEXT PRIMARY KEY,
  notification_type TEXT NOT NULL,
  entity_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sent', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sent_at TEXT,
  last_error TEXT
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS content_campaigns_approval_idx
  ON content_campaigns(approval_status, updated_at DESC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS telegram_updates_callback_idx
  ON telegram_updates(callback_id);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS telegram_updates_status_idx
  ON telegram_updates(status, updated_at);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS telegram_notifications_status_idx
  ON telegram_notifications(status, updated_at);

