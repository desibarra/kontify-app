import OpenAI from 'openai';

// 1. Validación de API Key
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
    console.error("❌ Error Crítico: Faltan las credenciales de OpenAI en .env.local");
}

// 2. Inicialización del Cliente (Versión v4)
export const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Necesario para Expo/React Native
});

/**
 * Helper para generar respuestas tipadas (JSON)
 * Actualizado para sintaxis v4
 */
export async function generateTypedResponse<T>(prompt: string): Promise<T> {
    if (!apiKey) {
        throw new Error('⚠️ OpenAI API Key no configurada. Agrega EXPO_PUBLIC_OPENAI_API_KEY en .env.local');
    }

    // Validar formato de API key
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
        throw new Error('⚠️ La API Key de OpenAI parece inválida. Verifica que sea correcta en .env.local');
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-0125', // Modelo optimizado para JSON
            messages: [
                { role: 'system', content: 'Eres un asistente experto que SIEMPRE responde en JSON válido.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' }, // Forzar modo JSON
        });

        const text = response.choices[0].message.content;

        if (!text) {
            throw new Error('OpenAI returned an empty response');
        }

        return JSON.parse(text) as T;
    } catch (error: any) {
        // Mejorar mensaje de error para problemas de autenticación
        if (error?.status === 401 || error?.message?.includes('401')) {
            console.error('❌ API Key de OpenAI inválida o expirada. Genera una nueva en: https://platform.openai.com/api-keys');
            throw new Error('API Key de OpenAI inválida. Por favor, actualiza tu clave en .env.local');
        }
        
        console.error('Error en OpenAI generateTypedResponse:', error);
        throw error;
    }
}