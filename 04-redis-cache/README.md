# 04-redis-cache

> API REST con caching en Redis para demostrar patrones de performance con Node.js 20 y Redis 7.

---

## Servicios y puertos

| Servicio | Puerto host | Descripcion |
|---|---:|---|
| API Node.js | `3001` | API REST con cache |
| Redis | `6379` | Almacen de cache en memoria |

---

## Inicio rapido

```bash
docker compose up -d --build
```

URL: <http://localhost:3001>

---

## Endpoints

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/` | Mensaje de bienvenida |
| `GET` | `/health` | Health check — devuelve `{ ok: true, ts: "..." }` |
| `GET` | `/data/:key` | Obtiene datos con cache (TTL 5 min) |

### Ejemplo de uso del cache

```bash
# Primera llamada: fuente "fresh" (dato generado y guardado en Redis)
curl http://localhost:3001/data/test
# { "source": "fresh", "data": { ... } }

# Segunda llamada: fuente "cache" (leido directamente de Redis)
curl http://localhost:3001/data/test
# { "source": "cache", "data": { ... } }
```

---

## Health checks

| Servicio | Check | Comando |
|---|---|---|
| Redis | Conectividad | `redis-cli ping` |
| API Node.js | HTTP `/health` | `wget -qO- http://localhost:3000/health` |

La API espera a que Redis este saludable antes de arrancar (`condition: service_healthy`).

---

## Arquitectura

```text
Cliente
  └── API Node.js 20 (:3000 → :3001)
        └── Redis 7 (:6379)
```

- Cache TTL: 5 minutos por clave
- Si la clave no existe en Redis, se genera el dato y se almacena
- Si la clave existe, se devuelve directamente desde Redis

---

## Despliegue en Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
```

---

## Verificacion

```bash
# Estado de contenedores y health checks
docker compose ps

# Verificar Redis directamente
docker compose exec redis redis-cli ping
# PONG

# Verificar la API
curl http://localhost:3001/health
# {"ok":true,"ts":"..."}
```
