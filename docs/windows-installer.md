# Instalador Windows — Docker Labs

> **Versión**: 1.4.0
> **Última actualización**: 2026-03-15
> **Audiencia**: desarrolladores, mantenedores, usuarios finales, revisores técnicos
> **Distribución**: GitHub Releases (no se incluye en el repositorio)

---

## Descripción general

Docker Labs incluye un instalador nativo para Windows (`docker-labs-setup-{version}.exe`)
para usuarios que prefieren una experiencia de instalación con un solo clic en lugar de
clonar el repositorio manualmente. El instalador está construido con Inno Setup, incluye
el launcher compilado con Go e instala el workspace en `%LOCALAPPDATA%\DockerLabs`.

El instalador es un **artefacto de release** — nunca se incluye en el repositorio.
Se publica como asset en GitHub Releases y se descarga desde allí.

---

## Requisitos previos (usuario final)

| Requisito | Versión | Notas |
|-----------|---------|-------|
| Windows | 10 u 11 (64-bit) | Obligatorio |
| Docker Desktop | Última estable | Obligatorio — no viene incluido en el instalador |
| Backend WSL 2 | (por defecto en Docker Desktop) | Recomendado |

Docker Desktop no se empaqueta en el instalador por diseño. El launcher valida su
presencia y guía al usuario si no está instalado.

---

## Instalación

