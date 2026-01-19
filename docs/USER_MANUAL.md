# Manual de Usuario 📚

Guía completa para sacar el máximo provecho a **docker-labs** y dominar el flujo de trabajo con Docker.

---

## 🎯 Flujo de Trabajo Completo

El ciclo de vida típico de un laboratorio sigue este patrón:

```
┌─────────┐    ┌─────┐    ┌──────┐    ┌──────┐    ┌──────┐
│  build  │ →  │ up  │ →  │ logs │ →  │ exec │ →  │ down │
└─────────┘    └─────┘    └──────┘    └──────┘    └──────┘
```

### 1. **Build** - Construir la imagen

Crea la imagen Docker desde el Dockerfile:

```bash
docker-compose build
```

**Cuándo usarlo**:
- Primera vez que usas el laboratorio
- Modificaste el `Dockerfile`
- Instalaste nuevas dependencias

### 2. **Up** - Levantar los servicios

Inicia los contenedores definidos en `docker-compose.yml`:

```bash
# Modo foreground (ver logs en tiempo real)
docker-compose up

# Modo background (libera la terminal)
docker-compose up -d
```

**Reconstruir y levantar**:
```bash
docker-compose up --build
```

### 3. **Logs** - Ver registros

Monitorea la salida de los contenedores:

```bash
# Logs de todos los servicios
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f web

# Últimas 100 líneas
docker-compose logs --tail=100
```

### 4. **Exec** - Ejecutar comandos dentro del contenedor

Entra al contenedor para debugging o tareas administrativas:

```bash
# Bash interactivo
docker-compose exec web bash

# Comando específico
docker-compose exec web ls -la

# Como root
docker-compose exec -u root web apt-get update
```

### 5. **Down** - Detener y eliminar

Detiene y elimina los contenedores:

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ CUIDADO: borra datos)
docker-compose down -v
```

---

## 🧪 Uso de Cada Laboratorio

### 🟢 01-node-api (Node.js + Express)

**Objetivo**: API REST básica con Node.js

**Inicio rápido**:
```bash
cd 01-node-api
docker-compose up
```

**Acceso**: http://localhost:3000

**Endpoints disponibles**:
- `GET /` - Mensaje de bienvenida
- `GET /health` - Health check

**Modificar código**:
1. Edita `src/index.js` en tu máquina
2. El contenedor se reinicia automáticamente (nodemon)
3. Refresca el navegador

**Instalar dependencias**:
```bash
# Entra al contenedor
docker-compose exec web bash

# Instala un paquete
npm install <paquete>

# Sal del contenedor
exit

# Reconstruye para persistir cambios
docker-compose build
```

---

### 🐘 02-php-lamp (PHP + Apache + MariaDB)

**Objetivo**: Stack LAMP clásico para apps PHP con base de datos

**Inicio rápido**:
```bash
cd 02-php-lamp
docker-compose up -d
```

**Acceso**: 
- Web: http://localhost:8080
- phpMyAdmin: http://localhost:8081

**Servicios**:
- `web`: Apache + PHP 8.1
- `db`: MariaDB 10.6
- `phpmyadmin`: Gestor visual de BD

**Variables de entorno** (`.env`):
```env
DB_HOST=db
DB_NAME=testdb
DB_USER=devuser
DB_PASS=devpass123
```

**Conectar a la BD desde PHP**:
```php
<?php
$conn = new mysqli(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    $_ENV['DB_NAME']
);
```

**Importar SQL**:
```bash
# Copia el archivo al contenedor
docker cp midb.sql 02-php-lamp-db-1:/midb.sql

# Importa
docker-compose exec db mysql -u devuser -pdevpass123 testdb < /midb.sql
```

---

### 🐍 03-python-api (Python + Flask)

**Objetivo**: API REST con Python y framework Flask

**Inicio rápido**:
```bash
cd 03-python-api
docker-compose up
```

**Acceso**: http://localhost:5000

**Endpoints disponibles**:
- `GET /` - Mensaje de bienvenida
- `GET /items` - Lista de items (ejemplo)

**Modificar código**:
1. Edita `app/main.py`
2. Flask detecta cambios automáticamente (debug mode)
3. Los cambios se reflejan al instante

**Instalar dependencias**:
```bash
# Agrega a requirements.txt
echo "requests==2.28.0" >> requirements.txt

# Reconstruye
docker-compose up --build
```

---

## 🔧 Comandos Esenciales

### Inspeccionar el estado

```bash
# Ver contenedores activos
docker ps

# Ver todos los contenedores (incluidos detenidos)
docker ps -a

# Detalles de un contenedor
docker inspect <nombre-contenedor>

# Uso de recursos
docker stats
```

### Gestión de imágenes

```bash
# Listar imágenes
docker images

# Eliminar imagen
docker rmi <nombre-imagen>

