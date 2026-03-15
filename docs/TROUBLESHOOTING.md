# Troubleshooting

Problemas comunes y como resolverlos dentro de `docker-labs`.

## Docker no responde

```powershell
docker info
docker compose version
```

Si falla, revisa Docker Desktop o el daemon de Docker.

## El Control Center no abre

### Desde fuente en Windows

```powershell
scripts\start-control-center.cmd
```

### Desde fuente en Linux/macOS

```bash
./scripts/start-control-center.sh
```

Si sigue fallando, valida el compose:

```powershell
docker compose -f dashboard-control\docker-compose.yml config
```

## El launcher Windows dice que falta Docker

- confirma `docker --version`
- confirma `docker compose version`
- reinicia Docker Desktop si el Engine no esta listo
- vuelve a usar `Validate prerequisites`

## SmartScreen o editor no reconocido

- esta fase no usa firma digital
- descarga solo desde el release oficial
- verifica `SHA256SUMS.txt`

## El gateway abre pero no enruta

Valida que esten arriba:

- `dashboard-control`
- `05-postgres-api`
- `09-multi-service-app`

## `08` o `11` fallan cuando la plataforma principal ya esta arriba

Es un conflicto de puertos esperado:

- `08-prometheus-grafana` usa `9090`
- `11-elasticsearch-search` usa `8000`

Usalos en modo caso a caso o cambia puertos de forma consciente.

## Problemas de build Windows

### PyInstaller no esta instalado

```powershell
scripts\windows\Build-Launcher.ps1 -InstallBuildDependencies
```

### Inno Setup no esta instalado

Usa:

- `scripts\windows\Build-Installer.ps1` en una maquina con Inno Setup
- o el workflow `.github/workflows/release-windows.yml`

## Documentos relacionados

- [windows-installer.md](windows-installer.md)
- [github-releases-distribution.md](github-releases-distribution.md)
- [../RUNBOOK.md](../RUNBOOK.md)
