# 🐳 Docker Basics

Guía breve de conceptos Docker usando este repositorio como referencia práctica.

## Conceptos esenciales

| Concepto | Qué significa | Ejemplo en este repo |
|---|---|---|
| Imagen | Plantilla para crear contenedores | `postgres:15`, `nginx:alpine` |
| Contenedor | Instancia en ejecución de una imagen | `inventory_core_api` |
| Volumen | Persistencia fuera del contenedor | `postgres_data`, `multi_db_data` |
| Puerto publicado | Acceso desde el host al contenedor | `8000:8000`, `8085:80` |
| Compose | Orquestación de varios servicios | `05-postgres-api/docker-compose.yml` |

## Cómo leer un `docker-compose.yml`

Fíjate siempre en:

1. `services`
2. `ports`
3. `volumes`
4. `environment`
5. `depends_on`
6. `healthcheck`

## Diferencia clave: Docker vs sistema

- Docker: el runtime
- sistema: la app o servicio dentro del contenedor

Ejemplo:

- Docker arriba: `inventory_core_api` healthy
- sistema accesible: [http://localhost:8000](http://localhost:8000)

## Comandos útiles

```powershell
docker ps
docker images
docker compose ps
docker compose logs --tail 80
docker system df
```

## Recomendación práctica

En este repo no hace falta levantar todo a la vez. Lo más sano es:

- dejar `9090` arriba
- revisar diagnóstico
- levantar un lab o la plataforma principal

## Sigue leyendo

- [Beginner Guide](BEGINNERS_GUIDE.md)
- [Install Guide](INSTALL.md)
- [User Manual](USER_MANUAL.md)
