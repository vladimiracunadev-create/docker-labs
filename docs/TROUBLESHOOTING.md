# Troubleshooting 🔧

Guía de solución de problemas comunes en **docker-labs**.

---

## 🐛 Problemas Generales de Docker

### Docker no inicia / "Cannot connect to Docker daemon"

**Síntomas**:
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Soluciones**:

**Windows/macOS**:
1. Verifica que Docker Desktop esté corriendo
2. Busca el icono de Docker en la bandeja del sistema
3. Si no está, abre Docker Desktop desde el menú de inicio

**Linux**:
```bash
# Inicia el servicio Docker
sudo systemctl start docker

# Habilita inicio automático
sudo systemctl enable docker

# Verifica estado
sudo systemctl status docker
```

---

### Puerto ya en uso

**Síntomas**:
```
Error starting userland proxy: listen tcp 0.0.0.0:3000: bind: address already in use
```

**Identificar qué está usando el puerto**:

**Linux/macOS**:
```bash
lsof -i :3000
```

**Windows (PowerShell)**:
```powershell
netstat -ano | findstr :3000
```

**Soluciones**:

**Opción 1: Detener el proceso** (si es seguro):
```bash
kill <PID>
```

**Opción 2: Cambiar puerto en docker-compose.yml**:
```yaml
ports:
  - "3001:3000"  # Usa 3001 en lugar de 3000
```

---

### Error: "no space left on device"

**Síntomas**:
```
Error response from daemon: write /var/lib/docker/...: no space left on device
```

**Solución**:

```bash
# Ver uso de espacio
docker system df

# Limpiar contenedores detenidos
docker container prune

# Limpiar imágenes sin usar
docker image prune

# Limpieza completa (⚠️ CUIDADO: elimina TODO lo no usado)
docker system prune -a --volumes
```

---

### Permisos denegados (Linux)

**Síntomas**:
```
Got permission denied while trying to connect to the Docker daemon socket
```

**Solución permanente**:
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Recargar grupos
newgrp docker

# Cerrar sesión y volver a entrar
```

**Solución temporal**:
```bash
sudo docker-compose up
```

---

## 🟢 01-node-api: Problemas Específicos

### Contenedor inicia pero responde 404

**Verificar**:
```bash
# Ver logs
docker-compose logs web

# Verificar que el servidor esté levantado
docker-compose exec web curl localhost:3000
```

**Causa común**: Ruta incorrecta en `src/index.js`

**Solución**:
```javascript
// Verifica que tengas
app.get('/', (req, res) => {
  res.json({ message: "Hello" });
});
```

---

### Los cambios en el código no se reflejan

**Verificar bind mount**:
```yaml
# docker-compose.yml debe tener
volumes:
  - ./src:/app/src
```

**Verificar que nodemon esté corriendo**:
```bash
docker-compose logs web
# Deberías ver: "Starting nodemon..."
```

**Solución**:
```bash
# Reinicia contenedor
docker-compose restart web

# Si no funciona, reconstruye
docker-compose up --build
```

---

### Error: "Cannot find module 'express'"

**Causa**: `node_modules` no instaladas

**Solución**:
```bash
# Reconstruye la imagen
docker-compose build

# Levanta nuevamente
docker-compose up
```

---

## 🐘 02-php-lamp: Problemas Específicos

### No conecta a la base de datos

**Síntomas**:
```
SQLSTATE[HY000] [2002] Connection refused
```

**Verificar que MariaDB esté corriendo**:
```bash
docker-compose ps
# 'db' debe estar 'Up'
```

**Espera 10-15 segundos** tras `docker-compose up` (MariaDB tarda en iniciar)

**Verificar credenciales en .env**:
```bash
cat .env
# Deben coincidir con docker-compose.yml
```

**Prueba de conexión desde contenedor web**:
```bash
docker-compose exec web ping db
```

---

### Access denied for user 'root'@'localhost'

**Causa**: Credenciales incorrectas

**Solución**:
```bash
# 1. Detén todo
docker-compose down -v

# 2. Verifica .env
DB_USER=devuser
DB_PASS=devpass123

# 3. Levanta desde cero
docker-compose up
```

---

### phpMyAdmin: "Cannot connect to MySQL server"

**Verificar que 'db' esté corriendo**:
```bash
docker-compose ps db
```

**Verificar dependencias en docker-compose.yml**:
```yaml
phpmyadmin:
  depends_on:
    - db
```

**Reinicia phpMyAdmin**:
```bash
docker-compose restart phpmyadmin
```

---

### Cambios en PHP no se reflejan

**Apache caché**: Por defecto no cachea

**Verificar bind mount**:
```yaml
volumes:
  - ./src:/var/www/html
```

**Forzar recarga**:
1. Ctrl+F5 en el navegador
2. O reinicia Apache: `docker-compose restart web`

---

## 🐍 03-python-api: Problemas Específicos

### Puerto 5000 ocupado (macOS)

**Causa**: macOS usa puerto 5000 para AirPlay Receiver

**Solución**:

**Opción 1: Cambiar puerto**:
```yaml
# docker-compose.yml
ports:
  - "5001:5000"
```

**Opción 2: Desactivar AirPlay**:
- System Preferences → Sharing → Desmarca "AirPlay Receiver"

---

### ImportError: No module named 'flask'

**Causa**: Dependencias no instaladas

**Solución**:
```bash
# Reconstruye la imagen
docker-compose build

# Levanta
docker-compose up
```

---

### Los cambios no se reflejan

**Verificar debug mode**:
```yaml
# docker-compose.yml
environment:
  - FLASK_DEBUG=1
```

**Verificar bind mount**:
```yaml
volumes:
  - ./app:/app
