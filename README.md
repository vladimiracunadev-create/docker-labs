# Docker Labs

Repositorio de entornos Docker orientados a aprendizaje practico, prototipado y construccion de sistemas modulares.

Hoy el proyecto ya no se entiende solo como una lista de laboratorios aislados. La direccion actual del repositorio es una plataforma compuesta por:

- un core transaccional
- una capa de experiencia para operadores
- servicios de infraestructura que amplian la solucion

## Estado actual

La columna vertebral del repositorio es esta:

- [05-postgres-api](C:/docker-labs/docker-labs/05-postgres-api/README.md): `Inventory Core`, backend transaccional para clientes, productos y pedidos
- [09-multi-service-app](C:/docker-labs/docker-labs/09-multi-service-app/README.md): `Operations Portal`, experiencia operativa sobre el core
- [06-nginx-proxy](C:/docker-labs/docker-labs/06-nginx-proxy/README.md): futura capa de gateway para unificar accesos

El resto de carpetas sigue siendo util, pero hoy funcionan mejor como piezas complementarias o de aprendizaje que como sistemas principales.

## Inicio rapido

### Opcion recomendada

1. Levanta el panel principal:

```powershell
scripts\start-control-center.cmd
```

2. Abre el menu principal:

[http://localhost:9090](http://localhost:9090)

3. Desde el panel, trabaja primero con:

- `Inventory Core`
- `Operations Portal`

### Opcion manual

```powershell
cd 05-postgres-api
docker compose up -d --build

cd ..\09-multi-service-app
docker compose up -d --build
```

Entradas principales:

- Panel principal: [http://localhost:9090](http://localhost:9090)
- Centro de aprendizaje: [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html)
- Inventory Core: [http://localhost:8000](http://localhost:8000)
- Swagger del core: [http://localhost:8000/docs](http://localhost:8000/docs)
- Operations Portal: [http://localhost:8083](http://localhost:8083)

## Como leer este repositorio

### Sistemas principales

Son los entornos que ya cuentan una historia de producto clara:

| Carpeta | Rol | Tipo |
|---|---|---|
| `05-postgres-api` | Core transaccional | Plataforma |
| `09-multi-service-app` | Portal operativo | Plataforma |
| `06-nginx-proxy` | Gateway de entrada | Plataforma |

### Servicios de infraestructura

Amplian las capacidades de los sistemas principales:

| Carpeta | Capacidad |
|---|---|
| `04-redis-cache` | cache y performance |
| `07-rabbitmq-messaging` | mensajeria asincrona |
| `08-prometheus-grafana` | monitoreo y observabilidad |
| `11-elasticsearch-search` | busqueda e indexacion |
| `12-jenkins-ci` | automatizacion y entrega |

### Starters y demos

Sirven para aprender stacks o como base para futuros productos:

| Carpeta | Enfoque |
|---|---|
| `01-node-api` | API REST inicial |
| `02-php-lamp` | administracion clasica |
| `03-python-api` | API Python sencilla |
| `10-go-api` | servicio ligero y rapido |

## Que mejora este enfoque

Este repositorio gana valor cuando cada carpeta deja de ser "un Docker mas" y pasa a ser:

- un sistema con objetivo claro
- un entorno instalable
- una pieza de una plataforma mayor
- una base real para aprendizaje y evolucion

## Control Center

El panel principal en [http://localhost:9090](http://localhost:9090) ahora separa:

- estado Docker
- control del entorno
- apertura del sistema real

Tambien destaca los sistemas principales del repositorio y muestra su rol dentro de la plataforma.

## Documentacion recomendada

- [docs/ARCHITECTURE.md](C:/docker-labs/docker-labs/docs/ARCHITECTURE.md)
- [docs/BEGINNERS_GUIDE.md](C:/docker-labs/docker-labs/docs/BEGINNERS_GUIDE.md)
- [docs/USER_MANUAL.md](C:/docker-labs/docker-labs/docs/USER_MANUAL.md)
- [docs/LABS_CATALOG.md](C:/docker-labs/docker-labs/docs/LABS_CATALOG.md)
- [docs/LABS_RUNTIME_REFERENCE.md](C:/docker-labs/docker-labs/docs/LABS_RUNTIME_REFERENCE.md)
- [docs/DASHBOARD_SETUP.md](C:/docker-labs/docker-labs/docs/DASHBOARD_SETUP.md)
- [docs/PLATFORM_ROADMAP.md](C:/docker-labs/docker-labs/docs/PLATFORM_ROADMAP.md)
- [CHANGELOG.md](C:/docker-labs/docker-labs/CHANGELOG.md)
- [DEVELOPING.md](C:/docker-labs/docker-labs/DEVELOPING.md)
- [SUPPORT.md](C:/docker-labs/docker-labs/SUPPORT.md)
- [FAQ.md](C:/docker-labs/docker-labs/FAQ.md)
- [FOR_RECRUITERS.md](C:/docker-labs/docker-labs/FOR_RECRUITERS.md)
- [PROJECT_STATUS.md](C:/docker-labs/docker-labs/PROJECT_STATUS.md)

## Siguiente direccion

La mejora recomendada para el repo es:

1. consolidar `05`, `09` y `06` como experiencia de plataforma
2. estandarizar metadata y navegacion entre entornos
3. reforzar tests, CI y observabilidad
4. despues elevar el resto de labs para que encajen en la misma narrativa

## Licencia

Proyecto bajo [Apache License 2.0](C:/docker-labs/docker-labs/LICENSE).
