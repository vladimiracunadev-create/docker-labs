# Technical Specs

Especificaciones tecnicas actuales del repositorio.

## Base de ejecucion

| Componente | Estado actual |
|---|---|
| Docker runtime | Docker Desktop / Docker Engine con Compose |
| Panel principal | Contenedor Docker propio en `9090` |
| Gateway | Nginx en `8085` |
| Core principal | FastAPI + PostgreSQL en `8000` |
| Portal principal | Nginx + Node.js + MongoDB en `8083` |

## Versiones y stacks relevantes

| Lab | Stack | Imagenes principales |
|---|---|---|
| `01-node-api` | Node.js + Express | `node:20-alpine` |
| `02-php-lamp` | PHP + Apache + MariaDB | `php:8.3-apache`, `mariadb:10.6`, `phpmyadmin/phpmyadmin` |
| `03-python-api` | Python + Flask | `python:3.12-slim` |
| `04-redis-cache` | Node.js + Redis | `node:20-alpine`, `redis:7-alpine` |
| `05-postgres-api` | FastAPI + PostgreSQL | `python:3.12-slim`, `postgres:15` |
| `06-nginx-proxy` | Nginx gateway | `nginx:alpine` |
| `07-rabbitmq-messaging` | Node.js + RabbitMQ | `rabbitmq:3-management`, `node:20-alpine` |
| `08-prometheus-grafana` | Observabilidad | `prom/prometheus`, `grafana/grafana` |
| `09-multi-service-app` | Nginx + Node.js + MongoDB | `nginx:alpine`, `node:20-alpine`, `mongo:7` |
| `10-go-api` | Go + Alpine | `golang:1.21-alpine`, `alpine:latest` |
| `11-elasticsearch-search` | Python + Elasticsearch | `python:3.12-slim`, `elasticsearch:8.11.0` |
| `12-jenkins-ci` | Jenkins | `jenkins/jenkins:lts` |

## Puertos principales

| Puerto | Servicio |
|---:|---|
| `8000` | Inventory Core |
| `8083` | Operations Portal |
| `8085` | Platform Gateway |
| `9090` | Control Center |

## Contrato operativo del panel

Endpoints principales:

- `GET /api/overview`
- `GET /api/diagnostics`
- `POST /api/labs/:id/start`
- `POST /api/labs/:id/stop`
- `POST /api/labs/:id/restart`
- `POST /api/labs/:id/logs`
- `POST /api/workspace/stop-all`
- `POST /api/workspace/remove-all`

## Recomendacion de capacidad

| Perfil | RAM Docker sugerida |
|---|---:|
| Caso a caso | `8 GB` |
| Plataforma principal | `16 GB` |
| Plataforma + labs pesados | `24 GB` o mas |

## Notas de implementacion

- el panel monta el repositorio para leer manifests y archivos estaticos
- el panel usa `docker cli` dentro del contenedor
- el gateway depende de que `05`, `09` y `9090` esten accesibles
- los labs pesados deben usarse con criterio porque el costo real depende de volumenes, datos y plugins
