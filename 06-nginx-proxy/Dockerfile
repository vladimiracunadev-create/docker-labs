FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY html /usr/share/nginx/html

EXPOSE 80

# En nginx:alpine normalmente NO viene curl. BusyBox sí trae wget.
HEALTHCHECK --interval=10s --timeout=2s --start-period=5s \
  CMD wget -qO- http://localhost/health >/dev/null 2>&1 || exit 1

