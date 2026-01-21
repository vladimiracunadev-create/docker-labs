#!/usr/bin/env bash
set -euo pipefail

LAB_DIR="${1:-.}"
COMPOSE_FILE="${2:-docker-compose.yml}"

# Workspace en GitHub Actions
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

# Nombre de proyecto único (evita colisiones si algún compose usa container_name fijo)
safe_dir="$(echo "${LAB_DIR}" | tr '/.' '__' | tr -cd '[:alnum:]_-' )"
export COMPOSE_PROJECT_NAME="ci_${safe_dir}_${GITHUB_RUN_ID:-local}_${GITHUB_RUN_ATTEMPT:-0}"

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

echo "==> 📦 Estado inicial"
compose ps || true
docker ps -a --filter "label=com.docker.compose.project=${COMPOSE_PROJECT_NAME}" || true

# Espera a que los contenedores queden "running" (sin exited/restarting)
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
      *)
        # created, starting, etc.
        ;;
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

# Smoke test HTTP "genérico" si detectamos algún mapeo típico
# (aceptamos 2xx-4xx, fallamos sólo en 5xx sostenido o sin conexión)
candidate_container_ports=(80 3000 5000 8000 8080 9090 9200 15672)

echo "==> 🔎 Buscando puertos HTTP para smoke test"
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
        echo "   - candidato: ${svc}:${cport} -> ${url}"

        deadline2=$((SECONDS+240))
        while true; do
          code="$(curl -s -o /dev/null -w "%{http_code}" "${url}" || true)"
          if [[ "${code}" != "000" && "${code}" -lt 500 ]]; then
            echo "✅ HTTP OK en ${url} (code=${code})"
            ok_any=1
            break
          fi
          if (( SECONDS >= deadline2 )); then
            echo "❌ HTTP no respondió bien en ${url} (último code=${code})"
            break
          fi
          sleep 3
        done
      fi
    fi
  done
done

if [[ "${found_any}" == "1" && "${ok_any}" == "0" ]]; then
  echo "❌ Se detectaron puertos HTTP, pero ninguno respondió (2xx-4xx)."
  compose ps || true
  compose logs --no-color --tail=250 || true
  exit 1
fi

echo "==> ✅ OK: ${LAB_DIR}/${COMPOSE_FILE}"
