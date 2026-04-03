# 05-postgres-api — Inventory Core

> **Versión**: 1.5.0
> **Estado**: 🟢 Operativo
> **Audiencia**: 👥 Backend, full stack, reclutadores
> **Rol en la plataforma**: Core transaccional del workspace

---

Inventory Core es un servicio transaccional construido con FastAPI y PostgreSQL para gestionar clientes, productos y pedidos. Dentro de `docker-labs`, este laboratorio existe para demostrar cuándo una base relacional aporta valor real: integridad, consistencia, consultas estructuradas y operaciones de negocio que no conviene resolver con un backend trivial.

## 🎯 Propósito

Este lab representa el núcleo de un sistema comercial pequeño o mediano:

| Dominio | Qué resuelve |
|---|---|
| Catálogo | Productos con stock y SKU |
| Clientes | Cartera con datos de contacto |
| Pedidos | Registro y seguimiento por cliente |
| Inventario | Control básico de stock disponible |
| Resumen | Vista operativa para dashboards |

En el ecosistema del repositorio, este servicio puede evolucionar en un `core-service` para CRM, inventario o pedidos.

## 🤔 Por qué existe este servicio

Se construyó porque PostgreSQL tiene sentido cuando necesitas:

- relaciones claras entre entidades de negocio
- restricciones de unicidad e integridad referencial
- operaciones concurrentes más seguras
- una base estable para exponer APIs serias a frontend, gateway y servicios auxiliares

La existencia de este laboratorio se justifica porque muestra un caso donde Docker encapsula un backend de negocio real, no solo un ejemplo académico.

## 📦 Sistema entregado

| Componente | Detalle |
|---|---|
| API | FastAPI documentada en Swagger |
| Base de datos | PostgreSQL 15 con volumen persistente |
| Seed inicial | Clientes y productos precargados |
| Salud | Endpoints `/health` y `/ready` |
| Observabilidad | Endpoints `/summary`, `/insights` y `/metrics` |
| Despliegue | Docker Compose local |
| Infraestructura | Manifiestos base para Kubernetes |

## 🗂️ Modelo de dominio

```text
Customer 1 --- N Order 1 --- N OrderLine N --- 1 Product
```

## ⚡ Inicio rápido

```bash
cd 05-postgres-api
docker compose up -d --build
```

**Accesos:**

| Recurso | URL |
|---|---|
| API | [http://localhost:8000](http://localhost:8000) |
| Swagger UI | [http://localhost:8000/docs](http://localhost:8000/docs) |
| OpenAPI JSON | [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json) |
| PostgreSQL | `localhost:5432` |

## ⚙️ Configuración

Archivo base: `.env.example`

```env
POSTGRES_DB=inventory
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/inventory
```

## 📋 Contrato de API

### Sistema

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/` | Portada del servicio |
| `GET` | `/health` | Liveness check |
| `GET` | `/ready` | Readiness check |
| `GET` | `/summary` | Resumen operativo |
| `GET` | `/insights` | Analitica operativa, top clientes, top productos y reposicion sugerida |
| `GET` | `/metrics` | Metricas Prometheus del core |

### Clientes

| Método | Endpoint |
|---|---|
| `POST` | `/customers` |
| `GET` | `/customers` |

```json
{
  "name": "Contoso Retail",
  "email": "ops@contoso.example.com"
}
```

### Productos

| Método | Endpoint |
|---|---|
| `POST` | `/products` |
| `GET` | `/products` |
| `GET` | `/products?low_stock_only=true` |

```json
{
  "sku": "KB-ERG-01",
  "name": "Teclado ergonómico",
  "description": "Periférico para estaciones de trabajo",
  "price": 79.90,
  "stock": 18
}
```

### Pedidos

| Método | Endpoint |
|---|---|
| `POST` | `/orders` |
| `GET` | `/orders` |
| `PATCH` | `/orders/{order_id}` |

```json
{
  "customer_id": 1,
  "status": "draft",
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 2, "quantity": 1 }
  ]
}
```

> `status` es opcional. Si no se envia, el pedido nace como `confirmed`. Tambien se puede crear como `draft` y confirmarlo despues con `PATCH`.

## ✅ Verificación

```bash
docker compose ps
curl http://localhost:8000/health
curl http://localhost:8000/ready
curl http://localhost:8000/summary
curl http://localhost:8000/insights
curl http://localhost:8000/metrics
```

Flujo mínimo:

```bash
curl -X POST http://localhost:8000/customers \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Demo Corp\",\"email\":\"demo@corp.example.com\"}"
```

## ☸️ Kubernetes

```bash
cd 05-postgres-api/k8s
kubectl apply -f deployment.yaml
kubectl port-forward svc/postgres-api-service 8000:8000
```

## 🧠 Decisiones de diseño

| Decisión | Justificación |
|---|---|
| **FastAPI** | Validación y documentación automática |
| **PostgreSQL** | Consistencia transaccional y modelo relacional |
| **SQLAlchemy** | Persistencia suficientemente expresiva para el lab |
| **Seed inicial** | Entorno útil desde el primer arranque |
| **Readiness endpoint** | Diferencia proceso vivo de dependencia lista |

## 🚧 Alcance actual

Este laboratorio está listo para desarrollo local, demos técnicas y aprendizaje estructurado. Aún no incorpora autenticación, migraciones versionadas, pruebas automatizadas de contrato ni observabilidad avanzada.

## 📚 Documentos relacionados

- [README del workspace](../README.md)
- [09-multi-service-app — portal operativo](../09-multi-service-app/README.md)
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- [docs/TECHNICAL_SPECS.md](../docs/TECHNICAL_SPECS.md)
