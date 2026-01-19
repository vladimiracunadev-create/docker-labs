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