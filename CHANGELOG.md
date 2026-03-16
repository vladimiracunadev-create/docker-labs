# Changelog

Todos los cambios relevantes del repositorio se registran aqui.

El formato sigue la idea de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y el versionado del proyecto sigue una linea semantica cuando se publiquen releases formales.

## [Unreleased]

_Sin cambios pendientes al momento._

---

## [1.4.0] - 2026-03-15

### Added — Skills de automatizacion

- **Skill `docker-labs-release`**: skill de Claude Code que automatiza el flujo completo de release — lee `version.txt`, calcula la nueva version (patch/minor/major), actualiza el archivo, hace commit + tag + push y reporta la URL de GitHub Actions donde se puede seguir el build del instalador
- **Skill `docker-labs-status`**: skill de Claude Code que muestra el estado completo del sistema — version actual, contenedores Docker corriendo, health check HTTP de cada servicio, ultimo run de GitHub Actions y ultimos commits

### Changed — Launcher (plataforma completa)

- `launcher/main.go` reescrito para levantar los **4 servicios core** en paralelo: `dashboard-control` (9090), `05-postgres-api` (8000), `09-multi-service-app` (8083) y `06-nginx-proxy` (8085)
- El browser se abre solo cuando el Control Center (`/api/overview`) responde con HTTP 200 (timeout 90 s)
- `computeDockerRepoRoot()` convierte la ruta Windows (`C:\path`) al formato del contenedor (`/run/desktop/mnt/host/c/path`) de forma dinamica

### Fixed

- Healthcheck de `03-python-api`: cambiado de `wget` a `curl` (imagen `python:3.12-slim` no incluye wget)
- Healthcheck de `06-nginx-proxy`: endpoint cambiado de `/` a `/gateway-health` para evitar falsos negativos con `try_files`
- `installer/docker-labs.iss`: corregida la directiva `#define AppVersion` con guard `#ifndef` para que `/DAppVersion=X.Y.Z` pasado por CLI no sea sobreescrito

### Documentation

- `CHANGELOG.md`: reorganizado con secciones versionadas correctas; referencias a archivos obsoletos corregidas
- `PROJECT_STATUS.md`: actualizado a v1.4.0 con la capa de distribucion Windows

---

## [1.3.0] - 2026-03-10

### Added — Capa de distribucion Windows

- `launcher/main.go` — launcher Go compilable a `.exe` sin dependencias externas: verifica Docker Desktop, computa `DOCKER_REPO_ROOT` dinamicamente, levanta el Control Center y abre el browser
- `installer/docker-labs.iss` — script Inno Setup para generar el instalador profesional `docker-labs-setup-{version}.exe`
- `scripts/windows/build-launcher.ps1` — compila el launcher con `go build -ldflags "-X main.launcherVersion=..."`
- `scripts/windows/build-installer.ps1` — genera el instalador con Inno Setup ISCC
- `.github/workflows/build-windows.yml` — workflow GitHub Actions que construye y publica el instalador al pushear un tag `v*.*.*`
- `docs/windows-installer.md` — documentacion del instalador: instalacion, build local, troubleshooting, justificacion de no usar firma digital
- `docs/github-releases-distribution.md` — estrategia de distribucion via GitHub Releases

### Fixed

- `.github/workflows/build-windows.yml`: agregado `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` para suprimir advertencias de deprecacion de Node.js 20
- `.github/workflows/build-windows.yml`: `setup-go@v5` con `cache: false` para evitar `git.exe exit code 128` en runners Windows con `go.sum` vacio
- `.github/workflows/build-windows.yml`: el step de upload ahora crea el GitHub Release automaticamente si no existe antes de adjuntar el `.exe` (`gh release create` + `gh release upload`)
- CI matrix: labs 11 y 12 excluidos del CI automatico (lab 11 requiere ≥6 GB RAM; lab 12 Jenkins tarda >3 min en arrancar)
- Eliminado `installer/windows/` (duplicado de la era Python, en conflicto con el nuevo `installer/docker-labs.iss`)
- `DEVELOPING.md`: removidas referencias a archivos inexistentes (`packaging/windows/distribution-manifest.json`, `Test-WindowsPackaging.ps1`)

### Changed

- `dashboard-control/docker-compose.yml`: eliminada ruta hardcodeada del autor; `DOCKER_REPO_ROOT` ahora llega como variable de entorno desde el launcher
- `08-prometheus-grafana`: Prometheus movido de puerto `9090` a `9091` para eliminar conflicto con el Control Center
- `11-elasticsearch-search`: API movida de puerto `8000` a `8001` para eliminar conflicto con `05-postgres-api`

---

## [1.2.0] - 2026-02-15

### Added

- Panel de control principal dockerizado en `dashboard-control/` (puerto 9090)
- `labs.js` con el catalogo de todos los laboratorios y sus metadatos
- Learning Center integrado en el panel

### Fixed

- URLs de Prometheus (`9091`) y Elasticsearch API (`8001`) actualizadas en `dashboard-control/labs.js`
- `scripts/start-control-center.cmd` reescrito para computar `DOCKER_REPO_ROOT` dinamicamente via PowerShell
- `Makefile` actualizado para usar `dashboard-control/` como arquitectura actual

### Changed

- `08-prometheus-grafana/docker-compose.yml`: Prometheus en puerto `9091` (antes `9090`)
- `11-elasticsearch-search/docker-compose.yml`: API en puerto `8001` (antes `8000`)

---

## [1.0.0] - 2026-01-21

### Added

- Estructura documental base en `docs/`
- Politicas del repositorio
- Primer bloque de labs documentados

---

## [0.1.0] - 2026-01-14

### Added

- Estructura inicial del repositorio
- Primeros labs del proyecto
