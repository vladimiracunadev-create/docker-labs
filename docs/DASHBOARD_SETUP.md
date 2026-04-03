# 🖥️ Dashboard Setup

> **Version**: 1.5.0
> **Estado**: 🟢 Activo
> **Objetivo**: Explicar como arranca y opera el Control Center actual

---

## 🧩 Rol del componente

El Control Center en `9090` existe para:

- mostrar el estado real del workspace
- ejecutar acciones sobre los labs desde Docker Compose
- diagnosticar capacidad del runtime y RAM disponible por lab
- guiar al usuario hacia la entrada correcta

## ⚡ Entrada soportada

### Windows

```powershell
scripts\start-control-center.cmd
```

### Linux/macOS

```bash
./scripts/start-control-center.sh
```

## ℹ️ Por que ya no se recomienda el compose directo sin wrapper

El contenedor del panel necesita conocer la ruta real del workspace en el host para poder operar otros `compose`. Por eso el flujo soportado ahora usa wrappers que resuelven el path correcto y evitan depender de `C:\docker-labs\docker-labs`.

## 💾 Indicador de RAM por lab

Cada tarjeta muestra un badge calculado en tiempo real contra la RAM libre de Docker:

| Badge | Condición |
|---|---|
| ✅ Verde | RAM libre suficiente para iniciar el lab |
| ⚠️ Amarillo | RAM ajustada — bajar otros labs ayuda |
| ⛔ Rojo | Docker no tiene suficiente RAM total para este lab |

## 🏗️ Arquitectura

- `dashboard-control/docker-compose.yml`
- `dashboard-control/Dockerfile`
- `dashboard-control/server.js`
- `index.html`
- `dashboard.js`
- `dashboard.css`

## 🔗 URLs útiles

- [http://localhost:9090](http://localhost:9090)
- [http://localhost:9090/api/overview](http://localhost:9090/api/overview)
- [http://localhost:9090/api/diagnostics](http://localhost:9090/api/diagnostics)
- [http://localhost:9090/learning-center.html](http://localhost:9090/learning-center.html)
- [http://localhost:8085/control/](http://localhost:8085/control/)

## 🔐 Seguridad

El servidor aplica:

- CORS restringido a `localhost:{puerto}` — no acepta origen externo
- Validación de `labId` contra lista conocida antes de ejecutar Docker
- Límite de 10 KB en el body de requests POST
- Errores internos logueados en `stderr` pero no expuestos al cliente

Para activar autenticación por token:

```bash
export DASHBOARD_TOKEN=tu-token-secreto
./scripts/start-control-center.sh
```

Ver [docs/SECURITY.md](SECURITY.md) para documentación completa.

## 📝 Notas operativas

- el panel no reemplaza Docker Desktop; lo usa como prerequisito
- el launcher Windows usa el mismo `dashboard-control/docker-compose.yml`
- los compose legacy de raiz ya no forman parte del flujo soportado

## 📚 Documentos relacionados

- [INSTALL.md](INSTALL.md)
- [../RUNBOOK.md](../RUNBOOK.md)
- [windows-installer.md](windows-installer.md)
