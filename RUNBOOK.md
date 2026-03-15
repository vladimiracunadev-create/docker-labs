# Runbook

> **Version**: 1.5  
> **Estado**: Activo  
> **Uso recomendado**: Operacion diaria del workspace y de la capa Windows sin perder el flujo Docker original

---

## Entradas soportadas

| Escenario | Entrada recomendada |
|---|---|
| Workspace fuente en Windows | `scripts\start-control-center.cmd` |
| Workspace fuente en Linux/macOS | `./scripts/start-control-center.sh` |
| Instalacion Windows desde Releases | `DockerLabsLauncher.exe` |

## Arranque del flujo principal

### Solo Control Center

```powershell
scripts\start-control-center.cmd
```

```bash
./scripts/start-control-center.sh
```

### Plataforma principal

```powershell
scripts\start-control-center.cmd
docker compose -f 05-postgres-api\docker-compose.yml up -d --build
docker compose -f 09-multi-service-app\docker-compose.yml up -d --build
docker compose -f 06-nginx-proxy\docker-compose.yml up -d --build
```

Desde el instalador Windows el launcher ofrece los botones `Start Control Center` y `Start main workspace`.

## Apagado ordenado

```powershell
docker compose -f 06-nginx-proxy\docker-compose.yml down
docker compose -f 09-multi-service-app\docker-compose.yml down
docker compose -f 05-postgres-api\docker-compose.yml down
docker compose -f dashboard-control\docker-compose.yml down
```

## Diagnostico rapido

| Necesidad | Donde mirar |
|---|---|
| Estado general | [http://localhost:9090](http://localhost:9090) |
| Diagnostico del runtime | [http://localhost:9090/api/diagnostics](http://localhost:9090/api/diagnostics) |
| Core transaccional | [http://localhost:8000](http://localhost:8000) |
| Portal operativo | [http://localhost:8083](http://localhost:8083) |
| Gateway | [http://localhost:8085](http://localhost:8085) |
| Logs del launcher Windows | `%LOCALAPPDATA%\DockerLabs\logs\launcher.log` |

## Operacion Windows empaquetada

- El instalador no incluye Docker Desktop. El launcher valida `docker` y `docker compose`.
- El launcher usa el mismo workspace Docker real y no reemplaza `docker compose` por una simulacion.
- El instalador instala en `%LOCALAPPDATA%\Programs\DockerLabs` y deja un acceso directo claro al launcher.
- El launcher y el instalador advierten que en esta fase el binario no esta firmado digitalmente.

## Respuesta a incidencias comunes

| Problema | Respuesta operativa |
|---|---|
| `9090` no responde | Reejecuta `scripts\start-control-center.cmd` o usa `Start Control Center` en el launcher |
| `8000` responde, pero el portal falla | Revisa `09` y valida `http://localhost:3003/api/health` |
| Gateway sin rutas | Valida que `05`, `09` y `9090` esten levantados |
| Docker saturado | Baja todo y vuelve a levantar en modo caso a caso |
| SmartScreen o editor no reconocido | Confirma que el `.exe` viene del release oficial y verifica `SHA256SUMS.txt` |

## Documentos relacionados

- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- [docs/windows-installer.md](docs/windows-installer.md)
- [docs/github-releases-distribution.md](docs/github-releases-distribution.md)
- [COMPATIBILITY.md](COMPATIBILITY.md)
