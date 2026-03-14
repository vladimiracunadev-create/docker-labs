# Runbook

> **Version**: 1.4  
> **Estado**: Activo  
> **Uso recomendado**: Guia de operacion rapida para el dia a dia del workspace

---

## Acciones frecuentes

| Accion | Comando |
|---|---|
| Levantar el panel principal | `scripts\start-control-center.cmd` |
| Levantar la plataforma principal | `docker compose -f dashboard-control\docker-compose.yml up -d --build` + stacks principales |
| Bajar la plataforma principal | `docker compose -f ... down` por cada stack |

### Levantar la plataforma principal

```powershell
docker compose -f dashboard-control\docker-compose.yml up -d --build
docker compose -f 05-postgres-api\docker-compose.yml up -d --build
docker compose -f 09-multi-service-app\docker-compose.yml up -d --build
docker compose -f 06-nginx-proxy\docker-compose.yml up -d --build
```

### Bajar todos los entornos del repo

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
| Core | [http://localhost:8000](http://localhost:8000) |
| Portal | [http://localhost:8083](http://localhost:8083) |
| Gateway | [http://localhost:8085](http://localhost:8085) |

## Respuesta a incidencias comunes

| Problema | Respuesta operativa |
|---|---|
| `9090` no responde | Revisa si el Control Center esta arriba |
| `8000` responde, pero el portal falla | Revisa `09` y su backend |
| Gateway sin rutas | Valida que `05`, `09` y `9090` esten levantados |
| Docker saturado | Baja todo y vuelve a levantar en modo caso a caso |

## Documentos relacionados

- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- [OPERATING-MODES.md](OPERATING-MODES.md)
- [COMPATIBILITY.md](COMPATIBILITY.md)
