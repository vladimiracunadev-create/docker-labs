# Operating Modes

> **Version**: 1.5  
> **Estado**: Activo  
> **Uso recomendado**: Abre este documento si no sabes si conviene levantar todo o solo una parte del repositorio

---

## Modo 1: Panel primero

Levanta solo el Control Center en `9090`.

| Cuando usarlo | Ventaja |
|---|---|
| No sabes aun que lab abrir | Tomas decisiones con diagnostico real |
| Tienes recursos limitados | Evitas cargar Docker sin necesidad |
| Quieres revisar el estado del entorno | El panel te muestra capacidad y estado |

## Modo 2: Caso a caso

Levanta el panel y un solo lab operativo segun necesidad.

| Escenario | Ejemplo |
|---|---|
| Aprender un stack puntual | `9090` + `05` |
| Mostrar una capacidad concreta | `9090` + `06` |
| Trabajar con host limitado | `9090` + `09` |

## Modo 3: Plataforma principal

Levanta `9090`, `05`, `06` y `09`.

| Cuando usarlo | Valor |
|---|---|
| Demo profesional del repo | Muestra la historia principal completa |
| Revisión de integracion | Se valida panel, core, portal y gateway |
| Trabajo funcional sobre la plataforma | Entorno mas cercano a la experiencia objetivo |

## Modo 4: Infra especializada

Levanta un servicio pesado como `08`, `11` o `12`, idealmente sin saturar la plataforma principal.

## Recomendacion operativa

1. Empieza por `9090`
2. Revisa diagnostico
3. Elige el modo de trabajo
4. Si Docker queda justo, baja todo antes de probar otro escenario

## Documentos relacionados

- [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)
- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)
- [COMPATIBILITY.md](COMPATIBILITY.md)
