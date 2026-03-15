[CmdletBinding()]
param(
    [string]$WorkspaceRoot,
    [string]$Version = "0.0.0-local",
    [string]$OutputRoot,
    [string]$PythonExecutable = "python",
    [switch]$InstallBuildDependencies
)

. (Join-Path $PSScriptRoot "Common.ps1")

function Resolve-IsccPath {
    $command = Get-Command ISCC.exe -ErrorAction SilentlyContinue
    if ($command) {
        return $command.Source
    }

    $knownPath = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
    if (Test-Path $knownPath) {
        return $knownPath
    }

    return $null
}

$resolvedRoot = Resolve-WorkspaceRoot -WorkspaceRoot $WorkspaceRoot
$distRoot = if ($OutputRoot) { $OutputRoot } else { Join-Path $resolvedRoot "dist\windows" }
$releaseRoot = Join-Path $distRoot "release"
$installerOutDir = Join-Path $releaseRoot "installer-output"
$versionedInstallerBaseName = "docker-labs-setup-$Version-win-x64"
$versionedInstallerName = "$versionedInstallerBaseName.exe"
$versionedPortableName = "docker-labs-portable-$Version-win-x64.zip"
$stableInstallerName = "docker-labs-windows-latest.exe"
$stablePortableName = "docker-labs-windows-portable-latest.zip"
$innoScript = Join-Path $resolvedRoot "installer\windows\DockerLabs.iss"

Write-Section "Building launcher"
$launcherExe = & (Join-Path $resolvedRoot "scripts\windows\Build-Launcher.ps1") `
    -WorkspaceRoot $resolvedRoot `
    -OutputRoot $distRoot `
    -PythonExecutable $PythonExecutable `
    -InstallBuildDependencies:$InstallBuildDependencies

Write-Section "Preparing staging"
$stagingRoot = & (Join-Path $resolvedRoot "scripts\windows\Prepare-Staging.ps1") `
    -WorkspaceRoot $resolvedRoot `
    -Version $Version `
    -LauncherPath $launcherExe `
    -OutputRoot $distRoot

Write-Section "Preparing release folder"
New-CleanDirectory -Path $releaseRoot
New-Item -ItemType Directory -Path $installerOutDir | Out-Null

$versionedPortablePath = Join-Path $releaseRoot $versionedPortableName
$stablePortablePath = Join-Path $releaseRoot $stablePortableName
Compress-Archive -Path (Join-Path $stagingRoot "*") -DestinationPath $versionedPortablePath -Force
Copy-Item -Path $versionedPortablePath -Destination $stablePortablePath -Force

$isccPath = Resolve-IsccPath
if (-not $isccPath) {
    throw "Inno Setup Compiler (ISCC.exe) was not found. Use .github/workflows/release-windows.yml or install Inno Setup locally."
}

Write-Section "Building installer"
& $isccPath `
    "/DAppVersion=$Version" `
    "/DSourceDir=$stagingRoot" `
    "/DOutputDir=$installerOutDir" `
    "/DVersionedInstallerName=$versionedInstallerBaseName" `
    $innoScript

if ($LASTEXITCODE -ne 0) {
    throw "Inno Setup failed while building the installer."
}

$builtInstaller = Join-Path $installerOutDir $versionedInstallerName
if (-not (Test-Path $builtInstaller)) {
    throw "Installer not found after Inno Setup build: $builtInstaller"
}

$versionedInstallerPath = Join-Path $releaseRoot $versionedInstallerName
$stableInstallerPath = Join-Path $releaseRoot $stableInstallerName
Copy-Item -Path $builtInstaller -Destination $versionedInstallerPath -Force
Copy-Item -Path $builtInstaller -Destination $stableInstallerPath -Force

$hashTargets = @(
    $versionedInstallerPath,
    $stableInstallerPath,
    $versionedPortablePath,
    $stablePortablePath
)

$hashLines = foreach ($target in $hashTargets) {
    $hash = (Get-FileHash -Path $target -Algorithm SHA256).Hash.ToLowerInvariant()
    "$hash *$(Split-Path -Leaf $target)"
}

$checksumsPath = Join-Path $releaseRoot "SHA256SUMS.txt"
$hashLines | Set-Content -Path $checksumsPath -Encoding ASCII

$releaseManifest = [ordered]@{
    version = $Version
    generatedAt = (Get-Date).ToString("o")
    artifacts = @(
        $versionedInstallerName,
        $stableInstallerName,
        $versionedPortableName,
        $stablePortableName,
        "SHA256SUMS.txt"
    )
}

$releaseManifest | ConvertTo-Json -Depth 6 | Set-Content -Path (Join-Path $releaseRoot "release-manifest.json") -Encoding UTF8

Write-Host ""
Write-Host "Artifacts generated in $releaseRoot"
Get-ChildItem -Path $releaseRoot -File | Select-Object Name, Length
