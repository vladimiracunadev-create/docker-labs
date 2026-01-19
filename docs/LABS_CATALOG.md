# Catálogo de Laboratorios 📋

Referencia completa de todos los laboratorios disponibles en **docker-labs**.

---

## 📊 Vista General

| Laboratorio | Stack | Puerto(s) | Objetivo | BD | Complejidad |
|-------------|-------|-----------|----------|-------|-------------|
| [node-api](#-node-api) | Node.js 18 + Express | 3000 | API REST básica | ❌ No | ⭐ Básico |
| [php-lamp](#-php-lamp) | PHP 8.1 + Apache + MariaDB | 8080, 8081 | CRUD clásico LAMP | ✅ MariaDB | ⭐⭐ Intermedio |
| [python-api](#-python-api) | Python 3.10 + Flask | 5000 | API REST Python | ❌ No | ⭐ Básico |

---

## 🟢 node-api

### Descripción

API REST básica construida con **Node.js** y **Express**, ideal para aprender los fundamentos de desarrollo de APIs con contenedores.

### Stack Tecnológico

- **Runtime**: Node.js 18 (Alpine Linux)
- **Framework**: Express 4.x
- **Dev Tools**: Nodemon (hot reload)
- **Package Manager**: npm

### Estructura de Archivos

```
node-api/
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
cd node-api
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

## 🐘 php-lamp

### Descripción

Stack LAMP completo (**Linux, Apache, MariaDB, PHP**) para desarrollo de aplicaciones web clásicas con base de datos relacional.

### Stack Tecnológico

- **Web Server**: Apache 2.4
- **PHP**: 8.1 (con extensiones: mysqli, pdo)
- **Database**: MariaDB 10.6
- **Admin Tool**: phpMyAdmin (última versión)

### Estructura de Archivos

```
php-lamp/
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
cd php-lamp
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
docker cp dump.sql php-lamp-db-1:/dump.sql
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

## 🐍 python-api

### Descripción

API REST construida con **Python** y **Flask**, perfecta para aprender desarrollo backend con Python en un entorno dockerizado.

### Stack Tecnológico

- **Runtime**: Python 3.10 (Alpine Linux)
- **Framework**: Flask 2.x
- **WSGI**: Development server (Flask built-in)
- **Package Manager**: pip

### Estructura de Archivos

```
python-api/
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
cd python-api
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
- → `node-api` o `python-api` (1 servicio, simple)

**Si necesitas base de datos**:
- → `php-lamp` (stack completo)

**Si prefieres JavaScript**:
- → `node-api`

**Si prefieres Python**:
- → `python-api`

**Si vienes de desarrollo web tradicional**:
- → `php-lamp` (similar a XAMPP/WAMP)

---

## 📖 Recursos Relacionados

- 🎓 [Guía para Principiantes](BEGINNERS_GUIDE.md) - Cómo empezar
- 📚 [Manual de Usuario](USER_MANUAL.md) - Uso avanzado
- 🏗️ [Arquitectura](ARCHITECTURE.md) - Diseño técnico
- 🔧 [Troubleshooting](TROUBLESHOOTING.md) - Solución de problemas

---

← [Volver al README](../README.md)
