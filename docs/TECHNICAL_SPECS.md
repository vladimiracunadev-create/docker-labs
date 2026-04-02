# ⚙️ Especificaciones Técnicas — Docker Labs

> **Versión**: 1.4.0
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
| `04-redis-cache` | API | `wget -qO- http://localhost:3000/health` |
| `05-postgres-api` | API | `curl -f http://localhost:8000/health` |
| `05-postgres-api` | PostgreSQL | `pg_isready` |
| `06-nginx-proxy` | Gateway | `wget -qO- http://127.0.0.1/gateway-health` |
| `07-rabbitmq-messaging` | RabbitMQ | `rabbitmq-diagnostics -q ping` |
| `08-prometheus-grafana` | Prometheus | `wget -qO- http://localhost:9090/-/ready` |
| `08-prometheus-grafana` | Grafana | `wget -qO- http://localhost:3000/api/health` |
| `09-multi-service-app` | MongoDB | `mongosh --eval "db.adminCommand('ping').ok"` |
| `09-multi-service-app` | Backend | `wget -qO- http://localhost:3000/api/health` |
| `10-go-api` | API | `wget -qO- http://localhost:8080/health` |
| `11-elasticsearch-search` | Elasticsearch | `wget -qO- http://localhost:9200/_cluster/health` |
| `11-elasticsearch-search` | API | `curl -f http://localhost:8000/health` |
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

## 📚 Documentos relacionados

- [windows-installer.md](windows-installer.md)
- [github-releases-distribution.md](github-releases-distribution.md)
- [technical-audit.md](technical-audit.md)
- [LABS_CATALOG.md](LABS_CATALOG.md)
