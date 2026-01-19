# Catálogo de Laboratorios 📋

Referencia completa de todos los laboratorios disponibles en **docker-labs**.

---

## 📊 Vista General

| Laboratorio | Stack | Puerto(s) | Objetivo | BD | Complejidad |
|-------------|-------|-----------|----------|-------|-------------|
| [01-node-api](#-01-node-api) | Node.js 18 + Express | 3000 | API REST básica | ❌ No | ⭐ Básico |
| [02-php-lamp](#-02-php-lamp) | PHP 8.1 + Apache + MariaDB | 8080, 8081 | CRUD clásico LAMP | ✅ MariaDB | ⭐⭐ Intermedio |
| [03-python-api](#-03-python-api) | Python 3.10 + Flask | 5000 | API REST Python | ❌ No | ⭐ Básico |
| [04-redis-cache](#-04-redis-cache) | Node.js 18 + Redis | 3001 | API con caching | ✅ Redis | ⭐⭐ Intermedio |
| [05-postgres-api](#-05-postgres-api) | Python 3.12 + FastAPI + PostgreSQL | 8000 | API con Postgres | ✅ PostgreSQL | ⭐⭐ Intermedio |
| [06-nginx-proxy](#-06-nginx-proxy) | Nginx | 8080 | Reverse proxy | ❌ No | ⭐ Básico |
| [07-rabbitmq-messaging](#-07-rabbitmq-messaging) | Node.js 18 + RabbitMQ | 5672, 15672 | Mensajería asíncrona | ✅ RabbitMQ | ⭐⭐⭐ Avanzado |
| [08-prometheus-grafana](#-08-prometheus-grafana) | Prometheus + Grafana | 9090, 3000 | Monitoreo | ❌ No | ⭐⭐ Intermedio |
| [09-multi-service-app](#-09-multi-service-app) | React + Node.js + MongoDB | 8080, 3000 | Microservicios | ✅ MongoDB | ⭐⭐⭐ Avanzado |
| [10-go-api](#-10-go-api) | Go 1.21 | 8080 | API en Go | ❌ No | ⭐⭐ Intermedio |
| [11-elasticsearch-search](#-11-elasticsearch-search) | Python 3.12 + Elasticsearch | 8000, 9200 | Búsqueda full-text | ✅ Elasticsearch | ⭐⭐ Intermedio |
| [12-jenkins-ci](#-12-jenkins-ci) | Jenkins | 8080 | CI/CD | ❌ No | ⭐⭐⭐ Avanzado |

---

## 🟢 01-node-api

### Descripción

API REST básica construida con **Node.js** y **Express**, ideal para aprender los fundamentos de desarrollo de APIs con contenedores.

### Stack Tecnológico

- **Runtime**: Node.js 18 (Alpine Linux)
- **Framework**: Express 4.x
- **Dev Tools**: Nodemon (hot reload)
- **Package Manager**: npm

### Estructura de Archivos

```
01-node-api/
├── Dockerfile              # Imagen Node 18 Alpine
├── docker-compose.yml      # Servicio web único
├── .dockerignore          # Excluye node_modules
├── .gitignore             # Ignora deps instaladas
├── package.json           # Dependencias npm
├── server.js              # Punto de entrada (deprecated)
└── src/
    └── index.js           # Código principal de la API
```

### Configuración

**Archivo**: `docker-compose.yml`

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

**Variables de entorno**: Ninguna requerida por defecto.

### Inicio Rápido

```bash
cd 01-node-api
docker-compose up
```

**Acceso**: http://localhost:3000

### Endpoints Disponibles

| Método | Ruta | Descripción | Respuesta |
|--------|------|-------------|-----------|
| GET | `/` | Mensaje de bienvenida | `{ "message": "Hello from Node.js in Docker!" }` |
| GET | `/health` | Health check | `{ "status": "ok", "timestamp": "..." }` |

### Casos de Uso

- ✅ Aprender arquitectura de APIs REST
- ✅ Practicar rutas y middleware de Express
- ✅ Entender hot reload con Nodemon
- ✅ Base para microservicios

### Personalización

**Agregar nueva ruta**:

Edita `src/index.js`:
```javascript
app.get('/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob'] });
});
```

**Instalar dependencias**:
```bash
docker-compose exec web npm install axios
```

### Troubleshooting

**Puerto 3000 ocupado**:
- Cambia `ports: - "3001:3000"` en `docker-compose.yml`

**Cambios no se reflejan**:
- Verifica que Nodemon esté instalado en `package.json`
- Revisa logs: `docker-compose logs -f`

---

## 🐘 02-php-lamp

### Descripción

Stack LAMP completo (**Linux, Apache, MariaDB, PHP**) para desarrollo de aplicaciones web clásicas con base de datos relacional.

### Stack Tecnológico

- **Web Server**: Apache 2.4
- **PHP**: 8.1 (con extensiones: mysqli, pdo)
- **Database**: MariaDB 10.6
- **Admin Tool**: phpMyAdmin (última versión)

### Estructura de Archivos

```
02-php-lamp/
├── docker-compose.yml       # 3 servicios: web, db, phpmyadmin
├── .env                     # Variables de BD (no en git)
├── .env.example             # Template de configuración
├── .gitignore
├── docker/
│   └── Dockerfile           # Imagen PHP + Apache + extensiones
└── src/
    └── index.php            # Código PHP de ejemplo
```

### Configuración

**Archivo**: `.env`

```env
DB_HOST=db
DB_NAME=testdb
DB_USER=devuser
DB_PASS=devpass123
DB_ROOT_PASS=rootpass
```

**docker-compose.yml** (resumido):

```yaml
services:
  web:
    build: ./docker
    ports:
      - "8080:80"
    volumes:
      - ./src:/var/www/html
    depends_on:
      - db
  
  db:
    image: mariadb:10.6
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASS}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASS}
    volumes:
      - db-data:/var/lib/mysql
  
  phpmyadmin:
    image: phpmyadmin:latest
    ports:
      - "8081:80"

volumes:
  db-data:
```

### Inicio Rápido

```bash
cd 02-php-lamp
cp .env.example .env    # Primera vez
docker-compose up -d
```

**Accesos**:
- Web: http://localhost:8080
- phpMyAdmin: http://localhost:8081
  - Usuario: `devuser`
  - Contraseña: `devpass123`

### Funcionalidades

- ✅ Conexión PHP → MariaDB
- ✅ Gestión visual de BD con phpMyAdmin
- ✅ Persistencia de datos en volumen
- ✅ Hot reload de archivos PHP

### Ejemplo de Conexión a BD

**src/index.php**:

```php
<?php
$conn = new mysqli(
    getenv('DB_HOST'),
    getenv('DB_USER'),
    getenv('DB_PASS'),
    getenv('DB_NAME')
);

if ($conn->connect_error) {
    die("Error: " . $conn->connect_error);
}

echo "✅ Conexión exitosa a MariaDB";
?>
```

### Casos de Uso

- ✅ CRUDs tradicionales
- ✅ Aplicaciones PHP con BD relacional
- ✅ Migración de apps legacy a Docker
- ✅ Desarrollo de CMSs (WordPress, Laravel, etc.)

### Personalización

**Agregar extensión PHP**:

Edita `docker/Dockerfile`:
```dockerfile
RUN docker-php-ext-install gd
```

Reconstruye:
```bash
docker-compose build web
docker-compose up -d
```

**Importar SQL**:
```bash
docker cp dump.sql 02-php-lamp-db-1:/dump.sql
docker-compose exec db mysql -u devuser -pdevpass123 testdb < /dump.sql
```

### Troubleshooting

**No conecta a BD**:
- Espera 10-15 segundos tras `docker-compose up`
- Verifica `.env` con credenciales correctas
- Logs: `docker-compose logs db`

**Puerto 8080 ocupado**:
- Cambia `"8080:80"` a `"8090:80"` en `docker-compose.yml`

---

## 🐍 03-python-api

### Descripción

API REST construida con **Python** y **Flask**, perfecta para aprender desarrollo backend con Python en un entorno dockerizado.

### Stack Tecnológico

- **Runtime**: Python 3.10 (Alpine Linux)
- **Framework**: Flask 2.x
- **WSGI**: Development server (Flask built-in)
- **Package Manager**: pip

### Estructura de Archivos

```
03-python-api/
├── Dockerfile              # Imagen Python 3.10 Alpine
├── docker-compose.yml      # Servicio web único
├── .dockerignore          # Excluye __pycache__, .venv
├── .gitignore
├── requirements.txt       # Dependencias pip
└── app/
    └── main.py            # Código principal Flask
```

### Configuración

**Archivo**: `docker-compose.yml`

```yaml
services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./app:/app
    environment:
      - FLASK_APP=main.py
      - FLASK_ENV=development
      - FLASK_DEBUG=1
```

**requirements.txt**:
```
Flask==2.3.0
```

### Inicio Rápido

```bash
cd 03-python-api
docker-compose up
```

**Acceso**: http://localhost:5000

### Endpoints Disponibles

| Método | Ruta | Descripción | Respuesta |
|--------|------|-------------|-----------|
| GET | `/` | Mensaje de bienvenida | `{ "message": "Hello from Python Flask in Docker!" }` |
| GET | `/items` | Lista de items | `{ "items": [...] }` |

### Casos de Uso

- ✅ Aprender Flask y routing
- ✅ Desarrollo de APIs RESTful con Python
- ✅ Integración con librerías científicas (pandas, numpy)
- ✅ Microservicios Python

### Personalización

**Agregar nueva ruta**:

Edita `app/main.py`:
```python
@app.route('/status')
def status():
    return {"status": "active", "version": "1.0"}
```

**Instalar dependencias**:
```bash
# Agrega a requirements.txt
echo "requests==2.28.0" >> requirements.txt

# Reconstruye
docker-compose up --build
```

### Troubleshooting

**Puerto 5000 ocupado (macOS)**:
- macOS usa 5000 para AirPlay
- Cambia a `"5001:5000"` en `docker-compose.yml`

**Cambios no se reflejan**:
- Verifica `FLASK_DEBUG=1` en `docker-compose.yml`
- Revisa logs: `docker-compose logs -f`

---

## 🔮 Futuros Laboratorios (Roadmap)

Laboratorios planeados para futuras versiones:

- 🗄️ **postgres-api**: PostgreSQL + Node.js/Python
- 🔴 **redis-cache**: Redis como caché
- 🐰 **rabbitmq-queue**: Colas de mensajes
- 🌐 **nginx-proxy**: Reverse proxy con Nginx
- 📊 **monitoring**: Prometheus + Grafana
- 🔐 **auth-service**: Autenticación JWT

---

## 💡 Comparativa Rápida

### ¿Cuál elegir?

**Si quieres aprender Docker básico**:
- → `01-node-api` o `03-python-api` (1 servicio, simple)

**Si necesitas base de datos**:
- → `02-php-lamp` (stack completo)

**Si prefieres JavaScript**:
- → `01-node-api`

**Si prefieres Python**:
- → `03-python-api`

**Si vienes de desarrollo web tradicional**:
- → `02-php-lamp` (similar a XAMPP/WAMP)

---

## � 04-redis-cache

### Descripción
API REST con caching usando Redis para mejorar rendimiento y reducir carga en bases de datos.

### Stack Tecnológico
- **Runtime**: Node.js 18 (Alpine)
- **Framework**: Express
- **Cache**: Redis 7
- **Cliente**: redis npm package

### Estructura de Archivos
```
04-redis-cache/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── server.js
└── k8s/
    └── deployment.yaml
```

### Inicio Rápido
```bash
cd 04-redis-cache
docker-compose up
```
**Acceso**: http://localhost:3001

### Endpoints
- `GET /data/:key` - Obtiene datos con cache

---

## 🐘 05-postgres-api

### Descripción
API REST con PostgreSQL usando FastAPI, enfocada en ORMs y queries avanzadas.

### Stack Tecnológico
- **Runtime**: Python 3.12
- **Framework**: FastAPI + Uvicorn
- **DB**: PostgreSQL 15
- **ORM**: SQLAlchemy

### Inicio Rápido
```bash
cd 05-postgres-api
docker-compose up
```
**Acceso**: http://localhost:8000/docs (Swagger)

### Endpoints
- `GET /items` - Lista items
- `POST /items` - Crear item

---

## 🌐 06-nginx-proxy

### Descripción
Reverse proxy con Nginx para balanceo de carga entre múltiples servicios.

### Stack Tecnológico
- **Servidor**: Nginx (Alpine)
- **Config**: nginx.conf personalizado

### Inicio Rápido
```bash
cd 06-nginx-proxy
docker-compose up
```
**Acceso**: http://localhost:8080

---

## 🐰 07-rabbitmq-messaging

### Descripción
Sistema de mensajería asíncrona con producer/consumer usando RabbitMQ.

### Stack Tecnológico
- **Runtime**: Node.js 18
- **Message Broker**: RabbitMQ 3
- **Cliente**: amqplib

### Inicio Rápido
```bash
cd 07-rabbitmq-messaging
docker-compose up -d
npm run producer
npm run consumer
```
**Management UI**: http://localhost:15672

---

## 📊 08-prometheus-grafana

### Descripción
Stack de monitoreo con métricas de contenedores usando Prometheus y dashboards en Grafana.

### Stack Tecnológico
- **Metrics**: Prometheus
- **Visualization**: Grafana
- **Config**: prometheus.yml

### Inicio Rápido
```bash
cd 08-prometheus-grafana
docker-compose up
```
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

---

## 🔧 09-multi-service-app

### Descripción
Aplicación multi-servicio básica con frontend, backend y base de datos.

### Stack Tecnológico
- **Frontend**: Nginx (HTML simple)
- **Backend**: Node.js + Express
- **DB**: MongoDB

### Inicio Rápido
```bash
cd 09-multi-service-app
docker-compose up
```
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:3000/api

---

## 🐹 10-go-api

### Descripción
API REST ligera construida en Go, enfocada en performance.

### Stack Tecnológico
- **Lenguaje**: Go 1.21
- **Framework**: Built-in net/http

### Inicio Rápido
```bash
cd 10-go-api
docker-compose up
```
**Acceso**: http://localhost:8080

---

## 🔍 11-elasticsearch-search

### Descripción
API de búsqueda usando Elasticsearch para indexación y queries full-text.

### Stack Tecnológico
- **Runtime**: Python 3.12 + FastAPI
- **Search Engine**: Elasticsearch 8

### Inicio Rápido
```bash
cd 11-elasticsearch-search
docker-compose up
```
**Acceso**: http://localhost:8000/docs

---

## 🤖 12-jenkins-ci

### Descripción
Pipeline de CI/CD básico usando Jenkins para automatizar builds y tests.

### Stack Tecnológico
- **CI/CD**: Jenkins LTS
- **Container**: Docker-in-Docker

### Inicio Rápido
```bash
cd 12-jenkins-ci
docker-compose up
```
**Acceso**: http://localhost:8080 (setup inicial requerido)

---

## �📖 Recursos Relacionados

- 🎓 [Guía para Principiantes](BEGINNERS_GUIDE.md) - Cómo empezar
- 📚 [Manual de Usuario](USER_MANUAL.md) - Uso avanzado
- 🏗️ [Arquitectura](ARCHITECTURE.md) - Diseño técnico
- 🔧 [Troubleshooting](TROUBLESHOOTING.md) - Solución de problemas

---

← [Volver al README](../README.md)
