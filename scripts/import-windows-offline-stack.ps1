# Import a prebuilt Windows offline dependency package. No network access.
[CmdletBinding()]
param(
 [Parameter(Mandatory)][string]$Workspace,
 [Parameter(Mandatory)][string]$Archive
)
$ErrorActionPreference='Stop'
$archivePath=(Resolve-Path -LiteralPath $Archive).Path
$workspacePath=(Resolve-Path -LiteralPath $Workspace).Path
if((Split-Path $archivePath -Leaf) -notmatch '^(react|angular|nestjs|dotnet|spring-boot)-windows-x64-(\d+\.\d+\.\d+)\.zip$'){throw 'Invalid offline package name'}
$id=$Matches[1];$version=$Matches[2]
$checksum=(Get-Content -LiteralPath "$archivePath.sha256" -Raw).Trim().Split(' ')[0]
if($checksum -notmatch '^[a-fA-F0-9]{64}$' -or (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash -ne $checksum){throw 'Archive SHA-256 mismatch'}
$base=Join-Path $workspacePath '.atgv\offline\windows-x64'
New-Item -ItemType Directory -Force $base | Out-Null
$temp=Join-Path $base ('.import-'+[guid]::NewGuid())
New-Item -ItemType Directory $temp | Out-Null
try{
 # Expand-Archive rejects traversal paths; the package must be from trusted Library CI.
 Expand-Archive -LiteralPath $archivePath -DestinationPath $temp
 $source=Join-Path $temp $id
 $manifest=Get-Content -LiteralPath "$source\manifest.json" -Raw | ConvertFrom-Json
 if($manifest.schema -ne 1 -or $manifest.stack -ne $id -or $manifest.catalogVersion -ne $version -or $manifest.platform -ne 'win32' -or $manifest.arch -ne 'x64'){throw 'Package manifest mismatch'}
 $dest=Join-Path $base $id
 if(Test-Path -LiteralPath $dest){throw "Offline package already exists at $dest. Move the old folder out of the cache first."}
 Move-Item -LiteralPath $source -Destination $dest
 Write-Host "Imported $id $version to $dest"
}finally{Remove-Item -LiteralPath $temp -Recurse -Force}
