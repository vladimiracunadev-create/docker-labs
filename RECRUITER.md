# 👀 Guia Estrategica para Reclutadores (RECRUITER)

> **Version**: 1.4  
> **Estado**: 🟢 Operativo  
> **Audiencia**: 👥 Reclutadores, hiring managers, lideres tecnicos  
> **Executive Summary**: `docker-labs` demuestra criterio para transformar laboratorios Docker en una plataforma modular con control centralizado, backend transaccional, portal operativo y gateway comun.

---

## 💼 Valor de negocio y vision

Este proyecto no intenta impresionar con cantidad de carpetas. Su valor esta en mostrar como un repositorio de laboratorios puede evolucionar hacia una experiencia de workspace mas seria, navegable y auditable.

### 📌 Que evidencia entrega hoy

| Area | Evidencia |
|---|---|
| Docker / Compose | Operacion de multiples stacks desde un panel central |
| Backend | Core transaccional con FastAPI y PostgreSQL |
| Full stack | Portal operativo conectado a un backend real |
| Infraestructura | Gateway Nginx y control de entorno |
| **Distribucion Windows** | Instalador `.exe` profesional (Inno Setup + Go), publicado automaticamente en GitHub Releases via CI |
| **Go / compilacion** | Launcher Go compilado a binario nativo, sin dependencias externas, con calculo dinamico de rutas |
| **CI/CD completo** | GitHub Actions: build del launcher, empaquetado con Inno Setup, creacion del Release y adjunto del asset |
| **Automatizacion con IA** | Skills de Claude Code (`docker-labs-release`, `docker-labs-status`) que automatizan el flujo de release y el diagnostico del sistema en lenguaje natural |
| Documentacion | 25+ documentos en español, por audiencia, con rutas de lectura claras |

## ⚡ Que mirar en 5 minutos

Si quieres evaluar el repo rapido, este es el recorrido recomendado:

1. Abre [README.md](README.md) — historia principal y capacidades
2. Revisa [PROJECT_STATUS.md](PROJECT_STATUS.md) — estado consolidado
3. Entra a [http://localhost:9090](http://localhost:9090) — plataforma en vivo
4. Abre [05-postgres-api/README.md](05-postgres-api/README.md) — core transaccional
5. Abre [09-multi-service-app/README.md](09-multi-service-app/README.md) — portal operativo
6. Revisa [docs/windows-installer.md](docs/windows-installer.md) — distribucion y pensamiento de producto
7. Revisa [GitHub Releases](https://github.com/vladimiracunadev-create/docker-labs/releases) — el `.exe` publicado automaticamente

Con ese recorrido se entiende la historia principal del repositorio y la capa de producto completa sin necesidad de revisar los 12 labs.

## 🏗️ Decisiones arquitectonicas que vale la pena notar

1. **Panel dockerizado como entrada principal**
   El workspace no depende de recordar puertos sueltos; se gobierna desde `9090`.

2. **Core transaccional antes que frontend vistoso**
   La implementacion partio por `05-postgres-api` para definir dominio, salud y contratos.

3. **Gateway como capa de integracion**
   `06-nginx-proxy` convierte servicios separados en una experiencia de plataforma.

4. **Modo caso a caso segun capacidad del host**
   El proyecto incorpora diagnostico de recursos para decidir que conviene levantar.

5. **Distribucion Windows como producto, no como script**
   El instalador no es un ZIP — es un asistente de instalacion (Inno Setup), con un launcher Go que valida Docker Desktop, levanta los 4 servicios core en paralelo y abre el browser automaticamente. El binario se publica en GitHub Releases via CI al pushear un tag.

6. **Automatizacion operativa con IA**
   Los skills `docker-labs-release` y `docker-labs-status` en Claude Code permiten ejecutar el flujo completo de release o consultar el estado del sistema en lenguaje natural — sin recordar comandos git ni puertos.

## 🧠 Habilidades tecnicas demostradas

| Area | Competencias visibles |
|---|---|
| Backend | FastAPI, modelado transaccional, PostgreSQL, healthchecks |
| Frontend / integracion | Portal operativo, consumo de API, navegacion cruzada |
| DevOps | Docker, Compose, gateway, healthchecks, CI base |
| **Go** | Launcher compilado a `.exe`, stdlib pura, calculo dinamico de rutas Docker-in-Docker |
| **Packaging Windows** | Inno Setup 6, instalador sin requisito de administrador, desinstalador limpio |
| **CI/CD avanzado** | GitHub Actions: build, empaquetado, creacion automatica de Release y adjunto del asset |
| **Distribucion de producto** | GitHub Releases como canal de artefactos, SHA-256, builds reproducibles |
| **Automatizacion con IA** | Skills de Claude Code para operaciones frecuentes del proyecto |
| Operacion | Diagnostico del host, runbook, modos de uso, troubleshooting |
| Documentacion | 25+ documentos en español, por audiencia, con rutas de lectura claras |

## 📊 Estado actual

| Componente | Estado | Lectura recomendada |
|---|---|---|
| `dashboard-control` | 🟢 Operativo | [docs/DASHBOARD_SETUP.md](docs/DASHBOARD_SETUP.md) |
| `05-postgres-api` | 🟢 Operativo | [05-postgres-api/README.md](05-postgres-api/README.md) |
| `09-multi-service-app` | 🟢 Operativo | [09-multi-service-app/README.md](09-multi-service-app/README.md) |
| `06-nginx-proxy` | 🟢 Operativo | [06-nginx-proxy/README.md](06-nginx-proxy/README.md) |
| **Instalador Windows** | 🟢 Operativo | [docs/windows-installer.md](docs/windows-installer.md) |
| **Skills Claude Code** | 🟢 Activos | [DEVELOPING.md](DEVELOPING.md#skills-de-automatizacion-claude-code) |
| Labs secundarios | 🟡 En evolucion | [docs/LABS_CATALOG.md](docs/LABS_CATALOG.md) |

## ✅ Lo que el proyecto si es hoy

- un workspace local util y demostrable
- un activo de portafolio tecnico con narrativa clara
- una base coherente para crecer hacia una plataforma mas madura

## 🚧 Lo que todavia no intenta vender

- un reemplazo completo de Docker Desktop
- una plataforma productiva cerrada
- doce labs ya homologados al mismo nivel de profundidad

## 📚 Documentos a revisar despues

| Documento | Motivo |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Entender la estructura del sistema |
| [docs/TECHNICAL_SPECS.md](docs/TECHNICAL_SPECS.md) | Ver stacks, puertos y contratos |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | Validar costo operativo real del entorno |
| [docs/windows-installer.md](docs/windows-installer.md) | Ver la capa de distribucion Windows completa |
| [docs/technical-audit.md](docs/technical-audit.md) | Ver el diagnostico tecnico del repo y correcciones aplicadas |
| [CHANGELOG.md](CHANGELOG.md) | Historial de decisiones y evoluccion del proyecto |
| [docs/PLATFORM_ROADMAP.md](docs/PLATFORM_ROADMAP.md) | Conocer direccion y madurez futura |

> [!TIP]
> Si deseas evaluar el repositorio sin entrar al codigo de inmediato, descarga el instalador desde [GitHub Releases](https://github.com/vladimiracunadev-create/docker-labs/releases/latest), ejecutalo y en 2 clicks tendras la plataforma completa corriendo en tu maquina.
