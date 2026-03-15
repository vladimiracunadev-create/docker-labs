# Release Guide

> **Version**: 1.5  
> **Estado**: Activo  
> **Uso recomendado**: Releases del workspace fuente y del instalador Windows para GitHub Releases

---

## Objetivo

Este documento define el flujo de release soportado despues de agregar la capa Windows. La regla se mantiene: el repo sigue siendo un workspace Docker modular y los binarios finales se publican como assets de GitHub Releases, no dentro del repositorio.

## Checklist base

| Area | Que validar |
|---|---|
| Sistemas principales | `9090`, `05`, `06` y `09` operativos |
| Launcher Windows | `python launcher/docker_labs_launcher.py --self-check` responde sin errores de codigo |
| Instalador | `scripts/windows/Build-Installer.ps1` produce `.exe`, `.zip` y `SHA256SUMS.txt` |
| Documentacion | README, audit, installer, distribution y changelog alineados |
| GitHub Releases | Assets versionados + aliases `latest` preparados |

## Flujo recomendado

1. Valida el workspace fuente.

```powershell
scripts\start-control-center.cmd
docker compose -f 05-postgres-api\docker-compose.yml up -d --build
docker compose -f 09-multi-service-app\docker-compose.yml up -d --build
docker compose -f 06-nginx-proxy\docker-compose.yml up -d --build
```

2. Ejecuta la validacion de packaging.

```powershell
scripts\windows\Test-WindowsPackaging.ps1
```

3. Genera los artefactos Windows.

```powershell
scripts\windows\Build-Installer.ps1 -Version v1.5.0
```

4. Publica los assets en GitHub Releases con workflow o con `gh`.

```powershell
scripts\windows\Publish-GitHubRelease.ps1 -Tag v1.5.0
```

5. Actualiza la web oficial o GitHub Pages para apuntar al asset estable:

`https://github.com/vladimiracunadev-create/docker-labs/releases/latest/download/docker-labs-windows-latest.exe`

## Workflow automatizado

El workflow soportado es `.github/workflows/release-windows.yml`.

- `workflow_dispatch`: build manual con version
- `release.published`: adjunta el instalador y el portable zip al release oficial

## Decisiones de distribucion que esta guia protege

- El instalador `.exe` final no se versiona dentro del repo.
- GitHub Releases es el canal oficial de distribucion del binario.
- GitHub Pages o la web oficial solo enlazan al asset publicado.
- Docker Desktop se valida como prerequisito; no se empaqueta.
- La falta de firma digital en esta fase es una decision consciente y documentada.

## Que no hacer

- No subas el instalador final a la rama principal o a GitHub Pages.
- No publiques un release sin `SHA256SUMS.txt`.
- No declares firma digital si el binario no fue firmado.
- No vuelvas a activar los `docker-compose-dashboard*.yml` legacy como flujo soportado sin revalidarlos.

## Documentos relacionados

- [docs/windows-installer.md](docs/windows-installer.md)
- [docs/github-releases-distribution.md](docs/github-releases-distribution.md)
- [docs/technical-audit.md](docs/technical-audit.md)
- [CHANGELOG.md](CHANGELOG.md)
