# Technical Audit

> **Version**: 1.5  
> **Estado**: Activo  
> **Objetivo**: Diagnostico tecnico previo y posterior a la capa Windows para dejar trazabilidad de decisiones

---

## Alcance auditado

Se revisaron:

- estructura completa del repo
- `README.md`, docs operativas y docs tecnicas
- `dashboard-control`, scripts de arranque y `docker-compose`
- labs principales `05`, `06`, `09`
- labs con conflicto de puertos `08` y `11`
- CI, `Makefile` y artefactos de release existentes

## Entrada principal real detectada

La entrada principal real del repo es:

1. `scripts\start-control-center.cmd` en Windows
2. `./scripts/start-control-center.sh` en Linux/macOS
3. `dashboard-control/docker-compose.yml`
4. `dashboard-control/server.js`
5. `index.html` + `dashboard.js` + `dashboard.css`

La experiencia principal del workspace se apoya despues en:

- `05-postgres-api`
- `09-multi-service-app`
- `06-nginx-proxy`

## Hallazgos relevantes

### 1. Ruta hardcodeada en el Control Center

`dashboard-control/docker-compose.yml` dependia de una ruta fija a `C:\docker-labs\docker-labs` para que el contenedor pudiera operar otros `compose`. Eso hacia fragile el flujo y bloqueaba una instalacion seria fuera de la ruta original.

Correccion aplicada:

- se reemplazo la ruta fija por variables resueltas por wrappers soportados
- se agregaron `scripts\start-control-center.cmd`, `scripts/start-control-center.sh` y `scripts/windows/Start-ControlCenter.ps1` como entrada fiable

### 2. Doble narrativa de dashboard

El repo contenia `docker-compose-dashboard.yml` y `docker-compose-dashboard-simple.yml` en la raiz, mientras la documentacion principal ya describia al `dashboard-control` moderno en `9090` como entrada real.

Correccion aplicada:

- CI y `Makefile` quedaron alineados al flujo soportado actual
- los compose legacy de raiz dejan de ser flujo validado y no se incluyen en el instalador Windows

### 3. Artefacto versionado dentro del repo

Existia `docker-labs-v1.0.0.zip` versionado en la raiz. Eso contradice la estrategia actual de distribucion por GitHub Releases y la regla de no dejar binarios finales en el repo.

Correccion aplicada:

- el artefacto fue removido
- `.gitignore` ahora bloquea `docker-labs-v*.zip`

### 4. Conflictos de puertos documentados de forma insuficiente

- `08-prometheus-grafana` usa `9090`, el mismo puerto del Control Center
- `11-elasticsearch-search` usa `8000`, el mismo puerto del Inventory Core

Esto no invalida los labs, pero si exige dejar claro que son labs de uso caso a caso y no parte de la plataforma principal simultanea.

Correccion aplicada:

- el manifest central documenta estos conflictos
- la documentacion del catalogo y de los labs se alinea con esta realidad

### 5. Documentacion de algunos labs atrasada

Se detectaron referencias antiguas a `docker-compose`, un puerto de Grafana desalineado y ausencia de trazabilidad sobre distribucion Windows.

Correccion aplicada:

- se actualizaron docs clave
- se agregaron guias especificas de auditoria, instalador Windows y distribucion por GitHub Releases

## Que entra al instalador Windows

El instalador copia un staging curado:

- workspace Docker soportado
- docs relevantes
- scripts del repo necesarios para operar
- launcher compilado
- manifest de distribucion

No entra al instalador:

- `.git`
- `.github`
- `dist/`
- fuentes de `launcher/`, `installer/` y `packaging/`
- compose legacy de raiz
- artefactos `.zip` antiguos versionados

## Resultado de la auditoria

La capa Windows se puede agregar sin romper la esencia del proyecto porque:

- el flujo Docker actual se conserva
- las correcciones aplicadas son minimas y justificadas
- el launcher opera sobre el mismo workspace Compose real
- la distribucion por GitHub Releases evita ensuciar el repo con binarios finales

## Documentos relacionados

- [windows-installer.md](windows-installer.md)
- [github-releases-distribution.md](github-releases-distribution.md)
- [../RELEASE.md](../RELEASE.md)
