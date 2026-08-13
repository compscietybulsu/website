# SPEC.md — CompSciety Website

This is the single source of truth for what this project does and does not do.
Update this file first when scope changes. Code must match this file.

## 1. Overview and core goal

CompSciety is the public website for the Computer Science Society (CompSciety,
BulSU). It has two jobs:

1. Show the org to the public: home, about, blog, contact.
2. Let an admin publish and manage blog posts without touching code.

Users: prospective/current members, site visitors (read-only), and one or
more admins (content editors) who log in to `/admin`.

Non-goals (for now): public member accounts, comments, payments, multi-role
admin permissions.

## 2. Architecture and stack

One Cloudflare Worker hosts the site and API (OpenNext).

**App** — `/` (repo root)
- Next.js 16 (App Router), React 19, Tailwind CSS v4
- Package manager: **pnpm**
- Client-side data fetching via `lib/api.js` (same-origin `/api` by default;
  optional `NEXT_PUBLIC_API_URL` override for legacy Express)
- Admin session token in `localStorage` via `lib/auth.js`
- Deploy: Cloudflare Workers (`wrangler.jsonc`, name `website`)

**API + storage** — `app/api/*` on the same Worker
- **D1** (`website-db`): admins, blogs, partners (`migrations/`)
- **R2** (`website-media`): images; public read via `GET /api/media/...`
- Auth: `jose` JWT + `bcryptjs`; secret `JWT_SECRET` (Wrangler secret / `.dev.vars`)
- Seed admin: `pnpm run seed:admin` / `seed:admin:local`