```

**Reinicia**:
```bash
docker-compose restart web
```

---

## 🌐 Problemas de Red

### Contenedores no se ven entre sí

**Verificar que estén en la misma red**:
```bash
docker network ls
docker network inspect <network-name>
```

**Ping entre servicios**:
```bash
docker-compose exec web ping db
```

**Verificar depends_on**:
```yaml
services:
  web:
    depends_on:
      - db
```

---

### Timeout al intentar conectar a servicio

**Verificar puerto interno** (no el mapeado):
```php
// ❌ MAL
$conn = new mysqli('db', 8080, ...);

// ✅ BIEN
$conn = new mysqli('db', 3306, ...);
```

---

## 💾 Problemas con Volúmenes

### Datos no persisten tras `docker-compose down`

**Causa**: Usaste `-v` flag

```bash
# ⚠️ BORRA VOLÚMENES
docker-compose down -v

# ✅ MANTIENE VOLÚMENES
docker-compose down
```

---

### Error de permisos en volumen

**Síntomas**:
```
Permission denied: '/var/lib/mysql/...'
```

**Linux**:
```bash
# Cambiar ownership
sudo chown -R 1001:1001 ./data
```

**Windows (WSL2)**:
```bash
# Clonar proyecto dentro de WSL2, no en /mnt/c/
cd ~
git clone <repo>
```

---

## 🐌 Performance Lento

### Windows: Lentitud general

**Causa**: Archivos en sistema Windows (NTFS)

**Solución**: Coloca el proyecto dentro de WSL2:
```bash
# Desde Ubuntu en WSL2
cd ~
git clone https://github.com/.../docker-labs.git
code .  # Abre VS Code desde WSL
```

---

### macOS: File watching lento

**Solución temporal**: Reduce el número de archivos observados

**Solución permanente**: Usa [Docker Desktop with virtioFS](https://www.docker.com/blog/speed-boost-achievement-unlocked-on-docker-desktop-4-6-for-mac/)

---

## 🏗️ Problemas de Build

### Build falla: "Unable to locate package"

**Dockerfile con apt-get**:
```dockerfile
# ✅ Siempre actualiza primero
RUN apt-get update && apt-get install -y \
    package-name
```

---

### Build extremadamente lento

**Verificar .dockerignore**:
```
# Debe incluir
node_modules/
.git/
*.log
```

**Usar BuildKit**:
```bash
export DOCKER_BUILDKIT=1
docker-compose build
```

---

### Error: "failed to solve with frontend dockerfile.v0"

**Causa**: Sintaxis Docker nueva no soportada

**Solución**: Actualiza Docker a versión 20.10+

---

## 🔐 Problemas de Seguridad

### Warning: "secrets in environment variables"

**Causa**: Contraseñas hardcodeadas

**Solución**: Usa archivo .env

```yaml
# ❌ MAL
environment:
  - DB_PASS=mypass123

# ✅ BIEN
environment:
  - DB_PASS=${DB_PASS}
```

---

## 🆘 Solución Universal: Reinicio Completo

Cuando todo falla, resetea completamente:

```bash
# 1. Detén y elimina TODO
docker-compose down -v

# 2. Elimina imágenes del proyecto
docker rmi $(docker images -q 'nombre-proyecto*')

# 3. Limpia caché de Docker
docker builder prune

# 4. Reconstruye desde cero
docker-compose build --no-cache

# 5. Levanta
docker-compose up
```

---

## 📊 Debugging Avanzado

### Inspeccionar contenedor

```bash
# Detalles completos (JSON)
docker inspect <container-name>

# Variables de entorno
docker inspect <container-name> | grep -A 20 Env

# Volúmenes montados
docker inspect <container-name> | grep -A 10 Mounts
```

### Logs detallados

```bash
# Todos los logs
docker-compose logs

# Logs en tiempo real
docker-compose logs -f

# Últimas 50 líneas de un servicio
docker-compose logs --tail=50 web

# Logs con timestamps
docker-compose logs -t web
```

### Ejecutar comandos dentro del contenedor

```bash
# Bash interactivo
docker-compose exec web bash

# Verificar instalación
docker-compose exec web node --version

# Ver procesos
docker-compose exec web ps aux

# Ver puertos
docker-compose exec web netstat -tuln
```

---

## 🔍 Herramientas de Diagnóstico

```bash
# Uso de recursos
docker stats

# Uso de espacio
docker system df

# Eventos en tiempo real
docker events

# Versión completa de Docker
docker version

# Información del sistema
docker info
```

---

## 📖 Si Nada Funciona

1. 🔍 **Busca el error exacto en Google**
2. 📋 **Revisa logs completos**: `docker-compose logs`
3. 🐛 **Reporta issue**: [GitHub Issues](https://github.com/vladimiracunadev-create/docker-labs/issues)
4. 📚 **Consulta docs oficiales**: [docs.docker.com](https://docs.docker.com/)
5. 💬 **Comunidad Docker**: [forums.docker.com](https://forums.docker.com/)

---

## 📝 Template de Reporte de Bug

Al crear un issue, incluye:

```markdown
**Descripción del problema**:
[Describe qué no funciona]

**Laboratorio afectado**:
- [ ] 01-node-api
- [ ] 02-php-lamp
- [ ] 03-python-api

**Pasos para reproducir**:
1. Ejecuté `docker-compose up`
2. Abrí http://localhost:3000
3. Vi el error X

**Output de logs**:
```bash
[Pega logs relevantes]
```

**Entorno**:
- OS: [Windows 11 / macOS 13 / Ubuntu 22.04]
- Docker: [24.0.0]
- Docker Compose: [2.15.0]

**Ya intenté**:
- [x] Reiniciar Docker Desktop
- [x] docker-compose down -v && up
- [ ] ...
```

---

← [Volver al README](../README.md)
