# Security Policy 🛡️

Política de seguridad y procedimiento de reporte de vulnerabilidades para **docker-labs**.

---

## 🔐 Reportar una Vulnerabilidad

Si encuentras una vulnerabilidad de seguridad en este proyecto, **por favor repórtala de forma confidencial**.

### Métodos de Reporte

**Opción 1: GitHub Security Advisory** (Recomendado)
1. Ve a [Security > Advisories](https://github.com/vladimiracunadev-create/docker-labs/security/advisories)
2. Click en "Report a vulnerability"
3. Completa el formulario privado

**Opción 2: Email Privado**
- Envía a: [vladimirjacv@gmail.com](mailto:vladimirjacv@gmail.com)
- Asunto: `[SECURITY] docker-labs: <descripción breve>`

### Información a Incluir

Por favor proporciona:

- ✅ **Descripción clara** del problema de seguridad
- ✅ **Pasos para reproducir** la vulnerabilidad
- ✅ **Impacto estimado** (bajo/medio/alto/crítico)
- ✅ **Laboratorio afectado** (01-node-api, 02-php-lamp, etc.)
- ✅ **Versión afectada** (si la conoces)
- ✅ **Posible parche o mitigación** (si tienes alguno)
- ✅ **CVE ID** (si ya existe uno asignado)

**⚠️ NO abras issues públicos para vulnerabilidades de seguridad.**

---

## ⏱️ Tiempos de Respuesta

| Etapa | Tiempo Estimado |
|-------|-----------------|
| **Confirmación de recepción** | 48 horas |
| **Evaluación inicial** | 5 días laborables |
| **Plan de mitigación** | 7 días laborables |
| **Parche disponible** | 14-30 días (según severidad) |

Los tiempos dependen de la severidad y complejidad de la vulnerabilidad.

---

## 🏷️ Severidad

Clasificamos vulnerabilidades según [CVSS v3.1](https://www.first.org/cvss/v3.1/specification-document):

| Nivel | Score CVSS | Descripción | Ejemplo |
|-------|------------|-------------|---------|
| **Crítico** | 9.0 - 10.0 | Explotación remota sin autenticación | RCE, SQLi en código de ejemplo |
| **Alto** | 7.0 - 8.9 | Requiere interacción o autenticación | XSS almacenado, escalación de privilegios |
| **Medio** | 4.0 - 6.9 | Impacto limitado | Path traversal, info disclosure |
| **Bajo** | 0.1 - 3.9 | Impacto mínimo | Bugs de configuración |

---

## 📋 Versiones Soportadas

docker-labs es un proyecto educativo. Soportamos:

| Componente | Versión | Soporte |
|------------|---------|---------|
| **docker-labs (repo)** | latest (main branch) | ✅ Activo |
| **docker-labs (repo)** | versiones anteriores | ❌ No soportado |
| **Node.js** | 18.x LTS | ✅ Activo |
| **PHP** | 8.1.x | ✅ Activo |
| **Python** | 3.10.x | ✅ Activo |
| **MariaDB** | 10.6.x | ✅ Activo |

**Nota**: Las imágenes Docker base siguen la política de sus respectivos mantenedores.

---

## 🔒 Divulgación Responsable

Seguimos principios de **divulgación coordinada**:

1. ✅ Reportas la vulnerabilidad de forma privada
2. ✅ Trabajamos juntos en un parche
3. ✅ Se da tiempo razonable para parchear (30-90 días)
4. ✅ Se publica advisory público coordinado
5. ✅ (Opcional) Te acreditamos en el advisory

**No publicaremos** vulnerabilidades hasta que:
- Exista un parche disponible, O
- Hayan pasado 90 días desde el reporte inicial

---

## 🎖️ Reconocimiento

Agradecemos a los investigadores de seguridad que reportan responsablemente:

**Hall of Fame** (Futuro):
- [Tu nombre aquí] - Primera vulnerabilidad reportada responsablemente

---

## 🔐 Mejores Prácticas de Seguridad

Al usar docker-labs en entornos reales (no recomendado para producción):

### ⚠️ Recomendaciones

❌ **NO uses docker-labs en producción** sin auditar y endurecer  
✅ **Cambia todas las contraseñas** de `.env.example`  
✅ **Usa versiones específicas** de imágenes (no `latest`)  
✅ **Mantén Docker actualizado** con parches de seguridad  
✅ **Limita exposición de puertos** (usa solo localhost)  
✅ **Revisa logs regularmente**  
✅ **Aplica principio de mínimo privilegio**  

### Escaneo de Vulnerabilidades

```bash
# Escanea imagen con Docker Scan
docker scan 01-node-api:latest

# Escanea con Trivy
trivy image php:8.1-apache
```

---

## 🔑 Gestión de Secretos

**Nunca**:
- ❌ Hardcodear contraseñas en código
- ❌ Subir archivos `.env` al repositorio
- ❌ Compartir credenciales en issues/PRs

**Siempre**:
- ✅ Usar archivos `.env` (gitignored)
- ✅ Variables de entorno para secretos
- ✅ Rotar credenciales regularmente
- ✅ Usar secretos de Docker (Swarm/K8s)

---

## 🆘 Contacto de Seguridad

**Email de seguridad**: [vladimirjacv@gmail.com](mailto:vladimirjacv@gmail.com)  
**GitHub Security**: [Security Advisories](https://github.com/vladimiracunadev-create/docker-labs/security/advisories)

**Maintainer de seguridad**: Vladimir Acuña (@vladimiracunadev-create)

---

## 📚 Recursos Adicionales

- 🐳 [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- 🔐 [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- 📖 [CWE Top 25](https://cwe.mitre.org/top25/)
- 🛡️ [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)

---

**Última actualización**: 2026-01-19

← [Volver al README](README.md)
