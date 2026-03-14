# Release Guide

> **Version**: 1.4  
> **Estado**: Activo  
> **Uso recomendado**: Para cierres de iteracion, entregas publicas y publicaciones donde el estado del repo debe quedar coherente

---

## Objetivo

Este documento define que revisar antes de considerar una version del workspace como publicable.

## Checklist de release

| Area | Que validar |
|---|---|
| Sistemas principales | `9090`, `05`, `06` y `09` operativos |
| Documentacion | README, recruiter, indice, status y changelog actualizados |
| Navegacion | Enlaces principales funcionando |
| Docker | Compose, healthchecks y puertos coherentes |
| Estado del repo | Cambios listos para commit y push |

## Flujo recomendado

1. Levanta la plataforma principal
2. Verifica endpoints y pantallas principales
3. Revisa docs operativas y de estado
4. Actualiza [CHANGELOG.md](CHANGELOG.md)
5. Ajusta [PROJECT_STATUS.md](PROJECT_STATUS.md) si corresponde
6. Crea el commit final

## Que no hacer

- Publicar cambios con el README desalineado del estado real
- Declarar capacidades que no fueron verificadas
- Mezclar mejoras estructurales con docs sin registrar el cambio

## Documentos relacionados

- [CHANGELOG.md](CHANGELOG.md)
- [PROJECT_STATUS.md](PROJECT_STATUS.md)
- [RUNBOOK.md](RUNBOOK.md)
