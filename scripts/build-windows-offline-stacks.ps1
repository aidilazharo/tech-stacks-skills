# Build all five Windows x64 offline dependency packages on an approved online machine.
[CmdletBinding()]
param([string]$OutputDirectory = (Join-Path $PSScriptRoot '..\offline-dist'))
$ErrorActionPreference = 'Stop'
function Run([string]$Exe,[string[]]$ArgList) {
  & $Exe @ArgList
  if ($LASTEXITCODE -ne 0) { throw "$Exe failed ($LASTEXITCODE): $($ArgList -join ' ')" }
}
$root=(Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$version=(Get-Content "$root\VERSION" -Raw).Trim()
$node=& node -p "process.platform+' '+process.arch+' '+process.versions.node"
if ($LASTEXITCODE -ne 0 -or $node -notmatch '^win32 x64 24\.') { throw "Windows x64 Node 24 required: $node" }
$OutputDirectory=[IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Force $OutputDirectory | Out-Null
$temp=Join-Path ([IO.Path]::GetTempPath()) ('atgv-offline-'+[guid]::NewGuid())
New-Item -ItemType Directory $temp | Out-Null
$oldNuget=$env:NUGET_PACKAGES
$oldOffline=$env:npm_config_offline
$oldBrowsers=$env:PLAYWRIGHT_BROWSERS_PATH
try {
 foreach($id in @('react','angular','nestjs','dotnet','spring-boot')){
  $work=Join-Path $temp "work-$id"
  $pack=Join-Path $temp $id
  New-Item -ItemType Directory $work,$pack | Out-Null
  # Copy committed source, including hidden files, without any local dependency tree.
  $tar=Join-Path $temp "$id-source.tar"
  Run 'git' @('-C',$root,'archive','--format=tar',"-o=$tar","HEAD:tech-stacks/$id/scaffold")
  Run 'tar.exe' @('-xf',$tar,'-C',$work)
  Push-Location $work
  try{
   $files=@()
   if($id -in @('react','angular','nestjs')){
    $files=@('package.json','package-lock.json')
    $env:npm_config_offline='false'
    Run 'npm.cmd' @('ci','--include=dev','--include=optional','--ignore-scripts','--no-audit','--no-fund')
    $env:npm_config_offline='true'
    Run 'npm.cmd' @('test')
    Run 'npm.cmd' @('run','build')
    $inventory=& npm.cmd ls --all --offline --json
    if($LASTEXITCODE -ne 0){throw 'npm inventory failed'}
    $inventory | Set-Content -Encoding utf8NoBOM "$pack\modules.json"
    Move-Item "$work\node_modules" "$pack\node_modules"
    # React's optional Playwright setup is intentionally separate from its locked core.
   }elseif($id -eq 'dotnet'){
    $files=@('Api.csproj','tests/Atgv.Tests/Atgv.Tests.csproj')
    $env:NUGET_PACKAGES="$pack\nuget"
    Run 'dotnet' @('restore','Api.csproj')
    Run 'dotnet' @('restore','tests/Atgv.Tests/Atgv.Tests.csproj')
    Run 'dotnet' @('restore','Api.csproj','--source',$env:NUGET_PACKAGES,'--force','-p:NuGetAudit=false')
    Run 'dotnet' @('restore','tests/Atgv.Tests/Atgv.Tests.csproj','--source',$env:NUGET_PACKAGES,'--force','-p:NuGetAudit=false')
    Run 'dotnet' @('build','Api.csproj','--no-restore')
    Run 'dotnet' @('test','tests/Atgv.Tests/Atgv.Tests.csproj','--no-restore')
    Get-ChildItem "$pack\nuget" -Recurse -Filter '*.nupkg' | ForEach-Object {$_.FullName.Substring($pack.Length+1)} | Set-Content -Encoding utf8NoBOM "$pack\modules.txt"
   }else{
    $files=@('pom.xml')
    $repo="-Dmaven.repo.local=$pack\maven"
    Run 'mvn.cmd' @('-B','-ntp',$repo,'dependency:go-offline')
    Run 'mvn.cmd' @('-B','-ntp',$repo,'clean','package')
    Run 'mvn.cmd' @('-B','-ntp',$repo,'-o','clean','package')
    Get-ChildItem "$pack\maven" -Recurse -Filter '*.jar' | ForEach-Object {$_.FullName.Substring($pack.Length+1)} | Set-Content -Encoding utf8NoBOM "$pack\modules.txt"
   }
   $fingerprints=[ordered]@{}
   foreach($file in $files){
    # Canonical UTF-8 text: line endings do not change the fingerprint.
    $raw=[IO.File]::ReadAllText((Join-Path $work $file)).Replace("`r`n","`n")
    $bytes=[Text.Encoding]::UTF8.GetBytes($raw)
    $fingerprints[$file]=[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($bytes)).ToLowerInvariant()
   }
   $manifest=[ordered]@{schema=1;stack=$id;catalogVersion=$version;platform='win32';arch='x64';nodeMajor=24;fingerprints=$fingerprints}
   $manifest | ConvertTo-Json -Depth 6 | Set-Content -Encoding utf8NoBOM "$pack\manifest.json"
  } finally {Pop-Location}
  $zip=Join-Path $OutputDirectory "$id-windows-x64-$version.zip"
  Run 'tar.exe' @('-a','-cf',$zip,'-C',$temp,$id)
  $sha=(Get-FileHash $zip -Algorithm SHA256).Hash.ToLowerInvariant()
  "$sha  $(Split-Path $zip -Leaf)" | Set-Content -Encoding ASCII "$zip.sha256"
 }
}finally{
 $env:NUGET_PACKAGES=$oldNuget
 $env:npm_config_offline=$oldOffline
 $env:PLAYWRIGHT_BROWSERS_PATH=$oldBrowsers
 Remove-Item -LiteralPath $temp -Recurse -Force
}
