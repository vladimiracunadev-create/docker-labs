# Environment Setup

Guia de preparacion del entorno local para trabajar con `docker-labs` sin perder tiempo en diagnosticos basicos.

## Objetivo

Este documento existe para responder una pregunta concreta:

> "¿Que debo tener listo en mi equipo antes de levantar el workspace?"

Si solo quieres instalar y correr el proyecto, parte por [Install Guide](C:/docker-labs/docker-labs/docs/INSTALL.md).  
Si quieres dejar tu maquina realmente lista para operar el repo con comodidad, sigue esta guia.

## Checklist rapido

| Item | Estado esperado | Referencia |
|---|---|---|
| Docker Desktop | Instalado y corriendo | [Install Guide](C:/docker-labs/docker-labs/docs/INSTALL.md) |
| Docker Compose | Disponible mediante `docker compose` | [Tooling](C:/docker-labs/docker-labs/docs/TOOLING.md) |
| PowerShell | Disponible para scripts y operaciones locales | [Runbook](C:/docker-labs/docker-labs/RUNBOOK.md) |
| Git | Disponible para versionado y colaboracion | [Developing](C:/docker-labs/docker-labs/DEVELOPING.md) |
| Espacio en disco | Libre para imagenes, volumenes y builds | [Requirements](C:/docker-labs/docker-labs/docs/REQUIREMENTS.md) |
| RAM asignada a Docker | Ajustada segun el modo de uso | [Operating Modes](C:/docker-labs/docker-labs/OPERATING-MODES.md) |

## Preparacion recomendada

### 1. Verifica Docker Desktop

Confirma que Docker este levantado y que el runtime responda:

```powershell
docker version
docker info
```

Si el panel `9090` ya esta arriba, tambien puedes revisar el diagnostico en:

- [http://localhost:9090/api/diagnostics](http://localhost:9090/api/diagnostics)

### 2. Ajusta recursos de Docker

Antes de levantar varios labs a la vez, valida los recursos asignados a Docker Desktop.

Escenario recomendado:

| Modo de trabajo | RAM sugerida para Docker | Comentario |
|---|---|---|
| Solo panel + un lab | 4 a 6 GB | Aceptable para equipos justos |
| Plataforma principal (`05` + `06` + `09` + `9090`) | 8 GB o mas | Modo recomendado para demos |
| Labs pesados adicionales (`08`, `11`, `12`) | 10 a 12 GB o mas | Mejor si se levantan por separado |

## Orden de arranque sugerido

1. Levanta el panel principal.
2. Revisa diagnostico del host y de Docker.
3. Levanta `05-postgres-api`.
4. Levanta `09-multi-service-app`.
5. Levanta `06-nginx-proxy`.
6. Solo despues suma labs complementarios.

## Problemas comunes antes de empezar

| Sintoma | Causa probable | Que revisar |
|---|---|---|
| `localhost` no responde | Contenedor arriba, pero sin puerto publicado o sin servicio activo | [Technical Specs](C:/docker-labs/docker-labs/docs/TECHNICAL_SPECS.md) |
| Docker arranca lento | Recursos bajos o demasiadas imagenes/volumenes | [Runbook](C:/docker-labs/docker-labs/RUNBOOK.md) |
| `9090` no aparece | El Control Center no esta levantado | [Dashboard Setup](C:/docker-labs/docker-labs/docs/DASHBOARD_SETUP.md) |
| Conflictos de puertos | Otro servicio usa el mismo puerto | [Compatibility](C:/docker-labs/docker-labs/COMPATIBILITY.md) |

## Lectura relacionada

- [Install Guide](C:/docker-labs/docker-labs/docs/INSTALL.md)
- [Requirements](C:/docker-labs/docker-labs/docs/REQUIREMENTS.md)
- [Operating Modes](C:/docker-labs/docker-labs/OPERATING-MODES.md)
- [Runbook](C:/docker-labs/docker-labs/RUNBOOK.md)
