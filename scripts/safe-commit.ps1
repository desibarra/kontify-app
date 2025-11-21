# Safe Commit Script
# Verifica el estado antes de hacer commit y ofrece opciones seguras

param(
    [string]$Message = ""
)

Write-Host "🔍 Verificando estado del repositorio..." -ForegroundColor Cyan
Write-Host ""

# Verificar si hay cambios
$status = git status --porcelain

if (-not $status) {
    Write-Host "✅ No hay cambios para commitear" -ForegroundColor Green
    exit 0
}

# Mostrar archivos modificados
Write-Host "📝 Archivos modificados:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Mostrar diff resumido
Write-Host "📊 Resumen de cambios:" -ForegroundColor Cyan
$stats = git diff --stat
if ($stats) {
    $stats
} else {
    Write-Host "  (Solo archivos nuevos o sin cambios trackeados)" -ForegroundColor Gray
}
Write-Host ""

# Si no se proporcionó mensaje, pedirlo
if (-not $Message) {
    Write-Host "💬 Ingresa el mensaje del commit:" -ForegroundColor Cyan
    Write-Host "   Ejemplos:" -ForegroundColor Gray
    Write-Host "   - feat: add lead detail screen" -ForegroundColor Gray
    Write-Host "   - fix: resolve checkout issue" -ForegroundColor Gray
    Write-Host "   - docs: update audit log" -ForegroundColor Gray
    Write-Host ""
    $Message = Read-Host "Mensaje"
    
    if (-not $Message) {
        Write-Host "❌ Commit cancelado (mensaje vacío)" -ForegroundColor Red
        exit 1
    }
}

# Confirmar
Write-Host ""
Write-Host "🎯 Vas a commitear con el mensaje:" -ForegroundColor Yellow
Write-Host "   '$Message'" -ForegroundColor White
Write-Host ""
$confirm = Read-Host "¿Continuar? (s/n)"

if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Commit cancelado" -ForegroundColor Red
    exit 1
}

# Hacer commit
Write-Host ""
Write-Host "📦 Agregando archivos..." -ForegroundColor Cyan
git add .

Write-Host "💾 Creando commit..." -ForegroundColor Cyan
git commit -m $Message

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Commit exitoso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Último commit:" -ForegroundColor Cyan
    git log -1 --oneline
    Write-Host ""
    Write-Host "💡 Siguiente paso:" -ForegroundColor Gray
    Write-Host "   git push origin main" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "❌ Error al crear commit" -ForegroundColor Red
    exit 1
}
