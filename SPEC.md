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

**Legacy** — `/server` Express + Mongo + Cloudinary is not production hosting.
Keep only for reference or one-off data export.

**Containers** — if/when containerized, use **Podman**, not Docker.

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

**Admin** (D1 `admins`): `{ id, username, password_hash }` — not exposed in
list APIs. No public member model. Officers/announcements may still be
hardcoded in frontend components (see gaps).

### 3.6 Frontend routes

| Route | File | Status |
|---|---|---|
| `/` | `app/page.js` | Live — Hero, Announcements, Partners, About, Footer |
| `/about` | `app/about/page.js` | Live — Intro, Mission/Vision, Advisers, Officers, Executives, Committees |
| `/blog` | `app/blog/page.js` | Live — paginated list from `GET /api/blogs` |
| `/blog/:id` | `app/blog/[id]/page.js` | Live — single post from `GET /api/blogs/:id` |
| `/contact` | — | **Missing.** Nav (`components/Navbar.jsx`) and Footer link to it; page does not exist. 404s today. |
| `/admin` | `app/admin/page.js` | Live — login form, posts to `/api/auth/login` |
| `/admin/dashboard` | `app/admin/dashboard/page.js` | Live — list/delete blogs, behind `AdminGuard` |
| `/admin/blogs/new` | `app/admin/blogs/new/page.js` | Live — create blog form |
| `/admin/blogs/new/[id]/edit` | `app/admin/blogs/new/[id]/edit/page.js` | Live — edit blog form. Note: nested under `blogs/new/`, not `blogs/:id/edit` — path is inconsistent with the dashboard's edit links (see gaps) |

`AdminGuard` (`components/admin/AdminGuard.jsx`) is a client-side redirect
only — it checks `localStorage` for a token and redirects to `/admin` if
absent. It does not verify the token is valid or unexpired; an expired token
still passes the guard until the API rejects a request.

## 4. Known gaps (honest, current state)

These are real gaps in the shipped product, not proposals:

- **Contact page missing.** Nav and Footer both link to `/contact`; no route
  exists.
- **Hero copy is placeholder** (`components/Hero.jsx`): "This text box is
  solely for placeholder description or information about stuff."
- **Partners are placeholder circles**, not real logos
  (`components/PartnersSection.jsx`).
- **Officers/Executives/Advisers/Committees are hardcoded arrays** with no
  photos (`components/about/*.jsx`) — explicit `// TODO` comments in code
  say "replace with real ... from the backend."
- **Announcements are hardcoded**, not backend-driven
  (`components/AnnouncementCarousel.jsx`).
- **404 page has a placeholder illustration block** (`app/not-found.js`).
- **`AdminGuard` does not validate token expiry**, only presence.
- **Dashboard edit links point to `/admin/blogs/:id/edit`** but the actual
  file lives at `app/admin/blogs/new/[id]/edit/page.js` (i.e. under
  `/admin/blogs/new/:id/edit`). Verify this route actually resolves before
  treating it as fixed.
- **No automated tests** anywhere in the repo.
- **`server/pnpm-lock.yaml` is not tracked** while root `pnpm-lock.yaml` is;
  legacy `server/` lockfile strategy may need alignment if that stack is kept.
- **R2 must be enabled** once in the Cloudflare dashboard before
  `website-media` can be created / production deploy binds MEDIA.
- **Legacy `server/`** still in-tree; do not treat it as the production API.

## 5. Feature checklist

### Active priority (org — supersedes older MVP/V1 ordering for now)

Ship in this order unless explicitly redirected:

