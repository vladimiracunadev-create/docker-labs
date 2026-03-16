# 👀 Guía Estratégica para Reclutadores (RECRUITER)

> **Versión**: 1.4
> **Estado**: 🟢 Operativo
> **Audiencia**: 👥 Reclutadores, hiring managers, líderes técnicos
> **Executive Summary**: `docker-labs` demuestra criterio para transformar laboratorios Docker en una plataforma modular con control centralizado, backend transaccional, portal operativo y gateway común.

---

## 💼 Valor de negocio y visión

Este proyecto no intenta impresionar con cantidad de carpetas. Su valor está en mostrar cómo un repositorio de laboratorios puede evolucionar hacia una experiencia de workspace más seria, navegable y auditable.

### 📌 Qué evidencia entrega hoy

| Área | Evidencia |
|---|---|
| Docker / Compose | Operación de múltiples stacks desde un panel central |
| Backend | Core transaccional con FastAPI y PostgreSQL |
| Full stack | Portal operativo conectado a un backend real |
| Infraestructura | Gateway Nginx y control de entorno |
| **Distribución Windows** | Instalador `.exe` profesional (Inno Setup + Go), publicado automáticamente en GitHub Releases vía CI |
| **Go / compilación** | Launcher Go compilado a binario nativo, sin dependencias externas, con cálculo dinámico de rutas |
| **CI/CD completo** | GitHub Actions: build del launcher, empaquetado con Inno Setup, creación del Release y adjunto del asset |
| **Automatización con IA** | Skills de Claude Code (`docker-labs-release`, `docker-labs-status`) que automatizan el flujo de release y el diagnóstico del sistema en lenguaje natural |
| Documentación | 25+ documentos en español, por audiencia, con rutas de lectura claras |

## ⚡ Qué mirar en 5 minutos

Si quieres evaluar el repo rápido, este es el recorrido recomendado:

1. Abre [README.md](README.md) — historia principal y capacidades
2. Revisa [PROJECT_STATUS.md](PROJECT_STATUS.md) — estado consolidado
3. Entra a [http://localhost:9090](http://localhost:9090) — plataforma en vivo
4. Abre [05-postgres-api/README.md](05-postgres-api/README.md) — core transaccional
5. Abre [09-multi-service-app/README.md](09-multi-service-app/README.md) — portal operativo
6. Revisa [docs/windows-installer.md](docs/windows-installer.md) — distribución y pensamiento de producto
7. Revisa [GitHub Releases](https://github.com/vladimiracunadev-create/docker-labs/releases) — el `.exe` publicado automáticamente

Con ese recorrido se entiende la historia principal del repositorio y la capa de producto completa sin necesidad de revisar los 12 labs.


## 🏗️ Decisiones arquitectónicas que vale la pena notar

1. **Panel dockerizado como entrada principal**
   El workspace no depende de recordar puertos sueltos; se gobierna desde `9090`.

2. **Core transaccional antes que frontend vistoso**
   La implementación partió por `05-postgres-api` para definir dominio, salud y contratos.

3. **Gateway como capa de integración**
   `06-nginx-proxy` convierte servicios separados en una experiencia de plataforma.

4. **Modo caso a caso según capacidad del host**
   El proyecto incorpora diagnóstico de recursos para decidir qué conviene levantar.

5. **Distribución Windows como producto, no como script**
   El instalador no es un ZIP — es un asistente de instalación (Inno Setup), con un launcher Go que valida Docker Desktop, levanta los 4 servicios core en paralelo y abre el browser automáticamente. El binario se publica en GitHub Releases vía CI al pushear un tag.

6. **Automatización operativa con IA**
   Los skills `docker-labs-release` y `docker-labs-status` en Claude Code permiten ejecutar el flujo completo de release o consultar el estado del sistema en lenguaje natural — sin recordar comandos git ni puertos.

## 🧠 Habilidades técnicas demostradas

| Área | Competencias visibles |
|---|---|
| **Docker / DevOps** | Docker, Compose, gateway Nginx, healthchecks, CI base, operación de múltiples stacks |
| **Backend** | FastAPI, modelado transaccional, PostgreSQL, healthchecks, contratos REST |
| Frontend / integración | Portal operativo, consumo de API, navegación cruzada |
| **Go** | Launcher compilado a `.exe`, stdlib pura, cálculo dinámico de rutas Docker-in-Docker |
| **CI/CD avanzado** | GitHub Actions: build, empaquetado, creación automática de Release y adjunto del asset |
| **Packaging Windows** | Inno Setup 6, instalador sin requisito de administrador, desinstalador limpio |
| **Distribución de producto** | GitHub Releases como canal de artefactos, SHA-256, builds reproducibles |
| **Automatización con IA** | Skills de Claude Code para operaciones frecuentes del proyecto |
| Operación | Diagnóstico del host, runbook, modos de uso, troubleshooting |
| Documentación | 25+ documentos en español, por audiencia, con rutas de lectura claras |

## 📊 Estado actual

| Componente | Estado | Lectura recomendada |
|---|---|---|
| `dashboard-control` | 🟢 Operativo | [docs/DASHBOARD_SETUP.md](docs/DASHBOARD_SETUP.md) |
| `05-postgres-api` | 🟢 Operativo | [05-postgres-api/README.md](05-postgres-api/README.md) |
| `09-multi-service-app` | 🟢 Operativo | [09-multi-service-app/README.md](09-multi-service-app/README.md) |
| `06-nginx-proxy` | 🟢 Operativo | [06-nginx-proxy/README.md](06-nginx-proxy/README.md) |
| **Instalador Windows** | 🟢 Operativo | [docs/windows-installer.md](docs/windows-installer.md) |
| **Skills Claude Code** | 🟢 Activos | [DEVELOPING.md](DEVELOPING.md#skills-de-automatizacion-claude-code) |
| Labs secundarios | 🟡 En evolución | [docs/LABS_CATALOG.md](docs/LABS_CATALOG.md) |

## ✅ Lo que el proyecto sí es hoy

- un workspace local útil y demostrable
- un activo de portafolio técnico con narrativa clara
- una base coherente para crecer hacia una plataforma más madura
- un instalador Windows profesional descargable desde GitHub Releases

## 🚧 Lo que todavía no intenta vender

- un reemplazo completo de Docker Desktop
- una plataforma productiva cerrada
- doce labs ya homologados al mismo nivel de profundidad

## 📚 Documentos a revisar después

| Documento | Motivo |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Entender la estructura del sistema |
| [docs/TECHNICAL_SPECS.md](docs/TECHNICAL_SPECS.md) | Ver stacks, puertos y contratos |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | Validar costo operativo real del entorno |
| [docs/windows-installer.md](docs/windows-installer.md) | Ver la capa de distribución Windows completa |
| [docs/technical-audit.md](docs/technical-audit.md) | Ver el diagnóstico técnico del repo y correcciones aplicadas |
| [CHANGELOG.md](CHANGELOG.md) | Historial de decisiones y evolución del proyecto |
| [docs/PLATFORM_ROADMAP.md](docs/PLATFORM_ROADMAP.md) | Conocer dirección y madurez futura |

> [!TIP]
> Si deseas evaluar el repositorio sin entrar al código de inmediato, descarga el instalador desde [GitHub Releases](https://github.com/vladimiracunadev-create/docker-labs/releases/latest), ejecutalo y en 2 clicks tendrás la plataforma completa corriendo en tu máquina. Los skills de Claude Code (`docker-labs-release`, `docker-labs-status`) permiten además gestionar releases y consultar el estado del sistema en lenguaje natural.
