FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY html /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/gateway-health >/dev/null 2>&1 || exit 1
