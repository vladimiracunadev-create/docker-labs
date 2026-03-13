# 🎓 Beginner Guide

Guia pensada para personas que estan empezando con Docker, Docker Compose y este repositorio.

## 🧭 Si solo lees una cosa

Empieza asi:

1. levanta el panel en [http://localhost:9090](http://localhost:9090)
2. revisa el diagnostico del equipo
3. levanta un solo lab
4. entra por `Abrir sistema`
5. cuando termines, baja o elimina el entorno

Documentos relacionados:

- [Install Guide](C:/docker-labs/docker-labs/docs/INSTALL.md)
- [User Manual](C:/docker-labs/docker-labs/docs/USER_MANUAL.md)
- [Labs Runtime Reference](C:/docker-labs/docker-labs/docs/LABS_RUNTIME_REFERENCE.md)

## 🧱 Que es este repositorio

`docker-labs` es una coleccion de 12 entornos Docker con tres tipos de casos:

- 🟦 sistemas de negocio
- 🟨 servicios de infraestructura
- 🟩 starters para practicar stacks

## 🐳 Docker vs sistema

Esta es la confusion mas comun al inicio:

| Concepto | Que significa |
|---|---|
| Docker | La capa que levanta contenedores, redes y volumenes |
| Sistema | La app, API o servicio que corre dentro del contenedor |

Ejemplo:

- `05-postgres-api` puede estar `healthy` en Docker
- el sistema real se usa desde [http://localhost:8000](http://localhost:8000)

Por eso el panel separa:

- `Estado Docker`
- `Control del entorno`
- `Abrir sistema`

## 🚀 Primer flujo recomendado

### Paso 1. Verifica prerequisitos

```powershell
docker --version
docker compose version
git --version
```

Necesitas como minimo:

- Docker activo
- Git
- 8 GB RAM practicos

### Paso 2. Levanta el panel

```powershell
scripts\start-control-center.cmd
```

### Paso 3. Entra al panel

- Control Center: [http://localhost:9090](http://localhost:9090)
- Learning Center: [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html)

### Paso 4. Elige un caso simple

| Lab | Ideal para aprender |
|---|---|
| `01-node-api` | API basica, puertos y contenedor simple |
| `03-python-api` | Python dockerizado y estructura minima |
| `05-postgres-api` | App + base de datos + healthchecks |

### Paso 5. Observa estas piezas

Cada vez que levantes un lab, intenta responder:

- que imagen usa
- que puertos publica
- que volumen persiste datos
- cuantos contenedores levanta
- cual es la entrada funcional real

## 📚 Ruta de aprendizaje

### 🟢 Nivel 1

Aprender a:

- levantar y bajar entornos
- leer `Dockerfile`
- leer `docker-compose.yml`
- entender puertos y bind mounts

Labs sugeridos:

- `01-node-api`
- `03-python-api`
- `06-nginx-proxy`

### 🟡 Nivel 2

Aprender a:

- conectar app y base de datos
- entender healthchecks
- trabajar con multiples servicios

Labs sugeridos:

- `05-postgres-api`
- `09-multi-service-app`
- `02-php-lamp`

### 🔴 Nivel 3

Aprender a:

- agregar cache
- usar mensajeria
- sumar observabilidad
- pensar como plataforma

Labs sugeridos:

- `04-redis-cache`
- `07-rabbitmq-messaging`
- `08-prometheus-grafana`
- `11-elasticsearch-search`
- `12-jenkins-ci`

## 💻 Recomendacion de hardware

| Perfil | CPU | RAM | Disco | Uso recomendado |
|---|---:|---:|---:|---|
| Basico | 4 nucleos | 8 GB | 15 GB | Panel + 1 lab |
| Comodo | 6-8 nucleos | 16 GB | 30 GB SSD | `05 + 06 + 09 + 9090` |
| Avanzado | 8+ nucleos | 24 GB+ | 40 GB SSD | Plataforma + labs pesados |

## ⚠️ Errores comunes

### El panel abre, pero la app no

Posibles causas:

- el lab no esta levantado
- el servicio sigue iniciando
- el puerto esta ocupado

### Docker esta arriba, pero la interfaz se ve "vacia"

Eso significa que el contenedor existe, pero aun no abriste la entrada correcta del sistema o faltan datos de ejemplo.

### Mi equipo se pone lento

Usa modo caso a caso:

- deja `9090` arriba
- levanta un solo lab
- evita mezclar `08`, `11` y `12`

## ✅ Objetivo de esta guia

Que puedas pasar de:

- "solo veo contenedores"

a:

- "entiendo que resuelve cada entorno y se cuando conviene levantarlo"
