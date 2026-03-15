[CmdletBinding()]
param(
    [string]$WorkspaceRoot
)

. (Join-Path $PSScriptRoot "Common.ps1")

$resolvedRoot = Resolve-WorkspaceRoot -WorkspaceRoot $WorkspaceRoot
$dockerDesktopPath = Convert-ToDockerDesktopPath -WindowsPath $resolvedRoot

$env:CONTROL_CENTER_WORKSPACE_SOURCE = $resolvedRoot
$env:CONTROL_CENTER_DOCKER_SOURCE = $resolvedRoot
$env:CONTROL_CENTER_DOCKER_TARGET = $dockerDesktopPath

Push-Location $resolvedRoot
try {
    & docker compose -f "dashboard-control\docker-compose.yml" up -d --build
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }

    Write-Host "Docker Labs Control Center: http://localhost:9090"
    Write-Host "Workspace root: $resolvedRoot"
    Write-Host "Docker Desktop mirror path: $dockerDesktopPath"
}
finally {
    Pop-Location
}
