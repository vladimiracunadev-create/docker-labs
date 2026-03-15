<#
.SYNOPSIS
    Build the Docker Labs Windows installer using Inno Setup.

.DESCRIPTION
    Requires:
      1. The launcher .exe compiled in launcher\docker-labs-launcher.exe
         (run build-launcher.ps1 first).
      2. Inno Setup 6.x installed on the build machine.
         Default location: C:\Program Files (x86)\Inno Setup 6\ISCC.exe
         Download: https://jrsoftware.org/isinfo.php

    Output: dist\docker-labs-setup-{Version}.exe

.PARAMETER Version
    Version string for the output filename (default: 1.0.0).

.PARAMETER InnoSetupPath
    Full path to ISCC.exe if not in the default location.

.EXAMPLE
    .\scripts\windows\build-installer.ps1
    .\scripts\windows\build-installer.ps1 -Version 1.2.0

.NOTES
    The generated installer is a release artifact — do NOT commit it to the
    repository. Upload it to GitHub Releases as a release asset.
    See docs/github-releases-distribution.md for the distribution workflow.
#>
param (
    [string]$Version      = "1.0.0",
    [string]$InnoSetupPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot    = Resolve-Path (Join-Path $PSScriptRoot "../..")
$IssFile     = Join-Path $RepoRoot "installer\docker-labs.iss"
$LauncherExe = Join-Path $RepoRoot "launcher\docker-labs-launcher.exe"
$DistDir     = Join-Path $RepoRoot "dist"
$ExpectedOut = Join-Path $DistDir  "docker-labs-setup-${Version}.exe"

Write-Host ""
Write-Host "=== Docker Labs — Build Installer ===" -ForegroundColor Cyan
Write-Host "  Repository : $RepoRoot"
Write-Host "  ISS script : $IssFile"
Write-Host "  Version    : $Version"
Write-Host "  Output     : $ExpectedOut"
Write-Host ""

# Verify launcher is built
if (-not (Test-Path $LauncherExe)) {
    Write-Error "Launcher not found: $LauncherExe`nRun scripts\windows\build-launcher.ps1 first."
}
Write-Host "  Launcher   : OK ($LauncherExe)"

# Locate ISCC.exe
$iscc = $InnoSetupPath
if (-not $iscc) {
    $candidates = @(
        "C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
        "C:\Program Files\Inno Setup 6\ISCC.exe",
        "C:\Program Files (x86)\Inno Setup 5\ISCC.exe"
    )
    foreach ($c in $candidates) {
        if (Test-Path $c) { $iscc = $c; break }
    }
}
if (-not $iscc -or -not (Test-Path $iscc)) {
    Write-Error "Inno Setup (ISCC.exe) not found.`nInstall from https://jrsoftware.org/isinfo.php`nor pass -InnoSetupPath 'C:\path\to\ISCC.exe'"
}
Write-Host "  ISCC.exe   : $iscc"
Write-Host ""

# Create dist directory
if (-not (Test-Path $DistDir)) {
    New-Item -ItemType Directory -Path $DistDir | Out-Null
}

# Compile installer
Write-Host "[1/2] Running Inno Setup compiler..." -ForegroundColor Yellow
Push-Location $RepoRoot
try {
    & $iscc `
        "/DAppVersion=$Version" `
        "/O$DistDir" `
        $IssFile
    if ($LASTEXITCODE -ne 0) {
        Write-Error "ISCC.exe failed with exit code $LASTEXITCODE"
    }
} finally {
    Pop-Location
}

# Verify output
if (-not (Test-Path $ExpectedOut)) {
    # Inno Setup may name the file differently based on OutputBaseFilename — find it
    $found = Get-ChildItem $DistDir -Filter "docker-labs-setup-*.exe" |
             Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($found) {
        $ExpectedOut = $found.FullName
    } else {
        Write-Error "Installer not found in $DistDir after build."
    }
}

$size = [math]::Round((Get-Item $ExpectedOut).Length / 1MB, 2)
Write-Host ""
Write-Host "[2/2] Installer ready." -ForegroundColor Green
Write-Host "  File   : $ExpectedOut"
Write-Host "  Size   : ${size} MB"
Write-Host ""
Write-Host "Upload this file to GitHub Releases as a release asset." -ForegroundColor Cyan
Write-Host "See docs/github-releases-distribution.md for the full release workflow." -ForegroundColor Cyan
Write-Host ""
