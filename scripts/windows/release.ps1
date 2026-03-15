<#
.SYNOPSIS
    Full Docker Labs Windows release pipeline: build launcher + build installer.

.DESCRIPTION
    Orchestrates the complete build pipeline for a Windows release:
      1. Builds the Go launcher executable
      2. Builds the Inno Setup installer
      3. Optionally uploads the installer to a GitHub Release (requires gh CLI)

    The output installer is placed in dist\ and is ready for GitHub Releases.
    Do NOT commit the installer binary to the repository.

.PARAMETER Version
    Release version string, e.g. "1.0.0". Must match the Git tag if tagging.

.PARAMETER Upload
    If set, use 'gh release upload' to attach the installer to an existing
    GitHub Release tagged v{Version}. Requires the GitHub CLI (gh) installed
    and authenticated.

.PARAMETER InnoSetupPath
    Override the path to ISCC.exe if Inno Setup is not in the default location.

.EXAMPLE
    # Local build only
    .\scripts\windows\release.ps1 -Version 1.0.0

    # Build + upload to GitHub Releases (requires gh cli)
    .\scripts\windows\release.ps1 -Version 1.0.0 -Upload

.NOTES
    Prerequisites:
      - Go 1.21+        https://go.dev/dl/
      - Inno Setup 6.x  https://jrsoftware.org/isinfo.php
      - gh CLI (optional, for -Upload) https://cli.github.com/
#>
param (
    [Parameter(Mandatory = $true)]
    [string]$Version,

    [switch]$Upload,

    [string]$InnoSetupPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptsWin = $PSScriptRoot
$RepoRoot   = Resolve-Path (Join-Path $ScriptsWin "../..")
$DistDir    = Join-Path $RepoRoot "dist"

Write-Host ""
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Docker Labs — Windows Release Pipeline  ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Version : $Version"
Write-Host "  Upload  : $Upload"
Write-Host ""

# Step 1 — Build launcher
Write-Host "━━━ Step 1/2 — Build Launcher ━━━" -ForegroundColor Yellow
& (Join-Path $ScriptsWin "build-launcher.ps1") -Version $Version

# Step 2 — Build installer
Write-Host "━━━ Step 2/2 — Build Installer ━━━" -ForegroundColor Yellow
$buildInstallerArgs = @("-Version", $Version)
if ($InnoSetupPath) {
    $buildInstallerArgs += @("-InnoSetupPath", $InnoSetupPath)
}
& (Join-Path $ScriptsWin "build-installer.ps1") @buildInstallerArgs

# Locate output
$installer = Get-ChildItem $DistDir -Filter "docker-labs-setup-${Version}.exe" |
             Select-Object -First 1
if (-not $installer) {
    $installer = Get-ChildItem $DistDir -Filter "docker-labs-setup-*.exe" |
                 Sort-Object LastWriteTime -Descending | Select-Object -First 1
}
if (-not $installer) {
    Write-Error "Installer not found in $DistDir"
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Build complete!                         ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  Installer : $($installer.FullName)"
Write-Host "  Size      : $([math]::Round($installer.Length / 1MB, 2)) MB"
Write-Host ""

# Optional — Upload to GitHub Releases
if ($Upload) {
    Write-Host "━━━ Upload to GitHub Releases ━━━" -ForegroundColor Yellow

    if (-not (Get-Command "gh" -ErrorAction SilentlyContinue)) {
        Write-Error "GitHub CLI (gh) not found. Install from https://cli.github.com/"
    }

    $Tag = "v$Version"
    Write-Host "  Uploading $($installer.Name) to release $Tag..."

    & gh release upload $Tag $installer.FullName --clobber
    if ($LASTEXITCODE -ne 0) {
        Write-Error "gh release upload failed. Verify that release $Tag exists on GitHub."
    }

    Write-Host ""
    Write-Host "  Uploaded successfully to: https://github.com/vladimiracunadev-create/docker-labs/releases/tag/$Tag" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Next steps if not uploading automatically:"
Write-Host "  1. Go to https://github.com/vladimiracunadev-create/docker-labs/releases/new"
Write-Host "  2. Create or select tag v$Version"
Write-Host "  3. Attach $($installer.Name) as a release asset"
Write-Host "  4. Publish the release"
Write-Host ""
Write-Host "See docs/github-releases-distribution.md for the full workflow." -ForegroundColor Cyan
Write-Host ""
