# 🗺️ Platform Roadmap

Roadmap de evolución de `docker-labs` sin perder el valor educativo del repositorio.

## Estado del roadmap

| Fase | Estado | Foco |
|---|---|---|
| Fase 1 | 🟢 Avanzada | Consolidar la plataforma principal |
| Fase 2 | 🟢 Avanzada | Integración por gateway y panel |
| Fase 3 | 🟡 En progreso | Operación, pruebas y confianza técnica |
| Fase 4 | 🟡 Pendiente | Expansión controlada de capacidades |

## Fase 1. Consolidación inmediata

Objetivo:

convertir `05`, `09` y el panel principal en una experiencia clara, consistente y presentable.

Entregables principales:

- `05-postgres-api` como core transaccional con portada explicativa y Swagger
- `09-multi-service-app` como portal operativo enlazado al core
- panel principal con sistemas destacados, estado Docker y accesos claros
- metadata por lab para sostener narrativa de producto

## Fase 2. Integración de plataforma

Objetivo:

hacer que los sistemas principales funcionen como una solución integrada.

Entregables principales:

- `06-nginx-proxy` como gateway del repositorio
- rutas unificadas para panel, core y portal
- experiencia menos dependiente de puertos sueltos

## Fase 3. Operación y confianza técnica

Objetivo:

reforzar calidad, mantenibilidad y valor profesional.

Próximos entregables:

- smoke tests más completos
- verificaciones automáticas más profundas en CI
- seeds y escenarios de negocio más ricos
- mayor observabilidad
- reglas más estrictas para nuevos labs

## Fase 4. Expansión controlada

Objetivo:

crecer sin volver al desorden inicial.

Dirección:

- adaptar `04`, `07`, `08`, `11` y `12` como capacidades complementarias reales
- sostener taxonomía `platform`, `infra`, `starter`
- agregar nuevos entornos solo si encajan en una historia mayor
