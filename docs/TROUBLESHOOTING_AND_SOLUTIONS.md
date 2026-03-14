# 🧩 Troubleshooting and Solutions

Registro corto de lecciones técnicas del repositorio.

## Qué documenta

No reemplaza al troubleshooting general. Este archivo resume problemas estructurales que ya aparecieron en la evolución del proyecto y cómo se resolvieron.

## Casos relevantes

### 1. Conflictos de puertos

Problema:

- distintos labs querían publicar sobre el mismo puerto

Solución:

- reasignar puertos y fijar convenciones más claras

### 2. Nginx como gateway

Problema:

- el proxy podía marcarse unhealthy si dependía de backends no disponibles

Solución:

- endpoint dedicado de salud del gateway
- rutas explícitas hacia servicios reales

### 3. Panel principal fuera de Docker

Problema:

- el `9090` dependía de una consola local y se caía con facilidad

Solución:

- dockerizar `dashboard-control`

### 4. Documentación desalineada

Problema:

- README, roadmap y docs técnicas no reflejaban el estado real

Solución:

- reescritura de la documentación troncal
- navegación cruzada y estado explícito

## Lección principal

En este repo, la coherencia entre:

- código
- puertos
- healthchecks
- documentación

es tan importante como que el contenedor “suba”.
