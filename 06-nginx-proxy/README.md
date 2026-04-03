# 🔀 Lab 06 — Nginx Proxy Gateway

Puerta de entrada unificada a todos los servicios principales del repositorio mediante un reverse proxy Nginx.

---

## 🧩 Rol en el repositorio

Este laboratorio transforma un reverse proxy básico en un componente transversal de la plataforma. En lugar de recordar puertos individuales, el gateway centraliza el acceso a los sistemas activos bajo una sola URL base en el puerto `8085`.

Demuestra cómo una capa de entrada reduce la fricción operativa y prepara la plataforma para una integración más amplia. Es especialmente relevante cuando los labs `05-postgres-api` y `09-multi-service-app` están activos y se quieren usar como un sistema relacionado.

## 📦 Servicios y puertos

| Servicio | Imagen | Puerto host | Puerto contenedor | Descripción |
|---|---|---|---|---|
| `platform_gateway` | `nginx:alpine` (build local) | `8085` | `80` | Reverse proxy principal y landing page |

## ⚡ Inicio rápido

```bash
docker compose up -d --build
```

## 🔗 Accesos

| Destino | URL |
|---|---|
| Gateway (landing page) | <http://localhost:8085> |
| Control Center | <http://localhost:8085/control/> |
| Inventory Core | <http://localhost:8085/core/> |
| Swagger — Inventory Core | <http://localhost:8085/docs> |
| Operations Portal | <http://localhost:8085/portal/> |
| Health del gateway | <http://localhost:8085/gateway-health> |

> Las rutas `/control/`, `/core/` y `/portal/` se resuelven mediante `host.docker.internal` hacia los puertos `9090`, `8000` y `8083` respectivamente, sin acoplarse a las redes internas de otros compose.

## ✅ Health check

El contenedor `platform_gateway` verifica su propio estado con:

```text
wget -qO- http://127.0.0.1/gateway-health
```

| Parámetro | Valor |
|---|---|
| Intervalo | 10 s |
| Timeout | 5 s |
| Reintentos | 5 |
| Start period | 20 s |

## 🔍 Verificación

```bash
# Estado del contenedor
docker compose ps

# Confirmar que el gateway responde
curl http://localhost:8085/gateway-health

# Ver los logs del proxy
docker compose logs platform_gateway
```

## 📚 Documentos relacionados

- [Repositorio principal](../README.md)
- [05-postgres-api](../05-postgres-api/README.md) — Inventory Core (`:8000`)
- [dashboard-control](../dashboard-control/server.js) — Control Center (`:9090`)
- [09-multi-service-app](../09-multi-service-app/README.md) — Operations Portal (`:8083`)
