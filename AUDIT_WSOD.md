# Auditoría de Diagnóstico: Pantalla Blanca (WSOD)

## 1. Síntomas
- Pantalla blanca en navegador (`localhost:8081`).
- Error 500 en consola del navegador (`entry.bundle`).
- Error: `Refused to execute script... because its MIME type ('application/json') is not executable`.

## 2. Análisis de Causa Raíz
Al inspeccionar `package.json`, se detectaron **dependencias críticas faltantes** que son importadas en el código fuente. Metro Bundler falla al intentar resolver estos módulos, generando un error interno (500).

| Archivo Fuente | Import Faltante | Estado en package.json | Impacto |
|---|---|---|---|
| `src/lib/storage.ts` | `expo-secure-store` | ❌ NO INSTALADO | Rompe la compilación de `supabase.ts` (incluso en web) |
| `src/lib/supabase.ts` | `react-native-url-polyfill` | ❌ NO INSTALADO | Rompe la inicialización del cliente Supabase |
| `src/lib/gemini.ts` | `@google/generative-ai` | ❌ NO INSTALADO | Rompe la funcionalidad de IA y componentes dependientes |

## 3. Plan de Corrección
1. **Instalación**: Ejecutar `npx expo install expo-secure-store react-native-url-polyfill @google/generative-ai`.
2. **Limpieza**: Ejecutar `npx expo start --clear` para eliminar cachés corruptos.

---
*Generado por Antigravity AI*
