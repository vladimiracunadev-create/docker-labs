# Especificaciones Técnicas 🔧

Documentación de versiones de software, estándares de código y requisitos técnicos de **docker-labs**.

---

## 📦 Versiones de Software

### Docker y Docker Compose

| Componente | Versión Mínima | Versión Recomendada | Notas |
|------------|----------------|---------------------|-------|
| Docker Engine | 20.10.0 | 24.0.0+ | Para build optimizado con BuildKit |
| Docker Compose | 2.0.0 | 2.15.0+ | Versión plugin (no standalone) |

**Verificación**:
```bash
docker --version
docker-compose --version
```

---

## 🟢 01-node-api: Especificaciones

### Imagen Base
- **Base**: `node:18-alpine`
- **Node.js**: 18.16.0 LTS
- **npm**: 9.x
- **OS**: Alpine Linux 3.17

### Dependencias (package.json)

```json
{
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

### Estructura Obligatoria

```
01-node-api/
├── Dockerfile          ✅ Obligatorio
├── docker-compose.yml  ✅ Obligatorio
├── .dockerignore       ✅ Obligatorio
├── .gitignore          ✅ Obligatorio
├── package.json        ✅ Obligatorio
└── src/
    └── index.js        ✅ Punto de entrada
```

### Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Modo de ejecución |
| `PORT` | `3000` | Puerto de la aplicación |

---

## 🐘 02-php-lamp: Especificaciones

### Imágenes Base
- **PHP**: `php:8.1-apache` (Debian Bullseye)
- **MariaDB**: `mariadb:10.6`
- **phpMyAdmin**: `phpmyadmin:latest` (5.x)

### Extensiones PHP Instaladas

```dockerfile
# docker/Dockerfile
RUN docker-php-ext-install mysqli pdo pdo_mysql
```

| Extensión | Versión | Propósito |
|-----------|---------|-----------|
| `mysqli` | bundled | Conexión MySQL mejorada |
| `pdo` | bundled | PHP Data Objects |
| `pdo_mysql` | bundled | Driver PDO para MySQL |

### Estructura Obligatoria

```
02-php-lamp/
├── docker-compose.yml  ✅ Obligatorio
├── .env.example        ✅ Obligatorio
├── .gitignore          ✅ Obligatorio
├── docker/
│   └── Dockerfile      ✅ Obligatorio
└── src/
    └── index.php       ✅ Punto de entrada
```

### Variables de Entorno (.env)

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DB_HOST` | `db` | Hostname de MariaDB |
| `DB_NAME` | `testdb` | Nombre de la base de datos |
| `DB_USER` | `devuser` | Usuario de BD |
| `DB_PASS` | `devpass123` | Contraseña de BD |
| `DB_ROOT_PASS` | `rootpass` | Contraseña root de MariaDB |

### Configuración Apache

- **DocumentRoot**: `/var/www/html`
- **Puerto interno**: `80`
- **Puerto host**: `8080`
- **Módulos**: `mod_rewrite` habilitado

---

## 🐍 03-python-api: Especificaciones

### Imagen Base
- **Base**: `python:3.10-alpine`
- **Python**: 3.10.11
- **pip**: 23.x
- **OS**: Alpine Linux 3.17

### Dependencias (requirements.txt)

```txt
Flask==2.3.0
Werkzeug==2.3.0
```

### Estructura Obligatoria

```
03-python-api/
├── Dockerfile          ✅ Obligatorio
├── docker-compose.yml  ✅ Obligatorio
├── .dockerignore       ✅ Obligatorio
├── .gitignore          ✅ Obligatorio
├── requirements.txt    ✅ Obligatorio
└── app/
    └── main.py         ✅ Punto de entrada
```

### Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `FLASK_APP` | `main.py` | Archivo principal |
| `FLASK_ENV` | `development` | Modo de ejecución |
| `FLASK_DEBUG` | `1` | Habilita debug mode |

---

## 05-postgres-api: Especificaciones

### Imagen Base
- **Base**: `python:3.12-slim`
- **Python**: 3.12
- **DB**: `postgres:15`

### Dependencias

```txt
fastapi==0.104.1
uvicorn==0.24.0
psycopg2-binary==2.9.9
sqlalchemy==2.0.23
email-validator==2.2.0
```

### Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `POSTGRES_DB` | `inventory` | Base de datos principal |
| `POSTGRES_USER` | `postgres` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | `postgres` | Password de PostgreSQL |
| `DATABASE_URL` | `postgresql://postgres:postgres@postgres:5432/inventory` | Conexion del API |

### Contrato Operativo

- `GET /health`: liveness
- `GET /ready`: readiness contra PostgreSQL
- `GET /summary`: resumen operativo
- entidades: `customers`, `products`, `orders`

---

## 📋 Estándares de Código

### JavaScript (Node.js)

**Estilo**: ESLint + Airbnb Guide (recomendado)

```javascript
// Usar const/let (no var)
const express = require('express');
const app = express();

// Usar async/await
app.get('/data', async (req, res) => {
  const data = await fetchData();
  res.json(data);
});

// Punto y coma obligatorio
const port = 3000;
```

### PHP

**Estilo**: PSR-12

```php
<?php
// Declarar tipos estrictos
declare(strict_types=1);

// Use statements al inicio
use Exception;

// Clase con PascalCase
class DatabaseConnection
{
    private string $host;
    
    public function __construct(string $host)
    {
        $this->host = $host;
    }
}
```

### Python

