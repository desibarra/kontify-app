# Fase 3: Infraestructura de Datos y Migración - COMPLETADA ✅

**Fecha:** 2025-11-21  
**Arquitecto:** Gemini (Data Architect - Supabase Expert)  
**Estado:** ✅ COMPLETADA

---

## 🎯 Objetivo

Establecer la infraestructura de datos de Kontify+ mediante:
1. Configuración del cliente Supabase con persistencia segura de sesión
2. Definición del schema SQL con tablas, RLS y triggers
3. Generación de tipos TypeScript
4. Documentación completa de setup y uso

---

## 📦 Archivos Creados

### 1. Cliente Supabase

**`src/lib/supabase.ts`** (200 líneas)

#### LargeSecureStoreAdapter

**Problema resuelto:** Expo SecureStore tiene un límite de 2KB por key, pero los tokens de sesión de Supabase pueden ser más grandes.

**Solución:** Adapter personalizado que:
- Divide datos grandes en chunks de 2KB
- Guarda cada chunk con un key único
- Reconstruye los chunks al leer
- Limpia chunks antiguos automáticamente

**Métodos:**
```typescript
class LargeSecureStoreAdapter {
  async setItem(key: string, value: string): Promise<void>
  async getItem(key: string): Promise<string | null>
  async removeItem(key: string): Promise<void>
  private splitIntoChunks(str: string): string[]
  private removeChunks(key: string): Promise<void>
}
```

#### Cliente Configurado

```typescript
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureStoreAdapter,      // Persistencia segura
    autoRefreshToken: true,            // Auto-refresh
    detectSessionInUrl: false,         // No aplica en mobile
    persistSession: true,              // Mantener sesión
    flowType: 'pkce',                  // Proof Key for Code Exchange
  },
});
```

#### Helper Functions

- `getCurrentSession()`: Obtiene sesión actual
- `getCurrentUser()`: Obtiene usuario actual
- `isAuthenticated()`: Verifica autenticación
- `signOut()`: Cierra sesión
- `onAuthStateChange()`: Escucha cambios de auth

---

### 2. Schema SQL

**`supabase/migrations/0001_initial_schema.sql`** (400 líneas)

#### Tablas Creadas

##### **profiles** (Extiende auth.users)

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'expert', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Índices:**
- `idx_profiles_email` (email)
- `idx_profiles_role` (role)

**Trigger:**
- `update_profiles_updated_at`: Auto-actualiza `updated_at`

##### **experts** (Información de expertos)

```sql
CREATE TABLE public.experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  hourly_rate DECIMAL(10, 2) DEFAULT 0.00 CHECK (hourly_rate >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
  bio TEXT,
  years_experience INTEGER DEFAULT 0 CHECK (years_experience >= 0),
  certifications TEXT[],
  languages TEXT[] DEFAULT ARRAY['es'],
  availability_hours JSONB DEFAULT '{"monday": [], ...}'::jsonb,
  total_consultations INTEGER DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id)
);
```

**Índices:**
- `idx_experts_profile_id` (profile_id)
- `idx_experts_specialty` (specialty)
- `idx_experts_status` (status)
- `idx_experts_rating` (rating DESC)

**Trigger:**
- `update_experts_updated_at`: Auto-actualiza `updated_at`

##### **leads** (Solicitudes de consulta)

```sql
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES public.experts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  specialty TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  budget DECIMAL(10, 2) CHECK (budget >= 0),
  estimated_hours INTEGER CHECK (estimated_hours > 0),
  deadline TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);
```

**Índices:**
- `idx_leads_user_id` (user_id)
- `idx_leads_expert_id` (expert_id)
- `idx_leads_status` (status)
- `idx_leads_specialty` (specialty)
- `idx_leads_created_at` (created_at DESC)

**Triggers:**
- `update_leads_updated_at`: Auto-actualiza `updated_at`
- `update_leads_closed_at`: Auto-actualiza `closed_at` cuando status = 'closed'

##### **messages** (Mensajes)

```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (sender_id != receiver_id)
);
```

**Índices:**
- `idx_messages_lead_id` (lead_id)
- `idx_messages_sender_id` (sender_id)
- `idx_messages_receiver_id` (receiver_id)
- `idx_messages_is_read` (is_read)
- `idx_messages_created_at` (created_at DESC)

**Trigger:**
- `update_messages_read_at`: Auto-actualiza `read_at` cuando is_read = true

---

#### Row Level Security (RLS)

