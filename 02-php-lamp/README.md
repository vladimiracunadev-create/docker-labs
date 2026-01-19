# 02-php-lamp

Aplicación LAMP básica con PHP, Apache, MariaDB y phpMyAdmin.

## 🚀 Inicio Rápido

```bash
cd 02-php-lamp
docker-compose up
```

Accede:
- Web: http://localhost:8081
- phpMyAdmin: http://localhost:8082

## 🗄️ Base de Datos

- **Usuario**: lamp_user
- **Password**: lamp_pass
- **DB**: lamp_db

## ☸️ Despliegue en Kubernetes

```bash
cd k8s
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## 🧪 Tests

Verifica que la web responda y phpMyAdmin acceda a la DB.