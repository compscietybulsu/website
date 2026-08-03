---
name: compsciety-handoff
description: Provides a HANDOFF.md template and rules for ending an agent session or switching between agents (agy, Cursor, Kiro) on the same branch. Use when a task is paused, incomplete, or being transferred to another agent/session — trigger terms: handoff, HANDOFF.md, pause work, switch agent, next steps, context transfer.
---

# CompSciety Agent Handoff

When work on a branch is paused, incomplete, or about to be picked up by a
different agent (or a different session of the same agent), leave a
`HANDOFF.md` at the **repo root of that branch/worktree** — not committed to
`main`, and not left behind once the branch merges.

## When to write one

- You're ending a session with meaningful uncommitted context that isn't
  obvious from `git log` or the diff alone.
- You're stopping mid-task (blocked, out of scope, needs a human decision).
- You're explicitly asked to hand off to another agent.

Skip it for small, fully-finished, self-explanatory changes — don't create
handoff noise for trivial work.

## Template

```markdown
# HANDOFF

**Branch:** <branch-name>
**Agent:** <agy | cursor | kiro | other>
**Date:** <YYYY-MM-DD>

## Done
- <bullet list of what's actually complete and verified>

## In progress / blocked
- <what's half-done, and why it's blocked (missing info, failing test, decision needed)>

## Next steps (max 3)
1. <most important next action>
2. <second>
3. <third, if truly needed>

## Validation status
- `pnpm lint`: <pass/fail/not run>
- `pnpm build`: <pass/fail/not run>
- server `pnpm dev` / `/api/health`: <pass/fail/not run>

## Notes for the next agent
- <anything non-obvious: env vars needed, data assumptions, files intentionally left untouched>
```

## Rules

- **Branch-local only.** `HANDOFF.md` lives on the working branch, never on
  `main`. Delete it (or let the PR that merges the branch drop it) once the
  work is fully done — don't let stale handoffs accumulate in the repo.
- **Cap next steps at 3.** If there are more than 3 real next steps, the task
  is too big for one handoff — split it and note the split instead.
- **Be honest about validation.** Don't write "pass" for a command you didn't
  actually run in this session (see `compsciety-spec` for the commands).
- **No secrets.** Never paste `.env` values, tokens, or credentials into
  `HANDOFF.md`, even temporarily — reference env var *names* only.
- **One file per branch.** If `HANDOFF.md` already exists on the branch,
  update it in place (overwrite stale sections) rather than appending a
  second competing handoff.
- If the receiving agent is Cursor or agy and skills are relevant to the next
  steps, name the specific skill (e.g. "see `compsciety-backend` before
  touching `server/routes/blogs.js`") instead of re-explaining repo structure.
