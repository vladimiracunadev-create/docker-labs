# File Architecture

> **Version**: 1.5
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
| `launcher/` | Launcher Windows (Go) | [Abrir](launcher/main.go) |
| `installer/` | Script Inno Setup | [Abrir](installer/docker-labs.iss) |
| `scripts/` | Scripts de arranque y build | [Abrir](scripts/start-control-center.cmd) |
| `scripts/windows/` | Scripts de build y release Windows | [Abrir](scripts/windows/release.ps1) |
| `docs/` | Documentacion estructural, tecnica y operativa | [Abrir](docs/DOCUMENTATION_INDEX.md) |
| `.github/workflows/` | CI/CD — compose y build Windows | [Abrir](.github/workflows/ci.yml) |

---

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

### Capa de distribucion Windows (nueva en v1.5)

| Ruta | Contenido | Notas |
|------|-----------|-------|
| `launcher/main.go` | Fuente del launcher Go | Se compila a `docker-labs-launcher.exe` |
| `launcher/go.mod` | Modulo Go del launcher | stdlib puro, sin dependencias externas |
| `installer/docker-labs.iss` | Script Inno Setup | Genera el instalador `.exe` |
| `scripts/windows/build-launcher.ps1` | Compila el launcher | Requiere Go 1.21+ |
| `scripts/windows/build-installer.ps1` | Genera el instalador | Requiere Inno Setup 6.x |
| `scripts/windows/release.ps1` | Pipeline completo | Build launcher + installer + upload opcional |
| `.github/workflows/build-windows.yml` | CI/CD automatizado | Genera y publica el instalador en GitHub Releases |
| `dist/` | Artefactos de build locales | **No versionado** (en .gitignore) |

---

## Donde entrar segun tu objetivo

| Si quieres... | Documento |
|---|---|
| Ver el sistema funcionando | [README.md](README.md) |
| Operar el repo | [RUNBOOK.md](RUNBOOK.md) |
| Entender la arquitectura | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Instalar en Windows | [docs/windows-installer.md](docs/windows-installer.md) |
| Publicar un release | [docs/github-releases-distribution.md](docs/github-releases-distribution.md) |
| Revisar auditoria tecnica | [docs/technical-audit.md](docs/technical-audit.md) |
| Cambiar stacks o puertos | [docs/TECHNICAL_SPECS.md](docs/TECHNICAL_SPECS.md) |
| Ver el catalogo completo | [docs/LABS_CATALOG.md](docs/LABS_CATALOG.md) |

---

## Artefactos que NO se versionan

Los siguientes archivos estan en `.gitignore` y nunca deben commitearse:

| Patron | Motivo |
|--------|--------|
| `dist/` | Artefactos de build local |
| `docker-labs-*.zip` | Archives de release |
| `docker-labs-setup-*.exe` | Instaladores compilados |
| `launcher/docker-labs-launcher.exe` | Binario compilado del launcher |
| `launcher/go.sum` | Generado automaticamente por Go |
| `node_modules/` | Dependencias npm |

Los instaladores se distribuyen via **GitHub Releases**, no via el repositorio.

---

## Documentos relacionados

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/LABS_CATALOG.md](docs/LABS_CATALOG.md)
- [docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)
- [docs/windows-installer.md](docs/windows-installer.md)
- [docs/github-releases-distribution.md](docs/github-releases-distribution.md)
- [docs/technical-audit.md](docs/technical-audit.md)
