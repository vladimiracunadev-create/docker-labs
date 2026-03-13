# Security Policy

Politica de seguridad para `docker-labs`.

## Reporte de vulnerabilidades

Si encuentras una vulnerabilidad, no abras un issue publico.

Canales recomendados:

- GitHub Security Advisory: [Security Advisories](https://github.com/vladimiracunadev-create/docker-labs/security/advisories)
- Email privado: [vladimirjacv@gmail.com](mailto:vladimirjacv@gmail.com)

## Que incluir

- descripcion clara del problema
- pasos para reproducir
- impacto estimado
- lab o componente afectado
- posible mitigacion, si existe

## Alcance

Este repositorio es principalmente educativo y de prototipado local. Aun asi, las buenas practicas de seguridad siguen siendo relevantes, especialmente en:

- imagenes Docker
- variables de entorno
- credenciales de ejemplo
- exposicion de puertos

## Recomendaciones para uso local

- no reutilizar contrasenas de ejemplo en otros entornos
- limitar puertos a `localhost` cuando sea posible
- revisar las imagenes y sus versiones antes de usar el repo fuera de un contexto de laboratorio
- no tratar este repositorio como una solucion de produccion sin endurecimiento adicional

## Versiones soportadas

Se considera soportada la rama principal activa (`main`). No se garantiza soporte para snapshots antiguos.
