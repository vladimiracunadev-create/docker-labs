# 01-node-api

> API REST basica con Node.js 20 y Express. Punto de entrada para explorar APIs containerizadas.

---

## Servicios y puertos

| Servicio | Puerto host | Descripcion |
|---|---:|---|
| API Node.js | `3000` | API REST con Express |

---

## Inicio rapido

```bash
docker compose up -d --build
```

URL: <http://localhost:3000>

---

## Endpoints

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/` | Mensaje de bienvenida |
| `GET` | `/health` | Health check — devuelve estado del servicio |

---

## Health check

El contenedor tiene healthcheck definido sobre `GET /health`. Docker reporta el estado real del servicio.

---

## Despliegue en Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
```

---

## Verificacion

```bash
docker compose ps
curl http://localhost:3000/health
```
