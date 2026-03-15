# Developing

Guia para extender `docker-labs` sin romper el flujo Docker actual ni la nueva capa de distribucion Windows.

## Principios

- cada carpeta debe resolver un problema concreto
- la documentacion debe coincidir con el flujo soportado de verdad
- el launcher y el instalador son una capa aditiva; no reemplazan `docker compose`
- si cambias puertos, scripts o manifests, debes alinear docs, launcher y release scripts

## Flujo soportado hoy

- `scripts\start-control-center.cmd` en Windows
- `./scripts/start-control-center.sh` en Linux/macOS
- `DockerLabsLauncher.exe` para la distribucion empaquetada
- `dashboard-control/docker-compose.yml` + `05` + `09` + `06` como experiencia principal

## Estandar minimo para un lab

- `README.md`
- `docker-compose.yml`
- `Dockerfile` si aplica
- `lab-manifest.json` cuando el lab expone metadata para el panel
- healthcheck util cuando el servicio lo justifica
- URL principal o explicacion de por que no existe
- documentacion del costo o conflicto de puertos si aplica

## Capa Windows

La distribucion Windows vive en estas piezas:

- `packaging/windows/distribution-manifest.json`: metadata central del launcher, staging y release
- `launcher/docker_labs_launcher.py`: launcher GUI/CLI para validacion y arranque
- `installer/windows/DockerLabs.iss`: instalador Inno Setup
- `scripts/windows/*.ps1`: build, staging, validacion y publicacion
- `.github/workflows/release-windows.yml`: pipeline de GitHub Releases

## Reglas para tocar la capa Windows

1. No empaquetes Docker Desktop.
2. No hardcodees rutas del repo a `C:\docker-labs\docker-labs`.
3. No dejes binarios finales versionados en el repo.
4. Manten el mensaje de binario no firmado claro y profesional.
5. Publica checksums junto al instalador.

## Flujo sugerido de cambios

1. ajusta el workspace Docker
2. actualiza `packaging/windows/distribution-manifest.json` si cambian rutas o artefactos
3. valida `scripts/windows/Test-WindowsPackaging.ps1`
4. actualiza `README.md`, `RUNBOOK.md`, `RELEASE.md` y docs afectadas
5. documenta inconsistencias reales y correcciones en `docs/technical-audit.md` si cambian supuestos del repo

## Referencias internas

- [docs/technical-audit.md](docs/technical-audit.md)
- [docs/windows-installer.md](docs/windows-installer.md)
- [docs/github-releases-distribution.md](docs/github-releases-distribution.md)
- [docs/DASHBOARD_SETUP.md](docs/DASHBOARD_SETUP.md)
