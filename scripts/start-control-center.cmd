@echo off
cd /d %~dp0\..
docker compose -f dashboard-control\docker-compose.yml up -d --build
echo Docker Labs Control Center: http://localhost:9090
