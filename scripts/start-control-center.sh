#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

export CONTROL_CENTER_WORKSPACE_SOURCE="${REPO_ROOT}"
export CONTROL_CENTER_DOCKER_SOURCE="${REPO_ROOT}"
export CONTROL_CENTER_DOCKER_TARGET="${REPO_ROOT}"

docker compose -f "${REPO_ROOT}/dashboard-control/docker-compose.yml" up -d --build
echo "Docker Labs Control Center: http://localhost:9090"
