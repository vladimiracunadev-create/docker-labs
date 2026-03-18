# 08-prometheus-grafana

Monitoreo con Prometheus y Grafana para el workspace.

## Inicio rapido

```bash
docker compose up -d
```

## Accesos

- Prometheus: http://localhost:9091
- Grafana: http://localhost:3002

## Nota importante

Este lab usa `9091` para evitar conflicto con `dashboard-control` en `9090`. Puedes correr ambos al mismo tiempo sin pisar el Control Center.
