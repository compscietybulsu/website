# docs/tickets.md — Issue backlog

GitHub Issues are the tracker of record. This file keeps historical issue
bodies, labels, and `T0xx` cross-references. There is no `tasks.md`.

**Active P0** (see `AGENTS.md`): Cloudflare deploy · remote dev · backend prep.
Skills: `website-deploy-cf`, `website-remote-dev`, `website-backend-prep`.

Milestones: [Priority](https://github.com/compscietybulsu/website/milestone/5) ·
[Scaffolding](https://github.com/compscietybulsu/website/milestone/1) ·
[MVP](https://github.com/compscietybulsu/website/milestone/2) ·
[V1](https://github.com/compscietybulsu/website/milestone/3) ·
[Future](https://github.com/compscietybulsu/website/milestone/4).

P0 issues (milestone Priority):
- [#24](https://github.com/compscietybulsu/website/issues/24) Cloudflare Workers / OpenNext (+ Pages where static)
- [#26](https://github.com/compscietybulsu/website/issues/26) Remote / Codespaces Dev Containers
- [#27](https://github.com/compscietybulsu/website/issues/27) Backend prep for public frontend

Also: [#6](https://github.com/compscietybulsu/website/issues/6) Dual-agent skills (closed)

---
## 1. Agent scaffolding landed (meta)

**Issue:** [#5](https://github.com/compscietybulsu/website/issues/5)


**Labels:** `type:chore`, `area:agents`, `priority:p2`, `size:S`

**Body**

Problem: the repo had no `AGENTS.md`/`SPEC.md`/task tracking, so contributors
(human or AI) had no single source of truth for scope, contracts, or
guardrails.

Acceptance criteria:
- [x] `AGENTS.md`, `SPEC.md`, `docs/tickets.md` exist and are linked from
  `README.md` (`tasks.md` removed on purpose — GitHub Issues are the tracker)
- [x] `CLAUDE.md`, `.kiro/steering/*`, `.cursor/rules/website.mdc`,
  `.agy/AGENTS.md` all point back to `AGENTS.md`/`SPEC.md`
- [x] No SSH/GPG/git-profile personal tooling is documented in any
  committed file

SPEC refs: `SPEC.md` §1–§6 (whole file).

Suggested files: `AGENTS.md`, `SPEC.md`, `docs/tickets.md`.

---

## 2. Contact page missing — fix the 404 or unlink it

**Issue:** [#10](https://github.com/compscietybulsu/website/issues/10)


**Labels:** `type:fix`, `area:frontend`, `priority:p0`, `size:S`

**Body**

Problem: `Navbar` and `Footer` both link to `/contact`, but no route exists.
Every visitor who clicks "Contact" hits a 404.

Acceptance criteria:
- [ ] Either `/contact` exists and returns 200 with real contact info, or
  the nav/footer links are removed until content is ready
- [ ] No dead links remain in `components/Navbar.jsx` or
  `components/Footer.jsx`

SPEC refs: `SPEC.md` §3.6, §4, §5 MVP.

Suggested files: `app/contact/page.js` (new), `components/Navbar.jsx`,
`components/Footer.jsx`. Task: `T002`.

---

## 3. Hero copy is placeholder text

**Issue:** [#11](https://github.com/compscietybulsu/website/issues/11)


**Labels:** `type:content`, `area:frontend`, `priority:p1`, `size:S`

**Body**

Problem: the homepage hero says "This text box is solely for placeholder
description or information about stuff." This is the first thing every
visitor sees.

Acceptance criteria:
- [ ] Hero headline/subtext reflects real CompSciety messaging, approved by
  org leadership
- [ ] No literal "placeholder" language remains in `components/Hero.jsx`

SPEC refs: `SPEC.md` §4, §5 V1.

Suggested files: `components/Hero.jsx`. Task: `T008`.

---

## 4. Add `.env.example` files for frontend and backend

**Issue:** [#3](https://github.com/compscietybulsu/website/issues/3)


**Labels:** `type:docs`, `area:ops`, `priority:p0`, `size:S`

**Body**

Problem: no `.env.example` exists anywhere in the repo. New contributors
have to read source to discover which env vars are required, and there's no
guardrail against committing real secrets under a slightly different
filename.

Acceptance criteria:
- [ ] `.env.example` (root) lists every `NEXT_PUBLIC_*` var read in `lib/`
  and `app/`
- [ ] `server/.env.example` lists every var read in `server/**`
  (`process.env.*`)
- [ ] Both files contain variable names only — no real values, no secrets
- [ ] `README.md` references both files

SPEC refs: `SPEC.md` §5 MVP, §6 validation.

Suggested files: `.env.example` (new), `server/.env.example` (new). Task:
`T003`.

---

## 5. Lockfile and package-manager cleanup (pnpm only)

**Issue:** [#7](https://github.com/compscietybulsu/website/issues/7)


**Labels:** `type:chore`, `area:ops`, `priority:p0`, `size:S`

**Body**

Problem: the repo has tracked npm lockfiles (`package-lock.json`,
`server/package-lock.json`) plus an untracked `pnpm-lock.yaml`, while the
project has standardized on pnpm. This is a foot-gun: whichever lockfile a
contributor's tool picks up first wins, silently.

Acceptance criteria:
- [ ] `pnpm-lock.yaml` is committed at repo root and in `server/`
- [ ] `package-lock.json` and `server/package-lock.json` are removed from
  git
- [ ] `README.md` only documents pnpm commands
- [ ] CI (if present) installs with pnpm

SPEC refs: `SPEC.md` §4, §5 MVP, §6 validation.

Suggested files: `pnpm-lock.yaml`, `server/pnpm-lock.yaml`,
`package-lock.json` (remove), `server/package-lock.json` (remove),
`README.md`. Task: `T005`.

---

## 6. Officers/Executives/Advisers/Committees content is hardcoded

**Issue:** [#12](https://github.com/compscietybulsu/website/issues/12)


**Labels:** `type:content`, `area:frontend`, `priority:p1`, `size:M`

**Body**

Problem: `components/about/OfficersSection.jsx`,
`ExecutivesSection.jsx`, `AdvisersSection.jsx`, `CommitteesSection.jsx` all
contain hardcoded arrays with placeholder photo blocks and explicit
`// TODO` comments asking for real backend data.

Acceptance criteria:
- [ ] Real names and roles for current officers/executives/advisers/
  committees are in the codebase (static content file is acceptable for
  V1; admin-editable is Future scope unless re-prioritized)
- [ ] Real photos replace the placeholder circle/box divs
- [ ] Decision on "static file vs admin-editable" is recorded in `SPEC.md`

SPEC refs: `SPEC.md` §4, §5 V1.

Suggested files: `components/about/*.jsx`, `lib/aboutContent.js`. Task:
`T010`.

---

## 7. Partners section uses placeholder circles

**Issue:** [#13](https://github.com/compscietybulsu/website/issues/13)


**Labels:** `type:content`, `area:frontend`, `priority:p2`, `size:S`

**Body**

Problem: `components/PartnersSection.jsx` renders 4 gray circles instead of
real partner logos. Explicit `// TODO` in code.

Acceptance criteria:
- [ ] Real partner logos are rendered (static assets under `public/` is
  fine for V1)
- [ ] Section gracefully handles zero or fewer than 4 partners without
  leftover placeholder circles

SPEC refs: `SPEC.md` §4, §5 V1.

Suggested files: `components/PartnersSection.jsx`, `public/`. Task: `T009`.

---

## 8. Announcements are hardcoded — need a real API

**Issue:** [#14](https://github.com/compscietybulsu/website/issues/14)


**Labels:** `type:feat`, `area:backend`, `priority:p1`, `size:M`

**Body**

Problem: `components/AnnouncementCarousel.jsx` has a hardcoded `CARDS`
array with a `// TODO: replace with data fetched from the backend once the
API is live`. There is no `Announcement` model or route today.

Acceptance criteria:
- [ ] `Announcement` Mongoose model exists (title, description, and
  whatever fields the carousel needs)
- [ ] `GET/POST/PUT/DELETE /api/announcements` exist, mirroring the Blog CRUD
  auth pattern (`verifyAdmin` for writes, public reads)
- [ ] `AnnouncementCarousel.jsx` fetches from the API; the hardcoded `CARDS`
  array is deleted
- [ ] Admin has a way to create/edit/delete announcements (can reuse the
  blog admin UI pattern)

SPEC refs: `SPEC.md` §3.3 (pattern to mirror), §4, §5 V1, §6 validation.

Suggested files: `server/models/Announcement.js` (new),
`server/routes/announcements.js` (new), `server/server.js`,
`components/AnnouncementCarousel.jsx`, `app/admin/**` (new announcement admin
UI). Task: `T011`.

---

## 9. Admin auth hardening

**Issue:** [#15](https://github.com/compscietybulsu/website/issues/15)


**Labels:** `type:fix`, `area:backend`, `priority:p1`, `size:M`

**Body**

Problem: `/api/auth/login` has no rate limiting, tokens live for 7 days with
no refresh or revoke mechanism, and error responses haven't been audited
for information leakage (e.g. distinguishing "user not found" from "wrong
password" via timing or message wording).

Acceptance criteria:
- [ ] Login endpoint is rate-limited per IP (e.g. `express-rate-limit`)
- [ ] Token lifetime is reviewed and either shortened or paired with a
  refresh/revoke strategy — decision recorded in `SPEC.md`
- [ ] Error messages for login/verifyAdmin failures are reviewed for
  consistency and information leakage
- [ ] `JWT_SECRET` requirement is documented in `server/.env.example` with
  a comment noting it must be a long random value in production

SPEC refs: `SPEC.md` §3.2, §4, §5 V1.

Suggested files: `server/routes/auth.js`, `server/middleware/auth.js`,
`server/server.js`. Task: `T012`.

---

## 10. `AdminGuard` doesn't validate token expiry

**Issue:** [#16](https://github.com/compscietybulsu/website/issues/16)


**Labels:** `type:fix`, `area:frontend`, `priority:p0`, `size:S`

**Body**

Problem: `components/admin/AdminGuard.jsx` only checks that a token exists
in `localStorage`, not that it's still valid. An admin with an expired token
sees the dashboard shell render before any API call fails.

Acceptance criteria:
- [ ] Expired or malformed tokens are detected client-side (decode `exp`)
  or on first failed API call, and result in a redirect to `/admin` with
  the stale token cleared
- [ ] Manual test: set an expired/garbage value for the token key in
  `localStorage`, reload `/admin/dashboard`, confirm redirect

SPEC refs: `SPEC.md` §3.6, §4, §5 MVP, §6 validation.

Suggested files: `components/admin/AdminGuard.jsx`, `lib/auth.js`. Task:
`T006`.

---

## 11. Admin blog edit route path is inconsistent

**Issue:** [#17](https://github.com/compscietybulsu/website/issues/17)


**Labels:** `type:fix`, `area:frontend`, `priority:p0`, `size:S`

**Body**

Problem: `app/admin/dashboard/page.js` links to
`/admin/blogs/${blog._id}/edit`, but the actual page file lives at
`app/admin/blogs/new/[id]/edit/page.js` — i.e. under `/admin/blogs/new/:id/edit`.
Verify whether this currently 404s or just looks structurally wrong, and fix
either the file location or the link.

Acceptance criteria:
- [ ] Clicking "Edit" on a blog post from the dashboard opens a working,
  pre-filled edit form
- [ ] The route path and file path agree (pick one convention and document
  it if there's a reason for the current nesting)

SPEC refs: `SPEC.md` §3.6, §4, §5 MVP, §6 validation.

Suggested files: `app/admin/dashboard/page.js`,
`app/admin/blogs/new/[id]/edit/page.js` (possibly moved to
`app/admin/blogs/[id]/edit/page.js`). Task: `T007`.

---

## 12. Blog CRUD polish: server-side pagination + validation

**Issue:** [#18](https://github.com/compscietybulsu/website/issues/18)


**Labels:** `type:feat`, `area:backend`, `priority:p2`, `size:M`

**Body**

Problem: `GET /api/blogs` returns the entire collection; `app/blog/page.js`
and `app/admin/dashboard/page.js` paginate client-side over the full result.
This won't scale past a small number of posts, and it means every blog list
view downloads every post's full `content` field.

Acceptance criteria:
- [ ] `GET /api/blogs` accepts `page`/`limit` query params and returns a
  paginated shape (items + total count, or similar)
- [ ] List views (`app/blog/page.js`, `app/admin/dashboard/page.js`) request
  pages instead of slicing a full array client-side
- [ ] `POST`/`PUT` validate `title`/`content` length and trim, and reject
  clearly-invalid `fbLink`/`image` URL values

SPEC refs: `SPEC.md` §3.3, §5 V1.

Suggested files: `server/routes/blogs.js`, `app/blog/page.js`,
`app/admin/dashboard/page.js`. Task: `T013`.

---

## 13. README rewrite for pnpm + full-stack run instructions

**Issue:** [#4](https://github.com/compscietybulsu/website/issues/4)


**Labels:** `type:docs`, `area:ops`, `priority:p0`, `size:S`

**Body**

Problem: `README.md` only documents `npm install && npm run dev` for the
frontend. It says nothing about the `server/` backend, MongoDB, Cloudinary,
or env setup, and it's already out of date relative to the pnpm switch.

Acceptance criteria:
- [ ] README documents `pnpm install`/`pnpm dev` for the frontend
- [ ] README documents installing and running `server/` (pnpm, `.env`
  setup, MongoDB + Cloudinary prerequisites)
- [ ] README links to `SPEC.md` and `AGENTS.md`
- [ ] No `npm` commands remain

SPEC refs: `SPEC.md` §2, §4, §5 MVP.

Suggested files: `README.md`. Task: `T004`.

---

## 14. Add CI smoke tests

**Issue:** [#8](https://github.com/compscietybulsu/website/issues/8)


**Labels:** `type:chore`, `area:ops`, `priority:p1`, `size:M`

**Body**

Problem: there is no CI and no automated tests anywhere in the repo. A
broken build or a broken API route can land on `main` unnoticed.

Acceptance criteria:
- [ ] A CI workflow runs on every PR against `main`
- [ ] Frontend job runs `pnpm build` and fails the check on error
- [ ] Backend job runs at least a health-check + blog-list smoke test
  against a test MongoDB instance (or an in-memory/mocked equivalent)
- [ ] CI installs dependencies with pnpm, matching the repo standard

SPEC refs: `SPEC.md` §5 V1, §6 validation.

Suggested files: `.github/workflows/ci.yml` (new), `server/` test setup
(new, e.g. a `tests/` folder + a test runner script in `server/package.json`).
Task: `T014`.

---

## 15. Deploy docs (env vars, CORS, MongoDB Atlas, Cloudinary)

**Issue:** [#19](https://github.com/compscietybulsu/website/issues/19)


**Labels:** `type:docs`, `area:ops`, `priority:p1`, `size:S`

**Body**

Problem: there is no documentation for deploying either app. Whoever
deploys next has to reverse-engineer required env vars and CORS config from
source.

Acceptance criteria:
- [ ] `docs/deploy.md` documents every env var per environment (dev/prod)
- [ ] Explains `CLIENT_URL`/CORS config and why `*` is dev-only
  (`server/server.js`)
- [ ] Walks through MongoDB Atlas connection string setup and Cloudinary
  credential setup
- [ ] Linked from `README.md`

SPEC refs: `SPEC.md` §4 (CORS gap), §5 V1.

Suggested files: `docs/deploy.md` (new), `README.md`. Task: `T015`.

---

## 16. Replace 404 page placeholder illustration

**Issue:** [#20](https://github.com/compscietybulsu/website/issues/20)


**Labels:** `type:content`, `area:frontend`, `priority:p2`, `size:S`

**Body**

Problem: `app/not-found.js` has a `// TODO: swap for a real illustration`
gray box instead of real art.

Acceptance criteria:
- [ ] Placeholder div is replaced with a real image/illustration
- [ ] Image is optimized (Next.js `Image` component or equivalent)

SPEC refs: `SPEC.md` §4, §5 V1.

Suggested files: `app/not-found.js`. Task: `T016`.

---

## 17. Decide root/server pnpm workspace strategy

**Issue:** [#21](https://github.com/compscietybulsu/website/issues/21)


**Labels:** `type:chore`, `area:ops`, `priority:p2`, `size:S`

**Body**

Problem: root and `server/` are currently two independent Node projects with
separate lockfiles and no documented relationship. Before or alongside the
lockfile cleanup (ticket 5), decide whether this becomes a single pnpm
workspace (`pnpm-workspace.yaml`) or stays two independent installs, and
document the choice.

Acceptance criteria:
- [ ] Decision recorded in `SPEC.md` §2 (Architecture and stack)
- [ ] If workspace: `pnpm-workspace.yaml` added, install/run docs updated in
  `README.md`
- [ ] If independent: `README.md` is explicit that root and `server/` need
  separate `pnpm install` runs

SPEC refs: `SPEC.md` §2, §5 MVP.

Suggested files: `pnpm-workspace.yaml` (maybe new), `README.md`, `SPEC.md`.
Task: related to `T005`.

---

## 18. Podman-based local dev environment (optional, future)

**Issue:** [#22](https://github.com/compscietybulsu/website/issues/22)


**Labels:** `type:chore`, `area:ops`, `priority:p2`, `size:M`

**Body**

Problem: local dev currently requires a manually provisioned MongoDB
instance and manually managed env vars. A Podman-based compose setup would
let contributors spin up MongoDB (and optionally both apps) with one
command. Containers, if introduced, must use Podman per team convention —
not Docker.

Acceptance criteria:
- [ ] A `podman-compose` (or Podman-compatible) config brings up MongoDB
  locally for dev
- [ ] Documented in `README.md` as an optional path, alongside the existing
  "bring your own MongoDB" instructions
- [ ] No Docker-specific tooling is introduced instead of Podman

SPEC refs: `SPEC.md` §2 (Podman note), §5 Future.

Suggested files: `docs/deploy.md` or a new `docs/local-dev.md`,
`podman-compose.yml` (new, if pursued).
