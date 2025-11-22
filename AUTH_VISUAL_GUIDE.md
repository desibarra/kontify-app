# 🎨 GUÍA VISUAL DE AUTENTICACIÓN

## PANTALLAS IMPLEMENTADAS

### 1. Landing Page (/) - MODIFICADA
```
┌────────────────────────────────────────────┐
│         [Logo Kontify con gradiente]       │
│                                            │
│      🎯 Impulsado por IA Avanzada          │
│                                            │
│    Tu Asesor Fiscal Inteligente            │
│                                            │
│  Diagnósticos fiscales instantáneos.       │
│  Respuestas precisas. Expertos             │
│  certificados cuando los necesites.        │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │     [Comenzar Ahora] →               │ │ ← Redirige a /register
│  └──────────────────────────────────────┘ │
│                                            │
│  ¿Ya tienes cuenta? Inicia sesión         │ ← Redirige a /login
│                                            │
│  Sin tarjeta de crédito •                 │
│  Respuesta en segundos                    │
│                                            │
│  [Floating cards animadas]                │
└────────────────────────────────────────────┘
```

**Colores**:
- Background: Negro (#000)
- Texto principal: Blanco (#FFF)
- Acentos: Verde (#92BF4E → #7DA842)
- Texto secundario: Gris (#999)

---

### 2. Register Screen (/(auth)/register) - NUEVA
```
┌────────────────────────────────────────────┐
│                                            │
│         [Logo Verde con ícono +]           │
│                                            │
│            Crear cuenta                    │
│                                            │
│  Únete a Kontify y conecta con expertos   │
│              fiscales                      │
│                                            │
│  Nombre completo                           │
│  ┌──────────────────────────────────────┐ │
│  │ 👤  Juan Pérez                        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Email                                     │
│  ┌──────────────────────────────────────┐ │
│  │ ✉️   tu@email.com                     │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Contraseña                                │
│  ┌──────────────────────────────────────┐ │
│  │ 🔒  Mínimo 6 caracteres     👁️        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Confirmar contraseña                      │
│  ┌──────────────────────────────────────┐ │
│  │ 🔒  Repite tu contraseña    👁️        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │       [Crear cuenta] →                │ │ ← LinearGradient verde
│  └──────────────────────────────────────┘ │
│                                            │
│  Al registrarte, aceptas nuestros         │
│  Términos de Servicio y                   │
│  Política de Privacidad                   │
│                                            │
│  ¿Ya tienes cuenta? Inicia sesión         │ ← Link a /login
│                                            │
│  ← Volver al inicio                       │ ← Link a /
└────────────────────────────────────────────┘
```

**Validaciones Frontend**:
- ✅ Todos los campos obligatorios
- ✅ Email válido (regex)
- ✅ Password mínimo 6 caracteres
- ✅ Contraseñas coinciden

**Flujo**:
1. Usuario ingresa datos
2. Click "Crear cuenta"
3. Loading spinner
4. Si error: Alert con mensaje
5. Si éxito: Alert "¡Cuenta creada! Revisa tu email"
6. Redirect a /login

---

### 3. Login Screen (/(auth)/login) - NUEVA
```
┌────────────────────────────────────────────┐
│                                            │
│         [Logo Verde con escudo]            │
│                                            │
│         Bienvenido a Kontify               │
│                                            │
│  Inicia sesión para acceder a tus         │
│         expertos fiscales                  │
│                                            │
│  Email                                     │
│  ┌──────────────────────────────────────┐ │
│  │ ✉️   tu@email.com                     │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Contraseña                                │
│  ┌──────────────────────────────────────┐ │
│  │ 🔒  ••••••••                 👁️        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │     [Iniciar Sesión] →                │ │ ← LinearGradient verde
│  └──────────────────────────────────────┘ │
│                                            │
│       ¿Olvidaste tu contraseña?           │ ← Placeholder
│                                            │
│  ¿No tienes cuenta? Regístrate aquí       │ ← Link a /register
│                                            │
│  ← Volver al inicio                       │ ← Link a /
└────────────────────────────────────────────┘
```

**Validaciones Frontend**:
- ✅ Email y password obligatorios

**Flujo**:
1. Usuario ingresa credenciales
2. Click "Iniciar Sesión"
3. Loading spinner
4. Si error: Alert con mensaje de Supabase
5. Si éxito: Redirect automático a /(tabs) (manejado por AuthContext)

---

## FLUJOS DE NAVEGACIÓN

### A. Usuario Nuevo (Happy Path)
```
1. Landing (/)
   ↓ Click "Comenzar Ahora"
   
2. Register (/(auth)/register)
   ↓ Completa formulario
   ↓ Click "Crear cuenta"
   ↓ Supabase.auth.signUp()
   
3. Alert: "¡Cuenta creada! Revisa tu email"
   ↓ Click "OK"
   
4. Login (/(auth)/login)
   ↓ [Usuario confirma email en su casilla]
   ↓ Ingresa credenciales
   ↓ Click "Iniciar Sesión"
   ↓ Supabase.auth.signInWithPassword()
   
5. AuthContext detecta session
   ↓ Middleware redirect automático
   
6. App /(tabs) ✅
```

### B. Usuario Existente
```
1. Landing (/)
   ↓ Click "¿Ya tienes cuenta? Inicia sesión"
   
2. Login (/(auth)/login)
   ↓ Ingresa credenciales
   ↓ Click "Iniciar Sesión"
   
3. AuthContext detecta session
   ↓ Middleware redirect automático
   
4. App /(tabs) ✅
```

### C. Sesión Persistente (Usuario retornando)
```
1. App Launch
   ↓ AuthContext useEffect ejecuta
   ↓ supabase.auth.getSession()
   ↓ Session recuperada de AsyncStorage
   
2. Middleware detecta session
   ↓ User ya autenticado
   
3. App /(tabs) ✅ (sin pasar por login)
```

### D. Logout
```
1. User en /(tabs)/profile
   ↓ Click "Cerrar sesión"
   ↓ signOut()
   ↓ supabase.auth.signOut()
   
2. AuthContext actualiza session=null
   ↓ onAuthStateChange dispara
   ↓ Middleware detecta no-auth
   
3. Redirect automático a /(auth)/login
```

---

## MIDDLEWARE DE PROTECCIÓN

### Lógica en AuthContext:
```typescript
useEffect(() => {
  const inAuthGroup = segments[0] === '(auth)';
  const inProtectedGroup = segments[0] === '(tabs)';

  // Caso 1: Usuario no autenticado intenta acceder a /(tabs)
  if (!session && !isLoading && inProtectedGroup) {
    console.log('🚫 No auth, redirecting to login');
    router.replace('/(auth)/login');
  }

  // Caso 2: Usuario autenticado intenta acceder a /(auth)
  if (session && inAuthGroup) {
    console.log('✅ Already authenticated, redirecting to app');
    router.replace('/(tabs)');
  }
}, [session, isLoading, segments]);
```

### Tabla de Rutas:
| Ruta                 | Sin Auth          | Con Auth         |
|----------------------|-------------------|------------------|
| `/`                  | ✅ Permitido      | ✅ Permitido     |
| `/(auth)/login`      | ✅ Permitido      | ❌ Redirect a /(tabs) |
| `/(auth)/register`   | ✅ Permitido      | ❌ Redirect a /(tabs) |
| `/(tabs)/*`          | ❌ Redirect a login | ✅ Permitido   |

---

## ESTILOS Y DISEÑO

### Paleta de Colores:
```javascript
const colors = {
  // Background
  black: '#000',
  darkGray: '#0a0a0a',
  cardBackground: '#1a1a1a',
  
  // Text
  white: '#FFF',
  lightGray: '#999',
  darkGray: '#666',
  
  // Accent (Verde Kontify)
  primary: '#92BF4E',
  primaryDark: '#7DA842',
  
  // Borders
  border: '#333',
};
```

### Componentes Reutilizables:
```typescript
// Input con ícono
<View style={styles.inputWrapper}>
  <Ionicons name="mail-outline" size={20} color="#999" />
  <TextInput style={styles.input} />
  <Ionicons name="eye-outline" size={20} color="#999" />
</View>

// Botón con gradiente
<Pressable style={styles.button}>
  <LinearGradient colors={['#92BF4E', '#7DA842']}>
    <Text style={styles.buttonText}>Texto</Text>
    <Ionicons name="arrow-forward" size={20} color="#000" />
  </LinearGradient>
</Pressable>
```

---

## ICONOS USADOS (Ionicons)

| Ícono                | Uso                         |
|----------------------|-----------------------------|
| `shield-checkmark`   | Logo Login                  |
| `person-add`         | Logo Register               |
| `person-outline`     | Input Nombre                |
| `mail-outline`       | Input Email                 |
| `lock-closed-outline`| Input Password              |
| `eye-outline`        | Mostrar password            |
| `eye-off-outline`    | Ocultar password            |
| `arrow-forward`      | Botones CTA                 |
| `arrow-back`         | Volver al inicio            |

---

## RESPONSIVE DESIGN

### KeyboardAvoidingView:
```typescript
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={styles.container}
>
  <ScrollView
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled"
  >
    {/* Contenido */}
  </ScrollView>
</KeyboardAvoidingView>
```

### Breakpoints:
- Mobile: Diseño vertical, formulario centrado
- Tablet: Max width de inputs, más spacing
- Desktop: Centrado con max-width 600px

---

## ANIMACIONES Y UX

### Loading States:
```typescript
{isLoading ? (
  <ActivityIndicator color="#000" />
) : (
  <>
    <Text>Iniciar Sesión</Text>
    <Ionicons name="arrow-forward" />
  </>
)}
```

### Botones Pressed:
```typescript
style={({ pressed }) => [
  styles.button,
  pressed && styles.buttonPressed, // opacity: 0.8
]}
```

### Gradientes:
```typescript
<LinearGradient
  colors={['#92BF4E', '#7DA842']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
/>
```

---

## TESTING CHECKLIST

### Test 1: Registro
- [ ] Validación de campos vacíos
- [ ] Validación de email inválido
- [ ] Validación de password corto (<6)
- [ ] Validación de passwords no coinciden
- [ ] Registro exitoso → Alert → Redirect a login
- [ ] Email de confirmación enviado por Supabase

### Test 2: Login
- [ ] Validación de campos vacíos
- [ ] Login con credenciales incorrectas → Alert error
- [ ] Login exitoso → Redirect a /(tabs)
- [ ] Sesión persiste después de cerrar app

### Test 3: Middleware
- [ ] Usuario no auth intenta ir a /(tabs) → Redirect a login
- [ ] Usuario auth intenta ir a /(auth) → Redirect a /(tabs)
- [ ] Usuario no auth puede acceder a /

### Test 4: Logout
- [ ] Click logout → Session eliminada
- [ ] Redirect a login
- [ ] No puede acceder a /(tabs) después de logout

---

## CAPTURAS DE PANTALLA (Mockups)

### Landing Page:
![Landing](https://via.placeholder.com/400x800/000000/92BF4E?text=Landing+Page)

### Register:
![Register](https://via.placeholder.com/400x800/000000/92BF4E?text=Register+Screen)

### Login:
![Login](https://via.placeholder.com/400x800/000000/92BF4E?text=Login+Screen)

---

## 📱 DISPOSITIVOS SOPORTADOS

- ✅ iOS (iPhone 12+, iPad)
- ✅ Android (API 21+)
- ✅ Web (Desktop/Mobile)

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
