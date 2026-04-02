# 12-jenkins-ci

> Automatizacion CI/CD con Jenkins LTS. Lab de uso independiente — requiere recursos adicionales.

---

## Servicios y puertos

| Servicio | Puerto host | Descripcion |
|---|---:|---|
| Jenkins UI | `8080` | Interfaz web de Jenkins |
| Jenkins agentes JNLP | `50000` | Puerto para agentes remotos |

---

## Inicio rapido

```bash
docker compose up -d
```

URL: <http://localhost:8080>

Sigue el setup inicial de Jenkins: la contrasena de administrador se encuentra en los logs del contenedor.

```bash
docker compose logs jenkins | grep -A 3 "Please use the following password"
```

---

## Health check

El contenedor tiene healthcheck definido sobre `GET /login`. Jenkins puede tardar hasta 3 minutos en estar completamente listo en el primer arranque.

---

## Nota sobre CI

Este lab esta **excluido de la matriz de CI automatica** porque Jenkins tarda mas de 3 minutos en arrancar (supera el timeout del runner). Es valido en entornos locales con recursos suficientes.

---

## Verificacion

```bash
# Estado del contenedor
docker compose ps

# Logs del arranque
docker compose logs -f jenkins
```
