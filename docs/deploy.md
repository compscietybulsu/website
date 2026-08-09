# Deploy

Frontend (Next.js) and backend (Express) are **two separate processes**. This
document covers the Cloudflare Workers path for the public site. Backend
hosting (MongoDB Atlas, Cloudinary, CORS) stays on whatever host runs
`server/` and is not migrated by this ticket.

## Architecture split

| Piece | Runtime | Notes |
|-------|---------|--------|
| Public site (repo root) | Cloudflare Workers via OpenNext | Free `*.workers.dev`; custom domain later |
| API (`server/`) | Separate Node host | Express + MongoDB + Cloudinary; not on Workers yet |

Set `NEXT_PUBLIC_API_URL` to the public API origin (no trailing slash) when the
API is live. If it is unset, the frontend still ships static/marketing pages;
blog/partners/admin data calls fail closed with empty or error UI (see
`lib/api.js`).

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation) (do not use npm/npx/yarn)
- Cloudflare account + [Wrangler login](https://developers.cloudflare.com/workers/wrangler/commands/#login): `pnpm exec wrangler login`
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
`.open-next/` (gitignored).

## First deploy

1. Confirm auth: `pnpm exec wrangler whoami`
2. If the API is live, set `NEXT_PUBLIC_API_URL` **before** the OpenNext build
   (it is inlined at build time — do not use `wrangler secret put` for this
   client-side value):
   - Workers Builds: add it under “Build variables and secrets”, or
   - Local shell: `export NEXT_PUBLIC_API_URL=https://your-api.example.com`
3. Deploy: `pnpm run deploy`
4. Note the `*.workers.dev` URL from Wrangler output
5. Smoke: home, about, and blog load without a paid plan; blog may show empty
   state until a build that saw `NEXT_PUBLIC_API_URL` is deployed

See Cloudflare’s Next.js Workers guide and the OpenNext
[environment variables](https://opennext.js.org/cloudflare/howtos/env-vars)
howto linked above.

## CI / Workers Builds

If you connect the GitHub repo to Workers Builds:

- Install command: `pnpm install`
- Build/deploy command: `pnpm run deploy` (or `pnpm exec opennextjs-cloudflare build` then deploy step)
- Configure `NEXT_PUBLIC_API_URL` under build variables when the API exists
  (must be present for the build step, not only as a runtime secret)

## Local Next.js (not Workers)

```bash
pnpm install
cp .env.example .env.local   # optional NEXT_PUBLIC_API_URL
pnpm dev
```

`next.config.mjs` calls `initOpenNextCloudflareForDev()` so local Next can
talk to Cloudflare bindings when you add them later.
