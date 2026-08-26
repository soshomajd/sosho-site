CREATE TABLE IF NOT EXISTS content_campaigns (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  goal TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language = 'fa'),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'generating', 'generated', 'failed')),
  scheduled_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  content_json TEXT NOT NULL,
  validation_status TEXT NOT NULL CHECK (validation_status IN ('valid', 'invalid')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (campaign_id) REFERENCES content_campaigns(id) ON DELETE CASCADE
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS content_campaigns_status_idx
  ON content_campaigns(status, scheduled_at, updated_at DESC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS content_items_campaign_idx
  ON content_items(campaign_id, created_at DESC);

