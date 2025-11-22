/**
 * ✅ ARCHIVO CORREGIDO: src/lib/openai-init.ts
 * 
 * Validación explícita de OpenAI API key
 * - Validación al startup
 * - Error claro si falta configuración
 * - No usa placeholders
 */

import { OpenAI } from 'openai';

/**
 * Inicializa OpenAI client con validación de configuración
 * @returns OpenAI instance o null si falta configuración
 * @throws Error en producción si falta API key
 */
export function initializeOpenAI(): OpenAI | null {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  // Validación 1: API key no existe
  if (!apiKey) {
    const errorMsg =
      '[KONTIFY] CRITICAL ERROR: EXPO_PUBLIC_OPENAI_API_KEY environment variable is not set';
    console.error(errorMsg);

    if (__DEV__) {
      // En desarrollo: warning
      console.warn(
        '⚠️  WARNING: AI Chat features will not work until you configure EXPO_PUBLIC_OPENAI_API_KEY in .env.local'
      );
      console.info(
        'To fix: Add EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-... to .env.local and restart the server'
      );
      return null;
    } else {
      // En producción: error crítico
      throw new Error(errorMsg);
    }
  }

  // Validación 2: API key es el placeholder
  if (apiKey === 'placeholder-key-for-build') {
    const errorMsg =
      '[KONTIFY] CRITICAL ERROR: Placeholder API key detected in ' +
      (__DEV__ ? 'development' : 'PRODUCTION') +
      '. This will cause AI features to fail.';
    console.error(errorMsg);

    if (!__DEV__) {
      throw new Error(errorMsg);
    }
    return null;
  }

  // Validación 3: API key tiene formato mínimo válido
  if (!apiKey.startsWith('sk-')) {
    const errorMsg = `[KONTIFY] WARNING: API key does not start with 'sk-'. Expected OpenAI API key format.`;
    console.warn(errorMsg);
  }

  try {
    return new OpenAI({
      apiKey,
      defaultHeaders: {
        'User-Agent': 'Kontify-App/1.0',
      },
    });
  } catch (error) {
    console.error('[KONTIFY] Failed to initialize OpenAI client:', error);
    if (!__DEV__) {
      throw error;
    }
    return null;
  }
}

/**
 * OpenAI client instance
 * Validado al startup, puede ser null si no está configurado
 */
export const openai = initializeOpenAI();

/**
 * Validador: verifica si OpenAI está disponible antes de usar
 */
export function isOpenAIAvailable(): boolean {
  return openai !== null && openai !== undefined;
}

/**
 * Helper para componentes que usan IA
 * Retorna error descriptivo si IA no está disponible
 */
export function getOpenAIError(): string | null {
  if (isOpenAIAvailable()) {
    return null;
  }

  if (__DEV__) {
    return 'AI features are disabled. Configure EXPO_PUBLIC_OPENAI_API_KEY in .env.local to enable them.';
  } else {
    return 'AI features are temporarily unavailable. Please try again later.';
  }
}
