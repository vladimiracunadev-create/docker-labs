# Seguridad — Docker Labs

> **Versión**: 1.6.0
> **Scope**: Control Center, labs y configuración general del workspace

---

## Modelo de seguridad

Este repositorio es un entorno de aprendizaje local. Las medidas implementadas
protegen contra los vectores más comunes en entornos de desarrollo compartido o
expuesto a red local, sin añadir fricción operativa innecesaria.

---

## Control Center (`dashboard-control`)

### CORS restringido

El servidor solo acepta peticiones desde `http://localhost:{DASHBOARD_PORT}` y
`http://127.0.0.1:{DASHBOARD_PORT}`. Cualquier origen externo recibe un header
CORS con origen explícito, no comodín (`*`).

### Autenticación por token (opcional)

Por defecto el dashboard es de acceso local abierto. Para activar protección:

```bash
# Linux / macOS
export DASHBOARD_TOKEN=tu-token-secreto
./scripts/start-control-center.sh

# Windows
set DASHBOARD_TOKEN=tu-token-secreto
scripts\start-control-center.cmd
```

El token se envía en cada request de la API:

- Header: `Authorization: Bearer <token>`
- Cookie: `dashboard_token=<token>`

Sin `DASHBOARD_TOKEN` configurado el comportamiento es idéntico al anterior
(acceso abierto — modo desarrollo local).

### Validación de labId

Todos los endpoints `/api/labs/:labId/*` validan que el ID:

1. Solo contenga caracteres `[a-zA-Z0-9_-]`
2. Corresponda a un lab conocido en `labs.config.json`

Esto previene path traversal e inyección de comandos en llamadas a Docker Compose.

### Límite de body en requests

Los requests POST tienen un límite de **10 KB**. Cualquier cuerpo mayor es
rechazado con HTTP 400 antes de ser procesado.

### Logging de errores sin exposición de internals

Los errores de servidor se registran en `stderr` con timestamp y detalle
completo. La respuesta al cliente incluye solo un mensaje genérico — nunca
`stderr` de Docker, paths internos ni stack traces.

---

## Labs — credenciales

Todos los labs con credenciales usan variables de entorno con valores por defecto
seguros para desarrollo local. Para entornos expuestos a red, copia el
`.env.example` de cada lab como `.env` y cambia los valores:

| Lab | Archivo | Variables |
|---|---|---|
| `02-php-lamp` | `.env.example` | `DB_NAME`, `DB_USER`, `DB_PASS`, `DB_ROOT` |
| `05-postgres-api` | `.env.example` | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` |
| `07-rabbitmq-messaging` | `.env.example` | `RABBITMQ_DEFAULT_USER`, `RABBITMQ_DEFAULT_PASS` |
| `08-prometheus-grafana` | `.env.example` | `GF_SECURITY_ADMIN_USER`, `GF_SECURITY_ADMIN_PASSWORD` |

Los archivos `.env` están en `.gitignore` — nunca se commitean al repositorio.

---

## Sanitización XSS en el frontend

`dashboard.js` sanitiza todo el contenido que proviene de la configuración de
labs antes de insertarlo en el DOM via `innerHTML`:

- `sanitizeText(str)` — escapa `&`, `<`, `>`, `"`, `'`
- `sanitizeUrl(url)` — solo permite URLs `http://` y `https://`

---

## Contenedores no-root

Todos los Dockerfiles con imagen `build local` ejecutan el proceso principal
como usuario no-root:

| Lab | Usuario | Imagen base |
|---|---|---|
| `01-node-api` | `node` (uid 1000) | `node:20-alpine` |
| `03-python-api` | `appuser` (sistema) | `python:3.12-slim` |
| `04-redis-cache` | `node` (uid 1000) | `node:20-alpine` |
| `05-postgres-api` | `appuser` (sistema) | `python:3.12-slim` |
| `09-multi-service-app/backend` | `node` (uid 1000) | `node:20-alpine` |
| `10-go-api` | `appuser` (Alpine) | `alpine:latest` |
| `11-elasticsearch-search` | `appuser` (sistema) | `python:3.12-slim` |
| `dashboard-control` | `node` + grupo `docker` | `node:20-alpine` |

---

## Docker socket

El contenedor del Control Center monta `/var/run/docker.sock` para ejecutar
comandos Docker Compose. Este es un privilegio elevado inherente al diseño del
panel de control. Mitigaciones:

- El contenedor no corre como root en versiones con `user:` directive configurado
- El acceso al socket está acotado al servidor Node.js que valida todos los inputs
- No se expone el socket directamente a la red

---

## Recomendaciones para entornos compartidos

1. Activar `DASHBOARD_TOKEN` si hay más de una persona con acceso a la red local
2. Cambiar todas las credenciales por defecto antes de exponer cualquier lab
3. No exponer el puerto `9090` fuera de la máquina local sin VPN o reverse proxy con TLS
4. Usar `docker network` con subredes específicas si los labs no necesitan comunicarse

---

## Documentos relacionados

- [DASHBOARD_SETUP.md](DASHBOARD_SETUP.md)
- [INSTALL.md](INSTALL.md)
- [../labs.config.json](../labs.config.json)
