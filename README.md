# CompSciety Website

Official website for the Computer Science Society (CompSciety, BulSU).

**Production hosting is all on Cloudflare** (one Worker):

| Piece | Cloudflare product |
|-------|--------------------|
| Next.js site + `/api/*` | Workers (OpenNext) |
| blogs / partners / admins | D1 (`website-db`) |
| Admin image uploads | R2 (`website-media`) via `/api/uploads` + `/api/media/...` |

Live: [https://website.cssbulsu.workers.dev](https://website.cssbulsu.workers.dev).

`server/` (Express + Mongo + Cloudinary) is **legacy** — local reference only.
See [`docs/deploy.md`](./docs/deploy.md), [`AGENTS.md`](./AGENTS.md), and
[`SPEC.md`](./SPEC.md).

Package manager: **pnpm** only.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation)
- Cloudflare account with Wrangler (`pnpm exec wrangler whoami`)
- R2 enabled on the account (first-time dashboard toggle)

## Setup

| File | Purpose | Template |
|------|---------|----------|
| `.env.local` | Optional Next local overrides | `.env.example` |
| `.dev.vars` | Local Workers preview secrets (`JWT_SECRET`) | `.dev.vars.example` |

```bash
pnpm install
cp .dev.vars.example .dev.vars   # set JWT_SECRET, ADMIN_USER, ADMIN_PASS
pnpm run db:migrate:local
pnpm run seed:admin:local        # reads ADMIN_* from .dev.vars
```

## Local development

Same-origin API (recommended):

```bash
pnpm preview    # OpenNext + Workers runtime with D1/R2 bindings
```

Or plain Next (bindings via `initOpenNextCloudflareForDev` in `next.config.mjs`):

```bash
pnpm dev
```

Leave `NEXT_PUBLIC_API_URL` unset so the browser calls `/api` on the same origin.

## Production deploy

```bash
pnpm exec wrangler r2 bucket create website-media   # once, after enabling R2
pnpm run db:migrate
pnpm exec wrangler secret put JWT_SECRET
# Put ADMIN_USER / ADMIN_PASS in gitignored `.dev.vars`, then:
pnpm run seed:admin
pnpm run deploy
```

Workers Builds: empty build command + `pnpm run deploy` (see
[`docs/deploy.md`](./docs/deploy.md)). Do not use plain `pnpm run build` alone.

## Admin login

Credentials live in `.dev.vars` (`ADMIN_USER` / `ADMIN_PASS`). Seed with
`pnpm run seed:admin`, then open `/admin`.