# Eliminar imágenes sin usar
docker image prune
```

### Gestión de volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect <nombre-volumen>

# Eliminar volúmenes sin usar
docker volume prune
```

### Limpieza general

```bash
# Limpiar todo (contenedores, redes, imágenes sin usar)
docker system prune

# Limpieza agresiva (incluye volúmenes)
docker system prune -a --volumes
```

---

## ⚙️ Personalización de Laboratorios

### Cambiar puertos

Edita `docker-compose.yml`:

```yaml
services:
  web:
    ports:
      - "3001:3000"  # Cambia 3001 por el puerto que prefieras
```

### Agregar variables de entorno

**Opción 1: En docker-compose.yml**
```yaml
services:
  web:
    environment:
      - NODE_ENV=production
      - API_KEY=mi-clave-secreta
```

**Opción 2: Archivo .env**
```bash
# Crea .env desde .env.example
cp .env.example .env

# Edita .env
NODE_ENV=development
DB_PASSWORD=mi-password-seguro
```

### Agregar más servicios

Ejemplo: Agregar Redis a 01-node-api

```yaml
services:
  web:
    # ... configuración existente ...
    depends_on:
      - redis
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

---

## 🐛 Debugging y Logs

### Ver logs en tiempo real

```bash
docker-compose logs -f
```

### Filtrar por servicio

```bash
docker-compose logs -f web
```

### Grep en logs

```bash
docker-compose logs | grep ERROR
```

### Entrar al contenedor para debug

```bash
# Bash
docker-compose exec web bash

# Si no tiene bash, usa sh
docker-compose exec web sh

# Navega y explora
ls -la
ps aux
cat /var/log/apache2/error.log
```

### Verificar conectividad entre servicios

```bash
# Desde el contenedor web, haz ping a db
docker-compose exec web ping db
```

---

## 🔄 Workflow de Desarrollo

### 1. Desarrollo activo (hot reload)

```bash
# Levanta con logs visibles
docker-compose up

# En otra terminal, edita código
# Los cambios se reflejan automáticamente
```

### 2. Testing de cambios

```bash
# Reconstruye si modificaste dependencias
docker-compose up --build

# Ejecuta tests dentro del contenedor
docker-compose exec web npm test
```

### 3. Limpieza y reset

```bash
# Detén todo
docker-compose down

# Elimina volúmenes (datos de BD, etc.)
docker-compose down -v

# Empieza de cero
docker-compose up --build
```

---

## 📦 Gestión de Dependencias

### Node.js (01-node-api)

**Agregar paquete**:
```bash
docker-compose exec web npm install <paquete>
docker-compose exec web npm install --save-dev <paquete-dev>
```

**Actualizar package.json en host**:
```bash
docker cp 01-node-api-web-1:/app/package.json ./package.json
```

### Python (03-python-api)

**Agregar paquete**:
1. Edita `requirements.txt` directamente
2. Reconstruye: `docker-compose up --build`

### PHP (02-php-lamp)

**Extensiones PHP**:
Edita `docker/Dockerfile`:
```dockerfile
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install gd
```

Reconstruye:
```bash
docker-compose build web
```

---

## 🔐 Seguridad Básica

### Variables sensibles

❌ **MAL**:
```yaml
environment:
  - DB_PASSWORD=password123
```

✅ **BIEN**:
```yaml
environment:
  - DB_PASSWORD=${DB_PASSWORD}
```

Luego en `.env`:
```
DB_PASSWORD=mi-password-seguro
```

### .gitignore

Asegúrate de que `.gitignore` incluya:
```
.env
node_modules/
__pycache__/
*.log
```

### Exponer solo puertos necesarios

```yaml
# Solo localmente
ports:
  - "127.0.0.1:3000:3000"
```

---

## 🚀 Tips Pro

### Alias útiles

Agrega a tu `.bashrc` o `.zshrc`:

```bash
alias dcu='docker-compose up'
alias dcd='docker-compose down'
alias dcb='docker-compose build'
alias dcl='docker-compose logs -f'
alias dce='docker-compose exec'
```

### Ver todos los logs en VS Code

Usa la extensión Docker para VS Code y visualiza logs, contenedores e imágenes desde la barra lateral.

### Docker en Windows (WSL2)

Coloca tu código dentro de WSL2 para mejor performance:
```bash
# Desde WSL2
cd ~
git clone <repo>
```

---

## 📖 Recursos Adicionales

- 🏗️ [Arquitectura](ARCHITECTURE.md) - Cómo están diseñados los labs
- 📋 [Catálogo de Labs](LABS_CATALOG.md) - Detalles técnicos de cada uno
- 🔧 [Troubleshooting](TROUBLESHOOTING.md) - Solución de problemas
- 🎯 [Best Practices](BEST_PRACTICES.md) - Mejores prácticas de Docker

---

← [Volver al README](../README.md)
