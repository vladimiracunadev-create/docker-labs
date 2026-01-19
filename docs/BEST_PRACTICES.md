# Mejores Prácticas 🎯

Guía de mejores prácticas para Docker y desarrollo con contenedores en **docker-labs**.

---

## 🐳 Dockerfile: Mejores Prácticas

### 1. Usa Imágenes Base Específicas

❌ **Evitar**:
```dockerfile
FROM node:latest
```

✅ **Mejor**:
```dockerfile
FROM node:18.16-alpine
```

**Razón**: `latest` cambia sin aviso, causando builds inconsistentes.

---

### 2. Ordena las Capas Inteligentemente

❌ **Ineficiente**:
```dockerfile
FROM node:18-alpine
COPY . .
RUN npm install
```

✅ **Optimizado**:
```dockerfile
FROM node:18-alpine
WORKDIR /app

# Primero deps (cambian menos)
COPY package*.json ./
RUN npm install

# Luego código (cambia más)
COPY . .
```

**Razón**: Docker cachea capas. Si el código cambia, solo se reconstruyen las capas posteriores.

---

### 3. Multi-Stage Builds

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["node", "dist/index.js"]
```

**Beneficios**:
- Imagen final más pequeña
- Sin herramientas de build en producción
- Mayor seguridad

---

### 4. Minimiza el Número de Capas

❌ **Múltiples RUN**:
```dockerfile
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
```

✅ **Un RUN combinado**:
```dockerfile
RUN apt-get update && apt-get install -y \
    curl \
    git \
 && rm -rf /var/lib/apt/lists/*
```

---

### 5. Usa .dockerignore

**Crea `.dockerignore`**:
```
node_modules
npm-debug.log
.git
.env
*.md
.vscode
.idea
```

**Beneficios**:
- Contexto de build más rápido
- Imágenes más pequeñas
- No incluir secretos accidentalmente

---

### 6. Ejecuta como Usuario No-Root

❌ **Por defecto (root)**:
```dockerfile
# Corre como root (UID 0)
CMD ["npm", "start"]
```

✅ **Usuario específico**:
```dockerfile
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

USER appuser
CMD ["npm", "start"]
```

**Razón**: Seguridad por defensa en profundidad.

---

## 📦 docker-compose.yml: Mejores Prácticas

### 1. Usa Variables de Entorno

❌ **Hardcoded**:
```yaml
environment:
  - DB_PASSWORD=mysecretpass123
```

✅ **Con .env**:
```yaml
environment:
  - DB_PASSWORD=${DB_PASSWORD}
```

---

### 2. Define Versiones Específicas

❌ **Sin versión**:
```yaml
services:
  db:
    image: postgres
```

✅ **Con versión**:
```yaml
services:
  db:
    image: postgres:14.7-alpine
```

---

### 3. Usa depends_on para Orden

```yaml
services:
  web:
    # ...
    depends_on:
      - db
  db:
    # ...
```

**Nota**: `depends_on` solo espera que el contenedor inicie, no que esté "listo". Para esperar hasta que la BD acepte conexiones, usa herramientas como `wait-for-it`.

---

### 4. Nombra Volúmenes Explícitamente

❌ **Volumen anónimo**:
```yaml
volumes:
  - /var/lib/mysql
```

✅ **Named volume**:
```yaml
volumes:
  - db-data:/var/lib/mysql

volumes:
  db-data:
```

---

### 5. Limita Recursos (Producción)

```yaml
services:
  web:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

---

### 6. Health Checks

```yaml
services:
  web:
    image: myapp
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

## 🔐 Seguridad

### 1. No Expongas Puertos Innecesarios

❌ **Exponer BD públicamente**:
```yaml
db:
  ports:
    - "3306:3306"  # ⚠️ Accesible desde internet
```

✅ **Solo red interna**:
```yaml
db:
  # Sin 'ports', solo accesible desde otros contenedores
  expose:
    - "3306"
```

---

### 2. Usa Secrets para Contraseñas (Swarm/K8s)

```yaml
services:
  db:
    image: postgres
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

---

### 3. Mantén Imágenes Actualizadas

```bash
# Revisa vulnerabilidades
docker scan myapp:latest

# Actualiza imágenes base regularmente
docker pull postgres:14.7-alpine
docker-compose build
```

---

### 4. No Guardes Secretos en Imágenes

❌ **MAL**:
```dockerfile
COPY .env .
# La imagen contiene el .env con secretos
```

✅ **BIEN**:
```yaml
# docker-compose.yml
environment:
  - API_KEY=${API_KEY}  # Inyectado en runtime
```

---

## 🚀 Performance

### 1. Usa Alpine Linux Cuando Sea Posible

```dockerfile
# ~900 MB
FROM node:18

# ~180 MB
FROM node:18-alpine
```

**Beneficios**:
- Builds más rápidos
- Menos superficie de ataque
- Menor uso de disco

---

### 2. Aprovecha el Caché de Build

```dockerfile
# ✅ Package.json cambia menos que el código
COPY package*.json ./
RUN npm install

COPY . .
```

**Resultado**: Reinstalar deps solo cuando cambien.

---

### 3. Bind Mounts en Desarrollo, Volumes en Producción

**Desarrollo**:
```yaml
volumes:
  - ./src:/app/src  # Edición en tiempo real
```

**Producción**:
```yaml
volumes:
  - app-data:/app/data  # Performance nativo
```

---

### 4. Limpia Regularmente

```bash
# Semanal o mensual
docker system prune

# Con imágenes
docker system prune -a
```

---

## 📁 Organización de Proyectos

### Estructura Recomendada

```
proyecto/
├── docker-compose.yml       # Orquestación
├── .env.example             # Template
├── .dockerignore            # Exclusiones
├── .gitignore               # Git exclusiones
├── README.md                # Documentación
├── services/
│   ├── web/
│   │   ├── Dockerfile
│   │   └── src/
│   └── api/
│       ├── Dockerfile
│       └── app/
└── scripts/
    ├── init-db.sql
    └── seed-data.sh
```

---

## 🔄 Desarrollo con Git

### .gitignore Esencial

```
# Dependencias
node_modules/
vendor/
__pycache__/

# Configuración local
.env

# Datos de Docker
data/
logs/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

---

### .env.example

```env
# Database
DB_HOST=db
DB_NAME=mydb
DB_USER=user
DB_PASS=change-me-in-production

# App
NODE_ENV=development
API_KEY=your-key-here
```

**Uso**:
```bash
cp .env.example .env
# Edita .env con valores reales
```

---

## 🧪 Testing

### Tests en Contenedor

```yaml
# docker-compose.test.yml
services:
  test:
    build: .
    command: npm test
    environment:
      - NODE_ENV=test
    depends_on:
      - db-test
  
  db-test:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: test_db
```

**Ejecutar**:
```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

---

## 🌍 Desarrollo Local vs Producción

### Archivos Separados

```yaml
# docker-compose.yml (desarrollo)
services:
  web:
    build: .
    volumes:
      - ./src:/app/src  # Hot reload
    environment:
      - NODE_ENV=development

# docker-compose.prod.yml (producción)
services:
  web:
    image: myregistry/web:v1.0.0
    restart: always
    environment:
      - NODE_ENV=production
```

**Uso en producción**:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 📊 Logging

### Centraliza Logs

```yaml
services:
  web:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

### Usa stdout/stderr

```javascript
// ✅ BIEN: Imprime a stdout
console.log('Server started');

// ❌ Evita escribir a archivos dentro del contenedor
fs.writeFileSync('/app/log.txt', 'message');
```

**Razón**: Docker captura stdout/stderr automáticamente.

---

## 🔧 CI/CD

### GitHub Actions Ejemplo

```yaml
name: Build and Test

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: docker-compose build
      - name: Test
        run: docker-compose run web npm test
```

---

## ⚡ Quick Tips

### 1. Alias Útiles

```bash
# ~/.bashrc o ~/.zshrc
alias dcu='docker-compose up'
alias dcd='docker-compose down'
alias dcb='docker-compose build'
alias dcl='docker-compose logs -f'
alias dps='docker ps'
```

---

### 2. Restart Policies

```yaml
services:
  web:
    restart: unless-stopped  # Reinicia siempre excepto si lo paras manualmente
```

Opciones:
- `no`: No reinicia (default)
- `always`: Siempre reinicia
- `on-failure`: Solo si falla
- `unless-stopped`: Siempre excepto si se detuvo manualmente

---

### 3. Usa BuildKit

```bash
# Habilitar BuildKit (builds paralelos, más rápidos)
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

docker-compose build
```

---

### 4. Debugging con override

```yaml
# docker-compose.override.yml (git-ignored)
services:
  web:
    command: npm run debug
    ports:
      - "9229:9229"  # Node debugger
```

**Auto-merged** por docker-compose.

---

## 📚 Recursos Adicionales

- 🐳 [Docker Best Practices (Oficial)](https://docs.docker.com/develop/dev-best-practices/)
- 📖 [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- 🔐 [Docker Security](https://docs.docker.com/engine/security/)
- 🚀 [12-Factor App](https://12factor.net/)

---

## 🎓 Siguiente Nivel

Una vez domines estas prácticas:
- Aprende **Kubernetes** para orquestación a escala
- Explora **Docker Swarm** para clusters simples
- Usa **Helm** para Kubernetes
- Implementa **service mesh** (Istio, Linkerd)

---

← [Volver al README](../README.md)
