-- Leaders and Committee Members tables for About page and Admin management

CREATE TABLE IF NOT EXISTS leaders (
  key TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  photo TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS committee_members (
  id TEXT PRIMARY KEY NOT NULL,
  committee_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  photo TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_committee_members_slug ON committee_members (committee_slug);
