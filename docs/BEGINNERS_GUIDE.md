# Guía para Principiantes 🎓

**Bienvenido a docker-labs**, tu laboratorio personal para dominar Docker y Docker Compose.

Esta guía está diseñada para personas que están dando sus primeros pasos con contenedores y quieren aprender de forma práctica.

---

## 🤔 ¿Qué es docker-labs?

`docker-labs` es una colección de **laboratorios independientes** que te permiten aprender Docker mediante ejemplos reales y funcionales. Cada laboratorio es un mini-proyecto completo con:

- 🐳 Configuración Docker lista para usar
- 💻 Código funcional de ejemplo
- 📝 Documentación clara
- 🎯 Un objetivo de aprendizaje específico

**No es**: Un curso teórico, un framework de producción, ni una aplicación completa.  
**Es**: Tu espacio seguro para experimentar, romper cosas y aprender.

---

## ✅ Prerrequisitos

Antes de comenzar, necesitas tener instalado:

### 1. Docker
- **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- **macOS**: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

### 2. Docker Compose
- Incluido con Docker Desktop (Windows/Mac)
- En Linux: `sudo apt-get install docker-compose-plugin`

### 3. Git
- Para clonar el repositorio: [git-scm.com](https://git-scm.com/downloads)

### 4. Editor de código (opcional pero recomendado)
- [Visual Studio Code](https://code.visualstudio.com/)
- Extensión Docker para VS Code

**Verificación**:
```bash
docker --version
docker-compose --version
git --version
```

---

## 🏗️ Conceptos Básicos de Docker

### Contenedor vs Imagen

**Imagen**: Es como una "plantilla" o "receta". Define qué software tiene el contenedor.  
**Contenedor**: Es la "instancia en ejecución" de una imagen. Es como cocinar el plato siguiendo la receta.

```
Imagen (php:8.1-apache) → Contenedor (tu app corriendo)
```

### Volúmenes

Los **volúmenes** permiten que los datos sobrevivan cuando el contenedor se elimina.

- **Código**: Se monta desde tu máquina (host) al contenedor
- **Datos**: Bases de datos, archivos subidos, etc.

### Dockerfile

Un archivo de texto que contiene las instrucciones para construir una imagen:

```dockerfile
FROM php:8.1-apache
WORKDIR /var/www/html
COPY . .
RUN apt-get update && apt-get install -y libpng-dev
```

### docker-compose.yml

Archivo que define **múltiples servicios** (contenedores) y cómo se conectan:

```yaml
services:
  web:
    image: php:8.1-apache
    ports:
      - "8080:80"
  db:
    image: mariadb:10.6
```

---

## 📁 Estructura del Repositorio

Cuando clones `docker-labs`, verás esta estructura:

```
docker-labs/
├── README.md              # Punto de entrada principal
├── LICENSE                # Licencia Apache 2.0
├── docs/                  # 📖 Toda la documentación
│   ├── BEGINNERS_GUIDE.md # ← Estás aquí
│   ├── USER_MANUAL.md
│   ├── LABS_CATALOG.md
│   └── ...
├── 01-node-api/              # 🟢 Laboratorio Node.js
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── src/
├── 02-php-lamp/              # 🐘 Laboratorio PHP + Apache + MariaDB
│   ├── docker-compose.yml
│   ├── docker/
│   └── src/
└── 03-python-api/            # 🐍 Laboratorio Python Flask
    ├── Dockerfile
    ├── docker-compose.yml
    └── app/
```

### ¿Por qué esta estructura?

Cada carpeta (`01-node-api/`, `02-php-lamp/`, etc.) es un **laboratorio independiente**:
- ✅ Puedes trabajar en uno sin afectar los demás
- ✅ Cada uno tiene su propio `docker-compose.yml`
- ✅ Puedes eliminar los que no te interesen

---

## 🚀 Tu Primer Laboratorio: 01-node-api

Vamos a levantar tu primer contenedor paso a paso.

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/vladimiracunadev-create/docker-labs.git
cd docker-labs
```

### Paso 2: Navegar al laboratorio

```bash
cd 01-node-api
```

### Paso 3: Levantar el contenedor

```bash
docker-compose up
```

Verás muchas líneas de texto. ¡No te asustes! Docker está:
1. Descargando la imagen de Node.js
2. Instalando dependencias
3. Levantando el servidor

### Paso 4: Probar que funciona

Abre tu navegador en: http://localhost:3000

Deberías ver un mensaje JSON:
```json
{
  "message": "Hello from Node.js in Docker!"
}
```

### Paso 5: Ver los logs

En la misma terminal, verás los logs en tiempo real. Cada petición HTTP aparece ahí.

### Paso 6: Detener el contenedor

Presiona `Ctrl+C` en la terminal.

Para detenerlo completamente:
```bash
docker-compose down
```

---

## 🎯 ¿Qué Acabas de Hacer?

1. ✅ Levantaste un servidor Node.js **sin instalar Node.js en tu máquina**
2. ✅ El servidor corre **aislado** en un contenedor
3. ✅ El código está en tu máquina, pero se ejecuta en el contenedor
4. ✅ Puedes editar el código y ver los cambios (según configuración)

---

## 🔍 Comandos Esenciales para Principiantes

### Ver contenedores activos
```bash
docker ps
```

### Ver todas las imágenes descargadas
```bash
docker images
```

### Entrar a un contenedor (modo interactivo)
```bash
docker exec -it <nombre-contenedor> bash
```

### Limpiar todo (cuidado: elimina contenedores detenidos)
```bash
docker system prune
```

### Levantar en segundo plano (detached)
```bash
docker-compose up -d
```

### Ver logs de un servicio específico
```bash
docker-compose logs web
```

---

## 📖 Glosario de Términos

| Término | Significado |
|---------|-------------|
| **Imagen** | Plantilla inmutable que contiene el sistema operativo, runtime y código |
| **Contenedor** | Instancia en ejecución de una imagen |
| **Volumen** | Espacio de almacenamiento persistente |
| **Puerto** | Punto de comunicación (ej: 8080:80 = host:contenedor) |
| **Servicio** | Definición de un contenedor en docker-compose |
| **Build** | Proceso de crear una imagen desde un Dockerfile |
| **Host** | Tu máquina física (Windows/Mac/Linux) |
| **Bind mount** | Carpeta de tu host montada en el contenedor |

---

## 🎓 Próximos Pasos

Ahora que ya levantaste tu primer lab, continúa con:

1. 📖 **[Manual de Usuario](USER_MANUAL.md)**: Domina el flujo de trabajo completo
2. 📋 **[Catálogo de Laboratorios](LABS_CATALOG.md)**: Explora todos los labs disponibles
3. 🔧 **[Docker Basics](DOCKER_BASICS.md)**: Profundiza en conceptos de Docker
4. 🏗️ **[Arquitectura](ARCHITECTURE.md)**: Entiende cómo están diseñados los laboratorios

---

## 🆘 ¿Problemas?

Si algo no funciona:
1. Consulta **[Troubleshooting](TROUBLESHOOTING.md)**
2. Revisa que Docker Desktop esté corriendo
3. Verifica que el puerto no esté ocupado
4. Abre un [issue en GitHub](https://github.com/vladimiracunadev-create/docker-labs/issues)

---

## 💡 Consejos Finales

- 🧪 **Experimenta**: Modifica el código, rompe cosas, aprende
- 📝 **Lee los logs**: Ahí está el 80% de la información cuando algo falla
- 🔄 **Reinicia**: `docker-compose down` + `docker-compose up` soluciona muchos problemas
- 🌐 **Googlea**: "docker <tu-error>" es tu amigo
- 🤝 **Contribuye**: Si mejoras algo, comparte tu PR

---

**¡Felicidades!** Ya diste el primer paso en tu journey con Docker. 🚀

← [Volver al README](../README.md)
