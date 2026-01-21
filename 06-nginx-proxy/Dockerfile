FROM nginx:alpine
RUN apk add --no-cache wget
COPY nginx.conf /etc/nginx/nginx.conf
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost/health || exit 1
