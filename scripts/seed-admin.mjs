#!/usr/bin/env node
/**
 * Seed (or replace) a D1 admin user.
 *
 * Usage:
 *   ADMIN_USER=admin ADMIN_PASS='...' pnpm run seed:admin
 *   ADMIN_USER=admin ADMIN_PASS='...' pnpm run seed:admin:local   # local D1
 *
 * Requires wrangler auth. Does not print the password.
 */
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

const username = (process.env.ADMIN_USER || "").trim().toLowerCase();
const password = process.env.ADMIN_PASS || "";
const local = process.argv.includes("--local");

if (!username || !password) {
  console.error("Set ADMIN_USER and ADMIN_PASS environment variables.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("ADMIN_PASS must be at least 8 characters.");
  process.exit(1);
}

const id = randomUUID();
const hash = bcrypt.hashSync(password, 10);
// Escape single quotes for SQL string literals
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
