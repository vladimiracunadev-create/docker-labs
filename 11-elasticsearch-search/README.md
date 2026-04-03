# 11 — Elasticsearch Search

> Servicio de indexación y búsqueda full-text para catálogos y bases de conocimiento, con una API Python como capa de acceso.

---

## 🧩 Rol en el repositorio

Este lab introduce búsqueda avanzada de texto completo como capacidad complementaria de la plataforma. Elasticsearch se usa para indexar documentos y ejecutar consultas que van más allá de lo que un `LIKE` en SQL puede ofrecer: scoring por relevancia, búsqueda aproximada, filtros facetados y análisis de texto.

> ⚠️ **Requiere ≥ 6 GB de RAM asignados a Docker.** Elasticsearch carga su JVM completa al arrancar. Por esta razón, este lab está **excluido del CI automático** — funciona correctamente en entornos con recursos suficientes.

---

## 📦 Servicios y puertos

| Servicio | Imagen | Puerto host | Puerto contenedor | Descripción |
|---|---|---:|---:|---|
| `elasticsearch_api` | build local (Python) | `8001` | `8000` | API REST para indexación y búsqueda |
| `elasticsearch_search` | `elasticsearch:8.11.0` | `9200` | `9200` | Motor de búsqueda — modo single-node |

La API espera a que Elasticsearch reporte `healthy` antes de arrancar (`depends_on: condition: service_healthy`).

---

## ⚡ Inicio rápido

```bash
docker compose up -d --build
```

> El primer arranque puede tardar 60–90 segundos mientras Elasticsearch inicializa su JVM y el cluster single-node queda listo.

---

## 🔗 Accesos

| Recurso | URL |
|---|---|
| API — Swagger UI | <http://localhost:8001/docs> |
| API — Health | <http://localhost:8001/health> |
| Elasticsearch — Cluster health | <http://localhost:9200/_cluster/health> |
| Elasticsearch — Índices | <http://localhost:9200/_cat/indices?v> |

---

## ✅ Health checks

### elasticsearch_api

```text
wget -qO- http://localhost:8000/health
```

| Parámetro | Valor |
|---|---|
| Intervalo | 15 s |
| Timeout | 5 s |
| Reintentos | 3 |
| Start period | 40 s |

### elasticsearch_search

```text
wget -qO- http://localhost:9200/_cluster/health
```

| Parámetro | Valor |
|---|---|
| Intervalo | 20 s |
| Timeout | 10 s |
| Reintentos | 5 |
| Start period | 60 s |

---

## 🔍 Verificación

```bash
# Estado de los contenedores
docker compose ps

# Confirmar que Elasticsearch está activo
curl http://localhost:9200/_cluster/health

# Confirmar que la API responde
curl http://localhost:8001/health

# Ver índices disponibles
curl http://localhost:9200/_cat/indices?v
```

---

## ⚠️ Notas de puerto y recursos

| Aspecto | Detalle |
|---|---|
| Puerto `8001` (en lugar de `8000`) | Evita conflicto con **Inventory Core** (`05-postgres-api`) en `8000` |
| RAM mínima | 6 GB asignados a Docker Desktop — Elasticsearch reserva ~2 GB para su JVM |
| CI | Excluido del pipeline automático por requisito de recursos |

---

## 📚 Documentos relacionados

- [README del workspace](../README.md)
- [docs/TECHNICAL_SPECS.md](../docs/TECHNICAL_SPECS.md)
- [05-postgres-api — Inventory Core](../05-postgres-api/README.md)
