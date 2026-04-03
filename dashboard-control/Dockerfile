FROM node:20-alpine

RUN apk add --no-cache docker-cli docker-cli-compose curl

# El Control Center necesita ejecutar comandos Docker — requiere acceso al socket.
# El usuario 'node' (uid 1000) se añade al grupo 'docker' del contenedor para
# evitar correr como root manteniendo acceso al socket montado desde el host.
RUN addgroup docker 2>/dev/null || true && adduser node docker 2>/dev/null || true

WORKDIR /workspace

ENV APP_REPO_ROOT=/workspace
ENV DASHBOARD_PORT=9090

USER node
EXPOSE 9090

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD curl -fsS http://127.0.0.1:9090/api/overview >/dev/null || exit 1

CMD ["node", "dashboard-control/server.js"]
