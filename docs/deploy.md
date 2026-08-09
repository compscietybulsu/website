# Deploy

Production runs **entirely on Cloudflare Workers** (OpenNext):

| Piece | Where | Notes |
|-------|--------|--------|
| Public site + admin UI | Worker `website` | `website.cssbulsu.workers.dev` |
| REST API (`/api/*`) | Same Worker | Next.js App Router route handlers |
| Structured data | **D1** `website-db` | blogs, partners, admins |
| Images | **R2** `website-media` | served via `/api/media/...` |
| Cloudflare Pages | **Not used** | Disable leftover Pages Git auto-deploy |

The Express + Mongo + Cloudinary stack under `server/` is **legacy** (local
reference / migration only). Do not deploy it for production.

## Live Workers URL (cssbulsu)

| Item | Value |
|------|--------|
| Cloudflare account | `compscietybulsu` (`d8fdf8612e11f3aadb89085e8924cc41`) |
| `workers.dev` subdomain | `cssbulsu` |
| Worker script name | `website` |
| Production URL | https://website.cssbulsu.workers.dev |

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation) (do not use npm/npx/yarn)
- Cloudflare account + Wrangler login: `pnpm exec wrangler whoami` → **compscietybulsu**
- **R2 enabled** on the account (Dashboard → R2 → Enable). Bucket name: `website-media`
- D1 database `website-db` (already created; id in `wrangler.jsonc`)

## Secrets and env

| Name | Where | Purpose |
|------|--------|---------|
| `JWT_SECRET` | `wrangler secret put JWT_SECRET` (prod); `.dev.vars` (local preview) | Admin JWT sign/verify |
| `NEXT_PUBLIC_API_URL` | Usually **omit** | Same-origin `/api` by default. Only set if pointing at a legacy Express host. |

Never commit real values. Templates: `.env.example`, `.dev.vars.example`.

```bash
pnpm exec wrangler secret put JWT_SECRET
```

## One-time: migrations, R2, admin

```bash
# Enable R2 in the dashboard first, then:
pnpm exec wrangler r2 bucket create website-media

# Apply D1 schema (remote)
pnpm exec wrangler d1 migrations apply website-db --remote

# Seed admin (does not echo password)
ADMIN_USER=admin ADMIN_PASS='your-long-password' pnpm run seed:admin
```

Local D1 / R2 for `pnpm preview`:

```bash
pnpm exec wrangler d1 migrations apply website-db --local
ADMIN_USER=admin ADMIN_PASS='local-dev-pass' pnpm run seed:admin:local
cp .dev.vars.example .dev.vars   # set JWT_SECRET
```

## Scripts

```bash
pnpm install
pnpm preview       # OpenNext build + local Workers runtime (bindings via wrangler)
pnpm run deploy    # OpenNext build + deploy Worker
```

Use `pnpm run deploy` (not bare `pnpm deploy`). Root `pnpm-workspace.yaml` with
`packages: ["."]` is required for Cloudflare Workers Builds (pnpm 10.11.x).

## First deploy / redeploy

1. `pnpm exec wrangler whoami` (compscietybulsu)
2. R2 bucket exists; D1 migrations applied; `JWT_SECRET` set
3. `pnpm run deploy`
4. Smoke: `/`, `/blog`, `/api/health`, `/admin`

## CI: Workers Builds (production / main only)

**Do not** set Build to `pnpm run build`. That is plain `next build`. OpenNext
invokes `pnpm run build` itself, so the Worker entry is only created by
`opennextjs-cloudflare build` / `pnpm run deploy`.

### Required dashboard settings

Workers → `website` → Settings → Builds:

| Setting | Value |
|---------|--------|
| Install command | `pnpm install --frozen-lockfile` |
| **Build command** | leave **empty** (or `true`) |
| **Deploy command** | `pnpm run deploy` |
| Root directory | `/` |
| Production branch | `main` |

`pnpm run deploy` = OpenNext build **then** Wrangler deploy (creates
`.open-next/worker.js`).

### What fails (your current log)

| Setting | Wrong value (causes the error) |
|---------|--------------------------------|
| Build | `pnpm run build` → only `next build`, no `.open-next/` |
| Deploy | `npx wrangler versions upload` → looks for missing `worker.js` |

After you change the dashboard, **Retry** the build (or push to `main`).
Updating settings does not rewrite old failed logs.

Do **not** use classic Cloudflare Pages for this App Router / OpenNext app.
