# Operating Modes

Modos recomendados para usar `docker-labs` segun el objetivo de trabajo y la capacidad de tu equipo.

## 1. Modo panel primero

Levanta solo el Control Center en `9090`.

### Cuando usarlo

- Cuando no sabes aun que lab abrir
- Cuando quieres revisar diagnostico del host
- Cuando tienes recursos limitados

### Ventaja

Te permite decidir con criterio antes de cargar Docker innecesariamente.

## 2. Modo caso a caso

Levanta el panel y un solo lab operativo segun necesidad.

### Cuando usarlo

- Para estudiar un stack especifico
- Para equipos con 8 GB de RAM o menos
- Para demos enfocadas

### Ejemplos

- `9090` + `05`
- `9090` + `06`
- `9090` + `09`

## 3. Modo plataforma principal

Levanta `9090`, `05`, `06` y `09`.

### Cuando usarlo

- Para mostrar el valor completo del repo
- Para revisar la experiencia integrada
- Para una demo profesional del workspace

## 4. Modo infra especializada

Levanta uno de los servicios pesados como `08`, `11` o `12`, idealmente sin saturar la plataforma principal.

## Recomendacion operativa

1. Empieza por `9090`.
2. Revisa diagnostico.
3. Elige el modo de trabajo.
4. Si Docker queda justo, baja todo antes de probar otro escenario.

## Lectura relacionada

- [Environment Setup](C:/docker-labs/docker-labs/ENVIRONMENT_SETUP.md)
- [Requirements](C:/docker-labs/docker-labs/docs/REQUIREMENTS.md)
- [Compatibility](C:/docker-labs/docker-labs/COMPATIBILITY.md)