**Todas las tablas tienen RLS habilitado.**

##### Políticas: profiles

1. **"Public profiles are viewable by everyone"**
   - SELECT: Todos pueden ver perfiles públicos

2. **"Users can update own profile"**
   - UPDATE: Solo el propio usuario

3. **"Users can insert own profile"**
   - INSERT: Solo el propio usuario

##### Políticas: experts

1. **"Active experts are viewable by everyone"**
   - SELECT: Todos pueden ver expertos activos

2. **"Experts can view own profile"**
   - SELECT: Expertos pueden ver su propio perfil (incluso si no está activo)

3. **"Experts can update own profile"**
   - UPDATE: Solo el propio experto

4. **"Users with expert role can insert expert profile"**
   - INSERT: Solo usuarios con role='expert'

##### Políticas: leads

1. **"Users can view own leads"**
   - SELECT: Usuarios ven sus propios leads

2. **"Experts can view assigned leads"**
   - SELECT: Expertos ven leads asignados

3. **"Users can create own leads"**
   - INSERT: Usuarios crean sus propios leads

4. **"Users can update own leads"**
   - UPDATE: Usuarios actualizan sus propios leads

5. **"Experts can update assigned leads"**
   - UPDATE: Expertos actualizan leads asignados

##### Políticas: messages

1. **"Users can view own messages"**
   - SELECT: Solo sender o receiver

2. **"Users can send messages"**
   - INSERT: Solo como sender

3. **"Users can update received messages"**
   - UPDATE: Solo receiver (para marcar como leído)

---

#### Helper Functions

##### `handle_new_user()`

**Trigger:** Se ejecuta automáticamente al crear un usuario en `auth.users`

**Función:** Crea un perfil en `public.profiles` automáticamente

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

##### `get_expert_stats(expert_uuid)`

**Función:** Obtiene estadísticas de un experto

**Retorna:**
```typescript
{
  total_leads: number
  active_leads: number
  closed_leads: number
  unread_messages: number
  avg_rating: number
}
```

---

### 3. Tipos TypeScript

**`src/types/supabase.ts`** (250 líneas)

#### Database Interface

```typescript
export interface Database {
  public: {
    Tables: {
      profiles: { Row, Insert, Update }
      experts: { Row, Insert, Update }
      leads: { Row, Insert, Update }
      messages: { Row, Insert, Update }
    }
    Functions: {
      get_expert_stats: { Args, Returns }
    }
  }
}
```

#### Helper Types

```typescript
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
```

#### Convenience Types

```typescript
export type Profile = Tables<'profiles'>
export type Expert = Tables<'experts'>
export type Lead = Tables<'leads'>
export type Message = Tables<'messages'>

export type ProfileInsert = Inserts<'profiles'>
export type ExpertInsert = Inserts<'experts'>
export type LeadInsert = Inserts<'leads'>
export type MessageInsert = Inserts<'messages'>
```

#### Extended Types (con relaciones)

```typescript
export interface ExpertWithProfile extends Expert {
  profile: Profile
}

export interface LeadWithExpert extends Lead {
  expert: ExpertWithProfile | null
}

export interface LeadWithMessages extends Lead {
  messages: Message[]
  unread_count: number
}

export interface MessageWithProfiles extends Message {
  sender: Profile
  receiver: Profile
}
```

---

### 4. Documentación

**`supabase/SETUP.md`** (300 líneas)

**Contenido:**
- Requisitos previos
- Configuración inicial (proyecto, variables de entorno)
- Ejecución de migraciones (Dashboard y CLI)
- Generación de tipos TypeScript
- Schema overview (tablas, seguridad, triggers)
- Ejemplos de uso (auth, queries, realtime)
- Seguridad best practices
- Troubleshooting
- Guía de migración desde AsyncStorage

---

## 📊 Métricas de Implementación

### Archivos Creados

- **`src/lib/supabase.ts`**: 200 líneas
- **`supabase/migrations/0001_initial_schema.sql`**: 400 líneas
- **`src/types/supabase.ts`**: 250 líneas
- **`supabase/SETUP.md`**: 300 líneas
- **Total**: 4 archivos, ~1,150 líneas

### Componentes de Base de Datos

- **Tablas**: 4 (profiles, experts, leads, messages)
- **Índices**: 15
- **Triggers**: 6
- **Functions**: 2
- **RLS Policies**: 13

---

## 🎯 Ejemplos de Uso

### Autenticación

