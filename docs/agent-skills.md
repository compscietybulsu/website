# Agent Skills Index

This repo ships project-specific **Agent Skills** that work for both
agy and Cursor. Canonical source: [`.agents/skills/`](../.agents/skills).
Cursor discovers the same set via `.cursor/skills -> ../.agents/skills`.
See [`.agents/README.md`](../.agents/README.md) for mirroring rules.

## P0 skills (active priorities)

| Skill | Path | Use it when |
| --- | --- | --- |
| `website-deploy-cf` | `.agents/skills/website-deploy-cf/SKILL.md` | Cloudflare Workers (OpenNext) / Pages frontend deploy |
| `website-remote-dev` | `.agents/skills/website-remote-dev/SKILL.md` | Codespaces / Dev Containers remote contributor path |
| `website-backend-prep` | `.agents/skills/website-backend-prep/SKILL.md` | API production readiness (CORS, auth, locks, deploy docs) |

## Supporting skills

| Skill | Path | Use it when |
| --- | --- | --- |
| `website-spec` | `.agents/skills/website-spec/SKILL.md` | Starting any task; SPEC/AGENTS drift; lint/build validation |
| `website-frontend` | `.agents/skills/website-frontend/SKILL.md` | Editing `app/` or `components/` |
| `website-backend` | `.agents/skills/website-backend/SKILL.md` | Day-to-day `server/` routes/models/auth/uploads |
| `website-content` | `.agents/skills/website-content/SKILL.md` | Static content vs API-backed content decisions |
| `agent-handoff` | `.agents/skills/agent-handoff/SKILL.md` | Ending a session or switching agents mid-task |
| `website-review` | `.agents/skills/website-review/SKILL.md` | Reviewing a PR/diff before merge |

## How agents discover these

- **agy** and other SKILL.md-aware agents: scan `.agents/skills/*/SKILL.md`
  for YAML frontmatter (`name`, `description`) and load a skill when its
  description matches the current task.
- **Cursor**: scans `.cursor/skills/*/SKILL.md` the same way via the symlink.

## Verifying the mirror locally

```bash
ls -la .cursor/skills          # should resolve through the symlink
ls .cursor/skills              # same skill directories as .agents/skills
readlink .cursor/skills        # -> ../.agents/skills
```
