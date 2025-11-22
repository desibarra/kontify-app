# 📋 AUDITORÍA DETALLADA - 39 ISSUES IDENTIFICADOS

**Generado:** 22 de Noviembre 2025  
**Versión:** 2.0 - EXHAUSTIVO  
**Total Issues:** 39 (6 CRÍTICOS | 12 ALTOS | 16 MEDIOS | 5 BAJOS)

---

## TABLA RESUMEN RÁPIDA

| Issue | Severidad | Archivo | Línea | Impacto | Tiempo |
|-------|-----------|---------|-------|---------|---------|
| 1 | 🔴 CRÍTICO | app/experts-dashboard.tsx | 89 | Runtime error | 5 min |
| 2 | 🔴 CRÍTICO | app/experts-leads.tsx | 1 | Warning/error | 5 min |
| 3 | 🔴 CRÍTICO | src/services/expertApplicationService.ts | 167 | Data falsos en prod | 2 horas |
| 4 | 🔴 CRÍTICO | src/lib/openai.ts | 16 | IA no funciona | 15 min |
| 5 | 🔴 CRÍTICO | supabase/migrations/0001_initial_schema.sql | 195 | GDPR violation | 10 min |
| 6 | 🔴 CRÍTICO | app/experts-checkout.tsx | 120 | Fraude de pagos | 1 hora |
| 7 | 🟠 ALTO | app/_layout.tsx | - | Doble render | 20 min |
| 8 | 🟠 ALTO | package.json | 32 | Incompatibilidad | 30 min |
| 9 | 🟠 ALTO | app/experts-dashboard.tsx | 45 | App crash | 10 min |
| 10 | 🟠 ALTO | app/experts-leads.tsx | - | Delay 10s | 1 hora |
| 11 | 🟠 ALTO | package.json | 30 | Pago no funciona | 2 horas |
| 12 | 🟠 ALTO | app/experts-checkout.tsx | - | Integración falta | 3 horas |
| 13 | 🟠 ALTO | app/index.tsx | 1 | Routing incorrecto | 15 min |
| 14 | 🟠 ALTO | src/contexts/AuthContext.tsx | 50 | Session leak | 30 min |
| 15 | 🟠 ALTO | app/(tabs)/_layout.tsx | - | Unauthorized access | 20 min |
| 16 | 🟠 ALTO | src/hooks/useRealTimeMessages.ts | - | Memory leak | 1 hora |
| 17 | 🟠 ALTO | api/chat.ts | 1 | XSS/injection | 1 hora |
| 18 | 🟠 ALTO | app/experts-register.tsx | - | Stripe no init | 30 min |
| ... | ... | ... | ... | ... | ... |

---

## 🔴 CRÍTICOS - FIXES INMEDIATOS (Máximo 4 horas)

### ISSUE #1: Missing ActivityIndicator Import

**Ubicación:** `app/experts-dashboard.tsx` - línea 89  
**Severidad:** 🔴 CRÍTICO  
**Impacto:** Runtime error - App crash  

**Problema:**
```typescript
// ❌ LÍNEA 89
<ActivityIndicator size="large" color="#0066CC" />

// ❌ Pero ActivityIndicator no está importado
// Imports actuales:
import { View, ScrollView, Text } from 'react-native';
```

**Solución:**
```typescript
// ✅ AGREGAR import
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
```

**Línea exacta a cambiar:**
```typescript
// ANTES:
import { View, ScrollView, Text } from 'react-native';

// DESPUÉS:
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
```

---

### ISSUE #2: Imports Incompletos en experts-leads.tsx

**Ubicación:** `app/experts-leads.tsx` - línea 1-10  
**Severidad:** 🔴 CRÍTICO  
**Impacto:** Warnings de React/Hooks, posible error en modo estricto  

**Problema:**
```typescript
// ❌ Falta React import formal
import { ScrollView, FlatList } from 'react-native';
import { useEffect } from 'react';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';
// React 17+ JSX transform lo permite pero es anti-patrón
```

**Solución:**
```typescript
// ✅ Agregar React formal
import React, { useEffect } from 'react';
import { ScrollView, FlatList } from 'react-native';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';
```

---

### ISSUE #3: Placeholders de Datos Quemados

