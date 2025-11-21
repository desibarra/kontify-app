# KONTIFY PROTOCOL v1.0
## Manual de Arquitectura: Expo/React Native Edition

**Basado en:** GEMINI_MASTER_PROTOCOL v3.0  
**Adaptado para:** Expo SDK 54+ / React Native 0.76+  
**Fecha:** 2025-11-21

---

## 🎯 Misión

Construir productos móviles de clase mundial con:
- **Velocidad extrema** en desarrollo y runtime
- **Diseño UX/UI impecable** siguiendo Atomic Design
- **Código mantenible** con arquitectura Feature-First
- **Performance nativa** optimizada para iOS/Android/Web

---

## 🏛️ Pilar 1: Stack Tecnológico (Expo Edition)

### 🟢 Core (Infraestructura & Lógica)

| Componente | Tecnología | Versión | Propósito |
|------------|-----------|---------|-----------|
| **Framework** | Expo | ~54.0.0 | Desarrollo universal (iOS/Android/Web) |
| **Navegación** | Expo Router | ~6.0.15 | File-based routing (Next.js-style) |
| **Base de Datos** | Supabase | ^2.50.0 | PostgreSQL + Auth + Storage + Realtime |
| **Lenguaje** | TypeScript | ~5.9.2 | Strict mode obligatorio |
| **Estado Local** | AsyncStorage | 2.2.0 | Persistencia (migrar a Supabase) |
| **Estado Global** | Zustand | ^5.0.2 | State management ligero |
| **Validación** | Zod | (agregar) | Schema validation |
| **AI** | Google Gemini | API | Asistente inteligente |

### 🎨 Visual & UX (The "Feel")

| Componente | Tecnología | Propósito |
|------------|-----------|-----------|
| **Styling** | NativeWind v4 | Tailwind CSS para React Native |
| **Componentes Base** | Custom Design System | Atomic Design (atoms/molecules/organisms) |
| **Animaciones** | React Native Reanimated | ~3.16.1 | Animaciones 60fps nativas |
| **Gestos** | React Native Gesture Handler | ~2.20.2 | Interacciones táctiles |
| **Iconografía** | Lucide React Native | (migrar de @expo/vector-icons) |
| **Gradientes** | Expo Linear Gradient | ~15.0.7 | Efectos visuales premium |

### 📈 Growth & Observabilidad

| Componente | Tecnología | Propósito |
|------------|-----------|-----------|
| **Analytics** | PostHog React Native | (agregar) | Event tracking + Session replay |
| **Error Tracking** | Sentry React Native | (opcional) | Crash reporting |
| **Logging** | Custom Logger | Logs estructurados a Supabase |
| **SEO (Web)** | expo-seo | Metadata para web export |

---

## 📁 Pilar 2: Arquitectura Feature-First

### Estructura de Carpetas Obligatoria

```
app_kontify/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # Tab navigation
│   ├── (marketing)/              # Landing pages (web)
│   └── _layout.tsx               # Root layout
│
├── src/
│   ├── design-system/            # 🎨 Sistema de diseño centralizado
│   │   ├── tokens.ts             # Colores, tipografía, espaciado
│   │   ├── components/           # Componentes atómicos
│   │   │   ├── atoms/            # KButton, KInput, KBadge
│   │   │   ├── molecules/        # KCard, KModal, KToast
│   │   │   └── organisms/        # KHeader, KLeadCard
│   │   └── animations/           # Animaciones reutilizables
│   │
│   ├── features/                 # 🧩 Módulos por funcionalidad
│   │   ├── chat/
│   │   │   ├── components/       # UI específica de chat
│   │   │   ├── hooks/            # useAIChat, useChatHistory
│   │   │   ├── services/         # aiService.ts
│   │   │   ├── types/            # ChatMessage, ChatSession
│   │   │   └── utils/            # helpers específicos
│   │   │
│   │   ├── experts/
│   │   │   ├── components/       # ExpertCard, ExpertFilters
│   │   │   ├── hooks/            # useExpertStatus, useExperts
│   │   │   ├── services/         # expertApplicationService.ts
│   │   │   ├── types/            # ExpertLead, ExpertMetrics
│   │   │   └── screens/          # (si no están en /app)
│   │   │
│   │   ├── leads/
│   │   │   ├── components/       # LeadCard, LeadFilters
│   │   │   ├── hooks/            # useRealTimeMessages
│   │   │   ├── services/         # leadService.ts
│   │   │   └── types/            # Lead, LeadMessage
│   │   │
│   │   ├── metrics/
│   │   │   ├── components/       # MetricsCard, BarChart
│   │   │   ├── hooks/            # useMetrics
│   │   │   └── utils/            # calculateMetrics
│   │   │
│   │   └── auth/                 # (futuro: Supabase Auth)
│   │       ├── components/       # LoginForm, SignUpForm
│   │       ├── hooks/            # useAuth, useSession
│   │       └── services/         # authService.ts
│   │
│   ├── shared/                   # 🔧 Código compartido
│   │   ├── components/           # Componentes genéricos
│   │   ├── hooks/                # useColorScheme, useThemeColor
│   │   ├── utils/                # formatters, validators
│   │   ├── types/                # tipos globales
│   │   └── constants/            # constantes globales
│   │
│   └── lib/                      # 🔌 Configuración de librerías
│       ├── supabase.ts           # Cliente de Supabase
│       ├── posthog.ts            # Analytics
│       └── logger.ts             # Sistema de logging
│
├── supabase/                     # 🗄️ Backend as Code
│   ├── migrations/               # SQL migrations
│   ├── functions/                # Edge Functions
│   └── seed.sql                  # Datos de prueba
│
├── assets/                       # 🖼️ Recursos estáticos
├── constants/                    # (deprecar, mover a src/shared)
├── components/                   # (deprecar, mover a features/)
├── hooks/                        # (deprecar, mover a features/)
└── services/                     # (deprecar, mover a features/)
```

