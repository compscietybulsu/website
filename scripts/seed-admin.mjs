#!/usr/bin/env node
/**
 * Seed (or replace) a D1 admin user.
 *
 * Prefers ADMIN_USER / ADMIN_PASS from the environment, otherwise loads them
 * from gitignored `.dev.vars` in the repo root (never commit that file).
 *
 * Usage:
 *   pnpm run seed:admin          # remote D1
 *   pnpm run seed:admin:local    # local D1
 *
 * Requires wrangler auth. Does not print the password.
 */
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import bcrypt from "bcryptjs";

function loadDevVars() {
  const path = resolve(process.cwd(), ".dev.vars");
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const fileVars = loadDevVars();
const username = (process.env.ADMIN_USER || fileVars.ADMIN_USER || "")
  .trim()
  .toLowerCase();
const password = process.env.ADMIN_PASS || fileVars.ADMIN_PASS || "";
const local = process.argv.includes("--local");

if (!username || !password) {
  console.error(
    "Set ADMIN_USER and ADMIN_PASS in the environment or in gitignored .dev.vars"
  );
  process.exit(1);
}
if (password.length < 8) {
  console.error("ADMIN_PASS must be at least 8 characters.");
  process.exit(1);
}
if (bcrypt.truncates(password)) {
  console.error("ADMIN_PASS exceeds bcrypt's 72-byte limit.");
  process.exit(1);
}

const id = randomUUID();
const hash = bcrypt.hashSync(password, 10);
const esc = (s) => s.replace(/'/g, "''");

const sql = `
DELETE FROM admins WHERE username = '${esc(username)}' COLLATE NOCASE;
INSERT INTO admins (id, username, password_hash)
VALUES ('${esc(id)}', '${esc(username)}', '${esc(hash)}');
`;

const args = [
  "exec",
  "wrangler",
  "d1",
  "execute",
  "website-db",
  "--command",
  sql,
];
if (local) args.push("--local");
else args.push("--remote");

console.log(`Seeding admin "${username}" (${local ? "local" : "remote"} D1)...`);
execFileSync("pnpm", args, { stdio: "inherit" });
console.log("Done.");