1. **Cloudflare deploy** — Next.js on Workers (OpenNext); Pages only for true static artifacts. Tracker: [#24](https://github.com/compscietybulsu/website/issues/24).
2. **Remote dev** — Codespaces / Dev Containers reliable for contributors. Tracker: [#26](https://github.com/compscietybulsu/website/issues/26).
3. **Backend prep** — Express API ready for a public frontend (CORS, auth hardening, lockfiles, deploy docs). API does **not** run on Workers. Tracker: [#27](https://github.com/compscietybulsu/website/issues/27).

Agent skills: `website-deploy-cf`, `website-remote-dev`, `website-backend-prep` (see `AGENTS.md`).

Older MVP/V1/Future checklist items below remain the product contract; treat them as backlog relative to the three tracks above.

### MVP (must-have — required for a credible public launch)

- [x] Public home page with nav, hero, announcements, partners, about teaser, footer
- [x] Public about page (mission/vision, advisers, officers, executives, committees)
- [x] Public blog list + single post pages backed by the real API
- [x] Admin login (JWT)
- [x] Admin blog CRUD (create, edit, delete) with R2 image upload
- [x] Health check endpoint for uptime monitoring
- [x] Cloudflare full-stack host (Workers + D1 + R2; same-origin `/api`)
- [ ] Contact page (route + content), or nav/footer links updated to not 404
- [x] `.env.example` / `.dev.vars.example` documenting required vars
- [x] README accurate for pnpm + Cloudflare deploy
- [x] Single lockfile strategy: commit `pnpm-lock.yaml`, remove tracked npm lockfiles
- [ ] `AdminGuard` treats an expired/invalid token as logged-out, not just an absent one
- [ ] Admin dashboard edit links resolve to a real, working edit route

### V1 (should-have — makes the site trustworthy and maintainable)

- [ ] Real hero copy and imagery (replace placeholder text)
- [ ] Real partner logos wired through backend or static assets (replace placeholder circles)
- [ ] Real officer/executive/adviser/committee data and photos, ideally admin-editable
- [ ] Announcements backed by an API (`Announcement` model + CRUD), replacing the hardcoded carousel
- [ ] Basic smoke tests (API route tests + one frontend build/lint check) in CI
- [ ] Admin auth hardening: HttpOnly/Secure/SameSite session cookie (replace
  `localStorage` JWT), CSRF on state-changing routes, rate limit login,
  rotate/shorten token lifetime or add refresh, audit auth error messages for
  info leakage
- [ ] Blog list pagination server-side (currently paginates a fully-fetched array client-side)
- [x] Deploy docs for Workers + D1 + R2 (`docs/deploy.md`)
- [ ] Custom 404 illustration (replace placeholder block)

### Future (nice-to-have — not required for a credible launch or V1)

- [ ] Newsletter or event RSVP integration
- [ ] Member accounts / self-service membership form
- [ ] Search across blog posts
- [ ] Multi-admin roles/permissions
- [ ] Analytics dashboard for admins

## 6. Validation criteria

Use these to check off items above. Prefer scripted checks; note manual
checks explicitly.

- **Contact page**: visiting `/contact` returns 200, and nav/footer links no
  longer 404.
- **`.env.example` files**: every `process.env.X` referenced in `server/**`
  and `lib/**`/`app/**` has a matching `X=` line in the relevant
  `.env.example`, with no real values.
- **README accuracy**: a fresh clone, following only the README, gets both
  frontend (`pnpm install && pnpm dev`) and backend (`pnpm --dir server
  install && pnpm --dir server dev`) running locally. Manual check.
- **Lockfile**: `git ls-files | grep package-lock.json` returns nothing;
  `pnpm-lock.yaml` is tracked at repo root and in `server/`.
- **`AdminGuard`**: an expired JWT in `localStorage` results in a redirect to
  `/admin`, verified either by decoding `exp` client-side or by a failed
  API call triggering logout.
- **Dashboard edit route**: clicking "Edit" from `/admin/dashboard` opens a
  working form pre-filled with the post's current data, without a 404.
- **Announcements API**: `GET /api/announcements` returns real data and the
  carousel renders it; no hardcoded `CARDS` array remains in
  `AnnouncementCarousel.jsx`.
- **CI smoke tests**: a CI job runs on PRs and fails if `pnpm build`
  (frontend) or a basic backend route test fails.
- **CORS**: production `CLIENT_URL` is set to a real origin, not `*`.
