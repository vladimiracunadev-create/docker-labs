# Developing

## Objetivo

Esta guia explica como extender `docker-labs` sin romper la coherencia del repositorio.

## Principios

- cada carpeta debe resolver un problema concreto
- un lab nuevo debe justificar por que existe dentro de la plataforma
- la documentacion debe coincidir con lo que realmente entrega el entorno
- si un lab no aporta narrativa o capacidad, no se agrega

## Estandar recomendado para un lab

Cada entorno nuevo deberia incluir como minimo:

- `README.md`
- `docker-compose.yml`
- `Dockerfile` si aplica
- `lab-manifest.json`
- healthcheck util
- URL principal o explicacion de por que no existe
- justificacion de su existencia

## Clasificacion actual

- `platform`: sistemas principales del repositorio
- `infra`: capacidades complementarias
- `starter`: entornos base y demos

## Flujo sugerido

1. definir el objetivo del lab
2. definir si es `platform`, `infra` o `starter`
3. crear el entorno Docker
4. agregar `lab-manifest.json`
5. documentar accesos, objetivo y relacion con otros labs
6. verificar que funcione desde el panel principal

## Sistemas de referencia

Usa estos como estandar actual:

- [05-postgres-api/README.md](C:/docker-labs/docker-labs/05-postgres-api/README.md)
- [09-multi-service-app/README.md](C:/docker-labs/docker-labs/09-multi-service-app/README.md)
- [06-nginx-proxy/README.md](C:/docker-labs/docker-labs/06-nginx-proxy/README.md)
