# 🔐 Security Policy

Política de seguridad para `docker-labs`.

## Reporte de vulnerabilidades

Si encuentras una vulnerabilidad, no abras un issue público.

Canales recomendados:

- GitHub Security Advisory: [Security Advisories](https://github.com/vladimiracunadev-create/docker-labs/security/advisories)
- Email privado: [vladimirjacv@gmail.com](mailto:vladimirjacv@gmail.com)

## Qué incluir

- descripción clara del problema
- pasos para reproducir
- impacto estimado
- lab o componente afectado
- posible mitigación

## Alcance

Este repositorio es principalmente educativo y de prototipado local. Aun así, siguen siendo relevantes:

- imágenes Docker
- variables de entorno
- credenciales de ejemplo
- exposición de puertos

## Recomendaciones

- no reutilizar contraseñas de ejemplo en otros entornos
- limitar puertos a `localhost` cuando sea posible
- revisar versiones de imágenes antes de salir de local
- no tratar este repo como solución de producción sin endurecimiento adicional
