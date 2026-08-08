# CompSciety Website

Official website for the Computer Science Society (CompSciety, BulSU).

Two apps in this repo:
- **Frontend** (repo root) — Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend** (`server/`) — Express 5, Mongoose (MongoDB), JWT admin auth, Cloudinary image uploads

Read [`AGENTS.md`](./AGENTS.md) for repo guardrails and
[`SPEC.md`](./SPEC.md) for the full product contract (architecture, API
contracts, feature checklist, and known gaps).

Package manager: **pnpm** only. Do not use `npm` or `yarn`.

Deploy the public Next.js frontend to Cloudflare Workers (OpenNext): see
[`docs/deploy.md`](./docs/deploy.md). Commands: `pnpm preview` / `pnpm deploy`.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation)
- A MongoDB connection string (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Cloudinary](https://cloudinary.com/) account (for admin blog image uploads)

## Setup

Frontend (repo root):

```bash
pnpm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_API_URL in .env.local
```

Backend (`server/`):

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
cd server
pnpm install
cp .env.example .env
# fill in MONGODB_URI, JWT_SECRET, CLOUDINARY_*, etc. in .env
```

See `.env.example` and `server/.env.example` for the full list of required
variables — no real values are committed anywhere in this repo.

## Running locally

Run both dev servers in separate terminals.

Backend:

```bash
cd server
pnpm dev
```

Frontend (from repo root):

```bash
pnpm dev
```

The frontend expects the backend reachable at `NEXT_PUBLIC_API_URL`
(optional — omit it to ship the site shell without live API data; see
[`docs/deploy.md`](./docs/deploy.md)). Example for local API:
`http://localhost:5000` in `.env.local`.

## Creating an admin account

Admin accounts are not self-service. Create one from the backend:

```bash
cd server
node scripts/createAdmin.js <username> <password>
```

Then log in at `/admin`.

## Other scripts

Frontend:

Open a Terminal and type the following
```bash
npm install
npm run dev
```
Open a separate Terminal and type the following
```bash
npm install
npm run dev
```
