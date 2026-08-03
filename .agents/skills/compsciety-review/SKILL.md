---
name: compsciety-review
description: Provides a PR/diff review checklist specific to the CompSciety website repo — secrets, SPEC/AGENTS drift, broken navigation links, leftover placeholder copy, and lockfile hygiene. Use before opening a PR, when reviewing someone else's diff, or when asked to self-check changes — trigger terms: review, PR checklist, code review, secrets scan, lockfile, broken link.
---

# CompSciety PR / Diff Review Checklist

Run through this before opening a PR, and again when reviewing one.

## 1. Secrets

```bash
git diff --stat main...HEAD
git diff main...HEAD -- '*.env*'
```

- [ ] No `.env`, `.env.local`, or `server/.env` staged (they're gitignored —
      confirm nothing forced them in with `git add -f`).
- [ ] No hardcoded `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_API_SECRET`, API
      keys, or tokens in diffs — including test scripts and comments.
- [ ] No real admin username/password pairs committed anywhere (e.g. example
      commands should use placeholders like `<username> <password>`, matching
      `server/scripts/createAdmin.js`'s own usage string).

## 2. SPEC / AGENTS drift

See `compsciety-spec` for the full checklist. Quick version:

- [ ] If `SPEC.md` exists and this PR changes behavior/routes/env vars, SPEC
      is updated in the same PR.
- [ ] If `AGENTS.md` exists and links a skills index, the table still matches
      `.agents/skills/` contents.

## 3. Navigation & links

- [ ] Every `href` added to `components/Navbar.jsx` or `components/Footer.jsx`
      NAV_LINKS resolves to a real route under `app/`.
- [ ] Known existing gap: both Navbar and Footer link to `/contact`, but there
      is no `app/contact/page.js` yet. Don't introduce *new* dead links
      following this pattern — either add the page or don't link to it. If
      you're touching navigation anyway, consider fixing this one too.
- [ ] External links (`SOCIALS` in `Footer.jsx`, `fbLink` on blogs) use
      `target="_blank" rel="noopener noreferrer"` like the existing pattern.

## 4. Placeholder / TODO copy

```bash
git diff main...HEAD | grep -n "TODO\|lorem ipsum\|yourhandle\|placeholder"
```

- [ ] New placeholder content is clearly marked (`TODO` comment or visibly
      fake copy), not left looking like real, shippable content.
- [ ] Social links still pointing at `yourhandle` (see `components/Footer.jsx`)
      aren't copy-pasted into new files as if they were real.
- [ ] Gray placeholder boxes (`bg-gray-200`) for images are intentional, not
      accidentally shipped where a real asset was supposed to go.

## 5. Frontend/backend correctness

- [ ] `pnpm lint` passes at repo root.
- [ ] `pnpm build` passes at repo root (catches broken imports, App Router
      errors).
- [ ] If `server/` changed: server starts (`pnpm dev` in `server/`) and
      `GET /api/health` still returns `{ status: "ok" }`.
- [ ] New/changed API routes match the table in `compsciety-backend` — update
      that skill's route table if you added/removed a route.
- [ ] Auth-sensitive routes still go through `verifyAdmin`; no accidental
      removal of the middleware.

## 6. Lockfile hygiene

This repo is standardizing on **pnpm**. Watch for lockfile drift:

```bash
git status --porcelain | grep -E "package-lock.json|pnpm-lock.yaml"
```

- [ ] If you ran `pnpm install`, don't also commit a regenerated
      `package-lock.json` — pnpm and npm lockfiles diverging is a known repo
      smell here. If both are present in your diff, flag it in the PR
      description rather than silently picking one.
- [ ] `server/package-lock.json` should stay in sync with `server/package.json`
      only if the team hasn't migrated that half to pnpm yet — check the
      current state of `server/` before assuming.

## 7. Style consistency

- [ ] New UI matches the brand language in `compsciety-frontend` (color
      tokens, `rounded-full`/`rounded-2xl` shapes, `font-heading`) rather than
      introducing a new palette.
- [ ] Client components only use `"use client"` when they actually need
      hooks/browser APIs.

## 8. Commit hygiene

- [ ] Commits are signed (repo convention — check `git log --show-signature -1`).
- [ ] Staged paths are specific (no blanket `git add .`/`-A`).
- [ ] No `--no-verify` used to bypass hooks.
