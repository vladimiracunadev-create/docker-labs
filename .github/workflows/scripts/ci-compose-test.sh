#!/usr/bin/env bash
set -euo pipefail

STACK_DIR="${1:?Debes pasar el directorio, ej: 02-php-lamp}"
COMPOSE_NAME="${2:-docker-compose.yml}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/${STACK_DIR}/${COMPOSE_NAME}"

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  echo "❌ No existe: ${COMPOSE_FILE}"
  exit 2
fi

RUN_ID="${GITHUB_RUN_ID:-local}"
ATTEMPT="${GITHUB_RUN_ATTEMPT:-0}"

# Construye un project name válido para Docker/Compose (sin ___, sin espacios, etc.)
BASE="ci-${STACK_DIR}-${RUN_ID}-${ATTEMPT}"
PROJECT="$(echo "${BASE}" \
  | tr '[:upper:]' '[:lower:]' \
  | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g; s/-+/-/g')"

# Recorta por seguridad (evita nombres ridículamente largos)
PROJECT="${PROJECT:0:60}"

echo "==> 🚀 UP + BUILD: ${STACK_DIR}/${COMPOSE_NAME} (project=${PROJECT})"

cleanup() {
  echo "==> 🧹 Cleanup (${STACK_DIR}/${COMPOSE_NAME})"
  docker compose -p "${PROJECT}" -f "${COMPOSE_FILE}" down -v --remove-orphans >/dev/null 2>&1 || true
}
trap cleanup EXIT

# Valida el compose (falla rápido si hay variables/formato mal)
docker compose -p "${PROJECT}" -f "${COMPOSE_FILE}" config >/dev/null

docker compose -p "${PROJECT}" -f "${COMPOSE_FILE}" up -d --build --remove-orphans

echo "==> 📦 Estado"
docker compose -p "${PROJECT}" -f "${COMPOSE_FILE}" ps

MAX_WAIT="${CI_WAIT_SECONDS:-240}"
echo "==> ⏳ Esperando contenedores RUNNING/HEALTHY (máx ${MAX_WAIT}s)"

end=$((SECONDS + MAX_WAIT))
while (( SECONDS < end )); do
  all_ok=1

  mapfile -t cids < <(docker compose -p "${PROJECT}" -f "${COMPOSE_FILE}" ps -q)

  # Si no hay contenedores, algo salió mal
  if [[ ${#cids[@]} -eq 0 ]]; then
    echo "❌ No hay contenedores levantados (ps -q vacío)."
    docker compose -p "${PROJECT}" -f "${COMPOSE_FILE}" ps || true
    exit 1
  fi

  for cid in "${cids[@]}"; do
    status="$(docker inspect -f '{{.State.Status}}' "${cid}" 2>/dev/null || echo "unknown")"
    health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}nohealth{{end}}' "${cid}" 2>/dev/null || echo "nohealth")"

    # Si alguno se cae => FAIL inmediato (tu caso MariaDB)
    if [[ "${status}" == "exited" || "${status}" == "dead" ]]; then
      echo "❌ Contenedor malo: ${cid} status=${status} health=${health}"
      docker logs --tail 200 "${cid}" || true
      exit 1
    fi

    # Si tiene healthcheck: exigir healthy
    if [[ "${health}" != "nohealth" ]]; then
      if [[ "${health}" != "healthy" ]]; then
        all_ok=0
      fi
    else
      # Si no tiene healthcheck: exigir running
      if [[ "${status}" != "running" ]]; then
        all_ok=0
      fi
    fi
  done

  if [[ "${all_ok}" -eq 1 ]]; then
    echo "✅ OK: contenedores RUNNING/HEALTHY"
    exit 0
  fi

  sleep 3
done

echo "❌ Timeout esperando contenedores"
docker compose -p "${PROJECT}" -f "${COMPOSE_FILE}" ps || true
exit 1
