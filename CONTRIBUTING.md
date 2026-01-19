# Guía de Contribución 🤝

¡Gracias por tu interés en contribuir a **docker-labs**! Esta guía te ayudará a colaborar de forma efectiva.

---

## 🎯 Antes de Empezar

1. **Lee la documentación**: Revisa [README.md](README.md) y [ROADMAP.md](ROADMAP.md)
2. **Explora el código**: Familiarízate con la estructura del proyecto
3. **Abre un issue**: Para cambios importantes, coordina primero

---

## 🚀 Formas de Contribuir

### 🐛 Reportar Bugs

**Usa el template de issue**:

```markdown
**Descripción del bug**:
[Describe claramente el problema]

**Lab afectado**:
- [ ] 01-node-api
- [ ] 02-php-lamp  
- [ ] 03-python-api

**Pasos para reproducir**:
1. Ejecuta `docker-compose up`
2. Navega a http://localhost:3000
3. Ver error X

**Comportamiento esperado**:
[Qué debería pasar]

**Entorno**:
- OS: [Windows 11 / macOS 13 / Ubuntu 22.04]
- Docker: [versión]
- Docker Compose: [versión]
```

---

### 💡 Proponer Features

**Abre un issue de tipo "Enhancement"** con:
- Descripción clara de la funcionalidad
- Caso de uso (¿por qué es útil?)
- Posible implementación (opcional)

---

### 📝 Mejorar Documentación

¡La documentación nunca es suficiente!

- Corrige typos
- Aclara conceptos confusos
- Agrega ejemplos
- Traduce contenido (futuro)

**No necesitas aprobar el issue primero para PRs de docs**.

---

### 🧪 Crear Nuevos Laboratorios

¿Tienes un stack favorito? ¡Compártelo!

**Requisitos**:
- Seguir estructura de labs existentes
- Documentación clara (README en la carpeta del lab)
- `Dockerfile` o imagen específica (no `latest`)
- `docker-compose.yml` funcional
- `.dockerignore` y `.gitignore`
- `.env.example` si usa variables sensibles

