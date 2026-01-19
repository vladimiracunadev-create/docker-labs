# Guía de Instalación 🔧

Instrucciones completas para instalar Docker, Docker Compose y configurar **docker-labs** en tu sistema.

---

## 🖥️ Instalación de Docker

### Windows

#### Requisitos
- Windows 10/11 Pro, Enterprise o Education (64-bit)
- Virtualización habilitada en BIOS
- WSL 2 (Windows Subsystem for Linux 2)

#### Pasos

1. **Habilitar WSL 2**:
```powershell
# Ejecuta PowerShell como Administrador
wsl --install
```

2. **Descargar Docker Desktop**:
   - Ve a: https://docs.docker.com/desktop/install/windows-install/
   - Descarga Docker Desktop for Windows

3. **Instalar Docker Desktop**:
   - Ejecuta el instalador
   - Marca "Use WSL 2 instead of Hyper-V"
   - Reinicia tu PC

4. **Verificar instalación**:
```powershell
docker --version
docker-compose --version
```

#### Solución de problemas (Windows)

**Error: WSL 2 installation is incomplete**
```powershell
wsl --update
wsl --set-default-version 2
```

**Docker no inicia**
- Verifica que Docker Desktop esté en la bandeja del sistema
- Revisa `Settings > Resources > WSL Integration`

---

### macOS

#### Requisitos
- macOS 11 Big Sur o superior
- Procesador Intel o Apple Silicon (M1/M2)

#### Pasos

1. **Descargar Docker Desktop**:
   - Ve a: https://docs.docker.com/desktop/install/mac-install/
   - Descarga la versión correcta:
     - **Intel Chip**: Docker Desktop para Mac (Intel)
     - **Apple Silicon**: Docker Desktop para Mac (Apple Silicon)

2. **Instalar**:
   - Abre el archivo `.dmg`
   - Arrastra Docker a Aplicaciones
   - Abre Docker desde Aplicaciones

3. **Verificar instalación**:
```bash
docker --version
docker-compose --version
```

---

### Linux (Ubuntu/Debian)

#### Desinstalar versiones antiguas
```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

#### Instalar Docker Engine

1. **Actualizar repositorios**:
```bash
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release
```

2. **Agregar GPG key de Docker**:
```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

3. **Configurar repositorio**:
```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

4. **Instalar Docker**:
```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

5. **Permitir Docker sin sudo** (opcional):
```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

6. **Verificar**:
```bash
docker --version
docker compose version
```

**Nota**: En Linux, usa `docker compose` (espacio) en lugar de `docker-compose` (guion).

---

## 📦 Instalación de Docker Compose

### Windows / macOS
✅ **Ya incluido con Docker Desktop**

### Linux
✅ **Ya instalado con docker-compose-plugin**

Si usas una versión antigua, puedes instalar standalone:
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

---

## 🚀 Configuración Inicial de docker-labs

### 1. Clonar el repositorio

```bash
git clone https://github.com/vladimiracunadev-create/docker-labs.git
cd docker-labs
```

### 2. Verificar estructura

```bash
ls -la
```

Deberías ver:
```
.git/
docs/
node-api/
php-lamp/
python-api/
README.md
LICENSE
...
```

### 3. Configurar variables de entorno (si aplica)

Para `php-lamp`:
```bash
cd php-lamp
cp .env.example .env
```

Edita `.env` con tus valores preferidos:
```env
DB_HOST=db
DB_NAME=testdb
DB_USER=devuser
DB_PASS=tu-password-seguro
```

### 4. Levantar tu primer laboratorio

```bash
cd node-api
docker-compose up
```

Si ves:
```
web_1  | Server running on port 3000
```
✅ **¡Funciona!** Abre http://localhost:3000

---

## 🔍 Verificación de Instalación

Ejecuta estos comandos para verificar que todo esté correcto:

```bash
# Docker instalado
docker --version
# Salida esperada: Docker version 20.10.x

# Docker Compose instalado
docker-compose --version
# Salida esperada: Docker Compose version v2.x.x

# Docker funcionando
docker run hello-world
# Salida esperada: "Hello from Docker!"

# Puede crear contenedores
docker ps
# Salida esperada: tabla vacía (si no hay contenedores corriendo)
```

---

## ⚙️ Configuración Recomendada

### Recursos (Docker Desktop)

1. Abre Docker Desktop
2. Settings > Resources
3. Ajusta según tu sistema:
   - **CPUs**: 4 (mínimo 2)
   - **Memory**: 4 GB (mínimo 2 GB)
   - **Swap**: 1 GB
   - **Disk**: 20 GB

### WSL 2 Integration (Windows)

1. Settings > Resources > WSL Integration
2. Activa integración con tu distribución Ubuntu/Debian

### File Sharing (macOS)

1. Settings > Resources > File Sharing
2. Asegúrate de que tu directorio de proyectos esté compartido

---

## 🐛 Solución de Problemas Comunes

### "Cannot connect to Docker daemon"

**Linux**:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

**Windows/macOS**:
- Verifica que Docker Desktop esté corriendo

### "Permission denied" al ejecutar docker

**Linux**:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

Cierra sesión y vuelve a entrar.

### Puerto ya en uso

```bash
# Ver qué está usando el puerto 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Cambia el puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usa 3001 en lugar de 3000
```

### Lentitud en Windows

1. Coloca tu código dentro de WSL 2:
```bash
# Desde WSL 2 (Ubuntu)
cd ~
git clone https://github.com/...
```

2. Abre VS Code desde WSL:
```bash
code .
```

### Error: "no space left on device"

Limpia imágenes y contenedores antiguos:
```bash
docker system prune -a --volumes
```

---

## 🎓 Configuración Avanzada

### Usar buildkit (builds más rápidos)

Agrega a tu `.bashrc` / `.zshrc`:
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### Docker sin sudo de forma permanente (Linux)

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
sudo chmod g+rwx "$HOME/.docker" -R
```

Reinicia tu sesión.

### Aliases útiles

```bash
# Agrega a .bashrc / .zshrc
alias dps='docker ps'
alias dcu='docker-compose up'
alias dcd='docker-compose down'
alias dcb='docker-compose build'
alias dcl='docker-compose logs -f'
```

---

## 📖 Próximos Pasos

Ahora que tienes todo instalado:

1. 🎓 **[Guía para Principiantes](BEGINNERS_GUIDE.md)** - Tu primer laboratorio
2. 📚 **[Manual de Usuario](USER_MANUAL.md)** - Domina el flujo de trabajo
3. 🏗️ **[Arquitectura](ARCHITECTURE.md)** - Entiende cómo funciona

---

## 🆘 Ayuda

Si ninguna de estas soluciones funciona:
- 📋 [Troubleshooting](TROUBLESHOOTING.md)
- 🐛 [Reportar issue](https://github.com/vladimiracunadev-create/docker-labs/issues)
- 📖 [Documentación oficial de Docker](https://docs.docker.com/)

---

← [Volver al README](../README.md)
