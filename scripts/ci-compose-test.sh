#!/usr/bin/env bash
set -euo pipefail

LAB_DIR="${1:-.}"
COMPOSE_FILE="${2:-docker-compose.yml}"

ROOT="${GITHUB_WORKSPACE:-$(pwd)}"

if [[ ! -d "${ROOT}/${LAB_DIR}" ]]; then
  echo "❌ No existe el directorio: ${LAB_DIR}"
  exit 1
fi

cd "${ROOT}/${LAB_DIR}"

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "❌ No existe el compose: ${LAB_DIR}/${COMPOSE_FILE}"
  exit 1
fi

# Project name seguro (sirve para docker compose y evita nombres raros)
raw="${LAB_DIR}"
if [[ -z "${raw}" || "${raw}" == "." ]]; then raw="root"; fi

safe="$(
  echo "${raw}" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-+/-/g'
)"
if [[ -z "${safe}" ]]; then safe="root"; fi

export COMPOSE_PROJECT_NAME="ci-${safe}-${GITHUB_RUN_ID:-local}-${GITHUB_RUN_ATTEMPT:-0}"

compose() {
  docker compose -f "${COMPOSE_FILE}" "$@"
}

cleanup() {
  echo "==> 🧹 Cleanup (${LAB_DIR}/${COMPOSE_FILE})"
  compose down -v --remove-orphans >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "==> 🚀 UP + BUILD: ${LAB_DIR}/${COMPOSE_FILE} (project=${COMPOSE_PROJECT_NAME})"
compose up -d --build

echo "==> 📦 Estado"
compose ps || true

# Espera RUNNING o HEALTHY (máx 240s)
echo "==> ⏳ Esperando contenedores RUNNING/HEALTHY (máx 240s)"
deadline=$((SECONDS+240))

mapfile -t ids < <(compose ps -q 2>/dev/null || true)
if [[ "${#ids[@]}" -eq 0 ]]; then
  echo "❌ No se crearon contenedores."
  compose ps || true
  compose logs --no-color --tail=250 || true
  exit 1
fi

while true; do
  bad=0
  ok=0

  mapfile -t ids < <(compose ps -q 2>/dev/null || true)

  for id in "${ids[@]}"; do
    status="$(docker inspect -f '{{.State.Status}}' "${id}" 2>/dev/null || echo "unknown")"
    health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}nohealth{{end}}' "${id}" 2>/dev/null || echo "unknown")"

    # estados “malos”
    if [[ "${status}" == "exited" || "${status}" == "dead" || "${status}" == "restarting" ]]; then
      bad=1
      echo "❌ Contenedor malo: ${id} status=${status} health=${health}"
    fi

    # ok si está running y health es healthy o no tiene healthcheck
    if [[ "${status}" == "running" && ( "${health}" == "healthy" || "${health}" == "nohealth" ) ]]; then
      ok=$((ok+1))
    fi
  done

  if [[ "${bad}" -eq 1 ]]; then
    compose ps || true
    compose logs --no-color --tail=250 || true
    exit 1
  fi

  if [[ "${ok}" -eq "${#ids[@]}" ]]; then
    break
  fi

  if (( SECONDS >= deadline )); then
    echo "⚠️ Timeout esperando RUNNING/HEALTHY"
    compose ps || true
    compose logs --no-color --tail=250 || true
    exit 1
  fi

  sleep 3
done

echo "==> ✅ OK: ${LAB_DIR}/${COMPOSE_FILE}"