**Workspace** — root is a **single-package pnpm workspace**
(`pnpm-workspace.yaml`, `packages: ["."]`). This is required because
Cloudflare Workers Builds (pnpm 10.11.x) rejects a workspace manifest with no
`packages` field. `server/` is deliberately **not** in the workspace: it is
legacy, so it installs and runs independently (`pnpm --dir server install`,
its own `server/pnpm-lock.yaml`). Do not add `server/` to the workspace unless
we adopt a real monorepo (decision recorded per issue #21).

**Legacy** — `/server` Express + Mongo + Cloudinary is not production hosting.
Keep only for reference or one-off data export.

**Containers** — if/when containerized, use **Podman**, not Docker. No
container tooling is built into this repo yet; a Podman-based local dev
environment is Future scope (issue #22, §5).

## 3. API and data contracts

Base path: `/api` on the Worker (Next route handlers). See `app/api/`.

### 3.1 Health

`GET /api/health` → `{ "ok": true, "storage": "d1" }`. No auth.

### 3.2 Auth — `app/api/auth/login`

`POST /api/auth/login`
- Body: `{ "username": string, "password": string }`
- 400 if either field missing
- 401 if admin not found or password mismatch
- 200: `{ "token": string, "username": string }` — JWT HS256 with
  `JWT_SECRET`, expires in 7d, payload `{ id, username }`

No register/refresh/logout. Admins via `scripts/seed-admin.mjs`. Logout is
client-only (`localStorage`).

### 3.3 Blogs — `app/api/blogs`

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/` | none | — | `200` array of Blog, newest first |
| GET | `/:id` | none | — | `200` Blog, `404` if not found |
| POST | `/` | Bearer JWT | `{ title, content, image?, fbLink? }` | `201` Blog |
| PUT | `/:id` | Bearer JWT | same | `200` Blog, `404` |
| DELETE | `/:id` | Bearer JWT | — | `200 { message }`, `404` |

### 3.4 Uploads — `app/api/uploads` + R2

`POST /api/uploads` — Bearer JWT. Multipart field `file` (image/*). Stores in
R2; returns `{ url: "/api/media/...", key }`. Frontend: `lib/media.js`.

`GET /api/media/[...key]` — public stream from R2.

### 3.5 Data models

**Blog** (D1 `blogs`; JSON uses Mongo-compatible `_id`)
```js
{
  _id: String,     // UUID
  title: String,   // required, trimmed
  content: String, // required
  image: String,   // default "" — usually /api/media/...
  fbLink: String,  // default ""
  createdAt, updatedAt
}
```

**Admin** (`server/models/Admin.js`)
```js
{
  username: String,     // required, unique, lowercase, trimmed
  passwordHash: String,  // required — bcrypt hash
}
```

**Partner** (D1 `partners`)
```js
{
  _id: String,
  name: String,
  detail: String,
  image: String,   // usually /api/media/...
  createdAt, updatedAt
}
```

**Partner endpoints** (`app/api/partners`, D1 `partners`)

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/api/partners` | none | — | `200` array of Partner |
| GET | `/api/partners/:id` | none | — | `200` Partner, `404` |
| POST | `/api/partners` | Bearer JWT | `{ name, detail?, image? }` | `201` Partner |
| PUT | `/api/partners/:id` | Bearer JWT | same | `200` Partner, `404` |
| DELETE | `/api/partners/:id` | Bearer JWT | — | `200 { message }`, `404` |

**Admin** (D1 `admins`): `{ id, username, password_hash }` — not exposed in
list APIs. No public member model. Officers are still hardcoded in frontend
components; announcements reuse the blogs API as a stand-in (see §4).

### 3.6 Frontend routes

| Route | File | Status |
|---|---|---|
| `/` | `app/page.js` | Live — Hero, Announcements, Partners, About, Footer |
| `/about` | `app/about/page.js` | Live — Intro, Mission/Vision, Advisers, Officers, Executives, Committees |
| `/blog` | `app/blog/page.js` | Live — paginated list from `GET /api/blogs` |
| `/blog/:id` | `app/blog/[id]/page.js` | Live — single post from `GET /api/blogs/:id` |
| `/contact` | — | **No standalone page.** Nav/Footer "Contact" links anchor to `#site-footer`, which has a "Contact Us" block — no 404. Issue #10 closed via unlink. |
| `/admin` | `app/admin/page.js` | Live — login form, posts to `/api/auth/login` |
| `/admin/dashboard` | `app/admin/dashboard/page.js` | Live — list/delete blogs, behind `AdminGuard` |
| `/admin/blogs/new` | `app/admin/blogs/new/page.js` | Live — create blog form |
| `/admin/blogs/[id]/edit` | `app/admin/blogs/[id]/edit/page.js` | Live — edit blog form; dashboard "Edit" links point here (paths agree — issue #17 closed) |
| `/admin/partners` | `app/admin/partners/page.js` | Live — list partners |
| `/admin/partners/new` | `app/admin/partners/new/page.js` | Live — create partner |
| `/admin/partners/[id]/edit` | `app/admin/partners/[id]/edit/page.js` | Live — edit partner |

`AdminGuard` (`components/admin/AdminGuard.jsx`) is a client-side redirect
only — it checks `localStorage` for a token and redirects to `/admin` if
absent. It does not verify the token is valid or unexpired; an expired token
still passes the guard until the API rejects a request.

### 3.7 In-flight contracts (not on main)

Forward-looking contract notes for work merged **after** this SPEC version.
Do not treat these as shipped until the code lands on `main`; nothing here is
checked off in §5. Cross-referenced to worker branches:

- **Announcements** (issue #14, branch `feat/announcements-pagination`): a D1
  `announcements` table (JSON uses Mongo-compatible `_id`) with
  `{ _id, title, content, image, createdAt, updatedAt }`, plus CRUD at
  `/api/announcements` mirroring the Blog pattern (§3.3) and an
  `/admin/announcements` admin UI. `AnnouncementCarousel.jsx` is intended to
  fetch `/api/announcements` instead of `/api/blogs`.
- **Paginated `GET /api/blogs`** (issue #18, same branch): response shape
  changes from a bare array to `{ items, total, page, limit, totalPages }`,
  with `page` (default 1) and `limit` (default 10, max 100) query params. Any
  client that consumes `/api/blogs` must handle the new shape.
- **AdminGuard expiry check** (issue #16, branch `fix/frontend-issues`):
  `lib/auth.js` is intended to decode JWT `exp` client-side (jose `decodeJwt`)
  and treat expired/malformed tokens as logged out, clearing the stored token.
- **About content** (issue #12, branch `feat/about-content`): officer /
  executive / adviser / committee data moves into `lib/aboutContent.js` as a
  static content file for V1 (admin-editable stays Future).

Also see `docs/tickets.md` for the open/closed issue map.

## 4. Known gaps (honest, current state)

These are real gaps in the shipped product, not proposals:

- **Officers/Executives/Advisers/Committees are hardcoded arrays** with no
  photos (`components/about/*.jsx`) — explicit `// TODO` comments in code
  say "replace with real ... from the backend."
- **Announcements have no dedicated model/endpoint.** The carousel
  (`components/AnnouncementCarousel.jsx`) fetches `/api/blogs` as a stand-in,
  so home-page announcements are really blog titles. (Dedicated
  `/api/announcements` is in-flight — see §3.7.)
- **404 page has a placeholder illustration block** (`app/not-found.js`).
- **`AdminGuard` does not validate token expiry**, only presence.
- **No automated tests.** CI (`.github/workflows/ci.yml`) runs `pnpm lint`,
  `pnpm build`, and a server `node --check` on every PR, but there are no API
  route tests yet.
- **R2 must be enabled** once in the Cloudflare dashboard before
  `website-media` can be created / production deploy binds MEDIA.
- **Legacy `server/`** still in-tree; do not treat it as the production API.

## 5. Feature checklist

### MVP (must-have — required for a credible public launch)

- [x] Public home page with nav, hero, announcements, partners, about teaser, footer
- [x] Public about page (mission/vision, advisers, officers, executives, committees)
- [x] Public blog list + single post pages backed by the real API
- [x] Admin login (JWT)
- [x] Admin blog CRUD (create, edit, delete) with R2 image upload
- [x] Health check endpoint for uptime monitoring
- [x] Cloudflare full-stack host (Workers + D1 + R2; same-origin `/api`)
- [x] Contact page or unlinked nav/footer — chose **unlink**: "Contact" links
  anchor to `#site-footer` (no 404). Issue #10 closed.
- [x] `.env.example` / `.dev.vars.example` documenting required vars
- [x] README accurate for pnpm + Cloudflare deploy
- [x] Single lockfile strategy: commit `pnpm-lock.yaml`, remove tracked npm lockfiles (issue #7 closed)
- [ ] `AdminGuard` treats an expired/invalid token as logged-out, not just an
  absent one *(in-flight — branch `fix/frontend-issues`, issue #16, see §3.7)*
- [x] Admin dashboard edit links resolve to a real, working edit route
  (route moved to `app/admin/blogs/[id]/edit/page.js` — issue #17 closed)

### V1 (should-have — makes the site trustworthy and maintainable)

- [x] Real hero copy replacing the placeholder text (issue #11); hero imagery
  stays MatrixRain/GridFloor per the brand language
- [x] Real partner logos wired through the backend (`PartnersSection` fetches
  `GET /api/partners` from D1 — issue #13 closed)
- [ ] Real officer/executive/adviser/committee data and photos, ideally
  admin-editable *(in-flight — branch `feat/about-content`, issue #12; static
  content file chosen for V1, see §3.7)*
- [ ] Announcements backed by an API (`Announcement` model + CRUD), replacing
  the `/api/blogs` stand-in carousel *(in-flight — branch
  `feat/announcements-pagination`, issue #14, see §3.7)*
- [x] Basic CI smoke checks: `pnpm lint` + `pnpm build` + server `node --check`
  on every PR (issue #8 closed). API route tests are still a follow-up.
- [ ] Admin auth hardening: HttpOnly/Secure/SameSite session cookie (replace
  `localStorage` JWT), CSRF on state-changing routes, rate limit login,
  rotate/shorten token lifetime or add refresh, audit auth error messages for
  info leakage. *(Legacy `server/` login is rate-limited, which closed issue
  #15; the Workers API still has no rate limit and uses the 7d localStorage
  JWT.)*
- [ ] Blog list pagination server-side (currently paginates a fully-fetched
  array client-side) *(in-flight — branch `feat/announcements-pagination`,
  issue #18, see §3.7)*
- [x] Deploy docs for Workers + D1 + R2 (`docs/deploy.md`)
- [ ] Custom 404 illustration (replace placeholder block) *(in-flight — branch
  `fix/frontend-issues`, issue #20)*

### Future (nice-to-have — not required for a credible launch or V1)

- [ ] Optional Podman-based local dev environment (e.g. `podman-compose` for a
  local Mongo/dev services). Recorded as Future; tooling is **not** built yet
  (issue #22). If containers are introduced, use Podman, not Docker.
- [ ] Newsletter or event RSVP integration
- [ ] Member accounts / self-service membership form
- [ ] Search across blog posts
- [ ] Multi-admin roles/permissions
- [ ] Analytics dashboard for admins

## 6. Validation criteria

Use these to check off items above. Prefer scripted checks; note manual
checks explicitly.

- **Contact**: no nav/footer link resolves to a 404. Chosen resolution:
  "Contact" links anchor to `#site-footer` (no standalone route). Issue #10.
- **`.env.example` files**: every `process.env.X` referenced in `server/**`
  and `lib/**`/`app/**` has a matching `X=` line in the relevant
  `.env.example`, with no real values. Verified 2026-08-13: all 7 `server/`
  vars and `NEXT_PUBLIC_API_URL` are covered.
- **README accuracy**: a fresh clone, following only the README, runs the
  Cloudflare stack locally: `pnpm install`, `cp .dev.vars.example .dev.vars`,
  `pnpm run db:migrate:local`, `pnpm run seed:admin:local`, then
  `pnpm preview` (or `pnpm dev`). Manual check. The legacy `server/` is
  reference-only and documents its own `pnpm --dir server install`.
- **Lockfile**: `git ls-files | grep package-lock.json` returns nothing;
  `pnpm-lock.yaml` is tracked at repo root and in `server/`. Issue #7 closed.
- **`AdminGuard`**: an expired JWT in `localStorage` results in a redirect to
  `/admin`, verified either by decoding `exp` client-side or by a failed
  API call triggering logout. *(In-flight — see §3.7.)*
- **Dashboard edit route**: clicking "Edit" from `/admin/dashboard` opens a
  working form pre-filled with the post's current data, without a 404.
  Satisfied by the route move to `app/admin/blogs/[id]/edit/page.js` (#17).
- **Announcements API**: `GET /api/announcements` returns real data and the
  carousel renders it; no `/api/blogs` stand-in remains in
  `AnnouncementCarousel.jsx`. *(In-flight — see §3.7.)*
- **Blog pagination**: `GET /api/blogs?page=2&limit=5` returns at most 5 items
  plus `total`/`totalPages`, and `/blog` pages through it without client-side
  slicing. *(In-flight — see §3.7.)*
- **CI smoke tests**: `.github/workflows/ci.yml` runs `pnpm install
  --frozen-lockfile && pnpm lint && pnpm build` (frontend) and `pnpm install
  --frozen-lockfile && node --check server.js` (server) on every PR.
- **CORS**: the Workers API is same-origin (`/api` on the site origin), so no
  CORS config applies in production. For the legacy Express server,
  production `CLIENT_URL` is set to a real origin, not `*` (`*` is dev-only,
  `server/server.js`).
