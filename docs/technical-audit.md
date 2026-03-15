# Technical Audit — Docker Labs

> **Date**: 2026-03-15
> **Auditor**: Senior software architect review (pre-Windows layer implementation)
> **Status**: Issues resolved — see correction log below

---

## Objective

Before adding the Windows distribution layer, this audit inspected the full
repository state to detect inconsistencies, port conflicts, hardcoded values,
and structural problems. All critical findings were corrected before implementing
the new functionality.

---

## Findings and Corrections

### CRITICAL-01 — Hardcoded author path in `dashboard-control/docker-compose.yml`

**Finding**
`DOCKER_REPO_ROOT` was hardcoded to `/run/desktop/mnt/host/c/docker-labs/docker-labs`,
a path specific to the repository author's machine. Volume was also hardcoded as
`..:/run/desktop/mnt/host/c/docker-labs/docker-labs`.

**Impact**
Any user cloning the repo to a different path, or on Linux/macOS, would get
incorrect docker compose paths. The control center would start but fail to
manage individual labs.

**Correction applied**
- Changed `DOCKER_REPO_ROOT` to `${DOCKER_REPO_ROOT:-/workspace}` in compose
- Removed the second hardcoded volume mount
- Updated `scripts/start-control-center.cmd` to compute `DOCKER_REPO_ROOT`
  dynamically using PowerShell path conversion
- The new Go launcher also computes this value automatically

**Files changed**
- `dashboard-control/docker-compose.yml`
- `scripts/start-control-center.cmd`

---

### CRITICAL-02 — Port conflict: `08-prometheus-grafana` vs Control Center (port 9090)

**Finding**
`08-prometheus-grafana/docker-compose.yml` mapped Prometheus to host port `9090:9090`.
The Control Center also uses port 9090. Running both simultaneously caused a bind conflict.

Additionally, `dashboard-control/labs.js` showed the Prometheus URL as
`http://localhost:9090`, which pointed to the Control Center itself — not Prometheus.

**Impact**
Starting lab 08 while the Control Center was running would fail with "port in use".
The dashboard link for Prometheus was incorrect and would open the Control Center.

**Correction applied**
- Changed Prometheus host port from `9090:9090` to `9091:9090` in `08-prometheus-grafana/docker-compose.yml`
- Updated `dashboard-control/labs.js` Prometheus URL to `http://localhost:9091`

**Files changed**
- `08-prometheus-grafana/docker-compose.yml`
- `dashboard-control/labs.js`

---

### CRITICAL-03 — Port conflict: `11-elasticsearch-search` vs `05-postgres-api` (port 8000)

**Finding**
`11-elasticsearch-search/docker-compose.yml` mapped its API to host port `8000:8000`.
`05-postgres-api` (Inventory Core) also uses port 8000, and is the platform's
primary entry point.

`dashboard-control/labs.js` listed `11-elasticsearch-search` API URL as
`http://localhost:8000`, creating a false link that pointed to the Inventory Core.

**Impact**
Starting lab 11 while the Inventory Core was running would fail with "port in use".
The dashboard link for Elasticsearch API was incorrect.

**Correction applied**
- Changed Elasticsearch API host port from `8000:8000` to `8001:8000` in `11-elasticsearch-search/docker-compose.yml`
- Updated `dashboard-control/labs.js` Elasticsearch API URL to `http://localhost:8001`
- Updated health URL to `http://localhost:8001/health`

**Files changed**
- `11-elasticsearch-search/docker-compose.yml`
- `dashboard-control/labs.js`

---

### MEDIUM-01 — `docker-labs-v1.0.0.zip` committed to repository root

**Finding**
A release ZIP archive (`docker-labs-v1.0.0.zip`) was present in the repository
root — a release artifact that should never be versioned.

**Impact**
Increases repository size unnecessarily. Violates the distribution strategy
where release artifacts are published via GitHub Releases, not committed.

**Correction applied**
- Added `docker-labs-*.zip` to `.gitignore`

**Manual action required**
Remove `docker-labs-v1.0.0.zip` from version history if desired:
```bash
git rm --cached docker-labs-v1.0.0.zip
git commit -m "Remove release artifact from repo (use GitHub Releases)"
```

**Files changed**
- `.gitignore`

---

