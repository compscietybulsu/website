# Deploy

Frontend (Next.js) and backend (Express) are **two separate processes**. This
document covers the Cloudflare path for the public site. Backend hosting
(MongoDB Atlas, Cloudinary, CORS) stays on whatever host runs `server/` and is
not migrated onto Workers.

## Architecture split

| Piece | Runtime | Notes |
|-------|---------|--------|
| Public site (repo root) | **Cloudflare Workers** via OpenNext | Worker name `website`, account subdomain `cssbulsu` |
| Cloudflare Pages | **Not used for this Next app** | Classic Pages cannot run OpenNext/App Router the way Workers does. Keep or disable any leftover Pages Git integration so it does not fight Workers Builds. |
| API (`server/`) | Separate Node host | Express + MongoDB + Cloudinary |

### Live Workers URL (cssbulsu)

| Item | Value |
|------|--------|
| Cloudflare account | `compscietybulsu` (`d8fdf8612e11f3aadb89085e8924cc41`) |
| `workers.dev` subdomain | `cssbulsu` |
| Worker script name | `website` (see `wrangler.jsonc`) |
| Production URL | https://website.cssbulsu.workers.dev |

Set `NEXT_PUBLIC_API_URL` to the public API origin (no trailing slash) when the
API is live. If it is unset, the frontend still ships static/marketing pages;
blog/partners/admin data calls fail closed with empty or error UI (see
`lib/api.js`).

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation) (do not use npm/npx/yarn)
- Cloudflare account + [Wrangler login](https://developers.cloudflare.com/workers/wrangler/commands/#login): `pnpm exec wrangler whoami` should list **compscietybulsu**
- Optional: a deployed Express API URL for `NEXT_PUBLIC_API_URL`

## Frontend env vars (Workers)

Names only — set values in Wrangler / the Cloudflare dashboard / Workers
Builds. Never commit real values.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | No | Base URL of the Express API. Omit or leave empty to degrade gracefully (read-only shell without live blog/partners data). |

For local Workers preview, copy `.dev.vars.example` → `.dev.vars` (gitignored),
or use `.env.local` during `pnpm dev`. See OpenNext
[environment variables](https://opennext.js.org/cloudflare/howtos/env-vars).

Backend secrets (`MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `CLIENT_URL`,
etc.) belong only on the API host — see `server/.env.example`. Do not put them
in Workers config or the repo-root frontend env files.

## Scripts

From the repo root:

```bash
pnpm install
pnpm preview       # OpenNext build + local Workers runtime
pnpm run deploy    # OpenNext build + deploy to Cloudflare Workers
```

Use `pnpm run deploy` (not bare `pnpm deploy`) so the `package.json` script
runs — `pnpm deploy` is pnpm’s publish command.

Equivalent lower-level flow:

```bash
pnpm exec opennextjs-cloudflare build
pnpm exec opennextjs-cloudflare preview   # or deploy
```

`nodejs_compat` is enabled in `wrangler.jsonc`. Build output lives under
`.open-next/` (gitignored). A root `pnpm-workspace.yaml` with `packages: ["."]`
is required so Cloudflare Workers Builds (pnpm 10.11.x) can install.

## First deploy / redeploy

1. Confirm auth: `pnpm exec wrangler whoami` (account **compscietybulsu**)
2. Confirm config: `wrangler.jsonc` → `name: "website"`, `account_id` set
3. If the API is live, set `NEXT_PUBLIC_API_URL` **before** the OpenNext build
   (it is inlined at build time — do not use `wrangler secret put` for this
   client-side value):
   - Workers Builds: add it under “Build variables and secrets”, or
   - Local shell: `export NEXT_PUBLIC_API_URL=https://your-api.example.com`
4. Deploy: `pnpm run deploy`
5. Smoke: https://website.cssbulsu.workers.dev — home / about / blog

See Cloudflare’s Next.js Workers guide and the OpenNext
[environment variables](https://opennext.js.org/cloudflare/howtos/env-vars)
howto linked above.

## CI: Workers Builds vs Pages

This repo’s production path is **Workers Builds → Worker `website`**.

Recommended Workers Builds settings (same Cloudflare account as cssbulsu):

- Install command: `pnpm install --frozen-lockfile`
- Build/deploy command: `pnpm run deploy`
- Root directory: `/` (repo root)
- Configure `NEXT_PUBLIC_API_URL` under build variables when the API exists

If GitHub still shows a **Cloudflare Pages** check for project `website` on a
*different* account, either:

1. Disable automatic deployments on that Pages project (preferred — Pages is
   not the OpenNext host), or
2. Move the Git integration to the **compscietybulsu** account and keep Pages
   disconnected so only Workers Builds deploys.

Do not point classic Pages build output at this Next.js App Router app.

## Local Next.js (not Workers)

```bash
pnpm install
cp .env.example .env.local   # optional NEXT_PUBLIC_API_URL
pnpm dev
```

`next.config.mjs` calls `initOpenNextCloudflareForDev()` so local Next can
talk to Cloudflare bindings when you add them later.
