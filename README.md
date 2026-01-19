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

# 2. Entra a un laboratorio
cd node-api

# 3. Levanta el contenedor
docker-compose up

# 4. Abre tu navegador
# http://localhost:3000
```

**¡Listo!** Ya tienes un servidor Node.js corriendo sin instalar Node en tu máquina. 🎉

---

## 🧪 Laboratorios Disponibles

| Laboratorio | Stack | Puerto | Complejidad | Objetivo |
|-------------|-------|--------|-------------|----------|
| [**node-api**](node-api/) | Node.js + Express | 3000 | ⭐ Básico | API REST básica |
| [**php-lamp**](php-lamp/) | PHP + Apache + MariaDB | 8080, 8081 | ⭐⭐ Intermedio | CRUD con base de datos |
| [**python-api**](python-api/) | Python + Flask | 5000 | ⭐ Básico | API REST con Python |

> 💡 **¿Nuevo en Docker?** Empieza con `node-api` o `python-api`. Son los más simples.

---

## 🚀 Características Principales

✅ **Plug & Play**: Copia, ejecuta, aprende  
✅ **Aislamiento Total**: Sin contaminar tu sistema  
✅ **Hot Reload**: Edita código y ve cambios al instante  
✅ **Multi-Stack**: Node.js, PHP, Python, MySQL y más  
✅ **Buenas Prácticas**: Aprende Docker correctamente desde el inicio  
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
├── node-api/                # 🟢 Lab Node.js
├── php-lamp/                # 🐘 Lab PHP+MySQL
├── python-api/              # 🐍 Lab Python
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




