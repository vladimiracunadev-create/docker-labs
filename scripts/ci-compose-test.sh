#!/usr/bin/env bash
set -euo pipefail

DIR="${1:-}"
FILE="${2:-}"

if [[ -z "${DIR}" || -z "${FILE}" ]]; then
  echo "Uso: $0 <dir> <file>"
  echo "Ej:  $0 02-php-lamp docker-compose.yml"
  echo "Ej:  $0 . docker-compose-dashboard-simple.yml"
  exit 2
fi

if [[ "${DIR}" == "." ]]; then
  COMPOSE_PATH="${FILE}"
else
  COMPOSE_PATH="${DIR%/}/${FILE}"
fi

if [[ ! -f "${COMPOSE_PATH}" ]]; then
  echo "❌ No existe el compose: ${COMPOSE_PATH}"
  exit 2
fi

# --- Defaults de variables típicas (NO pisan si ya vienen definidas)
export DB_NAME="${DB_NAME:-appdb}"
export DB_USER="${DB_USER:-appuser}"
export DB_PASS="${DB_PASS:-apppass}"
export DB_ROOT="${DB_ROOT:-rootpass}"
# Si algún compose usa directamente vars estándar MySQL/MariaDB, esto ayuda sin romper nada:
export MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-$DB_ROOT}"
export MARIADB_ROOT_PASSWORD="${MARIADB_ROOT_PASSWORD:-$DB_ROOT}"
export MARIADB_ALLOW_EMPTY_ROOT_PASSWORD="${MARIADB_ALLOW_EMPTY_ROOT_PASSWORD:-1}"

# --- Project name seguro (sin "___" que rompe nombres de imagen)
# slug desde el path: solo [a-z0-9-] y colapsa separadores
slug="$(echo "${COMPOSE_PATH}" \
  | tr '[:upper:]' '[:lower:]' \
  | sed -E 's|[^a-z0-9]+|-|g; s/^-+//; s/-+$//; s/-+/-/g')"

run_id="${GITHUB_RUN_ID:-local}"
attempt="${GITHUB_RUN_ATTEMPT:-0}"

PROJECT="ci-${run_id}-${attempt}-${slug}"
# Limitar longitud por seguridad (nombres de red/contener pueden crecer mucho)
PROJECT="${PROJECT:0:60}"
PROJECT="$(echo "${PROJECT}" | sed -E 's/-+$//')"

TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-240}"

echo "==> 🧪 Compose test"
echo "    - path   : ${COMPOSE_PATH}"
echo "    - project: ${PROJECT}"
echo "    - timeout: ${TIMEOUT_SECONDS}s"

cleanup() {
  echo "==> 🧹 Cleanup (${COMPOSE_PATH})"
  docker compose -f "${COMPOSE_PATH}" -p "${PROJECT}" down -v --remove-orphans >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "==> 🚀 Up (build)"
docker compose -f "${COMPOSE_PATH}" -p "${PROJECT}" up -d --build

echo "==> 📦 Estado"
docker compose -f "${COMPOSE_PATH}" -p "${PROJECT}" ps || true

echo "==> ⏳ Esperando contenedores RUNNING/HEALTHY (máx ${TIMEOUT_SECONDS}s)"
start="$(date +%s)"

# Servicios cuyo healthcheck NO queremos convertir en FAIL (caso dashboard nginx-proxy)
# - “unhealthy” se deja como warning si el contenedor sigue RUNNING.
ALLOW_UNHEALTHY_SERVICES=("nginx-proxy")

is_allow_unhealthy() {
  local svc="$1"
  for x in "${ALLOW_UNHEALTHY_SERVICES[@]}"; do
    [[ "${svc}" == "${x}" ]] && return 0
  done
  return 1
}

while true; do
  mapfile -t cids < <(docker compose -f "${COMPOSE_PATH}" -p "${PROJECT}" ps -q || true)

  if [[ "${#cids[@]}" -eq 0 ]]; then
    echo "❌ No se detectaron contenedores para el proyecto (ps -q vacío)."
    docker compose -f "${COMPOSE_PATH}" -p "${PROJECT}" ps || true
    echo "==> Logs (últimas 200 líneas)"
    docker compose -f "${COMPOSE_PATH}" -p "${PROJECT}" logs --no-color --tail=200 || true
    exit 1
  fi

  all_ok="true"
  hard_fail="false"

  for cid in "${cids[@]}"; do
    status="$(docker inspect -f '{{.State.Status}}' "${cid}" 2>/dev/null || echo "unknown")"
    health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}nohealth{{end}}' "${cid}" 2>/dev/null || echo "unknown")"
    name="$(docker inspect -f '{{.Name}}' "${cid}" 2>/dev/null | sed 's|^/||' || true)"
    svc="$(docker inspect -f '{{index .Config.Labels "com.docker.compose.service"}}' "${cid}" 2>/dev/null || echo "")"

    # Si algún contenedor se cayó -> FAIL inmediato
    if [[ "${status}" != "running" ]]; then
      echo "❌ Contenedor no está RUNNING: name=${name:-?} service=${svc:-?} status=${status} health=${health}"
      hard_fail="true"
      all_ok="false"
      continue
    fi

    # Si tiene healthcheck:
    if [[ "${health}" == "starting" ]]; then
      all_ok="false"
      continue
    fi

    if [[ "${health}" == "unhealthy" ]]; then
      if is_allow_unhealthy "${svc}"; then
        # warning, pero no bloquea
        echo "⚠️  Healthcheck UNHEALTHY permitido: service=${svc} name=${name}"
      else
        echo "❌ Healthcheck UNHEALTHY: service=${svc} name=${name}"
        hard_fail="true"
        all_ok="false"
      fi
    fi
  done

  if [[ "${hard_fail}" == "true" ]]; then
    echo "==> 🧾 ps"
    docker compose -f "${COMPOSE_PATH}" -p "${PROJECT}" ps || true
    echo "==> Logs (últimas 200 líneas)"
    docker compose -f "${COMPOSE_PATH}" -p "${PROJECT}" logs --no-color --tail=200 || true
    exit 1
  fi

  if [[ "${all_ok}" == "true" ]]; then
    echo "✅ OK: contenedores RUNNING y healthchecks (cuando aplican) resueltos."
    break
  fi

  now="$(date +%s)"
  if (( now - start >= TIMEOUT_SECONDS )); then
    echo "❌ Timeout esperando contenedores"
    docker compose -f "${COMPOSE_PATH}" -p "${PROJECT}" ps || true
    echo "==> Logs (últimas 200 líneas)"
    docker compose -f "${COMPOSE_PATH}" -p "${PROJECT}" logs --no-color --tail=200 || true
    exit 1
  fi

  sleep 3
done
