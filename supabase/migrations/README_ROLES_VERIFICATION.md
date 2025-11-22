# 🔧 PROCEDIMIENTO COMPLETO DE VERIFICACIÓN Y CORRECCIÓN DEL SISTEMA DE ROLES

## 📋 Archivos creados

1. **VERIFY_ROLES_SYSTEM.sql** - Script de verificación (NO modifica nada)
2. **FIX_ROLES_SYSTEM.sql** - Script de corrección (ejecutar solo si es necesario)
3. **TEST_ROLES_SYSTEM.sql** - Script de pruebas finales

---

## 🎯 PROCEDIMIENTO PASO A PASO

### ✅ PASO 1: VERIFICACIÓN INICIAL

1. Abre tu **Supabase Dashboard**: https://supabase.com/dashboard/project/oyvrllrrpluixybihnew
2. Ve a **SQL Editor**
3. Abre el archivo `supabase/migrations/VERIFY_ROLES_SYSTEM.sql`
4. Copia TODO su contenido y pégalo en el SQL Editor
5. Haz clic en **Run**
6. **COPIA Y PEGA AQUÍ TODO EL RESULTADO**

Este script verifica:
- ✓ Existencia del ENUM `user_role`
- ✓ Valores del ENUM (si existe)
- ✓ Tipo actual de la columna `profiles.role`
- ✓ Código de la función `handle_new_user()`
- ✓ Configuración del trigger `on_auth_user_created`
- ✓ Distribución actual de roles en la tabla
- ✓ Constraints existentes

---

### ⚠️ PASO 2: ANÁLISIS Y DECISIÓN

Una vez que pegues aquí los resultados del PASO 1, analizaré:

1. **Si el ENUM existe** → Pasar a verificar columna
2. **Si el ENUM NO existe** → Necesitamos crearlo
3. **Si la columna es TEXT** → Necesitamos convertirla a ENUM
4. **Si la columna ya es ENUM** → Solo verificar función
5. **Si la función es incorrecta** → Actualizarla
6. **Si el trigger no existe** → Crearlo

**🔴 ME DETENDRÉ AQUÍ Y TE PEDIRÉ CONFIRMACIÓN ANTES DE EJECUTAR CUALQUIER CAMBIO**

---

### 🔧 PASO 3: APLICAR CORRECCIONES (solo si es necesario)

Si después del análisis determino que algo falta o está incorrecto:

1. Te mostraré **exactamente qué partes del script FIX_ROLES_SYSTEM.sql** ejecutar
2. Esperaré tu **confirmación explícita**
3. Solo entonces te indicaré cómo proceder

El script `FIX_ROLES_SYSTEM.sql` es **modular** y puede ejecutarse:
- ✅ Completo (si todo falta)
- ✅ Por partes (si solo falta algo específico)
- ✅ Es idempotente (puede ejecutarse múltiples veces sin romper nada)

---

### ✅ PASO 4: PRUEBAS FINALES

Después de aplicar correcciones (si fueron necesarias):

1. Ejecutar `TEST_ROLES_SYSTEM.sql` completo
2. Este script:
   - Crea usuarios de prueba con diferentes roles
   - Verifica que se asignen correctamente
   - Limpia automáticamente los datos de prueba
   - Genera reporte final del sistema

---

## 🛡️ GARANTÍAS DE SEGURIDAD

Este procedimiento es seguro porque:

- ❌ **NO modifica migraciones existentes** (0001_initial_schema.sql queda intacto)
- ❌ **NO borra datos** de usuarios reales
- ✅ **Solo agrega** lo que falta (ENUM, función actualizada, trigger)
- ✅ **Convierte datos existentes** de forma segura ('admin' → 'expert')
- ✅ **Usa transacciones implícitas** en cada bloque DO $$
- ✅ **Es idempotente** (puede ejecutarse múltiples veces)
- ✅ **Tiene verificaciones** en cada paso

---

## 📊 INFORMACIÓN ADICIONAL

### Valores esperados del ENUM:
```sql
'user'         -- Usuario regular (default)
'entrepreneur' -- Empresario buscando asesoría
'expert'       -- Asesor ofreciendo servicios
```

### Conversión de roles legacy:
- `'admin'` → se convertirá a `'expert'`
- Cualquier otro valor incompatible → error controlado

### Función esperada:
La función `handle_new_user()` debe capturar el role desde `raw_user_meta_data->>'role'` y convertirlo a ENUM, con default 'user'.

---

## 🚀 COMENCEMOS

**Por favor, ejecuta el PASO 1 ahora y pégame aquí todos los resultados.**

Los resultados deberían verse así:

```
check_step                                  | status
-------------------------------------------+--------------------------
🔍 PASO 1: Verificar ENUM user_role        | ✅ ENUM user_role EXISTE
                                           | (o ❌ NO EXISTE)

info                                       | enum_value  | sort_order
-------------------------------------------+-------------+-----------
📋 Valores del ENUM user_role:            | user        | 1
                                          | entrepreneur| 2
                                          | expert      | 3

...etc
```

Esperando tus resultados... 🔍

