# 05-postgres-api

API REST con PostgreSQL usando FastAPI.

## 🚀 Inicio Rápido

```bash
cd 05-postgres-api
docker-compose up
```

Accede a http://localhost:8000/docs (Swagger UI)

## 📡 Endpoints

- `GET /` - Mensaje de bienvenida
- `GET /health` - Health check
- `GET /items` - Lista items
- `POST /items` - Crear item (body: {"name": "test"})

## 🏗️ Arquitectura

- **Python 3.12** con FastAPI
- **PostgreSQL 15** con SQLAlchemy

## ☸️ Despliegue en Kubernetes

```bash
cd k8s
kubectl apply -f deployment.yaml
```