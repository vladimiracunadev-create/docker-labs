FROM node:20-alpine

RUN apk add --no-cache docker-cli docker-cli-compose curl

WORKDIR /workspace

ENV APP_REPO_ROOT=/workspace
ENV DASHBOARD_PORT=9090

EXPOSE 9090

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD curl -fsS http://127.0.0.1:9090/api/overview >/dev/null || exit 1

CMD ["node", "dashboard-control/server.js"]
