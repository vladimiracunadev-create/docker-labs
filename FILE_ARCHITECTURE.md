# File Architecture

> **Version**: 1.4  
> **Estado**: Activo  
> **Uso recomendado**: Abre este documento si quieres entender rapido donde vive cada responsabilidad en el repo

---

## Vista general

| Ruta | Rol | Abrir |
|---|---|---|
| `README.md` | Portada principal del proyecto | [Abrir](README.md) |
| `dashboard-control/` | Control Center dockerizado | [Abrir](dashboard-control/server.js) |
| `05-postgres-api/` | Core transaccional principal | [Abrir](05-postgres-api/README.md) |
| `09-multi-service-app/` | Portal operativo | [Abrir](09-multi-service-app/README.md) |
| `06-nginx-proxy/` | Gateway de acceso | [Abrir](06-nginx-proxy/README.md) |
| `docs/` | Documentacion estructural, tecnica y operativa | [Abrir](docs/DOCUMENTATION_INDEX.md) |
| `scripts/` | Scripts locales de apoyo | [Abrir](scripts/start-control-center.cmd) |

## Distribucion por capas

### Workspace

- `dashboard-control/`
- `index.html`
- `dashboard.js`
- `dashboard.css`
- `learning-center.html`

### Plataforma principal

- `05-postgres-api/`
- `09-multi-service-app/`
- `06-nginx-proxy/`

### Infraestructura complementaria

- `04-redis-cache/`
- `07-rabbitmq-messaging/`
- `08-prometheus-grafana/`
- `11-elasticsearch-search/`
- `12-jenkins-ci/`

### Starters y demos

- `01-node-api/`
- `02-php-lamp/`
- `03-python-api/`
- `10-go-api/`

## Donde entrar segun tu objetivo

| Si quieres... | Documento |
|---|---|
| Ver el sistema funcionando | [README.md](README.md) |
| Operar el repo | [RUNBOOK.md](RUNBOOK.md) |
| Entender la arquitectura | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Cambiar stacks o puertos | [docs/TECHNICAL_SPECS.md](docs/TECHNICAL_SPECS.md) |
| Ver el catalogo completo | [docs/LABS_CATALOG.md](docs/LABS_CATALOG.md) |

## Documentos relacionados

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/LABS_CATALOG.md](docs/LABS_CATALOG.md)
- [docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)
