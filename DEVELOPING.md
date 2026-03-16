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
- `docker-labs-launcher.exe` para la distribucion empaquetada Windows
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

- `version.txt`: fuente unica de la version actual del proyecto
- `labs.config.json`: fuente unica de labs, puertos, URLs y metadata (cargado por `dashboard-control/labs.js`)
- `launcher/main.go`: launcher Go — valida prerequisitos, levanta el Control Center y abre el browser
- `installer/docker-labs.iss`: script Inno Setup 6.x para empaquetar el instalador
- `scripts/windows/build-launcher.ps1`: compila el launcher con `go build`
- `scripts/windows/build-installer.ps1`: empaqueta el instalador con ISCC.exe
- `scripts/windows/release.ps1`: pipeline completo build + packaging en un solo comando
- `.github/workflows/build-windows.yml`: CI/CD — genera el instalador al hacer push de un tag `vX.Y.Z`

## Reglas para tocar la capa Windows

1. No empaquetes Docker Desktop.
2. No hardcodees rutas del repo a `C:\docker-labs\docker-labs`.
3. No dejes binarios finales versionados en el repo.
4. Manten el mensaje de binario no firmado claro y profesional.
5. Publica checksums junto al instalador.

## Skills de automatizacion (Claude Code)

El proyecto incluye dos skills de Claude Code que automatizan tareas frecuentes. Los skills se activan automaticamente cuando describes la tarea en lenguaje natural.

### `docker-labs-release`

Automatiza el flujo completo de release:
1. Lee la version actual de `version.txt`
2. Propone un bump patch / minor / major (o version especifica)
3. Actualiza `version.txt`, hace commit, crea el tag `vX.Y.Z` y pushea a GitHub
4. El tag dispara `build-windows.yml` que compila y publica `docker-labs-setup-X.Y.Z.exe`

**Frases que lo activan**: _"haz un release"_, _"bump de version"_, _"nueva version"_, _"publicar v1.5.0"_, etc.

### `docker-labs-status`

Muestra el estado completo del sistema en un solo vistazo:
- Version actual y ultimo tag git
- Contenedores Docker corriendo y health HTTP de cada servicio
- Estado del ultimo workflow de GitHub Actions
- Ultimos commits en `main`

**Frases que lo activan**: _"estado de docker-labs"_, _"que esta corriendo"_, _"como va el proyecto"_, _"health check"_, etc.

> Los skills estan instalados en Claude Code y no requieren configuracion adicional.

## Flujo sugerido de cambios

1. ajusta el workspace Docker
2. si cambian rutas, labs o artefactos, actualiza `installer/docker-labs.iss` y `dashboard-control/labs.js`
3. verifica que el build local funciona: `.\scripts\windows\build-launcher.ps1` y `.\scripts\windows\build-installer.ps1`
4. actualiza `README.md`, `RUNBOOK.md`, `RELEASE.md` y docs afectadas
5. documenta inconsistencias reales y correcciones en `docs/technical-audit.md` si cambian supuestos del repo
6. para publicar el release, usa el skill `docker-labs-release` o ejecuta manualmente:
   ```bash
   echo "X.Y.Z" > version.txt
   git add version.txt && git commit -m "chore: bump version to X.Y.Z"
   git tag vX.Y.Z && git push origin main && git push origin vX.Y.Z
   ```

## Referencias internas

- [docs/technical-audit.md](docs/technical-audit.md)
- [docs/windows-installer.md](docs/windows-installer.md)
- [docs/github-releases-distribution.md](docs/github-releases-distribution.md)
- [docs/DASHBOARD_SETUP.md](docs/DASHBOARD_SETUP.md)
