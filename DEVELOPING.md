# Developing

Guía para extender `docker-labs` sin romper el flujo Docker actual ni la nueva capa de distribución Windows.

---

## Principios

- Cada carpeta debe resolver un problema concreto.
- La documentación debe coincidir con el flujo soportado de verdad.
- El launcher y el instalador son una capa aditiva; no reemplazan `docker compose`.
- Si cambias puertos, scripts o manifests, debes alinear docs, launcher y release scripts.

---

## Flujo soportado hoy

- `scripts\start-control-center.cmd` en Windows
- `./scripts/start-control-center.sh` en Linux/macOS
- `docker-labs-launcher.exe` para la distribución empaquetada Windows
- `dashboard-control/docker-compose.yml` + `05` + `09` + `06` como experiencia principal

---

## Estándar mínimo para un lab

- `README.md`
- `docker-compose.yml`
- `Dockerfile` si aplica
- `lab-manifest.json` cuando el lab expone metadata para el panel
- Healthcheck útil cuando el servicio lo justifica
- URL principal o explicación de por qué no existe
- Documentación del costo o conflicto de puertos si aplica

---

## Capa Windows

La distribución Windows vive en estas piezas:

- `version.txt`: fuente única de la versión actual del proyecto
- `labs.config.json`: fuente única de labs, puertos, URLs y metadata (cargado por `dashboard-control/labs.js`)
- `launcher/main.go`: launcher Go — valida prerequisitos, levanta el Control Center y abre el browser
- `installer/docker-labs.iss`: script Inno Setup 6.x para empaquetar el instalador
- `scripts/windows/build-launcher.ps1`: compila el launcher con `go build`
- `scripts/windows/build-installer.ps1`: empaqueta el instalador con ISCC.exe
- `scripts/windows/release.ps1`: pipeline completo build + packaging en un solo comando
- `.github/workflows/build-windows.yml`: CI/CD — genera el instalador al hacer push de un tag `vX.Y.Z`

---

## Reglas para tocar la capa Windows

1. No empaquetes Docker Desktop.
2. No hardcodees rutas del repo a `C:\docker-labs\docker-labs`.
3. No dejes binarios finales versionados en el repo.
4. Mantén el mensaje de binario no firmado claro y profesional.
5. Publica checksums junto al instalador.

---

## Skills de automatización (Claude Code)

El proyecto incluye dos skills de Claude Code que automatizan tareas frecuentes. Los skills se activan automáticamente cuando describes la tarea en lenguaje natural.

### `docker-labs-release`

Automatiza el flujo completo de release:
1. Lee la versión actual de `version.txt`
2. Propone un bump patch / minor / major (o versión específica)
3. Actualiza `version.txt`, hace commit, crea el tag `vX.Y.Z` y pushea a GitHub
4. El tag dispara `build-windows.yml` que compila y publica `docker-labs-setup-X.Y.Z.exe`

**Frases que lo activan**: _"haz un release"_, _"bump de versión"_, _"nueva versión"_, _"publicar v1.5.0"_, etc.

### `docker-labs-status`

Muestra el estado completo del sistema en un solo vistazo:
- Versión actual y último tag git
- Contenedores Docker corriendo y health HTTP de cada servicio
- Estado del último workflow de GitHub Actions
- Últimos commits en `main`

**Frases que lo activan**: _"estado de docker-labs"_, _"qué está corriendo"_, _"cómo va el proyecto"_, _"health check"_, etc.

> Los skills están instalados en Claude Code y no requieren configuración adicional.

---

## Flujo sugerido de cambios

1. Ajusta el workspace Docker.
2. Si cambian rutas, labs o artefactos, actualiza `installer/docker-labs.iss` y `dashboard-control/labs.js`.
3. Verifica que el build local funciona: `.\scripts\windows\build-launcher.ps1` y `.\scripts\windows\build-installer.ps1`.
4. Actualiza `README.md`, `RUNBOOK.md`, `RELEASE.md` y docs afectadas.
5. Documenta inconsistencias reales y correcciones en `docs/technical-audit.md` si cambian supuestos del repo.
6. Para publicar el release, usa el skill `docker-labs-release` o ejecuta manualmente:
   ```powershell
   "X.Y.Z" | Set-Content version.txt
   git add version.txt; git commit -m "chore: bump version to X.Y.Z"
   git tag vX.Y.Z; git push origin main; git push origin vX.Y.Z
   ```

---

## Referencias internas

- [docs/technical-audit.md](docs/technical-audit.md)
- [docs/windows-installer.md](docs/windows-installer.md)
- [docs/github-releases-distribution.md](docs/github-releases-distribution.md)
- [docs/DASHBOARD_SETUP.md](docs/DASHBOARD_SETUP.md)
