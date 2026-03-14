# File Architecture

Mapa de archivos y carpetas del workspace para entender rapido donde vive cada responsabilidad.

## Objetivo

Este documento responde:

> "¿Como esta organizado el repositorio y donde debo entrar segun lo que quiero hacer?"

## Vista general

| Ruta | Rol |
|---|---|
| [`README.md`](C:/docker-labs/docker-labs/README.md) | Portada principal del proyecto |
| [`dashboard-control/`](C:/docker-labs/docker-labs/dashboard-control/server.js) | Control Center dockerizado |
| [`05-postgres-api/`](C:/docker-labs/docker-labs/05-postgres-api/README.md) | Core transaccional principal |
| [`09-multi-service-app/`](C:/docker-labs/docker-labs/09-multi-service-app/README.md) | Portal operativo |
| [`06-nginx-proxy/`](C:/docker-labs/docker-labs/06-nginx-proxy/README.md) | Gateway de acceso |
| [`docs/`](C:/docker-labs/docker-labs/docs/DOCUMENTATION_INDEX.md) | Documentacion estructural, tecnica y operativa |
| [`scripts/`](C:/docker-labs/docker-labs/scripts/start-control-center.cmd) | Scripts locales de apoyo |
| [`01-12/`](C:/docker-labs/docker-labs/docs/LABS_CATALOG.md) | Labs individuales y sus stacks |

## Distribucion por capas

### 1. Workspace

- `dashboard-control/`
- `index.html`
- `dashboard.js`
- `dashboard.css`
- `learning-center.html`

### 2. Plataforma principal

- `05-postgres-api/`
- `09-multi-service-app/`
- `06-nginx-proxy/`

### 3. Infraestructura complementaria

- `04-redis-cache/`
- `07-rabbitmq-messaging/`
- `08-prometheus-grafana/`
- `11-elasticsearch-search/`
- `12-jenkins-ci/`

### 4. Startes y demos de apoyo

- `01-node-api/`
- `02-php-lamp/`
- `03-python-api/`
- `10-go-api/`

### 5. Gobernanza documental

- `CHANGELOG.md`
- `PROJECT_STATUS.md`
- `ROADMAP.md`
- `DEVELOPING.md`
- `SUPPORT.md`
- `SECURITY.md`

## Donde entrar segun tu objetivo

| Si quieres... | Entra aqui |
|---|---|
| Ver el sistema funcionando | [README](C:/docker-labs/docker-labs/README.md) o [Dashboard Setup](C:/docker-labs/docker-labs/docs/DASHBOARD_SETUP.md) |
| Operar el repo | [RUNBOOK](C:/docker-labs/docker-labs/RUNBOOK.md) |
| Entender estructura | [Architecture](C:/docker-labs/docker-labs/docs/ARCHITECTURE.md) |
| Cambiar stacks o puertos | [Technical Specs](C:/docker-labs/docker-labs/docs/TECHNICAL_SPECS.md) |
| Ver requisitos y compatibilidad | [Requirements](C:/docker-labs/docker-labs/docs/REQUIREMENTS.md) y [Compatibility](C:/docker-labs/docker-labs/COMPATIBILITY.md) |

## Lectura relacionada

- [Architecture](C:/docker-labs/docker-labs/docs/ARCHITECTURE.md)
- [Labs Catalog](C:/docker-labs/docker-labs/docs/LABS_CATALOG.md)
- [Documentation Index](C:/docker-labs/docker-labs/docs/DOCUMENTATION_INDEX.md)
