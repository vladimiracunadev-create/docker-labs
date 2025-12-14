# Docker Labs 🧪🐳

Este repositorio es un **laboratorio personal de contenedores** para aprender, practicar y documentar el uso de **Docker / Docker Compose** con distintos stacks (PHP, Node.js, Python, bases de datos, herramientas, etc.).

La idea es simple:

- Cada carpeta es un **laboratorio independiente**.
- Cada laboratorio incluye lo necesario para levantar el entorno con Docker.
- Cada laboratorio tiene un **objetivo de aprendizaje** y un mini sistema o demo que valida que funciona.

> **Nota:** En Git se sube el código y la configuración (Dockerfile/compose), **no** las dependencias instaladas (`node_modules`, `.venv`), archivos sensibles (`.env`) ni datos de BD (volúmenes).

---

## Objetivos del laboratorio

- Dominar el flujo: **build → up → logs → exec → down**.
- Separar correctamente:
  - **Código (host / repo)**
  - **Runtime (contenedor)**
  - **Datos persistentes (volúmenes)**
- Practicar buenas prácticas para repositorios:
  - `.gitignore`, `.dockerignore`, `.env.example`
  - puertos ordenados y documentación mínima
- Construir micro-sistemas con foco en aprendizaje, por ejemplo:
  - APIs REST simples
  - CRUDs básicos
  - autenticación mínima
  - conexión a base de datos
  - colas (Redis/RabbitMQ)
  - reverse proxy (Nginx/Traefik)
  - observabilidad (logs, métricas)

---

## Estructura del repositorio

Ejemplo de organización (puede crecer con el tiempo):



