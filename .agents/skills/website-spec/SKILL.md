---
name: website-spec
description: Keeps code changes in sync with this repo's SPEC.md and AGENTS.md contracts (when present) and runs the validation commands before calling work done. Use when starting any task in this website repo, before proposing a design change, or before opening a PR — trigger terms: spec drift, AGENTS.md, SPEC.md, validation, lint, build, acceptance criteria.
---

# Website Spec Compliance

This repo may or may not have a root `AGENTS.md` / `SPEC.md` yet — check first,
don't assume either exists.

## 1. Check what governs this repo right now

```bash
ls AGENTS.md SPEC.md 2>/dev/null
```

- If **both are missing**: there is no written contract yet. Do not invent one
  as a side effect of an unrelated task. Infer behavior from the current code
  (Next.js App Router in `app/`, Express API in `server/`) and keep changes
  small and consistent with existing patterns.
- If **SPEC.md exists**: it is the source of truth for intended behavior.
  Update SPEC.md **before** changing code when the change alters behavior,
  routes, env vars, or content structure — not after.
- If **AGENTS.md exists**: follow any repo-specific agent rules there. If it
  links to a skills index, keep that link/table in sync with `.agents/skills/`.

## 2. Drift-control checklist (do this for every non-trivial change)

- [ ] Does the change alter an API route, model field, or env var? → reflect it
      in SPEC.md (if present) in the same PR.
- [ ] Does the change alter user-facing copy/pages listed in a spec's scope? →
      update that section, don't leave it stale.
- [ ] Does the change add a new page/route? → confirm it's linked from
      `components/Navbar.jsx` and `components/Footer.jsx` NAV_LINKS, or
      deliberately not linked (e.g. admin-only) with a comment explaining why.
- [ ] New env var introduced? → document its name (not its value) in the
      relevant SPEC section or in a code comment near where it's read
      (`process.env.X`). Never commit actual secrets or `.env` files.

## 3. Validation commands (run before declaring a task done)

Frontend (repo root, Next.js + Tailwind v4, **pnpm** not npm):

```bash
pnpm install         # if lockfile/deps changed
pnpm lint            # eslint (eslint-config-next core-web-vitals)
pnpm build           # next build — catches type/runtime/route errors
```

Backend (`server/`, Express + Mongoose, ESM):

```bash
cd server && pnpm install
pnpm dev             # nodemon server.js — watch for "MongoDB connected"
curl localhost:5000/api/health   # expect {"status":"ok"}
```

If `MONGODB_URI` isn't set locally, `connectDB()` will exit the process — that's
expected without a real database; don't treat it as a code bug unless the error
message itself changed unexpectedly.

## 4. Lockfile hygiene

On main, only `server/package-lock.json` remains tracked (legacy server); root
`package-lock.json` is gone and root + `server/pnpm-lock.yaml` are tracked. PR
#37 removes `server/package-lock.json` entirely. When you run `pnpm install`,
do not also regenerate `package-lock.json`; prefer removing npm lockfiles in
favor of pnpm's, and call this out explicitly in your PR description rather
than silently deleting files.

## 5. Reporting drift you find but don't fix

If you notice drift (spec says X, code does Y) that's out of scope for your
current task, note it in your PR description or a `HANDOFF.md` (see
`agent-handoff`) rather than silently fixing unrelated things.
