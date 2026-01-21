  test:
    needs: discover
    runs-on: ubuntu-latest
    timeout-minutes: 35
    strategy:
      fail-fast: false
      matrix:
        target: ${{ fromJson(needs.discover.outputs.targets) }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Docker info
        shell: bash
        run: |
          docker version
          docker compose version

      - name: Create CI script (inline)
        shell: bash
        run: |
          set -euo pipefail

          mkdir -p .ci
          cat > .ci/ci-compose-test.sh <<'EOF'
          #!/usr/bin/env bash
          set -euo pipefail

          STACK_DIR="${1:?Debes pasar el directorio, ej: 02-php-lamp}"
          COMPOSE_NAME="${2:-docker-compose.yml}"

          ROOT_DIR="${GITHUB_WORKSPACE:-$(pwd)}"
          COMPOSE_FILE="${ROOT_DIR}/${STACK_DIR}/${COMPOSE_NAME}"

          if [[ ! -f "${COMPOSE_FILE}" ]]; then
            echo "❌ No existe: ${COMPOSE_FILE}"
            exit 2
          fi

          RUN_ID="${GITHUB_RUN_ID:-local}"
          ATTEMPT="${GITHUB_RUN_ATTEMPT:-0}"

          BASE="ci-${STACK_DIR}-${RUN_ID}-${ATTEMPT}"
          PROJECT="$(echo "${BASE}" \
            | tr '[:upper:]' '[:lower:]' \
            | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g; s/-+/-/g')"
          PROJECT="${PROJECT:0:60}"

          echo "==> 🚀 UP + BUILD: ${STACK_DIR}/${COMPOSE_NAME} (project=${PROJECT})"

          cleanup() {
            echo "==> 🧹 Cleanup (${STACK_DIR}/${COMPOSE_NAME})"
            docker compose -p "${PROJECT}" -f "${COMPOSE_FILE}" down -v --remove-orphans >/dev/null 2>&1 || true
          }
          trap cleanup EXIT

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

            if [[ ${#cids[@]} -eq 0 ]]; then
              echo "❌ No hay contenedores levantados (ps -q vacío)."
              docker compose -p "${PROJECT}" -f "${COMPOSE_FILE}" ps || true
              exit 1
            fi

            for cid in "${cids[@]}"; do
              status="$(docker inspect -f '{{.State.Status}}' "${cid}" 2>/dev/null || echo "unknown")"
              health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}nohealth{{end}}' "${cid}" 2>/dev/null || echo "nohealth")"

              if [[ "${status}" == "exited" || "${status}" == "dead" ]]; then
                echo "❌ Contenedor malo: ${cid} status=${status} health=${health}"
                docker logs --tail 200 "${cid}" || true
                exit 1
              fi

              if [[ "${health}" != "nohealth" ]]; then
                [[ "${health}" == "healthy" ]] || all_ok=0
              else
                [[ "${status}" == "running" ]] || all_ok=0
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
          EOF

          # Normaliza CRLF por si el workflow se editó desde Windows
          sed -i 's/\r$//' .ci/ci-compose-test.sh
          chmod +x .ci/ci-compose-test.sh

      - name: Run compose test
        shell: bash
        run: |
          .ci/ci-compose-test.sh "${{ matrix.target.dir }}" "${{ matrix.target.file }}"
