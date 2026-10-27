-- Project consultant ("برآورد هوشمند پروژه"): admin-managed tariffs and the estimate requests.
-- Tariffs are versioned rows; the newest row is the active one. No price lives in code.
CREATE TABLE IF NOT EXISTS pricing_tariffs (
  version INTEGER PRIMARY KEY AUTOINCREMENT,
  config_json TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS consultant_requests (
  id TEXT PRIMARY KEY,
  public_ref TEXT NOT NULL UNIQUE,
  client_request_id TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL CHECK (locale IN ('fa', 'en')),
  status TEXT NOT NULL DEFAULT 'estimated'
    CHECK (status IN ('estimated', 'tier_selected', 'contact_submitted', 'in_review', 'contacted', 'won', 'lost', 'archived')),
  answers_json TEXT NOT NULL,
  scope_json TEXT NOT NULL,
  estimate_json TEXT NOT NULL,
  tariff_version INTEGER,
  ai_summary TEXT,
  ai_source TEXT NOT NULL DEFAULT 'fallback' CHECK (ai_source IN ('model', 'fallback')),
  selected_tier TEXT CHECK (selected_tier IS NULL OR selected_tier IN ('economic', 'professional')),
  contact_name TEXT,
  contact_value TEXT,
  contact_notes TEXT,
  contact_consent_at TEXT,
  processing_consent_at TEXT NOT NULL,
  update_token_hash TEXT NOT NULL,
  update_seq INTEGER NOT NULL DEFAULT 0,
  telegram_state TEXT NOT NULL DEFAULT 'queued'
    CHECK (telegram_state IN ('awaiting_config', 'queued', 'sent', 'failed')),
  telegram_reported_seq INTEGER NOT NULL DEFAULT -1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  pii_expires_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS consultant_requests_status_idx
  ON consultant_requests(status, created_at DESC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS consultant_requests_telegram_idx
  ON consultant_requests(telegram_state, updated_at);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS consultant_requests_expires_idx
  ON consultant_requests(expires_at);
