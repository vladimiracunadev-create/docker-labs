# 📊 Lab 08 — Prometheus + Grafana

Capa de observabilidad del workspace: recolección de métricas con Prometheus y visualización mediante dashboards en Grafana.

---

## 🧩 Rol en el repositorio

Este laboratorio introduce la capa de monitoreo de la plataforma. Prometheus recolecta métricas de los servicios activos; Grafana las expone en dashboards interactivos. Juntos representan el estándar de facto para observabilidad en entornos contenerizados.

> **Requisito de recursos:** se recomienda al menos **4 GB de RAM** asignados a Docker. Prometheus y Grafana juntos tienen una huella considerablemente mayor que el resto de los labs.

## 📦 Servicios y puertos

| Servicio | Imagen | Puerto host | Puerto contenedor | Descripción |
|---|---|---|---|---|
| `prometheus_monitoring` | `prom/prometheus` | `9091` | `9090` | Motor de recolección y almacenamiento de métricas |
| `grafana_monitoring` | `grafana/grafana` | `3002` | `3000` | Interfaz de dashboards y visualización |

La configuración de scraping de Prometheus se define en `prometheus.yml` dentro de este directorio.

## 📡 Targets de scraping

`prometheus.yml` incluye los siguientes jobs de scraping:

| Job | Target | Lab |
|---|---|---|
| `node-api` | `host.docker.internal:3000` | `01-node-api` |
| `python-api` | `host.docker.internal:5000` | `03-python-api` |
| `inventory-core` | `host.docker.internal:8000` | `05-postgres-api` |
| `operations-portal` | `host.docker.internal:3003` | `09-multi-service-app` |
| `go-api` | `host.docker.internal:8084` | `10-go-api` |
| `docker-labs-control-center` | `host.docker.internal:9090` | `dashboard-control` |
| `prometheus` | `localhost:9090` | self-scrape |

> El Control Center expone sus propias métricas en `GET /metrics` en formato
> Prometheus Text Exposition. Ver sección **Dashboards** a continuación.

## 📊 Dashboards incluidos

| Archivo | UID | Descripción |
|---|---|---|
| `grafana-dashboards/control-center.json` | `docker-labs-control-center` | Métricas del Control Center: requests, errores, acciones Docker, uptime, labs conocidos |

Para importar en Grafana: **Dashboards → Import → Upload JSON file**.

## ⚡ Inicio rápido

```bash
docker compose up -d
```

## 🔗 Accesos

| Servicio | URL | Credenciales |
|---|---|---|
| Prometheus | <http://localhost:9091> | — |
| Grafana | <http://localhost:3002> | `admin` / ver `.env` |

> Grafana solicita cambio de contraseña en el primer inicio de sesión.
> Las credenciales se configuran en `.env` (ver `.env.example`).

## ✅ Health checks

### prometheus_monitoring

```text
wget -qO- http://127.0.0.1:9090/-/healthy
```

| Parámetro | Valor |
|---|---|
| Intervalo | 15 s |
| Timeout | 5 s |
| Reintentos | 3 |
| Start period | 20 s |

### grafana_monitoring

```text
wget -qO- http://127.0.0.1:3000/api/health
```

| Parámetro | Valor |
|---|---|
| Intervalo | 15 s |
| Timeout | 5 s |
| Reintentos | 3 |
| Start period | 30 s |

## 🔍 Verificación

```bash
# Estado de ambos contenedores
docker compose ps

# Confirmar que Prometheus está activo
curl http://localhost:9091/-/healthy

# Confirmar que Grafana está activa
curl http://localhost:3002/api/health

# Ver logs
docker compose logs prometheus_monitoring
docker compose logs grafana_monitoring
```

## ⚠️ Notas

| Puerto | Razón del cambio |
|---|---|
| `9091` (en lugar de `9090`) | Evita conflicto con **Control Center** (`dashboard-control`) que ocupa `9090` |
| `3002` (en lugar de `3000`) | Evita conflicto con el backend de **09-multi-service-app** que utiliza `3003` en su stack interno |

Ambos labs pueden ejecutarse simultáneamente sin pisarse.

## 📚 Documentos relacionados

- [Repositorio principal](../README.md)
- [Documentación oficial de Prometheus](https://prometheus.io/docs/)
- [Documentación oficial de Grafana](https://grafana.com/docs/)
