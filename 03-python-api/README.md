# 03-python-api

> API REST basica con Python 3.12 y Flask. Punto de entrada para explorar APIs Python containerizadas.

---

## Servicios y puertos

| Servicio | Puerto host | Descripcion |
|---|---:|---|
| API Python | `5000` | API REST con Flask |

---

## Inicio rapido

```bash
docker compose up -d --build
```

URL: <http://localhost:5000>

---

## Endpoints

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/` | Mensaje de bienvenida |
| `GET` | `/health` | Health check — devuelve estado del servicio |

---

## Health check

El contenedor tiene healthcheck definido sobre `GET /health` con `curl`. Docker reporta el estado real del servicio.

---

## Despliegue en Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
```

---

## Verificacion

```bash
docker compose ps
curl http://localhost:5000/health
```
