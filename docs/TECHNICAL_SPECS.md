# ⚙️ Especificaciones Técnicas — Docker Labs

> **Versión**: 1.6.0
> **Estado**: 🟢 Activo
> **Audiencia**: 👥 Técnico, DevOps, reclutadores
> **Objetivo**: Stacks, puertos, endpoints, CI y capa de distribución Windows

---

## 🖥️ Base de ejecución

| Componente | Estado actual |
|---|---|
| Docker runtime | Docker Desktop / Docker Engine con Compose |
| Panel principal | `dashboard-control` en `9090` |
| Gateway | `06-nginx-proxy` en `8085` |
| Core principal | `05-postgres-api` en `8000` |
| Portal principal | `09-multi-service-app` en `8083` |
| Launcher Windows | `docker-labs-launcher.exe` compilado con Go 1.21 (stdlib puro, cero dependencias externas) |
| Instalador Windows | Inno Setup `.exe` distribuido por GitHub Releases |

---

## 🔌 Puertos — todos los labs

| Lab | Servicio | Puerto host |
|---|---|---:|
| `dashboard-control` | Control Center | `9090` |
| `01-node-api` | API Node.js | `3000` |
| `02-php-lamp` | Apache + PHP | `8081` |
| `02-php-lamp` | phpMyAdmin | `8082` |
| `02-php-lamp` | MariaDB | `3306` |
| `03-python-api` | API Python | `5000` |
| `04-redis-cache` | API Node.js | `3001` |
| `04-redis-cache` | Redis | `6379` |
| `05-postgres-api` | API FastAPI | `8000` |
| `05-postgres-api` | PostgreSQL | `5432` |
| `06-nginx-proxy` | Gateway Nginx | `8085` |
| `07-rabbitmq-messaging` | RabbitMQ AMQP | `5672` |
| `07-rabbitmq-messaging` | RabbitMQ Management | `15672` |
| `08-prometheus-grafana` | Prometheus | `9091` |
| `08-prometheus-grafana` | Grafana | `3002` |
| `09-multi-service-app` | Frontend Nginx | `8083` |
| `09-multi-service-app` | Backend Node.js | `3003` |
| `09-multi-service-app` | MongoDB | `27017` |
| `10-go-api` | API Go | `8084` |
| `11-elasticsearch-search` | API Python | `8001` |
| `11-elasticsearch-search` | Elasticsearch | `9200` |
| `12-jenkins-ci` | Jenkins UI | `8080` |
| `12-jenkins-ci` | Jenkins agentes | `50000` |

> Los puertos de `08` y `11` fueron ajustados en la auditoría técnica para evitar conflictos con la plataforma principal. Ver [technical-audit.md](technical-audit.md).

---

## ✅ Health checks — cobertura 12/12 labs

| Lab | Servicio | Check |
|---|---|---|
| `01-node-api` | API | `wget -qO- http://localhost:3000/health` |
| `02-php-lamp` | MariaDB | `mysqladmin ping -h 127.0.0.1` |
| `02-php-lamp` | Apache + PHP | `curl -f http://localhost/` |
| `03-python-api` | API | `curl -f http://localhost:5000/health` |
| `04-redis-cache` | Redis | `redis-cli ping` |
| `04-redis-cache` | API | `wget -qO- http://localhost:3001/health` |
| `05-postgres-api` | API | `curl -f http://localhost:8000/health` |
| `05-postgres-api` | PostgreSQL | `pg_isready` |
| `06-nginx-proxy` | Gateway | `wget -qO- http://127.0.0.1/gateway-health` |
| `07-rabbitmq-messaging` | RabbitMQ | `rabbitmq-diagnostics -q ping` |
| `08-prometheus-grafana` | Prometheus | `wget -qO- http://localhost:9091/-/ready` |
| `08-prometheus-grafana` | Grafana | `wget -qO- http://localhost:3002/api/health` |
| `09-multi-service-app` | MongoDB | `mongosh --eval "db.adminCommand('ping').ok"` |
| `09-multi-service-app` | Backend | `wget -qO- http://localhost:3003/api/health` |
| `10-go-api` | API | `wget -qO- http://localhost:8084/health` |
| `11-elasticsearch-search` | Elasticsearch | `wget -qO- http://localhost:9200/_cluster/health` |
| `11-elasticsearch-search` | API | `curl -f http://localhost:8001/health` |
| `12-jenkins-ci` | Jenkins | `curl -f http://localhost:8080/login` |
| `dashboard-control` | Control Center | `curl -f http://localhost:9090/api/overview` |

---

## 🧪 CI/CD

| Job | Trigger | Descripcion |
|---|---|---|
| `quality-python` | push / PR | pytest sobre `05-postgres-api` con base de datos real |
| `quality-node` | push / PR | node test sobre `09-multi-service-app/backend` |
| `discover` | push / PR | Descubre dinámicamente todos los `docker-compose.yml` del repo |
| `test` (matriz) | push / PR | Levanta y valida cada lab por separado (10 labs; excluye 11 y 12 por recursos) |
| `smoke-platform` | push / PR | Levanta `05` + `09` + `06` con sus compose propios y valida flujo Core → Portal → Gateway |
| `build-windows` | tag `v*.*.*` | Compila el launcher Go y el instalador Inno Setup; publica en GitHub Releases |

