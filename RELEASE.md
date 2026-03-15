# Release Guide

> **Version**: 1.5
> **Estado**: Activo
> **Uso recomendado**: Para cierres de iteracion, entregas publicas y publicaciones donde el estado del repo debe quedar coherente

---

## Objetivo

Este documento define que revisar antes de considerar una version del workspace como publicable.
Incluye el flujo para releases del workspace (fuente) y para el instalador Windows.

---

## Checklist de release — workspace

| Area | Que validar |
|---|---|
| Sistemas principales | `9090`, `05`, `06` y `09` operativos |
| Puertos | Sin conflictos (ver docs/technical-audit.md para mapa de puertos) |
| Documentacion | README, recruiter, indice, status y changelog actualizados |
| Navegacion | Enlaces principales funcionando |
| Docker | Compose, healthchecks y puertos coherentes |
| Estado del repo | Cambios listos para commit y push |
| Artefactos | `dist/`, `*.zip`, `*.exe` NO commiteados |

---

## Flujo recomendado — workspace

1. Levanta la plataforma principal
2. Verifica endpoints y pantallas principales
3. Revisa docs operativas y de estado
4. Actualiza [CHANGELOG.md](CHANGELOG.md)
5. Ajusta [PROJECT_STATUS.md](PROJECT_STATUS.md) si corresponde
6. Crea el commit final
7. Crea el tag `v{version}` (activa el build de Windows automaticamente)

---

## Checklist de release — instalador Windows

| Paso | Accion |
|------|--------|
| 1 | Verificar que Go 1.21+ y Inno Setup 6.x estan instalados |
| 2 | Ejecutar `.\scripts\windows\release.ps1 -Version 1.x.0` |
| 3 | Verificar que `dist\docker-labs-setup-1.x.0.exe` se genero |
| 4 | Probar el instalador en una maquina Windows limpia |
| 5 | Generar SHA-256: `Get-FileHash dist\docker-labs-setup-1.x.0.exe` |
| 6 | Crear release en GitHub con tag `v1.x.0` |
| 7 | Adjuntar el `.exe` como asset |
| 8 | Incluir checksum SHA-256 en la descripcion del release |
| 9 | NO commitear el `.exe` al repositorio |

---

## Flujo automatizado (recomendado)

```bash
# 1. Etiquetar el release
git tag v1.0.0
git push origin v1.0.0
```

El workflow `.github/workflows/build-windows.yml` construye y publica el
instalador automaticamente al detectar el tag.

---

## Flujo manual

```powershell
# Build local completo
.\scripts\windows\release.ps1 -Version 1.0.0

# Build + upload directo a GitHub Releases (requiere gh CLI)
.\scripts\windows\release.ps1 -Version 1.0.0 -Upload
```

---

## Por que no usar firma digital en v1.x

El instalador Windows no esta firmado digitalmente en la version actual.
Esta es una decision explicita de producto, no una omision.

Razon principal: el objetivo de esta version es validar la experiencia de
instalacion y el launcher, no invertir en infraestructura de firma digital
antes de que el modelo de distribucion este validado.

Ver la explicacion completa en [docs/windows-installer.md](docs/windows-installer.md#why-code-signing-is-not-used-in-this-phase).

---

## Que no hacer

- Publicar cambios con el README desalineado del estado real
- Declarar capacidades que no fueron verificadas
- Mezclar mejoras estructurales con docs sin registrar el cambio
- Commitear artefactos de build (`.exe`, `.zip`, `dist/`)
- Subir el instalador a `gh-pages` o al repositorio

---

## Documentos relacionados

- [CHANGELOG.md](CHANGELOG.md)
- [PROJECT_STATUS.md](PROJECT_STATUS.md)
- [RUNBOOK.md](RUNBOOK.md)
- [docs/windows-installer.md](docs/windows-installer.md)
- [docs/github-releases-distribution.md](docs/github-releases-distribution.md)
