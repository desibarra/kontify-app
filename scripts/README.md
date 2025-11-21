# Scripts de Utilidad - Kontify+

Este directorio contiene scripts de PowerShell para facilitar el desarrollo seguro del proyecto.

## 📋 Scripts Disponibles

### 1. `backup-services.ps1` - Backup Automático

Crea backups de archivos críticos del proyecto.

**Uso:**
```powershell
# Backup con mensaje personalizado
.\scripts\backup-services.ps1 -Message "Before Phase 10"

# Backup rápido (mensaje por defecto)
.\scripts\backup-services.ps1
```

**Archivos respaldados:**
- `services/expertApplicationService.ts`
- `services/aiService.ts`
- `app/experts-dashboard.tsx`
- `app/experts-report.tsx`
- `app/experts-lead-detail.tsx`
- `app/experts-leads.tsx`
- `hooks/useExpertStatus.tsx`
- `KONTIFY_AUDIT.md`
- `package.json`

**Ubicación de backups:** `backups/[timestamp]/`

**Restaurar un archivo:**
```powershell
Copy-Item backups\20251120_220601\services\expertApplicationService.ts services\
```

---

### 2. `safe-commit.ps1` - Commit Seguro

Verifica cambios antes de hacer commit y solicita confirmación.

**Uso:**
```powershell
# Commit interactivo (te pedirá el mensaje)
.\scripts\safe-commit.ps1

# Commit con mensaje directo
.\scripts\safe-commit.ps1 -Message "feat: add lead detail screen"
```

**Características:**
- ✅ Muestra archivos modificados
- ✅ Muestra resumen de cambios (diff --stat)
- ✅ Solicita confirmación antes de commitear
- ✅ Usa mensajes de commit convencionales

---

## 🚀 Uso Recomendado

### Antes de Empezar una Fase Nueva:

```powershell
# 1. Crear backup
.\scripts\backup-services.ps1 -Message "Before Phase 10"

# 2. Verificar estado
git status

# 3. Si hay cambios pendientes, commitear
.\scripts\safe-commit.ps1 -Message "wip: save progress"
```

### Al Completar una Fase:

```powershell
# 1. Crear backup
.\scripts\backup-services.ps1 -Message "Phase 10 complete"

# 2. Commit con safe-commit
.\scripts\safe-commit.ps1 -Message "feat: Phase 10 - Lead Management"

# 3. Push (si tienes remoto)
git push origin main
```

---

## 📚 Documentación Adicional

Ver [`.git-workflow.md`](../.git-workflow.md) para guía completa de Git workflow.

---

## 🔧 Requisitos

- PowerShell 5.1 o superior
- Git instalado y configurado
- Permisos de ejecución de scripts

**Habilitar ejecución de scripts (si es necesario):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 💡 Tips

- Ejecuta `backup-services.ps1` antes de cualquier operación git destructiva
- Usa `safe-commit.ps1` para evitar commits accidentales
- Los backups incluyen metadata (timestamp, branch, commit hash)
- Revisa el contenido de `backups/[timestamp]/metadata.json` para info del backup
