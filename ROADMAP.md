# Roadmap

Hoja de ruta general de `docker-labs`.

Este archivo conserva la direccion macro del proyecto. Para el plan detallado de la plataforma actual, revisa [docs/PLATFORM_ROADMAP.md](C:/docker-labs/docker-labs/docs/PLATFORM_ROADMAP.md).

## Vision

Convertir `docker-labs` en una plataforma modular que permita:

- aprender Docker con casos practicos
- mostrar arquitectura y criterio de producto
- reutilizar entornos como base de sistemas reales

## Prioridad actual

La prioridad ya no es agregar labs por cantidad. La prioridad es consolidar:

- `05-postgres-api` como core transaccional
- `09-multi-service-app` como portal operativo
- `06-nginx-proxy` como gateway de entrada
- el panel principal como centro de control del workspace

## Proximas mejoras

### Plataforma

- integrar mejor `06` con rutas y dominios mas producto
- mejorar navegacion cruzada entre `05`, `09` y el panel
- reforzar estados y automatizacion del control center

### Calidad tecnica

- smoke tests para `05 + 09 + 06`
- verificaciones de CI mas claras
- mayor coherencia en metadata por lab

### Capas complementarias

- observabilidad con `08-prometheus-grafana`
- mensajeria con `07-rabbitmq-messaging`
- cache y performance con `04-redis-cache`
- busqueda con `11-elasticsearch-search`

## Criterio de crecimiento

Un nuevo lab solo suma si cumple al menos una de estas condiciones:

- extiende la plataforma principal
- enseña una capacidad concreta que el repo todavia no cubre
- puede evolucionar en un sistema con identidad propia

## Resultado esperado

El objetivo es que el repositorio deje de percibirse como una coleccion de ejemplos y pase a verse como una plataforma de trabajo modular, presentable y tecnicamente defendible.
