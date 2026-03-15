[CmdletBinding()]
param(
    [string]$WorkspaceRoot,
    [string]$Version = "0.0.0-local",
    [string]$LauncherPath,
    [string]$OutputRoot
)

. (Join-Path $PSScriptRoot "Common.ps1")

$resolvedRoot = Resolve-WorkspaceRoot -WorkspaceRoot $WorkspaceRoot
$manifest = Get-DistributionManifest -WorkspaceRoot $resolvedRoot
$manifestPath = Get-DistributionManifestPath -WorkspaceRoot $resolvedRoot
$distRoot = if ($OutputRoot) { $OutputRoot } else { Join-Path $resolvedRoot "dist\windows" }
$stagingRoot = Join-Path $distRoot "staging"
$workspaceStaging = Join-Path $stagingRoot $manifest.packaging.stagingWorkspaceDirName

if (-not $LauncherPath) {
    $LauncherPath = Join-Path $distRoot "launcher\DockerLabsLauncher.exe"
}

if (-not (Test-Path $LauncherPath)) {
    throw "Launcher executable not found: $LauncherPath"
}

Write-Section "Preparing staging area"
New-CleanDirectory -Path $stagingRoot
New-Item -ItemType Directory -Path $workspaceStaging | Out-Null

foreach ($includePath in $manifest.packaging.includePaths) {
    $sourcePath = Join-Path $resolvedRoot $includePath
    $destinationPath = Join-Path $workspaceStaging $includePath
    if (-not (Test-Path $sourcePath)) {
        throw "Staging source path not found: $sourcePath"
    }

    $destinationParent = Split-Path -Parent $destinationPath
    if ($destinationParent) {
        New-Item -ItemType Directory -Force -Path $destinationParent | Out-Null
    }

    Copy-Item -Path $sourcePath -Destination $destinationPath -Recurse -Force
}

$launcherName = $manifest.product.launcherExeName
Copy-Item -Path $LauncherPath -Destination (Join-Path $stagingRoot $launcherName) -Force
Copy-Item -Path $manifestPath -Destination (Join-Path $stagingRoot $manifest.packaging.manifestOutputFile) -Force

$metadata = [ordered]@{
    version = $Version
    generatedAt = (Get-Date).ToString("o")
    workspaceRoot = $resolvedRoot
    launcher = $launcherName
    includedPaths = @($manifest.packaging.includePaths)
    excludedFromInstaller = @($manifest.packaging.excludedFromInstaller)
    legacyExcludedPaths = @($manifest.workspace.legacyExcludedPaths)
}

$metadataPath = Join-Path $stagingRoot "staging-manifest.json"
$metadata | ConvertTo-Json -Depth 8 | Set-Content -Path $metadataPath -Encoding UTF8

Write-Output $stagingRoot
