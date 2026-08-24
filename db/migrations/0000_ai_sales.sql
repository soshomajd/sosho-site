CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'fa',
  instagram_user_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'discovery',
  project_type TEXT,
  tier TEXT,
  budget TEXT,
  requirements_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  channel TEXT NOT NULL,
  external_event_id TEXT UNIQUE,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TEXT NOT NULL
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS conversations_lead_idx ON conversations(lead_id, updated_at DESC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages(conversation_id, created_at ASC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status, updated_at DESC);
