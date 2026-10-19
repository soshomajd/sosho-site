CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('fa', 'en')),
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  read_at TEXT,
  replied_at TEXT,
  expires_at TEXT NOT NULL
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS contact_messages_status_idx
  ON contact_messages(status, created_at DESC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS contact_messages_expires_idx
  ON contact_messages(expires_at);
