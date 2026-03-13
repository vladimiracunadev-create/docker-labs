# 09-multi-service-app

## Operations Portal

`09-multi-service-app` es el portal operativo del repositorio. Su funcion es tomar el `inventory-core` de `05-postgres-api` y volverlo visible para usuarios operativos mediante una interfaz web lista para usar.

En terminos de producto:

- `05-postgres-api` resuelve la operacion transaccional
- `09-multi-service-app` resuelve la visibilidad, seguimiento y coordinacion diaria

Este lab justifica su existencia porque muestra una arquitectura real de dos capas: un core relacional de negocio y un portal complementario con almacenamiento flexible para notas operativas.

## Problema Que Resuelve

Un equipo comercial u operativo necesita:

- ver el estado general del negocio sin entrar a Swagger ni a la base de datos
- identificar productos con riesgo de quiebre de stock
- revisar pedidos recientes
- registrar notas de seguimiento sin contaminar el modelo transaccional principal

Operations Portal resuelve ese escenario con una UI simple, una API agregadora y MongoDB como soporte para datos flexibles de la watchlist.

## Arquitectura Entregada

- `frontend`: HTML servido con Nginx en `http://localhost:8083`
- `backend`: API Express en `http://localhost:3003/api` que consulta `05-postgres-api`
- `db`: MongoDB para watchlist y notas operativas persistentes

## Dependencia Con Inventory Core

Este portal depende de `05-postgres-api` levantado previamente en `http://localhost:8000`.

El backend usa `INVENTORY_API_BASE_URL=http://host.docker.internal:8000` para conectarse al core transaccional desde Docker Desktop. Eso permite mantener ambos labs desacoplados y reutilizables.

## Inicio Rapido

```bash
cd 05-postgres-api
docker compose up -d --build

cd ../09-multi-service-app
docker compose up -d --build
```

## Funcionalidades Entregadas

- dashboard operativo con resumen de clientes, productos, pedidos y revenue confirmado
- listado de productos recientes
- vista de stock critico
- pedidos recientes provenientes del core transaccional
- watchlist persistida en MongoDB para notas operativas
- healthchecks para backend y base de datos

## Endpoints y URLs

- Frontend: [http://localhost:8083](http://localhost:8083)
- Backend health: [http://localhost:3003/api/health](http://localhost:3003/api/health)
- Backend overview: [http://localhost:3003/api/overview](http://localhost:3003/api/overview)
- Watchlist: [http://localhost:3003/api/watchlist](http://localhost:3003/api/watchlist)

## Verificacion

```bash
curl http://localhost:3003/api/health
curl http://localhost:3003/api/overview
curl http://localhost:3003/api/watchlist
```

## Por Que MongoDB Existe En Este Lab

MongoDB no reemplaza al core transaccional. Su presencia tiene una justificacion clara: almacenar informacion flexible del portal, como notas y seguimiento operativo, sin forzar ese comportamiento dentro del esquema relacional del sistema principal.
