# System Specs

> **Version**: 1.4  
> **Estado**: Activo  
> **Uso recomendado**: Vista ejecutiva del sistema para entender capacidades y componentes sin entrar todavia al detalle tecnico

---

## Resumen de componentes principales

| Componente | Stack | Puerto principal | Estado esperado |
|---|---|---|---|
| Control Center | Node.js + Express | `9090` | Operativo |
| Inventory Core | FastAPI + PostgreSQL | `8000` | Operativo |
| Operations Portal | Node.js + MongoDB + Nginx | `8083` | Operativo |
| Platform Gateway | Nginx | `8085` | Operativo |

## Capacidades visibles

| Capacidad | Presencia |
|---|---|
| Control Docker por lab | Si |
| Diagnostico de host y Docker | Si |
| Navegacion entre sistemas | Si |
| Swagger para API principal | Si |
| Learning Center integrado | Si |
| Gateway comun | Si |

## Rutas principales del usuario

| Entrada | Uso |
|---|---|
| [http://localhost:9090](http://localhost:9090) | Control y diagnostico del workspace |
| [http://localhost:8000](http://localhost:8000) | Inventory Core |
| [http://localhost:8000/docs](http://localhost:8000/docs) | Swagger del core |
| [http://localhost:8083](http://localhost:8083) | Operations Portal |
| [http://localhost:8085](http://localhost:8085) | Platform Gateway |

## Requisitos operativos recomendados

| Escenario | Recomendacion |
|---|---|
| Desarrollo liviano | Panel + un lab |
| Demo principal | `9090` + `05` + `06` + `09` |
| Infraestructura avanzada | Levantar servicios pesados de forma aislada |

## Documentos relacionados

- [docs/TECHNICAL_SPECS.md](docs/TECHNICAL_SPECS.md)
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)
- [COMPATIBILITY.md](COMPATIBILITY.md)
