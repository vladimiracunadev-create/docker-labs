[CmdletBinding()]
param(
    [string]$WorkspaceRoot,
    [string]$OutputRoot,
    [string]$PythonExecutable = "python",
    [switch]$InstallBuildDependencies
)

. (Join-Path $PSScriptRoot "Common.ps1")

$resolvedRoot = Resolve-WorkspaceRoot -WorkspaceRoot $WorkspaceRoot
$distRoot = if ($OutputRoot) { $OutputRoot } else { Join-Path $resolvedRoot "dist\windows" }
$launcherSource = Join-Path $resolvedRoot "launcher\docker_labs_launcher.py"
$requirements = Join-Path $resolvedRoot "launcher\requirements-build.txt"
$launcherDist = Join-Path $distRoot "launcher"
$pyInstallerWork = Join-Path $distRoot ".pyinstaller"

if (-not (Test-Path $launcherSource)) {
    throw "Launcher source not found: $launcherSource"
}

New-CleanDirectory -Path $launcherDist
New-CleanDirectory -Path $pyInstallerWork

& $PythonExecutable -m PyInstaller --version *> $null
if ($LASTEXITCODE -ne 0) {
    if (-not $InstallBuildDependencies) {
        throw "PyInstaller is not installed. Re-run with -InstallBuildDependencies or build through .github/workflows/release-windows.yml."
    }

    Write-Section "Installing launcher build dependencies"
    & $PythonExecutable -m pip install -r $requirements
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to install PyInstaller from $requirements"
    }
}

Write-Section "Building Docker Labs launcher"
& $PythonExecutable -m PyInstaller `
    --noconfirm `
    --clean `
    --onefile `
    --windowed `
    --name "DockerLabsLauncher" `
    --distpath $launcherDist `
    --workpath $pyInstallerWork `
    --specpath $pyInstallerWork `
    $launcherSource

if ($LASTEXITCODE -ne 0) {
    throw "PyInstaller failed while building the launcher."
}

$launcherExe = Join-Path $launcherDist "DockerLabsLauncher.exe"
if (-not (Test-Path $launcherExe)) {
    throw "Launcher executable not found after build: $launcherExe"
}

Write-Output $launcherExe
