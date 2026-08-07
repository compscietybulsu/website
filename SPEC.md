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

Two apps in one repo, deployed separately.

**Frontend** — `/` (repo root)
- Next.js 16 (App Router), React 19, Tailwind CSS v4
- Package manager: **pnpm** (see `package.json`)
- Client-side data fetching via `lib/api.js` against the backend REST API
- Local admin session token stored in `localStorage` via `lib/auth.js`

**Backend** — `/server`
- Express 5, Mongoose 9 (MongoDB), JWT auth (`jsonwebtoken`), `bcryptjs` for
  password hashing, Cloudinary for image storage, `dotenv` for config
- Package manager: **pnpm**
- Entry point: `server/server.js`, listens on `process.env.PORT` (default 5000)
- Dev runner: `nodemon` via `pnpm dev` (script currently named `dev` in
  `server/package.json`)

**Containers** — if/when containerized, use **Podman**, not Docker.

## 3. API and data contracts

Base path: all backend routes are mounted under `/api` on the Express app
(`server/server.js`). The frontend reads the backend base URL from
`NEXT_PUBLIC_API_URL` (see `lib/api.js`).

### 3.1 Health

`GET /api/health` → `{ "status": "ok" }`. No auth.

### 3.2 Auth — `server/routes/auth.js`

`POST /api/auth/login`
- Body: `{ "username": string, "password": string }`
- 400 if either field missing
- 401 if admin not found or password mismatch
- 200: `{ "token": string, "username": string }` — JWT signed with
  `JWT_SECRET`, `expiresIn: "7d"`, payload `{ id, username }`

There is no register/refresh/logout endpoint. Admin accounts are created out
of band via `server/scripts/createAdmin.js <username> <password>` (upserts
into the `Admin` collection). Logout is client-only (token is dropped from
`localStorage`).

### 3.3 Blogs — `server/routes/blogs.js`

All routes mounted at `/api/blogs`.

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/` | none | — | `200` array of Blog, sorted newest first |
| GET | `/:id` | none | — | `200` Blog, `404` if not found, `400` if id invalid |
| POST | `/` | `verifyAdmin` | `{ title, content, image?, fbLink? }` | `201` Blog, `400` if title/content missing |
| PUT | `/:id` | `verifyAdmin` | `{ title, content, image?, fbLink? }` | `200` Blog, `404`/`400` |
| DELETE | `/:id` | `verifyAdmin` | — | `200 { message }`, `404`/`400` |

`verifyAdmin` middleware (`server/middleware/auth.js`) reads
`Authorization: Bearer <token>`, verifies with `JWT_SECRET`, attaches
`req.admin = { id, username }`, else `401`.

### 3.4 Uploads — `server/routes/uploads.js`

`GET /api/uploads/signature` — `verifyAdmin` only. Returns a Cloudinary
upload signature: `{ signature, timestamp, folder: "compsciety-blogs",
apiKey, cloudName }`. The frontend (`lib/cloudinary.js`) posts the file
directly to Cloudinary's REST API using this signature — the backend never
receives the image bytes.

### 3.5 Data models

**Blog** (`server/models/Blog.js`)
```js
{
  title: String,   // required, trimmed
  content: String, // required
  image: String,   // default "" — Cloudinary secure_url
  fbLink: String,  // default "" — optional Facebook post link
  createdAt, updatedAt // timestamps: true
}
```

**Admin** (`server/models/Admin.js`)
```js
{
  username: String,     // required, unique, lowercase, trimmed
  passwordHash: String,  // required — bcrypt hash
}
```

There is no user/member model. There is no partners, officers, or
announcements model yet — that content is hardcoded in frontend components
(see gaps below).

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
- **npm lockfiles are still tracked** (`package-lock.json`,
  `server/package-lock.json`) even though the project has moved to pnpm; a
  `pnpm-lock.yaml` exists locally but is untracked. README still documents
  `npm install`.
- **No `.env.example` files** — env var names are not documented anywhere
  in-repo.
- **CORS defaults to `*`** if `CLIENT_URL` is unset (`server/server.js`),
  which is fine for local dev but must not ship to production as-is.

## 5. Feature checklist

### MVP (must-have — required for a credible public launch)

- [x] Public home page with nav, hero, announcements, partners, about teaser, footer
- [x] Public about page (mission/vision, advisers, officers, executives, committees)
- [x] Public blog list + single post pages backed by the real API
- [x] Admin login (JWT)
- [x] Admin blog CRUD (create, edit, delete) with Cloudinary image upload
- [x] Health check endpoint for uptime monitoring
- [ ] Contact page (route + content), or nav/footer links updated to not 404
- [ ] `.env.example` (root and `server/`) documenting every required var
- [ ] README accurate for pnpm, describes running both frontend and backend
- [ ] Single lockfile strategy: commit `pnpm-lock.yaml`, remove tracked npm lockfiles
- [ ] `AdminGuard` treats an expired/invalid token as logged-out, not just an absent one
- [ ] Admin dashboard edit links resolve to a real, working edit route

### V1 (should-have — makes the site trustworthy and maintainable)

- [ ] Real hero copy and imagery (replace placeholder text)
- [ ] Real partner logos wired through backend or static assets (replace placeholder circles)
- [ ] Real officer/executive/adviser/committee data and photos, ideally admin-editable
- [ ] Announcements backed by an API (`Announcement` model + CRUD), replacing the hardcoded carousel
- [ ] Basic smoke tests (API route tests + one frontend build/lint check) in CI
- [ ] Admin auth hardening: rate limit login, rotate/shorten token lifetime or add refresh, audit `verifyAdmin` error messages for info leakage
- [ ] Blog list pagination server-side (currently paginates a fully-fetched array client-side)
- [ ] Deploy docs (env vars per environment, CORS/`CLIENT_URL` config, MongoDB Atlas + Cloudinary setup)
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