**Estilo**: PEP 8

```python
# Imports organizados
import os
from flask import Flask, jsonify

# Constantes en MAYÚSCULAS
DEFAULT_PORT = 5000

# Funciones en snake_case
def get_items():
    return {"items": []}

# 4 espacios de indentación
if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=DEFAULT_PORT
    )
```

---

## 🗂️ Archivos Estándar Obligatorios

### .dockerignore

**Propósito**: Excluir archivos del contexto de build

**01-node-api**:
```
node_modules
npm-debug.log
.git
.env
*.md
```

**03-python-api**:
```
__pycache__
*.pyc
.venv
.git
.env
```

### .gitignore

**Propósito**: Excluir archivos del repositorio Git

```
# Dependencias
node_modules/
__pycache__/
.venv/

# Variables sensibles
.env

# Logs
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

### .env.example

**Propósito**: Template de configuración

```env
# Database Configuration
DB_HOST=db
DB_NAME=testdb
DB_USER=devuser
DB_PASS=change-me-in-production

# App Configuration
NODE_ENV=development
```

---

## 🔐 Políticas de Versionado

### Imágenes Docker

❌ **NO usar `latest`**:
```yaml
services:
  db:
    image: mariadb:latest  # ❌ Inestable
```

✅ **Usar versiones específicas**:
```yaml
services:
  db:
    image: mariadb:10.6  # ✅ Estable y predecible
```

### Semantic Versioning

Para tags de imágenes propias:
- **Major**: Cambios incompatibles (ej: `2.0.0`)
- **Minor**: Nueva funcionalidad compatible (ej: `1.1.0`)
- **Patch**: Bug fixes (ej: `1.0.1`)

---

## 💻 Requisitos del Sistema

### Mínimos

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| **CPU** | 2 cores | 4 cores |
| **RAM** | 4 GB | 8 GB |
| **Disco** | 10 GB libres | 20 GB libres |
| **OS** | Windows 10, macOS 11, Ubuntu 20.04 | Latest |

### Docker Desktop (Windows/macOS)

**Settings → Resources**:
```
CPUs: 4
Memory: 4 GB
Swap: 1 GB
Disk image size: 20 GB
```

---

## 🌐 Puertos Utilizados

| Lab | Servicio | Puerto Host | Puerto Contenedor |
|-----|----------|-------------|-------------------|
| 01-node-api | Web | 3000 | 3000 |
| 02-php-lamp | Web | 8080 | 80 |
| 02-php-lamp | MariaDB | (interno) | 3306 |
| 02-php-lamp | phpMyAdmin | 8081 | 80 |
| 03-python-api | Web | 5000 | 5000 |
| 05-postgres-api | API | 8000 | 8000 |
| 05-postgres-api | PostgreSQL | 5432 | 5432 |

**Conflictos comunes**:
- Puerto `3000`: Usado por macOS AirPlay
- Puerto `5000`: Usado por macOS AirPlay
- Puerto `8080`: Usado por proxies locales

**Solución**: Cambiar puerto host en `docker-compose.yml`

---

## 🔄 Convenciones de Nombres

### Servicios (docker-compose.yml)

```yaml
services:
  web:      # ✅ Servicio web/aplicación
  db:       # ✅ Base de datos
  cache:    # ✅ Redis/Memcached
  queue:    # ✅ RabbitMQ/Kafka
```

### Volúmenes

```yaml
volumes:
  db-data:         # ✅ snake-case con propósito
  app-uploads:     # ✅ Descriptivo
  redis-cache:     # ✅ Incluye servicio
```

### Imágenes Propias

```
repositorio/nombre:tag
vladimiracuna/01-node-api:v1.0.0
```

---

## 🛡️ Seguridad

### Variables Sensibles

❌ **NUNCA** hardcodear:
```yaml
environment:
  - DB_PASSWORD=mysecretpass  # ❌ PELIGROSO
```

✅ **Usar archivos .env**:
```yaml
environment:
  - DB_PASSWORD=${DB_PASSWORD}  # ✅ SEGURO
```

### Permisos de Archivos

```bash
# .env debe ser privado
chmod 600 .env
```

---

## 🧪 Testing (Futuro)

Estándares planeados para tests automatizados:

- **Node.js**: Jest
- **PHP**: PHPUnit
- **Python**: pytest

---

## 📖 Compatibilidad

### Sistema Operativo

| OS | Soportado | Notas |
|----|-----------|-------|
| Windows 10/11 | ✅ | Requiere WSL 2 |
| macOS 11+ | ✅ | Intel y Apple Silicon |
| Ubuntu 20.04+ | ✅ | Preferido |
| Debian 11+ | ✅ | |
| Fedora 36+ | ⚠️ | Sin soporte oficial |

### Arquitecturas

- ✅ **amd64 (x86_64)**: Totalmente soportado
- ✅ **arm64 (Apple M1/M2)**: Soportado
- ❌ **armv7**: No soportado

---

## 📝 Limitaciones Conocidas

1. **Windows (sin WSL2)**: Performance degradado con bind mounts
2. **macOS**: File watching puede ser lento en proyectos grandes
3. **Alpine Linux**: Algunas librerías nativas pueden no estar disponibles

---

## 🔄 Actualizaciones

Este documento se actualiza con cada release. Consulta el [CHANGELOG](../CHANGELOG.md) para ver cambios.

**Última actualización**: 2026-01-19  
**Versión de specs**: 1.0.0

---

← [Volver al README](../README.md)