### Reglas de Organización

1. **Feature-First**: Cada módulo es autónomo
2. **Colocation**: Código relacionado vive junto
3. **Shared**: Solo lo verdaderamente compartido
4. **No Circular Dependencies**: Features no se importan entre sí
5. **Design System**: Única fuente de verdad para UI

---

## ⚙️ Pilar 3: Metodología de Desarrollo (5 Fases)

### 1️⃣ Fase de Definición (Blueprint)

**Antes de escribir código:**

- [ ] **User Journey**: ¿Qué problema resuelve esta feature?
- [ ] **Modelo de Datos**: Dibuja las tablas y relaciones
- [ ] **Wireframes**: Boceto de la UI (Figma/papel)

**Regla de Oro:** "Si no puedes dibujar la relación de datos, no puedes programarla."

### 2️⃣ Fase de Datos (Supabase First)

```sql
-- Ejemplo: supabase/migrations/20250121_create_leads.sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'in_progress', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seguridad obligatoria
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experts can view their own leads"
  ON leads FOR SELECT
  USING (auth.uid() = expert_id);
```

**Generar tipos TypeScript:**
```bash
npx supabase gen types typescript --local > src/shared/types/database.types.ts
```

### 3️⃣ Fase de Lógica (Services + Hooks)

**Patrón obligatorio:**

```typescript
// src/features/leads/services/leadService.ts
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const createLeadSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  specialty: z.string(),
});

export async function createLead(data: unknown) {
  // 1. Validar con Zod
  const result = createLeadSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Invalid lead data');
  }

  // 2. Insertar en Supabase
  const { data: lead, error } = await supabase
    .from('leads')
    .insert(result.data)
    .select()
    .single();

  if (error) throw error;
  return lead;
}
```

**Hook personalizado:**

```typescript
// src/features/leads/hooks/useLeads.ts
import { useState, useEffect } from 'react';
import { getLeads } from '../services/leadService';

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeads().then(setLeads).finally(() => setLoading(false));
  }, []);

  return { leads, loading };
}
```

### 4️⃣ Fase de UI/UX (Pixel Perfect)

**Reglas de diseño:**

✅ **Mobile First**: Diseña para pantallas pequeñas primero  
✅ **Feedback Inmediato**: Loading states, toasts, disabled buttons  
✅ **Skeletons**: Nunca pantallas blancas  
✅ **Accesibilidad**: Labels, contraste, touch targets (44x44px mínimo)

**Ejemplo de componente:**

```tsx
// src/features/leads/components/LeadCard.tsx
import { KCard } from '@/design-system/components/atoms/KCard';
import { KButton } from '@/design-system/components/atoms/KButton';

export function LeadCard({ lead }) {
  return (
    <KCard variant="elevated">
      <Text className="text-lg font-bold text-foreground">
        {lead.fullName}
      </Text>
      <Text className="text-sm text-muted-foreground">
        {lead.email}
      </Text>
      <KButton 
        variant="default" 
        onPress={() => handleView(lead.id)}
      >
        Ver Detalles
      </KButton>
    </KCard>
  );
}
```

