# Auditoría técnica — Docker Labs

> **Fecha**: 2026-03-15
> **Auditor**: Revisión de arquitectura senior (previa a la implementación de la capa Windows)
> **Estado**: Problemas resueltos — ver registro de correcciones más abajo

---

## Objetivo

Antes de agregar la capa de distribución Windows, esta auditoría inspeccionó el estado
completo del repositorio para detectar inconsistencias, conflictos de puertos, valores
hardcodeados y problemas estructurales. Todos los hallazgos críticos fueron corregidos
antes de implementar la nueva funcionalidad.

---

## Hallazgos y correcciones

### CRÍTICO-01 — Ruta del autor hardcodeada en `dashboard-control/docker-compose.yml`

**Hallazgo**
`DOCKER_REPO_ROOT` estaba hardcodeado a `/run/desktop/mnt/host/c/docker-labs/docker-labs`,
una ruta específica de la máquina del autor del repositorio. El volumen también estaba
hardcodeado como `..:/run/desktop/mnt/host/c/docker-labs/docker-labs`.

**Impacto**
Cualquier usuario que clonara el repo en una ruta diferente, o en Linux/macOS, obtendría
rutas incorrectas en docker compose. El Control Center iniciaba pero fallaba al administrar
los labs individuales.

**Corrección aplicada**
- Cambiado `DOCKER_REPO_ROOT` a `${DOCKER_REPO_ROOT:-/workspace}` en el compose
- Eliminado el segundo montaje de volumen hardcodeado
- Actualizado `scripts/start-control-center.cmd` para calcular `DOCKER_REPO_ROOT`
  dinámicamente usando conversión de rutas con PowerShell
- El nuevo launcher Go también calcula este valor automáticamente

**Archivos modificados**
- `dashboard-control/docker-compose.yml`
- `scripts/start-control-center.cmd`

---

### CRÍTICO-02 — Conflicto de puerto: `08-prometheus-grafana` vs Control Center (puerto 9090)

**Hallazgo**
`08-prometheus-grafana/docker-compose.yml` mapeaba Prometheus al puerto del host `9090:9090`.
El Control Center también usa el puerto 9090. Ejecutar ambos simultáneamente causaba un
conflicto de bind.

Además, `dashboard-control/labs.js` mostraba la URL de Prometheus como
`http://localhost:9090`, que apuntaba al propio Control Center — no a Prometheus.

**Impacto**
Iniciar el lab 08 mientras el Control Center estaba corriendo fallaba con "puerto en uso".
El enlace del dashboard para Prometheus era incorrecto y abría el Control Center.

**Corrección aplicada**
- Cambiado el puerto del host de Prometheus de `9090:9090` a `9091:9090` en `08-prometheus-grafana/docker-compose.yml`
- Actualizada la URL de Prometheus en `dashboard-control/labs.js` a `http://localhost:9091`

**Archivos modificados**
- `08-prometheus-grafana/docker-compose.yml`
- `dashboard-control/labs.js`

---

### CRÍTICO-03 — Conflicto de puerto: `11-elasticsearch-search` vs `05-postgres-api` (puerto 8000)

**Hallazgo**
`11-elasticsearch-search/docker-compose.yml` mapeaba su API al puerto del host `8000:8000`.
`05-postgres-api` (Inventory Core) también usa el puerto 8000 y es el punto de entrada
principal de la plataforma.

`dashboard-control/labs.js` listaba la URL de la API de `11-elasticsearch-search` como
`http://localhost:8000`, creando un enlace incorrecto que apuntaba al Inventory Core.

**Impacto**
Iniciar el lab 11 mientras el Inventory Core estaba corriendo fallaba con "puerto en uso".
El enlace del dashboard para la API de Elasticsearch era incorrecto.

**Corrección aplicada**
- Cambiado el puerto del host de la API de Elasticsearch de `8000:8000` a `8001:8000` en `11-elasticsearch-search/docker-compose.yml`
- Actualizada la URL de la API de Elasticsearch en `dashboard-control/labs.js` a `http://localhost:8001`
- Actualizada la URL de health a `http://localhost:8001/health`

**Archivos modificados**
- `11-elasticsearch-search/docker-compose.yml`
- `dashboard-control/labs.js`

---

### MEDIO-01 — `docker-labs-v1.0.0.zip` incluido en la raíz del repositorio

**Hallazgo**
Un archivo ZIP de release (`docker-labs-v1.0.0.zip`) estaba presente en la raíz del
repositorio — un artefacto de release que nunca debe ser versionado.

**Impacto**
Aumenta innecesariamente el tamaño del repositorio. Viola la estrategia de distribución
donde los artefactos de release se publican via GitHub Releases, no se incluyen en el repo.

**Corrección aplicada**
- Agregado `docker-labs-*.zip` a `.gitignore`

**Acción manual requerida**
Eliminar `docker-labs-v1.0.0.zip` del historial de versiones si se desea:
```bash
git rm --cached docker-labs-v1.0.0.zip
git commit -m "Remove release artifact from repo (use GitHub Releases)"
```

