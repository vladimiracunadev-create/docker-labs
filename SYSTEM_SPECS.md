# System Specs

Resumen ejecutivo de las especificaciones del sistema para quienes necesitan una lectura rapida de capacidades y componentes.

## Objetivo

Este documento no reemplaza a [Technical Specs](C:/docker-labs/docker-labs/docs/TECHNICAL_SPECS.md).  
Existe para dar una vista corta y profesional del sistema como producto y workspace.

## Componentes principales

| Componente | Stack | Puerto principal | Estado esperado |
|---|---|---|---|
| Control Center | Node.js + Express | `9090` | Operativo |
| Inventory Core | FastAPI + PostgreSQL | `8000` | Operativo |
| Operations Portal | Node.js + MongoDB + Nginx | `8083` | Operativo |
| Platform Gateway | Nginx | `8085` | Operativo |

## Capacidades visibles

| Capacidad | Presente |
|---|---|
| Control Docker por lab | Si |
| Diagnostico de host y Docker | Si |
| Navegacion entre sistemas | Si |
| Swagger para API principal | Si |
| Learning Center integrado | Si |
| Gateway comun | Si |

## Requisitos operativos recomendados

| Escenario | Sugerencia |
|---|---|
| Desarrollo liviano | Panel + 1 lab |
| Demo principal | `9090` + `05` + `06` + `09` |
| Infraestructura avanzada | Levantar servicios pesados de forma aislada |

## Lectura relacionada

- [Technical Specs](C:/docker-labs/docker-labs/docs/TECHNICAL_SPECS.md)
- [Requirements](C:/docker-labs/docker-labs/docs/REQUIREMENTS.md)
- [Compatibility](C:/docker-labs/docker-labs/COMPATIBILITY.md)
