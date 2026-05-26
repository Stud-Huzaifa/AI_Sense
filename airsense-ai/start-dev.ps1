param(
    [switch]$Install,
    [switch]$Help
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"
$LogDir = Join-Path $Root ".logs"

if ($Help) {
    Write-Host "AirSense AI dev runner"
    Write-Host ""
    Write-Host "Usage:"
    Write-Host "  .\start-dev.ps1"
    Write-Host "  .\start-dev.ps1 -Install"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Install   Install backend and frontend dependencies before starting servers."
    exit 0
}

function Test-PortAvailable {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $null -eq $connection
}

function Require-Command {
    param(
        [string]$Name,
        [string]$Message
    )
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw $Message
    }
}

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

Require-Command "python" "Python was not found. Install Python and make sure it is available as 'python'."
Require-Command "npm.cmd" "npm was not found. Install Node.js and make sure npm is available."

if (-not (Test-Path (Join-Path $Backend ".env"))) {
    Copy-Item (Join-Path $Root ".env.example") (Join-Path $Backend ".env")
}

if (-not (Test-PortAvailable 8000)) {
    throw "Port 8000 is already in use. Stop the process using it, or run the backend manually on another port."
}

if (-not (Test-PortAvailable 5173)) {
    throw "Port 5173 is already in use. Stop the process using it, or run the frontend manually on another port."
}

if ($Install) {
    Write-Host "Installing backend dependencies..."
    Push-Location $Backend
    python -m pip install -r requirements.txt
    Pop-Location

    Write-Host "Installing frontend dependencies..."
    Push-Location $Frontend
    npm.cmd install
    Pop-Location
}

$NodeModules = Join-Path $Frontend "node_modules"
if (-not (Test-Path $NodeModules)) {
    Write-Host "Frontend dependencies are missing."
    Write-Host "Run '.\start-dev.ps1 -Install' once, or run 'cd frontend; npm install'."
    exit 1
}

Write-Host ""
Write-Host "Starting AirSense AI..."
Write-Host "Backend:  http://127.0.0.1:8000"
Write-Host "API docs: http://127.0.0.1:8000/docs"
Write-Host "Frontend: http://localhost:5173"
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers."
Write-Host ""

$BackendLog = Join-Path $LogDir "backend.log"
$FrontendLog = Join-Path $LogDir "frontend.log"

$BackendJob = Start-Job -Name "airsense-backend" -ScriptBlock {
    param($BackendPath, $LogPath)
    Set-Location $BackendPath
    python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 *>> $LogPath
} -ArgumentList $Backend, $BackendLog

$FrontendJob = Start-Job -Name "airsense-frontend" -ScriptBlock {
    param($FrontendPath, $LogPath)
    Set-Location $FrontendPath
    $env:VITE_API_BASE_URL = "http://127.0.0.1:8000"
    npm.cmd run dev -- --host 0.0.0.0 --port 5173 *>> $LogPath
} -ArgumentList $Frontend, $FrontendLog

try {
    while ($true) {
        $failed = @($BackendJob, $FrontendJob) | Where-Object { $_.State -in @("Failed", "Stopped", "Completed") }
        if ($failed.Count -gt 0) {
            foreach ($job in $failed) {
                Write-Host "$($job.Name) stopped with state $($job.State)."
                Receive-Job $job -Keep | Select-Object -Last 30
            }
            Write-Host "Logs are in $LogDir"
            break
        }
        Start-Sleep -Seconds 2
    }
}
finally {
    Stop-Job $BackendJob, $FrontendJob -ErrorAction SilentlyContinue
    Remove-Job $BackendJob, $FrontendJob -Force -ErrorAction SilentlyContinue
    Write-Host "AirSense AI dev servers stopped."
}

