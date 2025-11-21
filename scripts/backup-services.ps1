# Kontify+ Backup Script
# Crea backups automáticos de archivos críticos

param(
    [string]$Message = "manual backup"
)

# Configuración
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backups/$timestamp"

Write-Host "🔄 Iniciando backup..." -ForegroundColor Cyan

# Crear directorio de backup
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

# Lista de archivos críticos a respaldar
$criticalFiles = @(
    "services/expertApplicationService.ts",
    "services/aiService.ts",
    "app/experts-dashboard.tsx",
    "app/experts-report.tsx",
    "app/experts-lead-detail.tsx",
    "app/experts-leads.tsx",
    "hooks/useExpertStatus.tsx",
    "KONTIFY_AUDIT.md",
    "package.json"
)

$backedUp = 0
$skipped = 0

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        # Crear subdirectorios si es necesario
        $destFile = Join-Path $backupDir $file
        $destDir = Split-Path $destFile -Parent
        
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        
        Copy-Item $file $destFile -Force
        Write-Host "  ✅ $file" -ForegroundColor Green
        $backedUp++
    } else {
        Write-Host "  ⏭️  $file (no existe)" -ForegroundColor Yellow
        $skipped++
    }
}

# Crear archivo de metadata
$metadata = @{
    timestamp = $timestamp
    message = $Message
    filesBackedUp = $backedUp
    filesSkipped = $skipped
    gitBranch = (git rev-parse --abbrev-ref HEAD 2>$null)
    gitCommit = (git rev-parse --short HEAD 2>$null)
} | ConvertTo-Json

$metadata | Out-File "$backupDir/metadata.json" -Encoding UTF8

Write-Host ""
Write-Host "✅ Backup completado!" -ForegroundColor Green
Write-Host "📁 Ubicación: $backupDir" -ForegroundColor Cyan
Write-Host "📊 Archivos respaldados: $backedUp" -ForegroundColor Cyan
Write-Host "⏭️  Archivos omitidos: $skipped" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Para restaurar un archivo:" -ForegroundColor Gray
Write-Host "   Copy-Item $backupDir\<ruta-archivo> <ruta-destino>" -ForegroundColor Gray
