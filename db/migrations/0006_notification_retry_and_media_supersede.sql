ALTER TABLE telegram_notifications ADD COLUMN message_text TEXT;
-- statement-breakpoint
ALTER TABLE telegram_notifications ADD COLUMN keyboard_json TEXT;
-- statement-breakpoint
ALTER TABLE telegram_notifications ADD COLUMN next_retry_at TEXT;
-- statement-breakpoint
ALTER TABLE content_media ADD COLUMN superseded_at TEXT;
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS telegram_notifications_retry_idx
  ON telegram_notifications(status, next_retry_at);
