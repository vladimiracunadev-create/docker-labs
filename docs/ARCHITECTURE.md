# Arquitectura 🏗️

Documentación técnica sobre el diseño y arquitectura de **docker-labs**.

---

## 🎯 Filosofía de Diseño

docker-labs sigue tres principios fundamentales:

1. **🔗 Independencia Modular**: Cada laboratorio puede funcionar de forma aislada
2. **📦 Separación de Responsabilidades**: Código (host) / Runtime (contenedor) / Datos (volúmenes)
3. **🎓 Aprendizaje Progresivo**: De básico a avanzado

---

## 🗂️ Estructura General del Repositorio

```mermaid
graph TD
    A[docker-labs] --> B[docs/]
    A --> C[node-api/]
    A --> D[php-lamp/]
    A --> E[python-api/]
    
    B --> B1[Guías para usuarios]
    B --> B2[Documentación técnica]
    
    C --> C1[Dockerfile]
    C --> C2[docker-compose.yml]
    C --> C3[Código fuente]
    
    D --> D1[docker-compose.yml]
    D --> D2[docker/ configs]
    D --> D3[Código fuente]
    
    E --> E1[Dockerfile]
    E --> E2[docker-compose.yml]
    E --> E3[Código fuente]
    
    style A fill:#2196F3,color:#fff
    style B fill:#4CAF50,color:#fff
    style C fill:#FF9800,color:#fff
    style D fill:#9C27B0,color:#fff
    style E fill:#F44336,color:#fff
```

---

## 🧩 Capas de Arquitectura

### Capa 1: Host (Tu máquina)

```
┌─────────────────────────────────────┐
│         Sistema Operativo           │
│  (Windows / macOS / Linux)          │
│                                     │
│  ├── Docker Engine                  │
│  ├── Código fuente (git clone)     │
│  └── Editor (VS Code)               │
└─────────────────────────────────────┘
```

**Responsabilidades**:
- Almacenar el código fuente
- Ejecutar Docker Engine
- Editar archivos

---

### Capa 2: Docker (Contenedores)

```
┌─────────────────────────────────────┐
│        Docker Engine                │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │Container │  │Container │        │
│  │  Web     │  │   DB     │        │
│  └──────────┘  └──────────┘        │
│       ↓              ↓              │
│  ┌──────────────────────┐          │
│  │  Docker Network      │          │
│  └──────────────────────┘          │
└─────────────────────────────────────┘
```

**Responsabilidades**:
- Ejecutar aplicaciones aisladas
- Gestionar redes entre contenedores
- Mapear puertos y volúmenes

---

### Capa 3: Volúmenes (Persistencia)

```
┌─────────────────────────────────────┐
│      Docker Volumes                 │
│                                     │
│  ├── db-data (MariaDB)              │
│  ├── bind mounts (código)           │
│  └── named volumes (logs)           │
└─────────────────────────────────────┘
```

**Responsabilidades**:
- Persistir datos de bases de datos
- Sincronizar código en tiempo real
- Almacenar archivos generados

---

## 🟢 Arquitectura: node-api

### Diagrama de Componentes

```mermaid
flowchart LR
    A[Browser] -->|HTTP :3000| B[Docker Network]
    B --> C[Node Container]
    C --> D[Express App]
    D --> E[src/index.js]
    
    F[Host: node-api/] -.->|bind mount| E
    
    style C fill:#68a063,color:#fff
    style D fill:#303030,color:#fff
    style F fill:#f0db4f,color:#000
```

### docker-compose.yml

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
    environment:
      - NODE_ENV=development
```

### Flujo de Datos

1. **Editas** `src/index.js` en tu máquina (host)
2. **Bind mount** sincroniza el archivo al contenedor inmediatamente
3. **Nodemon** detecta el cambio y reinicia el servidor
4. **Browser** recibe la respuesta actualizada en `:3000`

### Responsabilidades

| Componente | Responsabilidad |
|------------|-----------------|
| Dockerfile | Definir imagen base (Node 18) + deps |
| docker-compose | Levantar servicio + puertos + volúmenes |
| src/ | Código fuente de la aplicación |
| package.json | Dependencias npm |

---

## 🐘 Arquitectura: php-lamp

### Diagrama de Componentes

```mermaid
flowchart TB
    A[Browser] -->|:8080| B[Apache + PHP Container]
    A -->|:8081| C[phpMyAdmin Container]
    
    B --> D[MariaDB Container]
    C --> D
    
    E[Host: src/] -.->|bind mount| B
    D --> F[(db-data volume)]
    
    style B fill:#777bb3,color:#fff
    style C fill:#6c78af,color:#fff
    style D fill:#003545,color:#fff
    style F fill:#f39c12,color:#fff
```

### docker-compose.yml

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
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: testdb
    volumes:
      - db-data:/var/lib/mysql
  
  phpmyadmin:
    image: phpmyadmin:latest
    ports:
      - "8081:80"

volumes:
  db-data:
```

### Flujo de Datos

1. **Browser** → `:8080` → **Apache** procesa PHP
2. **PHP** → conecta a **MariaDB** (`db:3306`)
3. **MariaDB** → lee/escribe en volumen `db-data`
4. **phpMyAdmin** → gestiona BD visualmente (`:8081`)

### Responsabilidades

