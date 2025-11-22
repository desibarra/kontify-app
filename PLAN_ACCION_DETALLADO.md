# 📅 PLAN DE ACCIÓN - ROADMAP COMPLETO

**Duración Total:** 3-4 semanas  
**Objetivo:** Resolución de 39 issues + optimizaciones  

---

## ⏱️ FASE 0: CRÍTICOS (HOY - 4 HORAS)

**Objetivo:** Evitar crashes y vulnerabilidades de seguridad

### 0.1 - FIX ActivityIndicator (5 min)

```bash
# Archivo: app/experts-dashboard.tsx
# Línea 1-10: Reemplazar imports
# ANTES:
import { View, ScrollView, Text } from 'react-native';

# DESPUÉS:
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
```

**Verificación:**
```bash
npm run lint app/experts-dashboard.tsx
# No debe haber error: 'ActivityIndicator' is not defined
```

---

### 0.2 - FIX React Import (5 min)

```bash
# Archivo: app/experts-leads.tsx
# Línea 1: Agregar React formal import

# ANTES:
import { useEffect } from 'react';

# DESPUÉS:
import React, { useEffect } from 'react';
```

---

### 0.3 - FIX OpenAI API Validation (15 min)

**Archivo a crear:** `src/lib/openai-init.ts`

```typescript
// ✅ NUEVO ARCHIVO
import { OpenAI } from 'openai';

export function initializeOpenAI() {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    const errorMsg = '[KONTIFY] ERROR: EXPO_PUBLIC_OPENAI_API_KEY not set in environment';
    console.error(errorMsg);
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ AI features will not work. Set EXPO_PUBLIC_OPENAI_API_KEY in .env');
      return null;  // Return null, components handle gracefully
    } else {
      throw new Error(errorMsg);
    }
  }
  
  if (apiKey === 'placeholder-key-for-build') {
    throw new Error('[KONTIFY] Placeholder API key detected in production');
  }
  
  return new OpenAI({ apiKey });
}

export const openai = initializeOpenAI();
```

**Luego en `src/lib/openai.ts`:**

```typescript
// ✅ REEMPLAZAR LÍNEA 16
// ANTES:
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "placeholder-key-for-build";
const openai = new OpenAI({ apiKey });

// DESPUÉS:
import { openai } from './openai-init';
// Use openai directly (now validated)
```

**Verificar en `.env.local`:**
```bash
# .env.local debe tener:
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-XXXXXxxxxx
# (No debe estar "placeholder-key-for-build")
```

---

### 0.4 - FIX RLS Policy (10 min)

**Ejecutar en Supabase SQL Editor:**

```sql
-- 1. Primero: Verificar política actual
SELECT policy_name, qual
FROM pg_policies
WHERE tablename = 'profiles';

-- 2. Remover política permisiva
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- 3. Agregar política restrictiva
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- 4. Agregar policy para ver perfiles de expertos activos (datos públicos)
CREATE POLICY "Anyone can view active expert profiles"
  ON profiles
  FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'expert'
    AND (SELECT status FROM experts WHERE id = auth.uid() LIMIT 1) = 'active'
  );

-- 5. Verificar que las policies existen
SELECT policy_name, qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policy_name;
```

**Verificación (debe fallar con permiso denegado):**
```sql
-- Test: Con usuario no autenticado
SELECT id, email FROM profiles;  -- ❌ ERROR: new row violates row-level security policy
```

---

### 0.5 - FIX Fake Payment Data (1-2 horas)

**Archivo:** `src/services/expertApplicationService.ts`

**Paso 1:** Remover datos mock (líneas 167-280)

```typescript
// ❌ ELIMINAR ESTO:
const leads = [
  {
    id: '1',
    title: 'Website Development Project',
    // ... todos los datos mock
  }
];
```

**Paso 2:** Crear funciones que llamen Supabase

