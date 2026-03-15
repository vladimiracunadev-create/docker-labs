<#
.SYNOPSIS
    Build the Docker Labs Windows launcher executable.

.DESCRIPTION
    Compiles launcher/main.go into launcher/docker-labs-launcher.exe using
    the Go toolchain. The resulting binary is consumed by the Inno Setup
    installer script and by the GitHub Actions release workflow.

.PARAMETER Version
    Version string embedded in the binary metadata (default: 1.0.0).

.EXAMPLE
    .\scripts\windows\build-launcher.ps1
    .\scripts\windows\build-launcher.ps1 -Version 1.2.0

.NOTES
    Requirements:
      - Go 1.21 or later  (https://go.dev/dl/)
      - Run from the repository root
#>
param (
    [string]$Version = "1.0.0"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot  = Resolve-Path (Join-Path $PSScriptRoot "../..")
$LauncherDir = Join-Path $RepoRoot "launcher"
$OutputExe   = Join-Path $LauncherDir "docker-labs-launcher.exe"

Write-Host ""
Write-Host "=== Docker Labs — Build Launcher ===" -ForegroundColor Cyan
Write-Host "  Repository : $RepoRoot"
Write-Host "  Launcher   : $LauncherDir"
Write-Host "  Output     : $OutputExe"
Write-Host "  Version    : $Version"
Write-Host ""

# Verify Go is available
if (-not (Get-Command "go" -ErrorAction SilentlyContinue)) {
    Write-Error "Go toolchain not found. Install Go 1.21+ from https://go.dev/dl/"
}

$goVersion = & go version
Write-Host "  Go version : $goVersion"
Write-Host ""

# Build
Write-Host "[1/2] Compiling launcher..." -ForegroundColor Yellow
Push-Location $LauncherDir
try {
    & go build -v -ldflags "-X main.launcherVersion=$Version" -o $OutputExe .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "go build failed with exit code $LASTEXITCODE"
    }
} finally {
    Pop-Location
}

# Verify output
if (-not (Test-Path $OutputExe)) {
    Write-Error "Expected output not found: $OutputExe"
}

$size = [math]::Round((Get-Item $OutputExe).Length / 1MB, 2)
Write-Host ""
Write-Host "[2/2] Build complete." -ForegroundColor Green
Write-Host "  Binary : $OutputExe"
Write-Host "  Size   : ${size} MB"
Write-Host ""
Write-Host "Next step: run scripts\windows\build-installer.ps1 to package the installer." -ForegroundColor Cyan
Write-Host ""