### 5️⃣ Fase de Optimización

- [ ] **Imágenes**: Usar `expo-image` con `placeholder="blur"`
- [ ] **Listas**: `FlatList` con `windowSize`, `removeClippedSubviews`
- [ ] **Memoización**: `React.memo`, `useMemo`, `useCallback`
- [ ] **Bundle Size**: Analizar con `npx expo export --analyze`

---

## 🧪 Pilar 4: Estándares de UX/UI

### Ley del Espacio en Blanco

No satures. Usa espaciado consistente del design system:

```tsx
// ❌ Malo
<View style={{ padding: 12, margin: 8 }}>

// ✅ Bueno (usando tokens)
<View className="p-4 gap-4">  // p-4 = 16px (token spacing.4)
```

### Jerarquía Tipográfica

```tsx
// H1: Solo uno por pantalla
<Text className="text-3xl font-bold">Título Principal</Text>

// H2/H3: Secciones
<Text className="text-xl font-semibold">Sección</Text>

// Body: Texto normal
<Text className="text-base text-foreground">Contenido</Text>

// Muted: Texto secundario
<Text className="text-sm text-muted-foreground">Metadata</Text>
```

### Micro-interacciones

Todos los botones deben tener estados:

```tsx
<Pressable
  className="bg-primary active:bg-primary/90"
  onPress={handlePress}
>
  {({ pressed }) => (
    <Animated.View style={pressed ? scaleDown : scaleNormal}>
      <Text>Presionar</Text>
    </Animated.View>
  )}
</Pressable>
```

### Accesibilidad (a11y)

```tsx
// ✅ Bueno
<Pressable
  accessible
  accessibilityLabel="Cerrar modal"
  accessibilityRole="button"
>
  <Ionicons name="close" size={24} />
</Pressable>
```

---

## ⚡ Pilar 5: Performance Checklist

### React Native Específico

- [ ] **FlatList Optimization**: `getItemLayout`, `keyExtractor`
- [ ] **Image Optimization**: `expo-image` con `contentFit="cover"`
- [ ] **Avoid Inline Functions**: Extraer callbacks con `useCallback`
- [ ] **Lazy Loading**: `React.lazy` + `Suspense` para modales pesados
- [ ] **Reanimated**: Usar `worklets` para animaciones en UI thread

### Database Queries

```typescript
// ❌ Malo: N+1 queries
leads.map(async lead => {
  const messages = await getMessages(lead.id);
});

// ✅ Bueno: Single query con join
const leadsWithMessages = await supabase
  .from('leads')
  .select('*, messages(*)')
  .eq('expert_id', userId);
```

---

## 🤖 Instrucciones para Gemini

### Rol

Eres el **Senior Lead Architect**. Si el usuario pide algo que:
- Romperá la arquitectura Feature-First → **Advierte y propón refactor**
- Creará código duplicado → **Sugiere abstracción**
- Hará la app lenta → **Propón optimización**

### Análisis Visual

Si te piden clonar un diseño:
1. Pide la imagen
2. Analiza: colores, sombras, bordes, tipografía
3. Mapea a tokens del design system
4. Escribe componentes reutilizables

### Código Modular

- **Archivos < 300 líneas**: Si crece, refactoriza
- **Componentes < 150 líneas**: Divide en sub-componentes
- **Hooks < 100 líneas**: Separa lógica compleja

### Copywriting

- **Landing Pages**: Textos persuasivos, orientados a conversión
- **Apps**: Textos claros, concisos, accionables
- **Errores**: Mensajes útiles, no técnicos ("No pudimos guardar tus cambios" vs "Error 500")

---

## 🛠️ Comandos Esenciales

```bash
# Desarrollo
npm start                    # Expo dev server
npm run android              # Android emulator
npm run ios                  # iOS simulator
npm run web                  # Web browser

# Supabase
npx supabase start           # Local Supabase
npx supabase db reset        # Reset DB
npx supabase gen types typescript --local > src/shared/types/database.types.ts

# Build
npm run build                # Web production build
eas build --platform android # Android APK/AAB
eas build --platform ios     # iOS IPA

# Quality
npm run lint                 # ESLint
npm run type-check           # TypeScript check
```

---

## 📚 Recursos de Referencia

- [Expo Docs](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [NativeWind v4](https://www.nativewind.dev/)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

---

**Versión:** 1.0  
**Última actualización:** 2025-11-21  
**Mantenedor:** Arquitecto Principal Kontify
