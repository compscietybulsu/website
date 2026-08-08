# CompSciety Website

Official website for the Computer Science Society (CompSciety, BulSU).

Two apps in this repo:
- **Frontend** (repo root) — Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend** (`server/`) — Express 5, Mongoose (MongoDB), JWT admin auth, Cloudinary image uploads

Read [`AGENTS.md`](./AGENTS.md) for repo guardrails and
[`SPEC.md`](./SPEC.md) for the full product contract (architecture, API
contracts, feature checklist, and known gaps).

Package manager: **pnpm** only. Do not use `npm` or `yarn`.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/installation)
- A MongoDB connection string (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas)) when running the API
- A [Cloudinary](https://cloudinary.com/) account (for admin blog image uploads)

## Setup

Frontend (repo root):

```bash
pnpm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL (e.g. http://localhost:5000)
```

Backend (`server/`):

```bash
cd server
pnpm install
cp .env.example .env
# set MONGODB_URI, JWT_SECRET, CLOUDINARY_*, etc.
```

See `.env.example` and `server/.env.example` for the full list of required
variables — no real values are committed anywhere in this repo.

## Codespaces / Dev Containers

Use this path when you do not have a fully provisioned local machine.

This repo includes [`.devcontainer/`](.devcontainer/) (Node 22, pnpm 10, act).
Features come from [`compscietybulsu/devcontainer`](https://github.com/compscietybulsu/devcontainer);
the org sandbox is [`compscietybulsu/codespace`](https://github.com/compscietybulsu/codespace).

**Open:** GitHub → Code → Codespaces → Create codespace, or VS Code / Cursor
**Dev Containers: Reopen in Container**. `postCreate` runs
`pnpm install --frozen-lockfile` at the repo root and in `server/`.
No secrets are baked into the image.

### Env copy (after create)

```bash
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000 when the API runs in the same Codespace

cp server/.env.example server/.env
# For API work: MONGODB_URI (Atlas), JWT_SECRET, CLOUDINARY_*
```

Names only in the examples — fill real values locally; never commit them.

### Ports

| Port | Command | Purpose |
|---|---|---|
| **3000** | `pnpm dev` (repo root) | Next.js frontend |
| **5000** | `cd server && pnpm dev` | Express API |

Both ports are forwarded and labeled in `devcontainer.json`.

### Run both apps

Two terminals:

```bash
# terminal 1 — API
cd server && pnpm dev

# terminal 2 — frontend (repo root)
pnpm dev
```

### Frontend-only (no Mongo)

You can work on the Next.js UI without MongoDB or Express. Skip `server/.env`
and do not start the API. Pages that do not call the backend will load; API-backed
pages fail until `NEXT_PUBLIC_API_URL` points at a running server.

### API + MongoDB Atlas

For admin/blog API work, create a free [MongoDB Atlas](https://www.mongodb.com/atlas)
cluster and set `MONGODB_URI` in `server/.env`, plus `JWT_SECRET` and Cloudinary
vars as needed. A local Podman Mongo compose stack is out of scope for this path.

### pnpm only

Use **pnpm** exclusively. Root and `server/` each have a `pnpm-lock.yaml`.
Do not introduce `package-lock.json` workflows or `npm`/`yarn` install steps.

### Podman locally vs docker-in-docker in Codespaces

This project's local container convention is **Podman-first** (see `AGENTS.md`).
GitHub Codespaces and the checked-in Dev Container use Microsoft's
**docker-in-docker** feature because that is what Codespaces supports today.
Prefer Podman on your laptop; use the Codespaces DinD path only inside the remote
environment. Do not bake secrets into either image.

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
(defaults to nothing — you must set it in `.env.local`, e.g.
`http://localhost:5000`).

## Creating an admin account

Admin accounts are not self-service. Create one from the backend:

```bash
cd server
node scripts/createAdmin.js <username> <password>
```

Then log in at `/admin`.
