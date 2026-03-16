# Install Guide

> **Version**: 1.5  
> **Estado**: Activo  
> **Objetivo**: Instalar y operar `docker-labs` tanto desde fuente como desde el instalador Windows

---

## Requisitos

### Software

- Docker Desktop o Docker Engine con `docker compose`
- Git para trabajar desde fuente
- Navegador moderno

### Hardware recomendado

| Escenario | CPU | RAM total | Disco libre |
|---|---:|---:|---:|
| Control Center + 1 lab liviano | 4 hilos | 8 GB | 15 GB |
| Plataforma principal `9090 + 05 + 09 + 06` | 6 a 8 hilos | 16 GB | 30 GB |
| Plataforma + labs pesados `08`, `11`, `12` | 8 hilos o mas | 24 GB+ | 40 GB |

## Opcion A: instalar desde fuente

```bash
git clone https://github.com/vladimiracunadev-create/docker-labs.git
cd docker-labs
```

### Windows

```powershell
scripts\start-control-center.cmd
```

### Linux/macOS

```bash
./scripts/start-control-center.sh
```

### Plataforma principal

```powershell
docker compose -f 05-postgres-api\docker-compose.yml up -d --build
docker compose -f 09-multi-service-app\docker-compose.yml up -d --build
docker compose -f 06-nginx-proxy\docker-compose.yml up -d --build
```

## Opcion B: instalar desde GitHub Releases en Windows

1. Descarga el instalador oficial desde la pagina de releases:

   **[https://github.com/vladimiracunadev-create/docker-labs/releases/latest](https://github.com/vladimiracunadev-create/docker-labs/releases/latest)**

   El archivo se llama `docker-labs-setup-{version}.exe`

2. Ejecuta el instalador.
   Si Windows SmartScreen muestra advertencia → "Mas informacion" → "Ejecutar de todas formas".

3. Usa el acceso directo **Docker Labs** del menu de inicio o el escritorio.
   El launcher verifica Docker Desktop, levanta los 4 servicios de la plataforma en paralelo y abre el browser automaticamente en `http://localhost:9090`.

> Ver [docs/windows-installer.md](windows-installer.md) para instrucciones completas, troubleshooting y justificacion de la falta de firma digital.

## Verificacion inicial

- Control Center: [http://localhost:9090](http://localhost:9090)
- Inventory Core: [http://localhost:8000](http://localhost:8000)
- Operations Portal: [http://localhost:8083](http://localhost:8083)
- Gateway: [http://localhost:8085](http://localhost:8085)

## Equipos con recursos limitados

- deja solo `9090` arriba
- levanta un lab a la vez
- evita mezclar `08`, `11` y `12` con la plataforma principal si tu Docker no tiene memoria suficiente

## Notas de distribucion

- el instalador no empaqueta Docker Desktop
- el instalador final no se versiona dentro del repo
- GitHub Releases es el canal oficial del binario
- esta fase no usa firma digital de codigo

## Documentos relacionados

- [windows-installer.md](windows-installer.md)
- [github-releases-distribution.md](github-releases-distribution.md)
- [../RUNBOOK.md](../RUNBOOK.md)
