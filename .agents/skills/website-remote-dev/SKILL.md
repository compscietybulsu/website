---
name: website-remote-dev
description: >-
  Improves remote development for this website — GitHub Codespaces, Dev
  Containers, port forwarding, postCreate installs, and contributor onboarding
  without a local Mongo install. Triggers: Codespaces, Dev Container,
  .devcontainer, remote dev, ports 3000/5000, postCreate, act in Codespaces.
---

# Website Remote Dev

**Current org priority #2.** Contributors should open the repo in Codespaces
or VS Code Dev Containers and get a working frontend + API toolchain without
tribal knowledge.

## What already exists

- `.devcontainer/devcontainer.json` — Node 22, pnpm 10, act; features from
  `compscietybulsu/devcontainer`
- `.devcontainer/post-create.sh` — `pnpm install` for root and `server/`
- Ports **3000** (Next) and **5000** (Express) forwarded
- Org sandbox reference: `compscietybulsu/codespace`

## Target outcome

1. Fresh Codespace: postCreate succeeds; `pnpm dev` (root) and `pnpm dev`
   (`server/`) are documented and runnable.
2. Env setup is copy-paste from `.env.example` / `server/.env.example` — no
   secrets in the image.
3. Mongo is optional for frontend-only work; document “bring your own Atlas
   URI” (and optional Podman Mongo later — issue #22, not blocking).
4. Port labels / auto-forward stay accurate; README Codespaces section stays
   truthful.
5. `act` remains available for CI dry-runs inside the container when Podman/
   Docker-in-Docker works; document failures honestly if the nested runtime
   is flaky.

## Suggested sequence

1. Verify `.devcontainer/` on a clean Codespace; fix postCreate if install
   fails (pnpm version, lockfile, server install).
2. Document remote runbook in README (open Codespace → copy env → two
   terminals).
3. Ensure `NEXT_PUBLIC_API_URL` defaults make sense for forwarded port 5000.
4. Do not replace Podman-with-Docker in docs; the feature may use
   docker-in-docker under Codespaces — keep project wording Podman-first for
   local/homelab, and Codespaces-accurate for remote.
5. Link from `AGENTS.md` P0 table — tracker [#26](https://github.com/compscietybulsu/website/issues/26).

## Guardrails

- pnpm only inside the container and docs.
- Never bake real secrets into `devcontainer.json` or features.
- Keep Dev Container changes small and reviewable; prefer org feature images
  over bespoke Dockerfiles unless necessary.

## Related skills

- `website-deploy-cf` — production hosting (different from contributor remote)
- `website-backend-prep` — API env / health for remote + prod
- `website-spec` — update SPEC if local-dev architecture notes change
