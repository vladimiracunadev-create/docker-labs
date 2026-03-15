# Technical Specs

Especificaciones tecnicas actuales del repositorio y de la capa Windows.

## Base de ejecucion

| Componente | Estado actual |
|---|---|
| Docker runtime | Docker Desktop / Docker Engine con Compose |
| Panel principal | `dashboard-control` en `9090` |
| Gateway | `06-nginx-proxy` en `8085` |
| Core principal | `05-postgres-api` en `8000` |
| Portal principal | `09-multi-service-app` en `8083` |
| Launcher Windows | `DockerLabsLauncher.exe` compilado con PyInstaller |
| Instalador Windows | Inno Setup `.exe` distribuido por GitHub Releases |

## Puertos principales

| Puerto | Servicio |
|---:|---|
| `8000` | Inventory Core |
| `8083` | Operations Portal |
| `8085` | Platform Gateway |
| `9090` | Control Center |

## Conflictos de puertos a tener en cuenta

| Lab | Puerto | Conflicto |
|---|---:|---|
| `08-prometheus-grafana` | `9090` | choca con `dashboard-control` |
| `11-elasticsearch-search` | `8000` | choca con `05-postgres-api` |

Estos labs siguen siendo validos, pero se consideran de uso caso a caso, no parte del arranque simultaneo de la plataforma principal.

## Capa Windows

| Pieza | Tecnologia |
|---|---|
| Launcher | Python + Tkinter + PyInstaller |
| Instalador | Inno Setup |
| Manifest central | JSON |
| Checksums | SHA256 |
| Release automation | GitHub Actions + GitHub Releases |

## Artefactos esperados del release Windows

- `docker-labs-setup-vX.Y.Z-win-x64.exe`
- `docker-labs-windows-latest.exe`
- `docker-labs-portable-vX.Y.Z-win-x64.zip`
- `docker-labs-windows-portable-latest.zip`
- `SHA256SUMS.txt`

## Notas de implementacion

- el launcher valida prerequisitos pero no empaqueta Docker Desktop
- el instalador final no se almacena dentro del repo
- la ausencia de firma digital esta documentada y se compensa con canal oficial + checksums

## Documentos relacionados

- [windows-installer.md](windows-installer.md)
- [github-releases-distribution.md](github-releases-distribution.md)
- [technical-audit.md](technical-audit.md)
