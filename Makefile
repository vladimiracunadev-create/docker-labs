.PHONY: help start stop status build-launcher build-installer

help:
	@echo "Docker Labs — Workspace Commands"
	@echo "================================="
	@echo ""
	@echo "  make start            Start the Control Center (port 9090)"
	@echo "  make stop             Stop the Control Center"
	@echo "  make status           Show running containers"
	@echo ""
	@echo "  make build-launcher   Build the Windows launcher (requires Go)"
	@echo "  make build-installer  Build the Windows installer (requires Inno Setup)"
	@echo ""
	@echo "  Quickstart:  scripts/start-control-center.cmd  (Windows)"
	@echo "               docker compose -f dashboard-control/docker-compose.yml up -d --build"
	@echo ""

start:
	@echo "Starting Docker Labs Control Center..."
	docker compose -f dashboard-control/docker-compose.yml up -d --build

stop:
	@echo "Stopping Docker Labs Control Center..."
	docker compose -f dashboard-control/docker-compose.yml down

status:
	docker compose -f dashboard-control/docker-compose.yml ps

build-launcher:
	@echo "Building Windows launcher..."
	cd launcher && go build -o docker-labs-launcher.exe .

build-installer:
	@echo "Building Windows installer (requires Inno Setup)..."
	powershell -NoProfile -ExecutionPolicy Bypass -File scripts/windows/build-installer.ps1
