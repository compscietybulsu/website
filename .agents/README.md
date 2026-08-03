# Agent Skills

This directory holds project-specific **Agent Skills** for this website
repo. They work with any agent that understands the SKILL.md format (agy, Claude,
Cursor CLI, etc.).

## Layout

```
.agents/skills/<skill-name>/SKILL.md
.cursor/skills -> ../.agents/skills   (symlink)
```

`.agents/skills/` is canonical. `.cursor/skills` is a symlink to it so that Cursor
discovers the exact same skills without any duplication. If your checkout tool or
filesystem does not preserve symlinks (e.g. some zip exports), recreate it with:

```bash
ln -s ../.agents/skills .cursor/skills
```

Do **not** hand-edit `.cursor/skills` as a separate copy — it must always resolve
to `.agents/skills/` so the two agent surfaces never drift apart.

## Available skills

| Skill | Use it when |
| --- | --- |
| `website-spec` | Before/after any change, to check for SPEC/AGENTS drift and run validation |
| `website-frontend` | Editing `app/` or `components/` (Hero, Navbar, About, Blog, UI) |
| `website-backend` | Editing `server/` (Express routes, Mongoose models, auth, Cloudinary) |
| `website-content` | Editing static content modules or deciding static vs API-backed content |
| `agent-handoff` | Ending a session or switching agents (agy ↔ Cursor ↔ Kiro) |
| `website-review` | Reviewing a PR or diff before merge |

See `docs/agent-skills.md` at the repo root for the same index rendered for humans.
