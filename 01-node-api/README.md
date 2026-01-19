# 01-node-api

API REST básica construida con Node.js y Express.

## 🚀 Inicio Rápido

```bash
cd 01-node-api
docker-compose up
```

Accede a http://localhost:3000

## 📡 Endpoints

- `GET /` - Mensaje de bienvenida
- `GET /health` - Health check (JSON)

## 🏗️ Arquitectura

- **Node.js 20** con Alpine
- **Express** para el servidor
- **npm** para dependencias

## ☸️ Despliegue en Kubernetes

```bash
cd k8s
kubectl apply -f deployment.yaml
```

## 🧪 Tests

Ejecuta health checks con Docker o Kubernetes.