# FAQ

## Para que sirve este repositorio

Sirve para aprender Docker con casos practicos y, al mismo tiempo, para evolucionar algunos labs hacia sistemas modulares reutilizables.

## Cual es la entrada principal

El panel principal:

[http://localhost:9090](http://localhost:9090)

## Puedo levantar solo el panel y despues ir caso a caso

Si. De hecho ese es el modo recomendado cuando quieres cuidar recursos.

Lo normal es:

- dejar el panel principal arriba
- revisar estados
- levantar solo el sistema que vas a usar

## Cuanto hardware necesito realmente

- `8 GB RAM`: suficiente para panel y un entorno a la vez
- `16 GB RAM`: comodo para `05 + 09 + 06`
- `24 GB RAM o mas`: mejor para sumar observabilidad, busqueda o mensajeria

## Que sistemas conviene abrir primero

- `05-postgres-api`
- `09-multi-service-app`
- `06-nginx-proxy`

## Que diferencia hay entre estado Docker y abrir sistema

- `Estado Docker` indica si el contenedor o stack esta arriba
- `Abrir sistema` entra a la app o API que vive dentro del contenedor

## Por que hay labs detenidos

Porque no es necesario levantar todo a la vez. El repositorio ahora prioriza trabajar primero con los sistemas principales y solo encender capacidades complementarias cuando aportan valor.

## Cual es la direccion del proyecto

Pasar de una coleccion de laboratorios a una plataforma modular compuesta por:

- core transaccional
- portal operativo
- gateway
- servicios de infraestructura complementarios
