# 🗂️ Documentation Index

> **Version**: 1.4  
> **Estado**: 🟢 Activo  
> **Uso recomendado**: 📍 Empieza aqui si no sabes que documento abrir primero

---

## 🧭 Como usar este indice

Cada bloque agrupa documentos por necesidad real. La columna `Abrir` existe para que la navegacion sea directa tambien desde GitHub.

## 🚀 Inicio y operacion

| Documento | Audiencia | Que resuelve | Abrir |
|---|---|---|---|
| README | Todos | Portada principal, estado del workspace y rutas recomendadas | [Abrir](../README.md) |
| Beginner Guide | Principiantes | Introduccion para novatos y orden de aprendizaje | [Abrir](BEGINNERS_GUIDE.md) |
| Install Guide | Todos | Instalacion, requisitos y arranque del entorno | [Abrir](INSTALL.md) |
| Requirements | Todos | Requisitos minimos y recomendados del host y de Docker | [Abrir](REQUIREMENTS.md) |
| Environment Setup | Operadores | Preparacion del equipo, Docker Desktop y orden de arranque | [Abrir](../ENVIRONMENT_SETUP.md) |
| User Manual | Usuarios del workspace | Uso diario del panel y operacion por casos | [Abrir](USER_MANUAL.md) |
| Dashboard Setup | Dev / DevOps | Arquitectura y operacion del panel `9090` | [Abrir](DASHBOARD_SETUP.md) |
| Operating Modes | Todos | Modos de uso segun capacidad del equipo | [Abrir](../OPERATING-MODES.md) |
| Runbook | Operadores | Arranque, apagado y respuesta operativa rapida | [Abrir](../RUNBOOK.md) |

## 🏗️ Arquitectura y referencia tecnica

| Documento | Audiencia | Que resuelve | Abrir |
|---|---|---|---|
| Architecture | Tecnico | Arquitectura general del repositorio | [Abrir](ARCHITECTURE.md) |
| Technical Specs | Tecnico | Stacks, puertos y contratos principales | [Abrir](TECHNICAL_SPECS.md) |
| System Specs | Ejecutivo / tecnico | Vista corta de componentes y capacidades | [Abrir](../SYSTEM_SPECS.md) |
| Labs Catalog | Todos | Rol narrativo de los 12 labs | [Abrir](LABS_CATALOG.md) |
| Labs Runtime Reference | Operadores | Imagenes, tamanos y requisitos por lab | [Abrir](LABS_RUNTIME_REFERENCE.md) |
| File Architecture | Tecnico | Mapa de carpetas y responsabilidades | [Abrir](../FILE_ARCHITECTURE.md) |
| Tooling | Tecnico | Herramientas de runtime y desarrollo | [Abrir](TOOLING.md) |
| Compatibility | Operadores | Compatibilidad por sistema operativo, puertos y modos | [Abrir](../COMPATIBILITY.md) |
| Glossary | Principiantes | Terminos base del workspace y Docker | [Abrir](../GLOSSARY.md) |

## 🪟 Distribucion Windows

| Documento | Audiencia | Que resuelve | Abrir |
|---|---|---|---|
| Windows Installer | Usuarios Windows, maintainers | Instalacion, build, componentes, firma digital y troubleshooting | [Abrir](windows-installer.md) |
| GitHub Releases Distribution | Maintainers | Estrategia de distribucion sin binarios en el repo | [Abrir](github-releases-distribution.md) |
| Technical Audit | Tecnico | Diagnostico del repo, hallazgos y correcciones aplicadas | [Abrir](technical-audit.md) |

## 🤖 Automatizacion con Claude Code

Los siguientes skills de Claude Code estan disponibles para automatizar tareas frecuentes del proyecto. Se activan automaticamente al describir la tarea en lenguaje natural dentro de Claude Code.

| Skill | Que hace | Frases que lo activan |
|---|---|---|
| `docker-labs-release` | Flujo completo de release: bump de version, commit, tag, push a GitHub y reporte de la URL de CI | "haz un release", "bump version", "nueva version", "publicar v1.x" |
| `docker-labs-status` | Estado completo: contenedores, health HTTP, ultimo build de CI, version y commits recientes | "estado de docker-labs", "que esta corriendo", "como va el proyecto", "health check" |

> Ver seccion **Skills de automatizacion** en [DEVELOPING.md](../DEVELOPING.md) para mas detalle.

## 📈 Estado, release y gobernanza

| Documento | Audiencia | Que resuelve | Abrir |
|---|---|---|---|
| Project Status | Todos | Estado consolidado y areas en evolucion | [Abrir](../PROJECT_STATUS.md) |
| Platform Roadmap | Todos | Direccion futura del workspace | [Abrir](PLATFORM_ROADMAP.md) |
| Changelog | Todos | Historial de cambios relevantes | [Abrir](../CHANGELOG.md) |
| Release Guide | Maintainers | Checklist de release y coherencia editorial | [Abrir](../RELEASE.md) |
| Killed Practices | Tecnico / liderazgo | Practicas y decisiones que el proyecto evita | [Abrir](../killed.md) |
| Security | DevSecOps | Politica de seguridad y reporte responsable | [Abrir](../SECURITY.md) |
| Contributing | Colaboradores | Flujo de contribucion y colaboracion | [Abrir](../CONTRIBUTING.md) |
| Code of Conduct | Comunidad | Normas de convivencia del proyecto | [Abrir](../CODE_OF_CONDUCT.md) |
| Support | Maintainers | Soporte y criterios de ayuda | [Abrir](../SUPPORT.md) |
| Developing | Devs | Guia para extender y mantener el repo | [Abrir](../DEVELOPING.md) |

## 👀 Evaluacion externa

| Documento | Audiencia | Que resuelve | Abrir |
|---|---|---|---|
| Recruiter Guide | Reclutadores / managers | Lectura rapida para evaluar valor de portafolio y madurez tecnica | [Abrir](../RECRUITER.md) |
