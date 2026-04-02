# 07-rabbitmq-messaging

> Mensajeria asincrona con RabbitMQ 3 — producer, consumer y management UI.

---

## Servicios y puertos

| Servicio | Puerto host | Descripcion |
|---|---:|---|
| RabbitMQ AMQP | `5672` | Protocolo de mensajeria |
| RabbitMQ Management UI | `15672` | Interfaz de administracion web |

---

## Inicio rapido

```bash
# Levantar RabbitMQ
docker compose up -d

# En otra terminal: ejecutar el producer
npm run producer

# En otra terminal: ejecutar el consumer
npm run consumer
```

Management UI: <http://localhost:15672>

| Campo | Valor |
|---|---|
| Usuario | `user` |
| Password | `pass` |

---

## Health check

| Servicio | Check | Comando |
|---|---|---|
| RabbitMQ | Conectividad broker | `rabbitmq-diagnostics -q ping` |

El contenedor reporta `healthy` una vez que el broker esta listo para aceptar conexiones (puede tardar hasta 30 segundos en el primer arranque).

---

## Arquitectura

```text
Producer (Node.js)
  └── RabbitMQ (:5672)
        └── Consumer (Node.js)

RabbitMQ Management UI (:15672)
```

---

## Verificacion

```bash
# Estado del contenedor y health check
docker compose ps

# Verificar conectividad del broker
docker compose exec rabbitmq rabbitmq-diagnostics -q ping
# Attempting to connect to node rabbit@... :: connected successfully

# Ver colas activas desde la CLI
docker compose exec rabbitmq rabbitmqctl list_queues
```
