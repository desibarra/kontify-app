# 🚀 Guía de Despliegue a Vercel

## ✅ Pre-requisitos Completados

- ✅ `vercel.json` configurado con rewrites para SPA
- ✅ Scripts de build en `package.json`
- ✅ Babel config sin plugins duplicados
- ✅ Variables de entorno documentadas en `.env.example`
- ✅ Build de web optimizado con Expo

---

## 📦 Paso 1: Instalar Vercel CLI (si no lo tienes)

```bash
npm install -g vercel
```

---

## 🔐 Paso 2: Configurar Variables de Entorno en Vercel

Antes de desplegar, necesitas agregar tus variables de entorno en el dashboard de Vercel:

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Ve a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

```env
EXPO_PUBLIC_OPENAI_API_KEY=tu_api_key_aqui
EXPO_PUBLIC_SUPABASE_URL=https://oyvrllrrpluixybihnew.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
EXPO_PUBLIC_GEMINI_API_KEY=tu_gemini_api_key_aqui
EXPO_PUBLIC_STRIPE_PUBLIC_KEY=tu_stripe_key_aqui
```

**⚠️ IMPORTANTE:** 
- NO incluyas las variables privadas (sin `EXPO_PUBLIC_`)
- Estas variables deben estar disponibles para **Production**, **Preview** y **Development**

---

## 🚀 Paso 3: Desplegar a Vercel

### Opción A: Despliegue desde la terminal

```bash
# Preview (para probar)
npm run deploy:preview

# Producción
npm run deploy
```

### Opción B: Despliegue manual

```bash
# Login a Vercel (primera vez)
vercel login

# Deploy a preview
vercel

# Deploy a producción
vercel --prod
```

### Opción C: Desde GitHub (Recomendado para equipos)

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente la configuración
3. Cada push a `main` desplegará automáticamente

---

## 🧪 Paso 4: Verificar el Build Localmente

Antes de desplegar, puedes probar el build web localmente:

```bash
# Build para web
npm run build:web

# Servir el build localmente (requiere servidor HTTP)
npx serve dist -l 3000
```

Abre `http://localhost:3000` y verifica que todo funcione.

---

## 📊 Paso 5: Verificar Deployment

Una vez desplegado, verifica:

1. ✅ La app carga correctamente
2. ✅ Las rutas funcionan (navegación entre páginas)
3. ✅ Supabase conecta (verifica que se carguen los expertos)
4. ✅ OpenAI responde (prueba la búsqueda IA)
5. ✅ No hay errores en la consola del navegador

---

## 🔧 Troubleshooting

### Problema: "Module not found" o errores de import

**Solución:** Limpia el cache y reconstruye

```bash
npm run fix:web
npm run build:web
```

### Problema: Variables de entorno no funcionan

**Solución:** Asegúrate de que:
- Las variables tengan el prefijo `EXPO_PUBLIC_`
- Estén configuradas en el dashboard de Vercel
- Hayas hecho redeploy después de agregarlas

### Problema: Rutas 404 en refresh

**Solución:** Verifica que `vercel.json` tenga el rewrite correcto:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Problema: Build falla en Vercel

**Solución:** Verifica los logs en Vercel y asegúrate de que:
- `installCommand` use `--legacy-peer-deps`
- `buildCommand` sea `npx expo export --platform web`
- `outputDirectory` sea `dist`

---

## 📝 Comandos Útiles

```bash
# Desarrollo local
npm start

# Desarrollo web
npm run web

# Build para web
npm run build:web

# Preview deployment
npm run deploy:preview

# Production deployment
npm run deploy

# Limpiar cache
npm run fix:web
```

---

## 🌐 URLs de Producción

Después del despliegue, tu app estará disponible en:
- **Preview:** `https://kontify-app-xxx.vercel.app`
- **Production:** `https://kontify-app.vercel.app` (o tu dominio custom)

---

## 🔒 Seguridad en Producción

✅ **Ya implementado:**
- Variables de entorno con `EXPO_PUBLIC_` prefix
- `.env.local` en `.gitignore`
- No hay credenciales hardcodeadas

⚠️ **Por implementar (próximos pasos):**
- Autenticación real con Supabase Auth
- Rate limiting en API calls
- HTTPS obligatorio (Vercel lo hace automático)

---

## 📈 Monitoreo Post-Deployment

Vercel provee métricas automáticas:
- **Analytics:** Visitas, performance
- **Logs:** Errores en runtime
- **Speed Insights:** Core Web Vitals

Accede a estas métricas en tu dashboard de Vercel.

---

## ✅ Checklist Final

Antes de considerar el deployment completo:

- [ ] Build local exitoso
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy a preview funcional
- [ ] Deploy a producción exitoso
- [ ] Verificación de funcionalidad end-to-end
- [ ] Sin errores en consola
- [ ] Performance aceptable (LCP < 2.5s)
- [ ] Mobile responsive funcional

---

**¡Listo para desplegar! 🚀**

Si encuentras algún problema, revisa la sección de Troubleshooting o los logs de Vercel.
