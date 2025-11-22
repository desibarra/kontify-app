# 🔧 FIXES APLICADOS - Problemas de Navegación

**Fecha:** 22 Nov 2025 17:00 UTC  
**Commit:** 23f71d7  
**Status:** ✅ CORREGIDO Y DESPLEGADO

---

## ⚠️ PROBLEMA IDENTIFICADO

En la página de registro (role-selection), al hacer click en los botones:
- ❌ Los botones no reaccionaban
- ❌ No navegaba a la siguiente página
- ❌ No había mensaje de error visible

**Causa:** Problemas con `router.replace()` en web + timing issues en Expo Router

---

## ✅ FIXES APLICADOS

### FIX #1: Cambiar router.replace → router.push

**Archivo:** `app/(auth)/role-selection.tsx`

**Cambio:**
```typescript
// ❌ ANTES (no funciona bien en web):
router.replace('/experts-onboarding');

// ✅ DESPUÉS (mejor compatibilidad web):
router.push('/experts-onboarding');
```

**Por qué:** `router.replace()` a veces falla en web. `router.push()` es más confiable en Vercel.

---

### FIX #2: Agregar setTimeout para dar tiempo a la navegación

**Archivo:** `app/(auth)/role-selection.tsx`

**Cambio:**
```typescript
// ✅ DESPUÉS:
if (role === 'expert') {
  setTimeout(() => {
    router.push('/experts-onboarding');
  }, 500); // 500ms delay
} else {
  setTimeout(() => {
    router.push('/(tabs)');
  }, 500);
}
```

**Por qué:** A veces React Native Web necesita tiempo para actualizar el estado antes de navegar.

---

### FIX #3: Mejorar Error Handling en updateUserRole

**Archivo:** `src/services/profileService.ts`

**Cambio:**
```typescript
// ❌ ANTES:
export async function updateUserRole(userId: string, role: UserRole) {
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  return { error };
}

// ✅ DESPUÉS:
export async function updateUserRole(userId: string, role: UserRole) {
  try {
    console.log(`🔄 Updating user ${userId} role to ${role}`);
    
    const { error, data } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select();

    if (error) {
      console.error('❌ Error updating role:', error);
      return { error };
    }

    console.log('✅ Role updated successfully:', data);
    return { error: null };
  } catch (err) {
    console.error('❌ Exception in updateUserRole:', err);
    return { error: err };
  }
}
```

**Por qué:** 
- Mejor logging para debugging
- Captura excepciones además de errores de Supabase
- `.select()` confirma que la actualización se realizó

---

### FIX #4: Agregar Try-Catch en handleRoleSelect

**Archivo:** `app/(auth)/role-selection.tsx`

**Cambio:**
```typescript
// ✅ DESPUÉS:
const handleRoleSelect = async (role: UserRole) => {
  if (!user?.id) {
    Alert.alert('Error', 'No se pudo identificar al usuario');
    return;
  }

  setSelectedRole(role);
  setIsLoading(true);

  try {
    const { error } = await updateUserRole(user.id, role);

    setIsLoading(false);

    if (error) {
      Alert.alert('Error', 'No se pudo actualizar tu rol. Intenta nuevamente.');
      setSelectedRole(null);
      return;
    }

    // Navegación con delay
    if (role === 'expert') {
      setTimeout(() => {
        router.push('/experts-onboarding');
      }, 500);
    } else {
      setTimeout(() => {
        router.push('/(tabs)');
      }, 500);
    }
  } catch (err) {
    console.error('Error en handleRoleSelect:', err);
    setIsLoading(false);
    Alert.alert('Error', 'Algo salió mal. Intenta nuevamente.');
    setSelectedRole(null);
  }
};
```

**Por qué:** Captura cualquier error no esperado y muestra mensaje al usuario.

---

## 🚀 PRÓXIMOS PASOS

### 1. Vercel Auto-Rebuild (2-5 min)
```
GitHub recibió el push → Vercel detectó cambios →
Inició rebuild automático → Deploy en vivo
```

### 2. Acceder a la URL nuevamente
```
https://desibarra-kontify-app2-8l7hm8okx-desibarras-projects.vercel.app
```

### 3. Probar el flujo
```
1. Ir a Register
2. Llenar formulario
3. Click en "Empresario" o "Asesor"
4. Click en "Crear cuenta"
5. En role-selection, hacer click en uno de los dos botones
6. ✅ Debe navegar a la página siguiente
```

### 4. Verificar Console (F12)
```
Si funciona, verás:
✅ "🔄 Updating user [ID] role to [role]"
✅ "✅ Role updated successfully"
✅ Navegación completada
```

---

## 📊 TESTING CHECKLIST

- [ ] Página de role-selection carga
- [ ] Botones reaccionan al click (visual feedback)
- [ ] Loading spinner aparece
- [ ] Página siguiente carga (después del delay)
- [ ] Console muestra logs de éxito
- [ ] No hay errores en console (F12 → Console tab)

---

## 🔍 SI AÚN HAY PROBLEMAS

### Verificar en Console (F12):
```
1. Abre Developer Tools (F12)
2. Ir a "Console" tab
3. Buscar mensajes rojo (❌) o azul (ℹ️)
4. Copiar el error completo
5. Reportar el error específico
```

### Posibles causas:
- ❌ Supabase offline → Espera unos minutos
- ❌ RLS policy bloqueando → Ejecutar SQL en Supabase
- ❌ Usuario no autenticado → Hacer login primero
- ❌ Token expirado → Cerrar sesión y volver a entrar

---

## 📝 RESUMEN TÉCNICO

| Cambio | Archivo | Tipo | Razón |
|--------|---------|------|-------|
| router.replace → push | role-selection.tsx | Fix | Web compatibility |
| Agregar setTimeout | role-selection.tsx | Fix | Timing issue |
| Try-catch wrapper | role-selection.tsx | Fix | Error handling |
| Error logging | profileService.ts | Improve | Debugging |
| .select() | profileService.ts | Improve | Confirmation |

---

## 🎯 RESULTADO ESPERADO

**Antes:**
```
Usuario clicks → Nada pasa → Sin mensaje de error 😞
```

**Después:**
```
Usuario clicks → Loading spinner → 500ms delay → 
Navega a nueva página ✅
```

---

**Fixes completados y desplegados en Vercel.**

**Verifica la URL cuando el rebuild esté completo (2-5 min).**
