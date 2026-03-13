# Beginner Guide

Guia pensada para personas que estan comenzando con Docker, Docker Compose y este repositorio.

## Que es este repositorio

`docker-labs` es una coleccion de 12 entornos Docker. Cada carpeta representa un caso de uso concreto:

- algunos son sistemas de negocio
- otros son servicios de infraestructura
- otros son starters para practicar stacks

La idea no es memorizar comandos. La idea es aprender a leer un entorno Docker, entender que resuelve y levantarlo solo cuando lo necesitas.

## Como empezar sin perderte

La forma mas simple de trabajar es esta:

1. Levanta solo el panel principal.
2. Revisa los sistemas activos.
3. Enciende un lab caso a caso.
4. Abre el sistema real desde el boton `Abrir sistema`.
5. Cuando termines, baja o elimina el entorno.

Comando recomendado:

```powershell
scripts\start-control-center.cmd
```

Entradas utiles:

- `http://localhost:9090`: panel principal
- `http://localhost:8085`: gateway unificado cuando `06` esta levantado

## Diferencia entre Docker y el sistema

Esta es la confusion mas comun al inicio.

- Docker: es la capa que levanta contenedores, redes y volumenes.
- El sistema: es la aplicacion o servicio que corre dentro del contenedor.

Ejemplo:

- `05-postgres-api` puede estar `healthy` en Docker
- y su sistema real se usa desde `http://localhost:8000`

Por eso el panel separa:

- `Estado Docker`
- `Control del entorno`
- `Abrir sistema`

## Flujo recomendado para novatos

### Paso 1. Valida prerequisitos

Necesitas:

- Docker Desktop o Docker Engine con Compose
- Git
- 8 GB de RAM como minimo practico

Verificacion:

```powershell
docker --version
docker compose version
git --version
```

### Paso 2. Inicia el panel

```powershell
scripts\start-control-center.cmd
```

### Paso 3. Entra al panel

Abre `http://localhost:9090`.

### Paso 4. Levanta solo un caso

Empieza por uno de estos:

- `05-postgres-api`: si quieres ver un backend transaccional serio
- `09-multi-service-app`: si quieres ver portal + backend + base de datos
- `01-node-api`: si quieres un ejemplo muy simple

### Paso 5. Observa las piezas

En cada lab intenta identificar:

- que contenedores levanta
- que imagen usa
- que puertos expone
- que volumen persiste datos
- cual es la entrada funcional del sistema

## Que aprender en este repo

### Nivel 1

Aprender a:

- levantar y bajar entornos
- leer `Dockerfile`
- leer `docker-compose.yml`
- distinguir imagen, contenedor, puerto y volumen

Labs sugeridos:

- `01-node-api`
- `03-python-api`
- `06-nginx-proxy`

### Nivel 2

Aprender a:

- conectar app y base de datos
- usar healthchecks
- entender redes entre servicios
- trabajar con dependencias entre contenedores

Labs sugeridos:

- `05-postgres-api`
- `09-multi-service-app`
- `02-php-lamp`

### Nivel 3

Aprender a:

- agregar cache
- usar mensajeria
- incorporar observabilidad
- pensar en plataforma

Labs sugeridos:

- `04-redis-cache`
- `07-rabbitmq-messaging`
- `08-prometheus-grafana`
- `11-elasticsearch-search`
- `12-jenkins-ci`

## Recomendacion de hardware

### Minimo practico

- CPU: 4 nucleos
- RAM: 8 GB
- Disco libre: 15 GB

Con esto puedes correr:

- el panel principal
- un lab sencillo a la vez

### Recomendado para trabajar comodo

- CPU: 6 a 8 nucleos
- RAM: 16 GB
- Disco libre: 30 GB SSD

Con esto puedes correr:

- `05`
- `06`
- `09`

al mismo tiempo, que es hoy la experiencia principal del repositorio.

### Para usar labs pesados

- CPU: 8 nucleos
- RAM: 24 GB o mas
- Disco libre: 40 GB SSD

Recomendado si vas a experimentar con:

- `08-prometheus-grafana`
- `11-elasticsearch-search`
- `12-jenkins-ci`

## Glosario rapido

- Imagen: plantilla base desde la que se crea un contenedor.
- Contenedor: instancia en ejecucion de una imagen.
- Volumen: almacenamiento persistente.
- Puerto publicado: puerta de entrada desde tu maquina al contenedor.
- Healthcheck: prueba automatica para saber si un servicio esta listo.
- Compose: archivo que orquesta varios servicios relacionados.

## Errores comunes

### El panel abre, pero el sistema no

Posibles causas:

- el lab no esta levantado
- el servicio aun esta iniciando
- otro proceso ya ocupa el puerto

### Docker esta arriba, pero la app se ve fea o vacia

Eso significa que el contenedor existe, pero todavia debes abrir la interfaz correcta del sistema o revisar los datos de ejemplo.

### Mi equipo se pone lento

Usa el modo caso a caso:

- deja solo el panel arriba
- levanta un solo lab
- baja todo al terminar

## Ruta sugerida de aprendizaje

1. `01-node-api`
2. `03-python-api`
3. `05-postgres-api`
4. `09-multi-service-app`
5. `06-nginx-proxy`
6. `04`, `07`, `08`, `11`, `12`

## Documentos para seguir

- [INSTALL](C:/docker-labs/docker-labs/docs/INSTALL.md)
- [USER_MANUAL](C:/docker-labs/docker-labs/docs/USER_MANUAL.md)
- [LABS_CATALOG](C:/docker-labs/docker-labs/docs/LABS_CATALOG.md)
- [LABS_RUNTIME_REFERENCE](C:/docker-labs/docker-labs/docs/LABS_RUNTIME_REFERENCE.md)
