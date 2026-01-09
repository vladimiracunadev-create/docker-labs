# Contributing

Gracias por tu interés en contribuir a `docker-labs`! A continuación se indican pautas básicas para colaborar de forma efectiva.

## Antes de empezar

1. Revisa `README.md` y `ROADMAP.md` para entender el objetivo del repo.
2. Abre un *issue* si planeas trabajar en un cambio importante para coordinar el trabajo.

## Flujo de trabajo (Pull Request)

1. Crea una rama con un nombre claro: `feature/descripcion` o `fix/descripcion`.
2. Añade pruebas cuando sea posible y asegúrate de que pasen localmente.
3. Ejecuta linters y formateadores (si aplica) antes de enviar el PR.
4. Abre un Pull Request contra `main` describiendo los cambios y la motivación.
5. Espera revisión: responder a comentarios y actualizar el PR según sea necesario.

## Estilo de código

- Sigue las guías de estilo de cada subproyecto (por ejemplo: ESLint/Prettier para `node-api`, PEP8 para `python-api`).
- Asegúrate de mantener `Dockerfile` y `docker-compose.yml` limpios y reproducibles.

## Commit messages

Usa mensajes claros y breves. Ejemplo:

```
feat(node-api): añadir endpoint /status
fix(python-api): corregir manejo de error en /items
```

## Tests

Incluye pruebas unitarias o de integración cuando sea apropiado. Documenta cómo ejecutarlas localmente.

## Código de conducta

Se espera que las contribuciones respeten un ambiente colaborativo y profesional. Añade una sección de `CODE_OF_CONDUCT` si deseas formalizarlo.

## Licencia y copyright

Al contribuir aceptas que tu contribución se incorpora bajo la licencia del proyecto (`LICENSE`). Si necesitas firmar un CLA, se indicará aquí.

--
Sustituye los marcadores por información de contacto o políticas específicas si así lo deseas.