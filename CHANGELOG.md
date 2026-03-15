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

- Panel principal con control centralizado de labs, lectura de estado y acciones globales de `bajar todo` y `eliminar entornos del repo`
- `Inventory Core` en `05-postgres-api` como backend transaccional con clientes, productos, pedidos, seed, healthchecks y portada HTML
- `Operations Portal` en `09-multi-service-app` como portal operativo conectado a `05`
- `Platform Gateway` en `06-nginx-proxy` como punto de entrada unificado a panel, core y portal
- `RECRUITER.md`, `PROJECT_STATUS.md`, `DEVELOPING.md`, `SUPPORT.md` y `FAQ.md`
- `docs/LABS_RUNTIME_REFERENCE.md` como referencia de imagenes, versiones, tamanos y requisitos de los 12 labs
- `learning-center.html` como centro HTML de aprendizaje dentro del ambiente local

### Changed

- El repositorio deja de presentarse solo como una coleccion de demos y pasa a explicarse como plataforma modular de sistemas dockerizados
- El dashboard ahora distingue entre estado Docker, control operativo y acceso al sistema real
- `05`, `06` y `09` quedaron alineados como columna vertebral del workspace
- La documentacion principal se reescribio para mantener coherencia entre narrativa, arquitectura y estado real de entrega

### Fixed

- Correcciones de coherencia entre README, roadmap, catalogo y estado real de los labs
- Ajustes de navegacion para volver al menu principal desde los sistemas activos
- Limpieza de documentos con problemas de codificacion y textos heredados

### Documentation

- Nueva guia para principiantes orientada a uso caso a caso y restricciones reales de hardware
- Referencia operativa con requerimientos minimos y stack por lab
- Centro de aprendizaje embebido en HTML dentro del panel principal
- Reescritura de la documentacion troncal, tecnica y operativa con navegacion editorial mas clara
- README fortalecido con estado del workspace, CI visible y rutas de lectura por perfil
- Se incorporan documentos de estandar del ecosistema: `ENVIRONMENT_SETUP.md`, `FILE_ARCHITECTURE.md`, `GLOSSARY.md`, `SYSTEM_SPECS.md`, `COMPATIBILITY.md`, `OPERATING-MODES.md`, `RELEASE.md`, `RUNBOOK.md`, `RECRUITER.md`, `killed.md`, `docs/REQUIREMENTS.md` y `docs/TOOLING.md`
- Barrido editorial amplio para unificar `RECRUITER.md`, `README.md`, `PROJECT_STATUS.md`, el indice documental y las rutas internas de la documentacion principal

## [1.0.0] - 2026-01-21

### Added

- Estructura documental base en `docs/`
- Politicas del repositorio
- Primer bloque de labs documentados

## [0.1.0] - 2026-01-14

### Added

- Estructura inicial del repositorio
- Primeros labs del proyecto
