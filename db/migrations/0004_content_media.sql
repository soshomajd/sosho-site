CREATE TABLE IF NOT EXISTS content_media (
  id TEXT PRIMARY KEY,
  campaign_id TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('main_image')),
  r2_key TEXT NOT NULL UNIQUE,
  mime_type TEXT,
  byte_size INTEGER CHECK (byte_size IS NULL OR byte_size > 0),
  status TEXT NOT NULL DEFAULT 'generating'
    CHECK (status IN ('generating', 'stored', 'failed')),
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1 CHECK (attempt_count > 0),
  telegram_preview_status TEXT NOT NULL DEFAULT 'blocked'
    CHECK (telegram_preview_status IN ('blocked', 'pending', 'sent', 'failed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  stored_at TEXT,
  last_error TEXT,
  FOREIGN KEY (campaign_id) REFERENCES content_campaigns(id) ON DELETE CASCADE,
  UNIQUE (campaign_id, media_type)
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS content_media_campaign_idx
  ON content_media(campaign_id, status, updated_at DESC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS content_media_status_idx
  ON content_media(status, updated_at);
