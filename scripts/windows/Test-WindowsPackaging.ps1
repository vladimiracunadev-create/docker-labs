[CmdletBinding()]
param(
    [string]$WorkspaceRoot,
    [string]$PythonExecutable = "python"
)

. (Join-Path $PSScriptRoot "Common.ps1")

$resolvedRoot = Resolve-WorkspaceRoot -WorkspaceRoot $WorkspaceRoot
$manifest = Get-DistributionManifest -WorkspaceRoot $resolvedRoot

Write-Section "Validating Python launcher sources"
& $PythonExecutable -m py_compile (Join-Path $resolvedRoot "launcher\docker_labs_launcher.py")
if ($LASTEXITCODE -ne 0) {
    throw "Python launcher source did not compile."
}

Write-Section "Running launcher unit tests"
Push-Location $resolvedRoot
try {
    & $PythonExecutable -m unittest discover -s launcher/tests -p "test_*.py"
    if ($LASTEXITCODE -ne 0) {
        throw "Launcher unit tests failed."
    }

    Write-Section "Running launcher self-check"
    & $PythonExecutable launcher/docker_labs_launcher.py --workspace-root $resolvedRoot --self-check
    if ($LASTEXITCODE -ne 0) {
        throw "Launcher self-check failed."
    }

    Write-Section "Validating supported compose files"
    foreach ($composeFile in $manifest.workspace.mainComposeFiles) {
        $composePath = Join-Path $resolvedRoot $composeFile
        if ($composeFile -eq "dashboard-control/docker-compose.yml") {
            $env:CONTROL_CENTER_WORKSPACE_SOURCE = $resolvedRoot
            $env:CONTROL_CENTER_DOCKER_SOURCE = $resolvedRoot
            $env:CONTROL_CENTER_DOCKER_TARGET = (Convert-ToDockerDesktopPath -WindowsPath $resolvedRoot)
        }

        & docker compose -f $composePath config *> $null
        if ($LASTEXITCODE -ne 0) {
            throw "Compose config validation failed for $composeFile"
        }
    }
}
finally {
    Pop-Location
}

Write-Section "Packaging validation finished"
