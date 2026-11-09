-- Per-event RSVP toggle + registrations. Runs after 0005_event_kind.sql.
ALTER TABLE events ADD COLUMN registration_enabled INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS event_registrations (
  id TEXT PRIMARY KEY NOT NULL,
  event_id TEXT NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,              -- stored lowercased
  student_number TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'going' CHECK (status IN ('going')),
  email_sent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (event_id, email)
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations (event_id);
