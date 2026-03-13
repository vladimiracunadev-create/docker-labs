# Docker Labs

> Plataforma modular de sistemas Docker para aprendizaje practico, prototipado y evolucion de productos.

[![CI](https://github.com/vladimiracunadev-create/docker-labs/actions/workflows/ci.yml/badge.svg)](https://github.com/vladimiracunadev-create/docker-labs/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](C:/docker-labs/docker-labs/LICENSE)
[![Workspace Status](https://img.shields.io/badge/workspace-operational-2e8b57)](http://localhost:9090)
[![Platform Focus](https://img.shields.io/badge/focus-core%20%2B%20portal%20%2B%20gateway-c96a2b)](C:/docker-labs/docker-labs/PROJECT_STATUS.md)

---

## Implementacion Profesional del Workspace

`docker-labs` ya no se entiende solo como una coleccion de contenedores sueltos. Hoy funciona como un workspace modular con:

1. 🧠 un core transaccional para entidades de negocio
2. 🖥️ una capa operativa para visualizar y operar el flujo
3. 🌐 un gateway para unificar accesos
4. 🐳 un control center dockerizado para gobernar el entorno
5. 🧰 servicios complementarios para performance, mensajeria, observabilidad, busqueda y CI

Tip

Si quieres entender el repositorio rapido, entra primero a [http://localhost:9090](http://localhost:9090), luego abre `Inventory Core`, `Operations Portal` y `Platform Gateway`.

---

## 📊 Estado del Workspace

| Componente | Estado | Rol | Entrada |
|---|---|---|---|
| `dashboard-control` | 🟢 OPERATIVO | Control Center | [http://localhost:9090](http://localhost:9090) |
| `05-postgres-api` | 🟢 OPERATIVO | Core transaccional | [http://localhost:8000](http://localhost:8000) |
| `09-multi-service-app` | 🟢 OPERATIVO | Portal operativo | [http://localhost:8083](http://localhost:8083) |
| `06-nginx-proxy` | 🟢 OPERATIVO | Gateway | [http://localhost:8085](http://localhost:8085) |
| `Learning Center` | 🟢 OPERATIVO | Centro de aprendizaje | [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html) |

### Estado de Capacidades

| Capacidad | Estado | Detalle |
|---|---|---|
| Panel dockerizado | 🟢 | `dashboard-control` corre en `9090` como contenedor |
| Diagnostico del host y Docker | 🟢 | `GET /api/diagnostics` cruza navegador + runtime Docker |
| Control por lab | 🟢 | `start`, `stop`, `restart`, `rebuild`, `logs` |
| Control global | 🟢 | `bajar todos` y `eliminar entornos del repo` |
| Gateway funcional | 🟢 | `06` enruta a panel, core y portal |
| Core documentado | 🟢 | `05` tiene sistema, Swagger, healthchecks y summary |
| Portal integrado | 🟢 | `09` consume `05` y agrega capa operativa |
| CI base | 🟢 | Workflow Compose en [.github/workflows/ci.yml](C:/docker-labs/docker-labs/.github/workflows/ci.yml) |
| Labs secundarios al mismo estandar editorial | 🟡 | Aun falta elevar todos los README por carpeta |

---

## ✨ Caracteristicas Principales

- ✅ Workspace gobernado desde un panel dockerizado en `9090`
- ✅ Diferenciacion clara entre `Estado Docker` y `Abrir sistema`
- ✅ Core de negocio con FastAPI + PostgreSQL
- ✅ Portal operativo con Node.js + MongoDB + frontend Nginx
- ✅ Gateway central con Nginx
- ✅ Diagnostico de CPU, RAM y carga de Docker para decidir que conviene levantar
- ✅ Learning Center integrado dentro del ambiente local
- ✅ CI de Docker Compose en GitHub Actions
- ✅ Documentacion pensada para novatos, operadores, reclutadores y mantenedores

---

## 🧭 ¿Por donde empezar?

| Si eres... | Ruta recomendada | Que mirar |
|---|---|---|
| Principiante | [Beginner Guide](C:/docker-labs/docker-labs/docs/BEGINNERS_GUIDE.md) | Conceptos, flujo caso a caso y como no perderte |
| Usuario del workspace | [http://localhost:9090](http://localhost:9090) | Estado, diagnostico y apertura de sistemas |
| Dev / DevOps | [Dashboard Setup](C:/docker-labs/docker-labs/docs/DASHBOARD_SETUP.md) | Panel, Compose, gateway y operacion del repo |
| Backend | [05-postgres-api](C:/docker-labs/docker-labs/05-postgres-api/README.md) | Core transaccional, healthchecks y Swagger |
| Full stack / producto | [09-multi-service-app](C:/docker-labs/docker-labs/09-multi-service-app/README.md) | Portal operativo e integracion con el core |
| Reclutador / manager | [For Recruiters](C:/docker-labs/docker-labs/FOR_RECRUITERS.md) | Valor de portafolio, criterio tecnico y narrativa |

---

## 🚀 Ejecucion Rapida

### Opcion recomendada

```powershell
scripts\start-control-center.cmd
```

Entradas principales:

- Control Center: [http://localhost:9090](http://localhost:9090)
- Learning Center: [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html)
- Inventory Core: [http://localhost:8000](http://localhost:8000)
- Swagger del core: [http://localhost:8000/docs](http://localhost:8000/docs)
- Operations Portal: [http://localhost:8083](http://localhost:8083)
- Platform Gateway: [http://localhost:8085](http://localhost:8085)

### Opcion manual

```powershell
docker compose -f dashboard-control\docker-compose.yml up -d --build
docker compose -f 05-postgres-api\docker-compose.yml up -d --build
docker compose -f 09-multi-service-app\docker-compose.yml up -d --build
docker compose -f 06-nginx-proxy\docker-compose.yml up -d --build
```

---

## 🧩 Taxonomia del Repositorio

### Sistemas principales

| Carpeta | Tipo | Objetivo |
|---|---|---|
| [05-postgres-api](C:/docker-labs/docker-labs/05-postgres-api/README.md) | Plataforma | Resolver clientes, productos, pedidos y stock |
| [09-multi-service-app](C:/docker-labs/docker-labs/09-multi-service-app/README.md) | Plataforma | Dar una experiencia operativa sobre el core |
| [06-nginx-proxy](C:/docker-labs/docker-labs/06-nginx-proxy/README.md) | Plataforma | Unificar accesos hacia panel, core y portal |
| [dashboard-control](C:/docker-labs/docker-labs/dashboard-control/server.js) | Workspace | Operar Docker y entender capacidad del entorno |

### Servicios de infraestructura

| Carpeta | Capacidad | Estado narrativo |
|---|---|---|
| `04-redis-cache` | Cache y performance | Complementario |
| `07-rabbitmq-messaging` | Mensajeria asincrona | Complementario |
| `08-prometheus-grafana` | Observabilidad | Complementario |
| `11-elasticsearch-search` | Busqueda | Complementario |
| `12-jenkins-ci` | CI y automatizacion | Complementario |

### Starters y demos

| Carpeta | Enfoque |
|---|---|
| `01-node-api` | API REST inicial |
| `02-php-lamp` | Entorno clasico administrativo |
| `03-python-api` | API Python sencilla |
| `10-go-api` | Servicio ligero y rapido |

---

## 🖥️ Control Center

El panel principal en [http://localhost:9090](http://localhost:9090):

- muestra estado Docker real
- controla `docker compose` por lab
- distingue entre `Estado Docker` y `Abrir sistema`
- lee capacidad del host y de Docker
- recomienda que conviene levantar segun memoria y carga actuales

### Endpoints relevantes

- `GET /api/overview`
- `GET /api/diagnostics`
- `POST /api/labs/:id/start`
- `POST /api/labs/:id/stop`
- `POST /api/workspace/stop-all`
- `POST /api/workspace/remove-all`

---

## 📚 Documentacion Recomendada

### Navegacion principal

| Documento | Descripcion | Cuando leerlo | Abrir |
|---|---|---|---|
| `Documentation Index` | Mapa general de la documentacion del repo | Cuando no sabes por donde empezar | [Abrir](C:/docker-labs/docker-labs/docs/DOCUMENTATION_INDEX.md) |
| `Beginner Guide` | Ruta simple y guiada para novatos | Si estas empezando con Docker o con este repo | [Abrir](C:/docker-labs/docker-labs/docs/BEGINNERS_GUIDE.md) |
| `Install Guide` | Instalacion, requisitos y arranque del entorno | Si vas a preparar el workspace desde cero | [Abrir](C:/docker-labs/docker-labs/docs/INSTALL.md) |
| `User Manual` | Operacion diaria del workspace y de los sistemas principales | Si ya tienes Docker andando y quieres usar el repo | [Abrir](C:/docker-labs/docker-labs/docs/USER_MANUAL.md) |
| `Dashboard Setup` | Arquitectura, despliegue y rol del panel `9090` | Si quieres entender o mantener el control center | [Abrir](C:/docker-labs/docker-labs/docs/DASHBOARD_SETUP.md) |

### Referencia tecnica

| Documento | Descripcion | Cuando leerlo | Abrir |
|---|---|---|---|
| `Architecture` | Explica la arquitectura general y la intencion de plataforma | Si quieres entender el diseño global del repo | [Abrir](C:/docker-labs/docker-labs/docs/ARCHITECTURE.md) |
| `Labs Catalog` | Cataloga los 12 labs y resume su funcion | Si quieres una vista global de carpetas y roles | [Abrir](C:/docker-labs/docker-labs/docs/LABS_CATALOG.md) |
| `Labs Runtime Reference` | Resume imagenes, tamanos y requisitos por lab | Si necesitas decidir que puedes levantar segun tu equipo | [Abrir](C:/docker-labs/docker-labs/docs/LABS_RUNTIME_REFERENCE.md) |
| `Technical Specs` | Resume stacks, puertos, endpoints y contratos tecnicos | Si buscas detalle tecnico rapido | [Abrir](C:/docker-labs/docker-labs/docs/TECHNICAL_SPECS.md) |

### Estado, operacion y roadmap

| Documento | Descripcion | Cuando leerlo | Abrir |
|---|---|---|---|
| `Project Status` | Resume lo que ya esta consolidado y lo que sigue en evolucion | Si quieres saber el estado real del repo | [Abrir](C:/docker-labs/docker-labs/PROJECT_STATUS.md) |
| `Platform Roadmap` | Explica la direccion futura del workspace | Si quieres ver hacia donde va el proyecto | [Abrir](C:/docker-labs/docker-labs/docs/PLATFORM_ROADMAP.md) |
| `Changelog` | Registra cambios relevantes y evolucion del repositorio | Si quieres revisar el historial reciente | [Abrir](C:/docker-labs/docker-labs/CHANGELOG.md) |
| `FAQ` | Responde dudas comunes de operacion, acceso y capacidad | Si quieres respuestas rapidas sin leer toda la documentacion | [Abrir](C:/docker-labs/docker-labs/FAQ.md) |

### Lectura externa

| Documento | Descripcion | Para quien | Abrir |
|---|---|---|---|
| `For Recruiters` | Lectura rapida de valor tecnico, alcance y foco del repositorio | Reclutadores y evaluadores tecnicos | [Abrir](C:/docker-labs/docker-labs/FOR_RECRUITERS.md) |
| `Developing` | Guia para extender, mantener o continuar la evolucion del proyecto | Quien vaya a desarrollar sobre el repo | [Abrir](C:/docker-labs/docker-labs/DEVELOPING.md) |
| `Support` | Criterios de soporte, ayuda y mantenimiento | Quien necesite apoyo operativo o documental | [Abrir](C:/docker-labs/docker-labs/SUPPORT.md) |

---

## 🎯 Que mejora este enfoque

Este repositorio gana valor cuando cada carpeta deja de ser "otro Docker" y pasa a ser:

- un sistema con objetivo
- un entorno instalable
- una pieza de una plataforma mayor
- una base de aprendizaje reutilizable

---

## 🔭 Direccion recomendada

1. Consolidar `05`, `09`, `06` y `9090` como experiencia principal.
2. Estandarizar metadata y README de las 12 carpetas.
3. Reforzar pruebas, CI y observabilidad.
4. Convertir mas labs en capacidades integradas, no en demos aisladas.

## 📄 Licencia

Proyecto bajo [Apache License 2.0](C:/docker-labs/docker-labs/LICENSE).
