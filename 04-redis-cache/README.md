# 04-redis-cache

API REST con caching usando Redis para mejorar rendimiento.

## 🚀 Inicio Rápido

```bash
cd 04-redis-cache
docker-compose up
```

Accede a http://localhost:3001

## 📡 Endpoints

- `GET /` - Mensaje de bienvenida
- `GET /health` - Health check (JSON)
- `GET /data/:key` - Obtiene datos con cache (ej. /data/test)

## 🏗️ Arquitectura

- **Node.js 20** con Express
- **Redis 7** para caching
- Cache expira en 5 minutos

## ☸️ Despliegue en Kubernetes

```bash
cd k8s
kubectl apply -f deployment.yaml
```

## 🧪 Tests

Prueba el cache: llama a /data/test varias veces y nota "source: cache" vs "fresh".