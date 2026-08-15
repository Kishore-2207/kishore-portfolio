# Lightweight Local Web Server using Net.HttpListener
# Runs a static file server on http://localhost:8000

$port = 8085
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "=================================================="
    Write-Host "  Static Web Server running at http://localhost:$port/"
    Write-Host "  Press Ctrl+C in terminal or kill task to stop."
    Write-Host "=================================================="
} catch {
    Write-Error "Failed to start listener: $_"
    exit 1
}

# Keep track of active listening loop
$currentDir = Get-Location
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Intercept POST API calls for writing portfolio data changes
        $rawUrl = $request.Url.LocalPath
        if ($request.HttpMethod -eq "POST" -and $rawUrl -eq "/api/save") {
            try {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $postData = $reader.ReadToEnd()
                $reader.Close()

                # Validate JSON format before writing
                $null = ConvertFrom-Json $postData -ErrorAction Stop

                # Overwrite portfolio.json on disk
                [System.IO.File]::WriteAllText("$currentDir\portfolio.json", $postData, [System.Text.Encoding]::UTF8)

                $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true}')
                $response.ContentType = "application/json"
                $response.StatusCode = 200
                $response.ContentLength64 = $resBytes.Length
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                Write-Host "$(Get-Date -Format 'HH:mm:ss') - Successfully saved portfolio.json!" -ForegroundColor Green
            } catch {
                $errJson = '{"success":false,"error":"' + ($_.Exception.Message -replace '"','\"') + '"}'
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($errJson)
                $response.ContentType = "application/json"
                $response.StatusCode = 400
                $response.ContentLength64 = $resBytes.Length
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                Write-Warning "Failed to save portfolio.json: $_"
            }
            $response.Close()
            continue
        }

        # Intercept POST API calls for uploading image assets
        if ($request.HttpMethod -eq "POST" -and $rawUrl -eq "/api/upload") {
            try {
                $filename = $request.Headers["X-Filename"]
                $folder = $request.Headers["X-Folder"]
                if (-not $filename) {
                    throw "X-Filename header is missing."
                }
                # Sanitize filename to prevent directory traversal
                $filename = [System.IO.Path]::GetFileName($filename)

                # Resolve upload subfolder path
                $subPath = "assets\images"
                if ($folder -eq "certs") {
                    $subPath = "assets\images\certs"
                }

                $destFolder = Join-Path $currentDir $subPath
                if (-not (Test-Path $destFolder)) {
                    $null = New-Item -ItemType Directory -Path $destFolder
                }
                $destPath = Join-Path $destFolder $filename

                # Write input stream payload to disk
                $fileStream = New-Object System.IO.FileStream($destPath, [System.IO.FileMode]::Create)
                $request.InputStream.CopyTo($fileStream)
                $fileStream.Close()

                # Build web-relative path
                $webPath = if ($folder -eq "certs") { "./assets/images/certs/$filename" } else { "./assets/images/$filename" }

                $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"path":"' + $webPath + '"}')
                $response.ContentType = "application/json"
                $response.StatusCode = 200
                $response.ContentLength64 = $resBytes.Length
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                Write-Host "$(Get-Date -Format 'HH:mm:ss') - Successfully uploaded image to ${subPath}: $filename" -ForegroundColor Green
            } catch {
                $errJson = '{"success":false,"error":"' + ($_.Exception.Message -replace '"','\"') + '"}'
                $resBytes = [System.Text.Encoding]::UTF8.GetBytes($errJson)
                $response.ContentType = "application/json"
                $response.StatusCode = 400
                $response.ContentLength64 = $resBytes.Length
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                Write-Warning "Failed to upload image: $_"
            }
            $response.Close()
            continue
        }
        
        # Resolve target file path relative to current workspace
        $rawUrl = $request.Url.LocalPath
        if ($rawUrl -eq "/") {
            $rawUrl = "/index.html"
        }
        
        # Clean URL segment to construct local file path
        $relativePath = $rawUrl.TrimStart('/')
        # Replace forward slashes with platform specific backslashes
        $relativePath = $relativePath -replace '/', [IO.Path]::DirectorySeparatorChar
        $filePath = Join-Path $currentDir $relativePath
        
        # Log request to stdout
        Write-Host "$(Get-Date -Format 'HH:mm:ss') - $($request.HttpMethod) $($rawUrl)"

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Determine content type from extension
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css" }
                ".js"   { "application/javascript" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                ".json" { "application/json" }
                ".xml"  { "application/xml" }
                default { "application/octet-stream" }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            Write-Host "  -> 404 Not Found" -ForegroundColor Yellow
            $response.StatusCode = 404
            $errorBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $errorBytes.Length
            $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
        }
        $response.Close()
    } catch {
        # Catch connection resets or aborted requests without breaking the loop
        Write-Host "Request handler warning: $_" -ForegroundColor DarkGray
    }
}