**Ver**: [Criterios de Aceptación](docs/MAINTAINERS.md#criterios-de-aceptación-de-nuevos-labs)

---

## 🔄 Proceso de Pull Request

### 1. Fork y Clone

```bash
# Fork el repo en GitHub, luego:
git clone https://github.com/TU-USUARIO/docker-labs.git
cd docker-labs
```

### 2. Crea una Branch

```bash
git checkout -b tipo/descripcion
```

**Tipos de branch**:
- `feature/nombre-lab` - Nuevo laboratorio
- `fix/corregir-bug` - Corrección de bug
- `docs/actualizar-readme` - Documentación
- `refactor/mejorar-codigo` - Refactorización

### 3. Haz tus Cambios

- Sigue las convenciones del proyecto
- Prueba localmente que funciona
- Commit con mensajes claros

### 4. Prueba Localmente

```bash
# Ejemplo para 01-node-api
cd 01-node-api
docker-compose up --build

# Verifica que funcione
curl http://localhost:3000

# Detén
docker-compose down
```

### 5. Commit con Mensajes Claros

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat(01-node-api): agregar endpoint /users"
git commit -m "fix(02-php-lamp): corregir conexión a BD"
git commit -m "docs(readme): actualizar instrucciones de instalación"
```

**Formato**: `tipo(scope): mensaje`

**Tipos**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Solo documentación
- `style`: Formato (sin cambios lógicos)
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento (deps, configs)

### 6. Push y Abre PR

```bash
git push origin tipo/descripcion
```

Luego en GitHub:
- Abre Pull Request contra `main`
- Llena la descripción del PR template
- Espera revisión

---

## 📋 Checklist de PR

Antes de enviar tu PR, verifica:

- [ ] **Funciona localmente**: Probado con `docker-compose up`
- [ ] **Mensajes de commit**: Claros y descriptivos
- [ ] **Documentación**: Actualizada si cambias funcionalidad
- [ ] **Sin secretos**: No hay contraseñas hardcodeadas
- [ ] **`.gitignore`**: Archivos innecesarios no incluidos
- [ ] **Versiones específicas**: No usaste `latest` en imágenes
- [ ] **Descripción clara**: El PR explica qué y por qué

---

## 🎨 Estilo de Código

### JavaScript (Node.js)

```javascript
// Usar const/let (nunca var)
const express = require('express');

// Nombres descriptivos
const PORT = 3000;

// Comentarios donde agregan valor
// Inicia el servidor Express
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Recomendado**: ESLint con Airbnb style guide

---

### PHP

```php
<?php
// PSR-12 compatible
declare(strict_types=1);

class DatabaseConnection
{
    private string $host;
    
    public function __construct(string $host)
    {
        $this->host = $host;
    }
}
```

---

### Python

```python
# PEP 8
import os
from flask import Flask

# Constantes en MAYÚSCULAS
DEFAULT_PORT = 5000

# Funciones en snake_case
def get_items():
    return {"items": []}
```

---

### Docker

**Dockerfile**:
```dockerfile
# Versión específica
FROM node:18.16-alpine

# Etiquetas informativas
LABEL maintainer="tu-email"

# Orden optimizado (deps → código)
COPY package*.json ./
RUN npm install
COPY . .
```

**docker-compose.yml**:
```yaml
services:
  web:
    # Imagen con versión
    image: node:18-alpine
    
    # Orden alfabético en propiedades
    build: .
    environment:
      - NODE_ENV=${NODE_ENV}
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
```

---

## 🧪 Testing (Futuro)

Cuando agregemos CI/CD, los tests serán obligatorios. Por ahora:

```bash
# Prueba manual completa
docker-compose up --build
# Verifica endpoints
# Revisa logs
docker-compose down
```

---

## 📖 Documentación

Si creas un nuevo lab, incluye **README.md** en su carpeta:

```markdown
# Nombre del Lab

## Descripción
[Breve descripción del stack]

## Stack
- Runtime: X
- Framework: Y
- BD: Z (si aplica)

## Inicio Rápido
\`\`\`bash
docker-compose up
\`\`\`

## Endpoints
- GET / - Descripción
- POST /items - Descripción

## Variables de entorno
Ver `.env.example`
```

---

## ⚖️ Código de Conducta

Lee y respeta nuestro [Código de Conducta](CODE_OF_CONDUCT.md).

**TL;DR**:
- 🤝 Sé respetuoso y profesional
- 💬 Da feedback constructivo
- 🚫 Cero tolerancia a acoso

---

## 🛡️ Seguridad

**NO publiques vulnerabilidades de seguridad en issues públicos**.

Reporta de forma privada:
- Email (ver [SECURITY.md](SECURITY.md))
- GitHub Security Advisory

---

## 📝 Licencia y Copyright

Al contribuir, aceptas que tu código se licencie bajo **Apache License 2.0** (mismo que el proyecto).

Si necesitas firmar un CLA (Contributor License Agreement), se indicará en el PR.

---

## 🎓 Recursos para Contribuyentes

- 🏗️ [Arquitectura](docs/ARCHITECTURE.md) - Diseño del proyecto
- 🔧 [Specs Técnicas](docs/TECHNICAL_SPECS.md) - Estándares
- 👥 [Guía de Mantenedores](docs/MAINTAINERS.md) - Para reviewers
- 🗺️ [Roadmap](ROADMAP.md) - Planes futuros

---

## 💬 ¿Necesitas Ayuda?

- 🐛 **Issues**: [GitHub Issues](https://github.com/vladimiracunadev-create/docker-labs/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/vladimiracunadev-create/docker-labs/discussions)
- 📧 **Email**: Ver [MAINTAINERS.md](docs/MAINTAINERS.md)

---

## 🌟 Reconocimiento

**Todos los contribuyentes son valiosos**:
- Tu nombre aparecerá en el historial de Git
- PRs significativos se mencionan en el CHANGELOG
- Contribuyentes recurrentes pueden convertirse en mantenedores

---

## ✨ Primera Contribución

Si es tu primera vez contribuyendo a open source:

1. 🎉 **¡Bienvenido!** Todos empezamos alguna vez
2. 🏷️ Busca issues con etiqueta `good-first-issue`
3. 📚 Lee la [guía de GitHub](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)
4. 💬 No dudes en hacer preguntas en el issue

**No te preocupes por cometer errores—revisaremos tu PR y te ayudaremos a mejorarlo.**

---

¡Gracias por hacer de docker-labs un mejor proyecto! 🚀

← [Volver al README](README.md)
