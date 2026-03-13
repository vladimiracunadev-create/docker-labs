# 06-nginx-proxy

## Platform Gateway

`06-nginx-proxy` deja de ser un reverse proxy de ejemplo y pasa a cumplir un rol concreto dentro del repositorio: actuar como puerta de entrada a los sistemas principales.

## Problema que resuelve

Cuando el repositorio empieza a tener varios sistemas activos, recordar puertos y diferenciar panel, core y portal se vuelve innecesariamente confuso.

Este gateway existe para ordenar esa experiencia:

- concentra accesos
- presenta una entrada comun
- prepara la plataforma para una integracion mayor

## Implementacion entregada

El gateway expone:

- portada propia en `http://localhost:8085`
- acceso al control center en `/control/`
- acceso al Inventory Core en `/core/`
- acceso al Operations Portal en `/portal/`
- acceso a Swagger del core en `/docs`
- healthcheck propio en `/gateway-health`

## Como funciona

El contenedor Nginx usa `host.docker.internal` para enrutar hacia los servicios activos del workspace:

- panel principal en `9090`
- Inventory Core en `8000`
- Operations Portal en `8083`

Con eso no necesita acoplarse a las redes internas de cada compose y puede funcionar como punto de entrada comun del repositorio.

## Inicio rapido

```powershell
cd 06-nginx-proxy
docker compose up -d --build
```

## Entradas principales

- Gateway: [http://localhost:8085](http://localhost:8085)
- Control center: [http://localhost:8085/control/](http://localhost:8085/control/)
- Inventory Core: [http://localhost:8085/core/](http://localhost:8085/core/)
- Swagger del core: [http://localhost:8085/docs](http://localhost:8085/docs)
- Operations Portal: [http://localhost:8085/portal/](http://localhost:8085/portal/)

## Verificacion

```powershell
docker compose ps
curl http://localhost:8085/gateway-health
```

## Justificacion de su existencia

Este laboratorio suma valor porque representa una capacidad transversal real de cualquier plataforma: una capa de entrada que organiza accesos y reduce friccion operativa.

Dentro de este repositorio, su existencia se justifica especialmente cuando `05` y `09` ya estan arriba y quieres usarlos como un sistema relacionado, no como puertos aislados.
