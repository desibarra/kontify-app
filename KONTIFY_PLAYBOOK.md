# 📘 KONTIFY PLAYBOOK: The Expo-Supabase-AI Stack

> **Manual de Lecciones Aprendidas y Stack Definitivo**  
> *Generado automáticamente tras la fase de estabilización de Kontify*  
> **Última actualización:** 2025-11-21

---

## 1. El Stack Ganador 🏆

### Frontend Framework
- **React Native 0.76.5** con **Expo SDK ~54.0.0**
- **Expo Router ~6.0.15** (navegación file-based)
- **TypeScript 5.3.3** (type safety)

### Backend & Database
- **Supabase ^2.50.0** (PostgreSQL + Auth + Real-time)
- **Supabase Auth** con RLS (Row Level Security)
- **Edge Functions** para lógica serverless

### AI Engine
- **OpenAI API ^6.9.1** (GPT-3.5-turbo-0125 / GPT-4)
- **Google Gemini API** (backup AI provider)
- **Streaming responses** para UX mejorado

### Deployment Platforms
- **Vercel** (Web deployment con SPA support)
- **EAS Build** (Mobile: iOS/Android)
- **Metro Bundler** para desarrollo local

### Core Dependencies
```json
{
  "expo": "~54.0.0",
  "react-native": "0.76.5",
  "@supabase/supabase-js": "^2.50.0",
  "openai": "^6.9.1",
  "expo-router": "~6.0.15",
  "react-native-url-polyfill": "^3.0.0"
}
```

---

## 2. Soluciones a Bugs Críticos (¡NO OLVIDAR!) 🚨

### A. Crash de Supabase en Web (`expo-secure-store`)

**Problema:**  
`expo-secure-store` no está disponible en la web y rompe la compilación con error:
```
Module not found: Can't resolve 'expo-secure-store'
```

**Causa Raíz:**  
Supabase usa `AsyncStorage` por defecto, pero en Expo necesitamos `expo-secure-store` para almacenamiento seguro en mobile. Sin embargo, este módulo no tiene implementación web.

**Solución (Platform-Specific Files):**

1. **Crear `src/lib/storage.ts`** (para nativo):
```typescript
import * as SecureStore from 'expo-secure-store';

export const storage = {
  getItem: async (key: string) => await SecureStore.getItemAsync(key),
  setItem: async (key: string, value: string) => 
    await SecureStore.setItemAsync(key, value),
  removeItem: async (key: string) => await SecureStore.deleteItemAsync(key),
};
```

2. **Crear `src/lib/storage.web.ts`** (para web):
```typescript
export const storage = {
  getItem: async (key: string) => localStorage.getItem(key),
  setItem: async (key: string, value: string) => 
    localStorage.setItem(key, value),
  removeItem: async (key: string) => localStorage.removeItem(key),
};
```

