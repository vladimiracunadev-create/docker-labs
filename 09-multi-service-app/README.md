# 09-multi-service-app — Operations Portal

> **Versión**: 1.5.0
> **Estado**: 🟢 Operativo
> **Audiencia**: 👥 Full stack, producto, reclutadores
> **Rol en la plataforma**: Portal operativo sobre el Inventory Core

---

`09-multi-service-app` es el portal operativo del repositorio. Su función es tomar el `inventory-core` de `05-postgres-api` y volverlo visible para usuarios operativos mediante una interfaz web lista para usar.

En términos de producto:

| Capa | Qué resuelve |
|---|---|
| `05-postgres-api` | Operación transaccional (clientes, productos, pedidos, stock) |
| `09-multi-service-app` | Visibilidad, seguimiento y coordinación diaria |

Este lab justifica su existencia porque muestra una arquitectura real de dos capas: un core relacional de negocio y un portal complementario con almacenamiento flexible para notas operativas.

## 🧩 Problema que resuelve

Un equipo comercial u operativo necesita:

- ver el estado general del negocio sin entrar a Swagger ni a la base de datos
- identificar productos con riesgo de quiebre de stock
- revisar pedidos recientes
- registrar notas de seguimiento sin contaminar el modelo transaccional principal

Operations Portal resuelve ese escenario con una UI simple, una API agregadora y MongoDB como soporte para datos flexibles de la watchlist.

## 🏗️ Arquitectura entregada

| Componente | Tecnología | URL |
|---|---|---|
| `frontend` | HTML + Nginx | [http://localhost:8083](http://localhost:8083) |
| `backend` | Express.js | [http://localhost:3003/api](http://localhost:3003/api) |
| `db` | MongoDB | `localhost:27017` |

## 🔗 Dependencia con Inventory Core

Este portal depende de `05-postgres-api` levantado previamente en `http://localhost:8000`.

El backend usa `INVENTORY_API_BASE_URL=http://host.docker.internal:8000` para conectarse al core transaccional desde Docker Desktop. Eso permite mantener ambos labs desacoplados y reutilizables.

## ⚡ Inicio rápido

```bash
cd 05-postgres-api
docker compose up -d --build

cd ../09-multi-service-app
docker compose up -d --build
```

## 📦 Funcionalidades entregadas

| Funcionalidad | Detalle |
|---|---|
| Dashboard operativo | Resumen de clientes, productos, pedidos y revenue confirmado |
| Productos recientes | Listado con stock actual |
| Stock crítico | Vista de productos bajo umbral de alerta |
| Pedidos recientes | Provenientes del core transaccional |
| Watchlist | Notas operativas persistidas en MongoDB |
| Healthchecks | Para backend y base de datos |

## 🔌 Endpoints y URLs

| Recurso | URL |
|---|---|
| Frontend | [http://localhost:8083](http://localhost:8083) |
| Backend health | [http://localhost:3003/api/health](http://localhost:3003/api/health) |
| Backend overview | [http://localhost:3003/api/overview](http://localhost:3003/api/overview) |
| Watchlist | [http://localhost:3003/api/watchlist](http://localhost:3003/api/watchlist) |

## ✅ Verificación

```bash
curl http://localhost:3003/api/health
curl http://localhost:3003/api/overview
curl http://localhost:3003/api/watchlist
```

## 🗄️ Por qué MongoDB existe en este lab

MongoDB no reemplaza al core transaccional. Su presencia tiene una justificación clara: almacenar información flexible del portal, como notas y seguimiento operativo, sin forzar ese comportamiento dentro del esquema relacional del sistema principal.

## 📚 Documentos relacionados

- [README del workspace](../README.md)
- [05-postgres-api — Inventory Core](../05-postgres-api/README.md)
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- [docs/TECHNICAL_SPECS.md](../docs/TECHNICAL_SPECS.md)
