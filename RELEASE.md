# Release Guide

Guia para preparar una entrega del repositorio sin perder consistencia entre codigo, documentacion y experiencia operativa.

## Objetivo

Este documento define que revisar antes de considerar una version del workspace como publicable.

## Checklist de release

| Area | Que validar |
|---|---|
| Sistemas principales | `9090`, `05`, `06` y `09` operativos |
| Documentacion | `README`, indice documental, estado y changelog actualizados |
| Navegacion | Enlaces principales funcionando |
| Docker | Compose, healthchecks y puertos coherentes |
| Estado del repo | Cambios listos para commit y push |

## Flujo recomendado

1. Levanta la plataforma principal.
2. Verifica endpoints y pantallas principales.
3. Revisa docs operativas y de estado.
4. Actualiza [CHANGELOG.md](C:/docker-labs/docker-labs/CHANGELOG.md).
5. Registra el estado en [PROJECT_STATUS.md](C:/docker-labs/docker-labs/PROJECT_STATUS.md) si corresponde.
6. Crea el commit final.

## Que no hacer

- Publicar cambios con el `README` desalineado del estado real.
- Declarar capacidades que no fueron verificadas.
- Mezclar mejoras estructurales con docs sin registrar el cambio.

## Lectura relacionada

- [Changelog](C:/docker-labs/docker-labs/CHANGELOG.md)
- [Project Status](C:/docker-labs/docker-labs/PROJECT_STATUS.md)
- [Runbook](C:/docker-labs/docker-labs/RUNBOOK.md)
