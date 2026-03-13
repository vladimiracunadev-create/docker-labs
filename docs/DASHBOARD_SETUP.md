# Dashboard Setup

Guia operativa del `Docker Labs Control Center`.

## Que es

El panel en `9090` es la consola principal del repositorio.

Resuelve cuatro necesidades:

- ver estado real de los labs
- controlar `docker compose` sin ir carpeta por carpeta
- abrir el sistema correcto dentro de cada stack
- estimar si tu equipo y Docker tienen capacidad para levantar mas servicios

## Arquitectura actual

Hoy el panel corre como un contenedor Docker propio.

Componentes:

1. `dashboard-control/docker-compose.yml`
2. `dashboard-control/Dockerfile`
3. `dashboard-control/server.js`
4. `index.html`, `dashboard.js`, `dashboard.css`

## Como funciona

El contenedor del panel:

- expone `9090`
- monta el repositorio para leer archivos y metadata
- incluye `docker cli` y `docker compose`
- usa el socket Docker para inspeccionar y operar los labs

## Inicio rapido

```powershell
scripts\start-control-center.cmd
```

O manualmente:

```powershell
docker compose -f dashboard-control\docker-compose.yml up -d --build
```

## URLs

- `http://localhost:9090`
- `http://localhost:9090/api/overview`
- `http://localhost:9090/api/diagnostics`
- `http://localhost:9090/learning-center.html`

## Que muestra el panel

### Overview

- labs registrados
- labs saludables
- labs corriendo
- labs que requieren atencion

### Sistemas principales

- `05-postgres-api`
- `06-nginx-proxy`
- `09-multi-service-app`

### Diagnostico

Cruza dos fuentes:

- navegador: estimacion del equipo anfitrion
- Docker: CPU, RAM y consumo real del runtime

### Detalle por lab

- estado Docker
- objetivo del entorno
- health de contenedores
- accesos reales
- acciones `start`, `stop`, `restart`, `rebuild`, `logs`

## Acciones globales

- `Levantar repositorio activo`
- `Bajar todos los Docker`
- `Eliminar entornos del repo`

## Verificacion tecnica

```powershell
curl http://localhost:9090/api/overview
curl http://localhost:9090/api/diagnostics
```

## Notas importantes

- `9090` ya no depende de un proceso Node suelto en una consola
- el panel se levanta como parte del ecosistema Docker
- el panel no reemplaza Docker Desktop: lo usa y lo explica mejor

## Relacion con el gateway

El gateway en `8085` expone tambien:

- `http://localhost:8085/control/`

Eso permite usar la plataforma principal como si fuera un solo producto.
