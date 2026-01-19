# Guía de Mantenedores 🛠️

Documentación para mantenedores y administradores del proyecto **docker-labs**.

---

## 👥 Roles y Responsabilidades

### Maintainer Principal
- ✅ Revisión final de PRs
- ✅ Gestión de releases
- ✅ Decisiones arquitectónicas
- ✅ Moderación de comunidad

### Maintainers Secundarios
- ✅ Revisión de PRs
- ✅ Triaje de issues
- ✅ Soporte a contribuyentes
- ✅ Documentación

### Contribuyentes
- 🔹 Envío de PRs
- 🔹 Reporte de issues
- 🔹 Mejoras de documentación

---

## 🔍 Proceso de Revisión de PRs

### Checklist de Revisión

Antes de aprobar un PR, verificar:

- [ ] **Funcionalidad**: El código hace lo que promete
- [ ] **Tests**: Incluye tests o no son necesarios
- [ ] **Documentación**: Actualiza READMEs si cambia funcionalidad
- [ ] **Estilo**: Sigue las convenciones del proyecto
- [ ] **Breaking Changes**: Documentados si los hay
- [ ] **Commits**: Mensajes claros y descriptivos
- [ ] **Conflictos**: Branch actualizado con `main`

### Etiquetas de PR

| Etiqueta | Uso |
|----------|-----|
| `enhancement` | Nueva funcionalidad |
| `bug` | Corrección de bugs |
| `documentation` | Solo docs |
| `breaking-change` | Cambio incompatible |
| `good-first-issue` | Para principiantes |
| `needs-review` | Requiere revisión |
| `wip` | Work in progress |

---

## 🏗️ Criterios de Aceptación de Nuevos Labs

Un nuevo laboratorio debe cumplir:

### Requisitos Mínimos

✅ **Documentación**:
- README.md en la carpeta del lab
- Descripción clara del objetivo
- Instrucciones de uso
- Ejemplos de código

✅ **Configuración**:
- `Dockerfile` (si se construye imagen)
- `docker-compose.yml` funcional
- `.dockerignore`
- `.gitignore`
- `.env.example` (si usa variables)

✅ **Calidad**:
- Código limpio y comentado
- Sin credenciales hardcodeadas
- Usa versiones específicas de imágenes

✅ **Consistencia**:
- Sigue estructura similar a labs existentes
- Puertos no conflictivos (ver [TECHNICAL_SPECS.md](docs/TECHNICAL_SPECS.md))

### Nice to Have

🔹 Tests automatizados  
🔹 Health checks  
🔹 Ejemplos de uso avanzado  
🔹 Scripts de inicialización

---

## 📋 Gestión de Issues

### Triaje de Issues

**Proceso**:
1. Lee el issue completamente
2. Asigna etiquetas apropiadas
3. Pide aclaraciones si falta información
4. Asigna un milestone si aplica
5. Determina prioridad

**Template de Respuesta**:
```markdown
Gracias por reportar @usuario. 

¿Podrías proporcionar:
- [ ] Versión de Docker: `docker --version`
- [ ] OS y versión
- [ ] Output completo de logs
- [ ] Pasos exactos para reproducir

Esto nos ayudará a diagnosticar el problema. 🙏
```

### Prioridades

| Prioridad | Etiqueta | Criterio |
|-----------|----------|----------|
| P0 | `critical` | Blockers, vulnerabilidades de seguridad |
| P1 | `high` | Bugs que afectan mayoría de usuarios |
| P2 | `medium` | Bugs menores, mejoras importantes |
| P3 | `low` | Mejoras menores, nice-to-haves |

---

## 🚀 Release Process

### Versionado Semántico

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x): Cambios incompatibles
- **MINOR** (x.1.x): Nueva funcionalidad compatible
- **PATCH** (x.x.1): Bug fixes

### Proceso de Release

1. **Preparación**:
```bash
# Actualizar versión en package.json (si aplica)
# Actualizar CHANGELOG.md
git checkout -b release/v1.2.0
```

2. **CHANGELOG**:
```markdown
## [1.2.0] - 2026-01-20

### Added
- Nuevo laboratorio: redis-cache
- Soporte para Apple Silicon

### Changed
- Actualizado Node.js a v18.16

### Fixed
- Corregido error de permisos en 02-php-lamp
```

3. **Commit y Tag**:
```bash
git add .
git commit -m "chore: release v1.2.0"
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin main --tags
```

4. **GitHub Release**:
- Crea release en GitHub
- Adjunta notas del CHANGELOG
- Marca como "Latest release"

---

## 🔐 Seguridad

### Política de Vulnerabilidades

**Reporte**:
- Email privado a: [contacto del proyecto]
- O GitHub Security Advisory

**Proceso**:
1. Confirmar recepción en 48h
2. Evaluar severidad
3. Desarrollar parche
4. Coordinar disclosure con reporter
5. Release de parche
6. Publicar advisory

### Dependabot

Habilitamos Dependabot para:
- ✅ Dependencias de npm/pip/composer
- ✅ Imágenes Docker
- ✅ GitHub Actions

