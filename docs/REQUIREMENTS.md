# Requirements

> **Version**: 1.5  
> **Estado**: Activo  
> **Uso recomendado**: Revisa este documento antes de levantar varios servicios o si quieres saber hasta donde conviene cargar Docker en tu equipo

---

## Requisitos base

| Recurso | Minimo | Recomendado |
|---|---|---|
| CPU | 4 hilos | 6 a 8 hilos |
| RAM del equipo | 8 GB | 16 GB o mas |
| RAM asignada a Docker | 4 GB | 8 GB o mas |
| Disco libre | 15 GB | 30 GB o mas |
| Docker Desktop / Engine | Version moderna con Compose | Version estable reciente |

## Requisitos por escenario

| Escenario | Recomendacion |
|---|---|
| Solo panel `9090` | Muy liviano |
| Panel + un lab | Apto para equipos con recursos medios |
| Plataforma principal | Recomendado con 16 GB de RAM total |
| Labs pesados adicionales | Mejor con mas memoria asignada a Docker |

## Nota importante

Los requisitos reales dependen del modo de uso.  
Por eso el proyecto recomienda levantar el panel primero y despues decidir que sistemas encender.

## Documentos relacionados

- [INSTALL.md](INSTALL.md)
- [../ENVIRONMENT_SETUP.md](../ENVIRONMENT_SETUP.md)
- [../OPERATING-MODES.md](../OPERATING-MODES.md)
