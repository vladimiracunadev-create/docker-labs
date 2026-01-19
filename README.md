# Docker Labs 🧪🐳

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

> **Laboratorio personal de contenedores** para aprender, practicar y dominar Docker mediante ejemplos reales y funcionales.

---

## 🎯 ¿Qué es docker-labs?

docker-labs es una colección curada de **laboratorios Docker independientes**, cada uno diseñado para enseñarte un stack tecnológico específico mediante práctica directa. No es solo teoría—es código funcional que puedes ejecutar en segundos.

**Filosofía**:
- 🔗 **Modular**: Cada lab funciona de forma independiente
- 🎓 **Educativo**: Del nivel básico al avanzado
- 💻 **Práctico**: Código real, no tutoriales abstractos
- 🚀 **Rápido**: Levanta un entorno en menos de 30 segundos
- ☸️ **Kubernetes Ready**: Despliega en clusters K8s con manifiestos incluidos (ver [Guía de Kubernetes](docs/KUBERNETES_DEPLOYMENT.md))

---

## ⚡ Inicio Rápido

### Requisitos Previos

- [Docker](https://docs.docker.com/get-docker/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+
- [Git](https://git-scm.com/downloads)

### Tu Primer Laboratorio (60 segundos)

```bash
# 1. Clona el repositorio
git clone https://github.com/vladimiracunadev-create/docker-labs.git
cd docker-labs

# 2. Levanta el dashboard
docker-compose -f docker-compose-dashboard.yml up

# 3. Abre tu navegador
# http://localhost:9090
```

**¡Listo!** Ya tienes un dashboard para explorar todos los labs. 🎉

---

## 🧪 Laboratorios Disponibles

| Laboratorio | Stack | Puerto | Complejidad | Objetivo |
|-------------|-------|--------|-------------|----------|
| [**01-node-api**](01-node-api/) | Node.js + Express | 3000 | ⭐ Básico | API REST básica |
| [**02-php-lamp**](02-php-lamp/) | PHP + Apache + MariaDB | 8080, 8081 | ⭐⭐ Intermedio | CRUD con base de datos |
| [**03-python-api**](03-python-api/) | Python + Flask | 5000 | ⭐ Básico | API REST con Python |
| [**04-redis-cache**](04-redis-cache/) | Node.js + Redis | 3001 | ⭐⭐ Intermedio | API con caching |
| [**05-postgres-api**](05-postgres-api/) | Python + FastAPI + PostgreSQL | 8000 | ⭐⭐ Intermedio | API con Postgres |
| [**06-nginx-proxy**](06-nginx-proxy/) | Nginx | 8080 | ⭐ Básico | Reverse proxy |
| [**07-rabbitmq-messaging**](07-rabbitmq-messaging/) | Node.js + RabbitMQ | 5672, 15672 | ⭐⭐⭐ Avanzado | Mensajería asíncrona |
| [**08-prometheus-grafana**](08-prometheus-grafana/) | Prometheus + Grafana | 9090, 3000 | ⭐⭐ Intermedio | Monitoreo |
| [**09-multi-service-app**](09-multi-service-app/) | React + Node.js + MongoDB | 8080, 3000 | ⭐⭐⭐ Avanzado | Microservicios |
| [**10-go-api**](10-go-api/) | Go | 8080 | ⭐⭐ Intermedio | API en Go |
| [**11-elasticsearch-search**](11-elasticsearch-search/) | Python + Elasticsearch | 8000, 9200 | ⭐⭐ Intermedio | Búsqueda full-text |
| [**12-jenkins-ci**](12-jenkins-ci/) | Jenkins | 8080 | ⭐⭐⭐ Avanzado | CI/CD pipeline |

> 💡 **¿Nuevo en Docker?** Empieza con `01-node-api` o `03-python-api`. Son los más simples.

---

## 🚀 Características Principales

✅ **Plug & Play**: Copia, ejecuta, aprende  
✅ **Aislamiento Total**: Sin contaminar tu sistema  
✅ **Hot Reload**: Edita código y ve cambios al instante  
✅ **Multi-Stack**: Node.js, PHP, Python, MySQL y más  
✅ **Soporte Kubernetes**: Despliega en clusters K8s con manifiestos incluidos  
✅ **Buenas Prácticas**: Aprende Docker correctamente desde el inicio  
✅ **Dashboard Interactivo**: Verifica el estado de todos los labs en http://localhost:9090  
✅ **Documentación Completa**: Guías para todos los niveles  

---

## 📖 Documentación Completa

### 🎓 Para Principiantes

- 📘 **[Guía para Principiantes](docs/BEGINNERS_GUIDE.md)**: ¿Nuevo en Docker? Empieza aquí
- 🔧 **[Guía de Instalación](docs/INSTALL.md)**: Instala Docker en Windows, macOS o Linux
- 🐳 **[Docker Basics](docs/DOCKER_BASICS.md)**: Conceptos fundamentales explicados

### 📚 Para Usuarios

- 📖 **[Manual de Usuario](docs/USER_MANUAL.md)**: Domina el flujo de trabajo completo
- 📋 **[Catálogo de Laboratorios](docs/LABS_CATALOG.md)**: Detalles técnicos de cada lab
- ☸️ **[Despliegue con Kubernetes](docs/KUBERNETES_DEPLOYMENT.md)**: Migra tus labs a orquestación nativa
- 🐛 **[Troubleshooting](docs/TROUBLESHOOTING.md)**: Soluciones a problemas comunes

### 🏗️ Para Desarrolladores

- 🏛️ **[Arquitectura](docs/ARCHITECTURE.md)**: Diagramas y diseño técnico
- 🔧 **[Specs Técnicas](docs/TECHNICAL_SPECS.md)**: Versiones y estándares
- 🎯 **[Best Practices](docs/BEST_PRACTICES.md)**: Mejores prácticas de Docker

### 🤝 Para Contribuyentes

- 🛠️ **[Guía de Contribución](CONTRIBUTING.md)**: Cómo colaborar
- 🗺️ **[Roadmap](ROADMAP.md)**: Planes futuros del proyecto
- 👥 **[Mantenedores](docs/MAINTAINERS.md)**: Guía para maintainers
- ⚖️ **[Código de Conducta](CODE_OF_CONDUCT.md)**: Normas de la comunidad
- 🛡️ **[Seguridad](SECURITY.md)**: Política de vulnerabilidades

### 📜 Otros

- 📝 **[Changelog](CHANGELOG.md)**: Historial de cambios y versiones

---

## 💡 Casos de Uso

**¿Para qué sirve docker-labs?**

- 🎓 **Aprender Docker**: Sin leer 300 páginas de documentación
- 🧪 **Experimentar**: Prueba stacks sin instalarlos permanentemente
- 🔬 **Comparar**: Node vs Python vs PHP, ¿cuál prefieres?
- 📚 **Enseñar**: Material didáctico para workshops y clases
- 🚀 **Prototipar**: Base rápida para MVPs

---

## 🛠️ Flujo de Trabajo

```
┌─────────┐    ┌─────┐    ┌──────┐    ┌──────┐    ┌──────┐
│  build  │ →  │ up  │ →  │ logs │ →  │ exec │ →  │ down │
└─────────┘    └─────┘    └──────┘    └──────┘    └──────┘
```

Aprende más en el [Manual de Usuario](docs/USER_MANUAL.md).

---

## 🤝 Contribuciones

¡Este proyecto está **abierto a colaboración real**! Queremos que contribuir sea fácil y seguro.

### 🌟 ¿Cómo Ayudar?

- 🐛 **Reporta bugs**: Abre un [issue](https://github.com/vladimiracunadev-create/docker-labs/issues)
- 💡 **Sugiere ideas**: Propón nuevos laboratorios
- 📝 **Mejora docs**: La documentación nunca es suficiente
- 🧪 **Crea labs**: Comparte tu stack favorito
- ⭐ **Dale una estrella**: ¡Nos motiva a seguir!

**Lee nuestra [Guía de Contribución](CONTRIBUTING.md)** para empezar.

### 🛡️ Contribuciones Seguras

- ✅ Código de conducta claro
- ✅ Revisión de PRs constructiva
- ✅ Bienvenida a principiantes (`good-first-issue`)
- ✅ Proceso transparente

---

## 🗺️ Roadmap

**Próximos Laboratorios**:
- 🗄️ PostgreSQL + Node.js/Python
- 🔴 Redis como caché
- 🐰 RabbitMQ (colas)
- 🌐 Nginx como reverse proxy
- 📊 Prometheus + Grafana (observabilidad)

Ver el [ROADMAP completo](ROADMAP.md).

---

## 📊 Estructura del Proyecto

```
docker-labs/
├── docs/                    # 📖 Documentación completa
│   ├── BEGINNERS_GUIDE.md
│   ├── USER_MANUAL.md
│   ├── ARCHITECTURE.md
│   └── ...
├── 01-node-api/                # 🟢 Lab Node.js
├── 02-php-lamp/                # 🐘 Lab PHP+MySQL
├── 03-python-api/              # 🐍 Lab Python
├── README.md                # ← Estás aquí
├── CONTRIBUTING.md          # Guía de contribución
├── CODE_OF_CONDUCT.md       # Código de conducta
├── CHANGELOG.md             # Historial de versiones
└── LICENSE                  # Apache 2.0
```

---

## 📜 Licencia

Este proyecto está licenciado bajo **Apache License 2.0** (ver archivo [LICENSE](LICENSE)).

Las imágenes Docker de terceros (php, mariadb, node, python, etc.) mantienen sus propias licencias.

---

## 🙏 Agradecimientos

- A la comunidad de Docker por crear herramientas increíbles
- A todos los contribuyentes que hacen crecer este proyecto
- A ti, por tomarte el tiempo de aprender 🚀

---

## 📞 Contacto y Soporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/vladimiracunadev-create/docker-labs/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/vladimiracunadev-create/docker-labs/discussions)
- 🛡️ **Seguridad**: Ver [SECURITY.md](SECURITY.md)

---

## ⭐ ¿Te Gusta el Proyecto?

Si te resulta útil:
- ⭐ **Dale una estrella** en GitHub
- 🔄 **Compártelo** con amigos y colegas
- 🤝 **Contribuye** con PRs o ideas
- 📣 **Háblanos** de tu experiencia

---

<p align="center">
  <strong>¡Feliz Dockering! 🐳</strong>
</p>

<p align="center">
  Hecho con ❤️ y ☕ por <a href="https://github.com/vladimiracunadev-create">Vladimir Acuña</a>
</p>




