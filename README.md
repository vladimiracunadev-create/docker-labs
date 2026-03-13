# Docker Labs

> Plataforma modular de sistemas Docker para aprendizaje practico, prototipado y evolucion de productos.

## ✨ Resumen

`docker-labs` ya no se presenta solo como una coleccion de ejemplos aislados. Hoy funciona como un workspace compuesto por:

- 🧠 un core transaccional
- 🖥️ una capa operativa para usuarios y operadores
- 🌐 una puerta de entrada unificada
- 🧰 servicios de infraestructura para extender capacidades

## 📊 Estado actual

| Componente | Estado | Rol | Entrada |
|---|---|---|---|
| `05-postgres-api` | 🟢 Activo | Core transaccional | [http://localhost:8000](http://localhost:8000) |
| `09-multi-service-app` | 🟢 Activo | Portal operativo | [http://localhost:8083](http://localhost:8083) |
| `06-nginx-proxy` | 🟢 Activo | Gateway | [http://localhost:8085](http://localhost:8085) |
| `dashboard-control` | 🟢 Activo | Control Center | [http://localhost:9090](http://localhost:9090) |

### Estado editorial

- 🟢 Documentacion troncal alineada con el sistema real
- 🟢 Panel principal dockerizado
- 🟢 Diagnostico de capacidad del equipo y de Docker integrado
- 🟡 Labs secundarios aun en proceso de estandarizacion fina

### Estado del workspace

| Capacidad | Estado | Detalle |
|---|---|---|
| Panel dockerizado | 🟢 | `dashboard-control` corre en `9090` como contenedor |
| Gateway funcional | 🟢 | `06-nginx-proxy` enruta hacia panel, core y portal |
| Core transaccional | 🟢 | `05-postgres-api` expone sistema, Swagger y healthchecks |
| Portal operativo | 🟢 | `09-multi-service-app` consume `05` y agrega capa de uso |
| Diagnostico de capacidad | 🟢 | `GET /api/diagnostics` cruza host estimado y runtime Docker |
| Learning Center | 🟢 | Vista HTML integrada en `9090/learning-center.html` |
| CI base | 🟢 | Workflow Compose en [.github/workflows/ci.yml](C:/docker-labs/docker-labs/.github/workflows/ci.yml) |
| Documentacion troncal | 🟢 | README, instalacion, dashboard, manual y runtime alineados |
| Estandarizacion de labs secundarios | 🟡 | Aun falta elevar todos los `README.md` al mismo nivel editorial |

## 🚀 Inicio rapido

### Opcion recomendada

```powershell
scripts\start-control-center.cmd
```

Despues abre:

- Control Center: [http://localhost:9090](http://localhost:9090)
- Learning Center: [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html)

### Opcion manual

```powershell
docker compose -f dashboard-control\docker-compose.yml up -d --build
docker compose -f 05-postgres-api\docker-compose.yml up -d --build
docker compose -f 09-multi-service-app\docker-compose.yml up -d --build
docker compose -f 06-nginx-proxy\docker-compose.yml up -d --build
```

## 🧭 Como leer este repositorio

### 1. Sistemas principales

Estos son los entornos que ya cuentan una historia de producto coherente:

| Carpeta | Tipo | Objetivo |
|---|---|---|
| [05-postgres-api](C:/docker-labs/docker-labs/05-postgres-api/README.md) | Plataforma | Resolver clientes, productos, pedidos y stock |
| [09-multi-service-app](C:/docker-labs/docker-labs/09-multi-service-app/README.md) | Plataforma | Dar una experiencia operativa sobre el core |
| [06-nginx-proxy](C:/docker-labs/docker-labs/06-nginx-proxy/README.md) | Plataforma | Unificar accesos hacia panel, core y portal |
| [dashboard-control](C:/docker-labs/docker-labs/dashboard-control/server.js) | Workspace | Operar Docker y entender capacidad del entorno |

### 2. Servicios de infraestructura

Amplian las capacidades de la plataforma:

| Carpeta | Capacidad | Estado narrativo |
|---|---|---|
| `04-redis-cache` | Cache y performance | Complementario |
| `07-rabbitmq-messaging` | Mensajeria asincrona | Complementario |
| `08-prometheus-grafana` | Observabilidad | Complementario |
| `11-elasticsearch-search` | Busqueda | Complementario |
| `12-jenkins-ci` | CI y automatizacion | Complementario |

### 3. Starters y demos

Buenos para aprender stacks o iniciar productos mas pequenos:

| Carpeta | Enfoque |
|---|---|
| `01-node-api` | API REST inicial |
| `02-php-lamp` | Entorno clasico administrativo |
| `03-python-api` | API Python sencilla |
| `10-go-api` | Servicio ligero y rapido |

## 🖥️ Control Center

El panel principal en [http://localhost:9090](http://localhost:9090):

- muestra estado Docker real
- controla `docker compose` por lab
- distingue entre `Estado Docker` y `Abrir sistema`
- lee capacidad del host y de Docker
- recomienda que conviene levantar segun memoria y carga actuales

### Caracteristicas destacadas

- 🐳 corre como contenedor Docker propio
- 🔎 expone `GET /api/overview` y `GET /api/diagnostics`
- 🧠 diagnostica RAM asignada a Docker y carga actual
- 🧹 permite `Bajar todos los Docker` y `Eliminar entornos del repo`

## 📚 Documentacion recomendada

### Navegacion principal

| Documento | Para que sirve | Cuando leerlo |
|---|---|---|
| [Documentation Index](C:/docker-labs/docker-labs/docs/DOCUMENTATION_INDEX.md) | Mapa general de la documentacion | Cuando no sabes por donde empezar |
| [Beginner Guide](C:/docker-labs/docker-labs/docs/BEGINNERS_GUIDE.md) | Ruta simple para novatos | Si estas empezando con Docker o con este repo |
| [Install Guide](C:/docker-labs/docker-labs/docs/INSTALL.md) | Instalacion, requisitos y arranque | Si vas a preparar el entorno desde cero |
| [User Manual](C:/docker-labs/docker-labs/docs/USER_MANUAL.md) | Operacion diaria del workspace | Si ya tienes Docker andando y quieres usar el repo |
| [Dashboard Setup](C:/docker-labs/docker-labs/docs/DASHBOARD_SETUP.md) | Arquitectura y uso del `9090` | Si quieres entender o mantener el panel |

### Referencia tecnica

| Documento | Para que sirve | Enlace |
|---|---|---|
| Architecture | Explica la arquitectura general y la intencion del repo | [Abrir](C:/docker-labs/docker-labs/docs/ARCHITECTURE.md) |
| Labs Catalog | Cataloga los 12 labs y su rol | [Abrir](C:/docker-labs/docker-labs/docs/LABS_CATALOG.md) |
| Labs Runtime Reference | Resume imagenes, tamanos y requisitos de los 12 casos | [Abrir](C:/docker-labs/docker-labs/docs/LABS_RUNTIME_REFERENCE.md) |
| Technical Specs | Resume stacks, endpoints y especificaciones clave | [Abrir](C:/docker-labs/docker-labs/docs/TECHNICAL_SPECS.md) |

### Estado y roadmap

| Documento | Para que sirve | Enlace |
|---|---|---|
| Project Status | Muestra que esta consolidado y que sigue en evolucion | [Abrir](C:/docker-labs/docker-labs/PROJECT_STATUS.md) |
| Platform Roadmap | Explica la direccion futura del workspace | [Abrir](C:/docker-labs/docker-labs/docs/PLATFORM_ROADMAP.md) |
| Changelog | Registra cambios relevantes del proyecto | [Abrir](C:/docker-labs/docker-labs/CHANGELOG.md) |
| FAQ | Responde dudas frecuentes de operacion | [Abrir](C:/docker-labs/docker-labs/FAQ.md) |

### Lectura externa

| Documento | Para quien | Enlace |
|---|---|---|
| For Recruiters | Reclutadores y evaluadores tecnicos | [Abrir](C:/docker-labs/docker-labs/FOR_RECRUITERS.md) |
| Developing | Quien vaya a extender o mantener el repo | [Abrir](C:/docker-labs/docker-labs/DEVELOPING.md) |
| Support | Quien necesite ayuda o criterios de soporte | [Abrir](C:/docker-labs/docker-labs/SUPPORT.md) |

## 🎯 Que mejora este enfoque

Este repositorio gana valor cuando cada carpeta deja de ser "otro Docker" y pasa a ser:

- un sistema con objetivo
- un entorno instalable
- una pieza de una plataforma mayor
- una base de aprendizaje reutilizable

## 🔭 Direccion recomendada

1. Consolidar `05`, `09`, `06` y `9090` como experiencia principal.
2. Estandarizar metadata y documentacion del resto de labs.
3. Reforzar pruebas, CI y observabilidad.
4. Convertir mas labs en capacidades integradas, no en demos aisladas.

## 📄 Licencia

Proyecto bajo [Apache License 2.0](C:/docker-labs/docker-labs/LICENSE).
