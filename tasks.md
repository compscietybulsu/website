# tasks.md — CompSciety Website

Dependency-ordered task list generated from `SPEC.md`. Work top to bottom
within a phase; tasks in the same phase marked "parallel-safe" can be done
by different agents/people at once because they touch disjoint files.

Conventions:
- IDs are stable (`T001`, `T002`, ...). Do not renumber; append new tasks.
- Check items off (`[x]`) only when the matching SPEC validation criterion
  passes.
- "Files" lists the primary files touched, not every file.

## Phase 0 — Agent scaffold (this PR)

- [x] **T001** Add `AGENTS.md`, `CLAUDE.md`, `.kiro/steering/*`,
  `.cursor/rules/website.mdc`, `.agy/AGENTS.md`, `SPEC.md`, `tasks.md`,
  `docs/tickets.md`, updated `README.md`, `.env.example`,
  `server/.env.example`.
  Files: repo root, `.kiro/`, `.cursor/`, `.agy/`, `docs/`.

## Phase 1 — MVP gaps (blocking a credible public launch)

Do these before any V1 work. T002–T004 are parallel-safe (disjoint files).

- [x] **T002** Contact 404 resolved via **unlink**: Nav/Footer "Contact"
  links now anchor to `#site-footer` (has a "Contact Us" block); no dead
  links remain. GitHub issue #10 closed. A standalone `/contact` route can
  return as content work.
  Files: `components/Navbar.jsx`, `components/Footer.jsx`.
  Depends on: none.

- [x] **T003** `.env.example` (root) and `server/.env.example` list every
  var name read via `process.env.*`, no real values. Re-verified 2026-08-13
  against `server/**`, `lib/**`, `app/**`, and `scripts/` — all 7 server vars
  plus `NEXT_PUBLIC_API_URL` are covered. Keep in sync as new env vars are
  added.
  Files: `.env.example`, `server/.env.example`.
  Depends on: none. *(Originally done as part of T001; verification landed
  with the codebase-centralize work.)*

- [x] **T004** `README.md` rewritten for pnpm + the Cloudflare stack
  (Workers/D1/R2), with a Workspace section and links to `SPEC.md` and
  `AGENTS.md`. No `npm` commands remain. GitHub issue #4 closed.
  Files: `README.md`.
  Depends on: none. *(Done as part of T001 + centralize work.)*

- [x] **T005** Lockfile cleanup: `pnpm-lock.yaml` committed at root and in
  `server/`; `package-lock.json` and `server/package-lock.json` removed from
  git; `.gitignore` keeps `**/package-lock.json` ignored. Decision recorded in
  `SPEC.md` §2 (single-package workspace; `server/` independent). Issue #7 and
  #21 closed.
  Files: `pnpm-lock.yaml`, `server/pnpm-lock.yaml`, `pnpm-workspace.yaml`,
  `SPEC.md`, `README.md`.
  Depends on: T004.

- [ ] **T006** Harden `AdminGuard` to treat expired/invalid tokens as
  logged-out: decode `exp` client-side (or catch a 401 from the first API
  call) and redirect + clear the stored token.
  Files: `components/admin/AdminGuard.jsx`, `lib/auth.js`.
  Depends on: none. **In-flight** — issue #16, branch
  `fix/frontend-issues` (worker B); SPEC §3.7 records the contract.

- [x] **T007** Fix the admin blog edit route so the dashboard's
  `/admin/blogs/:id/edit` links actually resolve. Resolved by moving the page
  to `app/admin/blogs/[id]/edit/page.js`; dashboard links and file path now
  agree. GitHub issue #17 closed.
  Files: `app/admin/blogs/[id]/edit/page.js`, `app/admin/dashboard/page.js`.
  Depends on: none.

## Phase 2 — V1 (trustworthiness and maintainability)

Do after Phase 1 is checked off. T008–T011 are parallel-safe.

- [x] **T008** Replace placeholder hero copy/imagery with real content. Hero
  copy is real ("This is the official Computer Science Society webpage.");
  imagery stays MatrixRain/GridFloor per the brand language. Issue #11 closed.
  Files: `components/Hero.jsx`.
  Depends on: content from org (non-code blocker — track in
  `docs/tickets.md`).

- [x] **T009** Replace placeholder partner circles with real logos.
  `PartnersSection.jsx` now fetches `GET /api/partners` (D1). Issue #13 closed.
  Files: `components/PartnersSection.jsx`, `app/api/partners/**`.
  Depends on: content from org.

- [ ] **T010** Replace hardcoded officer/executive/adviser/committee data
  with real names/photos. Decision recorded: static content file
  (`lib/aboutContent.js`) for V1; admin-editable is Future.
  Files: `components/about/*.jsx`, `lib/aboutContent.js`.
  Depends on: content from org. **In-flight** — issue #12, branch
  `feat/about-content` (worker D); SPEC §3.7 records the contract.

- [ ] **T011** Add `Announcement` model + CRUD API (mirror the Blog CRUD
  pattern) and wire `AnnouncementCarousel.jsx` to it, replacing the `/api/blogs`
  stand-in.
  Files: `app/api/announcements/**` (new), `migrations/**`, `lib/db.js`,
  `components/AnnouncementCarousel.jsx`, `app/admin/announcements/**`.
  Depends on: T005. **In-flight** — issue #14, branch
  `feat/announcements-pagination` (worker C); SPEC §3.7 records the contract.

- [x] **T012** Legacy-server auth hardening: `/api/auth/login` on the
  Express server is now rate-limited (`express-rate-limit`); Workers-API login
  returns a uniform "Invalid credentials" message. GitHub issue #15 closed.
  NOTE: the Worker API still uses a 7d `localStorage` JWT with no rate limit —
  that hardening remains tracked under SPEC §5 V1.
  Files: `server/routes/auth.js`, `server/middleware/auth.js`,
  `server/server.js`.
  Depends on: none.

- [ ] **T013** Move blog list pagination server-side
  (`GET /api/blogs?page=&limit=`) instead of fetching the full collection
  and paginating client-side.
  Files: `app/api/blogs/route.js`, `app/blog/page.js`,
  `app/admin/dashboard/page.js`.
  Depends on: none. **In-flight** — issue #18, branch
  `feat/announcements-pagination` (worker C); SPEC §3.7 records the contract.

- [x] **T014** CI smoke checks: `.github/workflows/ci.yml` runs `pnpm lint` +
  `pnpm build` (frontend) and `node --check server.js` (server) on every PR,
  installing with pnpm. GitHub issue #8 closed. API route tests are a
  follow-up (no test framework installed).
  Files: `.github/workflows/ci.yml`.
  Depends on: T005.

- [x] **T015** Deploy docs for the Workers + D1 + R2 stack: env vars per
  environment (`.env.local` / `.dev.vars` / Wrangler secrets), CORS and
  `CLIENT_URL` guidance, one-time R2/D1/seed steps. Linked from `README.md`.
  Issue #19 closed via this work (original Mongo/Cloudinary acceptance
  criteria are obsolete — superseded by the Workers migration).
  Files: `docs/deploy.md`, `README.md`.
  Depends on: T003.

- [ ] **T016** Replace the 404 page's placeholder illustration block with a
  real graphic.
  Files: `app/not-found.js`.
  Depends on: none. **In-flight** — issue #20, branch `fix/frontend-issues`
  (worker B).

## Phase 3 — Future (only after MVP + V1 are done, or on explicit request)

Not scheduled. See `SPEC.md` §5 "Future" and `docs/tickets.md` for backlog
entries. Do not start Future work while Phase 1 items are unchecked.