```typescript
import { supabase } from '@/lib/supabase';

// Registrarse
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { full_name: 'John Doe' },
  },
});

// Iniciar sesión
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

### Queries

```typescript
// Obtener expertos activos
const { data: experts } = await supabase
  .from('experts')
  .select('*, profile:profiles(*)')
  .eq('status', 'active')
  .order('rating', { ascending: false });

// Crear lead
const { data: lead } = await supabase
  .from('leads')
  .insert({
    user_id: userId,
    title: 'Necesito ayuda',
    description: 'Descripción',
    specialty: 'legal',
  })
  .select()
  .single();

// Obtener mensajes
const { data: messages } = await supabase
  .from('messages')
  .select('*, sender:profiles!sender_id(*)')
  .eq('lead_id', leadId)
  .order('created_at');
```

---

## ✅ Checklist de Completitud

### Cliente Supabase
- [x] LargeSecureStoreAdapter implementado
- [x] Chunking de datos grandes (>2KB)
- [x] Auto-refresh de tokens
- [x] Persistencia de sesión
- [x] PKCE flow configurado
- [x] Helper functions (getCurrentSession, getCurrentUser, etc.)

### Schema SQL
- [x] Tabla profiles con roles
- [x] Tabla experts con especialidades
- [x] Tabla leads con estados
- [x] Tabla messages con is_read
- [x] 15 índices para performance
- [x] 6 triggers para auto-updates
- [x] 2 helper functions
- [x] UUID extension habilitada

### Row Level Security
- [x] RLS habilitado en todas las tablas
- [x] 13 políticas de seguridad
- [x] Políticas para profiles (3)
- [x] Políticas para experts (4)
- [x] Políticas para leads (5)
- [x] Políticas para messages (3)

### Tipos TypeScript
- [x] Interface Database completa
- [x] Helper types (Tables, Inserts, Updates)
- [x] Convenience types (Profile, Expert, etc.)
- [x] Extended types con relaciones
- [x] Function return types

### Documentación
- [x] Setup guide completo
- [x] Ejemplos de configuración
- [x] Ejemplos de uso
- [x] Best practices de seguridad
- [x] Troubleshooting
- [x] Guía de migración

---

## 🚀 Próximos Pasos

### Fase 4: Migración de AsyncStorage a Supabase

**Tablas a migrar:**
1. **Leads** → `public.leads`
2. **Expert Applications** → `public.experts`
3. **Messages** → `public.messages`
4. **Notifications** → Nueva tabla o metadata en leads
5. **Metrics** → Nueva tabla o calcular on-demand

**Estrategia:**
1. Crear servicios de migración
2. Exportar datos de AsyncStorage
3. Transformar al formato de Supabase
4. Importar con batch inserts
5. Verificar integridad
6. Actualizar servicios para usar Supabase
7. Mantener AsyncStorage como fallback temporal

### Fase 5: Autenticación Real

**Implementar:**
1. Pantallas de Login/Signup
2. Flujo de recuperación de contraseña
3. Verificación de email
4. Manejo de sesiones
5. Protección de rutas

---

## 📝 Notas Técnicas

### LargeSecureStoreAdapter

**Ventajas:**
- ✅ Previene pérdida de sesión al cerrar app
- ✅ Maneja tokens grandes automáticamente
- ✅ Compatible con Supabase auth
- ✅ Limpieza automática de chunks antiguos

**Limitaciones:**
- ⚠️ Más lento que SecureStore directo (por chunking)
- ⚠️ Requiere expo-secure-store instalado

### RLS Policies

**Ventajas:**
- ✅ Seguridad a nivel de base de datos
- ✅ No depende del código del cliente
- ✅ Previene accesos no autorizados
- ✅ Auditable desde Supabase Dashboard

**Consideraciones:**
- ⚠️ Debuggear políticas puede ser complejo
- ⚠️ Usar `SECURITY DEFINER` con cuidado
- ⚠️ Testear políticas exhaustivamente

### Performance

**Optimizaciones implementadas:**
- ✅ 15 índices en columnas frecuentemente consultadas
- ✅ Índices compuestos para queries complejas
- ✅ Triggers eficientes (solo actualizan cuando necesario)
- ✅ JSONB para metadata flexible

---

**Fecha de Finalización:** 2025-11-21  
**Estado Final:** ✅ FASE 3 COMPLETADA  
**Archivos Creados:** 4  
**Líneas de Código:** ~1,150  
**Próxima Fase:** Migración AsyncStorage → Supabase
