# Estrategia de distribución vía GitHub Releases

> **Versión**: 1.4.0
> **Última actualización**: 2026-03-15
> **Audiencia**: mantenedores, contribuidores, revisores técnicos

---

## Descripción general

Docker Labs usa **GitHub Releases** como canal exclusivo de distribución para los
instaladores pre-compilados. El repositorio contiene únicamente código fuente y
scripts de build. No se incluyen binarios en el historial de git.

Este documento explica el razonamiento, el flujo completo de release y cómo
enlazar el instalador desde la web del proyecto.

---

## Por qué GitHub Releases y no el repositorio

| Opción | Por qué no se usa |
|--------|------------------|
| Incluir el binario en `main` | Contamina el historial, aumenta el tamaño del repo, mezcla fuentes con artefactos |
| Guardar en la rama `gh-pages` | GitHub Pages es para sitios web estáticos, no para distribución de binarios; sin CDN optimizado para archivos grandes |
| Servidor de archivos propio | Carga operativa, responsabilidad de uptime, sin integración nativa con CI |
| **GitHub Releases** | Canal oficial de artefactos, integrado con CI, TLS-verificado, URLs permanentes, verificación SHA, gratuito |

---

## Flujo de release

### Automatizado (recomendado)

Pushear un tag de versión dispara el workflow de GitHub Actions:

```bash
# Etiquetar el release
git tag v1.4.0
git push origin v1.4.0
```

El workflow `build-windows.yml`:
1. Compila el launcher Go (`docker-labs-launcher.exe`)
2. Compila el instalador Inno Setup (`docker-labs-setup-1.4.0.exe`)
3. Adjunta el instalador al GitHub Release automáticamente

El release queda disponible en:
```
https://github.com/vladimiracunadev-create/docker-labs/releases/tag/v1.4.0
```

### Manual

```powershell
# 1. Compilar todo localmente
.\scripts\windows\release.ps1 -Version 1.4.0

# 2. Crear GitHub Release vía gh CLI + subir asset
.\scripts\windows\release.ps1 -Version 1.4.0 -Upload
```

O manualmente desde la interfaz web de GitHub:
1. Ir a **Releases** → **Draft a new release**
2. Crear el tag `v1.4.0`
3. Agregar las notas del release (título, resumen del changelog, checksum SHA-256)
4. Arrastrar y soltar `dist/docker-labs-setup-1.4.0.exe`
5. Publicar el release

---

## Lista de verificación antes de publicar

Antes de publicar un release:

```
[ ] version.txt actualizado con la nueva versión
[ ] CHANGELOG.md actualizado con los cambios de este release
[ ] PROJECT_STATUS.md refleja el estado actual
[ ] CI pasando (tanto ci.yml como build-windows.yml)
[ ] Instalador probado en una máquina Windows limpia
[ ] Checksum SHA-256 generado para las notas del release
[ ] El directorio dist/ NO está incluido en el repositorio
```

Generar checksum SHA-256:

```powershell
# Windows
Get-FileHash dist\docker-labs-setup-1.4.0.exe -Algorithm SHA256

# Linux/macOS
sha256sum dist/docker-labs-setup-1.4.0.exe
```

Incluir el checksum en las notas del release:

```
## Checksums
SHA-256 docker-labs-setup-1.4.0.exe: <hash>
```

---

## Patrón de URL para descargar assets

GitHub Releases usa un formato de URL estable y versionado:

```
https://github.com/<owner>/<repo>/releases/download/<tag>/<nombre-del-archivo>
```

Ejemplo:
```
https://github.com/vladimiracunadev-create/docker-labs/releases/download/v1.4.0/docker-labs-setup-1.4.0.exe
```

Esta URL es permanente una vez publicado el release y no cambia.

---

## Enlazar desde el sitio web / GitHub Pages

El sitio web del proyecto (o GitHub Pages) debe enlazar a GitHub Releases para las descargas.
**El binario nunca se almacena en la rama `gh-pages` ni en el repositorio.**

### Patrón HTML recomendado

```html
<!-- Enlace a la página del release más reciente (siempre actualizado) -->
<a href="https://github.com/vladimiracunadev-create/docker-labs/releases/latest"
   class="btn-download">
  Descargar para Windows
</a>

<!-- Enlace directo al asset de una versión específica (actualizar en cada release) -->
<a href="https://github.com/vladimiracunadev-create/docker-labs/releases/download/v1.4.0/docker-labs-setup-1.4.0.exe"
   class="btn-download">
  Descargar v1.4.0 — Instalador Windows (.exe)
</a>
```

**Usa el patrón `/releases/latest`** cuando quieras que el botón apunte siempre
al release publicado más reciente sin actualizar el HTML en cada release.

```
https://github.com/vladimiracunadev-create/docker-labs/releases/latest
```

### Nota sobre la configuración de GitHub Pages

Si se usa GitHub Pages para el sitio web del proyecto:
- La rama `gh-pages` (o la carpeta `docs/`) contiene solo el código fuente del sitio web
- **No** contiene ningún binario del instalador
- El botón de descarga apunta a GitHub Releases mediante un enlace externo
- No se necesitan cambios en la etiqueta `<base>` — la URL de releases es absoluta

---

## Convención de nombres del release

| Componente | Convención | Ejemplo |
|------------|-----------|---------|
| Tag Git | `v{semver}` | `v1.4.0` |
| Nombre del instalador | `docker-labs-setup-{semver}.exe` | `docker-labs-setup-1.4.0.exe` |
| Título del release | `Docker Labs v{semver}` | `Docker Labs v1.4.0` |

---

## Cómo justificar esta estrategia en una entrevista

**P: ¿Por qué no incluir el binario directamente en el repositorio?**

> Los binarios en control de versiones son un anti-patrón: inflan el historial,
> no se pueden comparar con diff y mezclan fuentes con artefactos. GitHub Releases
> es la capa correcta para artefactos — se integra con CI, provee URLs versionadas,
> soporta checksums y es gratuito. Esto refleja el modelo de distribución de proyectos
> open-source profesionales como VS Code, Docker Desktop y Go.

**P: ¿Por qué no usar GitHub Pages para las descargas?**

> GitHub Pages está diseñado para contenido web estático servido vía CDN. Tiene un
> límite suave de 1 GB por sitio, sin optimización para archivos grandes, y adjuntar
> binarios a una rama web mezcla responsabilidades. GitHub Releases tiene soporte nativo
> para assets binarios con almacenamiento content-addressed. Usar la herramienta correcta
> para cada trabajo es un principio de diseño, no un workaround.

**P: ¿Qué pasa si GitHub tiene una caída?**

> El código fuente permite a cualquier usuario reconstruir el instalador desde cero usando
> `scripts/windows/release.ps1`. El release no es un único punto de falla — es una capa
> de conveniencia sobre un sistema de build completamente abierto y reproducible.

---

## Documentos relacionados

- [docs/windows-installer.md](windows-installer.md)
- [RELEASE.md](../RELEASE.md)
- [.github/workflows/build-windows.yml](../.github/workflows/build-windows.yml)
