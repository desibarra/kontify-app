import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Model configuration for deterministic JSON outputs
const MODEL_NAME = 'gemini-1.5-flash';
const GENERATION_CONFIG = {
    temperature: 0.2, // Low temperature for consistent results
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
};

/**
 * Generates a type-safe response from Gemini using JSON schema enforcement.
 * 
 * @param prompt The user prompt or system instruction
 * @param schema The JSON schema definition for the expected output
 * @returns The parsed JSON response typed as T
 */
export async function generateTypedResponse<T>(
    prompt: string,
    schema: any
): Promise<T> {
    if (!API_KEY) {
        throw new Error('Gemini API Key is missing. Please check your .env.local file.');
    }

    try {
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            generationConfig: {
                ...GENERATION_CONFIG,
                responseMimeType: 'application/json',
                responseSchema: schema,
            },
        });

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error('Gemini returned an empty response.');
        }

        return JSON.parse(text) as T;
    } catch (error) {
        console.error('Error generating AI response:', error);
        throw error;
    }
}

export const gemini = genAI;
