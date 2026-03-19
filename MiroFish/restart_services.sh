#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

kill_port_processes() {
  local port="$1"
  local service_name="$2"
  local pids

  pids="$(lsof -ti tcp:"${port}" 2>/dev/null || true)"
  if [[ -z "${pids}" ]]; then
    return
  fi

  echo "Stopping ${service_name} on port ${port} (PID: ${pids})..."
  kill ${pids} 2>/dev/null || true
  sleep 1

  local remaining
  remaining="$(lsof -ti tcp:"${port}" 2>/dev/null || true)"
  if [[ -n "${remaining}" ]]; then
    echo "Force-stopping ${service_name} on port ${port} (PID: ${remaining})..."
    kill -9 ${remaining} 2>/dev/null || true
  fi
}

cleanup() {
  echo ""
  echo "Stopping all services..."
  for pid in "${PROXY_PID:-}" "${BACKEND_PID:-}" "${FRONTEND_PID:-}"; do
    if [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null; then
      kill "${pid}" 2>/dev/null || true
    fi
  done
}

echo "Cleaning up existing services..."
kill_port_processes 4000 "LiteLLM proxy"
kill_port_processes 5001 "Backend API"
kill_port_processes 3000 "Frontend UI"

echo "Starting services..."
(cd "${ROOT_DIR}" && ./start_proxy.sh) &
PROXY_PID=$!

(cd "${ROOT_DIR}/backend" && ./venv/bin/python3 run.py) &
BACKEND_PID=$!

(cd "${ROOT_DIR}/frontend" && npm run dev) &
FRONTEND_PID=$!

trap cleanup INT TERM EXIT

echo ""
echo "Services started:"
echo "  LiteLLM proxy: http://0.0.0.0:4000 (PID ${PROXY_PID})"
echo "  Backend API:   http://localhost:5001 (PID ${BACKEND_PID})"
echo "  Frontend UI:   http://localhost:3000 (PID ${FRONTEND_PID})"
echo ""
echo "Press Ctrl+C to stop all services."

set +e
wait -n "${PROXY_PID}" "${BACKEND_PID}" "${FRONTEND_PID}"
EXIT_CODE=$?
set -e

echo "A service exited unexpectedly. Shutting down the rest..."
exit "${EXIT_CODE}"
