# Roadmap 🗺️

Plan estratégico y hoja de ruta de **docker-labs**.

---

## 🎯 Visión

Hacer de `docker-labs` un **repositorio didáctico de referencia** con laboratorios prácticos que cubran:

- 🐳 Docker + Docker Compose (fundamentos y avanzado)
- 🔧 Stacks modernos: Node.js, Python, PHP, Go, Rust
- 🗄️ Bases de datos: PostgreSQL, MongoDB, Redis
- 📨 Colas y mensajería: RabbitMQ, Kafka
- 🌐 Reverse proxies y balanceo: Nginx, Traefik
- 📊 Observabilidad: Prometheus, Grafana, ELK
- 🔐 Seguridad y CI/CD
- ☁️ Deploy a cloud (AWS, GCP, Azure)

---

## 📊 Estado Actual (v1.0.0)

| Componente | Estado | Notas |
|------------|--------|-------|
| **Documentación** | ✅ Completa | 11 guías + políticas |
| **Labs básicos** | ✅ 3 labs | node-api, php-lamp, python-api |
| **CI/CD** | ❌ Pendiente | GitHub Actions planeado |
| **Tests automatizados** | ❌ Pendiente | Q1 2026 |

---

## 🚀 Prioridades (Corto Plazo - Q1 2026)

### ⭐ Alta Prioridad

| Item | Descripción | Progreso |
|------|-------------|----------|
| **Templates documentación** | Estandarizar Dockerfile y .env.example | 🟡 50% |
| **Tests básicos** | Smoke tests para cada lab | 🔴 0% |
| **Linters** | ESLint, Pylint, PHP_CodeSniffer | 🔴 0% |
| **GitHub Actions** | CI básico para PRs | 🔴 0% |

**Issues relacionados**: #1, #2 (ejemplos)

---

## 🎯 Objetivos (Mediano Plazo - Q2 2026)

### 🗄️ Nuevos Laboratorios

| Lab | Stack | Complejidad | Status |
|-----|-------|-------------|--------|
| **postgres-db** | PostgreSQL + pgAdmin | ⭐⭐ | 📝 Planeado |
| **mongo-db** | MongoDB + Mongo Express | ⭐⭐ | 📝 Planeado |
| **redis-cache** | Redis + RedisInsight | ⭐ | 📝 Planeado |
| **go-api** | Go + Gin framework | ⭐⭐ | 📝 Planeado |

### 🔐 Funcionalidades

- [ ] Laboratorio con autenticación JWT
- [ ] Persistencia avanzada (volúmenes nombrados)
- [ ] Ejemplo con Traefik como reverse proxy
- [ ] Nginx + SSL/TLS  (Let's Encrypt)

---

## 💡 Ideas (Largo Plazo - H2 2026)

### 📊 Observabilidad

- [ ] Prometheus + Grafana (métricas)
- [ ] ELK Stack (logs centralizados)
- [ ] Jaeger (distributed tracing)

### 🔄 Orquestación

- [ ] Docker Swarm (ejemplo básico)
- [ ] Kubernetes intro (Minikube)
- [ ] Helm charts básicos

### ☁️ Cloud Native

- [ ] Deploy a AWS (ECS/Fargate)
- [ ] Deploy a GCP (Cloud Run)
- [ ] GitHub Actions → Docker Hub → Cloud

### 🧪 Labs Avanzados

- [ ] Microservicios communicando (gRPC)
- [ ] WebSockets con Socket.io
- [ ] GraphQL API (Apollo Server)
- [ ] Rust + Actix Web
- [ ] Deno runtime

---

## 🤝 ¿Cómo Contribuir al Roadmap?

1. **Propón nuevas funcionalidades**:
   - Abre un [issue](https://github.com/vladimiracunadev-create/docker-labs/issues/new)
   - Etiqueta: `enhancement` o `new-lab`
   - Describe: qué, por qué, para quién

2. **Vota por prioridades**:
   - 👍 en issues existentes para aumentar prioridad
   - Comenta casos de uso

3. **Implementa items del roadmap**:
   - Busca issues etiquetados `roadmap`
   - Comenta que trabajarás en ello
   - Abre PR siguiendo [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📅 Timeline Estimado

```
Q1 2026 (Ene-Mar)
├── ✅ Documentación profesional [COMPLETADO]
├── 🟡 Templates y estandarización [En progreso]
├── 🔴 Tests básicos [Pendiente]
└── 🔴 CI/CD con GitHub Actions [Pendiente]

Q2 2026 (Abr-Jun)
├── 🆕 4 nuevos laboratorios
├── 🔐 Autenticación y seguridad
└── 🌐 Reverse proxy examples

Q3 2026 (Jul-Sep)
├── 📊 Observabilidad (Prometheus/Grafana)
├── ☁️ Cloud deploys (AWS/GCP)
└── 🧪 Labs avanzados (microservicios)

Q4 2026 (Oct-Dic)
├── 🔄 Kubernetes intro
├── 📈 Métricas de adoption
└── 📖 E-books / tutoriales video
```

---

## 🎯 Métricas de Éxito

| Métrica | Meta Q2 | Meta Q4 |
|---------|---------|---------|
| ⭐ GitHub Stars | 100 | 500 |
| 🔀 Forks | 20 | 100 |
| 🧪 Laboratorios | 7 | 15 |
| 👥 Contribuyentes | 5 | 20 |
| 📖 Guías de docs | 11 | 20 |

---

## 🔄 Actualización del Roadmap

Este roadmap se actualiza:
- **Mensualmente**: Revisión de prioridades
- **Cada Release**: Ajuste de timeline
- **Con feedback**: Issues y discussions

**Última actualización**: 2026-01-19  
**Próxima revisión**: 2026-02-15

---

## 💬 Feedback

¿Falta algo importante? ¿Tienes una idea mejor?

- 💡 Abre una [Discussion](https://github.com/vladimiracunadev-create/docker-labs/discussions)
- 🐛 Comenta en [Issues existentes](https://github.com/vladimiracunadev-create/docker-labs/issues)
- 📧 Contacta a mantenedores (ver [MAINTAINERS.md](docs/MAINTAINERS.md))

---

← [Volver al README](README.md)
