# GitHub Releases Distribution

> **Version**: 1.5  
> **Estado**: Activo  
> **Objetivo**: Explicar como generar y publicar los assets Windows sin versionarlos dentro del repo ni subirlos a GitHub Pages

---

## Canal oficial

El canal oficial del binario Windows es **GitHub Releases**.

Se publican estos assets:

- instalador versionado: `docker-labs-setup-vX.Y.Z-win-x64.exe`
- instalador estable para web: `docker-labs-windows-latest.exe`
- portable zip versionado: `docker-labs-portable-vX.Y.Z-win-x64.zip`
- portable zip estable: `docker-labs-windows-portable-latest.zip`
- `SHA256SUMS.txt`

## Build local

```powershell
scripts\windows\Test-WindowsPackaging.ps1
scripts\windows\Build-Installer.ps1 -Version v1.5.0 -InstallBuildDependencies
```

Los artefactos quedan en `dist/windows/release/`.

## Publicacion manual

```powershell
scripts\windows\Publish-GitHubRelease.ps1 -Tag v1.5.0
```

## Publicacion automatizada

El workflow `.github/workflows/release-windows.yml` permite:

- `workflow_dispatch` con version manual
- adjuntar assets automaticamente cuando un release se publica en GitHub

## Como enlazar desde la web oficial o GitHub Pages

La web no debe almacenar el binario. Debe enlazar al asset publicado.

### Enlace recomendado para boton principal

```text
https://github.com/vladimiracunadev-create/docker-labs/releases/latest/download/docker-labs-windows-latest.exe
```

### Enlace recomendado para release notes

```text
https://github.com/vladimiracunadev-create/docker-labs/releases/latest
```

## Que se evita con esta estrategia

- binarios finales dentro del repo
- binarios servidos desde GitHub Pages
- duplicacion innecesaria entre sitio y repositorio
- historial Git inflado por assets grandes

## Medidas de confianza sin firma digital

- publicacion solo por el canal oficial de GitHub Releases
- checksums SHA256 publicados
- workflow reproducible en el repo
- nombre consistente de producto y assets
- documentacion clara de la limitacion actual

## Resumen defendible para demos

Elegir GitHub Releases para el binario y dejar la web solo como vitrina demuestra criterio de distribucion:

- el repo conserva su valor tecnico
- la historia del proyecto no se contamina con binarios
- la descarga se mantiene trazable
- el sitio sigue siendo liviano y facil de mantener

## Documentos relacionados

- [windows-installer.md](windows-installer.md)
- [technical-audit.md](technical-audit.md)
- [../RELEASE.md](../RELEASE.md)
