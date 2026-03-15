# File Architecture

> **Version**: 1.5  
> **Estado**: Activo  
> **Uso recomendado**: Mapa rapido del repo despues de sumar la capa Windows y corregir el flujo soportado

---

## Vista general

| Ruta | Rol |
|---|---|
| `README.md` | Portada principal del proyecto |
| `dashboard-control/` | Control Center dockerizado que gobierna el workspace |
| `05-postgres-api/` | Core transaccional principal |
| `09-multi-service-app/` | Portal operativo principal |
| `06-nginx-proxy/` | Gateway de acceso de la plataforma |
| `docs/` | Documentacion tecnica, operativa y de distribucion |
| `scripts/` | Scripts locales y wrappers soportados |
| `scripts/windows/` | Build, staging, test y release de la capa Windows |
| `launcher/` | Codigo fuente del launcher Windows |
| `installer/windows/` | Script del instalador Inno Setup |
| `packaging/windows/` | Manifest central de empaquetado y runtime |

## Distribucion por capas

### Workspace principal

- `dashboard-control/`
- `index.html`
- `dashboard.js`
- `dashboard.css`
- `learning-center.html`
- `learning-center.css`

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

### Capa Windows

- `launcher/docker_labs_launcher.py`
- `installer/windows/DockerLabs.iss`
- `packaging/windows/distribution-manifest.json`
- `scripts/windows/Build-Launcher.ps1`
- `scripts/windows/Prepare-Staging.ps1`
- `scripts/windows/Build-Installer.ps1`
- `scripts/windows/Test-WindowsPackaging.ps1`
- `scripts/windows/Publish-GitHubRelease.ps1`
- `.github/workflows/release-windows.yml`

## Notas de soporte

- Los `docker-compose-dashboard*.yml` de raiz quedan como legado del repo, pero ya no forman parte del flujo soportado ni del instalador Windows.
- El staging del instalador copia solo el workspace necesario, docs relevantes y el launcher compilado.
- Los binarios finales quedan fuera del repo y se publican como assets en GitHub Releases.

## Documentos relacionados

- [docs/technical-audit.md](docs/technical-audit.md)
- [docs/windows-installer.md](docs/windows-installer.md)
- [docs/github-releases-distribution.md](docs/github-releases-distribution.md)