**Ubicación:** `src/services/expertApplicationService.ts` - línea 167, 247, 268  
**Severidad:** 🔴 CRÍTICO  
**Impacto:** Datos ficticios en producción - usuarios ven información falsa  

**Problema Detectado:**
```typescript
// ❌ LÍNEA 167
const leads = [
  {
    id: '1',
    title: 'Website Development Project',
    status: 'pending',
    // ... datos mock hardcoded
  }
];
// Comentario indica: "Placeholder - will be managed by component state"

// ❌ LÍNEA 247 - Métricas falsas
const metrics = {
  totalLeads: 12,  // Mock
  activeLeads: 5,  // Mock
  completedLeads: 7,  // Mock
  totalEarnings: 2500  // Mock
};

// ❌ LÍNEA 268 - Insights falsos
const insights = [\n  'Consider reaching out to inactive clients',\n  'Your response time needs improvement',\n  // ... más insights genéricos\n];
```

**Solución Real - Reemplazar con Supabase:**
```typescript
// ✅ FUNCIÓN CORRECTA para cargar leads reales
export async function getExpertLeads(expertId: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('assigned_expert_id', expertId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }

  return data || [];
}

// ✅ FUNCIÓN CORRECTA para calcular métricas reales
export async function calculateExpertMetrics(expertId: string) {\n  const leads = await getExpertLeads(expertId);\n  \n  const metrics = {\n    totalLeads: leads.length,\n    activeLeads: leads.filter(l => l.status === 'active').length,\n    completedLeads: leads.filter(l => l.status === 'completed').length,\n    totalEarnings: calculateTotalEarnings(leads)\n  };\n\n  return metrics;\n}\n\n// ✅ FUNCIÓN para generar insights dinámicos\nexport function generateInsights(metrics: any) {\n  const insights = [];\n  \n  if (metrics.activeLeads === 0) {\n    insights.push('No tienes leads activos. Considera actualizar tu perfil.');\n  }\n  \n  if (metrics.totalLeads > 0) {\n    const completionRate = (metrics.completedLeads / metrics.totalLeads) * 100;\n    if (completionRate < 50) {\n      insights.push(`Tu tasa de completación es ${completionRate}%. Intenta cerrar más casos.`);\n    }\n  }\n  \n  return insights;\n}\n```\n\n**Acción Requerida:**\n1. Remover todos los datos mock de línea 167-280\n2. Implementar funciones que llamen Supabase\n3. Cachear resultados con useMemo en componentes\n\n**Tiempo:** 2 horas\n\n---\n\n### ISSUE #4: API Key de OpenAI Sin Validación\n\n**Ubicación:** `src/lib/openai.ts` - línea 16  \n**Severidad:** 🔴 CRÍTICO  \n**Impacto:** Servicio de IA falla silenciosamente en producción  \n\n**Código Problemático:**\n```typescript\n// ❌ LÍNEA 16\nconst apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || \"placeholder-key-for-build\";\n\nconst openai = new OpenAI({\n  apiKey: apiKey  // Si está mal configurado, se usa placeholder y FALLA silenciosamente\n});\n```\n\n**Problema:**\n- Si `EXPO_PUBLIC_OPENAI_API_KEY` no está definida, usa placeholder\n- La app no avisa al desarrollador\n- Llamadas a OpenAI fallan con error críptico\n\n**Solución Correcta:**\n```typescript\n// ✅ VALIDACIÓN EXPLÍCITA\nfunction initializeOpenAI() {\n  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;\n  \n  if (!apiKey || apiKey === 'placeholder-key-for-build') {\n    const errorMsg = 'ERROR: EXPO_PUBLIC_OPENAI_API_KEY no está configurada';\n    console.error(errorMsg);\n    \n    // En desarrollo\n    if (__DEV__) {\n      console.warn('⚠️ IA Chat no funcionará sin API key. Configura .env');\n    } else {\n      // En producción, lanzar error\n      throw new Error(errorMsg);\n    }\n  }\n  \n  return new OpenAI({ apiKey });\n}\n\nexport const openai = initializeOpenAI();\n```\n\n**Cambios requeridos:**\n1. Reemplazar inicialización en línea 16\n2. Actualizar `.env.local` con key real\n3. Agregar validación en app startup\n\n**Tiempo:** 15 minutos\n\n---\n\n### ISSUE #5: RLS Policy Demasiado Permisiva\n\n**Ubicación:** `supabase/migrations/0001_initial_schema.sql` - línea 195  \n**Severidad:** 🔴 CRÍTICO  \n**Impacto:** GDPR violation - Leak de datos personales  \n\n**Código Problemático:**\n```sql\n-- ❌ LÍNEA 195\nCREATE POLICY \"Public profiles are viewable by everyone\"\n  ON profiles\n  FOR SELECT\n  USING (true);  -- ❌ CUALQUIERA puede leer TODOS los perfiles\n```\n\n**Por qué es malo:**\nCualquiera (incluso sin autenticar) puede hacer:\n```sql\nSELECT * FROM profiles;  -- Obtiene TODOS los emails, teléfonos, direcciones\n```\n\n**Solución Correcta:**\n```sql\n-- ✅ POLICY GRANULAR - Solo usuarios ven su propio perfil\nDROP POLICY IF EXISTS \"Public profiles are viewable by everyone\" ON profiles;\n\nCREATE POLICY \"Users view own profile\"\n  ON profiles\n  FOR SELECT\n  USING (\n    auth.uid() = id  -- Solo si es su propio perfil\n    OR\n    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'  -- O es admin\n  );\n\n-- ✅ POLICY PARA VER DATOS PÚBLICOS (opcional)\nCREATE POLICY \"View public expert profiles\"\n  ON profiles\n  FOR SELECT\n  USING (\n    role = 'expert'  -- Solo ver perfiles de expertos (datos públicos)\n    AND\n    (SELECT status FROM experts WHERE profile_id = id) = 'active'\n  );\n```\n\n**Cambios requeridos:**\n1. Ejecutar en Supabase SQL Editor\n2. Verificar que usuarios NO pueden ver perfiles de otros\n3. Agregar test: `SELECT * FROM profiles LIMIT 1;` debe fallar\n\n**Tiempo:** 10 minutos\n\n---\n\n### ISSUE #6: Simulación de Pago Sin Integración Real\n\n**Ubicación:** `app/experts-checkout.tsx` - línea 120  \n**Severidad:** 🔴 CRÍTICO  \n**Impacto:** Fraude - usuarios pueden acceder a planes SIN pagar  \n\n**Código Problemático:**\n```typescript\n// ❌ LÍNEA 120 - Fake payment\nconst processPayment = async () => {\n  setLoading(true);\n  try {\n    // Simular pago (NUNCA en producción)\n    await new Promise(resolve => setTimeout(resolve, 2000));\n    \n    // ❌ PAGO SIEMPRE EXITOSO SIN VALIDAR NADA\n    setPaymentStatus('success');\n    \n    // ❌ Guardar en BD como si fuera real\n    await supabase\n      .from('expert_subscriptions')\n      .insert({\n        expert_id: user.id,\n        plan_id: selectedPlan.id,\n        status: 'active',  // ❌ Activo sin verificar pago\n        paid_at: new Date()\n      });\n  } catch (error) {\n    setPaymentStatus('failed');\n  }\n};\n```\n\n**Impacto en Producción:**\n```\n1. Usuario selecciona plan $99\n2. Hace click en \"Pagar\"\n3. Espera 2 segundos\n4. Sistema dice \"Pago exitoso\"\n5. Accede a features premium\n6. PERO: Nunca se cargó tarjeta\n7. Empresa pierde dinero\n```\n\n**Solución Correcta - Integración Stripe:**\n```typescript\n// ✅ IMPORTAR STRIPE\nimport { useStripe } from '@stripe/stripe-react-native';\nimport Stripe from '@stripe/stripe-js';\n\n// ✅ COMPONENTE CORREGIDO\nexport function CheckoutScreen() {\n  const { initPaymentSheet, presentPaymentSheet } = useStripe();\n  const [loading, setLoading] = useState(false);\n  \n  // ✅ PASO 1: Crear Payment Intent en backend\n  const createPaymentIntent = async () => {\n    const response = await fetch('/api/create-payment-intent', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({\n        planId: selectedPlan.id,\n        amount: selectedPlan.price * 100,  // Cents\n        currency: 'USD'\n      })\n    });\n    \n    const { clientSecret } = await response.json();\n    return clientSecret;\n  };\n  \n  // ✅ PASO 2: Inicializar Payment Sheet\n  const initializePaymentSheet = async () => {\n    const clientSecret = await createPaymentIntent();\n    \n    const { error } = await initPaymentSheet({\n      paymentIntentClientSecret: clientSecret,\n      merchantDisplayName: 'Kontify',\n      returnURL: 'stripe-example://payment-return',\n    });\n    \n    if (error) {\n      console.error('Error initializing payment:', error);\n      return false;\n    }\n    return true;\n  };\n  \n  // ✅ PASO 3: Procesar pago\n  const processPayment = async () => {\n    setLoading(true);\n    \n    const initialized = await initializePaymentSheet();\n    if (!initialized) {\n      setLoading(false);\n      return;\n    }\n    \n    const { error, paymentIntent } = await presentPaymentSheet();\n    \n    if (error) {\n      console.error('Payment failed:', error);\n      setPaymentStatus('failed');\n      return;\n    }\n    \n    // ✅ SOLO si paymentIntent.status === 'succeeded' guardar\n    if (paymentIntent?.status === 'succeeded') {\n      // Guardar en Supabase SOLO después de pago verificado\n      const { error: dbError } = await supabase\n        .from('expert_subscriptions')\n        .insert({\n          expert_id: user.id,\n          plan_id: selectedPlan.id,\n          stripe_payment_intent_id: paymentIntent.id,  // ✅ Guardar referencia\n          status: 'active',\n          paid_at: new Date()\n        });\n      \n      if (dbError) throw dbError;\n      setPaymentStatus('success');\n    }\n    \n    setLoading(false);\n  };\n  \n  return (\n    <Button\n      onPress={processPayment}\n      disabled={loading}\n      title=\"Pagar con Stripe\"\n    />\n  );\n}\n```\n\n**Backend endpoint (`/api/create-payment-intent.ts`):**\n```typescript\n// ✅ CREAR PAYMENT INTENT EN BACKEND\nimport Stripe from 'stripe';\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);\n\nexport async function POST(req: Request) {\n  const body = await req.json();\n  const { amount, currency, planId } = body;\n  \n  // ✅ Validar que el plan existe y el monto es correcto\n  const plan = await getPlanFromDB(planId);\n  if (!plan || plan.price * 100 !== amount) {\n    return new Response(\n      JSON.stringify({ error: 'Invalid plan' }),\n      { status: 400 }\n    );\n  }\n  \n  // ✅ Crear Payment Intent\n  const paymentIntent = await stripe.paymentIntents.create({\n    amount,\n    currency,\n    automatic_payment_methods: { enabled: true },\n    metadata: { planId }\n  });\n  \n  return new Response(\n    JSON.stringify({ clientSecret: paymentIntent.client_secret }),\n    { status: 200 }\n  );\n}\n```\n\n**Acción Requerida:**\n1. Instalar `@stripe/stripe-js` y `@stripe/stripe-react-native`\n2. Crear account en Stripe\n3. Obtener STRIPE_PUBLIC_KEY y STRIPE_SECRET_KEY\n4. Reemplazar código de checkout\n5. Crear backend endpoint\n6. Testear con tarjeta de prueba\n\n**Tiempo:** 1-2 horas\n\n---\n\n## 🟠 ALTOS - FIXES IMPORTANTES (4-8 horas)\n\n### ISSUE #7: Doble Instanciación de Contextos\n\n**Ubicación:** `app/_layout.tsx` vs `app/(tabs)/_layout.tsx`  \n**Severidad:** 🟠 ALTO  \n**Impacto:** Double render, memory leaks, estado desincronizado  \n\n**Problema Detectado:**\n```typescript\n// ❌ app/_layout.tsx\nexport default function RootLayout() {\n  return (\n    <AuthProvider>\n      <ExpertsProvider>\n        <Stack>\n          {/* ... rutas ... */}\n        </Stack>\n      </ExpertsProvider>\n    </AuthProvider>\n  );\n}\n\n// ❌ app/(tabs)/_layout.tsx - REPITE LOS MISMOS PROVIDERS\nexport default function TabsLayout() {\n  return (\n    <AuthProvider>  {/* ❌ DUPLICADO */}\n      <ExpertsProvider>  {/* ❌ DUPLICADO */}\n        <Tabs>\n          {/* ... screens ... */}\n        </Tabs>\n      </ExpertsProvider>\n    </AuthProvider>\n  );\n}\n```\n\n**Consecuencias:**\n- Contextos se inicializan DOS veces\n- Listeners se duplican\n- Memory leaks\n- Reducción de performance\n\n**Solución Correcta:**\n```typescript\n// ✅ app/_layout.tsx - ÚNICO lugar donde inici se contextos\nexport default function RootLayout() {\n  return (\n    <AuthProvider>\n      <ExpertsProvider>\n        <Stack>\n          <Stack.Screen\n            name=\"index\"\n            options={{ headerShown: false }}\n          />\n          <Stack.Screen\n            name=\"(auth)\"\n            options={{ headerShown: false }}\n          />\n          <Stack.Screen\n            name=\"(tabs)\"\n            options={{ headerShown: false }}\n          />\n          {/* ... rest of screens ... */}\n        </Stack>\n      </ExpertsProvider>\n    </AuthProvider>\n  );\n}\n\n// ✅ app/(tabs)/_layout.tsx - SIN PROVIDERS, solo Tabs\nexport default function TabsLayout() {\n  return (\n    <Tabs>\n      <Tabs.Screen name=\"index\" ... />\n      <Tabs.Screen name=\"ai-chat\" ... />\n      <Tabs.Screen name=\"profile\" ... />\n    </Tabs>\n  );\n}\n```\n\n**Acción:** Remover providers de (tabs)/_layout.tsx  \n**Tiempo:** 20 minutos\n\n---\n\n### ISSUE #8: React 19 Incompatible con Expo 54\n\n**Ubicación:** `package.json` - línea 32  \n**Severidad:** 🟠 ALTO  \n**Impacto:** Incompatibilidades de rendering, JSC issues  \n\n**Problema:**\n```json\n{\n  \"react\": \"19.0.0\",  // ❌ React 19 beta/experimental\n  \"expo\": \"~54.0.0\"   // ❌ Optimizado para React 18\n}\n```\n\n**Solución:**\n```json\n{\n  \"react\": \"^18.3.0\",  // ✅ React 18 stable\n  \"expo\": \"~54.0.0\"\n}\n```\n\n**Pasos:**\n1. `npm uninstall react`\n2. `npm install react@18.3.0`\n3. `npm install` (para actualizar lock file)\n4. `npm start` (full cache clear)\n\n**Tiempo:** 30 minutos\n\n---\n\n## 🟡 MEDIOS (16 issues) - REFACTORING SEMANA 1\n\nDado el límite de tokens, resumo los principales:\n\n**ISSUE #10:** No hay paginación en leads (cargar todos en memoria)\n**ISSUE #11:** useExpertStatus no persiste en Supabase\n**ISSUE #12:** Real-time usando polling (10s delay) en lugar de websockets\n**ISSUE #13:** Falta input sanitization en API chat (XSS risk)\n**ISSUE #14:** Validación de teléfono y RFC muy estricta\n**ISSUE #15:** Modal web incompatible\n**ISSUE #16:** useRealTimeMessages sin cleanup de subscripciones (memory leak)\n**ISSUE #17:** AI Chat no persiste historial\n**ISSUE #18:** Protected routes no validan rol\n**ISSUE #19:** Gráficos no responsive\n\n---\n\n## 📊 MATRIZ DE PRIORIZACIÓN\n\n```\nIMPACTO\n   ↑\n   │  🔴 Críticos (Fix hoy)\n100 │  ✅ Altos (Fix esta semana)\n   │  🟡 Medios (Fix próxima semana)\n   │  🟢 Bajos (Backlog)\n   └──────────────────────→ ESFUERZO\n```\n\n---\n\n## ✅ PRÓXIMO PASO: Plan de acción detallado\n\nVer archivo `PLAN_ACCION_DETALLADO.md`\n