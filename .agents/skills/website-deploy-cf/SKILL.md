---
name: website-deploy-cf
description: >-
  Deploys the CompSciety Next.js frontend on Cloudflare Workers (OpenNext) and
  optional Cloudflare Pages for static assets. Use for wrangler, OpenNext,
  workers.dev, Pages projects, NEXT_PUBLIC_* secrets, and free-tier hosting.
  Triggers: Cloudflare, Workers, Pages, OpenNext, wrangler, deploy, hosting.
---

# Website Deploy — Cloudflare Workers / Pages

**Current org priority #1.** Ship the public Next.js site on Cloudflare free
tier. Express + Mongo stay off Workers (separate host or later rewrite).

Package manager is **pnpm** only. Never add `npm` / `npx` to scripts or docs
when a `pnpm` / `pnpm dlx` equivalent exists.

## Split of responsibility

| Piece | Host | Notes |
| --- | --- | --- |
| Next.js frontend (`app/`, `components/`) | **Cloudflare Workers** via `@opennextjs/cloudflare` | Primary path for App Router |
| Static marketing / exported assets (if ever needed) | **Cloudflare Pages** | Only when the artifact is truly static |
| Express API (`server/`) | **Not** Workers/Pages | Long-lived Node + Mongo — see `website-backend-prep` |

Do not try to run Mongoose/Express on Workers as a drop-in. Document the
split in `docs/deploy.md` / README when you land config.

## Target outcome

1. OpenNext + Wrangler configured (`open-next.config.ts`, `wrangler.jsonc`).
2. `nodejs_compat` (and any other required compatibility flags) set.
3. `pnpm` scripts: build / preview / deploy (names matching CF Next.js guide).
4. Secrets only via Wrangler / dashboard (`NEXT_PUBLIC_API_URL`, etc.) — never
   committed.
5. Production URL loads home / about / blog (read-only) even if the API is
   unset (graceful empty states).
6. README or `docs/deploy.md` explains Workers frontend vs Express API.

## Suggested sequence

1. Add `@opennextjs/cloudflare` + config; keep Next 16 App Router intact.
2. Local: `opennextjs-cloudflare build` → preview with Wrangler.
3. Deploy to `*.workers.dev`; paste URL on the tracking issue / PR.
4. Wire `NEXT_PUBLIC_API_URL` when a public API exists; otherwise degrade.
5. Custom domain later — not a blocker for first deploy.
6. Pages only if there is a separate static artifact; do not force Next onto
   classic Pages without OpenNext/Workers.

## Guardrails

- Free tier only unless the org explicitly upgrades.
- No Docker-specific deploy docs; Podman is the container convention if used.
- Update `SPEC.md` deploy/architecture notes when hosting lands.
- Cross-check issue [#24](https://github.com/compscietybulsu/website/issues/24)
  and deploy-docs [#19](https://github.com/compscietybulsu/website/issues/19).

## Related skills

- `website-spec` — keep SPEC/AGENTS aligned after hosting changes
- `website-backend-prep` — API host readiness (separate from CF frontend)
- `website-remote-dev` — Codespaces/devcontainer for contributors
