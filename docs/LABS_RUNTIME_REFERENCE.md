# Labs Runtime Reference

Referencia operativa de los 12 labs del repositorio.

Fecha de auditoria: `2026-03-13`

## Como leer esta tabla

- `Imagen oficial`: imagen base o servicio oficial que sostiene el lab.
- `Version en repo`: tag configurado hoy en el repositorio.
- `Tamano de referencia`: tamano comprimido publicado por la imagen oficial o, cuando el tag exacto no se expone de forma clara, una aproximacion conservadora basada en una variante equivalente y en el footprint local observado.
- `RAM minima`: memoria razonable para levantar ese lab sin sumar otros pesados.
- `Perfil`: que tan liviano o exigente es en practica.

Los tamanos cambian por arquitectura, fecha y variant. Esta tabla sirve para presupuestar el entorno, no para reemplazar la verificacion final de `docker images`.

## Requisitos globales

### Software minimo

- Docker Desktop o Docker Engine con `docker compose`
- Git
- Navegador moderno

### Hardware recomendado por escenario

| Escenario | CPU | RAM | Disco libre |
|---|---:|---:|---:|
| Panel principal + 1 lab liviano | 4 nucleos | 8 GB | 15 GB |
| Plataforma principal `05 + 06 + 09` | 6 nucleos | 16 GB | 30 GB |
| Labs pesados de observabilidad, busqueda y CI | 8 nucleos | 24 GB | 40 GB |

## Matriz de los 12 labs

| Lab | Objetivo | Imagen oficial principal | Version en repo | Tamano de referencia | RAM minima sugerida | Perfil |
|---|---|---|---|---|---:|---|
| `01-node-api` | API REST inicial | `node` | `node:20-alpine` | `~46 MB` base oficial `node:20.20.1-alpine` | `1.5 GB` | Liviano |
| `02-php-lamp` | Monolito clasico con admin DB | `php`, `mariadb`, `phpmyadmin` | `php:8.3-apache`, `mariadb:10.6`, `phpmyadmin/phpmyadmin` | `~150-190 MB` por imagen oficial comparable; stack local suele superar `800 MB` | `3 GB` | Medio |
| `03-python-api` | API Python sencilla | `python` | `python:3.12-slim` | `~41 MB` base oficial `python:3.12-slim` | `1.5 GB` | Liviano |
| `04-redis-cache` | Cache y performance | `node`, `redis` | `node:20-alpine`, `redis:7-alpine` | `~46 MB` Node base + `~50 MB` Redis track actual; stack muy liviano | `2 GB` | Liviano |
| `05-postgres-api` | Core transaccional | `python`, `postgres` | `python:3.12-slim`, `postgres:15` | `~41 MB` base Python + `~633 MB` footprint local de `postgres:15` | `3 GB` | Medio |
| `06-nginx-proxy` | Gateway de entrada | `nginx` | `nginx:alpine` | `~34.5 MB` en track alpine actual | `1 GB` | Muy liviano |
| `07-rabbitmq-messaging` | Mensajeria asincrona | `rabbitmq`, `node` | `rabbitmq:3-management`, `node:20-alpine` | `~112 MB` management actual + `~46 MB` Node base | `2.5 GB` | Medio |
| `08-prometheus-grafana` | Observabilidad | `prom/prometheus`, `grafana/grafana` | `prom/prometheus`, `grafana/grafana` | `~145.7 MB` Prometheus actual + `~200 MB` Grafana `12.3` | `4 GB` | Medio-alto |
| `09-multi-service-app` | Portal operativo | `nginx`, `mongo`, `node` | `nginx:alpine`, `mongo:7`, `node:20-alpine` | `~34.5 MB` Nginx + `~1.18 GB` footprint local de `mongo:7` + `~46 MB` Node base | `4 GB` | Alto |
| `10-go-api` | Servicio rapido y pequeno | `golang`, `alpine` | `golang:1.21-alpine`, `alpine:latest` | builder de Go alpine en decenas de MB; runtime `alpine` `~3.68 MB` | `1 GB` | Muy liviano |
| `11-elasticsearch-search` | Busqueda e indexacion | `python`, `elasticsearch` | `python:3.12-slim`, `elasticsearch:8.11.0` | `~41 MB` Python base + `~741 MB` referencia oficial actual para Elasticsearch amd64 | `6 GB` | Pesado |
| `12-jenkins-ci` | Integracion continua | `jenkins/jenkins` | `jenkins/jenkins:lts` | `~278 MB` en la imagen comunitaria reciente `latest`, con volumen persistente adicional | `4 GB` | Medio-alto |

