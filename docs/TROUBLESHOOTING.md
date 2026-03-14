# 🛠️ Troubleshooting

Problemas comunes y cómo resolverlos dentro de `docker-labs`.

## Problemas generales

### Docker no responde

Síntoma:

- `docker info` falla

Acción:

```powershell
docker info
```

Si falla, revisa Docker Desktop o el daemon de Docker.

### Puerto ocupado

Síntoma:

- un lab no levanta porque el puerto ya está en uso

Acción:

```powershell
netstat -ano | findstr :9090
```

Luego cambia el puerto o detén el proceso en conflicto.

### Falta de espacio

```powershell
docker system df
docker system prune -f
```

## Problemas del panel `9090`

### El panel no abre

```powershell
docker compose -f dashboard-control\docker-compose.yml up -d --build
```

### El panel abre, pero no controla Docker

Revisa:

- que el contenedor `docker_labs_control_center` esté arriba
- que Docker Desktop esté operativo

## Problemas de la plataforma principal

### `8085` abre, pero no enruta

Revisa que estén arriba:

- `05-postgres-api`
- `09-multi-service-app`
- `dashboard-control`

### `8000` responde lento o no queda healthy

Revisa logs:

```powershell
docker compose -f 05-postgres-api\docker-compose.yml logs --tail 100
```

### `8083` no muestra datos

Revisa:

- backend `3003`
- conectividad con `05`
- estado de MongoDB

## Labs pesados

### El equipo se pone lento

Evita mezclar:

- `08-prometheus-grafana`
- `11-elasticsearch-search`
- `12-jenkins-ci`

Si tu Docker tiene menos de `16 GB`, usa modo caso a caso.

## Documentos relacionados

- [FAQ](C:/docker-labs/docker-labs/FAQ.md)
- [Install Guide](C:/docker-labs/docker-labs/docs/INSTALL.md)
- [User Manual](C:/docker-labs/docker-labs/docs/USER_MANUAL.md)
