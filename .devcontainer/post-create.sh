#!/usr/bin/env bash
# Install frontend and API deps after the container is created.
# Frozen lockfiles only. Never copy or invent secrets here.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "== CompSciety website: post-create =="

if ! command -v node >/dev/null 2>&1; then
  echo "error: node not on PATH (devcontainer node feature missing?)" >&2
  exit 1
fi
if ! command -v pnpm >/dev/null 2>&1; then
  echo "error: pnpm not on PATH (devcontainer node feature missing?)" >&2
  exit 1
fi

node --version
pnpm --version

if [[ ! -f pnpm-lock.yaml ]]; then
  echo "error: missing root pnpm-lock.yaml" >&2
  exit 1
fi
if [[ ! -f server/pnpm-lock.yaml ]]; then
  echo "error: missing server/pnpm-lock.yaml" >&2
  exit 1
fi

# Refuse to mutate lockfiles during create (CI-style frozen install).
export CI="${CI:-true}"

echo "== pnpm install (root, frozen) =="
pnpm install --frozen-lockfile

echo "== pnpm install (server/, frozen) =="
(cd server && pnpm install --frozen-lockfile)

echo "== deps ready =="
echo "  Frontend: pnpm dev                 → port 3000"
echo "  API:      cd server && pnpm dev    → port 5000"
echo "  Env:      cp .env.example .env.local"
echo "            cp server/.env.example server/.env"
echo "  Secrets stay out of the image — fill env files yourself."
