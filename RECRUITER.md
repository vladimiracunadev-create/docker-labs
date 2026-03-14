# Recruiter Guide

Guia rapida para evaluar `docker-labs` como pieza de portafolio tecnico.

## Que es

`docker-labs` evoluciono desde una coleccion de laboratorios Docker hacia una plataforma modular con cuatro piezas visibles:

| Componente | Estado | Valor |
|---|---|---|
| `05-postgres-api` | Funcional | Backend transaccional serio |
| `09-multi-service-app` | Funcional | Portal operativo integrado |
| `06-nginx-proxy` | Funcional | Gateway de acceso |
| `dashboard-control` | Funcional | Workspace y diagnostico |

## Que demuestra

- Docker y Docker Compose aplicados a multiples stacks
- Integracion real entre servicios
- Modelado backend con FastAPI y PostgreSQL
- Portal operativo conectado a un core transaccional
- Capa de gateway y experiencia de workspace
- Documentacion tecnica con enfoque de producto

## Como revisarlo rapido

1. abrir el panel principal en [http://localhost:9090](http://localhost:9090)
2. revisar el diagnostico del runtime
3. abrir `Inventory Core`
4. abrir `Operations Portal`
5. abrir `Platform Gateway`

Con eso se entiende la historia principal del repositorio sin recorrer las 12 carpetas.

## Que mirar

### Criterio tecnico

- [05-postgres-api](05-postgres-api/README.md)
- [09-multi-service-app](09-multi-service-app/README.md)
- [06-nginx-proxy](06-nginx-proxy/README.md)
- [dashboard-control/server.js](dashboard-control/server.js)

### Criterio de producto

- el repositorio no se vende como demos sueltas
- los sistemas principales tienen objetivo y relacion entre si
- existe una entrada operativa comun

### Criterio documental

- [README](README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Project Status](PROJECT_STATUS.md)
- [Platform Roadmap](docs/PLATFORM_ROADMAP.md)

## Estado actual

El proyecto ya funciona como:

- workspace local util
- activo de portafolio tecnico
- base de evolucion hacia una plataforma mas integrada

Todavia no intenta ser:

- un reemplazo completo de Docker Desktop
- una plataforma productiva final
- un set de 12 labs totalmente homogeneos

## Lectura recomendada

- [README](README.md)
- [RECRUITER.md](RECRUITER.md)
- [PROJECT_STATUS.md](PROJECT_STATUS.md)
- [docs/PLATFORM_ROADMAP.md](docs/PLATFORM_ROADMAP.md)
