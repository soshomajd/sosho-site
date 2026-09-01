ALTER TABLE conversations ADD COLUMN handoff_state TEXT NOT NULL DEFAULT 'ai_active'
  CHECK (handoff_state IN ('ai_active', 'handoff_requested', 'human_active', 'resolved'));
-- statement-breakpoint
ALTER TABLE conversations ADD COLUMN handoff_requested_at TEXT;
-- statement-breakpoint
ALTER TABLE conversations ADD COLUMN human_owner_key TEXT;
-- statement-breakpoint
ALTER TABLE conversations ADD COLUMN human_taken_over_at TEXT;
-- statement-breakpoint
UPDATE conversations
SET handoff_state = 'handoff_requested',
    handoff_requested_at = updated_at
WHERE status = 'active'
  AND lead_id IN (SELECT id FROM leads WHERE status = 'handoff');
-- statement-breakpoint
CREATE TABLE IF NOT EXISTS conversation_action_audit (
  id TEXT PRIMARY KEY,
  operation_key TEXT NOT NULL UNIQUE,
  conversation_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('request_handoff', 'take_over')),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('sales_user', 'sales_service', 'dashboard')),
  actor_key TEXT NOT NULL,
  from_state TEXT NOT NULL
    CHECK (from_state IN ('ai_active', 'handoff_requested', 'human_active', 'resolved')),
  to_state TEXT NOT NULL
    CHECK (to_state IN ('ai_active', 'handoff_requested', 'human_active', 'resolved')),
  status TEXT NOT NULL DEFAULT 'processing'
    CHECK (status IN ('processing', 'completed')),
  outcome TEXT CHECK (outcome IN ('succeeded', 'noop', 'failed')),
  error_code TEXT,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS conversations_handoff_state_idx
  ON conversations(handoff_state, status, updated_at DESC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS conversation_action_audit_conversation_idx
  ON conversation_action_audit(conversation_id, created_at DESC);
-- statement-breakpoint
CREATE INDEX IF NOT EXISTS conversation_action_audit_status_idx
  ON conversation_action_audit(status, created_at);
