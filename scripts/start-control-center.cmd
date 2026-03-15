@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows\Start-ControlCenter.ps1" -WorkspaceRoot "%~dp0\.."
set EXIT_CODE=%ERRORLEVEL%
endlocal & exit /b %EXIT_CODE%
