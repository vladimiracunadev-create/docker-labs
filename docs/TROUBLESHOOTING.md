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

### Go no encontrado al compilar el launcher

Instala Go 1.21+ desde https://go.dev/dl/ y asegurate de que `go` este en el PATH.

```powershell
go version
# Resultado esperado: go version go1.21.x windows/amd64
```

### Inno Setup no instalado (build local)

Instala Inno Setup 6.x desde https://jrsoftware.org/isinfo.php o usa Chocolatey:

```powershell
choco install innosetup -y
```

Tambien puedes usar el workflow de GitHub Actions:

- `.github/workflows/build-windows.yml` → `Run workflow`

### El build del launcher falla

```powershell
.\scripts\windows\build-launcher.ps1 -Version 1.0.0
# Verifica que Go 1.21+ este instalado y en el PATH
```

## Documentos relacionados

- [windows-installer.md](windows-installer.md)
- [github-releases-distribution.md](github-releases-distribution.md)
- [../RUNBOOK.md](../RUNBOOK.md)
