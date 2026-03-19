#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SUPABASE_DIR="${ROOT_DIR}/supabase"
MIROFISH_DIR="${ROOT_DIR}/MiroFish"
THESIS_DIR="${ROOT_DIR}/thesis-navigator-main"
SUPABASE_PROJECT_ID="starthack"
SUPABASE_PORTS=(54321 54322 54323 54324 54327 54328 54329)
LOCAL_MIROFISH_HOST_URL="http://127.0.0.1:5001"
LOCAL_MIROFISH_EDGE_URL="http://host.docker.internal:5001"
FUNCTIONS_ENV_FILE=""

read_env_value() {
  local file_path="$1"
  local key="$2"

  if [[ ! -f "${file_path}" ]]; then
    return
  fi

  grep -E "^${key}=" "${file_path}" | tail -n 1 | cut -d= -f2-
}

build_functions_env_file() {
  FUNCTIONS_ENV_FILE="$(mktemp "${TMPDIR:-/tmp}/starthack-functions-env.XXXXXX")"

  if [[ -f "${SUPABASE_DIR}/.env" ]]; then
    cat "${SUPABASE_DIR}/.env" > "${FUNCTIONS_ENV_FILE}"
    printf '\n' >> "${FUNCTIONS_ENV_FILE}"
  else
    : > "${FUNCTIONS_ENV_FILE}"
  fi

  {
    echo "MIROFISH_API_URL=${LOCAL_MIROFISH_EDGE_URL}"
    if [[ -n "${MIROFISH_API_KEY_VALUE:-}" ]]; then
      echo "MIROFISH_API_KEY=${MIROFISH_API_KEY_VALUE}"
    fi
  } >> "${FUNCTIONS_ENV_FILE}"
}

wait_for_http_server() {
  local url="$1"
  local service_name="$2"
  local max_attempts="${3:-30}"
  local attempt
  local status_code

  for ((attempt = 1; attempt <= max_attempts; attempt++)); do
    status_code="$(curl -sS -o /dev/null -w "%{http_code}" "${url}" || true)"
    if [[ "${status_code}" != "000" ]]; then
      return 0
    fi
    sleep 1
  done

  echo "Timed out waiting for ${service_name} at ${url}..."
  return 1
}

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
  echo "Stopping local app processes..."
  for pid in "${FUNCTIONS_PID:-}" "${PROXY_PID:-}" "${MIROFISH_BACKEND_PID:-}" "${THESIS_FRONTEND_PID:-}"; do
    if [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null; then
      kill "${pid}" 2>/dev/null || true
    fi
  done

  if [[ -n "${FUNCTIONS_ENV_FILE:-}" && -f "${FUNCTIONS_ENV_FILE}" ]]; then
    rm -f "${FUNCTIONS_ENV_FILE}"
  fi
}

stop_supabase_project() {
  supabase stop --workdir "${ROOT_DIR}" >/dev/null 2>&1 || \
    supabase stop --project-id "${SUPABASE_PROJECT_ID}" >/dev/null 2>&1 || true
}

remove_stale_supabase_containers() {
  local container_ids

  container_ids="$(
    docker ps -a --format '{{.ID}} {{.Names}}' \
      | awk -v project="${SUPABASE_PROJECT_ID}" '$2 ~ ("^supabase_.*_" project "$") { print $1 }'
  )"

  if [[ -n "${container_ids}" ]]; then
    echo "Removing stale Supabase containers for project ${SUPABASE_PROJECT_ID}..."
    docker rm -f ${container_ids} >/dev/null 2>&1 || true
  fi
}

any_supabase_ports_in_use() {
  local port
  for port in "${SUPABASE_PORTS[@]}"; do
    if lsof -ti tcp:"${port}" >/dev/null 2>&1; then
      return 0
    fi
  done
  return 1
}

echo "Cleaning up existing app processes..."
kill_port_processes 4000 "LiteLLM proxy"
kill_port_processes 5001 "MiroFish backend"
kill_port_processes 5173 "Thesis Navigator frontend"

echo "Ensuring Supabase is running..."
if any_supabase_ports_in_use; then
  echo "Supabase ports already in use. Attempting a clean restart of the local project..."
  stop_supabase_project
  remove_stale_supabase_containers
fi

if ! supabase start --workdir "${ROOT_DIR}"; then
  echo "Supabase start failed. Retrying after an explicit stop..."
  stop_supabase_project
  remove_stale_supabase_containers
  supabase start --workdir "${ROOT_DIR}"
fi

echo "Resetting local database..."
supabase db reset --local --workdir "${ROOT_DIR}" --yes

echo "Starting hidden MiroFish engine..."
(cd "${MIROFISH_DIR}" && ./start_proxy.sh) &
PROXY_PID=$!
wait_for_http_server "http://127.0.0.1:4000/health" "LiteLLM proxy"

(cd "${MIROFISH_DIR}/backend" && FLASK_DEBUG=False uv run python run.py) &
MIROFISH_BACKEND_PID=$!
wait_for_http_server "${LOCAL_MIROFISH_HOST_URL}/health" "MiroFish backend"

echo "Starting local edge functions..."
MIROFISH_API_KEY_VALUE="$(read_env_value "${MIROFISH_DIR}/.env" "MIROFISH_API_KEY" || true)"
echo "Using local MiroFish adapter at ${LOCAL_MIROFISH_EDGE_URL} for edge functions..."
build_functions_env_file
(
  cd "${ROOT_DIR}" &&
    supabase functions serve \
      --workdir "${ROOT_DIR}" \
      --env-file "${FUNCTIONS_ENV_FILE}" \
      --no-verify-jwt
) &
FUNCTIONS_PID=$!

echo "Starting Studyond thesis frontend..."
(cd "${THESIS_DIR}" && npm run dev -- --host 0.0.0.0 --port 5173 --strictPort) &
THESIS_FRONTEND_PID=$!

trap cleanup INT TERM EXIT

echo ""
echo "Application started:"
echo "  Thesis frontend:   http://localhost:5173"
echo "  Supabase gateway:  http://127.0.0.1:54321"
echo "  MiroFish backend:  ${LOCAL_MIROFISH_HOST_URL}"
echo "  Edge -> MiroFish:  ${LOCAL_MIROFISH_EDGE_URL}"
echo "  LiteLLM proxy:     http://0.0.0.0:4000"
echo ""
echo "Press Ctrl+C to stop the local app processes."

set +e
wait -n "${FUNCTIONS_PID}" "${PROXY_PID}" "${MIROFISH_BACKEND_PID}" "${THESIS_FRONTEND_PID}"
EXIT_CODE=$?
set -e

echo "A service exited unexpectedly. Shutting down the rest..."
exit "${EXIT_CODE}"
