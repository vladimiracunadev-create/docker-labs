# Windows Installer

> **Version**: 1.5  
> **Estado**: Activo  
> **Objetivo**: Explicar la capa Windows aditiva del proyecto y como construirla, instalarla y demostrarla

---

## Que resuelve esta capa

El repositorio sigue siendo un workspace Docker modular. La capa Windows agrega una experiencia de distribucion y acceso mas profesional sin reemplazar la logica existente:

- launcher principal para Windows
- instalador `.exe`
- staging curado para no copiar basura innecesaria
- validacion de prerequisitos
- logs y configuracion del launcher
- acceso directo al flujo principal del workspace
- base reproducible para GitHub Releases

## Arquitectura de la solucion

| Pieza | Rol |
|---|---|
| `launcher/docker_labs_launcher.py` | Launcher GUI/CLI para validar entorno, arrancar stacks y abrir la experiencia principal |
| `packaging/windows/distribution-manifest.json` | Metadata central para rutas, docs, staging y release |
| `installer/windows/DockerLabs.iss` | Instalador Inno Setup |
| `scripts/windows/Build-Launcher.ps1` | Compila el launcher a `.exe` con PyInstaller |
| `scripts/windows/Prepare-Staging.ps1` | Copia solo el workspace necesario al staging |
| `scripts/windows/Build-Installer.ps1` | Genera instalador, portable zip y checksums |
| `scripts/windows/Publish-GitHubRelease.ps1` | Sube assets al release oficial con `gh` |

## Experiencia instalada

1. El usuario descarga `docker-labs-windows-latest.exe` desde GitHub Releases.
2. El instalador copia el workspace a `%LOCALAPPDATA%\Programs\DockerLabs`.
3. Se crea un acceso claro a `DockerLabsLauncher.exe`.
4. El launcher valida:
   - `docker`
   - `docker compose`
   - estado del Docker Engine
   - disponibilidad del Control Center y del Gateway
5. El launcher permite:
   - iniciar el Control Center
   - iniciar la plataforma principal
   - detener la plataforma principal
   - abrir URLs principales
   - abrir carpeta del workspace
   - abrir logs del launcher

## Build local

### Validacion previa

```powershell
scripts\windows\Test-WindowsPackaging.ps1
```

### Compilar solo el launcher

```powershell
scripts\windows\Build-Launcher.ps1 -InstallBuildDependencies
```

### Preparar staging

```powershell
scripts\windows\Prepare-Staging.ps1 -Version v1.5.0
```

### Generar instalador y portable zip

```powershell
scripts\windows\Build-Installer.ps1 -Version v1.5.0 -InstallBuildDependencies
```

## Estructura instalada

```text
DockerLabs/
|-- DockerLabsLauncher.exe
|-- windows-distribution.manifest.json
`-- workspace/
    |-- dashboard-control/
    |-- 05-postgres-api/
    |-- 06-nginx-proxy/
    |-- 09-multi-service-app/
    |-- docs/
    `-- scripts/
```

## Troubleshooting rapido

| Problema | Respuesta |
|---|---|
| El launcher dice que falta Docker | Instala o repara Docker Desktop y confirma `docker compose version` |
| El launcher abre pero `9090` no responde | Usa `Start Control Center` y revisa `%LOCALAPPDATA%\DockerLabs\logs\launcher.log` |
| SmartScreen muestra editor no reconocido | Confirma que el `.exe` viene del release oficial y verifica `SHA256SUMS.txt` |
| El gateway no abre | Levanta la plataforma principal completa, no solo el panel |

## Why code signing is not used in this phase

En esta version inicial **no se implementa firma digital de codigo**.

La decision es consciente y responde a cuatro motivos:

1. **Costo y priorizacion**  
   La prioridad de esta fase es validar la experiencia real de instalacion, launcher, distribucion y uso del workspace. La firma digital agrega costo recurrente que no cambia el comportamiento tecnico del producto en esta etapa.

2. **Validacion de producto**  
   Antes de sostener una cadena de firma y mantenimiento, conviene validar si la capa Windows agrega el valor esperado para demos, portafolio, entrevistas y uso real.

3. **Mantenimiento operativo**  
   La firma digital no es solo un pago inicial. Implica rotacion de certificados, gestion segura del secreto, pipeline de firma y soporte adicional en cada release.

4. **Canal oficial acotado**  
   Esta primera distribucion se publica **solo** por GitHub Releases como canal oficial. No se distribuye por mirrors informales ni se oculta la ausencia de firma.

### Impacto esperado para el usuario final

- Windows puede mostrar advertencias de SmartScreen o indicar que el editor no es reconocido.
- El instalador y el launcher advierten esto de forma breve y profesional.
- La recomendacion oficial es descargar el binario unicamente desde GitHub Releases y verificar checksums.

### Medidas compensatorias adoptadas

- canal oficial unico: GitHub Releases
- `SHA256SUMS.txt` publicado junto a cada release
- scripts de build y release reproducibles dentro del repo
- codigo fuente del launcher visible y auditable
- documentacion explicita del limite actual

### Criterios futuros para incorporar firma digital

La firma digital pasa a ser candidata prioritaria cuando ocurra al menos uno de estos escenarios:

- releases frecuentes para usuarios externos
- distribucion fuera del circulo de demo o portafolio
- necesidad de reducir friccion de SmartScreen
- presupuesto y operacion listos para sostener certificados y pipeline de firma

La ausencia de firma en esta fase **no invalida el valor tecnico del proyecto**. La solucion sigue demostrando arquitectura de packaging, validacion de prerequisitos, staging, instalacion, release automation y experiencia de producto sobre un workspace Docker real.

## Valor para demo y entrevista

Esta implementacion deja visible que el proyecto no solo sabe correr en local. Tambien demuestra:

- packaging Windows sostenible
- criterio de distribucion por GitHub Releases
- automatizacion de release
- manejo de prerequisitos
- documentacion defendible de decisiones de producto y operaciones

## Documentos relacionados

- [technical-audit.md](technical-audit.md)
- [github-releases-distribution.md](github-releases-distribution.md)
- [../RELEASE.md](../RELEASE.md)
