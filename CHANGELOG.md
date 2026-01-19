# Changelog

Todos los cambios notables a este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/), y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### En Desarrollo
- Futuros laboratorios planificados (ver [ROADMAP.md](ROADMAP.md))

---

## [1.0.0] - 2026-01-19

### 🎉 Release Inicial con Documentación Profesional

Este release marca la transformación de docker-labs a un proyecto con documentación de nivel profesional.

### Added

#### 📖 Documentación Completa
- Creada carpeta `docs/` con estructura organizada
- **BEGINNERS_GUIDE.md**: Guía paso a paso para principiantes
- **USER_MANUAL.md**: Manual completo de uso de todos los laboratorios
- **INSTALL.md**: Instrucciones de instalación multi-OS (Windows, macOS, Linux)
- **ARCHITECTURE.md**: Diagramas Mermaid y diseño técnico
- **LABS_CATALOG.md**: Catálogo detallado de todos los laboratorios
- **DOCKER_BASICS.md**: Conceptos fundamentales de Docker
- **TECHNICAL_SPECS.md**: Especificaciones técnicas y versiones
- **TROUBLESHOOTING.md**: Guía completa de solución de problemas
- **BEST_PRACTICES.md**: Mejores prácticas de Docker y desarrollo
- **MAINTAINERS.md**: Guía para mantenedores del proyecto

#### 📋 Políticas y Gobernanza
- **CODE_OF_CONDUCT.md**: Código de conducta para la comunidad
- **CHANGELOG.md**: Este archivo (registro de cambios)

#### ✨ Mejoras en Archivos Existentes
- **README.md**: Completamente rediseñado con emojis, navegación clara y badges
- **CONTRIBUTING.md**: Mejorado con ejemplos y templates
- **ROADMAP.md**: Formato mejorado con tablas y prioridades
- **SECURITY.md**: Política de seguridad más detallada

#### 🧪 Laboratorios
- **node-api**: API REST con Node.js y Express
- **php-lamp**: Stack LAMP completo (PHP + Apache + MariaDB + phpMyAdmin)
- **python-api**: API REST con Python y Flask

### Changed
- README principal ahora con sección hero atractiva
- Mejora en navegación hacia documentación especializada
- Estructura más clara y profesional en todos los archivos

### Documentation
- Agregados diagramas Mermaid para arquitectura
- Links cruzados entre documentos para fácil navegación
- Ejemplos de código en todos los laboratorios
- Tablas comparativas y especificaciones técnicas

---

## [0.1.0] - 2026-01-14

### Added
- Estructura inicial del repositorio
- Laboratorios básicos: node-api, php-lamp, python-api
- Archivos básicos: README, LICENSE, CONTRIBUTING, ROADMAP, SECURITY
- Configuración de .gitignore y .dockerignore

---

## Tipos de Cambios

- **Added**: Nuevas funcionalidades
- **Changed**: Cambios en funcionalidades existentes
- **Deprecated**: Funcionalidades que se eliminarán pronto
- **Removed**: Funcionalidades eliminadas
- **Fixed**: Correcciones de bugs
- **Security**: Cambios relacionados con seguridad

---

## ¿Cómo Contribuir al CHANGELOG?

Al crear un PR, agrega tu cambio en la sección `[Unreleased]` siguiendo el formato:

```markdown
### Added
- Nueva funcionalidad X (#123)

### Fixed
- Corregido bug Y (#124)
```

Los mantenedores moverán los cambios a la versión correspondiente durante el release.

---

[Unreleased]: https://github.com/vladimiracunadev-create/docker-labs/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/vladimiracunadev-create/docker-labs/releases/tag/v1.0.0
[0.1.0]: https://github.com/vladimiracunadev-create/docker-labs/releases/tag/v0.1.0