1. Descarga `docker-labs-setup-{version}.exe` desde [GitHub Releases](https://github.com/vladimiracunadev-create/docker-labs/releases)
2. Ejecuta el instalador
3. Si Windows SmartScreen muestra una advertencia — consulta la sección [¿Por qué no se usa firma digital?](#por-que-no-se-usa-firma-digital-en-esta-fase)
4. Acepta el directorio de instalación (`%LOCALAPPDATA%\DockerLabs` por defecto)
5. Opcionalmente marca "Crear acceso directo en el escritorio"
6. Clic en "Instalar" → "Iniciar Docker Labs"

---

## Qué hace el instalador

| Paso | Acción |
|------|--------|
| Muestra aviso de binario sin firma | Advertencia transparente antes de continuar |
| Copia los archivos fuente del workspace | Labs 01–12, dashboard-control, docs |
| Copia el ejecutable del launcher | `docker-labs-launcher.exe` |
| Crea entrada en el menú Inicio | "Docker Labs — Control Center" |
| Crea acceso directo opcional en el escritorio | Desmarcado por defecto |
| Registra el desinstalador | Eliminación limpia desde Configuración → Aplicaciones |
| Ofrece iniciar al finalizar la instalación | Opcional, vía paso Run |

---

## Qué NO hace el instalador

- **No** instala Docker Desktop
- **No** descarga imágenes Docker (las imágenes se descargan en tiempo de ejecución por Docker)
- **No** requiere permisos de administrador (instala en el espacio del usuario)
- **No** modifica el PATH del sistema ni el registro más allá de las entradas estándar de Inno Setup
- **No** contiene firma digital (ver más abajo)

---

## El launcher (`docker-labs-launcher.exe`)

El launcher es un binario Go compilado (`launcher/main.go`) que sirve como punto
de entrada principal para usuarios de Windows.

### Qué hace

1. Muestra el banner de inicio con la versión y aviso de binario sin firma
2. Localiza la raíz del workspace (relativa a su propia ubicación)
3. Verifica que Docker CLI esté disponible (`docker --version`)
4. Verifica que el daemon de Docker esté corriendo (`docker info`)
5. Calcula `DOCKER_REPO_ROOT` dinámicamente para la máquina actual
6. Levanta los 4 servicios core en paralelo:
   - `dashboard-control` (Control Center, puerto 9090)
   - `05-postgres-api` (Inventory Core, puerto 8000)
   - `09-multi-service-app` (Operations Portal, puerto 8083)
   - `06-nginx-proxy` (Platform Gateway, puerto 8085)
7. Consulta `http://localhost:9090/api/overview` hasta que responde (timeout 90 s)
8. Abre `http://localhost:9090` en el browser por defecto
9. Muestra la lista de URLs principales

Si algún paso falla, el launcher muestra un mensaje de error claro con instrucciones
para solucionarlo y mantiene la consola abierta para que el usuario pueda leer la salida.

### Código fuente

```
launcher/
  main.go    # Fuente Go — stdlib pura, sin dependencias externas
  go.mod     # Definición del módulo Go
```

### Compilar localmente

```powershell
cd launcher
go build -o docker-labs-launcher.exe .
```

O usando el script de conveniencia:

```powershell
.\scripts\windows\build-launcher.ps1 -Version 1.4.0
```

---

## Compilar el instalador localmente

### Requisitos (máquina de build)

| Herramienta | Versión | Descarga |
|-------------|---------|----------|
| Go | 1.21+ | https://go.dev/dl/ |
| Inno Setup | 6.x | https://jrsoftware.org/isinfo.php |
| Git | cualquiera | Para clonar el repositorio |

### Pasos

```powershell
# 1. Clonar el repositorio
git clone https://github.com/vladimiracunadev-create/docker-labs.git
cd docker-labs

# 2. Compilar el launcher
.\scripts\windows\build-launcher.ps1 -Version 1.4.0

# 3. Compilar el instalador
.\scripts\windows\build-installer.ps1 -Version 1.4.0

# Resultado: dist\docker-labs-setup-1.4.0.exe
```

O ejecutar el pipeline completo en un solo comando:

```powershell
.\scripts\windows\release.ps1 -Version 1.4.0
```

---

## Qué contiene el instalador

El script de Inno Setup (`installer/docker-labs.iss`) incluye:

| Elemento | Incluido | Notas |
|----------|----------|-------|
| `docker-labs-launcher.exe` | Sí | Compilado desde `launcher/main.go` |
| Directorios de labs (01–12) | Sí | Fuentes + Dockerfiles + compose files |
| `dashboard-control/` | Sí | node_modules excluido |
| Assets HTML/CSS/JS raíz | Sí | `index.html`, `dashboard.js`, etc. |
| `docs/` | Sí | Documentación completa |
| `scripts/` | Parcial | Solo `start-control-center.cmd` |
| `.git/` | No | No necesario en tiempo de ejecución |
| `node_modules/` | No | Se descarga al hacer docker build |
| `dist/` | No | Artefactos de build |
| Scripts del instalador | No | `installer/`, `scripts/windows/` |
| `.github/` | No | Los workflows de CI no son necesarios en ejecución |

---

## Desinstalación

Desde Configuración de Windows → Aplicaciones → Docker Labs → Desinstalar.

El desinstalador:
1. Detiene el contenedor del Control Center (`docker compose down`)
2. Elimina todos los archivos instalados
3. Elimina los accesos directos del menú Inicio y el escritorio
4. Elimina la entrada del registro del desinstalador

Las imágenes Docker y volúmenes creados por Docker **no** se eliminan automáticamente.
Para limpiarlos, ejecuta desde el directorio del workspace antes de desinstalar:

```cmd
docker compose -f dashboard-control\docker-compose.yml down --volumes --remove-orphans
```

---

## Por qué no se usa firma digital en esta fase

### La decisión

Docker Labs v1.x **no** usa firma digital de código para el instalador ni el launcher.
Esta es una **decisión de producto intencional y explícita**, no un descuido.

### Razones

| Razón | Detalle |
|-------|---------|
| **Costo** | Los certificados EV (necesarios para reputación completa en SmartScreen) cuestan $300–700/año. Para un proyecto de portfolio open-source, este costo no está justificado en la fase inicial. |
| **Fase de validación** | El objetivo de v1.x es validar la experiencia de instalación, el comportamiento del launcher y el flujo de distribución. Firmar agrega complejidad sin aportar valor funcional en esta etapa. |
| **Carga de mantenimiento** | Los certificados de firma de código requieren renovación, almacenamiento seguro de claves y configuración del pipeline de CI. Esta complejidad no está justificada antes de validar el modelo de distribución. |
| **Prioridad** | El valor técnico del proyecto está en el workspace Docker, no en la infraestructura de firma. |

### Impacto para el usuario final

Al ejecutar el instalador sin firma en Windows 10/11, Microsoft SmartScreen
puede mostrar uno de los siguientes escenarios:

| Escenario | Mensaje | Acción |
|-----------|---------|--------|
| Publicador nuevo/desconocido | "Windows protegió tu PC" | Clic en "Más información" → "Ejecutar de todas formas" |
| Puntuación de reputación baja | Ventana de advertencia | Igual que el caso anterior |
| Escaneo de antivirus | Puede marcarlo como desconocido | Agregar a exclusiones si es necesario |

Este comportamiento es normal para software nuevo o descargado con poca frecuencia.
**No** indica que el software sea malicioso.

### Por qué GitHub Releases mitiga este riesgo

El instalador se distribuye exclusivamente a través de GitHub Releases:
- GitHub proporciona descargas verificadas con TLS
- El release está etiquetado a un commit específico
- El código fuente es públicamente auditable
- Los checksums SHA-256 se incluyen en las notas del release

Los usuarios pueden verificar que el instalador coincide con el código fuente
compilándolo localmente con `scripts/windows/release.ps1`.

### Medidas compensatorias

En ausencia de firma de código, se aplican las siguientes medidas:

1. **Distribución exclusiva vía GitHub Releases** — sin mirrors de terceros
2. **Checksum SHA-256** incluido en la descripción de cada release
3. **Aviso de binario sin firma** mostrado en el asistente del instalador y en el banner del launcher
4. **Build reproducible** — el instalador puede ser reconstruido desde el código fuente por cualquier persona

### Hoja de ruta para la firma de código

La firma de código se considerará cuando:

- El proyecto alcance una base de usuarios más amplia (>1,000 descargas/mes)
- Un certificado Azure Code Signing de Microsoft sea factible ($99/año)
- O el proyecto sea adoptado por una organización que pueda proveer un certificado EV

El script de Inno Setup (`installer/docker-labs.iss`) ya contiene una directiva
`SignTool` comentada lista para activarse:

```iss
; SignTool=...  (descomentar y configurar cuando la firma esté disponible)
```

---

## Solución de problemas

| Síntoma | Causa | Solución |
|---------|-------|---------|
| Advertencia de SmartScreen | Binario sin firma | Clic en "Más información" → "Ejecutar de todas formas" |
| "Docker not found" | Docker Desktop no instalado | Instalar desde docker.com/desktop |
| "Docker not running" | Docker Desktop no iniciado | Iniciar Docker Desktop, esperar el ícono en la bandeja del sistema |
| El browser no abre | Puerto 9090 en uso por otra app | Verificar con `netstat -ano \| findstr 9090` |
| "dashboard-control not found" | Launcher fuera del directorio de instalación | Re-ejecutar el instalador o usar el directorio de instalación |
| El Control Center inicia pero los labs no | `DOCKER_REPO_ROOT` incorrecto | El launcher lo calcula automáticamente; si se usa manualmente, ver RUNBOOK.md |

---

## Presentación en demos y portfolio

Esta capa de distribución Windows demuestra:

- **Pensamiento de producto**: diseñar para la experiencia del usuario final más allá del repositorio
- **Dominio de Go**: binario multiplataforma sin dependencias en tiempo de ejecución
- **Packaging Windows**: Inno Setup para una experiencia de instalación profesional
- **CI/CD**: pipeline de build automatizado vía GitHub Actions
- **Diseño de distribución**: GitHub Releases como canal correcto para artefactos
- **Conciencia de seguridad**: política explícita de binario sin firma con medidas compensatorias

Para una entrevista técnica o demo, destacar:
1. El launcher valida los prerrequisitos antes de iniciar cualquier cosa
2. El cálculo de `DOCKER_REPO_ROOT` resuelve un problema real de rutas Docker-in-Docker
3. El instalador se construye de forma reproducible desde el código fuente — sin cajas negras
4. La decisión de NO firmar en v1.x es intencional, documentada y justificable

---

## Documentos relacionados

- [docs/github-releases-distribution.md](github-releases-distribution.md)
- [docs/technical-audit.md](technical-audit.md)
- [RUNBOOK.md](../RUNBOOK.md)
- [RELEASE.md](../RELEASE.md)
- [FILE_ARCHITECTURE.md](../FILE_ARCHITECTURE.md)
