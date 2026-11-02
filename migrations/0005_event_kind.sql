-- Editable tag shown on event cards. '' = auto-detect from title/summary (legacy behaviour).
ALTER TABLE events ADD COLUMN kind TEXT NOT NULL DEFAULT ''
  CHECK (kind IN ('', 'workshop', 'series', 'competition', 'outreach', 'event'));