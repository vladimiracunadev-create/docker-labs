# 📋 Labs Catalog

Catálogo de los 12 labs del repositorio y su lugar dentro del workspace.

## 📊 Vista general

| Lab | Tipo | Estado narrativo | Puerto(s) | Qué resuelve |
|---|---|---|---|---|
| `01-node-api` | Starter | 🟡 Base | `3000` | API REST mínima |
| `02-php-lamp` | Starter | 🟡 Base | `8081`, `8082`, `3306` | App administrativa clásica |
| `03-python-api` | Starter | 🟡 Base | `5000` | API Python sencilla |
| `04-redis-cache` | Infra | 🟡 Complementario | `3001`, `6379` | Cache y performance |
| `05-postgres-api` | Platform | 🟢 Principal | `8000`, `5432` | Core transaccional |
| `06-nginx-proxy` | Platform | 🟢 Principal | `8085` | Gateway |
| `07-rabbitmq-messaging` | Infra | 🟡 Complementario | `5672`, `15672` | Mensajería asíncrona |
| `08-prometheus-grafana` | Infra | 🟡 Complementario | `9090`, `3002` | Observabilidad |
| `09-multi-service-app` | Platform | 🟢 Principal | `8083`, `3003`, `27017` | Portal operativo |
| `10-go-api` | Starter | 🟡 Base | `8084` | Servicio ligero |
| `11-elasticsearch-search` | Infra | 🟡 Complementario | `8000`, `9200` | Búsqueda e indexación |
| `12-jenkins-ci` | Infra | 🟡 Complementario | `8080`, `50000` | Automatización CI |

## 🟢 Sistemas principales

### `05-postgres-api`

- rol: core del negocio
- objetivo: clientes, productos, pedidos y stock
- abrir: [README](../05-postgres-api/README.md)

### `09-multi-service-app`

- rol: portal operativo
- objetivo: visualizar y operar sobre el core
- abrir: [README](../09-multi-service-app/README.md)

### `06-nginx-proxy`

- rol: gateway
- objetivo: unificar accesos a panel, core y portal
- abrir: [README](../06-nginx-proxy/README.md)

## 🧰 Capacidades complementarias

| Lab | Cuándo usarlo | Abrir |
|---|---|---|
| `04-redis-cache` | Cuando quieras demostrar cache y mejora de respuesta | [README](../04-redis-cache/README.md) |
| `07-rabbitmq-messaging` | Cuando quieras mostrar procesos desacoplados | [README](../07-rabbitmq-messaging/README.md) |
| `08-prometheus-grafana` | Cuando quieras monitoreo y metricas | [README](../08-prometheus-grafana/README.md) |
| `11-elasticsearch-search` | Cuando quieras busqueda o indexacion | [README](../11-elasticsearch-search/README.md) |
| `12-jenkins-ci` | Cuando quieras automatizacion de pipelines | [README](../12-jenkins-ci/README.md) |

## 🌱 Starters

| Lab | Valor principal | Abrir |
|---|---|---|
| `01-node-api` | Entender una API Dockerizada simple | [README](../01-node-api/README.md) |
| `02-php-lamp` | Ver un stack LAMP clasico | [README](../02-php-lamp/README.md) |
| `03-python-api` | Ver una API Python minima | [README](../03-python-api/README.md) |
| `10-go-api` | Ver un servicio pequeno y rapido | [README](../10-go-api/README.md) |

## 🧭 Orden recomendado

1. `01-node-api`
2. `03-python-api`
3. `05-postgres-api`
4. `09-multi-service-app`
5. `06-nginx-proxy`
6. `04`, `07`, `08`, `11`, `12`

## 🔗 Documentos relacionados

- [README](../README.md)
- [Labs Runtime Reference](LABS_RUNTIME_REFERENCE.md)
- [Technical Specs](TECHNICAL_SPECS.md)
