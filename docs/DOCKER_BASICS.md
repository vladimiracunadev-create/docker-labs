# Docker Basics 🐳

Guía completa de conceptos fundamentales de Docker para dominar la tecnología de contenedores.

---

## 🤔 ¿Qué es Docker?

**Docker** es una plataforma que permite **empaquetar**, **distribuir** y **ejecutar** aplicaciones en **contenedores** aislados.

### Analogía del Barco de Carga

Imagina que tu aplicación es mercancía y Docker es un contenedor de envío:

```
🚢 Barco (Docker Engine)
  ├── 📦 Contenedor 1 (Node.js app)
  ├── 📦 Contenedor 2 (PHP app)
  └── 📦 Contenedor 3 (Python app)
```

Cada contenedor:
- ✅ Es **independiente** (no afecta a otros)
- ✅ Tiene todo lo que necesita (código, runtime, dependencias)
- ✅ Funciona **igual en cualquier lugar** (dev, staging, prod)

---

## 🖼️ Imagen vs Contenedor

### Imagen

Una **imagen** es una plantilla de solo lectura que contiene:
- Sistema operativo base (Alpine, Ubuntu, etc.)
- Runtime (Node, PHP, Python, etc.)
- Dependencias instaladas
- Tu código fuente

```bash
# Listar imágenes
docker images
```

**Analogía**: La imagen es como una "receta de cocina" o un "plano de construcción".

### Contenedor

Un **contenedor** es una **instancia en ejecución** de una imagen.

```bash
# Ver contenedores corriendo
docker ps

# Ver todos (incluidos detenidos)
docker ps -a
```

**Analogía**: El contenedor es el "plato cocinado" o la "casa construida".

---

## 📄 Dockerfile

El `Dockerfile` es un archivo de texto con instrucciones para construir una imagen.

### Ejemplo Básico

```dockerfile
# Imagen base
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Puerto que expone la app
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
```

### Instrucciones Comunes

| Instrucción | Descripción | Ejemplo |
|-------------|-------------|---------|
| `FROM` | Imagen base | `FROM python:3.10` |
| `WORKDIR` | Directorio de trabajo | `WORKDIR /app` |
| `COPY` | Copiar archivos host → contenedor | `COPY . .` |
| `RUN` | Ejecutar comando al construir | `RUN apt-get update` |
| `ENV` | Variable de entorno | `ENV NODE_ENV=production` |
| `EXPOSE` | Documentar puerto | `EXPOSE 8080` |
| `CMD` | Comando al iniciar contenedor | `CMD ["python", "app.py"]` |
| `ENTRYPOINT` | Comando principal (no overrideable) | `ENTRYPOINT ["nginx"]` |

### Construir una Imagen

```bash
# Construir imagen con tag
docker build -t mi-app:v1.0 .

# Construir sin caché
docker build --no-cache -t mi-app .
```

---

## 🎼 docker-compose.yml

`docker-compose` permite **orquestar múltiples contenedores** con un solo archivo YAML.

### Ejemplo: Web + Base de Datos

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    volumes:
      - ./src:/var/www/html
    environment:
      - DB_HOST=db
    depends_on:
      - db
  
  db:
    image: mariadb:10.6
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: mydb
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

### Comandos Esenciales

```bash
# Levantar todos los servicios
docker-compose up

# Levantar en background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reconstruir imágenes
docker-compose build

# Levantar con rebuild
docker-compose up --build
```

---

## 💾 Volúmenes

Los **volúmenes** permiten que los datos **persistan** fuera del contenedor.

### Tipos de Volúmenes

#### 1. Named Volumes (Recomendado para datos)

```yaml
volumes:
  - db-data:/var/lib/mysql

volumes:
  db-data:  # Declaración del volumen
```

**Ventajas**:
- Persistencia garantizada
- Gestionados por Docker
- Performance óptimo

**Uso típico**: Bases de datos, archivos subidos

#### 2. Bind Mounts (Desarrollo)

```yaml
volumes:
  - ./src:/var/www/html
```

**Ventajas**:
- Edición en tiempo real
- Fácil acceso desde host

**Uso típico**: Código fuente en desarrollo

#### 3. Volúmenes Anónimos

```yaml
volumes:
  - /app/node_modules
```

**Uso típico**: Evitar que bind mounts sobreescriban carpetas

### Comandos de Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect db-data

# Eliminar volumen
docker volume rm db-data

# Limpiar volúmenes sin usar
docker volume prune
```

---

## 🌐 Redes en Docker

Docker crea redes virtuales para que los contenedores se comuniquen.

### Red por Defecto (docker-compose)

```yaml
services:
  web:
    # ...
  db:
    # ...
```

Automáticamente crea una red donde:
- `web` puede hacer `ping db`
- `db` puede hacer `ping web`

### Comunicación entre Contenedores

```bash
# Desde el contenedor 'web'
docker-compose exec web ping db
docker-compose exec web curl http://db:3306
```

### Tipos de Redes

| Tipo | Descripción | Uso |
|------|-------------|-----|
| `bridge` | Red privada virtual (default) | Desarrollo local |
| `host` | Usa red del host directamente | Performance crítico |
| `none` | Sin red | Aislamiento total |

---

## 🔌 Puertos

Los puertos se "mapean" desde el host al contenedor.

### Sintaxis

```yaml
ports:
  - "HOST:CONTAINER"