**Acción**: Revisar semanalmente PRs de Dependabot.

---

## 🤝 Soporte a Contribuyentes

### Primera Contribución

Cuando alguien hace su primer PR:

```markdown
¡Bienvenido @usuario! 👋

Gracias por tu primera contribución a docker-labs. Aquí hay algunos puntos:

- [ ] Revisa nuestro [CONTRIBUTING.md](CONTRIBUTING.md)
- [ ] Asegúrate de que los tests pasen
- [ ] Si es una nueva funcionalidad, agrega documentación

Revisaremos tu PR pronto. No dudes en hacer preguntas. 🚀
```

### Mentoría

- Asigna `good-first-issue` a issues apropiados
- Proporciona contexto y guía
- Celebra las contribuciones en README (contributors section)

---

## 📊 Métricas y Reportes

### Monitoreo Mensual

Revisar:
- ⭐ Estrellas en GitHub
- 🐛 Issues abiertos vs cerrados
- 📥 PRs mergeados
- 👥 Nuevos contribuyentes
- 📦 Downloads (si aplica)

### Herramientas

- **GitHub Insights**: Estadísticas del repo
- **GitHub Actions**: CI/CD status
- **Dependabot**: Dependencias desactualizadas

---

## 🔄 Mantenimiento Regular

### Semanal

- [ ] Revisar nuevos issues
- [ ] Responder preguntas en discussions
- [ ] Revisar PRs pendientes

### Mensual

- [ ] Actualizar dependencias
- [ ] Revisar roadmap
- [ ] Limpiar issues antiguos/duplicados
- [ ] Actualizar documentación según feedback

### Trimestral

- [ ] Review de arquitectura
- [ ] Planificación de nuevos labs
- [ ] Limpieza de código deprecated
- [ ] Análisis de métricas

---

## 🗂️ Estructura de Branches

### Branches Principales

- **main**: Código estable, producción
- **develop**: Integración de features (si se usa GitFlow)

### Branches de Trabajo

Formato: `tipo/descripcion`

Tipos:
- `feature/nueva-funcionalidad`
- `fix/correccion-bug`
- `docs/actualizar-readme`
- `refactor/mejorar-codigo`
- `test/agregar-tests`

---

## 📝 Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(scope): mensaje

feat(01-node-api): agregar endpoint /users
fix(02-php-lamp): corregir conexión a BD
docs(readme): actualizar instrucciones
chore(deps): actualizar dependencias
```

**Tipos**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (sin cambios de código)
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento

---

## 🚫 Políticas de Deprecación

### Proceso

1. **Anuncio** (versión N):
   - Marcar como deprecated en docs
   - Agregar warning en logs
   - Documentar en CHANGELOG

2. **Mantenimiento** (versión N+1, N+2):
   - Funcionalidad sigue disponible
   - Solo critical fixes

3. **Eliminación** (versión N+3):
   - Remover completamente
   - Documentar breaking change
   - Proveer guía de migración

**Ejemplo**:
```
v1.0.0: Feature X deprecated
v1.1.0: Feature X aún funciona (warning)
v1.2.0: Feature X aún funciona (warning)
v2.0.0: Feature X eliminado (breaking)
```

---

## 🎓 Onboarding de Nuevos Mantenedores

### Checklist

- [ ] Acceso a GitHub (write permissions)
- [ ] Unirse al canal de comunicación (Discord/Slack)
- [ ] Leer esta guía completa
- [ ] Revisar últimos 10 PRs merged
- [ ] Shadow a un maintainer existente
- [ ] Hacer primera revisión de PR (supervisado)

### Recursos

- 📖 [CONTRIBUTING.md](../CONTRIBUTING.md)
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md)
- 🔧 [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md)
- 🎯 [ROADMAP.md](../ROADMAP.md)

---

## 📞 Comunicación

### Canales

- **Issues**: Problemas técnicos, bugs
- **Discussions**: Preguntas, ideas, feedback general
- **PRs**: Revisión de código
- **Email**: Seguridad, asuntos privados

### Tiempos de Respuesta

- **Critical issues**: 24-48h
- **PRs**: 3-5 días laborables
- **Issues generales**: 1 semana
- **Discussions**: Mejor esfuerzo

---

## 🛠️ Herramientas Recomendadas

### Local

- **VS Code**: Editor principal
- **Docker Desktop**: Container runtime
- **GitHub CLI**: `gh` para PRs/issues

### CI/CD (Futuro)

- **GitHub Actions**: Builds y tests automatizados
- **Dependabot**: Actualizaciones de deps
- **CodeQL**: Análisis de seguridad

---

## 📚 Recursos Adicionales

- 📖 [Maintaining Open Source Projects](https://opensource.guide/best-practices/)
- 🔐 [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- 🎯 [Semantic Versioning](https://semver.org/)
- 📝 [Conventional Commits](https://www.conventionalcommits.org/)

---

## ✉️ Contacto de Mantenedores

**Maintainer Principal**: Vladimir Acuña (@vladimiracunadev-create)

**Para asuntos privados**: [Agregar email o método de contacto]

---

← [Volver al README](../README.md)
