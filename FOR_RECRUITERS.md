# 👀 For Recruiters

Guia rapida para evaluar `docker-labs` como pieza de portafolio tecnico.

## 🧭 Que es

`docker-labs` evoluciono desde una coleccion de laboratorios Docker hacia una plataforma modular con cuatro piezas visibles:

| Componente | Estado | Valor |
|---|---|---|
| `05-postgres-api` | 🟢 Funcional | Backend transaccional serio |
| `09-multi-service-app` | 🟢 Funcional | Portal operativo integrado |
| `06-nginx-proxy` | 🟢 Funcional | Gateway de acceso |
| `dashboard-control` | 🟢 Funcional | Workspace y diagnostico |

## 💼 Que demuestra

- Docker y Docker Compose aplicados a multiples stacks
- integracion entre servicios
- modelado backend con FastAPI y PostgreSQL
- frontend/backend adicional con MongoDB
- capa de gateway y experiencia de workspace
- documentacion tecnica con enfoque de producto

## ⚡ Como revisarlo rapido

1. abrir el panel principal en [http://localhost:9090](http://localhost:9090)
2. revisar el diagnostico del runtime
3. abrir `Inventory Core`
4. abrir `Operations Portal`
5. abrir `Platform Gateway`

Con eso se entiende la historia principal del repositorio sin recorrer las 12 carpetas.

## 🔎 Que mirar

### Criterio tecnico

- [05-postgres-api](C:/docker-labs/docker-labs/05-postgres-api/README.md)
- [09-multi-service-app](C:/docker-labs/docker-labs/09-multi-service-app/README.md)
- [06-nginx-proxy](C:/docker-labs/docker-labs/06-nginx-proxy/README.md)
- [dashboard-control/server.js](C:/docker-labs/docker-labs/dashboard-control/server.js)

### Criterio de producto

- el repositorio no se vende como demos sueltas
- los sistemas principales tienen objetivo y relacion entre si
- existe una entrada operativa comun

### Criterio documental

- [README](C:/docker-labs/docker-labs/README.md)
- [Architecture](C:/docker-labs/docker-labs/docs/ARCHITECTURE.md)
- [Project Status](C:/docker-labs/docker-labs/PROJECT_STATUS.md)
- [Platform Roadmap](C:/docker-labs/docker-labs/docs/PLATFORM_ROADMAP.md)

## 📌 Estado actual

El proyecto ya funciona como:

- workspace local util
- activo de portafolio tecnico
- base de evolucion hacia una plataforma mas integrada

Todavia no intenta ser:

- un reemplazo completo de Docker Desktop
- una plataforma productiva final
- un set de 12 labs totalmente homogeneos

## 📚 Lectura recomendada

- [README](C:/docker-labs/docker-labs/README.md)
- [For Recruiters](C:/docker-labs/docker-labs/FOR_RECRUITERS.md)
- [Project Status](C:/docker-labs/docker-labs/PROJECT_STATUS.md)
- [Platform Roadmap](C:/docker-labs/docker-labs/docs/PLATFORM_ROADMAP.md)
