---
name: website-backend-prep
description: >-
  Prepares the Express + Mongo API for a public frontend — CORS, rate limits,
  JWT review, health checks, lockfile/pnpm hygiene, env examples, and a free
  host plan (not Cloudflare Workers). Triggers: backend prep, API deploy,
  CORS, CLIENT_URL, rate limit, JWT, Atlas, production API, server readiness.
---

# Website Backend Prep

**Current org priority #3.** Make `server/` safe and operable so the
Cloudflare-hosted frontend can call a real API. This is **not** “run Express
on Workers.”

## Scope

| In | Out |
| --- | --- |
| Rate-limit `/api/auth/login` | Rewriting to D1/Workers |
| Tighten CORS (`CLIENT_URL`) for prod | Admin UI redesign |
| Review JWT lifetime / error leakage | Full announcements CMS (unless blocking) |
| pnpm lockfile hygiene (`package-lock.json` gone) | Content/photos |
| Health check + deploy docs for API host | OpenNext / Wrangler |
| Atlas + Cloudinary env checklist | |

## Target outcome

1. Login is rate-limited per IP; decisions on JWT lifetime recorded in
   `SPEC.md`.
2. Prod CORS is origin-scoped via `CLIENT_URL` (no `*` in production).
3. Root `package-lock.json` removed; server uses pnpm consistently (#7 / #21).
4. `docs/deploy.md` (or README section) lists every server env var and a
   recommended free/cheap API host path (e.g. Render/Railway/Fly — org
   chooses; prefer free tier).
5. Frontend on Workers can set `NEXT_PUBLIC_API_URL` to that host.
6. Smoke: `GET /api/health` and `GET /api/blogs` work against Atlas.

## Suggested sequence

1. Lockfile cleanup (#7) so CI and deploys are deterministic.
2. Auth hardening (#15) + AdminGuard expiry on the client (#16) if admin will
   be used against the public API.
3. Fix blog edit route (#17) if admin shipping is in the same wave.
4. Deploy docs (#19) with API host + CORS + Atlas + Cloudinary.
5. Keep Partners/Announcements improvements secondary unless they block the
   public read path.

## Guardrails

- pnpm only; Podman not Docker for any compose experiments.
- No secrets in git; examples are names only.
- Update `SPEC.md` when auth/CORS/deploy contracts change.
- Cross-check Priority epic [#27](https://github.com/compscietybulsu/website/issues/27)
  and children #7, #15, #16, #17, #19.

## Related skills

- `website-backend` — day-to-day route/model patterns
- `website-deploy-cf` — frontend host; consumes this API via env
- `website-remote-dev` — local/Codespaces API runbook
