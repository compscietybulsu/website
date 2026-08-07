#!/usr/bin/env bash
# Install frontend and API deps after the container is created.
set -euo pipefail

echo "== CompSciety website: post-create =="
node --version
pnpm --version

pnpm install --frozen-lockfile
(cd server && pnpm install --frozen-lockfile)

echo "== deps ready: pnpm dev (3000) / cd server && pnpm dev (5000) =="
