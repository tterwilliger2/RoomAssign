#!/usr/bin/env bash
set -euo pipefail

# Ensure venv
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
. .venv/bin/activate

# Install backend deps if missing
if ! python -c "import fastapi" >/dev/null 2>&1; then
  pip install -r backend/requirements.txt
fi

# Start backend and frontend concurrently
(uvicorn backend.app.main:app --reload --host ${API_HOST:-127.0.0.1} --port ${API_PORT:-8000}) &
BACK_PID=$!

pushd frontend >/dev/null
if [ ! -f package.json ]; then
  npm create vite@latest . -- --template react-ts >/dev/null 2>&1 || true
fi
npm install >/dev/null 2>&1 || true
npm run dev -- --host &
FRONT_PID=$!
popd >/dev/null

# Wait on both; forward Ctrl-C
trap "kill $BACK_PID $FRONT_PID 2>/dev/null || true" INT TERM
wait $BACK_PID $FRONT_PID
