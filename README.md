# Docker Labs

> Plataforma modular de sistemas Docker para aprendizaje practico, prototipado y evolucion de productos.

[![CI](https://github.com/vladimiracunadev-create/docker-labs/actions/workflows/ci.yml/badge.svg)](https://github.com/vladimiracunadev-create/docker-labs/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Workspace Status](https://img.shields.io/badge/workspace-operational-2e8b57)](http://localhost:9090)
[![Platform Focus](https://img.shields.io/badge/focus-core%20%2B%20portal%20%2B%20gateway-c96a2b)](PROJECT_STATUS.md)

---

## 🚀 Implementacion Profesional del Workspace (v1.4)

> **Estado**: 🟢 Operativo  
> **CI**: 🟢 Activo  
> **Audiencia**: 👥 Principiantes, DevOps, backend, full stack, reclutadores  
> **Entrada principal**: 🖥️ [http://localhost:9090](http://localhost:9090)

**Executive Summary**: `docker-labs` ya no se presenta como una coleccion de demos sueltas. Hoy funciona como un workspace modular con una historia principal clara: un panel dockerizado para operar el entorno, un core transaccional, un portal operativo y un gateway comun.

## 🎯 Que resuelve este repositorio

| Capa | Componente | Valor |
|---|---|---|
| Workspace | `dashboard-control` | Permite levantar, detener, diagnosticar y entender el estado del entorno Docker |
| Core | `05-postgres-api` | Provee un backend transaccional con clientes, productos, pedidos y stock |
| Operacion | `09-multi-service-app` | Agrega una experiencia operativa sobre el core |
| Entrada comun | `06-nginx-proxy` | Unifica acceso al panel, al core y al portal |
| Aprendizaje | `learning-center.html` | Entrega contexto formativo dentro del ambiente local |

## 💻 Instalacion en Windows

Descarga el instalador desde GitHub Releases y sigue el asistente:

1. Descarga `docker-labs-setup-{version}.exe` desde **[GitHub Releases](https://github.com/vladimiracunadev-create/docker-labs/releases/latest)**
2. Ejecuta el instalador (acepta el aviso de SmartScreen si aparece — ver nota)
3. Usa el acceso directo **Docker Labs** del menu de inicio o el escritorio
4. El launcher verifica Docker Desktop, levanta el Control Center y abre el browser

> **Nota sobre firma digital**: el instalador no tiene firma digital en v1.x. Esta es una decision explicita de producto. Si Windows SmartScreen muestra una advertencia, selecciona "Mas informacion" → "Ejecutar de todas formas". Ver [docs/windows-installer.md](docs/windows-installer.md#por-que-no-se-usa-firma-digital-en-esta-fase).

---

## ⚡ Quickstart recomendado

Si quieres ver el repo funcionando sin perderte, sigue este orden exacto:

**Paso 1 — Levantar el Control Center**

```bash
# Windows
scripts\start-control-center.cmd

# Linux / macOS
./scripts/start-control-center.sh
```

**Paso 2 — Levantar los labs de la experiencia principal**

```bash
docker compose -f 05-postgres-api/docker-compose.yml up -d --build
docker compose -f 09-multi-service-app/docker-compose.yml up -d --build
docker compose -f 06-nginx-proxy/docker-compose.yml up -d --build
```

> Los labs toman ~30-60 segundos en quedar listos. Puedes monitorear su estado desde el Control Center.

**Paso 3 — Explorar**

1. Abre [http://localhost:9090](http://localhost:9090) → Control Center
2. Revisa el diagnóstico del host y de Docker
3. Accede a `Inventory Core`, `Operations Portal` y `Platform Gateway` desde el panel
4. Explora el Learning Center en [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html)

Entradas principales:

- Control Center: [http://localhost:9090](http://localhost:9090)
- Learning Center: [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html)
- Inventory Core: [http://localhost:8000](http://localhost:8000)
- Swagger del core: [http://localhost:8000/docs](http://localhost:8000/docs)
- Operations Portal: [http://localhost:8083](http://localhost:8083)
- Platform Gateway: [http://localhost:8085](http://localhost:8085)

## 📊 Estado actual del workspace

| Componente | Estado | Rol | Entrada |
|---|---|---|---|
| `dashboard-control` | 🟢 OPERATIVO | Control Center dockerizado | [http://localhost:9090](http://localhost:9090) |
| `05-postgres-api` | 🟢 OPERATIVO | Core transaccional | [http://localhost:8000](http://localhost:8000) |
| `09-multi-service-app` | 🟢 OPERATIVO | Portal operativo | [http://localhost:8083](http://localhost:8083) |
| `06-nginx-proxy` | 🟢 OPERATIVO | Gateway | [http://localhost:8085](http://localhost:8085) |
| Learning Center | 🟢 OPERATIVO | Centro de aprendizaje | [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html) |

### ✅ Capacidades visibles

| Capacidad | Estado | Detalle |
|---|---|---|
| Panel dockerizado | 🟢 Activo | El Control Center corre como contenedor propio |
| Diagnostico de host y Docker | 🟢 Activo | `GET /api/diagnostics` combina navegador y runtime Docker |
| Control por lab | 🟢 Activo | `start`, `stop`, `restart`, `rebuild`, `logs` |
| Control global | 🟢 Activo | `bajar todos` y `eliminar entornos del repo` |
| Gateway integrado | 🟢 Activo | `06` enruta a panel, core y portal |
| Core documentado | 🟢 Activo | `05` tiene portada HTML, `health`, `ready`, `summary` y Swagger |
| Portal conectado | 🟢 Activo | `09` consume el core y agrega capa operativa |
| CI base | 🟢 Activo | Pipeline Compose en [.github/workflows/ci.yml](.github/workflows/ci.yml) |
| Estandar editorial completo en los 12 labs | 🟡 En evolucion | La columna vertebral ya esta elevada; aun faltan mejoras en algunos labs secundarios |

## 🧭 Ruta recomendada por perfil

| Perfil | Documento o entrada | Objetivo |
|---|---|---|
| Principiante | [docs/BEGINNERS_GUIDE.md](docs/BEGINNERS_GUIDE.md) | Entender Docker, el flujo caso a caso y el orden recomendado |
| Usuario del workspace | [http://localhost:9090](http://localhost:9090) | Ver estado, diagnostico y accesos del entorno |
| Dev / DevOps | [docs/DASHBOARD_SETUP.md](docs/DASHBOARD_SETUP.md) | Entender el panel, Compose, gateway y operacion |
| Backend | [05-postgres-api/README.md](05-postgres-api/README.md) | Revisar el core transaccional, contratos y salud |
| Full stack / producto | [09-multi-service-app/README.md](09-multi-service-app/README.md) | Revisar la experiencia operativa sobre el core |
| Reclutador / manager | [RECRUITER.md](RECRUITER.md) | Recorrer el valor del repo en pocos minutos |

## 🏗️ Arquitectura del workspace

```mermaid
flowchart LR
    user[Usuario y operador]
    panel[Control Center 9090]
    gateway[Platform Gateway 8085]
    core[Inventory Core 8000]
    portal[Operations Portal 8083]
    postgres[(PostgreSQL)]
    mongo[(MongoDB)]

    user --> panel
    user --> gateway
    panel --> core
    panel --> portal
    gateway --> panel
    gateway --> core
    gateway --> portal
    portal --> core
    core --> postgres
    portal --> mongo
```

## 🧩 Taxonomia del repositorio

### 🧠 Sistemas principales

| Carpeta | Tipo | Objetivo |
|---|---|---|
| [05-postgres-api](05-postgres-api/README.md) | Plataforma | Resolver clientes, productos, pedidos y stock |
| [09-multi-service-app](09-multi-service-app/README.md) | Plataforma | Dar una experiencia operativa sobre el core |
| [06-nginx-proxy](06-nginx-proxy/README.md) | Plataforma | Unificar accesos hacia panel, core y portal |
| [dashboard-control](dashboard-control/server.js) | Workspace | Operar Docker y entender capacidad del entorno |

### 🧰 Servicios de infraestructura

| Carpeta | Capacidad | Estado narrativo |
|---|---|---|
| `04-redis-cache` | Cache y performance | Complementario |
| `07-rabbitmq-messaging` | Mensajeria asincrona | Complementario |
| `08-prometheus-grafana` | Observabilidad | Complementario |
| `11-elasticsearch-search` | Busqueda | Complementario |
| `12-jenkins-ci` | CI y automatizacion | Complementario |

### 🧪 Starters y demos

| Carpeta | Enfoque |
|---|---|
| `01-node-api` | API REST inicial |
| `02-php-lamp` | Entorno clasico administrativo |
| `03-python-api` | API Python sencilla |
| `10-go-api` | Servicio ligero y rapido |

## 📚 Documentacion del Proyecto

El objetivo de esta seccion es que no tengas que adivinar que leer. Cada documento responde una necesidad concreta y se puede abrir directamente desde aqui.

### 🚀 Inicio y operacion

| Documento | Audiencia | Que resuelve | Abrir |
|---|---|---|---|
| Documentation Index | Todos | Mapa maestro de lectura | [Abrir](docs/DOCUMENTATION_INDEX.md) |
| Beginner Guide | Principiantes | Primeros pasos con Docker y con el repo | [Abrir](docs/BEGINNERS_GUIDE.md) |
| Install Guide | Todos | Instalacion y arranque correcto del workspace | [Abrir](docs/INSTALL.md) |
| Requirements | Todos | Requisitos minimos y recomendados del host y de Docker | [Abrir](docs/REQUIREMENTS.md) |
| Environment Setup | Operadores | Preparacion del equipo y orden sugerido de arranque | [Abrir](ENVIRONMENT_SETUP.md) |
| User Manual | Usuarios del workspace | Uso diario del panel y de los sistemas activos | [Abrir](docs/USER_MANUAL.md) |
| Dashboard Setup | Dev / DevOps | Como funciona el `9090` y como gobierna el entorno | [Abrir](docs/DASHBOARD_SETUP.md) |
| Operating Modes | Todos | Cuando conviene usar modo panel primero, caso a caso o plataforma principal | [Abrir](OPERATING-MODES.md) |
| Runbook | Operadores | Arranque, apagado y respuesta a incidencias comunes | [Abrir](RUNBOOK.md) |

### 🏗️ Arquitectura y referencia tecnica

| Documento | Audiencia | Que resuelve | Abrir |
|---|---|---|---|
| Architecture | Tecnico | Relacion entre panel, core, portal y gateway | [Abrir](docs/ARCHITECTURE.md) |
| Labs Catalog | Todos | Rol de los 12 labs dentro del ecosistema | [Abrir](docs/LABS_CATALOG.md) |
| Labs Runtime Reference | Operadores | Imagenes oficiales, tamanos y requisitos por lab | [Abrir](docs/LABS_RUNTIME_REFERENCE.md) |
| Technical Specs | Tecnico | Stacks, puertos, endpoints y contratos | [Abrir](docs/TECHNICAL_SPECS.md) |
| System Specs | Ejecutivo / tecnico | Vista corta del sistema como plataforma | [Abrir](SYSTEM_SPECS.md) |
| File Architecture | Tecnico | Mapa de carpetas y responsabilidades | [Abrir](FILE_ARCHITECTURE.md) |
| Tooling | Tecnico | Herramientas principales de runtime y desarrollo | [Abrir](docs/TOOLING.md) |
| Compatibility | Operadores | Compatibilidad por sistema operativo, puertos y modos | [Abrir](COMPATIBILITY.md) |
| Glossary | Principiantes | Terminos base del workspace y Docker | [Abrir](GLOSSARY.md) |

### 🪟 Distribucion Windows

| Documento | Audiencia | Que resuelve | Abrir |
|---|---|---|---|
| Windows Installer | Usuarios Windows, reclutadores | Como instalar, compilar, distribuir y justificar ausencia de firma digital | [Abrir](docs/windows-installer.md) |
| GitHub Releases Distribution | Maintainers | Estrategia de distribucion via releases, sin binarios en el repo | [Abrir](docs/github-releases-distribution.md) |
| Technical Audit | Tecnico | Estado diagnosticado del repo y correcciones aplicadas | [Abrir](docs/technical-audit.md) |

### 📈 Estado, release y gobernanza

| Documento | Audiencia | Que resuelve | Abrir |
|---|---|---|---|
| Project Status | Todos | Que esta consolidado hoy y que sigue en evolucion | [Abrir](PROJECT_STATUS.md) |
| Platform Roadmap | Todos | Direccion futura y prioridades de madurez | [Abrir](docs/PLATFORM_ROADMAP.md) |
| Changelog | Todos | Historial de cambios relevantes | [Abrir](CHANGELOG.md) |
| Release Guide | Maintainers | Checklist de publicacion coherente | [Abrir](RELEASE.md) |
| Killed Practices | Tecnico / liderazgo | Practicas y enfoques que el repo evita | [Abrir](killed.md) |
| Support | Maintainers | Criterios de soporte y continuidad | [Abrir](SUPPORT.md) |
| Developing | Devs | Como extender y mantener el workspace | [Abrir](DEVELOPING.md) |
| Security | DevSecOps | Alcance y politica de seguridad | [Abrir](SECURITY.md) |
| Contributing | Colaboradores | Flujo de contribucion y estandar de trabajo | [Abrir](CONTRIBUTING.md) |
| Code of Conduct | Comunidad | Marco de convivencia del proyecto | [Abrir](CODE_OF_CONDUCT.md) |

### 👀 Evaluacion externa

| Documento | Audiencia | Que resuelve | Abrir |
|---|---|---|---|
| Recruiter Guide | Reclutadores / managers | Recorrido rapido del valor de portafolio y madurez tecnica | [Abrir](RECRUITER.md) |

## ✅ Lo que este repo es hoy

- un workspace usable para aprender y operar stacks Docker
- un activo de portafolio tecnico con una historia principal clara
- una base seria para seguir integrando servicios y fortalecer practicas DevOps

## 🚧 Lo que todavia no busca ser

- un reemplazo completo de Docker Desktop
- una plataforma productiva terminada en sus 12 labs
- un ecosistema ya homogeneo en todas sus carpetas

## 📄 Licencia

Proyecto bajo [Apache License 2.0](LICENSE).
