# 🐛 Solución de Problemas y Desafíos Técnicos

Este documento detalla los desafíos técnicos encontrados durante la estabilización del proyecto `docker-labs` y las soluciones implementadas. Sirve como registro de aprendizaje y guía para troubleshooting futuro.

## 📋 Resumen de Desafíos

Durante el proceso de configuración del CI/CD y despliegue local, nos enfrentamos a múltiples errores en los archivos `docker-compose`, configuraciones de Nginx y builds de Docker. A continuación se detallan los más críticos.

---

## 1. 📂 Rutas de Contexto de Build Incorrectas

**Problema:**
Los archivos `docker-compose-dashboard*.yml` referenciaban directorios incorrectos (por ejemplo, `build: ./03-node-api` cuando el directorio real era `01-node-api`). Esto causaba que `docker-compose build` fallara inmediatamente al no encontrar el `Dockerfile`.

**Solución:**
Se auditaron y corrigieron todas las rutas en `docker-compose-dashboard-simple.yml` y `docker-compose-dashboard.yml` para coincidir exactamente con la estructura de carpetas del repositorio.

---

## 2. 🔌 Conflicto de Puertos (8082)

**Problema:**
El laboratorio `02-php-lamp` utilizaba el puerto **8082** para `phpmyadmin`. Simultáneamente, el laboratorio `06-nginx-proxy` intentaba publicar en el mismo puerto **8082**. Al levantar el entorno completo (Dashboard), ocurría un conflicto de puertos.

**Solución:**
Se reasignó el puerto de publicación de `06-nginx-proxy` a **8085** en los archivos de composición global para evitar la colisión.

---

## 3. 🐘 PHP-LAMP Falta de Dockerfile y Variables

**Problema A:**
El servicio `php-lamp` fallaba al construir porque su `Dockerfile` no estaba en la raíz `02-php-lamp/`, sino en `02-php-lamp/docker/php/`.
**Problema B:**
El servicio intentaba conectar a la base de datos usando credenciales por defecto que no coincidían con el servicio `mariadb` definido en el Dashboard.

**Solución:**
*   Se corrigió la directiva `build` para apuntar a `./02-php-lamp/docker/php`.
*   Se inyectaron las variables de entorno correctas (`DB_HOST`, `DB_USER`, `DB_PASS`) en el `docker-compose-dashboard-simple.yml`.
*   Se agregó un volumen para montar el código fuente (`src`) en `/var/www/html`.

---

## 4. 🌐 Nginx Proxy: "Host not found" y "resolve"

**Problema (El más persistente):**
Nginx (versión Open Source) tiene dos limitaciones críticas que causaron fallos en el CI:
1.  **Crash al inicio:** Si un `upstream` definido (ej: `server node-api:3000`) no está resuelto por DNS al momento de arrancar Nginx, el contenedor muere ("Emergency exit").
2.  **Sintaxis inválida:** La directiva `resolve` (usada para intentar mitigar lo anterior) es exclusiva de **Nginx Plus** (versión paga) y causa error de sintaxis en la versión gratuita.

**Solución:**
*   **Fix de Sintaxis:** Se eliminó la palabra clave `resolve` de todos los archivos `.conf`.
*   **Fix Standalone (`06-nginx-proxy`):** Se creó un servicio "mock" (usando `traefik/whoami`) que responde a los nombres de los servicios faltantes cuando el lab se corre de forma aislada.
*   **Fix de Estabilidad:** Se simplificaron los `upstream` en el dashboard para apuntar a un solo nombre canónico y confiable (`dashboard-node-api`) en lugar de múltiples alias que podrían fallar.

---

## 5. 🏥 Healthchecks Incorrectos (Nginx)

**Problema:**
El healthcheck de `06-nginx-proxy` hacía `curl http://localhost/`. Como la ruta `/` intentaba proxyar a un backend que no existía en la prueba aislada, devolvía **502 Bad Gateway**, marcando el contenedor como *unhealthy*.

**Solución:**
Se modificó el `nginx.conf` y el `Dockerfile` para usar un endpoint dedicado `/health` que devuelve `200 OK` directamente desde Nginx, sin depender de backends.

---

## 6. 🐹 Go API Port Mapping

**Problema:**
El servicio `10-go-api` escuchaba internamente en el puerto **8080** (hardcoded en `main.go`).
Sin embargo, el `docker-compose` intentaba mapear `7002:7002`.
Esto significaba que el tráfico llegaba al puerto 7002 del contenedor, donde nadie escuchaba.

**Solución:**
Se corrigió el mapeo de puertos a `7002:8080` (Puerto Host : Puerto Contenedor).

---

## 📝 Lecciones Aprendidas

1.  **Consistencia de Puertos:** Mantener un registro central de puertos usados para evitar colisiones al combinar microservicios.
2.  **Validación de Rutas:** El copy-paste de configuraciones entre archivos individuales y globales es propenso a errores de ruta (`./` vs `../`).
3.  **Nginx OSS vs Plus:** No asumir que directivas como `resolve` funcionan en todas las versiones.
4.  **Healthchecks Independientes:** Los healthchecks de infraestructura (como un proxy) no deberían depender de la salud de sus dependencias (backends), sino de su propia capacidad de responder.

