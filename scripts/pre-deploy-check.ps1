# Pre-Deployment Check Script
# Ejecuta este script antes de desplegar para verificar que todo esté listo

Write-Host "🔍 KONTIFY - Pre-Deployment Checklist" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que existe .env.local
Write-Host "1️⃣ Verificando archivo .env.local..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "   ✅ .env.local encontrado" -ForegroundColor Green
    
    # Verificar variables críticas
    $envContent = Get-Content ".env.local" -Raw
    $requiredVars = @(
        "EXPO_PUBLIC_SUPABASE_URL",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY",
        "EXPO_PUBLIC_OPENAI_API_KEY"
    )
    
    $missingVars = @()
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch $var) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -eq 0) {
        Write-Host "   ✅ Todas las variables de entorno presentes" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Variables faltantes: $($missingVars -join ', ')" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ .env.local NO encontrado" -ForegroundColor Red
    Write-Host "      Copia .env.example a .env.local y configura las variables" -ForegroundColor Yellow
}
Write-Host ""

# 2. Verificar vercel.json
Write-Host "2️⃣ Verificando vercel.json..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "   ✅ vercel.json encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ vercel.json NO encontrado" -ForegroundColor Red
}
Write-Host ""

# 3. Verificar node_modules
Write-Host "3️⃣ Verificando dependencias..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules encontrado" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  node_modules NO encontrado" -ForegroundColor Yellow
    Write-Host "      Ejecuta: npm install --legacy-peer-deps" -ForegroundColor Yellow
}
Write-Host ""

# 4. Test de build
Write-Host "4️⃣ Probando build para web..." -ForegroundColor Yellow
Write-Host "   (Esto puede tomar 1-2 minutos...)" -ForegroundColor Gray

try {
    $buildOutput = npx expo export --platform web 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Build exitoso" -ForegroundColor Green
        
        # Verificar que el directorio dist existe
        if (Test-Path "dist") {
            $distFiles = Get-ChildItem -Path "dist" -File
            Write-Host "   ✅ Directorio dist generado ($($distFiles.Count) archivos)" -ForegroundColor Green
        }
    } else {
        Write-Host "   ❌ Build falló" -ForegroundColor Red
        Write-Host "      Revisa los errores arriba" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Error al ejecutar build: $_" -ForegroundColor Red
}
Write-Host ""

# 5. Resumen
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📋 RESUMEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si todos los checks pasaron ✅, estás listo para:" -ForegroundColor Green
Write-Host "  1. Configurar variables en Vercel Dashboard" -ForegroundColor White
Write-Host "  2. Ejecutar: npm run deploy" -ForegroundColor White
Write-Host ""
Write-Host "Si alguno falló ❌, corrige los problemas antes de desplegar." -ForegroundColor Yellow
Write-Host ""
Write-Host "Para más información, lee DEPLOY.md" -ForegroundColor Cyan
Write-Host ""