### MEDIUM-02 — `Makefile` referenced legacy dashboard architecture

**Finding**
The Makefile referenced `docker-compose-dashboard.yml` and
`docker-compose-dashboard-simple.yml` — the older monolithic dashboard approach
that has been superseded by `dashboard-control/`. Commands like `make up-dashboard`
no longer represented the actual workspace entry point.

**Impact**
Developers using `make` would start the wrong stack. The current quickstart
is `scripts/start-control-center.cmd` or `docker compose -f dashboard-control/docker-compose.yml up`.

**Correction applied**
- Rewrote `Makefile` to use `dashboard-control/docker-compose.yml` as the current entry
- Added `start`, `stop`, `status` targets
- Added `build-launcher` and `build-installer` targets for the Windows packaging layer
- Preserved CI compatibility (old compose files are still tested by `ci.yml`)

**Files changed**
- `Makefile`

---

### MEDIUM-03 — `.gitignore` missing packaging and launcher artifacts

**Finding**
`.gitignore` did not cover:
- `docker-labs-*.zip` (release archives)
- `docker-labs-setup-*.exe` (installer binaries)
- `packaging/staging/`
- `launcher/go.sum` and `launcher/docker-labs-launcher.exe`

**Correction applied**
Added all missing entries to `.gitignore`.

**Files changed**
- `.gitignore`

---

## Port Map — Post-Audit (Verified, No Conflicts)

| Port  | Lab / Service              | Status   |
|-------|----------------------------|----------|
| 9090  | Control Center             | Primary  |
| 8000  | 05-postgres-api (Core)     | Platform |
| 8083  | 09-multi-service-app       | Platform |
| 8085  | 06-nginx-proxy (Gateway)   | Platform |
| 3000  | 01-node-api                | Starter  |
| 5000  | 03-python-api              | Starter  |
| 3001  | 04-redis-cache             | Infra    |
| 8081  | 02-php-lamp (web)          | Starter  |
| 8082  | 02-php-lamp (phpmyadmin)   | Starter  |
| 9091  | 08-prometheus-grafana      | Infra    |
| 3002  | 08-grafana                 | Infra    |
| 3003  | 09-backend API             | Platform |
| 8084  | 10-go-api                  | Starter  |
| 8001  | 11-elasticsearch-search    | Infra    |
| 9200  | 11-elasticsearch           | Infra    |
| 8080  | 12-jenkins-ci              | Infra    |
| 15672 | 07-rabbitmq management     | Infra    |
| 5432  | 05-postgres-api DB         | Platform |

---

## Architecture Notes

### DOCKER_REPO_ROOT — dual-path design

The Control Center runs inside Docker but needs to invoke `docker compose`
commands for other labs. This creates a path resolution challenge:

1. Inside the container, files are at `/workspace` (via volume mount)
2. The host Docker daemon receives compose file paths as arguments
3. On Windows + Docker Desktop, the host daemon lives in a LinuxKit VM
   where Windows drives are at `/run/desktop/mnt/host/<drive>/...`

**Solution**: `DOCKER_REPO_ROOT` is set to the host-side path before starting
the container. The `start-control-center.cmd` script and the Go launcher both
compute this dynamically.

On Linux/macOS with native Docker, `DOCKER_REPO_ROOT` equals the actual
host path (e.g. `/home/user/docker-labs`).

---

## Legacy Files

The following files remain in the repository for backward compatibility and
CI testing but represent an earlier architectural approach:

| File | Role | Notes |
|------|------|-------|
| `docker-compose-dashboard.yml` | Legacy monolithic dashboard | Still tested in CI |
| `docker-compose-dashboard-simple.yml` | Simplified variant | Still tested in CI |
| `nginx-dashboard.conf` | Nginx config for legacy dashboard | Required by legacy compose |
| `nginx-proxy-dashboard.conf` | Nginx proxy config | Required by legacy compose |
| `prometheus-dashboard.yml` | Prometheus config for legacy | Required by legacy compose |

These files do not affect the primary `dashboard-control/` architecture.

---

## Documents Related to This Audit

- [docs/windows-installer.md](windows-installer.md)
- [docs/github-releases-distribution.md](github-releases-distribution.md)
- [DEVELOPING.md](../DEVELOPING.md)
- [RUNBOOK.md](../RUNBOOK.md)
