# CompSciety Website

Official website for the Computer Science Society, built with Next.js (App Router) + Tailwind CSS v4.

## Getting started

```bash
pnpm install
pnpm dev
```

API (separate package under `server/`):

```bash
cd server && pnpm install && pnpm dev
```

## Codespaces / Dev Containers

This repo includes [`.devcontainer/`](.devcontainer/) (Node 22, pnpm 10, act). Features come from [`compscietybulsu/devcontainer`](https://github.com/compscietybulsu/devcontainer); the org sandbox is [`compscietybulsu/codespace`](https://github.com/compscietybulsu/codespace). Open in GitHub Codespaces or VS Code Dev Containers — `postCreate` runs `pnpm install` for the frontend and `server/`. Ports **3000** (Next) and **5000** (Express) are forwarded.