```typescript
// ✅ AGREGAR:
import { supabaseClient } from '@/lib/supabase';

export async function getExpertLeads(expertId: string) {
  const { data, error } = await supabaseClient
    .from('leads')
    .select('*')
    .eq('assigned_expert_id', expertId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getExpertMetrics(expertId: string) {
  const leads = await getExpertLeads(expertId);
  
  return {
    totalLeads: leads.length,
    activeLeads: leads.filter(l => l.status === 'active').length,
    completedLeads: leads.filter(l => l.status === 'completed').length,
    totalEarnings: leads
      .filter(l => l.status === 'completed')
      .reduce((sum, l) => sum + (l.amount || 0), 0)
  };
}

export function generateDynamicInsights(metrics: any) {
  const insights = [];
  
  if (metrics.totalLeads === 0) {
    insights.push('Aún no tienes leads. Actualiza tu perfil para empezar.');
  } else if (metrics.activeLeads === 0) {
    insights.push('No tienes leads activos en este momento.');
  }
  
  const completionRate = metrics.totalLeads > 0 
    ? (metrics.completedLeads / metrics.totalLeads) * 100 
    : 0;
  
  if (completionRate < 50 && metrics.totalLeads > 3) {
    insights.push(`Tu tasa de completación es ${completionRate.toFixed(0)}%. Intenta mejorarla.`);
  }
  
  return insights;
}
```

**Paso 3:** Usar en componente

```typescript
// En app/experts-dashboard.tsx
const [leads, setLeads] = useState([]);
const [metrics, setMetrics] = useState(null);

useEffect(() => {
  if (user?.id) {
    (async () => {
      const leadsData = await getExpertLeads(user.id);
      const metricsData = await getExpertMetrics(user.id);
      
      setLeads(leadsData);
      setMetrics(metricsData);
    })();
  }
}, [user?.id]);
```

**Verificación:**
```bash
# Dashboard debe mostrar datos reales, no mock
# Si hay leads en Supabase, deben aparecer
```

---

### 0.6 - FIX Stripe Checkout (DIFERIR A FASE 1)

**Razón:** Requiere credenciales Stripe que necesitas crear primero.

**Para completar HOY - Preparación:**
```bash
# 1. Crear cuenta en https://stripe.com
# 2. Obtener STRIPE_PUBLIC_KEY y STRIPE_SECRET_KEY
# 3. Guardar en .env.local:
STRIPE_PUBLIC_KEY=pk_test_XXXXX
STRIPE_SECRET_KEY=sk_test_XXXXX

# 4. Instalar dependencias:
npm install @stripe/stripe-react-native @stripe/stripe-js
```

**Implementación:** Ver FASE 1, ISSUE #6

---

## ✅ FIN DE FASE 0

**Checklist de completación:**
- [ ] ActivityIndicator import agregado
- [ ] React import formal en experts-leads.tsx  
- [ ] OpenAI validation implementado
- [ ] RLS Policy actualizada en Supabase
- [ ] Datos mock reemplazados con queries Supabase
- [ ] Stripe credenciales obtenidas

**Tiempo total:** ~4 horas  
**Resultado:** App funcional, sin crashes críticos, segura

**Comando para verificar fixes:**
```bash
npm run lint
npm run type-check
npm run build:web  # Prueba build
```

---

## 🟠 FASE 1: ALTOS (SEMANA 1 - 8 HORAS)

### 1.1 - Remover contextos duplicados (20 min)

**Archivo:** `app/(tabs)/_layout.tsx`

```typescript
// ❌ ANTES - Contextos duplicados
import { AuthProvider } from '@/contexts/AuthContext';
import { ExpertsProvider } from '@/contexts/ExpertsContext';

export default function TabsLayout() {
  return (
    <AuthProvider>
      <ExpertsProvider>
        <Tabs>
          {/* ... */}
        </Tabs>
      </ExpertsProvider>
    </AuthProvider>
  );
}

// ✅ DESPUÉS - Solo Tabs, contextos en root
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0066CC',
      }}
    >
      <Tabs.Screen
        name=\"index\"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name=\"home\" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name=\"ai-chat\"
        options={{
          title: 'Chat IA',
          tabBarIcon: ({ color }) => <Ionicons name=\"chatbox\" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name=\"profile\"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name=\"person\" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

---

### 1.2 - Downgrade React a 18 (30 min)

```bash
npm uninstall react react-dom
npm install react@18.3.0 react-dom@18.3.0
npm install
npm start -- --clear
```

**Verificar:**
```bash
npm list react
# react@18.3.0
```

---

### 1.3 - Implement Stripe Integration (2 horas)

**Crear archivo:** `api/create-payment-intent.ts`

```typescript
import { Stripe } from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, amount, currency } = body;

    // Validate input
    if (!planId || !amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        planId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Actualizar checkout component:** `app/experts-checkout.tsx`

```typescript
import { useStripe } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';

export function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const processPayment = async () => {
    setLoading(true);
    try {
      // 1. Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: selectedPlan.price,
          currency: 'USD',
        }),
      });

      const { clientSecret } = await response.json();

      // 2. Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Kontify',
        returnURL: 'kontify://payment-return',
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        setLoading(false);
        return;
      }

      // 3. Present payment sheet
      const { error: paymentError, paymentIntent } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert('Payment failed', paymentError.message);
      } else if (paymentIntent?.status === 'succeeded') {
        // Save to Supabase
        await supabaseClient.from('expert_subscriptions').insert({
          expert_id: user?.id,
          plan_id: selectedPlan.id,
          stripe_intent_id: paymentIntent.id,
          status: 'active',
          paid_at: new Date(),
        });

        Alert.alert('Success', 'Payment processed successfully!');
        // Navigate to dashboard
      }
    } catch (error) {
      Alert.alert('Error', 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      title={loading ? 'Processing...' : 'Pay Now'}
      onPress={processPayment}
      disabled={loading}
    />
  );
}
```

---

### 1.4 - Fix useAuth Provider Check (10 min)

**Archivo:** `src/contexts/AuthContext.tsx`

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Wrap your component tree with <AuthProvider> in app/_layout.tsx'
    );
  }
  
  return context;
};
```

---

### 1.5 - Implement Real-time Subscriptions (1 hora)

**Crear:** `src/hooks/useRealTimeMessages-v2.ts`

```typescript
import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase';