## Lectura caso a caso

### 01-node-api

- Bueno para aprender `Dockerfile`, bind mounts y puertos.
- Costo bajo en RAM y disco.
- Ideal para empezar.

### 02-php-lamp

- Combina app web, base de datos y consola administrativa.
- Ensena bien Compose multi-servicio.
- Conviene usarlo solo cuando necesites probar flujo clasico LAMP.

### 03-python-api

- Muy bueno para entender imagenes `slim`.
- Sirve como base para APIs simples o automatizaciones.

### 04-redis-cache

- Ideal para aprender porque un contenedor no siempre es una app final.
- Redis suele ser barato en recursos, pero importante en arquitectura.

### 05-postgres-api

- Es el mejor caso para aprender healthchecks, persistencia y un backend serio.
- Base recomendada para pasar de laboratorio a producto.

### 06-nginx-proxy

- Ensena el rol del gateway sin sobrecargar la maquina.
- Muy util para ver como varios servicios pueden sentirse como una sola plataforma.

### 07-rabbitmq-messaging

- Bueno para entender colas, broker y procesamiento desacoplado.
- Requiere mas memoria que una API simple.

### 08-prometheus-grafana

- Muy util para observabilidad.
- Mejor levantarlo cuando de verdad vayas a medir algo.

### 09-multi-service-app

- Muestra una experiencia mas cercana a producto: frontend, backend y base documental.
- Consume mas recursos por la presencia de MongoDB y varios contenedores.

### 10-go-api

- Excelente para ver imagenes finales pequenas.
- Ideal para servicios puntuales o de alto rendimiento.

### 11-elasticsearch-search

- Es el lab mas exigente del repo.
- Requiere RAM, disco y tiempo de arranque mayores.
- Conviene aislarlo cuando tu equipo sea limitado.

### 12-jenkins-ci

- Bueno para aprender pipelines y persistencia de configuracion.
- Tiende a crecer en disco cuando agregas plugins y jobs.

## Recomendaciones de uso

### Si tienes 8 GB de RAM

Trabaja asi:

- panel principal arriba
- un solo lab a la vez
- evita mezclar `08`, `11` y `12`

### Si tienes 16 GB de RAM

Modo recomendado:

- `05`
- `06`
- `09`

### Si tienes menos tiempo que hardware

Empieza por:

1. `01`
2. `05`
3. `09`
4. `06`

## Fuentes oficiales consultadas

- `node`: [Docker Hub node tags](https://hub.docker.com/_/node/tags?name=alpine&page=1)
- `python`: [Docker Hub python tags](https://hub.docker.com/_/python/tags?name=3.12&page=1)
- `postgres`: [Docker Hub postgres overview](https://hub.docker.com/_/postgres/)
- `nginx`: [Docker Hub nginx overview](https://hub.docker.com/_/nginx) y [tags](https://hub.docker.com/_/nginx/tags)
- `redis`: [Docker Hub redis overview](https://hub.docker.com/_/redis)
- `mariadb`: [Docker Hub mariadb overview](https://hub.docker.com/_/mariadb) y [tags](https://hub.docker.com/_/mariadb/tags)
- `php`: [Docker Hub php overview](https://hub.docker.com/_/php)
- `phpmyadmin`: [Docker Hub phpmyadmin overview](https://hub.docker.com/_/phpmyadmin) y [tags](https://hub.docker.com/_/phpmyadmin/tags)
- `mongo`: [Docker Hub mongo overview](https://hub.docker.com/_/mongo/)
- `rabbitmq`: [Docker Hub rabbitmq overview](https://hub.docker.com/_/rabbitmq) y [tags](https://hub.docker.com/_/rabbitmq/tags)
- `prom/prometheus`: [Docker Hub prom/prometheus](https://hub.docker.com/r/prom/prometheus)
- `grafana/grafana`: [Docker Hub grafana/grafana tags](https://hub.docker.com/r/grafana/grafana/tags)
- `golang`: [Docker Hub golang overview](https://hub.docker.com/_/golang/)
- `alpine`: [Docker Hub alpine tags](https://hub.docker.com/_/alpine/tags)
- `elasticsearch`: [Elastic container registry](https://www.docker.elastic.co/r/elasticsearch/elasticsearch)
- `jenkins/jenkins`: [Docker Hub jenkins/jenkins](https://hub.docker.com/r/jenkins/jenkins/)
