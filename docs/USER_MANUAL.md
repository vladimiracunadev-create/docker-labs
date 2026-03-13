# User Manual

Manual operativo del workspace.

## Flujo recomendado

1. abre el panel en `http://localhost:9090`
2. revisa el diagnostico de equipo y Docker
3. elige un lab o sistema principal
4. usa `Levantar entorno`
5. entra por `Abrir sistema`
6. revisa logs si algo queda parcial
7. baja o elimina entornos cuando termines

## Diferencia clave

- `Estado Docker`: dice si el stack existe, corre y reporta salud
- `Abrir sistema`: entra a la app o API real dentro del contenedor

## Sistema principal recomendado

### Inventory Core

- URL: `http://localhost:8000`
- docs: `http://localhost:8000/docs`
- rol: core transaccional

### Operations Portal

- URL: `http://localhost:8083`
- rol: experiencia operativa

### Platform Gateway

- URL: `http://localhost:8085`
- rol: acceso unificado a panel, core y portal

### Control Center

- URL: `http://localhost:9090`
- rol: operacion del workspace

## Operacion por casos

### Caso 1. Quiero aprender Docker con algo pequeno

Levanta:

- `01-node-api`
- `03-python-api`

### Caso 2. Quiero ver un backend serio

Levanta:

- `05-postgres-api`

### Caso 3. Quiero ver un producto mas real

Levanta:

- `05-postgres-api`
- `09-multi-service-app`
- `06-nginx-proxy`

### Caso 4. Quiero experimentar con capacidades

Levanta segun objetivo:

- `04-redis-cache`: cache
- `07-rabbitmq-messaging`: mensajeria
- `08-prometheus-grafana`: observabilidad
- `11-elasticsearch-search`: busqueda
- `12-jenkins-ci`: CI

## Comandos utiles

### Levantar un stack

```powershell
docker compose -f 05-postgres-api\docker-compose.yml up -d --build
```

### Bajar un stack

```powershell
docker compose -f 05-postgres-api\docker-compose.yml down
```

### Ver contenedores

```powershell
docker ps
```

### Ver logs

```powershell
docker compose -f 05-postgres-api\docker-compose.yml logs --tail 80
```

## Interpretacion del diagnostico

### Equipo estimado

Lo aporta el navegador y sirve como referencia rapida.

### Capacidad Docker

La aporta el daemon Docker y es la cifra mas importante para decidir cuanto levantar.

### Recomendacion

El panel sugiere:

- modo caso a caso
- plataforma principal
- labs a levantar con cautela

## Buenas practicas

- no levantes todo si no lo necesitas
- usa el gateway para navegar mejor
- revisa `LABS_RUNTIME_REFERENCE` antes de mezclar labs pesados
- usa `remove-all` solo cuando quieras limpiar tambien volumenes
