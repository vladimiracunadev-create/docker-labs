# Changelog

Todos los cambios relevantes del repositorio se registran aqui.

El formato sigue la idea de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y el versionado del proyecto sigue una linea semantica cuando se publiquen releases formales.

## [Unreleased]

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
