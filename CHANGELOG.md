# Changelog

Todos los cambios relevantes del repositorio se registran aqui.

El formato sigue la idea de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y el versionado del proyecto sigue una linea semantica cuando se publiquen releases formales.

## [Unreleased]

### Added — Windows Distribution Layer (v1.5)

- `launcher/main.go` — launcher Go compilable a `.exe` sin dependencias externas: verifica Docker Desktop, computa `DOCKER_REPO_ROOT` dinamicamente, levanta el Control Center y abre el browser
- `installer/docker-labs.iss` — script Inno Setup para generar el instalador profesional `docker-labs-setup-{version}.exe`
- `scripts/windows/build-launcher.ps1` — script PowerShell para compilar el launcher con Go
- `scripts/windows/build-installer.ps1` — script PowerShell para generar el instalador con Inno Setup
- `scripts/windows/release.ps1` — pipeline completo de release (build launcher + build installer + upload opcional a GitHub Releases)
- `.github/workflows/build-windows.yml` — workflow GitHub Actions que construye y publica el instalador automaticamente al pushear un tag `v*.*.*`
- `docs/windows-installer.md` — documentacion completa del instalador: instalacion, build local, componentes, troubleshooting, justificacion de no usar firma digital
- `docs/github-releases-distribution.md` — estrategia de distribucion via GitHub Releases, flujo de release, pattern de URL, como enlazar desde la web oficial
- `docs/technical-audit.md` — diagnostico tecnico del repositorio con todos los hallazgos y correcciones aplicadas

### Fixed — Auditoria tecnica (v1.5)

- `dashboard-control/docker-compose.yml`: eliminada ruta hardcodeada del autor (`/run/desktop/mnt/host/c/docker-labs/docker-labs`); `DOCKER_REPO_ROOT` ahora se computa dinamicamente
- `08-prometheus-grafana/docker-compose.yml`: Prometheus movido de puerto `9090` a `9091` para eliminar conflicto con el Control Center
- `11-elasticsearch-search/docker-compose.yml`: API movida de puerto `8000` a `8001` para eliminar conflicto con `05-postgres-api`
- `dashboard-control/labs.js`: URLs de Prometheus (`9091`) y Elasticsearch API (`8001`) actualizadas
- `scripts/start-control-center.cmd`: reescrito para computar `DOCKER_REPO_ROOT` dinamicamente via PowerShell
- `Makefile`: actualizado para usar la arquitectura actual (`dashboard-control/`), con targets `start`, `stop`, `status`, `build-launcher` y `build-installer`
- `.gitignore`: agregados patrones para artefactos de packaging (`docker-labs-*.zip`, `docker-labs-setup-*.exe`, `dist/`, `launcher/`)

### Documentation (v1.5)

- `FILE_ARCHITECTURE.md`: actualizado con la capa de distribucion Windows (v1.5)
- `RELEASE.md`: extendido con flujo de release para el instalador Windows y justificacion de no usar firma digital

---

### Added

- launcher Windows con validacion de prerequisitos, acceso a logs, arranque del Control Center y arranque de la plataforma principal
- manifest central `packaging/windows/distribution-manifest.json` para staging, launcher y release
- scripts `scripts/windows/*.ps1` para build, staging, test, instalador y publicacion
- instalador Inno Setup en `installer/windows/DockerLabs.iss`
- workflow `.github/workflows/release-windows.yml` para generar assets Windows en GitHub Releases
- `docs/technical-audit.md`, `docs/windows-installer.md` y `docs/github-releases-distribution.md`

### Changed

- `dashboard-control/docker-compose.yml` deja de depender de una ruta fija a `C:\docker-labs\docker-labs` y ahora usa wrappers soportados para resolver el path real del workspace
- `Makefile` y CI se alinean con el flujo soportado del Control Center actual en lugar de los dashboards legacy de raiz
- el repo suma una capa profesional de distribucion Windows sin cambiar la esencia del workspace Docker modular

### Fixed

- remocion del artefacto versionado `docker-labs-v1.0.0.zip` del repo
- alineacion de `08-prometheus-grafana` y `11-elasticsearch-search` con notas explicitas sobre conflictos de puertos respecto al flujo principal
- arranque reproducible del Control Center para repositorios instalados fuera de la ruta original

### Documentation

- documentacion explicita de por que esta fase no usa firma digital, que impacto tiene y cuales son las mitigaciones adoptadas
- runbook, release guide, architecture y docs de distribucion alineadas al launcher y al instalador

## [1.0.0] - 2026-01-21

### Added

- Estructura documental base en `docs/`
- Politicas del repositorio
- Primer bloque de labs documentados

## [0.1.0] - 2026-01-14

### Added

- Estructura inicial del repositorio
- Primeros labs del proyecto
