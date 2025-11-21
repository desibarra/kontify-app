# Supabase Setup Guide

## 📋 Requisitos Previos

1. **Cuenta de Supabase**: Crea una cuenta en [supabase.com](https://supabase.com)
2. **Supabase CLI**: Instala el CLI globalmente
   ```bash
   npm install -g supabase
   ```

## 🚀 Configuración Inicial

### 1. Crear Proyecto en Supabase

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Guarda las credenciales:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. Configurar Variables de Entorno

Edita `.env.local` y agrega:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANTE**: Nunca commitees este archivo a Git.

### 3. Ejecutar Migraciones

#### Opción A: Desde Supabase Dashboard (Recomendado para producción)

1. Ve a tu proyecto en Supabase
2. Navega a **SQL Editor**
3. Copia y pega el contenido de `supabase/migrations/0001_initial_schema.sql`
4. Ejecuta el script

#### Opción B: Usando Supabase CLI (Desarrollo local)

```bash
# Inicializar Supabase local
npx supabase init

# Iniciar Supabase local
npx supabase start

# Aplicar migraciones
npx supabase db reset

# Ver estado de la base de datos
npx supabase db status
```

### 4. Generar Tipos TypeScript

Después de ejecutar las migraciones, genera los tipos:

#### Desde Supabase Cloud:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

Reemplaza `YOUR_PROJECT_ID` con el ID de tu proyecto (lo encuentras en la URL de Supabase).

#### Desde Supabase Local:

```bash
npx supabase gen types typescript --local > src/types/supabase.ts
```

**NOTA**: Los tipos ya están pre-generados en `src/types/supabase.ts`, pero debes regenerarlos cada vez que cambies el schema.

## 📊 Schema Overview

### Tablas Creadas

1. **profiles**
   - Extiende `auth.users`
   - Campos: id, email, full_name, avatar_url, role
   - Roles: 'user', 'expert', 'admin'

2. **experts**
   - Información de expertos
   - Campos: specialty, rating, hourly_rate, status, bio, etc.
   - Estados: 'pending', 'active', 'inactive', 'suspended'

3. **leads**
   - Solicitudes de consulta
   - Campos: title, description, status, priority, budget, etc.
   - Estados: 'open', 'in_progress', 'closed', 'cancelled'

4. **messages**
   - Mensajes entre usuarios y expertos
   - Campos: content, is_read, attachments, etc.

### Seguridad (RLS)

Todas las tablas tienen **Row Level Security** habilitado:

- ✅ Los usuarios solo pueden ver/editar sus propios datos
- ✅ Los expertos activos son visibles públicamente
- ✅ Los mensajes solo son visibles para sender/receiver
- ✅ Las políticas previenen accesos no autorizados

### Triggers Automáticos

- **updated_at**: Se actualiza automáticamente en cada UPDATE
- **closed_at**: Se actualiza cuando un lead se cierra
- **read_at**: Se actualiza cuando un mensaje se marca como leído
- **handle_new_user**: Crea un perfil automáticamente al registrarse

## 🔧 Uso del Cliente

### Importar el Cliente

```typescript
import { supabase } from '@/lib/supabase';
```

### Ejemplos de Uso

#### Autenticación

```typescript
// Registrarse
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
    },
  },
});

// Iniciar sesión
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Cerrar sesión
await supabase.auth.signOut();
```

#### Consultas

```typescript
// Obtener todos los expertos activos
const { data: experts, error } = await supabase
  .from('experts')
  .select('*, profile:profiles(*)')
  .eq('status', 'active')
  .order('rating', { ascending: false });

// Crear un lead
const { data: lead, error } = await supabase
  .from('leads')
  .insert({
    user_id: userId,
    title: 'Necesito ayuda con...',
    description: 'Descripción detallada',
    specialty: 'legal',
    budget: 500,
  })
  .select()
  .single();

// Obtener mensajes de un lead
const { data: messages, error } = await supabase
  .from('messages')
  .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
  .eq('lead_id', leadId)
  .order('created_at', { ascending: true });
```

#### Realtime (Opcional)

```typescript
// Escuchar nuevos mensajes
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `receiver_id=eq.${userId}`,
    },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();

// Cleanup
channel.unsubscribe();
```

## 🔐 Seguridad Best Practices

1. **Nunca expongas las credenciales**
   - Usa variables de entorno
   - No commitees `.env.local`

2. **Valida en el servidor**
   - Usa RLS policies
   - Valida datos con Zod antes de insertar

3. **Usa tipos TypeScript**
   - Regenera tipos después de cada cambio de schema
   - Usa tipos para evitar errores

4. **Maneja errores**
   ```typescript
   const { data, error } = await supabase.from('table').select();
   if (error) {
     console.error('Error:', error);
     // Manejar error apropiadamente
   }
   ```

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

## 🐛 Troubleshooting

### Error: "relation does not exist"
- Asegúrate de haber ejecutado las migraciones
- Verifica que estés conectado al proyecto correcto

### Error: "new row violates row-level security policy"
- Verifica que el usuario esté autenticado
- Revisa las políticas RLS en Supabase Dashboard

### Error: "JWT expired"
- El token de sesión expiró
- Llama a `supabase.auth.refreshSession()`

### Sesión no persiste
- Verifica que `expo-secure-store` esté instalado
- Revisa que el `LargeSecureStoreAdapter` esté configurado correctamente

## 🔄 Migración desde AsyncStorage

Para migrar datos existentes de AsyncStorage a Supabase:

1. Exporta datos de AsyncStorage
2. Transforma al formato de Supabase
3. Importa usando batch inserts
4. Verifica integridad de datos
5. Elimina datos de AsyncStorage

Ver `KONTIFY_AUDIT_PHASE13.md` para detalles de migración.
