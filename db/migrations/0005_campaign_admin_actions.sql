ALTER TABLE content_campaigns ADD COLUMN rejection_reason TEXT;
-- statement-breakpoint
ALTER TABLE content_items ADD COLUMN provider TEXT;
-- statement-breakpoint
ALTER TABLE content_items ADD COLUMN model TEXT;
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS campaign_action_audit (
  id TEXT PRIMARY KEY,
  operation_key TEXT NOT NULL UNIQUE,
  campaign_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'regenerate')),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('dashboard', 'telegram')),
  actor_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'completed')),
  outcome TEXT CHECK (outcome IN ('succeeded', 'noop', 'failed')),
  reason TEXT,
  error_code TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (campaign_id) REFERENCES content_campaigns(id) ON DELETE RESTRICT
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS campaign_action_audit_campaign_idx
  ON campaign_action_audit(campaign_id, created_at DESC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS campaign_action_audit_status_idx
  ON campaign_action_audit(status, created_at);
