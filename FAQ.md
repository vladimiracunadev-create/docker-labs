# ❓ FAQ

## 🚪 Cual es la entrada principal del repo

El Control Center:

[http://localhost:9090](http://localhost:9090)

## 🐳 El panel corre fuera de Docker

No. Ahora el panel tambien corre como contenedor Docker.

## 💻 Que hago si quiero cuidar recursos

Usa modo caso a caso:

- deja `9090` arriba
- revisa el diagnostico
- levanta solo el sistema que necesitas

## 📊 Como se si mi equipo aguanta mas labs

El panel muestra:

- estimacion del equipo anfitrion
- CPU y RAM asignadas a Docker
- uso actual de contenedores
- recomendacion de que labs conviene levantar

## 🧠 Que es mas importante: mi RAM o la de Docker

Para contenedores, la cifra mas importante es la memoria asignada a Docker.

## 🏗️ Cuales son los sistemas principales

- `05-postgres-api`
- `06-nginx-proxy`
- `09-multi-service-app`
- `dashboard-control`

## 🌐 El gateway reemplaza al panel

No. El gateway unifica accesos. El panel gobierna el workspace.

## 🆘 Que hago si `9090` no abre

```powershell
docker compose -f dashboard-control\docker-compose.yml up -d --build
```

## 🧹 Puedo borrar todos los Docker del repo desde el panel

Si. El panel ya ofrece:

- `Bajar todos los Docker`
- `Eliminar entornos del repo`

## 🔗 Donde sigo leyendo

- [README](README.md)
- [Install Guide](docs/INSTALL.md)
- [Dashboard Setup](docs/DASHBOARD_SETUP.md)
