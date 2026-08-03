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

- [ ] **T002** Create `/contact` page (or, if content isn't ready yet,
  remove the `/contact` links from Navbar/Footer as an interim fix).
  Files: `app/contact/page.js` (new), `components/Navbar.jsx`,
  `components/Footer.jsx`.
  Depends on: none.

- [ ] **T003** Add `.env.example` (root) and `server/.env.example` with
  every var name currently read via `process.env.*`, no real values.
  Files: `.env.example`, `server/.env.example`.
  Depends on: none. *(Done as part of T001 in this PR — verify it stays in
  sync as new env vars are added.)*

- [ ] **T004** Rewrite `README.md` for pnpm: install steps for root and
  `server/`, how to run both dev servers, links to `SPEC.md` and
  `AGENTS.md`.
  Files: `README.md`.
  Depends on: none. *(Done as part of T001 in this PR.)*

- [ ] **T005** Commit `pnpm-lock.yaml` (root and `server/`), remove tracked
  `package-lock.json` and `server/package-lock.json`, add a root
  `pnpm-workspace.yaml` if root and `server/` should be one workspace
  (decide and document the choice in `AGENTS.md`/`SPEC.md`).
  Files: `pnpm-lock.yaml`, `server/pnpm-lock.yaml`, remove
  `package-lock.json`, `server/package-lock.json`.
  Depends on: T004 (README should already say pnpm before lockfile switch
  lands, to avoid a window of contradictory docs).

- [ ] **T006** Harden `AdminGuard` to treat expired/invalid tokens as
  logged-out: decode `exp` client-side (or catch a 401 from the first API
  call) and redirect + clear the stored token.
  Files: `components/admin/AdminGuard.jsx`, `lib/auth.js`.
  Depends on: none.

- [ ] **T007** Fix the admin blog edit route so the dashboard's
  `/admin/blogs/:id/edit` links actually resolve. Either move
  `app/admin/blogs/new/[id]/edit/page.js` to `app/admin/blogs/[id]/edit/page.js`,
  or update the dashboard links to match the real path — pick one and make
  them consistent.
  Files: `app/admin/dashboard/page.js`,
  `app/admin/blogs/new/[id]/edit/page.js` (possibly moved).
  Depends on: none.

## Phase 2 — V1 (trustworthiness and maintainability)

Do after Phase 1 is checked off. T008–T011 are parallel-safe.

- [ ] **T008** Replace placeholder hero copy/imagery with real content.
  Files: `components/Hero.jsx`.
  Depends on: content from org (non-code blocker — track in
  `docs/tickets.md`).

- [ ] **T009** Replace placeholder partner circles with real logos (static
  assets is fine for V1; backend-driven is Future work unless content owner
  wants it sooner).
  Files: `components/PartnersSection.jsx`, `public/`.
  Depends on: content from org.

- [ ] **T010** Replace hardcoded officer/executive/adviser/committee data
  with real names/photos. Decide now whether this stays a static
  content file (fastest) or becomes admin-editable (bigger, push to
  Future unless explicitly requested).
  Files: `components/about/*.jsx`, `lib/aboutContent.js`.
  Depends on: content from org.

- [ ] **T011** Add `Announcement` model + CRUD API (mirror the Blog CRUD
  pattern) and wire `AnnouncementCarousel.jsx` to it, replacing the
  hardcoded `CARDS` array.
  Files: `server/models/Announcement.js` (new),
  `server/routes/announcements.js` (new), `server/server.js`,
  `components/AnnouncementCarousel.jsx`, `lib/api.js` (if a helper is
  added).
  Depends on: T005 (avoid adding new backend surface area on top of an
  unresolved lockfile split) — soft dependency, can be reordered if needed.

- [ ] **T012** Admin auth hardening: rate-limit `/api/auth/login`
  (e.g. `express-rate-limit`), review token lifetime (`7d` is long for a
  bearer token with no refresh/revoke), review error messages in
  `verifyAdmin`/`auth.js` for info leakage.
  Files: `server/routes/auth.js`, `server/middleware/auth.js`,
  `server/server.js`.
  Depends on: none.

- [ ] **T013** Move blog list pagination server-side
  (`GET /api/blogs?page=&limit=`) instead of fetching the full collection
  and paginating client-side.
  Files: `server/routes/blogs.js`, `app/blog/page.js`,
  `app/admin/dashboard/page.js`.
  Depends on: none.

- [ ] **T014** Add CI smoke tests: a workflow that runs `pnpm build`
  (frontend) and a minimal backend route test (e.g. health check +
  blog list) on every PR.
  Files: `.github/workflows/ci.yml` (new), `server/` test setup (new).
  Depends on: T005 (CI should install with the same package manager the
  repo has standardized on).

- [ ] **T015** Write deploy docs: required env vars per environment,
  `CLIENT_URL`/CORS configuration, MongoDB Atlas + Cloudinary setup steps.
  Files: `docs/deploy.md` (new), link from `README.md`.
  Depends on: T003.

- [ ] **T016** Replace the 404 page's placeholder illustration block with a
  real graphic.
  Files: `app/not-found.js`.
  Depends on: none.

## Phase 3 — Future (only after MVP + V1 are done, or on explicit request)

Not scheduled. See `SPEC.md` §5 "Future" and `docs/tickets.md` for backlog
entries. Do not start Future work while Phase 1 items are unchecked.