**Archivos modificados**
- `.gitignore`

---

### MEDIO-02 — `Makefile` referenciaba la arquitectura legacy del dashboard

**Hallazgo**
El Makefile referenciaba `docker-compose-dashboard.yml` y
`docker-compose-dashboard-simple.yml` — el enfoque de dashboard monolítico más antiguo
que ha sido reemplazado por `dashboard-control/`. Comandos como `make up-dashboard`
ya no representaban el punto de entrada real del workspace.

**Impacto**
Los desarrolladores que usaran `make` levantarían el stack incorrecto. El quickstart
actual es `scripts/start-control-center.cmd` o `docker compose -f dashboard-control/docker-compose.yml up`.

**Corrección aplicada**
- Reescrito el `Makefile` para usar `dashboard-control/docker-compose.yml` como punto de entrada actual
- Agregados targets `start`, `stop`, `status`
- Agregados targets `build-launcher` y `build-installer` para la capa de packaging Windows
- Compatibilidad CI preservada (los archivos compose anteriores siguen siendo probados por `ci.yml`)

**Archivos modificados**
- `Makefile`

---

### MEDIO-03 — `.gitignore` sin patrones para artefactos de packaging y launcher

**Hallazgo**
`.gitignore` no cubría:
- `docker-labs-*.zip` (archivos de release)
- `docker-labs-setup-*.exe` (binarios del instalador)
- `packaging/staging/`
- `launcher/go.sum` y `launcher/docker-labs-launcher.exe`

**Corrección aplicada**
Se agregaron todas las entradas faltantes a `.gitignore`.

**Archivos modificados**
- `.gitignore`

---

## Mapa de puertos — Post-auditoría (Verificado, sin conflictos)

| Puerto | Lab / Servicio | Rol |
|--------|----------------|-----|
| 9090 | Control Center | Principal |
| 8000 | 05-postgres-api (Core) | Plataforma |
| 8083 | 09-multi-service-app | Plataforma |
| 8085 | 06-nginx-proxy (Gateway) | Plataforma |
| 3000 | 01-node-api | Starter |
| 5000 | 03-python-api | Starter |
| 3001 | 04-redis-cache | Infra |
| 8081 | 02-php-lamp (web) | Starter |
| 8082 | 02-php-lamp (phpmyadmin) | Starter |
| 9091 | 08-prometheus-grafana | Infra |
| 3002 | 08-grafana | Infra |
| 3003 | 09-backend API | Plataforma |
| 8084 | 10-go-api | Starter |
| 8001 | 11-elasticsearch-search | Infra |
| 9200 | 11-elasticsearch | Infra |
| 8080 | 12-jenkins-ci | Infra |
| 15672 | 07-rabbitmq management | Infra |
| 5432 | 05-postgres-api DB | Plataforma |

---

## Notas de arquitectura

### DOCKER_REPO_ROOT — diseño de doble ruta

El Control Center corre dentro de Docker pero necesita invocar comandos `docker compose`
para otros labs. Esto crea un desafío de resolución de rutas:

1. Dentro del contenedor, los archivos están en `/workspace` (via montaje de volumen)
2. El daemon de Docker del host recibe las rutas de los archivos compose como argumentos
3. En Windows + Docker Desktop, el daemon del host vive en una VM LinuxKit
   donde las unidades de Windows están en `/run/desktop/mnt/host/<unidad>/...`

**Solución**: `DOCKER_REPO_ROOT` se establece a la ruta del lado del host antes de iniciar
el contenedor. El script `start-control-center.cmd` y el launcher Go la calculan dinámicamente.

En Linux/macOS con Docker nativo, `DOCKER_REPO_ROOT` equivale a la ruta real del host
(por ejemplo, `/home/usuario/docker-labs`).

---

## Archivos legados

Los siguientes archivos permanecen en el repositorio por compatibilidad retroactiva y
pruebas de CI, pero representan un enfoque arquitectónico anterior:

| Archivo | Rol | Notas |
|---------|-----|-------|
| `docker-compose-dashboard.yml` | Dashboard monolítico legado | Todavía probado en CI |
| `docker-compose-dashboard-simple.yml` | Variante simplificada | Todavía probado en CI |
| `nginx-dashboard.conf` | Configuración nginx para dashboard legado | Requerido por el compose legado |
| `nginx-proxy-dashboard.conf` | Configuración nginx proxy | Requerido por el compose legado |
| `prometheus-dashboard.yml` | Configuración Prometheus para el legado | Requerido por el compose legado |

Estos archivos no afectan la arquitectura principal de `dashboard-control/`.

---

## Documentos relacionados con esta auditoría

- [docs/windows-installer.md](windows-installer.md)
- [docs/github-releases-distribution.md](github-releases-distribution.md)
- [DEVELOPING.md](../DEVELOPING.md)
- [RUNBOOK.md](../RUNBOOK.md)
