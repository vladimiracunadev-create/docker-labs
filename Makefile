.PHONY: help up-control-center up-platform up-dashboard up-simple down logs status

help:
	@echo "Docker Labs Manager"
	@echo "==================="
	@echo ""
	@echo "Comandos disponibles:"
	@echo "  make up-control-center  Inicia el Control Center soportado en :9090"
	@echo "  make up-platform        Inicia Control Center + 05 + 09 + 06"
	@echo "  make up-dashboard       Alias de up-platform"
	@echo "  make up-simple          Alias de up-control-center"
	@echo "  make down               Detiene los stacks principales soportados"
	@echo "  make logs               Muestra logs del Control Center"
	@echo "  make status             Muestra el estado de los stacks principales"
	@echo ""

up-control-center:
	@echo "Iniciando Control Center..."
	./scripts/start-control-center.sh

up-platform: up-control-center
	@echo "Iniciando plataforma principal..."
	docker compose -f 05-postgres-api/docker-compose.yml up -d --build
	docker compose -f 09-multi-service-app/docker-compose.yml up -d --build
	docker compose -f 06-nginx-proxy/docker-compose.yml up -d --build

up-dashboard: up-platform

up-simple: up-control-center

down:
	@echo "Deteniendo stacks principales..."
	docker compose -f 06-nginx-proxy/docker-compose.yml down
	docker compose -f 09-multi-service-app/docker-compose.yml down
	docker compose -f 05-postgres-api/docker-compose.yml down
	docker compose -f dashboard-control/docker-compose.yml down

logs:
	docker compose -f dashboard-control/docker-compose.yml logs -f

status:
	docker compose -f dashboard-control/docker-compose.yml ps
	@echo "---"
	docker compose -f 05-postgres-api/docker-compose.yml ps
	@echo "---"
	docker compose -f 09-multi-service-app/docker-compose.yml ps
	@echo "---"
	docker compose -f 06-nginx-proxy/docker-compose.yml ps
