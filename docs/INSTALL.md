# 🔧 Install Guide

Guia actualizada para instalar y operar `docker-labs` con foco en la experiencia real del repositorio.

## 📌 Antes de empezar

Este repo no requiere levantar los 12 labs a la vez. El flujo recomendado es:

1. levantar el panel `9090`
2. revisar capacidad
3. levantar solo el entorno necesario

Relacion con otros documentos:

- [Beginner Guide](BEGINNERS_GUIDE.md)
- [Dashboard Setup](DASHBOARD_SETUP.md)
- [Labs Runtime Reference](LABS_RUNTIME_REFERENCE.md)

## 🧰 Requisitos

### Software

- Docker Desktop o Docker Engine con `docker compose`
- Git
- Navegador moderno

### Hardware recomendado

| Escenario | CPU | RAM | Disco libre | Estado recomendado |
|---|---:|---:|---:|---|
| Panel `9090` + 1 lab liviano | 4 nucleos | 8 GB | 15 GB | 🟢 Seguro |
| Plataforma principal `05 + 06 + 09 + 9090` | 6 nucleos | 16 GB | 30 GB SSD | 🟢 Recomendado |
| Labs pesados `08`, `11`, `12` | 8 nucleos | 24 GB+ | 40 GB SSD | 🟡 Segun carga |

## 🐳 Instalacion de Docker

### Windows

1. Activa o actualiza WSL 2:

```powershell
wsl --install
wsl --update
```

2. Instala Docker Desktop.
3. Verifica que Docker Desktop quede operativo.

```powershell
docker --version
docker compose version
```

### macOS

1. Instala Docker Desktop para tu arquitectura.
2. Abre Docker Desktop.
3. Verifica:

```bash
docker --version
docker compose version
```

### Linux

Instala Docker Engine y el plugin Compose segun tu distribucion.

```bash
docker --version
docker compose version
```

## 📦 Clonar el repositorio

```bash
git clone https://github.com/vladimiracunadev-create/docker-labs.git
cd docker-labs
```

## 🚀 Levantar el panel principal

El panel `9090` corre como contenedor Docker propio.

```powershell
scripts\start-control-center.cmd
```

Entradas:

- Control Center: [http://localhost:9090](http://localhost:9090)
- Learning Center: [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html)

## 🧱 Levantar la plataforma principal manualmente

```powershell
docker compose -f dashboard-control\docker-compose.yml up -d --build
docker compose -f 05-postgres-api\docker-compose.yml up -d --build
docker compose -f 09-multi-service-app\docker-compose.yml up -d --build
docker compose -f 06-nginx-proxy\docker-compose.yml up -d --build
```

Entradas:

- [http://localhost:9090](http://localhost:9090)
- [http://localhost:8000](http://localhost:8000)
- [http://localhost:8083](http://localhost:8083)
- [http://localhost:8085](http://localhost:8085)

## ✅ Verificacion inicial

```powershell
docker ps
```

Debes poder ver:

- `docker_labs_control_center`
- `inventory_core_api`
- `inventory_core_db`
- `multi_backend`
- `multi_frontend`
- `multi_db`
- `platform_gateway`

## 🧠 Si tu equipo es limitado

### 8 GB RAM

- deja solo `9090`
- levanta un lab a la vez
- evita mezclar `08`, `11` y `12`

### 16 GB RAM

- usa `05 + 06 + 09 + 9090`
- suma un servicio complementario solo cuando tenga sentido

### 24 GB RAM o mas

- puedes experimentar con observabilidad, busqueda y CI con menos riesgo

## 🆘 Problemas comunes

### Docker Desktop abierto pero sin respuesta

```powershell
docker info
```

### El panel `9090` no abre

```powershell
docker compose -f dashboard-control\docker-compose.yml up -d --build
```

### El gateway `8085` abre pero no enruta

Revisa que `05`, `09` y `9090` esten arriba.