export function useRealTimeMessages(chatId: string) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;

    setLoading(true);

    // Fetch initial messages
    supabaseClient
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages(data || []);
        setLoading(false);
      });

    // Subscribe to real-time updates
    const subscription = supabaseClient
      .channel(`messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m))
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  return { messages, loading };
}
```

**Reemplazar en componentes que usan `useRealTimeMessages`:**

```typescript
// ❌ ANTES
const { messages } = useRealTimeMessages(chatId);

// ✅ DESPUÉS
const { messages, loading } = useRealTimeMessages(chatId);

if (loading) return <Loading />;
return <MessageList messages={messages} />;
```

---

## 🟡 FASE 2: MEDIOS (SEMANA 2 - 12 HORAS)

**Issues a resolver:**
- Paginación de leads (ISSUE #10)
- Persist expert status (ISSUE #11)
- Sanitization en API (ISSUE #13)
- Protected routes (ISSUE #18)
- AI Chat historia (ISSUE #16)
- Memory leak cleanup (ISSUE #15)

## 🟢 FASE 3: BAJOS + OPTIMIZACIÓN (SEMANA 3 - 6 HORAS)

**Issues a resolver:**
- Responsive gráficos
- Validaciones menos estrictas
- i18n para dates
- Performance monitoring

---

## 📊 TIMELINE VISUAL

```
SEMANA 1:      Críticos + Altos (12 horas)
├─ Lunes:      Fase 0 (4 horas) - Críticos
├─ Martes:     Fase 1.1-1.3 (4 horas) - Altos
└─ Viernes:    Fase 1.4-1.5 (4 horas) - Integración

SEMANA 2:      Medios (12 horas)
├─ Lunes-Miércoles: Paginación, persist, sanitization
└─ Jueves-Viernes:  Protected routes, historia

SEMANA 3:      Bajos + Optimización (6 horas)
├─ Lunes-Miércoles: Performance
└─ Jueves-Viernes:  Testing y QA

SEMANA 4:      Reserve de tiempo (8 horas)
└─ Debugging, testing, production readiness
```

---

## ✅ VALIDACIÓN DE CADA FASE

### Después de Fase 0:
```bash
✓ npm run lint -- no errors
✓ npm run type-check -- no errors
✓ npm start -- app loads without crashes
✓ Supabase queries retornan datos reales
```

### Después de Fase 1:
```bash
✓ npm run build:web -- success
✓ Contextos solo en root
✓ Stripe payment test exitoso
✓ Real-time messages trabajan
```

### Después de Fase 2:
```bash
✓ Leads paginan correctamente
✓ Experto status persiste
✓ API inputs sanitizados
✓ Routes protegidas por rol
```

### Después de Fase 3:
```bash
✓ Performance monitoring activo
✓ Lighthouse score > 80
✓ No memory leaks
✓ Ready para producción
```

---

## 🚀 PRÓXIMO PASO

Ejecutar FASE 0 AHORA:
1. Fix imports
2. Fix OpenAI validation  
3. Update RLS policies
4. Replace mock data with real Supabase queries

**Tiempo estimado:** 4 horas  
**Resultado:** App estable y segura
