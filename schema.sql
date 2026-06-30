-- D1 (SQLite) schema for templates project
-- Apply with:
--   wrangler d1 execute templates-db --file=schema.sql          (local)
--   wrangler d1 execute templates-db --file=schema.sql --remote (production)

CREATE TABLE IF NOT EXISTS contacts (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  company     TEXT NOT NULL,
  country     TEXT NOT NULL,
  service_required TEXT NOT NULL,
  message     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  email_enabled INTEGER NOT NULL DEFAULT 1,
  CHECK (id = 1)
);

-- Seed default settings row (ignored if already exists)
INSERT OR IGNORE INTO settings (id, email_enabled) VALUES (1, 1);
