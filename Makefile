.PHONY: help up-dashboard up-simple down logs status

help:
	@echo "Docker Labs Manager"
	@echo "==================="
	@echo ""
	@echo "Comandos disponibles:"
	@echo "  make up-dashboard    Inicia el dashboard completo (todos los servicios)"
	@echo "  make up-simple       Inicia el dashboard simple (sin algunos servicios pesados)"
	@echo "  make down            Detiene y elimina todos los contenedores"
	@echo "  make logs            Muestra los logs de todos los contenedores"
	@echo "  make status          Muestra el estado de los contenedores"
	@echo ""

up-dashboard:
	@echo "Iniciando dashboard completo..."
	docker-compose -f docker-compose-dashboard.yml up -d --build

up-simple:
	@echo "Iniciando dashboard simple..."
	docker-compose -f docker-compose-dashboard-simple.yml up -d --build

down:
	@echo "Deteniendo contenedores..."
	docker-compose -f docker-compose-dashboard.yml down
	docker-compose -f docker-compose-dashboard-simple.yml down

logs:
	docker-compose -f docker-compose-dashboard.yml logs -f

status:
	docker-compose -f docker-compose-dashboard.yml ps
	@echo "---"
	docker-compose -f docker-compose-dashboard-simple.yml ps
