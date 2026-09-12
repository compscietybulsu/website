# AGENTS.md — CompSciety Website

This file is the hub. Any AI agent or contributor working in this repo
should read this first, then follow the doc map below.

## What this repo is

Public website for the Computer Science Society (`compscietybulsu/website`).
Two apps: a Next.js frontend (repo root) and an Express + MongoDB backend
(`server/`). See `SPEC.md` for the full product contract.

## Current priorities (active)

Work these tracks first. GitHub issues + milestones are the tracker — do not
reintroduce a `tasks.md` checklist.

| Priority | Track | Issue | Agent skill | Focus |
|---|---|---|---|---|
| **P0** | Cloudflare deploy | [#24](https://github.com/compscietybulsu/website/issues/24) | `website-deploy-cf` | Next.js on Workers (OpenNext); Pages only for true static artifacts |
| **P0** | Remote dev | [#26](https://github.com/compscietybulsu/website/issues/26) | `website-remote-dev` | Codespaces / Dev Containers — reliable contributor path |
| **P0** | Backend prep | [#27](https://github.com/compscietybulsu/website/issues/27) | `website-backend-prep` | API ready for a public frontend (CORS, auth, locks, deploy docs) |

Milestone: [Priority](https://github.com/compscietybulsu/website/milestone/5).

Everything else (content polish, announcements model, Podman Mongo, etc.)
waits unless it blocks a P0 track.

## Layout

```
app/            Next.js App Router pages (frontend routes)
components/     Frontend UI components
lib/            Frontend API client, auth token helper, Cloudinary upload helper
server/         Express API: routes, models, middleware, config, scripts
docs/           Deploy docs, ticket backlog, skills index
.spec / SPEC    The contract. Read before changing behavior.
.devcontainer/  Codespaces / Dev Container remote-dev config
.agents/skills/ Canonical project Agent Skills (Cursor symlink: .cursor/skills)
```

## Hard guardrails

These are not suggestions.

1. **Package manager is pnpm. Only pnpm.** Do not add `npm install` or
   `yarn` instructions or lockfiles. If you see `package-lock.json` in a
   diff, that's a bug to fix, not a pattern to follow.
2. **Containers are Podman, not Docker**, if and when containers show up in
   this repo. Do not introduce Docker-specific tooling. (Codespaces may use
   docker-in-docker under the hood — keep docs Podman-first for local, and
   Codespaces-accurate for remote.)
3. **Never commit secrets.** No real API keys, DB URIs, JWT secrets, or
   Cloudinary credentials in any file, ever — including `.env.example`
   files, which must contain variable *names* only.
4. **Never document personal git/SSH/GPG tooling in this repo.** Individual
   contributors' signing keys, SSH profiles, and `git-profile`/`git-ssh`
   setup are personal machine config, not project config.
5. **SPEC.md is the source of truth.** If a change contradicts `SPEC.md`,
   update `SPEC.md` first, then code — never let them drift apart silently.
6. **Branch naming**: `feat/<short-desc>`, `fix/<short-desc>`,
   `chore/<short-desc>`. Match the change type to the prefix honestly.
7. **Project skills live under `.agents/skills/`** (mirrored for Cursor via
   `.cursor/skills` symlink). Do not invent a second skills tree.

## How to work here

1. Read `SPEC.md` for the area you're touching.
2. Confirm the work is in the **Current priorities** table (or explicitly
   approved as a side quest). Open/use the matching GitHub issue.
3. Load the matching agent skill from `.agents/skills/` when the track
   matches.
4. Make the change. Keep it scoped to one issue where possible.
5. Verify against the relevant "Validation criteria" entry in `SPEC.md`
   before calling it done.
6. Check the issue acceptance criteria before closing.

## Doc map

| File | Purpose |
|---|---|
| `SPEC.md` | Product contract: architecture, API/data, checklist, validation |
| `docs/tickets.md` | Issue backlog bodies + labels (tracker of record is GitHub Issues) |
| `CLAUDE.md` | Pointer to this file + `SPEC.md`, for Claude-based tools |
| `.kiro/steering/*.md` | Kiro steering docs, all point back here |
| `.cursor/rules/website.mdc` | Always-applied Cursor rule pointing here |
| `.agy/AGENTS.md` | agy entry point pointing here |
| `README.md` | Human-facing setup/run instructions (pnpm) |
| `docs/agent-skills.md` | Project skills index; canonical under `.agents/skills/` |

## Skills (agy + Cursor)

Canonical path: `.agents/skills/*/SKILL.md`. Cursor uses
`.cursor/skills -> ../.agents/skills`.

Index: [`docs/agent-skills.md`](docs/agent-skills.md).

| Skill | Use when |
|---|---|
| `website-deploy-cf` | **P0** — Cloudflare Workers / Pages frontend deploy |
| `website-remote-dev` | **P0** — Codespaces / Dev Containers remote contributor path |
| `website-backend-prep` | **P0** — API production readiness for a public frontend |
| `website-spec` | Start of work; SPEC/AGENTS drift; lint/build validation |
| `website-frontend` | `app/` / `components/` UI and brand styling |
| `website-backend` | Day-to-day `server/` Express / Mongoose / JWT / Cloudinary |
| `website-content` | Static content vs API-backed content decisions |
| `agent-handoff` | Agent/session switch (agy ↔ Cursor ↔ Kiro) |
| `website-review` | PR review: secrets, drift, dead links, lockfiles |

Do not invent a second skills tree. Keep Cursor and agy on the same files.

## Maintainer note

If you are Karlo: load your personal context from `~/.config/karlo` as
usual. Do **not** document your SSH keys, GPG signing setup, or
`git-profile`/`git-ssh` tooling anywhere in this repo — that's personal
machine config and stays out of committed files, per the guardrails above.