3. **Usar en Supabase client:**
```typescript
import { storage } from './storage'; // Metro elige .web.ts automáticamente

const supabase = createClient(url, key, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

**Resultado:** Metro Bundler automáticamente selecciona `.web.ts` en web y `.ts` en mobile.

---

### B. Alias de Rutas (`@/`) - "Unable to resolve module"

**Problema:**  
Imports como `import { useAuth } from '@/hooks/useAuth'` fallan con:
```
Error: Unable to resolve module @/hooks/useAuth
```

**Causa Raíz:**  
TypeScript reconoce `@/*` pero Metro Bundler (runtime) no sabe cómo resolverlo.

**Solución Completa (3 pasos):**

1. **`tsconfig.json`** (para TypeScript):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

2. **`babel.config.js`** (para Metro):
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
```

3. **Instalar dependencia:**
```bash
npm install --save-dev babel-plugin-module-resolver
```

**⚠️ CRÍTICO:** Siempre ejecutar tras cambiar configuración:
```bash
npx expo start --clear
```

**Validación:** Si sigues viendo errores, verifica:
- ✅ `babel.config.js` tiene `module-resolver` en `plugins`
- ✅ Ejecutaste `--clear` (limpiar caché es VITAL)
- ✅ Ruta física existe: `src/hooks/useAuth.ts`

---

### C. OpenAI en React Native - Errores de Dependencias

**Problema:**  
Al instalar `openai` con npm/yarn:
```
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Causa Raíz:**  
OpenAI SDK tiene dependencias que no coinciden con las versiones de React Native/Expo.

**Solución:**
```bash
npm install openai --legacy-peer-deps
```

**Configuración del Cliente:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // VITAL para React Native
});
```

**⚠️ Advertencia de Seguridad:**  
`dangerouslyAllowBrowser: true` expone la API key en el bundle. Para producción:
- Usar proxy backend (Next.js API routes / Supabase Edge Functions)
- O implementar rate limiting por usuario

**Llamada Correcta:**
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo-0125',
  messages: [{ role: 'user', content: 'Tu prompt' }],
  temperature: 0.7,
  response_format: { type: 'json_object' }, // Para JSON estructurado
});
```

---

### D. Polyfill Requerido: `react-native-url-polyfill`

**Problema:**  
Supabase falla con error:
```
TypeError: URL is not a constructor
```

**Solución:**
```bash
npm install react-native-url-polyfill --legacy-peer-deps
```

**Importar al inicio de `src/lib/supabase.ts`:**
```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
```

**Orden Importante:** El polyfill DEBE ir antes de cualquier import de Supabase.

---

### E. Variables de Entorno - Prefijo `EXPO_PUBLIC_`

**Problema:**  
Variables como `OPENAI_API_KEY` son `undefined` en runtime.

**Causa Raíz:**  
Expo solo expone variables con prefijo `EXPO_PUBLIC_` al cliente.

**Solución (`.env.local`):**
```env
# ❌ MAL (no accesible)
OPENAI_API_KEY=sk-proj-...

# ✅ BIEN (accesible en cliente)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...
EXPO_PUBLIC_SUPABASE_URL=https://...
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

**Acceso:**
```typescript
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
```

**⚠️ Seguridad:** Nunca commitear `.env.local` a Git (ya está en `.gitignore`).

---

### F. Formateo de `.env.local` - Espacios en Blanco

**Problema:**  
OpenAI devuelve error 401 aunque la API key es correcta.

**Causa Raíz:**  
Espacios o saltos de línea extra al final de la API key.

**Solución:**
```env
# ❌ MAL (espacio invisible al final)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-xxxx 

# ✅ BIEN (sin espacios ni líneas extra)
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-xxxx
EXPO_PUBLIC_SUPABASE_URL=https://...
```

**Validación:**
```typescript
// Agregar en src/lib/openai.ts
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim();
if (!apiKey || apiKey.length < 20) {
  throw new Error('Invalid OpenAI API Key');
}
```

---

### G. Build-Time vs Runtime: Error en Vercel Deploy (Supabase Validation)

**Problema:**  
`npx expo export --platform web` falla con:
```
Error: supabaseUrl is required.
at createClient (/vercel/path0/node_modules/@supabase/supabase-js/...)
```

**Causa Raíz:**  
Durante **build time** (generación estática), `process.env` está vacío porque Vercel inyecta variables solo en **runtime**. Sin embargo, Supabase valida internamente que la URL no esté vacía AL MOMENTO DE CREAR EL CLIENTE, por lo que simplemente usar strings vacíos (`""`) no funciona.

**Solución: Lazy Initialization con Proxy**

```typescript
// ❌ MAL - Intento 1 (Supabase valida inmediatamente)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// ^ FALLA: Supabase valida y lanza error en build time

// ❌ MAL - Intento 2 (Bloquea compilación)
if (!supabaseUrl) {
  throw new Error('Missing Supabase URL');
}
// ^ FALLA: Bloquea la exportación estática

// ✅ BIEN - Lazy Initialization (solo crea cliente cuando se USA)
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;
  
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
  
  // Validar SOLO en runtime (cuando se intenta usar)
  if (!url || !key) {
    throw new Error('Supabase credentials missing');
  }
  
  supabaseInstance = createClient(url, key, { /* config */ });
  return supabaseInstance;
}

