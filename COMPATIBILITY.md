# Compatibility

> **Version**: 1.4  
> **Estado**: Activo  
> **Uso recomendado**: Revisa este documento si vas a operar el repo en otro sistema, si sospechas conflictos de puertos o si tienes un host limitado

---

## Compatibilidad por sistema operativo

| Sistema | Estado | Comentario |
|---|---|---|
| Windows con Docker Desktop | Recomendado | Entorno principal usado para validar el workspace |
| macOS con Docker Desktop | Compatible | Puede requerir revisar rutas y rendimiento |
| Linux con Docker Engine + Compose | Compatible con ajustes | Los scripts `.cmd` no aplican de forma directa |

## Compatibilidad por modo de uso

| Modo | Compatibilidad | Nota |
|---|---|---|
| Solo `9090` | Alta | Ideal para revisar estado y decidir que levantar |
| `05` + `06` + `09` | Alta en equipos medios | Requiere RAM razonable |
| `08` o `11` junto a la plataforma principal | Media | Mejor si Docker tiene mas memoria asignada |

## Conflictos comunes de puertos

| Puerto | Riesgo frecuente |
|---|---|
| `9090` | Otro panel o servicio local |
| `8000` | APIs locales o frameworks en desarrollo |
| `8083` | Frontends o proxies existentes |
| `8085` | Gateways locales o pruebas previas |

## Recomendaciones operativas

- Usa el diagnostico del panel antes de levantar varios labs
- Prefiere levantar servicios pesados por separado
- Si trabajas fuera de Windows, valida rutas y scripts antes de automatizar

## Documentos relacionados

- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)
- [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)
- [RUNBOOK.md](RUNBOOK.md)
