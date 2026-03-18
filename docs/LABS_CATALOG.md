# Catalogo de Labs - Docker Labs

> **Version**: 1.4.0
> **Estado**: Activo
> **Audiencia**: Todos
> **Objetivo**: Rol de los 12 labs dentro del ecosistema y orden recomendado de uso

---

## Vista general

| Lab | Tipo | Puerto(s) | Rol |
|---|---|---|---|
| `01-node-api` | Starter | `3000` | API REST minima |
| `02-php-lamp` | Starter | `8081`, `8082`, `3306` | Stack clasico administrativo |
| `03-python-api` | Starter | `5000` | API Python sencilla |
| `04-redis-cache` | Infra | `3001`, `6379` | Cache y performance |
| `05-postgres-api` | Platform | `8000`, `5432` | Core transaccional |
| `06-nginx-proxy` | Platform | `8085` | Gateway |
| `07-rabbitmq-messaging` | Infra | `5672`, `15672` | Mensajeria asincrona |
| `08-prometheus-grafana` | Infra | `9091`, `3002` | Observabilidad |
| `09-multi-service-app` | Platform | `8083`, `3003`, `27017` | Portal operativo |
| `10-go-api` | Starter | `8084` | Servicio ligero |
| `11-elasticsearch-search` | Infra | `8001`, `9200` | Busqueda e indexacion |
| `12-jenkins-ci` | Infra | `8080`, `50000` | Automatizacion CI |

---

## Plataforma principal

Estos cuatro componentes forman la experiencia central del workspace. Se levantan juntos para obtener el sistema completo.

| Componente | Puerto | Rol |
|---|---|---|
| `dashboard-control` | `9090` | Control Center del workspace |
| `05-postgres-api` | `8000` | Core transaccional |
| `09-multi-service-app` | `8083` | Portal operativo |
| `06-nginx-proxy` | `8085` | Gateway unificado |

## Labs complementarios

Capacidades de infraestructura que se usan de forma independiente, segun el objetivo de aprendizaje o demostracion.

| Lab | Capacidad | Nota |
|---|---|---|
| `04-redis-cache` | Cache y performance | Compatible con plataforma principal |
| `07-rabbitmq-messaging` | Mensajeria asincrona | Compatible con plataforma principal |
| `08-prometheus-grafana` | Observabilidad | Compatible con el Control Center usando `9091` |
| `11-elasticsearch-search` | Busqueda e indexacion | Compatible con Inventory Core usando `8001` |
| `12-jenkins-ci` | Automatizacion CI | Uso independiente recomendado |

## Starters

Labs de entrada pensados para aprendizaje progresivo y base de futuros proyectos.

| Lab | Enfoque |
|---|---|
| `01-node-api` | API REST con Node.js y Express |
| `02-php-lamp` | Entorno clasico con PHP, Apache y MariaDB |
| `03-python-api` | API Python con Flask |
| `10-go-api` | Servicio ligero y rapido en Go |

## Conflictos de puertos a considerar

Tras la auditoria tecnica, los conflictos historicos de `08` y `11` quedaron resueltos moviendo Prometheus a `9091` y la API de Elasticsearch a `8001`.

| Lab | Puerto | Estado |
|---|---:|---|
| `08-prometheus-grafana` | `9091` | Sin conflicto con `dashboard-control` |
| `11-elasticsearch-search` | `8001` | Sin conflicto con `05-postgres-api` |

## Orden recomendado de arranque

| Prioridad | Componente | Motivo |
|---:|---|---|
| 1 | `dashboard-control` | Entrada y control del workspace |
| 2 | `05-postgres-api` | Core del que dependen otros servicios |
| 3 | `09-multi-service-app` | Requiere el core en `localhost:8000` |
| 4 | `06-nginx-proxy` | Unifica accesos al panel, core y portal |
| 5 | `04`, `07`, `08`, `11`, `12` | Labs complementarios segun objetivo |
| 6 | `01`, `02`, `03`, `10` | Starters independientes |

## Documentos relacionados

- [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md)
- [technical-audit.md](technical-audit.md)
- [../README.md](../README.md)