| Componente | Responsabilidad |
|------------|-----------------|
| docker/Dockerfile | Imagen PHP + extensiones |
| docker-compose.yml | Orquestar 3 servicios |
| src/ | Código PHP de la aplicación |
| db-data (volume) | Persistir datos de MariaDB |

---

## 🐍 Arquitectura: python-api

### Diagrama de Componentes

```mermaid
flowchart LR
    A[Browser] -->|HTTP :5000| B[Docker Network]
    B --> C[Python Container]
    C --> D[Flask App]
    D --> E[app/main.py]
    
    F[Host: app/] -.->|bind mount| E
    
    style C fill:#3776ab,color:#fff
    style D fill:#000,color:#fff
    style F fill:#ffd343,color:#000
```

### docker-compose.yml

```yaml
services:
  web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./app:/app
    environment:
      - FLASK_ENV=development
      - FLASK_DEBUG=1
```

### Flujo de Datos

1. **Editas** `app/main.py` en tu máquina
2. **Bind mount** sincroniza al contenedor
3. **Flask debug mode** recarga automáticamente
4. **Browser** ve cambios en `:5000`

### Responsabilidades

| Componente | Responsabilidad |
|------------|-----------------|
| Dockerfile | Imagen Python 3.10 + pip install |
| docker-compose | Levantar servicio con debug |
| app/ | Código Flask |
| requirements.txt | Dependencias Python |

---

## 🌐 Redes Docker

Cada `docker-compose.yml` crea una red privada automáticamente:

```
┌──────────────────────────────┐
│  docker-labs_default network │
│                              │
│  ┌─────────┐  ┌─────────┐   │
│  │   web   │  │   db    │   │
│  │ :3000   │  │ :3306   │   │
│  └─────────┘  └─────────┘   │
│       ↕            ↕         │
└───────┼────────────┼─────────┘
        │            │
        ↓            ↓
   localhost:3000  (no expuesto)
```

**Características**:
- Los contenedores se ven entre sí por **nombre de servicio**
- Comunicación interna por puertos nativos (3306, 80, etc.)
- Solo los puertos mapeados son accesibles desde el host

---

## 📦 Gestión de Volúmenes

### Bind Mounts (Desarrollo)

```yaml
volumes:
  - ./src:/var/www/html  # Host → Contenedor
```

**Ventajas**:
- Edición en tiempo real
- Fácil debugging
- No pierdes el código al destruir contenedor

**Desventajas**:
- Performance en Windows/macOS (solución: WSL2)

---

### Named Volumes (Datos)

```yaml
volumes:
  - db-data:/var/lib/mysql

volumes:
  db-data:
```

**Ventajas**:
- Persistencia garantizada
- Performance nativa
- Gestionados por Docker

**Desventajas**:
- No están en el host directamente
- Requieren `docker volume rm` para eliminar

---

## 🔀 Patrones de Diseño Aplicados

### 1. Separation of Concerns

```
Presentación  → Apache/Nginx/Express
Lógica        → PHP/Node/Python
Datos         → MariaDB/MySQL/PostgreSQL
```

### 2. Configuration as Code

Todo está en archivos versionables:
- `Dockerfile` → Imagen
- `docker-compose.yml` → Orquestación
- `.env` → Variables sensibles (gitignore)

### 3. Immutable Infrastructure

Las imágenes son **inmutables**:
- Cambios en deps → `docker-compose build`
- Cambios en código → Hot reload (bind mount)

---

## 🔐 Seguridad por Capas

1. **Network Isolation**: Servicios en red privada
2. **Port Mapping**: Solo exponemos lo necesario
3. **Environment Variables**: Secretos en `.env` (no en repo)
4. **User Permissions**: Contenedores no corren como root (best practice)

---

## 🚀 Escalabilidad (Conceptual)

Aunque estos labs son para desarrollo local, la arquitectura permite escalar:

```bash
# Escalar servicio web a 3 réplicas
docker-compose up --scale web=3
```

Con un load balancer (Nginx/Traefik), podrías distribuir tráfico.

---

## 📊 Diagrama General de Interacciones

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Host as Host Machine
    participant Docker as Docker Engine
    participant Container as Container
    participant Volume as Volume
    
    Dev->>Host: git clone
    Dev->>Host: Edita código
    Host->>Docker: docker-compose up
    Docker->>Container: Crea contenedor
    Docker->>Volume: Monta volumen
    Host-->>Container: Bind mount (código)
    Container->>Volume: Escribe datos
    Dev->>Host: http://localhost:3000
    Host->>Container: Proxy request
    Container-->>Host: Response
    Host-->>Dev: Muestra en browser
```

---

## 🎓 Recursos para Profundizar

### Documentación Oficial
- [Docker Architecture](https://docs.docker.com/get-started/overview/)
- [Docker Networking](https://docs.docker.com/network/)
- [Docker Volumes](https://docs.docker.com/storage/volumes/)

### Guías en este repo
- 📋 [Catálogo de Labs](LABS_CATALOG.md) - Detalles de cada laboratorio
- 🔧 [Specs Técnicas](TECHNICAL_SPECS.md) - Versiones y estándares
- 🎯 [Best Practices](BEST_PRACTICES.md) - Mejores prácticas

---

← [Volver al README](../README.md)
