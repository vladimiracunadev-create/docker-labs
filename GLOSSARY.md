# Glossary

> **Version**: 1.4  
> **Estado**: Activo  
> **Uso recomendado**: Ideal para principiantes o para lectura rapida cuando un termino del repo no se entiende a la primera

---

## Terminos del workspace

| Termino | Significado |
|---|---|
| Workspace | El conjunto completo del repositorio funcionando como plataforma |
| Control Center | Panel principal dockerizado en `9090` |
| Platform Gateway | `06-nginx-proxy`, puerta de entrada comun |
| Inventory Core | `05-postgres-api`, backend transaccional principal |
| Operations Portal | `09-multi-service-app`, capa operativa sobre el core |
| Learning Center | Vista HTML con material de apoyo dentro del panel |

## Terminos Docker

| Termino | Significado |
|---|---|
| Imagen | Plantilla inmutable que sirve para crear contenedores |
| Contenedor | Proceso aislado en ejecucion basado en una imagen |
| Volumen | Almacenamiento persistente usado por contenedores |
| Compose | Herramienta para levantar multiples servicios coordinados |
| Healthcheck | Verificacion automatica para saber si un servicio esta sano |
| Puerto publicado | Mapeo entre el host y el contenedor, por ejemplo `9090:9090` |

## Terminos operativos del repo

| Termino | Significado |
|---|---|
| Levantar | Iniciar el stack o el lab |
| Bajar | Detener contenedores sin eliminar imagenes |
| Eliminar | Borrar contenedores, redes y recursos del repo |
| Modo caso a caso | Levantar solo el panel y despues un lab segun necesidad |
| Plataforma principal | `9090` + `05` + `06` + `09` |

## Documentos relacionados

- [docs/BEGINNERS_GUIDE.md](docs/BEGINNERS_GUIDE.md)
- [docs/DOCKER_BASICS.md](docs/DOCKER_BASICS.md)
- [OPERATING-MODES.md](OPERATING-MODES.md)
