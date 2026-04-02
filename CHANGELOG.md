# Changelog

Todos los cambios relevantes del repositorio se registran aquí.

El formato sigue la idea de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y el versionado del proyecto sigue una línea semántica cuando se publiquen releases formales.

## [Unreleased]

_Sin cambios pendientes al momento._

---

## [1.4.2] - 2026-04-02

### Fixed — Healthcheck timeouts en Windows

- **09-multi-service-app**: timeout de MongoDB aumentado de 5s a 15s e intervalo de 10s a 15s; `mongosh` tarda >5s en iniciar en Windows aunque la base responde correctamente
- **dashboard-control**: override de healthcheck con `timeout: 15s` y `start_period: 20s`; `/api/overview` hace llamadas al Docker daemon que pueden exceder 5s en Windows

### Changed — Interfaz Learning Center

- `learning-center.html`: columna "Health check" agregada a la tabla Runtime Matrix — muestra el comando exacto de cada uno de los 12 labs (refleja cobertura 12/12)

---

## [1.4.1] - 2026-04-02

### Added — Cobertura de health checks completa (12/12 labs)

- **02-php-lamp**: healthcheck `mysqladmin ping` para MariaDB + `curl` para Apache; `web` y `phpmyadmin` ahora esperan `service_healthy` de `db`
- **04-redis-cache**: healthcheck `redis-cli ping` para Redis + `wget /health` para la API Node; `api` espera `service_healthy` de `redis`
- **07-rabbitmq-messaging**: healthcheck `rabbitmq-diagnostics -q ping` con `start_period: 30s`

### Added — Smoke test cross-service en CI

- Nuevo job `smoke-platform` en `.github/workflows/ci.yml`: levanta `05-postgres-api`, `09-multi-service-app` y `06-nginx-proxy` con sus `docker-compose.yml` propios y valida el flujo completo Core → Portal → Gateway
- Verifica: `Core summary`, `Core insights`, `Portal health`, `Portal-Core integration` (`inventory: reachable`), `Portal overview` y `Gateway health`
- Corre en paralelo con la matriz de tests individuales; requiere que `quality-python` y `quality-node` pasen primero

### Changed — Documentacion

- `README.md`: tabla de referencia rápida con los 13 componentes (12 labs + dashboard), puertos host y estado visible desde el inicio
- `docs/TECHNICAL_SPECS.md`: tabla completa 23 servicios/puertos, health checks 12/12, tabla CI completa; tabla de conflictos stale eliminada
- `01/02/03/04/07/10/12`: READMEs reescritos con tabla de servicios, health checks, comandos `docker compose` y verificacion
- `10-go-api/README.md`: puerto corregido (`8080` → `8084`)
- `.markdownlint.json`: config base del proyecto (MD013/MD060 desactivados)

---

## [1.4.0] - 2026-03-15

### Added — Skills de automatización

- **Skill `docker-labs-release`**: skill de Claude Code que automatiza el flujo completo de release — lee `version.txt`, calcula la nueva versión (patch/minor/major), actualiza el archivo, hace commit + tag + push y reporta la URL de GitHub Actions donde se puede seguir el build del instalador
- **Skill `docker-labs-status`**: skill de Claude Code que muestra el estado completo del sistema — versión actual, contenedores Docker corriendo, health check HTTP de cada servicio, último run de GitHub Actions y últimos commits

### Changed — Launcher (plataforma completa)

- `launcher/main.go` reescrito para levantar los **4 servicios core** en paralelo: `dashboard-control` (9090), `05-postgres-api` (8000), `09-multi-service-app` (8083) y `06-nginx-proxy` (8085)
- El browser se abre solo cuando el Control Center (`/api/overview`) responde con HTTP 200 (timeout 90 s)
- `computeDockerRepoRoot()` convierte la ruta Windows (`C:\path`) al formato del contenedor (`/run/desktop/mnt/host/c/path`) de forma dinámica

### Fixed

- Healthcheck de `03-python-api`: cambiado de `wget` a `curl` (imagen `python:3.12-slim` no incluye wget)
- Healthcheck de `06-nginx-proxy`: endpoint cambiado de `/` a `/gateway-health` para evitar falsos negativos con `try_files`
- `installer/docker-labs.iss`: corregida la directiva `#define AppVersion` con guard `#ifndef` para que `/DAppVersion=X.Y.Z` pasado por CLI no sea sobreescrito

### Documentation

- `CHANGELOG.md`: reorganizado con secciones versionadas correctas; referencias a archivos obsoletos corregidas
- `PROJECT_STATUS.md`: actualizado a v1.4.0 con la capa de distribución Windows

---

## [1.3.0] - 2026-03-10

### Added — Capa de distribución Windows

- `launcher/main.go` — launcher Go compilable a `.exe` sin dependencias externas: verifica Docker Desktop, computa `DOCKER_REPO_ROOT` dinámicamente, levanta el Control Center y abre el browser
- `installer/docker-labs.iss` — script Inno Setup para generar el instalador profesional `docker-labs-setup-{version}.exe`
- `scripts/windows/build-launcher.ps1` — compila el launcher con `go build -ldflags "-X main.launcherVersion=..."`
- `scripts/windows/build-installer.ps1` — genera el instalador con Inno Setup ISCC
- `.github/workflows/build-windows.yml` — workflow GitHub Actions que construye y publica el instalador al pushear un tag `v*.*.*`
- `docs/windows-installer.md` — documentación del instalador: instalación, build local, troubleshooting, justificación de no usar firma digital
- `docs/github-releases-distribution.md` — estrategia de distribución via GitHub Releases

### Fixed

- `.github/workflows/build-windows.yml`: agregado `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` para suprimir advertencias de deprecación de Node.js 20
- `.github/workflows/build-windows.yml`: `setup-go@v5` con `cache: false` para evitar `git.exe exit code 128` en runners Windows con `go.sum` vacío
- `.github/workflows/build-windows.yml`: el step de upload ahora crea el GitHub Release automáticamente si no existe antes de adjuntar el `.exe` (`gh release create` + `gh release upload`)
- CI matrix: labs 11 y 12 excluidos del CI automático (lab 11 requiere ≥6 GB RAM; lab 12 Jenkins tarda >3 min en arrancar)
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
- `labs.js` con el catálogo de todos los laboratorios y sus metadatos
- Learning Center integrado en el panel

### Fixed

- URLs de Prometheus (`9091`) y Elasticsearch API (`8001`) actualizadas en `dashboard-control/labs.js`
- `scripts/start-control-center.cmd` reescrito para computar `DOCKER_REPO_ROOT` dinámicamente via PowerShell
- `Makefile` actualizado para usar `dashboard-control/` como arquitectura actual

### Changed

- `08-prometheus-grafana/docker-compose.yml`: Prometheus en puerto `9091` (antes `9090`)
- `11-elasticsearch-search/docker-compose.yml`: API en puerto `8001` (antes `8000`)

---

## [1.0.0] - 2026-01-21

### Added

- Estructura documental base en `docs/`
- Políticas del repositorio
- Primer bloque de labs documentados

---

## [0.1.0] - 2026-01-14

### Added

- Estructura inicial del repositorio
- Primeros labs del proyecto
