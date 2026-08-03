---
name: website-backend
description: Guides work on the Express + Mongoose API server for this website — routes, models, JWT admin auth, Cloudinary signed uploads, and env vars. Use when editing files under server/ (server.js, routes/, models/, middleware/, config/, scripts/) — trigger terms: Express, Mongoose, JWT, Cloudinary, API route, admin auth, blog CRUD, server.js.
---

# Website Backend

Standalone Express 5 API in `server/` (separate `package.json`, ESM `"type":
"module"`, own lockfile). Not part of the Next.js build — run and deploy
separately. Package manager is **pnpm**, not npm.

## Layout

```
server/
  server.js              # app bootstrap: cors, json body, routes, connectDB, listen
  config/db.js           # mongoose.connect(MONGODB_URI)
  config/cloudinary.js   # cloudinary.config from env
  middleware/auth.js     # verifyAdmin — JWT bearer check, sets req.admin
  models/Admin.js        # { username (unique, lowercase), passwordHash }
  models/Blog.js         # { title, content, image, fbLink, timestamps }
  routes/auth.js         # POST /api/auth/login
  routes/blogs.js        # GET / GET:id (public) POST/PUT/DELETE:id (verifyAdmin)
  routes/uploads.js      # GET /api/uploads/signature (verifyAdmin, Cloudinary sig)
  scripts/createAdmin.js # CLI: node scripts/createAdmin.js <user> <pass>
```

## Routes (current surface)

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/health` | none | `{ status: "ok" }` liveness check |
| POST | `/api/auth/login` | none | body `{username, password}` → `{token, username}`, JWT expires in 7d |
| GET | `/api/blogs` | none | list, sorted `createdAt` desc |
| GET | `/api/blogs/:id` | none | 404 if missing, 400 if invalid ObjectId |
| POST | `/api/blogs` | `verifyAdmin` | body `{title, content, image, fbLink}` |
| PUT | `/api/blogs/:id` | `verifyAdmin` | same body, partial via Mongoose update |
| DELETE | `/api/blogs/:id` | `verifyAdmin` | |
| GET | `/api/uploads/signature` | `verifyAdmin` | returns Cloudinary signed-upload params for direct browser upload |

When adding a route, follow the existing pattern: plain `Router()` per
resource, `verifyAdmin` middleware imported per-route (not globally), manual
`try/catch` returning `{ message }` JSON on errors (no shared error-handler
middleware exists yet — don't assume one).

## Auth model

- Single `Admin` collection, no roles/permissions — it's binary admin-or-not.
- Password hashing: `bcryptjs`. Never store or log plaintext passwords.
- `verifyAdmin` (`server/middleware/auth.js`) expects `Authorization: Bearer <jwt>`,
  verifies with `JWT_SECRET`, attaches decoded payload to `req.admin`.
- Creating an admin is a CLI-only action (`scripts/createAdmin.js`), not an API
  route — there is intentionally no public admin-signup endpoint. Don't add one
  without an explicit request.

## Uploads

Cloudinary uses **signed direct-to-Cloudinary uploads**: the server only signs
a request (`/api/uploads/signature`), the browser (see `lib/cloudinary.js` on
the frontend) POSTs the file straight to Cloudinary. The server never receives
the binary. Keep this pattern for new upload flows — don't add multipart
file-upload handling in Express unless the requirements change.

## Env vars (names only — never commit values)

`server/.env` is gitignored. Required for full functionality:

- `PORT` (default 5000)
- `CLIENT_URL` (CORS origin; falls back to `*` if unset — tighten for prod)
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Frontend needs `NEXT_PUBLIC_API_URL` pointing at this server's base URL
(see `lib/api.js`).

## Run locally

```bash
cd server
pnpm install
pnpm dev            # nodemon server.js, watches for file changes
curl localhost:5000/api/health
```

Creating/resetting an admin account:

```bash
cd server
node scripts/createAdmin.js <username> <password>
```

## Conventions to keep

- ESM imports (`import ... from "..."`), no CommonJS `require` in `server/`.
- Mongoose models: `trim`/`lowercase` on user-supplied string fields where
  shown in existing schemas; `timestamps: true` on content models like `Blog`.
- Validate required fields manually at the top of the route handler (matches
  existing style) rather than only relying on Mongoose schema validation.
- Return 4xx with `{ message }` for client errors, matching the shape the
  frontend's `lib/api.js` expects (`data?.message`).
