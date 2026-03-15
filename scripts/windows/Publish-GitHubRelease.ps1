[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Tag,
    [string]$WorkspaceRoot,
    [string]$ArtifactsDir
)

. (Join-Path $PSScriptRoot "Common.ps1")

$resolvedRoot = Resolve-WorkspaceRoot -WorkspaceRoot $WorkspaceRoot
$artifactsPath = if ($ArtifactsDir) { $ArtifactsDir } else { Join-Path $resolvedRoot "dist\windows\release" }

if (-not (Test-Path $artifactsPath)) {
    throw "Artifacts directory not found: $artifactsPath"
}

$artifacts = Get-ChildItem -Path $artifactsPath -File | Select-Object -ExpandProperty FullName

if (-not $artifacts -or $artifacts.Count -eq 0) {
    throw "No release artifacts were found in $artifactsPath"
}

foreach ($artifact in $artifacts) {
    if (-not (Test-Path $artifact)) {
        throw "Artifact not found: $artifact"
    }
}

& gh release upload $Tag $artifacts --clobber
if ($LASTEXITCODE -ne 0) {
    throw "GitHub release upload failed."
}
