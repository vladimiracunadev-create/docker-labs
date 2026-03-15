[CmdletBinding()]
param()

function Resolve-WorkspaceRoot {
    param(
        [string]$WorkspaceRoot
    )

    if (-not $WorkspaceRoot) {
        $WorkspaceRoot = Join-Path $PSScriptRoot "..\.."
    }

    return (Resolve-Path $WorkspaceRoot).Path
}

function Convert-ToDockerDesktopPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$WindowsPath
    )

    $resolved = (Resolve-Path $WindowsPath).Path
    $normalized = $resolved -replace "\\", "/"

    if ($normalized -match "^([A-Za-z]):/(.*)$") {
        $drive = $Matches[1].ToLowerInvariant()
        $rest = $Matches[2]
        return "/run/desktop/mnt/host/$drive/$rest"
    }

    throw "The path '$WindowsPath' is not a local Windows drive path."
}

function Get-DistributionManifestPath {
    param(
        [string]$WorkspaceRoot
    )

    $resolvedRoot = Resolve-WorkspaceRoot -WorkspaceRoot $WorkspaceRoot
    return Join-Path $resolvedRoot "packaging\windows\distribution-manifest.json"
}

function Get-DistributionManifest {
    param(
        [string]$WorkspaceRoot
    )

    $manifestPath = Get-DistributionManifestPath -WorkspaceRoot $WorkspaceRoot
    if (-not (Test-Path $manifestPath)) {
        throw "Distribution manifest not found: $manifestPath"
    }

    return (Get-Content $manifestPath -Raw | ConvertFrom-Json)
}

function New-CleanDirectory {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (Test-Path $Path) {
        Remove-Item -Path $Path -Recurse -Force
    }

    New-Item -ItemType Directory -Path $Path | Out-Null
}

function Write-Section {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message
    )

    Write-Host ""
    Write-Host "==> $Message"
}