// Proxy para interceptar accesos y crear cliente bajo demanda
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});
```

**Por qué Proxy es necesario:**
- **Build Time:** `supabase.from()` → NO se ejecuta (solo parsing) → No intenta crear cliente → ✅ Build exitoso
- **Runtime:** `supabase.from()` → Proxy intercepta → Llama `getSupabaseClient()` → Crea cliente con variables inyectadas → ✅ Funciona

**Archivos a modificar:**
- `src/lib/supabase.ts` (aplicar lazy initialization)
- `src/lib/openai.ts` (similar, pero OpenAI acepta strings vacíos)

**Flujo completo:**
1. **Build Time (Vercel):** `process.env` vacío → Código nunca ejecuta `getSupabaseClient()` → Genera HTML/JS estático ✅
2. **Runtime (Navegador):** Variables inyectadas por Vercel → Primera llamada a `supabase.from()` → Crea cliente con credenciales reales ✅

**⚠️ Crítico:** Configurar variables en **Vercel Dashboard → Settings → Environment Variables** para TODOS los entornos (Production, Preview, Development).

---

## 3. Guía de Despliegue (Vercel) 🚀

### Configuración Completa para SPA

#### A. `app.json` - Metadata Web

```json
{
  "expo": {
    "name": "Kontify",
    "slug": "kontify-app",
    "scheme": "kontify",
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router"
    ]
  },
  "web": {
    "name": "Kontify - Expertos Fiscales y Legales",
    "short_name": "Kontify",
    "description": "Conecta con abogados, contadores y expertos fiscales",
    "theme_color": "#92BF4E",
    "background_color": "#000000"
  }
}
```

#### B. `vercel.json` - SPA Rewrites

```json
{
  "buildCommand": "npx expo export --platform web",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Por qué es necesario:**  
Expo Router usa client-side routing. Sin rewrites, rutas como `/experts-dashboard` retornarían 404 al refrescar.

#### C. Scripts en `package.json`

```json
{
  "scripts": {
    "build:web": "npx expo export --platform web",
    "vercel-build": "npx expo export --platform web",
    "deploy": "vercel --prod",
    "deploy:preview": "vercel"
  }
}
```

#### D. Variables de Entorno en Vercel

**Vercel Dashboard → Settings → Environment Variables:**

```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-...
EXPO_PUBLIC_SUPABASE_URL=https://oyvrllrrpluixybihnew.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyC...
```

**⚠️ Importante:** Agregar para todos los entornos (Production, Preview, Development).

---

## 4. Comandos de Supervivencia 🛠️

### Cache & Troubleshooting

```bash
# 🔥 Limpiar TODA la caché (cuando nada funciona)
npx expo start --clear

# 🧹 Limpiar caché + reinstalar
rm -rf node_modules .expo package-lock.json
npm install --legacy-peer-deps

# 🔍 Ver qué puerto usa Metro
npx expo start --port 8081

# 🛑 Matar proceso en puerto específico (Windows PowerShell)
$process = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
if ($process) { Stop-Process -Id $process -Force }
```

### Dependency Management

```bash
# 📦 Instalar forzando resolución de dependencias
npm install [paquete] --legacy-peer-deps

# 🔄 Actualizar Expo SDK
npx expo install --fix

# 📋 Ver versiones instaladas
npx expo-doctor
```

### Build & Deploy

```bash
# 🌐 Build para Web
npm run build:web

# 🧪 Test local del build
npx serve dist -l 3000

# 🚀 Deploy a Vercel (preview)
npm run deploy:preview

# 🎯 Deploy a Producción
npm run deploy
```

### Debugging

```bash
# 🐛 Ver logs detallados
npx expo start --verbose

# 📱 Abrir en iOS Simulator
npx expo start --ios

# 🤖 Abrir en Android Emulator
npx expo start --android

# 🌍 Abrir en navegador
npx expo start --web
```

---

## 5. Arquitectura de Carpetas 📁

```
app_kontify/
├── app/                    # Rutas (Expo Router)
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home
│   ├── (tabs)/            # Tab navigation
│   └── experts-*.tsx      # Expert screens
├── src/
│   ├── components/        # UI components
│   ├── features/          # Feature modules
│   │   └── ai/           # AI search feature
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Clients (Supabase, OpenAI)
│   ├── services/         # Business logic
│   └── types/            # TypeScript types
├── assets/               # Images, fonts
├── .env.local           # Environment variables (NO commitear)
├── app.json             # Expo config
├── vercel.json          # Vercel config
└── package.json         # Dependencies
```

---

## 6. Checklist de Testing Pre-Deploy ✅

### Local Testing
- [ ] `npx expo start --clear` funciona sin errores
- [ ] Navegación entre pantallas funciona
- [ ] Supabase carga datos correctamente
- [ ] AI search devuelve resultados (OpenAI)
- [ ] Sistema de fallback activado al quitar API key

### Web Build
- [ ] `npm run build:web` completa sin errores
- [ ] Carpeta `dist/` generada correctamente
- [ ] `npx serve dist` funciona en localhost
- [ ] Rutas funcionan con refresh (gracias a rewrites)

### Vercel Deploy
- [ ] Variables de entorno configuradas en Dashboard
- [ ] Preview deploy exitoso (`npm run deploy:preview`)
- [ ] API calls funcionan en preview
- [ ] SEO metadata visible (view source)
- [ ] Production deploy exitoso

---

## 7. Lecciones Aprendidas 💡

### Performance
- **Lazy Loading:** Importar componentes pesados con `React.lazy()`
- **Memoization:** Usar `useMemo` para cálculos costosos
- **Supabase RLS:** Crucial para seguridad pero puede afectar performance

### UX
- **Loading States:** Siempre mostrar feedback visual (spinner + mensaje)
- **Error Handling:** Mensajes claros para el usuario, logs detallados para devs
- **Fallback Systems:** IA puede fallar, tener alternativas (keyword matching)

### Security
- **API Keys:** Nunca commitear, usar variables de entorno
- **RLS en Supabase:** Implementar políticas estrictas
- **OpenAI Client:** En producción, usar proxy backend para proteger API key

### Developer Experience
- **Hot Reload:** A veces falla, usar `--clear` liberalmente
- **TypeScript:** Type safety salva tiempo en runtime
- **Console Logs:** No borrarlos en desarrollo, usar `__DEV__` para control

---

## 8. Stack Alternatives (Consideradas) 🤔

| Componente | Elegido | Alternativas Consideradas |
|------------|---------|---------------------------|
| Framework | Expo | React Native CLI, Ignite |
| Backend | Supabase | Firebase, AWS Amplify, Custom API |
| AI | OpenAI | Anthropic Claude, Google Gemini |
| Deploy Web | Vercel | Netlify, AWS Amplify, Railway |
| Deploy Mobile | EAS | Fastlane, AppCenter |
| Navigation | Expo Router | React Navigation |

**Por qué Expo + Supabase + OpenAI:**
- ✅ Desarrollo rápido (Expo abstracciones)
- ✅ Backend gratis hasta escala (Supabase)
- ✅ AI líder en el mercado (OpenAI)
- ✅ Deploy ultra-rápido (Vercel < 2min)
- ✅ Ecosistema maduro y documentado

---

## 9. Roadmap de Mejoras 🛣️

### Corto Plazo (Sprint 1-2)
- [ ] Implementar auth real (Supabase Auth)
- [ ] Agregar persistencia local (AsyncStorage/MMKV)
- [ ] Sistema de notificaciones (Expo Notifications)
- [ ] Tests unitarios (Jest + React Native Testing Library)

### Medio Plazo (Sprint 3-6)
- [ ] Streaming de OpenAI responses
- [ ] Backend proxy para API keys (Edge Functions)
- [ ] Analytics (Mixpanel/PostHog)
- [ ] Sentry para error tracking
- [ ] CI/CD con GitHub Actions

### Largo Plazo (Trimestre 2+)
- [ ] iOS/Android apps nativas (EAS Build)
- [ ] Rate limiting por usuario
- [ ] Sistema de pagos (Stripe)
- [ ] Modo offline completo
- [ ] Internacionalización (i18n)

---

## 10. Recursos & Documentación 📚

### Oficiales
- **Expo Docs:** https://docs.expo.dev/
- **Supabase Docs:** https://supabase.com/docs
- **OpenAI API Docs:** https://platform.openai.com/docs
- **Vercel Docs:** https://vercel.com/docs

### Community
- **Expo Discord:** https://chat.expo.dev/
- **r/reactnative:** https://reddit.com/r/reactnative
- **Stack Overflow:** Tag [expo], [react-native], [supabase]

### Kontify Docs (Este Repo)
- `DEPLOY.md` - Guía de deployment
- `DEPLOYMENT_READY.md` - Checklist pre-deploy
- `PRE_DEPLOYMENT_CHECKLIST.md` - Validaciones
- `backups/fase5_ai_complete/README.txt` - Instrucciones de backup

---

## 11. Contacto & Soporte 📞

**Tech Lead:** Senior Backend & Frontend Developer  
**Stack Owner:** Expo + Supabase + OpenAI  
**Última revisión:** 2025-11-21

**Para bugs/features:**  
Crear issue en GitHub con etiquetas apropiadas ([bug], [feature], [docs])

---

*Este Playbook se actualiza tras cada fase crítica del proyecto. Mantenerlo sincronizado con los aprendizajes del equipo.*

**Versión:** 1.0.0  
**Estado:** ✅ Producción-Ready  
**Next Review:** Tras primer deploy a producción
