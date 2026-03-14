# 🛠️ Developing

Guía para extender `docker-labs` sin romper la coherencia del repositorio.

## Principios

- cada carpeta debe resolver un problema concreto
- un lab nuevo debe justificar por qué existe
- la documentación debe coincidir con lo que realmente entrega el entorno
- si un lab no aporta narrativa o capacidad, no se agrega

## Estándar mínimo para un lab

- `README.md`
- `docker-compose.yml`
- `Dockerfile` si aplica
- `lab-manifest.json`
- healthcheck útil
- URL principal o explicación de por qué no existe
- justificación de su existencia

## Clasificación actual

- `platform`
- `infra`
- `starter`

## Flujo sugerido

1. definir el objetivo del lab
2. definir su clasificación
3. crear el entorno Docker
4. agregar `lab-manifest.json`
5. documentar accesos, objetivo y relación con otros labs
6. verificar que funcione desde el panel

## Referencias internas

- [05-postgres-api/README.md](C:/docker-labs/docker-labs/05-postgres-api/README.md)
- [09-multi-service-app/README.md](C:/docker-labs/docker-labs/09-multi-service-app/README.md)
- [06-nginx-proxy/README.md](C:/docker-labs/docker-labs/06-nginx-proxy/README.md)
- [Dashboard Setup](C:/docker-labs/docker-labs/docs/DASHBOARD_SETUP.md)
