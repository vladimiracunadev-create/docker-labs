# Changelog

Todos los cambios relevantes del repositorio se registran aqui.

El formato sigue la idea de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y el versionado del proyecto sigue una linea semantica cuando se publiquen releases formales.

## [Unreleased]

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

## [1.0.0] - 2026-01-21

### Added

- Estructura documental base en `docs/`
- Politicas del repositorio
- Primer bloque de labs documentados

## [0.1.0] - 2026-01-14

### Added

- Estructura inicial del repositorio
- Primeros labs del proyecto
