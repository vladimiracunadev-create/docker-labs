# 📘 Manual de Usuario — Docker Labs

> **Versión**: 1.4.0
> **Estado**: 🟢 Operativo
> **Audiencia**: 👥 Usuarios del workspace, operadores
> **Objetivo**: Operación diaria del panel y de los sistemas activos

---

## 🧭 Flujo recomendado

1. Abre el panel en [http://localhost:9090](http://localhost:9090)
2. Revisa el diagnóstico de equipo y Docker
3. Elige un lab o sistema principal
4. Usa `Levantar entorno`
5. Entra por `Abrir sistema`
6. Revisa logs si algo queda parcial
7. Baja o elimina entornos cuando termines

## 🧠 Diferencia clave

| Concepto | Significado |
|---|---|
| `Estado Docker` | Dice si el stack existe, corre y reporta salud |
| `Abrir sistema` | Entra a la app o API real dentro del contenedor |

## 🏛️ Sistemas principales

| Sistema | Estado | URL | Rol |
|---|---|---|---|
| Inventory Core | 🟢 | [http://localhost:8000](http://localhost:8000) | Core transaccional |
| Operations Portal | 🟢 | [http://localhost:8083](http://localhost:8083) | Capa operativa |
| Platform Gateway | 🟢 | [http://localhost:8085](http://localhost:8085) | Acceso unificado |
| Control Center | 🟢 | [http://localhost:9090](http://localhost:9090) | Operación del workspace |

## 🎯 Operación por casos

### Caso 1 — Aprender Docker con algo pequeño

Levanta:

- `01-node-api`
- `03-python-api`

### Caso 2 — Ver un backend serio

Levanta:

- `05-postgres-api`

### Caso 3 — Ver un producto más real

Levanta:

- `05-postgres-api`
- `09-multi-service-app`
- `06-nginx-proxy`

### Caso 4 — Experimentar con capacidades de infraestructura

Levanta según objetivo:

| Lab | Capacidad |
|---|---|
| `04-redis-cache` | Caché y performance |
| `07-rabbitmq-messaging` | Mensajería asíncrona |
| `08-prometheus-grafana` | Observabilidad |
| `11-elasticsearch-search` | Búsqueda de texto completo |
| `12-jenkins-ci` | Automatización CI |

## 🛠️ Comandos útiles

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

## 📊 Interpretación del diagnóstico

### Equipo estimado

Lo aporta el navegador y sirve como referencia rápida.

### Capacidad Docker

La aporta el daemon Docker y es la cifra más importante para decidir cuánto levantar.

### Recomendación del panel

El panel sugiere uno de tres modos según los recursos detectados:

| Modo | Cuándo aplica |
|---|---|
| Caso a caso | Recursos ajustados — levantar un lab a la vez |
| Plataforma principal | Recursos suficientes para `9090 + 05 + 09 + 06` |
| Labs con cautela | Recursos limitados para labs pesados (`08`, `11`, `12`) |

## ✅ Buenas prácticas

- No levantes todo si no lo necesitas
- Usa el gateway para navegar mejor entre servicios
- Revisa [Labs Runtime Reference](LABS_RUNTIME_REFERENCE.md) antes de mezclar labs pesados
- Usa `remove-all` solo cuando quieras limpiar también los volúmenes

## 🔗 Documentos relacionados

- [README del workspace](../README.md)
- [Dashboard Setup](DASHBOARD_SETUP.md)
- [FAQ](../FAQ.md)
