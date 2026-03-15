# Labs Catalog

Catalogo de los 12 labs del repositorio y su lugar dentro del workspace actual.

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
| `08-prometheus-grafana` | Infra | `9090`, `3002` | Observabilidad |
| `09-multi-service-app` | Platform | `8083`, `3003`, `27017` | Portal operativo |
| `10-go-api` | Starter | `8084` | Servicio ligero |
| `11-elasticsearch-search` | Infra | `8000`, `9200` | Busqueda e indexacion |
| `12-jenkins-ci` | Infra | `8080`, `50000` | Automatizacion CI |

## Plataforma principal

- `dashboard-control`
- `05-postgres-api`
- `09-multi-service-app`
- `06-nginx-proxy`

## Labs complementarios

- `04-redis-cache`
- `07-rabbitmq-messaging`
- `08-prometheus-grafana`
- `11-elasticsearch-search`
- `12-jenkins-ci`

## Notas importantes

- `08-prometheus-grafana` entra en conflicto con el `9090` del Control Center.
- `11-elasticsearch-search` entra en conflicto con el `8000` del Inventory Core.
- esos conflictos no son errores del repo, pero si deben usarse de forma consciente y documentada.

## Orden recomendado

1. `dashboard-control`
2. `05-postgres-api`
3. `09-multi-service-app`
4. `06-nginx-proxy`
5. `04`, `07`, `08`, `11`, `12`
6. `01`, `02`, `03`, `10` como starters

## Documentos relacionados

- [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md)
- [technical-audit.md](technical-audit.md)
- [../README.md](../README.md)
