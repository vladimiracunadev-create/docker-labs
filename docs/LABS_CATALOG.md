# 🗂️ Catálogo de Labs — Docker Labs

> **Versión**: 1.4.0
> **Estado**: 🟢 Activo
> **Audiencia**: 👥 Todos
> **Objetivo**: Rol de los 12 labs dentro del ecosistema y orden recomendado de uso

---

## 📊 Vista general

| Lab | Tipo | Puerto(s) | Rol |
|---|---|---|---|
| `01-node-api` | Starter | `3000` | API REST mínima |
| `02-php-lamp` | Starter | `8081`, `8082`, `3306` | Stack clásico administrativo |
| `03-python-api` | Starter | `5000` | API Python sencilla |
| `04-redis-cache` | Infra | `3001`, `6379` | Caché y performance |
| `05-postgres-api` | Platform | `8000`, `5432` | Core transaccional |
| `06-nginx-proxy` | Platform | `8085` | Gateway |
| `07-rabbitmq-messaging` | Infra | `5672`, `15672` | Mensajería asíncrona |
| `08-prometheus-grafana` | Infra | `9090`, `3002` | Observabilidad |
| `09-multi-service-app` | Platform | `8083`, `3003`, `27017` | Portal operativo |
| `10-go-api` | Starter | `8084` | Servicio ligero |
| `11-elasticsearch-search` | Infra | `8000`, `9200` | Búsqueda e indexación |
| `12-jenkins-ci` | Infra | `8080`, `50000` | Automatización CI |

---

## 🧠 Plataforma principal

Estos cuatro componentes forman la experiencia central del workspace. Se levantan juntos para obtener el sistema completo.

| Componente | Puerto | Rol |
|---|---|---|
| `dashboard-control` | `9090` | Control Center del workspace |
| `05-postgres-api` | `8000` | Core transaccional |
| `09-multi-service-app` | `8083` | Portal operativo |
| `06-nginx-proxy` | `8085` | Gateway unificado |

## 🔧 Labs complementarios

Capacidades de infraestructura que se usan de forma independiente, según el objetivo de aprendizaje o demostración.

| Lab | Capacidad | Nota |
|---|---|---|
| `04-redis-cache` | Caché y performance | Compatible con plataforma principal |
| `07-rabbitmq-messaging` | Mensajería asíncrona | Compatible con plataforma principal |
| `08-prometheus-grafana` | Observabilidad | ⚠️ Puerto `9090` — conflicto con Control Center |
| `11-elasticsearch-search` | Búsqueda e indexación | ⚠️ Puerto `8000` — conflicto con Inventory Core |
| `12-jenkins-ci` | Automatización CI | Uso independiente recomendado |

## 🧪 Starters

Labs de entrada pensados para aprendizaje progresivo y base de futuros proyectos.

| Lab | Enfoque |
|---|---|
| `01-node-api` | API REST con Node.js y Express |
| `02-php-lamp` | Entorno clásico con PHP, Apache y MariaDB |
| `03-python-api` | API Python con Flask |
| `10-go-api` | Servicio ligero y rápido en Go |

## ⚠️ Conflictos de puertos a considerar

| Lab | Puerto | Conflicto con |
|---|---:|---|
| `08-prometheus-grafana` | `9090` | `dashboard-control` |
| `11-elasticsearch-search` | `8000` | `05-postgres-api` |

Estos conflictos no son errores del repositorio, pero deben usarse de forma consciente: no levantes estos labs al mismo tiempo que los componentes de la plataforma principal.

## 🧭 Orden recomendado de arranque

| Prioridad | Componente | Motivo |
|---:|---|---|
| 1 | `dashboard-control` | Entrada y control del workspace |
| 2 | `05-postgres-api` | Core del que dependen otros servicios |
| 3 | `09-multi-service-app` | Requiere el core en `localhost:8000` |
| 4 | `06-nginx-proxy` | Unifica accesos al panel, core y portal |
| 5 | `04`, `07`, `08`, `11`, `12` | Labs complementarios según objetivo |
| 6 | `01`, `02`, `03`, `10` | Starters independientes |

## 📚 Documentos relacionados

- [TECHNICAL_SPECS.md](TECHNICAL_SPECS.md)
- [technical-audit.md](technical-audit.md)
- [../README.md](../README.md)
