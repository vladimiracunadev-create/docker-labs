# 🤝 Contributing

Guía breve para colaborar en `docker-labs`.

## Antes de proponer cambios

Lee primero:

- [README](C:/docker-labs/docker-labs/README.md)
- [Developing](C:/docker-labs/docker-labs/DEVELOPING.md)
- [Platform Roadmap](C:/docker-labs/docker-labs/docs/PLATFORM_ROADMAP.md)

## Qué contribuciones suman más

- coherencia entre código y documentación
- fixes de Docker Compose, healthchecks y rutas reales
- mejoras de DX en el panel principal
- pruebas y validaciones automatizadas
- nuevos labs que encajen con la narrativa de plataforma

## Regla clave

No agregar un nuevo lab solo porque el stack exista.

Cada carpeta nueva debe responder:

- qué problema resuelve
- por qué existe en este repo
- si es `platform`, `infra` o `starter`
- cómo se navega o prueba desde el panel

## Checklist

- el entorno levanta de verdad
- la documentación coincide con lo entregado
- hay una justificación clara del cambio
- no se usan imágenes `latest` salvo necesidad real
- se evita introducir ruido no relacionado
