# Compatibility

Matriz de compatibilidad y advertencias practicas para ejecutar `docker-labs` en distintos entornos.

## Sistemas operativos

| Sistema | Estado | Comentario |
|---|---|---|
| Windows con Docker Desktop | Recomendado | Entorno principal usado para validar el workspace |
| macOS con Docker Desktop | Compatible | Requiere revisar rutas y rendimiento segun equipo |
| Linux con Docker Engine + Compose | Compatible con ajustes | Puede requerir adaptar scripts `.cmd` |

## Compatibilidad por modo de uso

| Modo | Compatibilidad | Nota |
|---|---|---|
| Solo `9090` | Alta | Ideal para revisar estado y decidir que levantar |
| `05` + `06` + `09` | Alta en equipos medios | Requiere RAM razonable |
| `08` o `11` junto a plataforma principal | Media | Mejor si Docker tiene mas memoria asignada |

## Conflictos comunes

| Recurso | Riesgo |
|---|---|
| Puerto `9090` | Otro panel o servicio local |
| Puerto `8000` | APIs locales o frameworks en desarrollo |
| Puerto `8083` | Frontends o proxies existentes |
| Puerto `8085` | Gateways locales o pruebas previas |

## Recomendaciones

- Usa el diagnostico del panel para decidir el modo de trabajo.
- Prefiere levantar los labs pesados por separado.
- Si usas Linux o macOS, revisa scripts y rutas antes de automatizar.

## Lectura relacionada

- [Requirements](C:/docker-labs/docker-labs/docs/REQUIREMENTS.md)
- [Environment Setup](C:/docker-labs/docker-labs/ENVIRONMENT_SETUP.md)
- [Runbook](C:/docker-labs/docker-labs/RUNBOOK.md)
