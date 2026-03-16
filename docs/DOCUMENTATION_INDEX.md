# Índice de Documentación

> **Versión**: 1.4
> **Estado**: 🟢 Activo
> **Uso recomendado**: 📍 Empieza aquí si no sabes qué documento abrir primero

---

## 🧭 Cómo usar este índice

Cada bloque agrupa documentos por necesidad real. La columna `Abrir` existe para que la navegación sea directa también desde GitHub.

---

## 🚀 Inicio y operación

| Documento | Audiencia | Qué resuelve | Abrir |
|---|---|---|---|
| README | Todos | Portada principal, estado del workspace y rutas recomendadas | [Abrir](../README.md) |
| Beginner Guide | Principiantes | Introducción para novatos y orden de aprendizaje | [Abrir](BEGINNERS_GUIDE.md) |
| Install Guide | Todos | Instalación, requisitos y arranque del entorno | [Abrir](INSTALL.md) |
| Requirements | Todos | Requisitos mínimos y recomendados del host y de Docker | [Abrir](REQUIREMENTS.md) |
| Environment Setup | Operadores | Preparación del equipo, Docker Desktop y orden de arranque | [Abrir](../ENVIRONMENT_SETUP.md) |
| User Manual | Usuarios del workspace | Uso diario del panel y operación por casos | [Abrir](USER_MANUAL.md) |
| Dashboard Setup | Dev / DevOps | Arquitectura y operación del panel `9090` | [Abrir](DASHBOARD_SETUP.md) |
| Operating Modes | Todos | Modos de uso según capacidad del equipo | [Abrir](../OPERATING-MODES.md) |
| Runbook | Operadores | Arranque, apagado y respuesta operativa rápida | [Abrir](../RUNBOOK.md) |

---

## 🏗️ Arquitectura y referencia técnica

| Documento | Audiencia | Qué resuelve | Abrir |
|---|---|---|---|
| Architecture | Técnico | Arquitectura general del repositorio | [Abrir](ARCHITECTURE.md) |
| Technical Specs | Técnico | Stacks, puertos y contratos principales | [Abrir](TECHNICAL_SPECS.md) |
| System Specs | Ejecutivo / técnico | Vista corta de componentes y capacidades | [Abrir](../SYSTEM_SPECS.md) |
| Labs Catalog | Todos | Rol narrativo de los 12 labs | [Abrir](LABS_CATALOG.md) |
| Labs Runtime Reference | Operadores | Imágenes, tamaños y requisitos por lab | [Abrir](LABS_RUNTIME_REFERENCE.md) |
| File Architecture | Técnico | Mapa de carpetas y responsabilidades | [Abrir](../FILE_ARCHITECTURE.md) |
| Tooling | Técnico | Herramientas de runtime y desarrollo | [Abrir](TOOLING.md) |
| Compatibility | Operadores | Compatibilidad por sistema operativo, puertos y modos | [Abrir](../COMPATIBILITY.md) |
| Glossary | Principiantes | Términos base del workspace y Docker | [Abrir](../GLOSSARY.md) |

---

## 🪟 Distribución Windows

| Documento | Audiencia | Qué resuelve | Abrir |
|---|---|---|---|
| Windows Installer | Usuarios Windows, maintainers | Instalación, build, componentes, firma digital y troubleshooting | [Abrir](windows-installer.md) |
| GitHub Releases Distribution | Maintainers | Estrategia de distribución sin binarios en el repo | [Abrir](github-releases-distribution.md) |
| Technical Audit | Técnico | Diagnóstico del repo, hallazgos y correcciones aplicadas | [Abrir](technical-audit.md) |

---

## 🤖 Automatización con Claude Code

Los siguientes skills de Claude Code están disponibles para automatizar tareas frecuentes del proyecto. Se activan automáticamente al describir la tarea en lenguaje natural dentro de Claude Code.

| Skill | Qué hace | Frases que lo activan |
|---|---|---|
| `docker-labs-release` | Flujo completo de release: bump de versión, commit, tag, push a GitHub y reporte de la URL de CI | "haz un release", "bump version", "nueva versión", "publicar v1.x" |
| `docker-labs-status` | Estado completo: contenedores, health HTTP, último build de CI, versión y commits recientes | "estado de docker-labs", "qué está corriendo", "cómo va el proyecto", "health check" |

> Ver sección **Skills de automatización** en [DEVELOPING.md](../DEVELOPING.md) para más detalle.

---

## 📈 Estado, release y gobernanza

| Documento | Audiencia | Qué resuelve | Abrir |
|---|---|---|---|
| Project Status | Todos | Estado consolidado y áreas en evolución | [Abrir](../PROJECT_STATUS.md) |
| Platform Roadmap | Todos | Dirección futura del workspace | [Abrir](PLATFORM_ROADMAP.md) |
| Changelog | Todos | Historial de cambios relevantes | [Abrir](../CHANGELOG.md) |
| Release Guide | Maintainers | Checklist de release y coherencia editorial | [Abrir](../RELEASE.md) |
| Killed Practices | Técnico / liderazgo | Prácticas y decisiones que el proyecto evita | [Abrir](../killed.md) |
| Security | DevSecOps | Política de seguridad y reporte responsable | [Abrir](../SECURITY.md) |
| Contributing | Colaboradores | Flujo de contribución y colaboración | [Abrir](../CONTRIBUTING.md) |
| Code of Conduct | Comunidad | Normas de convivencia del proyecto | [Abrir](../CODE_OF_CONDUCT.md) |
| Support | Maintainers | Soporte y criterios de ayuda | [Abrir](../SUPPORT.md) |
| Developing | Devs | Guía para extender y mantener el repo | [Abrir](../DEVELOPING.md) |

---

## 👀 Evaluación externa

| Documento | Audiencia | Qué resuelve | Abrir |
|---|---|---|---|
| Recruiter Guide | Reclutadores / managers | Lectura rápida para evaluar valor de portafolio y madurez técnica | [Abrir](../RECRUITER.md) |
