# tasks.md — CompSciety Website

Dependency-ordered task list generated from `SPEC.md`. Work top to bottom
within a phase; tasks in the same phase marked "parallel-safe" can be done
by different agents/people at once because they touch disjoint files.

Each open task maps to a GitHub issue (labels + milestones already applied).
Prefer working the issue; keep this file as the execution-order index.

Conventions:
- IDs are stable (`T001`, `T002`, ...). Do not renumber; append new tasks.
- Check items off (`[x]`) only when the matching SPEC validation criterion
  passes (or the linked issue is closed as done).
- "Files" lists the primary files touched, not every file.
- Issue links: https://github.com/compscietybulsu/website/issues/<n>

## Phase 0 — Agent scaffold

- [x] **T001** Add `AGENTS.md`, `CLAUDE.md`, `.kiro/steering/*`,
  `.cursor/rules/website.mdc`, `.agy/AGENTS.md`, `SPEC.md`, `tasks.md`,
  `docs/tickets.md`, updated `README.md`, `.env.example`,
  `server/.env.example`.
  Issue: [#5](https://github.com/compscietybulsu/website/issues/5)
  (milestone: Scaffolding). Files: repo root, `.kiro/`, `.cursor/`,
  `.agy/`, `docs/`.

## Phase 1 — MVP gaps (blocking a credible public launch)

Do these before any V1 work. T002–T004 were parallel-safe (disjoint files).

- [x] **T002** Create `/contact` page (or, if content isn't ready yet,
  remove the `/contact` links from Navbar/Footer as an interim fix).
  Issue: [#10](https://github.com/compscietybulsu/website/issues/10)
  (milestone: MVP). Interim fix landed: Navbar/Footer point at
  `#site-footer`; `ContactForm.jsx` exists. A dedicated `/contact` route
  remains optional follow-up if org wants a full page.
  Files: `components/Navbar.jsx`, `components/Footer.jsx`,
  `components/ContactForm.jsx`.

- [x] **T003** Add `.env.example` (root) and `server/.env.example` with
  every var name currently read via `process.env.*`, no real values.
  Issue: [#3](https://github.com/compscietybulsu/website/issues/3)
  (milestone: Scaffolding). Keep in sync when new env vars are added.
  Files: `.env.example`, `server/.env.example`.

- [x] **T004** Rewrite `README.md` for pnpm: install steps for root and
  `server/`, how to run both dev servers, links to `SPEC.md` and
  `AGENTS.md`.
  Issue: [#4](https://github.com/compscietybulsu/website/issues/4)
  (milestone: Scaffolding). Files: `README.md`.

- [ ] **T005** Commit `pnpm-lock.yaml` (root and `server/`), remove tracked
  `package-lock.json` and `server/package-lock.json`, add a root
  `pnpm-workspace.yaml` if root and `server/` should be one workspace
  (decide and document the choice in `AGENTS.md`/`SPEC.md`).
  Issue: [#7](https://github.com/compscietybulsu/website/issues/7)
  (milestone: Scaffolding). Related: [#21](https://github.com/compscietybulsu/website/issues/21)
  (workspace strategy, Future). pnpm locks exist; root `package-lock.json`
  is still tracked and must be removed.
  Files: `pnpm-lock.yaml`, `server/pnpm-lock.yaml`, `package-lock.json`
  (remove). Depends on: T004.

- [ ] **T006** Harden `AdminGuard` to treat expired/invalid tokens as
  logged-out: decode `exp` client-side (or catch a 401 from the first API
  call) and redirect + clear the stored token.
  Issue: [#16](https://github.com/compscietybulsu/website/issues/16)
  (milestone: MVP). Files: `components/admin/AdminGuard.jsx`, `lib/auth.js`.

- [ ] **T007** Fix the admin blog edit route so the dashboard's
  `/admin/blogs/:id/edit` links actually resolve. Either move
  `app/admin/blogs/new/[id]/edit/page.js` to `app/admin/blogs/[id]/edit/page.js`,
  or update the dashboard links to match the real path — pick one and make
  them consistent.
  Issue: [#17](https://github.com/compscietybulsu/website/issues/17)
  (milestone: MVP). Files: `app/admin/dashboard/page.js`,
  `app/admin/blogs/new/[id]/edit/page.js` (possibly moved).

## Phase 2 — V1 (trustworthiness and maintainability)

Do after Phase 1 is checked off. T008–T011 are parallel-safe.

- [x] **T008** Replace placeholder hero copy/imagery with real content.
  Issue: [#11](https://github.com/compscietybulsu/website/issues/11)
  (milestone: V1). Files: `components/Hero.jsx`.

- [x] **T009** Replace placeholder partner circles with real logos (static
  assets is fine for V1; backend-driven is Future work unless content owner
  wants it sooner).
  Issue: [#13](https://github.com/compscietybulsu/website/issues/13)
  (milestone: V1). Partners are now API-driven (`Partner` model +
  `/api/partners` + admin UI). Remaining work is org content in the DB,
  not placeholder UI.
  Files: `components/PartnersSection.jsx`, `server/models/Partner.js`,
  `server/routes/partners.js`, `app/admin/partners/`.

- [ ] **T010** Replace hardcoded officer/executive/adviser/committee data
  with real names/photos. Decide now whether this stays a static
  content file (fastest) or becomes admin-editable (bigger, push to
  Future unless explicitly requested).
  Issue: [#12](https://github.com/compscietybulsu/website/issues/12)
  (milestone: V1). Files: `components/about/*.jsx`, `lib/aboutContent.js`.
  Depends on: content from org.

- [ ] **T011** Add `Announcement` model + CRUD API (mirror the Blog CRUD
  pattern) and wire `AnnouncementCarousel.jsx` to it, replacing the
  hardcoded `CARDS` array.
  Issue: [#14](https://github.com/compscietybulsu/website/issues/14)
  (milestone: V1). Interim: carousel now fetches latest blogs (no
  hardcoded `CARDS`). Dedicated `Announcement` model + admin CRUD still
  open per `SPEC.md`.
  Files: `server/models/Announcement.js` (new),
  `server/routes/announcements.js` (new), `server/server.js`,
  `components/AnnouncementCarousel.jsx`. Soft-depends on: T005.

- [ ] **T012** Admin auth hardening: rate-limit `/api/auth/login`
  (e.g. `express-rate-limit`), review token lifetime (`7d` is long for a
  bearer token with no refresh/revoke), review error messages in
  `verifyAdmin`/`auth.js` for info leakage.
  Issue: [#15](https://github.com/compscietybulsu/website/issues/15)
  (milestone: V1). Files: `server/routes/auth.js`,
  `server/middleware/auth.js`, `server/server.js`.

- [ ] **T013** Move blog list pagination server-side
  (`GET /api/blogs?page=&limit=`) instead of fetching the full collection
  and paginating client-side.
  Issue: [#18](https://github.com/compscietybulsu/website/issues/18)
  (milestone: V1). Files: `server/routes/blogs.js`, `app/blog/page.js`,
  `app/admin/dashboard/page.js`.

- [x] **T014** Add CI smoke tests: a workflow that runs `pnpm build`
  (frontend) and a minimal backend route test (e.g. health check +
  blog list) on every PR.
  Issue: [#8](https://github.com/compscietybulsu/website/issues/8)
  (milestone: Scaffolding, closed). Frontend lint+build CI landed via
  PR #9; backend route smoke tests can be a follow-up if needed.
  Files: `.github/workflows/ci.yml`.

- [ ] **T015** Write deploy docs: required env vars per environment,
  `CLIENT_URL`/CORS configuration, MongoDB Atlas + Cloudinary setup steps.
  Issue: [#19](https://github.com/compscietybulsu/website/issues/19)
  (milestone: V1). Related: [#24](https://github.com/compscietybulsu/website/issues/24)
  (Cloudflare Workers / OpenNext). Files: `docs/deploy.md` (new),
  link from `README.md`. Depends on: T003.

- [ ] **T016** Replace the 404 page's placeholder illustration block with a
  real graphic.
  Issue: [#20](https://github.com/compscietybulsu/website/issues/20)
  (milestone: V1). Files: `app/not-found.js`.

## Phase 3 — Future (only after MVP + V1 are done, or on explicit request)

Not scheduled for active work while Phase 1 items remain open.

- [ ] **Workspace strategy** — [#21](https://github.com/compscietybulsu/website/issues/21)
  (milestone: Future). Related to T005.
- [ ] **Podman local Mongo** — [#22](https://github.com/compscietybulsu/website/issues/22)
  (milestone: Future).
- [ ] **Cloudflare Workers (OpenNext)** — [#24](https://github.com/compscietybulsu/website/issues/24)
  (milestone: Future).

Also see `docs/tickets.md` for full issue bodies and label sets.
