# For Recruiters

Guia rapida para evaluar `docker-labs` como pieza de portafolio.

## Que es este repositorio

`docker-labs` evoluciono desde una coleccion de laboratorios Docker hacia una plataforma modular con tres sistemas principales:

- `05-postgres-api`: core transaccional
- `09-multi-service-app`: portal operativo
- `06-nginx-proxy`: gateway de entrada

## Que demuestra

Este repo evidencia trabajo en:

- Docker y Docker Compose
- integracion entre servicios
- modelado de backend con FastAPI y PostgreSQL
- construccion de una capa frontend/backend adicional
- experiencia de desarrollo orientada a panel de control
- documentacion tecnica y narrativa de producto

## Como revisarlo rapido

1. abrir el panel principal en [http://localhost:9090](http://localhost:9090)
2. abrir `Inventory Core`
3. abrir `Operations Portal`
4. abrir `Platform Gateway`

Con eso se entiende la arquitectura principal del repo sin revisar todas las carpetas.

## Que mirar especificamente

### Criterio tecnico

- `05-postgres-api`
- `09-multi-service-app`
- `06-nginx-proxy`
- `dashboard-control`

### Criterio de producto

- el repositorio no se presenta solo como demos
- cada entorno principal tiene objetivo y justificacion
- existe navegacion entre sistemas y capa de entrada comun

### Criterio documental

- [README.md](C:/docker-labs/docker-labs/README.md)
- [docs/ARCHITECTURE.md](C:/docker-labs/docker-labs/docs/ARCHITECTURE.md)
- [docs/PLATFORM_ROADMAP.md](C:/docker-labs/docker-labs/docs/PLATFORM_ROADMAP.md)

## Estado actual

El proyecto esta funcional como workspace local y como activo de portafolio. Aun no pretende ser una solucion productiva final ni una plataforma completamente cerrada, pero ya muestra direccion, criterio y capacidad de ejecucion.

## Lectura sugerida

Si el tiempo es corto:

- [README.md](C:/docker-labs/docker-labs/README.md)
- [FOR_RECRUITERS.md](C:/docker-labs/docker-labs/FOR_RECRUITERS.md)
- [docs/PLATFORM_ROADMAP.md](C:/docker-labs/docker-labs/docs/PLATFORM_ROADMAP.md)
