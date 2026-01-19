# ☸️ Despliegue con Kubernetes

Esta guía explica cómo desplegar los laboratorios de docker-labs en un cluster de Kubernetes, migrando de Docker Compose a orquestación nativa de contenedores.

## 📋 Requisitos Previos

- **Cluster Kubernetes**: Minikube (local), Kind, o un cluster en la nube (AKS, EKS, GKE).
- **kubectl**: Herramienta de línea de comandos para Kubernetes.
- **Docker**: Para construir imágenes.
- **Registro de imágenes**: Docker Hub, ECR, o un registro local accesible por el cluster.

### Instalación de Minikube (Recomendado para Local)

```bash
# Windows con Chocolatey
choco install minikube kubernetes-cli

# O descarga directa desde https://minikube.sigs.k8s.io/docs/start/

# Iniciar cluster
minikube start

# Verificar
kubectl get nodes
```

## 🏗️ Preparación de Imágenes

Antes de desplegar, construye y sube las imágenes personalizadas a un registro.

### 01-node-api

```bash
cd 01-node-api
docker build -t tuusuario/node-api:v1 .
docker push tuusuario/node-api:v1
```

### 02-php-lamp (Web)

```bash
cd 02-php-lamp
docker build -t tuusuario/php-lamp-web:v1 ./docker/php
docker push tuusuario/php-lamp-web:v1
```

### 03-python-api

```bash
cd 03-python-api
docker build -t tuusuario/python-api:v1 .
docker push tuusuario/python-api:v1
```

### 04-redis-cache

```bash
cd 04-redis-cache
docker build -t tuusuario/redis-cache-api:v1 .
docker push tuusuario/redis-cache-api:v1
```

### 05-postgres-api

```bash
cd 05-postgres-api
docker build -t tuusuario/postgres-api:v1 .
docker push tuusuario/postgres-api:v1
```

### 06-nginx-proxy

```bash
cd 06-nginx-proxy
docker build -t tuusuario/nginx-proxy:v1 .
docker push tuusuario/nginx-proxy:v1
```

### 07-rabbitmq-messaging

Usa imágenes oficiales: `rabbitmq:3-management`

### 08-prometheus-grafana

Usa imágenes oficiales: `prom/prometheus`, `grafana/grafana`

### 09-multi-service-app

```bash
cd 09-multi-service-app/backend
docker build -t tuusuario/multi-backend:v1 .
docker push tuusuario/multi-backend:v1
```

### 10-go-api

```bash
cd 10-go-api
docker build -t tuusuario/go-api:v1 .
docker push tuusuario/go-api:v1
```

### 11-elasticsearch-search

```bash
cd 11-elasticsearch-search
docker build -t tuusuario/elasticsearch-api:v1 .
docker push tuusuario/elasticsearch-api:v1
```

### 12-jenkins-ci

Usa imagen oficial: `jenkins/jenkins:lts`

> **Nota**: Reemplaza `tuusuario` con tu nombre de usuario en Docker Hub. Para MariaDB y phpMyAdmin, usa las imágenes oficiales (`mariadb:11`, `phpmyadmin:latest`).

## 🚀 Despliegue por Laboratorio

### 01-node-api

```bash
cd 01-node-api/k8s
kubectl apply -f deployment.yaml
```

**Acceso**:
- `minikube service node-api-service` (abre en navegador)
- O: `kubectl get services` para ver la IP externa.

### 02-php-lamp

```bash
cd 02-php-lamp/k8s
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

**Acceso**:
- Web: `minikube service php-lamp-web-service`
- phpMyAdmin: `minikube service phpmyadmin-service`

> **Nota**: La base de datos usa PersistentVolumeClaim para persistencia. Ajusta variables de entorno en `deployment.yaml` si es necesario.

### 03-python-api

```bash
cd 03-python-api/k8s
kubectl apply -f deployment.yaml
```

**Acceso**:
- `minikube service python-api-service`

### 04-redis-cache

```bash
cd 04-redis-cache/k8s
kubectl apply -f deployment.yaml
```

**Acceso**:
- `minikube service redis-cache-api-service`

### 05-postgres-api

```bash
cd 05-postgres-api/k8s
kubectl apply -f deployment.yaml
```

**Acceso**:
- `minikube service postgres-api-service`

### 06-nginx-proxy

```bash
cd 06-nginx-proxy/k8s
kubectl apply -f deployment.yaml  # Crear si no existe
```

### 07-rabbitmq-messaging

```bash
cd 07-rabbitmq-messaging/k8s
kubectl apply -f deployment.yaml  # Crear si no existe
```

### 08-prometheus-grafana

```bash
cd 08-prometheus-grafana/k8s
kubectl apply -f deployment.yaml  # Crear si no existe
```

### 09-multi-service-app

```bash
cd 09-multi-service-app/k8s
kubectl apply -f deployment.yaml  # Crear si no existe
```

### 10-go-api

```bash
cd 10-go-api/k8s
kubectl apply -f deployment.yaml  # Crear si no existe
```

### 11-elasticsearch-search

```bash
cd 11-elasticsearch-search/k8s
kubectl apply -f deployment.yaml  # Crear si no existe
```

### 12-jenkins-ci

```bash
cd 12-jenkins-ci/k8s
kubectl apply -f deployment.yaml  # Crear si no existe
```

## 🔧 Comandos Útiles

```bash
# Ver estado de pods
kubectl get pods

# Ver logs de un pod
kubectl logs <pod-name>

# Escalar deployment
kubectl scale deployment node-api --replicas=3

# Actualizar imagen
kubectl set image deployment/node-api api=tuusuario/node-api:v2

# Eliminar todo
kubectl delete -f k8s/

# Acceder a un pod (debugging)
kubectl exec -it <pod-name> -- /bin/bash
```

## 🐛 Troubleshooting

- **Imagen no encontrada**: Asegúrate de que la imagen esté subida y accesible. Para Minikube, usa `minikube docker-env` para compartir imágenes locales.
- **Puertos ocupados**: Cambia `type: LoadBalancer` a `type: NodePort` si hay conflictos.
- **Volúmenes**: En clusters locales, los hostPath pueden no persistir; considera usar PersistentVolumes reales.
- **Secrets**: Para passwords, crea Secrets de K8s en lugar de env vars plaintext.

## 📚 Recursos Adicionales

- [Documentación oficial de Kubernetes](https://kubernetes.io/docs/)
- [Minikube Docs](https://minikube.sigs.k8s.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

¡Ahora puedes orquestar tus labs con Kubernetes! 🎉