```

### Ejemplos

```yaml
# Acceso público
ports:
  - "8080:80"  # localhost:8080 → contenedor:80

# Acceso solo local
ports:
  - "127.0.0.1:8080:80"

# Puerto aleatorio en host
ports:
  - "80"  # Docker asigna puerto automáticamente
```

---

## 🔧 Comandos Esenciales

### Gestión de Contenedores

```bash
# Ver contenedores activos
docker ps

# Ver todos (incluidos detenidos)
docker ps -a

# Iniciar contenedor
docker start <nombre>

# Detener contenedor
docker stop <nombre>

# Reiniciar contenedor
docker restart <nombre>

# Eliminar contenedor
docker rm <nombre>

# Forzar eliminación (corriendo)
docker rm -f <nombre>
```

### Ejecutar Comandos en Contenedores

```bash
# Bash interactivo
docker exec -it <nombre> bash

# Comando específico
docker exec <nombre> ls -la

# Como root
docker exec -u root <nombre> apt-get update
```

### Logs

```bash
# Ver logs
docker logs <nombre>

# Seguir logs en tiempo real
docker logs -f <nombre>

# Últimas 100 líneas
docker logs --tail=100 <nombre>
```

### Inspección

```bash
# Detalles del contenedor (JSON)
docker inspect <nombre>

# IP del contenedor
docker inspect -f '{{.NetworkSettings.IPAddress}}' <nombre>

# Uso de recursos
docker stats
```

---

## 🧹 Limpieza

### Eliminar Recursos Sin Usar

```bash
# Contenedores detenidos
docker container prune

# Imágenes sin usar
docker image prune

# Volúmenes sin usar
docker volume prune

# Redes sin usar
docker network prune

# TODO (⚠️ CUIDADO)
docker system prune -a --volumes
```

---

## 🎯 Mejores Prácticas

### Dockerfile

✅ **BIEN**:
```dockerfile
# Imagen específica con versión
FROM node:18.16-alpine

# Copiar deps primero (cache)
COPY package*.json ./
RUN npm install

# Código después
COPY . .
```

❌ **MAL**:
```dockerfile
# Versión latest (inestable)
FROM node:latest

# Todo junto (no usa caché)
COPY . .
RUN npm install
```

### docker-compose.yml

✅ **BIEN**:
```yaml
services:
  web:
    image: myapp:v1.2.3
    restart: unless-stopped
    environment:
      - NODE_ENV=${NODE_ENV}
```

❌ **MAL**:
```yaml
services:
  web:
    image: myapp:latest
    restart: always
    environment:
      - DB_PASSWORD=hardcoded123
```

### Seguridad

```dockerfile
# Crear usuario no-root
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

# Cambiar a usuario
USER appuser
```

---

## 🐛 Debugging

### Contenedor no inicia

```bash
# Ver logs de error
docker-compose logs web

# Ver por qué falló
docker inspect <nombre>
```

### Entrar a contenedor que crashea

```bash
# Override del comando
docker run -it --entrypoint bash <imagen>
```

### Puerto ocupado

```bash
# Linux/macOS: Ver qué usa el puerto
lsof -i :8080

# Windows
netstat -ano | findstr :8080
```

---

## 📚 Glosario Completo

| Término | Significado |
|---------|-------------|
| **Imagen** | Plantilla inmutable (receta) |
| **Contenedor** | Instancia ejecutándose (plato cocinado) |
| **Dockerfile** | Instrucciones para construir imagen |
| **docker-compose.yml** | Orquestación de múltiples servicios |
| **Volumen** | Almacenamiento persistente |
| **Bind mount** | Carpeta del host montada en contenedor |
| **Puerto** | Punto de comunicación (host:container) |
| **Servicio** | Definición de contenedor en compose |
| **Red** | Red virtual para comunicación |
| **Registry** | Repositorio de imágenes (Docker Hub) |
| **Tag** | Versión de una imagen (`node:18`) |
| **Layer** | Capa de filesystem en imagen |
| **Build** | Proceso de crear imagen |
| **Run** | Crear y ejecutar contenedor |
| **Exec** | Ejecutar comando en contenedor activo |

---

## 🎓 Recursos Oficiales

- 📖 [Docker Docs](https://docs.docker.com/)
- 🎥 [Docker 101 Tutorial](https://www.docker.com/101-tutorial/)
- 🐳 [Docker Hub](https://hub.docker.com/)
- 📚 [Docker Compose Docs](https://docs.docker.com/compose/)

---

## 📖 Ver También

- 🏗️ [Arquitectura](ARCHITECTURE.md) - Diseño de docker-labs
- 📚 [Manual de Usuario](USER_MANUAL.md) - Uso avanzado
- 🎯 [Best Practices](BEST_PRACTICES.md) - Mejores prácticas

---

← [Volver al README](../README.md)
