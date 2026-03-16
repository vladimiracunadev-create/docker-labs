# ⚙️ Especificaciones Técnicas — Docker Labs

> **Versión**: 1.4.0
> **Estado**: 🟢 Activo
> **Audiencia**: 👥 Técnico, DevOps, reclutadores
> **Objetivo**: Stacks, puertos, endpoints y capa de distribución Windows

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

## 🔌 Puertos principales

| Puerto | Servicio |
|---:|---|
| `8000` | Inventory Core |
| `8083` | Operations Portal |
| `8085` | Platform Gateway |
| `9090` | Control Center |

## ⚠️ Conflictos de puertos a considerar

| Lab | Puerto | Conflicto |
|---|---:|---|
| `08-prometheus-grafana` | `9090` | Choca con `dashboard-control` |
| `11-elasticsearch-search` | `8000` | Choca con `05-postgres-api` |

Estos labs siguen siendo válidos, pero se consideran de uso caso a caso, no parte del arranque simultáneo de la plataforma principal.

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

## 📦 Artefactos esperados del release Windows

| Artefacto | Descripción |
|---|---|
| `docker-labs-setup-{version}.exe` | Instalador Inno Setup para Windows 10+ |
| `SHA256SUMS.txt` | Checksums para verificación de integridad |

> El instalador no se versiona dentro del repo. Se publica como asset de GitHub Releases.
> Ver [github-releases-distribution.md](github-releases-distribution.md).

## 📝 Notas de implementación

- El launcher valida prerrequisitos pero no empaqueta Docker Desktop
- El instalador final no se almacena dentro del repo
- La ausencia de firma digital está documentada y se compensa con canal oficial + checksums

## 📚 Documentos relacionados

- [windows-installer.md](windows-installer.md)
- [github-releases-distribution.md](github-releases-distribution.md)
- [technical-audit.md](technical-audit.md)
