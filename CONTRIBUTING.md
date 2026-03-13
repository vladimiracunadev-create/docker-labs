# Contributing

Guia breve para colaborar en `docker-labs`.

## Antes de proponer cambios

Lee primero:

- [README.md](C:/docker-labs/docker-labs/README.md)
- [DEVELOPING.md](C:/docker-labs/docker-labs/DEVELOPING.md)
- [docs/PLATFORM_ROADMAP.md](C:/docker-labs/docker-labs/docs/PLATFORM_ROADMAP.md)

## Tipo de contribuciones que mas suman

- mejoras de coherencia entre codigo y documentacion
- nuevos labs que encajen con la narrativa de plataforma
- fixes de Docker Compose, healthchecks y flujos reales
- mejoras de DX en el panel principal
- pruebas y validaciones automatizadas

## Regla importante

No agregar un nuevo lab solo porque el stack exista.

Cada carpeta nueva debe responder:

- que problema resuelve
- por que existe en este repo
- si es `platform`, `infra` o `starter`
- como se navega o se prueba desde el panel

## Checklist de contribucion

- el entorno levanta de verdad
- la documentacion coincide con lo entregado
- hay una justificacion clara del lab o del cambio
- no se usan imagenes `latest` salvo necesidad justificada
- se evita introducir ruido no relacionado

## Convencion de commits

Se recomienda usar mensajes claros y directos, por ejemplo:

- `feat(06-nginx-proxy): add platform gateway routes`
- `docs(readme): clarify platform positioning`
- `fix(05-postgres-api): correct summary revenue logic`

## Si agregas un lab

Incluye como minimo:

- `README.md`
- `docker-compose.yml`
- `Dockerfile` si aplica
- `lab-manifest.json`
- healthcheck util
- objetivo del entorno
- entrada principal o explicacion de por que no existe

## Si mejoras documentacion

La documentacion puede mejorarse sin pedir aprobacion previa, pero debe:

- ser fiel al estado real del repo
- ayudar a usar mejor el proyecto
- evitar promesas que el codigo todavia no cumple
