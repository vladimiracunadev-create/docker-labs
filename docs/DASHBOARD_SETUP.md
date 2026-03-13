# 🖥️ Dashboard Setup

Guia operativa del `Docker Labs Control Center`.

## 🎯 Objetivo

El panel en `9090` existe para resolver cuatro problemas:

- no levantar labs a ciegas
- ver estado Docker real
- abrir la entrada correcta de cada sistema
- saber si Docker tiene capacidad para mas carga

## 📊 Estado del componente

| Aspecto | Estado |
|---|---|
| Despliegue | 🟢 Dockerizado |
| Puerto principal | `9090` |
| Gateway integrado | 🟢 `/control/` en `8085` |
| Diagnostico de capacidad | 🟢 Disponible |
| Acciones globales | 🟢 Disponible |

## 🧱 Arquitectura actual

Componentes:

1. [dashboard-control/docker-compose.yml](C:/docker-labs/docker-labs/dashboard-control/docker-compose.yml)
2. [dashboard-control/Dockerfile](C:/docker-labs/docker-labs/dashboard-control/Dockerfile)
3. [dashboard-control/server.js](C:/docker-labs/docker-labs/dashboard-control/server.js)
4. [index.html](C:/docker-labs/docker-labs/index.html), [dashboard.js](C:/docker-labs/docker-labs/dashboard.js), [dashboard.css](C:/docker-labs/docker-labs/dashboard.css)

## ⚙️ Como funciona

El contenedor del panel:

- expone `9090`
- monta el repositorio para leer metadata y documentos
- incluye `docker cli` y `docker compose`
- usa el socket Docker para operar labs

## 🚀 Inicio rapido

```powershell
scripts\start-control-center.cmd
```

O manualmente:

```powershell
docker compose -f dashboard-control\docker-compose.yml up -d --build
```

## 🔗 URLs utiles

- [http://localhost:9090](http://localhost:9090)
- [http://localhost:9090/api/overview](http://localhost:9090/api/overview)
- [http://localhost:9090/api/diagnostics](http://localhost:9090/api/diagnostics)
- [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html)
- [http://localhost:8085/control/](http://localhost:8085/control/)

## 🧠 Que muestra el panel

### Overview

- labs registrados
- labs saludables
- labs corriendo
- labs que requieren atencion

### Sistemas principales

- `05-postgres-api`
- `06-nginx-proxy`
- `09-multi-service-app`

### Diagnostico

Cruza dos fuentes:

- navegador: estimacion del equipo anfitrion
- Docker: CPU, RAM y consumo real del runtime

### Acciones por lab

- `start`
- `stop`
- `restart`
- `rebuild`
- `logs`

### Acciones globales

- `Levantar repositorio activo`
- `Bajar todos los Docker`
- `Eliminar entornos del repo`

## 🔍 Verificacion tecnica

```powershell
curl http://localhost:9090/api/overview
curl http://localhost:9090/api/diagnostics
```

## 📝 Notas importantes

- `9090` ya no depende de un proceso Node suelto
- el panel forma parte del ecosistema Docker del repo
- el panel no reemplaza Docker Desktop: lo usa, lo explica y ayuda a decidir mejor

## 📚 Documentos relacionados

- [README](C:/docker-labs/docker-labs/README.md)
- [Install Guide](C:/docker-labs/docker-labs/docs/INSTALL.md)
- [User Manual](C:/docker-labs/docker-labs/docs/USER_MANUAL.md)
- [FAQ](C:/docker-labs/docker-labs/FAQ.md)
