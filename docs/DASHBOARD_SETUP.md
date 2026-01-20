# Configuración del Dashboard de Docker Labs

Este documento explica cómo configurar y ejecutar el dashboard completo de Docker Labs, que permite ejecutar todos los laboratorios simultáneamente en un entorno Docker unificado.

## 📋 Requisitos Previos

- **Docker y Docker Compose**: Versión 20+ recomendada. Instala desde [docker.com](https://www.docker.com/).
- **Sistema Operativo**: Windows, macOS o Linux con soporte para Docker Desktop.
- **Recursos**: Mínimo 8 GB RAM, 4 CPU cores. Recomendado 16 GB RAM para mejor rendimiento.
- **Puertos libres**: Asegúrate de que los siguientes puertos no estén en uso:
  - 9090 (Dashboard principal)
  - 3000, 3001, 5000, 8000, 8080, 8081, 8082
  - 3307, 5433, 5672, 15672

## 🚀 Inicio Rápido

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/docker-labs.git
cd docker-labs
```

### 2. Ejecutar el Dashboard Completo

```bash
docker-compose -f docker-compose-dashboard-simple.yml up -d --build
```

Este comando:
- Construirá todas las imágenes necesarias (primera ejecución toma tiempo).
- Iniciará todos los contenedores en segundo plano.
- Configurará redes y volúmenes automáticamente.

### 3. Acceder al Dashboard

Abre tu navegador en: **http://localhost:9090**

Verás una interfaz con tarjetas para cada laboratorio, mostrando su estado (activo/inactivo) y enlaces directos.

## 📚 Laboratorios Incluidos

El dashboard incluye los siguientes laboratorios, todos ejecutándose simultáneamente:

| Lab | Descripción | Puertos | Estado |
|-----|-------------|---------|--------|
| 01-node-api | API REST básica con Node.js | 3000 | ✅ Activo |
| 02-php-lamp | Stack LAMP completo | 8081 (Web), 8082 (phpMyAdmin) | ✅ Activo |
| 03-python-api | API REST con Flask | 5000 | ✅ Activo |
| 04-redis-cache | API con caching Redis | 3001 | ✅ Activo |
| 05-postgres-api | API con PostgreSQL | 8000 | ✅ Activo |
| 06-nginx-proxy | Reverse proxy con balanceo | 8082 | ✅ Activo |
| 07-rabbitmq-messaging | Mensajería con RabbitMQ | 5672 (AMQP), 15672 (Management) | ✅ Activo |
| 08-prometheus-grafana | Monitoreo con Prometheus y Grafana | 9090 (Prometheus), 3002 (Grafana) | ✅ Activo |
| 09-multi-service-app | App full-stack React/Node.js/MongoDB | 8083 (Frontend), 3003 (Backend) | ✅ Activo |
| 10-go-api | API REST en Go | 8084 | ✅ Activo |
| 11-elasticsearch-search | Búsqueda con Elasticsearch | 8001 (API), 9200 (ES) | ✅ Activo |
| 12-jenkins-ci | CI/CD con Jenkins | 8085 (Web), 50001 (Slave) | ✅ Activo |

## 🔍 Verificación de Estado

### Contenedores Activos

```bash
docker ps
```

Deberías ver ~15 contenedores corriendo, todos con nombres que empiezan por `dashboard-`.

### Logs de un Servicio Específico

```bash
docker-compose -f docker-compose-dashboard-simple.yml logs [nombre-servicio]
```

Ejemplo:
```bash
docker-compose -f docker-compose-dashboard-simple.yml logs node-api
```

### Healthchecks

Cada servicio tiene healthchecks automáticos. El dashboard muestra el estado en tiempo real.

## 🛠️ Troubleshooting

### Problema: "Port already in use"

**Solución**: Detén otros servicios que usen los puertos requeridos, o modifica los puertos en `docker-compose-dashboard-simple.yml`.

### Problema: Contenedor no inicia

**Solución**:
1. Verifica logs: `docker-compose -f docker-compose-dashboard-simple.yml logs [servicio]`
2. Reinicia: `docker-compose -f docker-compose-dashboard-simple.yml restart [servicio]`
3. Reconstruye: `docker-compose -f docker-compose-dashboard-simple.yml up -d --build [servicio]`

### Problema: Lentitud o alto uso de recursos

**Solución**:
- Ejecuta menos labs simultáneamente comentando servicios en el compose.
- Aumenta recursos de Docker Desktop (RAM/CPU).
- Usa `docker system prune` para limpiar imágenes no usadas.

### Problema: Dashboard no carga

**Solución**:
- Verifica que el contenedor `docker-labs-dashboard` esté corriendo.
- Accede directamente a http://localhost:9090
- Revisa logs del dashboard.

### Problema: API no responde

**Solución**:
- Verifica que la base de datos correspondiente esté healthy (ej: postgres-db).
- Usa `curl` para probar: `curl http://localhost:[puerto]/health`

## 🏗️ Arquitectura

- **Red**: Todos los contenedores comparten la red `docker-labs_default`.
- **Volúmenes**: Datos persistentes para bases de datos (MariaDB, PostgreSQL, Redis).
- **Healthchecks**: Automáticos para servicios críticos (bases de datos, APIs).
- **Dependencias**: Servicios esperan a sus dependencias (ej: APIs esperan a DBs).

## 📝 Desarrollo y Contribución

- **Agregar nuevo lab**: Crea carpeta en raíz, actualiza `docker-compose-dashboard-simple.yml`, `index.html` y este documento.
- **Modificar configuración**: Edita archivos en `docker-compose-dashboard-simple.yml`.
- **Testing**: Ejecuta `docker-compose -f docker-compose-dashboard-simple.yml up --build` para probar cambios.

## 🔄 Actualizaciones

Para actualizar el entorno:
```bash
git pull
docker-compose -f docker-compose-dashboard-simple.yml down
docker-compose -f docker-compose-dashboard-simple.yml up -d --build
```

## 📞 Soporte

Si encuentras problemas:
1. Revisa esta documentación.
2. Verifica logs de contenedores.
3. Abre un issue en el repositorio con detalles del error.

¡Disfruta explorando Docker Labs! 🐳

# Actualización menor para probar GitHub Actions

Este cambio es para verificar que los workflows de GitHub Actions se ejecuten correctamente.