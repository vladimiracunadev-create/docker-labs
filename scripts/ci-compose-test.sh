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

# -----------------------------------------------------------------------------
# Project name seguro:
# - Válido para docker compose
# - Y (clave) si algún compose lo usa en `image: ${COMPOSE_PROJECT_NAME}-...`,
#   también debe ser válido como referencia de imagen Docker (sin separadores repetidos)
# -----------------------------------------------------------------------------
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

echo "==> 🚀 UP + BUILD: ${LAB_DIR}/${COMPOSE_FILE}  (project=${COMPOSE_PROJECT_NAME})"
compose up -d --build

echo "==> Estado inicial"
compose ps || true
docker ps -a --filter "label=com.docker.compose.project=${COMPOSE_PROJECT_NAME}" || true

# -----------------------------------------------------------------------------
# Espera a que todos estén RUNNING (no exited/restarting)
# -----------------------------------------------------------------------------
echo "==> ⏳ Esperando contenedores RUNNING (máx 240s)"
deadline=$((SECONDS+240))

while true; do
  mapfile -t ids < <(compose ps -q 2>/dev/null || true)
  total="${#ids[@]}"

  if [[ "${total}" -eq 0 ]]; then
    echo "❌ No se crearon contenedores (total=0)."
    compose ps || true
    compose logs --no-color --tail=250 || true
    exit 1
  fi

  bad=0
  running=0

  for id in "${ids[@]}"; do
    st="$(docker inspect -f '{{.State.Status}}' "${id}" 2>/dev/null || echo "unknown")"
    case "${st}" in
      running) running=$((running+1)) ;;
      exited|dead|removing|restarting|paused)
        bad=1
        echo "❌ Contenedor con estado problemático: ${id} => ${st}"
        ;;
      *) : ;;
    esac
  done

  if [[ "${bad}" -eq 1 ]]; then
    compose ps || true
    compose logs --no-color --tail=250 || true
    exit 1
  fi

  if [[ "${running}" -eq "${total}" ]]; then
    break
  fi

  if (( SECONDS >= deadline )); then
    echo "⚠️ Timeout esperando RUNNING (total=${total}, running=${running})"
    compose ps || true
    compose logs --no-color --tail=250 || true
    exit 1
  fi

  sleep 3
done

# -----------------------------------------------------------------------------
# Smoke test HTTP:
# Por defecto: basta con que responda (code != 000).
# Si quieres estricto (2xx-4xx): exporta CI_HTTP_STRICT=1 en el workflow.
# -----------------------------------------------------------------------------
candidate_container_ports=(80 3000 5000 8000 8080 9090 9200 15672)
strict="${CI_HTTP_STRICT:-0}"

echo "==> Buscando puertos HTTP para smoke test"
services="$(compose config --services 2>/dev/null || true)"

found_any=0
ok_any=0

for svc in ${services}; do
  for cport in "${candidate_container_ports[@]}"; do
    if out="$(compose port "${svc}" "${cport}" 2>/dev/null)"; then
      host_port="$(echo "${out}" | head -n1 | sed -E 's/.*:([0-9]+)$/\1/' || true)"
      if [[ -n "${host_port}" ]]; then
        found_any=1
        url="http://localhost:${host_port}"
        echo " - candidato: ${svc}:${cport} -> ${url}"

        deadline2=$((SECONDS+240))
        while true; do
          code="$(curl -s -m 5 -o /dev/null -w "%{http_code}" "${url}" || true)"

          if [[ "${code}" != "000" ]]; then
            if [[ "${strict}" == "1" ]]; then
              if [[ "${code}" -lt 500 ]]; then
                echo "✅ HTTP OK (estricto) en ${url} (code=${code})"
                ok_any=1
                break
              fi
            else
              echo "✅ HTTP responde en ${url} (code=${code})"
              ok_any=1
              break
            fi
          fi

          # ✅ FIX: antes decía "deadline 2" (con espacio) y rompía bash
          if (( SECONDS >= deadline2 )); then
            echo "❌ HTTP no respondió en ${url} (último code=${code})"
            break
          fi

          sleep 3
        done
      fi
    fi
  done
done

if [[ "${found_any}" == "1" && "${ok_any}" == "0" ]]; then
  echo "❌ Se detectaron puertos HTTP, pero ninguno respondió."
  c
