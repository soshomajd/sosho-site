ALTER TABLE leads ADD COLUMN pii_expires_at TEXT;
-- statement-breakpoint
ALTER TABLE leads ADD COLUMN anonymized_at TEXT;
-- statement-breakpoint
ALTER TABLE messages ADD COLUMN expires_at TEXT;
-- statement-breakpoint
ALTER TABLE messages ADD COLUMN external_event_id TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN attempt_count INTEGER NOT NULL DEFAULT 0;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN request_id TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN updated_at TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN processing_started_at TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN processed_at TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN failed_at TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN next_retry_at TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN last_error TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN response_text TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN conversation_id TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN payload_expires_at TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN payload_purged_at TEXT;
-- statement-breakpoint
ALTER TABLE webhook_events ADD COLUMN expires_at TEXT;
-- statement-breakpoint
UPDATE webhook_events
SET updated_at = created_at,
    payload_expires_at = strftime('%Y-%m-%dT%H:%M:%fZ', created_at, '+7 days'),
    expires_at = strftime('%Y-%m-%dT%H:%M:%fZ', created_at, '+90 days')
WHERE updated_at IS NULL;
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS rate_limit_counters (
  scope_key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  window_seconds INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  PRIMARY KEY (scope_key, window_start, window_seconds)
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS messages_expires_idx ON messages(expires_at);
-- statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS messages_external_event_role_idx
  ON messages(external_event_id, role)
  WHERE external_event_id IS NOT NULL;
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS leads_pii_expires_idx ON leads(pii_expires_at, anonymized_at);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS webhook_events_retry_idx
  ON webhook_events(status, next_retry_at, updated_at);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS webhook_events_expires_idx ON webhook_events(expires_at);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS rate_limit_counters_expires_idx
  ON rate_limit_counters(expires_at);
