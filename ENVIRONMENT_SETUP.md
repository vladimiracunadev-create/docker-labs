# ⚙️ Environment Setup

> **Version**: 1.5.0
> **Estado**: Activo
> **Uso recomendado**: Lee este documento antes de levantar varios labs o si quieres preparar tu equipo de forma profesional

---

## 🎯 Objetivo

Este documento responde una pregunta concreta:

> "Que debo tener listo en mi equipo antes de operar `docker-labs` con comodidad?"

Si solo quieres instalar y correr el proyecto, empieza por [docs/INSTALL.md](docs/INSTALL.md).  
Si quieres preparar bien el host, Docker y el orden de trabajo, esta es la guia correcta.

## ✅ Checklist rapido

| Item | Estado esperado | Abrir |
|---|---|---|
| Docker Desktop / Engine | Instalado y corriendo | [Install Guide](docs/INSTALL.md) |
| Docker Compose | Disponible mediante `docker compose` | [Tooling](docs/TOOLING.md) |
| Git | Disponible para versionado y colaboracion | [Developing](DEVELOPING.md) |
| Disco libre | Suficiente para imagenes, volumenes y builds | [Requirements](docs/REQUIREMENTS.md) |
| RAM asignada a Docker | Ajustada al modo de uso | [Operating Modes](OPERATING-MODES.md) |

## Preparacion recomendada

### 1. Verifica Docker

```powershell
docker version
docker info
```

Si el panel `9090` esta arriba, revisa tambien:

- [http://localhost:9090/api/diagnostics](http://localhost:9090/api/diagnostics)

### 2. Ajusta recursos antes de cargar el workspace

| Escenario | RAM sugerida para Docker | Comentario |
|---|---|---|
| Solo panel + un lab | 4 a 6 GB | Aceptable para equipos justos |
| Plataforma principal (`05` + `06` + `09` + `9090`) | 8 GB o mas | Recomendado para demos y trabajo comodo |
| Labs pesados (`08`, `11`, `12`) | 10 a 12 GB o mas | Mejor si se levantan por separado |

## Orden sugerido de arranque

1. Levanta el panel principal
2. Revisa diagnostico del host y de Docker
3. Levanta `05-postgres-api`
4. Levanta `09-multi-service-app`
5. Levanta `06-nginx-proxy`
6. Solo despues suma labs complementarios

## Problemas comunes antes de empezar

| Sintoma | Causa probable | Abrir |
|---|---|---|
| `localhost` no responde | Contenedor arriba, pero sin servicio util o sin puerto correcto | [Technical Specs](docs/TECHNICAL_SPECS.md) |
| Docker arranca lento | Recursos bajos o acumulacion de imagenes y volumenes | [Runbook](RUNBOOK.md) |
| `9090` no aparece | El Control Center no esta levantado | [Dashboard Setup](docs/DASHBOARD_SETUP.md) |
| Conflictos de puertos | Otro servicio usa el mismo puerto | [Compatibility](COMPATIBILITY.md) |

## Documentos relacionados

- [docs/INSTALL.md](docs/INSTALL.md)
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)
- [OPERATING-MODES.md](OPERATING-MODES.md)
- [RUNBOOK.md](RUNBOOK.md)
