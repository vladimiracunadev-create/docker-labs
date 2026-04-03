#!/usr/bin/env bash
set -euo pipefail

COMPOSE_PATH="${1:-}"

if [[ -z "${COMPOSE_PATH}" ]]; then
  echo "Uso: $0 <ruta/compose.yml>"
  exit 2
fi

if [[ ! -f "${COMPOSE_PATH}" ]]; then
  echo "No existe el compose: ${COMPOSE_PATH}"
  exit 2
fi

DIR="$(dirname "${COMPOSE_PATH}")"
FILE="$(basename "${COMPOSE_PATH}")"

# Slug seguro para proyecto (evita nombres raros que rompen imágenes / refs)
slugify() {
  local s="$1"
  s="${s,,}"                                 # lowercase
  s="$(echo "$s" | sed 's|^\./||g')"          # remove leading ./
  s="$(echo "$s" | sed 's|[^a-z0-9]|-|g')"    # non-alnum -> -
  s="$(echo "$s" | sed 's|-\\{2,\\}|-|g')"    # compress --
  s="$(echo "$s" | sed 's|^-||; s|-$||')"     # trim - edges
  [[ -z "$s" ]] && s="root"
  echo "$s"
}

BASE="$(slugify "${COMPOSE_PATH}")"
RUN_ID="${GITHUB_RUN_ID:-local}"
RUN_ATTEMPT="${GITHUB_RUN_ATTEMPT:-0}"

PROJECT="ci-${BASE}-${RUN_ID}-${RUN_ATTEMPT}"

if [[ "${COMPOSE_PATH}" == "dashboard-control/docker-compose.yml" ]]; then
  REPO_ROOT="$(pwd -P)"
  export CONTROL_CENTER_WORKSPACE_SOURCE="${REPO_ROOT}"
  export CONTROL_CENTER_DOCKER_SOURCE="${REPO_ROOT}"
  export CONTROL_CENTER_DOCKER_TARGET="${REPO_ROOT}"
fi

compose() {
  docker compose -p "${PROJECT}" --project-directory "${DIR}" -f "${COMPOSE_PATH}" "$@"
}

http_checks_for_compose() {
  case "${COMPOSE_PATH}" in
    "01-node-api/docker-compose.yml")
      echo "http://localhost:3000/health"
      ;;
    "02-php-lamp/docker-compose.yml")
      echo "http://localhost:8081"
      ;;
    "03-python-api/docker-compose.yml")
      echo "http://localhost:5000/health"
      ;;
    "04-redis-cache/docker-compose.yml")
      echo "http://localhost:3001/health"
      ;;
    "05-postgres-api/docker-compose.yml")
      echo "http://localhost:8000/health http://localhost:8000/ready http://localhost:8000/summary http://localhost:8000/insights http://localhost:8000/metrics"
      ;;
    "06-nginx-proxy/docker-compose.yml")
      echo "http://localhost:8085/gateway-health"
      ;;
    "07-rabbitmq-messaging/docker-compose.yml")
      echo "http://localhost:15672"
      ;;
    "08-prometheus-grafana/docker-compose.yml")
      echo "http://localhost:9091/-/ready"
      ;;
    "09-multi-service-app/docker-compose.yml")
      echo "http://localhost:8083 http://localhost:3003/api/health"
      ;;
    "10-go-api/docker-compose.yml")
      echo "http://localhost:8084/health"
      ;;
    "11-elasticsearch-search/docker-compose.yml")
      echo "http://localhost:8001/health"
      ;;
    "dashboard-control/docker-compose.yml")
      echo "http://localhost:9090/api/overview"
      ;;
    *)
      echo ""
      ;;
  esac
}

run_http_checks() {
  local urls="$1"
  [[ -z "${urls}" ]] && return 0

  echo "::group::HTTP checks ${COMPOSE_PATH}"
  for url in ${urls}; do
    local ok=0
    for attempt in $(seq 1 20); do
      if curl --fail --silent --show-error --max-time 30 "${url}" >/dev/null; then
        echo "OK ${url}"
        ok=1
        break
      fi
      echo "Esperando ${url} (intento ${attempt}/20)..."
      sleep 3
    done

    if [[ "${ok}" -ne 1 ]]; then
      echo "Fallo check HTTP para ${url}"
      echo "::endgroup::"
      return 1
    fi
  done
  echo "::endgroup::"
}

cleanup() {
  echo "::group::Cleanup ${PROJECT}"
  compose down -v --remove-orphans || true
  echo "::endgroup::"
}
trap cleanup EXIT

echo "::group::Up ${COMPOSE_PATH}"
docker version || true
docker compose version
compose up -d --build
compose ps || true
echo "::endgroup::"

TIMEOUT_SEC="${CI_TIMEOUT_SEC:-180}"
DEADLINE=$(( $(date +%s) + TIMEOUT_SEC ))

echo "Esperando contenedores (timeout ${TIMEOUT_SEC}s) para ${COMPOSE_PATH} ..."

while true; do
  ids="$(compose ps -q || true)"

  if [[ -z "${ids}" ]]; then
    echo "⏳ Aún no aparecen contenedores en el proyecto ${PROJECT}."
    compose ps || true
  else
    bad=0
    pending=0

    for id in ${ids}; do
      name="$(docker inspect -f '{{.Name}}' "${id}" | sed 's|^/||')"
      state="$(docker inspect -f '{{.State.Status}}' "${id}")"
      health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "${id}")"

      if [[ "${state}" != "running" ]]; then
        echo "❌ ${name} state=${state} health=${health}"
        bad=1
        continue
      fi

      if [[ "${health}" == "unhealthy" ]]; then
        echo "❌ ${name} state=${state} health=unhealthy"
        bad=1
        continue
      fi

      if [[ "${health}" == "starting" ]]; then
        echo "⏳ ${name} state=${state} health=starting"
        pending=1
        continue
      fi

      # health=none => no healthcheck definido => OK si está running
      echo "✅ ${name} state=${state} health=${health}"
    done

    if [[ "${bad}" -eq 0 && "${pending}" -eq 0 ]]; then
      echo "OK: contenedores listos para ${COMPOSE_PATH}"
      break
    fi

    if [[ "${bad}" -ne 0 ]]; then
      echo "::group::compose ps"
      compose ps || true
      echo "::endgroup::"

      echo "::group::compose logs (tail=200)"
      compose logs --no-color --tail=200 || true
      echo "::endgroup::"
      exit 1
    fi
  fi

  if [[ $(date +%s) -ge ${DEADLINE} ]]; then
    echo "⏰ Timeout esperando health/running para ${COMPOSE_PATH}"

    echo "::group::compose ps"
    compose ps || true
    echo "::endgroup::"

    echo "::group::compose logs (tail=200)"
    compose logs --no-color --tail=200 || true
    echo "::endgroup::"

    exit 1
  fi

  sleep 5
done

HTTP_CHECKS="$(http_checks_for_compose)"
run_http_checks "${HTTP_CHECKS}"
