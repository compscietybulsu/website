# AGENTS.md — CompSciety Website

This file is the hub. Any AI agent or contributor working in this repo
should read this first, then follow the doc map below.

## What this repo is

Public website for the Computer Science Society (`compscietybulsu/website`).
Two apps: a Next.js frontend (repo root) and an Express + MongoDB backend
(`server/`). See `SPEC.md` for the full contract — what exists, what's
missing, and what "done" means for each feature.

## Layout

```
app/            Next.js App Router pages (frontend routes)
components/     Frontend UI components
lib/            Frontend API client, auth token helper, Cloudinary upload helper
server/         Express API: routes, models, middleware, config, scripts
docs/           Deploy docs, ticket backlog
SPEC.md         The contract. Read this before changing behavior.
tasks.md        Dependency-ordered execution plan derived from SPEC.md
docs/tickets.md GitHub-issue-ready backlog
```

## Hard guardrails

These are not suggestions.

1. **Package manager is pnpm. Only pnpm.** Do not add `npm install` or
   `yarn` instructions or lockfiles. If you see `package-lock.json` in a
   diff, that's a bug to fix, not a pattern to follow.
2. **Containers are Podman, not Docker**, if and when containers show up in
   this repo. Do not introduce Docker-specific tooling.
3. **Never commit secrets.** No real API keys, DB URIs, JWT secrets, or
   Cloudinary credentials in any file, ever — including `.env.example`
   files, which must contain variable *names* only.
4. **Never document personal git/SSH/GPG tooling in this repo.** Individual
   contributors' signing keys, SSH profiles, and `git-profile`/`git-ssh`
   setup are personal machine config, not project config. Do not add them
   to `AGENTS.md`, `README.md`, or any committed file.
5. **SPEC.md is the source of truth.** If a change contradicts `SPEC.md`,
   update `SPEC.md` first, then code — never let them drift apart silently.
6. **Branch naming**: `feat/<short-desc>`, `fix/<short-desc>`,
   `chore/<short-desc>`. Match the change type to the prefix honestly (a
   new feature is `feat/`, a bug fix is `fix/`, scaffolding/tooling/docs is
   `chore/`).
7. **Don't touch skills directories** (`.claude/skills/`, `.cursor/skills-*`,
   or similar) from this repo's PRs. Project-level skills, if adopted, land
   in a separate, dedicated PR.

## How to work here

1. Read `SPEC.md` for the area you're touching (overview, stack, API
   contracts, feature checklist, validation criteria).
2. Check `tasks.md` for whether the work is already sequenced, and what it
   depends on.
3. If the task isn't in `tasks.md` yet, add it before starting, with a
   stable `T0xx` ID.
4. Make the change. Keep it scoped to one task where possible.
5. Verify against the relevant "Validation criteria" entry in `SPEC.md`
   §6 before calling it done.
6. If you're closing out a ticket from `docs/tickets.md`, check its
   acceptance criteria explicitly.

## Doc map

| File | Purpose |
|---|---|
| `SPEC.md` | The contract: overview, architecture, API/data contracts, feature checklist (MVP/V1/Future), validation criteria |
| `tasks.md` | Dependency-ordered task list derived from `SPEC.md` |
| `docs/tickets.md` | GitHub-issue-ready backlog, cross-referenced to `SPEC.md` and `tasks.md` |
| `CLAUDE.md` | Pointer to this file + `SPEC.md`, for Claude-based tools |
| `.kiro/steering/*.md` | Kiro steering docs, all point back here |
| `.cursor/rules/compsciety.mdc` | Always-applied Cursor rule pointing here |
| `.agy/AGENTS.md` | agy entry point pointing here |
| `README.md` | Human-facing setup/run instructions (pnpm) |

## Maintainer note

If you are Karlo: load your personal context from `~/.config/karlo` as
usual. Do **not** document your SSH keys, GPG signing setup, or
`git-profile`/`git-ssh` tooling anywhere in this repo — that's personal
machine config and stays out of committed files, per the guardrails above.
