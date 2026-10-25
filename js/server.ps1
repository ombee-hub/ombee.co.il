$port = if ($env:PORT) { $env:PORT } else { "8787" }
$root = "C:\My Files\Omri Ben Eliyahu - Graphic Designer\OMBee Web"
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running on http://localhost:$port"
[Console]::Out.Flush()

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $local = $ctx.Request.Url.LocalPath.TrimStart('/')
    if (-not $local) { $local = 'index.html' }
    $file = Join-Path $root $local
    if (-not (Test-Path $file) -or (Get-Item $file).PSIsContainer) {
        $file = Join-Path $root 'index.html'
    }
    $ext = [IO.Path]::GetExtension($file)
    $mime = switch ($ext) {
        '.html' { 'text/html; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.js'   { 'application/javascript; charset=utf-8' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.svg'  { 'image/svg+xml' }
        default { 'application/octet-stream' }
    }
    $bytes = [IO.File]::ReadAllBytes($file)
    $ctx.Response.ContentType = $mime
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $ctx.Response.Close()
}
