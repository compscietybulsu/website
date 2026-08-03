# Agent Skills Index

This repo ships project-specific **Agent Skills** that work for both
[agy](https://github.com/agy-dev) and Cursor. Canonical source lives in
[`.agents/skills/`](../.agents/skills); Cursor discovers the identical set via
a symlink at `.cursor/skills -> ../.agents/skills`. See
[`.agents/README.md`](../.agents/README.md) for the mirroring rules.

> **Note for maintainers:** if/when a root `AGENTS.md` exists in this repo,
> add a short "Skills" section there that links to this file (or inlines the
> table below) so agents reading `AGENTS.md` first still find these. This
> file is intentionally self-contained so the skills PR doesn't depend on
> `AGENTS.md` existing.

## Skills

| Skill | Path | Use it when |
| --- | --- | --- |
| `compsciety-spec` | `.agents/skills/compsciety-spec/SKILL.md` | Starting any task; checking for SPEC/AGENTS drift; running lint/build validation |
| `compsciety-frontend` | `.agents/skills/compsciety-frontend/SKILL.md` | Editing `app/` or `components/` — Hero, Navbar, About, Blog, shared UI, brand styling |
| `compsciety-backend` | `.agents/skills/compsciety-backend/SKILL.md` | Editing `server/` — Express routes, Mongoose models, JWT admin auth, Cloudinary uploads |
| `compsciety-content` | `.agents/skills/compsciety-content/SKILL.md` | Editing static content (`lib/aboutContent.js`, officers/partners/announcements) or deciding static vs API-backed content |
| `compsciety-handoff` | `.agents/skills/compsciety-handoff/SKILL.md` | Ending a session or switching agents (agy ↔ Cursor ↔ Kiro) mid-task |
| `compsciety-review` | `.agents/skills/compsciety-review/SKILL.md` | Reviewing a PR/diff before merge — secrets, drift, broken links, lockfile hygiene |

## How agents discover these

- **agy** and other SKILL.md-aware agents: scan `.agents/skills/*/SKILL.md`
  for YAML frontmatter (`name`, `description`) and load a skill's full body
  when its description matches the current task.
- **Cursor**: scans `.cursor/skills/*/SKILL.md` the same way. Because
  `.cursor/skills` is a symlink to `.agents/skills`, both agents always see
  identical content — there is nothing to keep in sync manually.

## Verifying the mirror locally

```bash
ls -la .cursor/skills          # should resolve through the symlink
ls .cursor/skills              # should list the same 6 skill directories as .agents/skills
readlink .cursor/skills        # -> ../.agents/skills
```
