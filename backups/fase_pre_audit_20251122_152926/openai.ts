import { openai, isOpenAIAvailable, getOpenAIError } from './openai-init';

// openai is now validated and ready to use
// Use isOpenAIAvailable() to check if OpenAI is properly configured
// Use getOpenAIError() to get error message if not available

/**
 * Helper para generar respuestas tipadas (JSON)
 * Actualizado para sintaxis v4
 */
export async function generateTypedResponse<T>(prompt: string): Promise<T> {
    if (!isOpenAIAvailable()) {
        const error = getOpenAIError();
        throw new Error(error || 'OpenAI is not configured');
    }

    if (!openai) {
        throw new Error('OpenAI client is not initialized');
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