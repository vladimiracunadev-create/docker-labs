# ☸️ Kubernetes Deployment

Guía de despliegue de `docker-labs` hacia Kubernetes.

## Estado actual

| Área | Estado |
|---|---|
| `05-postgres-api` | 🟢 Tiene manifiesto base |
| Resto de labs | 🟡 Parcial o pendiente de endurecimiento |
| Estrategia completa de plataforma | 🔴 Aún no consolidada |

## Alcance real

Esta guía no pretende vender que todos los labs ya están listos para Kubernetes de producción. Hoy sirve para:

- entender la dirección de despliegue
- usar `05` como referencia
- identificar qué piezas faltan endurecer

## Flujo recomendado

1. construir la imagen del lab
2. publicarla en un registro accesible
3. aplicar manifiestos del caso
4. verificar servicio y health

## Referencia principal: `05-postgres-api`

Archivos:

- [05-postgres-api/k8s/deployment.yaml](../05-postgres-api/k8s/deployment.yaml)

Flujo:

```powershell
cd 05-postgres-api
docker build -t tuusuario/inventory-core-api:v1 .
docker push tuusuario/inventory-core-api:v1

kubectl apply -f k8s/deployment.yaml
```

## Qué falta antes de hablar de despliegue maduro

- manifests consistentes para más labs
- configuración separada por entorno
- secrets reales
- ingress o gateway definido
- observabilidad y estrategia de rollout

## Recomendación honesta

Si tu objetivo es mostrar una ruta seria a Kubernetes, hoy céntrate en:

- `05-postgres-api`
- luego `06-nginx-proxy`
- y solo después en integrar más piezas

## Documentos relacionados

- [Architecture](ARCHITECTURE.md)
- [Platform Roadmap](PLATFORM_ROADMAP.md)
- [Technical Specs](TECHNICAL_SPECS.md)
