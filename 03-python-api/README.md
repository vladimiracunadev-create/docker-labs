# 03-python-api

API REST básica construida con Python y Flask.

## 🚀 Inicio Rápido

```bash
cd 03-python-api
docker-compose up
```

Accede a http://localhost:5000

## 📡 Endpoints

- `GET /` - Mensaje de bienvenida
- `GET /health` - Health check (JSON)

## 🏗️ Arquitectura

- **Python 3.12** con slim image
- **Flask** para el servidor
- **pip** para dependencias

## ☸️ Despliegue en Kubernetes

```bash
cd k8s
kubectl apply -f deployment.yaml
```

## 🧪 Tests

Ejecuta health checks con Docker o Kubernetes.