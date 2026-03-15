@echo off
cd /d %~dp0\..

rem ─────────────────────────────────────────────────────────────────────────────
rem Docker Labs — Start Control Center
rem
rem Computes DOCKER_REPO_ROOT dynamically so docker compose commands issued
rem from inside the container resolve files through the host Docker daemon.
rem
rem On Windows + Docker Desktop the Docker daemon runs in a Linux VM where
rem Windows drives are mounted at /run/desktop/mnt/host/<drive>/<path>.
rem Example: C:\docker-labs → /run/desktop/mnt/host/c/docker-labs
rem ─────────────────────────────────────────────────────────────────────────────

echo [Docker Labs] Computing host path for Docker Desktop...
for /f "delims=" %%i in ('powershell -NoProfile -Command ^
  "[string]::concat('/run/desktop/mnt/host/', '%CD%'.Replace('\','/').Replace(':','').ToLower())"') do (
  set DOCKER_REPO_ROOT=%%i
)

echo [Docker Labs] DOCKER_REPO_ROOT=%DOCKER_REPO_ROOT%
echo [Docker Labs] Starting Control Center...

docker compose -f dashboard-control\docker-compose.yml up -d --build

echo.
echo   Docker Labs Control Center: http://localhost:9090
echo   Learning Center:            http://localhost:9090/learning-center.html
echo.
