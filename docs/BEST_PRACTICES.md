# ✅ Best Practices

Buenas prácticas para desarrollar, mantener y ampliar `docker-labs`.

## Dockerfile

- usar imágenes específicas, no `latest`, salvo justificación real
- ordenar capas para aprovechar cache
- usar multi-stage build cuando tenga sentido
- evitar dependencias innecesarias en runtime
- preferir usuario no root cuando aplique

## Compose

- documentar puertos claramente
- usar variables de entorno cuando sea necesario
- agregar `healthcheck` útil
- nombrar volúmenes de forma explícita
- no publicar puertos si el servicio no necesita acceso directo

## Labs

- cada carpeta debe resolver un problema concreto
- un lab nuevo debe justificar por qué existe
- debe clasificarse como `platform`, `infra` o `starter`
- debe tener una entrada clara o explicar por qué no la tiene

## Documentación

- no prometer más de lo que el código entrega
- vincular documentación entre sí
- separar guía para novatos, operación, referencia técnica y roadmap
- usar estado claro: `operativo`, `complementario`, `base`, `experimental`

## Operación

- usar el panel `9090` como entrada principal
- revisar capacidad Docker antes de sumar labs pesados
- bajar o eliminar entornos cuando no se usan

## Seguridad

- no reutilizar credenciales de ejemplo fuera del laboratorio
- revisar versiones de imágenes antes de desplegar algo fuera de local
- limitar exposición de puertos cuando sea posible

## Referencias

- [Technical Specs](TECHNICAL_SPECS.md)
- [Security Policy](../SECURITY.md)
- [Developing](../DEVELOPING.md)
