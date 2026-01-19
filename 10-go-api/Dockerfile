FROM golang:1.21-alpine AS build
WORKDIR /app
COPY . .
RUN go build -o main .

FROM alpine:latest
RUN apk add --no-cache curl
COPY --from=build /app/main .
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
CMD ["./main"]