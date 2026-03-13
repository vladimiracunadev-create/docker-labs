# Install Guide

Guia actualizada para instalar y operar `docker-labs` con foco en la experiencia real del repositorio.

## Requisitos base

### Software

- Docker Desktop o Docker Engine con `docker compose`
- Git
- Navegador moderno

### Hardware recomendado

| Escenario | CPU | RAM | Disco libre |
|---|---:|---:|---:|
| Panel `9090` + 1 lab liviano | 4 nucleos | 8 GB | 15 GB |
| Plataforma principal `05 + 06 + 09 + 9090` | 6 nucleos | 16 GB | 30 GB SSD |
| Labs pesados `08`, `11`, `12` | 8 nucleos | 24 GB o mas | 40 GB SSD |

## Instalacion de Docker

### Windows

1. Instala o actualiza WSL 2:

```powershell
wsl --install
wsl --update
```

2. Instala Docker Desktop.
3. Activa la virtualizacion en BIOS si fuera necesario.
4. Abre Docker Desktop y espera a que quede operativo.

Verificacion:

```powershell
docker --version
docker compose version
```

### macOS

1. Instala Docker Desktop para Apple Silicon o Intel segun corresponda.
2. Abre Docker Desktop.
3. Verifica:

```bash
docker --version
docker compose version
```

### Linux

Instala Docker Engine y el plugin Compose segun tu distribucion.

Verificacion:

```bash
docker --version
docker compose version
```

## Clonar el repositorio

```bash
git clone https://github.com/vladimiracunadev-create/docker-labs.git
cd docker-labs
```

## Modo recomendado de uso

No necesitas levantar todos los labs a la vez.

Flujo recomendado:

1. levanta el panel principal
2. revisa capacidad y estado
3. levanta un lab o la plataforma principal
4. baja entornos cuando termines

## Levantar el panel principal

El panel `9090` ahora corre como contenedor Docker propio.

```powershell
scripts\start-control-center.cmd
```

Entradas:

- `http://localhost:9090`: control center
- `http://localhost:9090/learning-center.html`: centro de aprendizaje

## Levantar la plataforma principal manualmente

```powershell
docker compose -f 05-postgres-api\docker-compose.yml up -d --build
docker compose -f 09-multi-service-app\docker-compose.yml up -d --build
docker compose -f 06-nginx-proxy\docker-compose.yml up -d --build
docker compose -f dashboard-control\docker-compose.yml up -d --build
```

Entradas:

- `http://localhost:8000`: Inventory Core
- `http://localhost:8083`: Operations Portal
- `http://localhost:8085`: Platform Gateway
- `http://localhost:9090`: Control Center

## Verificacion inicial

```powershell
docker ps
```

Debes poder ver, al menos, estos contenedores cuando la plataforma principal esta arriba:

- `docker_labs_control_center`
- `inventory_core_api`
- `inventory_core_db`
- `multi_backend`
- `multi_frontend`
- `multi_db`
- `platform_gateway`

## Que hacer si tu equipo es limitado

### 8 GB RAM

- deja solo `9090`
- levanta un lab a la vez
- evita mezclar `08`, `11` y `12`

### 16 GB RAM

- usa `05 + 06 + 09 + 9090`
- agrega un servicio complementario solo si realmente lo necesitas

### 24 GB RAM o mas

- puedes experimentar con observabilidad, busqueda y CI con menos riesgo de saturacion

## Problemas comunes

### Docker Desktop abierto pero sin respuesta

Valida:

```powershell
docker info
```

### El panel `9090` no abre

Levanta de nuevo:

```powershell
docker compose -f dashboard-control\docker-compose.yml up -d --build
```

### El gateway `8085` abre pero no enruta

Revisa que `05`, `09` y `9090` esten arriba.

## Documentos relacionados

- [BEGINNERS_GUIDE](C:/docker-labs/docker-labs/docs/BEGINNERS_GUIDE.md)
- [DASHBOARD_SETUP](C:/docker-labs/docker-labs/docs/DASHBOARD_SETUP.md)
- [LABS_RUNTIME_REFERENCE](C:/docker-labs/docker-labs/docs/LABS_RUNTIME_REFERENCE.md)
