# 02-php-lamp

> Stack LAMP clásico con PHP 8.3, Apache, MariaDB 10.6 y phpMyAdmin.

---

## Servicios y puertos

| Servicio | Puerto host | Descripcion |
|---|---:|---|
| Apache + PHP | `8081` | Aplicacion web principal |
| phpMyAdmin | `8082` | Administrador de base de datos |
| MariaDB | `3306` | Base de datos relacional |

---

## Inicio rapido

```bash
docker compose up -d --build
```

| URL | Descripcion |
|---|---|
| <http://localhost:8081> | Aplicacion PHP |
| <http://localhost:8082> | phpMyAdmin |

---

## Credenciales de base de datos

| Variable | Valor por defecto |
|---|---|
| Base de datos | `appdb` |
| Usuario | `appuser` |
| Password | `apppass` |
| Root password | `rootpass` |

Las variables se pueden sobreescribir con un archivo `.env`:

```env
DB_NAME=lamp_db
DB_USER=lamp_user
DB_PASS=lamp_pass
DB_ROOT=root_pass
```

---

## Health checks

| Servicio | Check | Comando |
|---|---|---|
| MariaDB | Conectividad | `mysqladmin ping -h 127.0.0.1` |
| Apache + PHP | HTTP 200 | `curl -f http://localhost/` |

`web` y `phpmyadmin` esperan a que `db` este saludable antes de arrancar (`condition: service_healthy`).

---

## Arquitectura

```php
Cliente
  └── Apache + PHP 8.3 (:80 → :8081)
        └── MariaDB 10.6 (:3306)
phpMyAdmin (:80 → :8082)
  └── MariaDB 10.6 (:3306)
```

---

## Despliegue en Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

---

## Verificacion

```bash
# Estado de los contenedores y sus health checks
docker compose ps

# Logs de Apache
docker compose logs web

# Acceso directo a la DB
docker compose exec db mysqladmin ping -h 127.0.0.1 --silent && echo "DB OK"
```
