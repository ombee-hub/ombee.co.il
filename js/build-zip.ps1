# Builds OMBee-Web.zip for upload: *.html, robots.txt, sitemap.xml, js/*.js, images/*.webp (forward-slash paths)
# Run:  powershell -NoProfile -ExecutionPolicy Bypass -File js\build-zip.ps1
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root
$zip = Join-Path $root "OMBee-Web.zip"
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $zip) { [IO.File]::Delete($zip) }
$z = [IO.Compression.ZipFile]::Open($zip, 'Create')
$add = { param($file, $name) [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($z, $file, $name, 'Optimal') }
Get-ChildItem -File | Where-Object { $_.Extension -eq ".html" -or $_.Name -in "robots.txt","sitemap.xml" } | ForEach-Object { & $add $_.FullName $_.Name }
Get-ChildItem js -File -Filter *.js | ForEach-Object { & $add $_.FullName ("js/" + $_.Name) }
Get-ChildItem images -File -Filter *.webp | ForEach-Object { & $add $_.FullName ("images/" + $_.Name) }
$z.Dispose()
$r = [IO.Compression.ZipFile]::OpenRead($zip)
"total: " + $r.Entries.Count + "  backslash entries: " + ($r.Entries | Where-Object { $_.FullName -like "*\*" }).Count
($r.Entries | Where-Object { $_.FullName -like "js/*" } | ForEach-Object { $_.FullName }) -join ", "
"{0:N1} MB" -f ((Get-Item $zip).Length/1MB)
$r.Dispose()
