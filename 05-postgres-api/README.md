# 05-postgres-api

Inventory Core es un servicio transaccional construido con FastAPI y PostgreSQL para gestionar clientes, productos y pedidos. Dentro de `docker-labs`, este laboratorio existe para demostrar cuando una base relacional aporta valor real: integridad, consistencia, consultas estructuradas y operaciones de negocio que no conviene resolver con un backend trivial.

## Purpose

Este lab representa el nucleo de un sistema comercial pequeno o mediano:

- catalogo de productos con stock
- cartera de clientes
- registro de pedidos
- control basico de inventario
- resumen operativo para dashboards

En el ecosistema del repositorio, este servicio puede evolucionar en un `core-service` para CRM, inventario o pedidos.

## Why This Service Exists

Se construyo porque PostgreSQL tiene sentido cuando necesitas:

- relaciones claras entre entidades de negocio
- restricciones de unicidad e integridad referencial
- operaciones concurrentes mas seguras
- una base estable para exponer APIs serias a frontend, gateway y servicios auxiliares

La existencia de este laboratorio se justifica porque muestra un caso donde Docker encapsula un backend de negocio real, no solo un ejemplo academico.

## Delivered System

El sistema entrega:

- API FastAPI documentada en Swagger
- PostgreSQL 15 con volumen persistente
- seed inicial de clientes y productos
- endpoints de health y readiness
- endpoints para clientes, productos, pedidos y resumen
- despliegue local con Docker Compose
- manifiestos base para Kubernetes

## Domain Model

```text
Customer 1 --- N Order 1 --- N OrderLine N --- 1 Product
```

## Quick Start

```bash
cd 05-postgres-api
docker compose up -d --build
```

Accesos:

- API: [http://localhost:8000](http://localhost:8000)
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- OpenAPI JSON: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)
- PostgreSQL: `localhost:5432`

## Configuration

Archivo base: `.env.example`

```env
POSTGRES_DB=inventory
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/inventory
```

## API Contract

### System

- `GET /`
- `GET /health`
- `GET /ready`
- `GET /summary`

### Customers

- `POST /customers`
- `GET /customers`

```json
{
  "name": "Contoso Retail",
  "email": "ops@contoso.example.com"
}
```

### Products

- `POST /products`
- `GET /products`
- `GET /products?low_stock_only=true`

```json
{
  "sku": "KB-ERG-01",
  "name": "Teclado ergonomico",
  "description": "Periferico para estaciones de trabajo",
  "price": 79.90,
  "stock": 18
}
```

### Orders

- `POST /orders`
- `GET /orders`
- `PATCH /orders/{order_id}`

```json
{
  "customer_id": 1,
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 2, "quantity": 1 }
  ]
}
```

## Verification

```bash
docker compose ps
curl http://localhost:8000/health
curl http://localhost:8000/ready
curl http://localhost:8000/summary
```

Flujo minimo:

```bash
curl -X POST http://localhost:8000/customers ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Demo Corp\",\"email\":\"demo@corp.example.com\"}"
```

## Kubernetes

```bash
cd 05-postgres-api/k8s
kubectl apply -f deployment.yaml
kubectl port-forward svc/postgres-api-service 8000:8000
```

## Design Decisions

- **FastAPI**: validacion y documentacion automatica
- **PostgreSQL**: consistencia transaccional y modelo relacional
- **SQLAlchemy**: persistencia suficientemente expresiva para el lab
- **Seed inicial**: entorno util desde el primer arranque
- **Readiness endpoint**: diferencia proceso vivo de dependencia lista

## Current Boundaries

Este laboratorio esta listo para desarrollo local, demos tecnicas y aprendizaje estructurado. Aun no incorpora autenticacion, migraciones versionadas, pruebas automatizadas de contrato ni observabilidad avanzada.
