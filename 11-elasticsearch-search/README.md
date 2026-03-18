# 11-elasticsearch-search

Busqueda con Elasticsearch para catalogos y pruebas de indexacion.

## Inicio rapido

```bash
docker compose up -d --build
```

## Accesos

- API: http://localhost:8001/docs
- Elasticsearch: http://localhost:9200

## Nota importante

Este lab usa `8001` para evitar conflicto con `05-postgres-api` en `8000`. Puedes levantar ambos entornos sin pisar el Inventory Core.