**Labs excluidos de la matriz de CI** (validos en local):

- `11-elasticsearch-search` — requiere ≥6 GB RAM
- `12-jenkins-ci` — arranque Jenkins >3 min

---

## 🪟 Capa Windows

| Pieza | Tecnología |
|---|---|
| Launcher | Go 1.21 (stdlib puro, sin dependencias externas) |
| Build del launcher | `go build -ldflags "-X main.launcherVersion=X.Y.Z"` |
| Instalador | Inno Setup 6.x |
| Script de build | `scripts/windows/build-launcher.ps1` + `build-installer.ps1` |
| Manifest central | `labs.config.json` (fuente única de labs, puertos y URLs) |
| Checksums | SHA256 |
| Release automation | GitHub Actions — `.github/workflows/build-windows.yml` |

---

## 📦 Artefactos del release Windows

| Artefacto | Descripción |
|---|---|
| `docker-labs-setup-{version}.exe` | Instalador Inno Setup para Windows 10+ |
| `SHA256SUMS.txt` | Checksums para verificación de integridad |

> El instalador no se versiona dentro del repo. Se publica como asset de GitHub Releases.
> Ver [github-releases-distribution.md](github-releases-distribution.md).

---

## 📝 Notas de implementación

- El launcher valida prerrequisitos pero no empaqueta Docker Desktop
- El instalador final no se almacena dentro del repo
- La ausencia de firma digital está documentada y se compensa con canal oficial + checksums

---

## 📡 Observabilidad (v1.6.0+)

### Control Center — endpoint `/metrics`

El servidor `dashboard-control/server.js` expone métricas propias en
`GET /metrics` en formato **Prometheus Text Exposition**:

| Métrica | Tipo | Descripción |
|---|---|---|
| `docker_labs_requests_total` | counter | Requests HTTP totales recibidos |
| `docker_labs_request_errors_total` | counter | Requests con respuesta de error |
| `docker_labs_lab_actions_total` | counter | Acciones Docker ejecutadas (`up`, `down`, etc.) |
| `docker_labs_lab_action_errors_total` | counter | Acciones Docker que terminaron con error |
| `docker_labs_uptime_seconds` | gauge | Segundos desde inicio del proceso |
| `docker_labs_known_labs` | gauge | Labs cargados desde `labs.config.json` |

El endpoint no requiere autenticación para permitir scraping desde Prometheus
aunque `DASHBOARD_TOKEN` esté configurado.

### Prometheus — scrape targets

`08-prometheus-grafana/prometheus.yml` define los siguientes jobs:

| Job | Target | Descripción |
|---|---|---|
| `node-api` | `host.docker.internal:3000` | Lab 01 |
| `python-api` | `host.docker.internal:5000` | Lab 03 |
| `inventory-core` | `host.docker.internal:8000` | Lab 05 |
| `operations-portal` | `host.docker.internal:3003` | Lab 09 |
| `go-api` | `host.docker.internal:8084` | Lab 10 |
| `docker-labs-control-center` | `host.docker.internal:9090` | Control Center |
| `prometheus` | `localhost:9090` | Self-scrape |

### Grafana — dashboards incluidos

| Archivo | UID | Paneles |
|---|---|---|
| `08-prometheus-grafana/grafana-dashboards/control-center.json` | `docker-labs-control-center` | 8 (6 stat + 2 timeseries) |

---

## 🔒 Seguridad y robustez (v1.6.0+)

### Control Center

| Aspecto | Implementación |
|---|---|
| CORS | Restringido a `http://localhost:{DASHBOARD_PORT}` — no comodín |
| Autenticación | Token Bearer/Cookie opcional via `DASHBOARD_TOKEN` env var |
| Validación de inputs | `labId` validado con regex `[\w-]+` contra lista conocida antes de ejecutar Docker |
| Body limit | 10 KB máximo en requests POST |
| Rate limiting | 30 requests POST / IP / 60 s (en memoria, sin dependencias externas) |
| Timeouts | `docker compose` up/down: 120 s · ps/inspect: 15 s · logs: 10 s |
| Error handling | Errores internos logueados en `stderr` JSON — respuesta al cliente sin internals |
| Logging | Estructurado JSON con niveles (debug/info/warn/error) — controlado por `LOG_LEVEL` |

### Labs

| Aspecto | Implementación |
|---|---|
| Credenciales | Todas via `${VAR:-default}` en env · `.env` en `.gitignore` · `.env.example` en cada lab |
| Resource limits | `deploy.resources.limits.memory` en todos los `docker-compose.yml` |
| XSS | `sanitizeText()` y `sanitizeUrl()` aplicados en todo `innerHTML` de `dashboard.js` |

### 09-multi-service-app

| Aspecto | Implementación |
|---|---|
| Circuit breaker | 3 fallos consecutivos abren el circuito hacia Inventory API · recuperación a 30 s |
| Fetch timeout | 8 s por request a Inventory API |
| MongoDB retry | 5 intentos con backoff de 3 s antes de abortar el proceso |

---

## 📚 Documentos relacionados

- [windows-installer.md](windows-installer.md)
- [github-releases-distribution.md](github-releases-distribution.md)
- [SECURITY.md](SECURITY.md)
- [technical-audit.md](technical-audit.md)
- [LABS_CATALOG.md](LABS_CATALOG.md)
