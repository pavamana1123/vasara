$retryCount = 0
$maxRetries = 9999999
$errorOccurred = $false

do {
    if ($retryCount -gt 0) {
        Write-Host "Retrying..."
    }

    try {
        # Run the Node code
        node .\karaner.js
        $errorOccurred = $false
    } catch {
        $errorOccurred = $true
    }

    $retryCount++
} while ($errorOccurred -and $retryCount -le $maxRetries)
