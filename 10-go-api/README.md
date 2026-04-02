# 10-go-api

> API REST ligera con Go. Demuestra performance y arranque rapido en un servicio containerizado.

---

## Servicios y puertos

| Servicio | Puerto host | Puerto contenedor | Descripcion |
|---|---:|---:|---|
| API Go | `8084` | `8080` | API REST en Go |

---

## Inicio rapido

```bash
docker compose up -d --build
```

URL: <http://localhost:8084>

---

## Endpoints

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/health` | Health check del servicio |

---

## Health check

El contenedor tiene healthcheck definido sobre `GET /health` con `wget`. Docker reporta el estado real del servicio.

---

## Verificacion

```bash
docker compose ps
curl http://localhost:8084/health
```
