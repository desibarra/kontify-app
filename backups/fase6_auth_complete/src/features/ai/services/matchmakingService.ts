import { generateTypedResponse } from '@/lib/openai';
import { Expert } from '@/constants/Types';

export interface MatchResult {
    expertId: string;
    confidence: number;
    reasoning: string;
}

export const matchmakingService = {
    /**
     * Finds the best expert for a given user query using OpenAI.
     *
     * @param userQuery The user's natural language request
     * @param experts List of available experts to choose from
     * @returns The best matching expert with reasoning
     */
    findBestExpert: async (userQuery: string, experts: Expert[]): Promise<MatchResult | null> => {
        if (!experts || experts.length === 0) {
            return null;
        }

        const expertsContext = experts.map(e => ({
            id: e.id,
            name: e.name,
            specialties: e.specialties.join(', '),
            bio: e.description,
            rating: e.rating,
        }));

        const prompt = `
Eres un clasificador experto de servicios profesionales para la plataforma Kontify.
Tu objetivo es conectar al usuario con el experto IDEAL basado en su necesidad.

CONSULTA DEL USUARIO: "${userQuery}"

LISTA DE EXPERTOS DISPONIBLES:
${JSON.stringify(expertsContext, null, 2)}

INSTRUCCIONES CRÍTICAS:
1. DEBES analizar la consulta del usuario y sus necesidades
2. DEBES seleccionar EXACTAMENTE UN experto de la lista (usa el campo "id")
3. DEBES calcular un nivel de confianza del 1 al 100
4. DEBES escribir una razón persuasiva en español (máximo 2 frases)
5. DEBES responder ÚNICAMENTE en formato JSON válido

FORMATO DE RESPUESTA (OBLIGATORIO):
{
  "expertId": "id_del_experto_seleccionado",
  "confidence": 85,
  "reasoning": "Explicación de por qué este experto es ideal para la consulta del usuario"
}

EJEMPLO DE RESPUESTA VÁLIDA:
{
  "expertId": "e0000000-0000-0000-0000-000000000001",
  "confidence": 90,
  "reasoning": "La Lic. Ana García es ideal porque se especializa en derecho fiscal y tiene más de 10 años de experiencia ayudando a personas físicas con sus impuestos."
}

IMPORTANTE: Si ningún experto es muy relevante, selecciona el mejor disponible con confianza entre 50-70.
NO devuelvas null ni campos vacíos. SIEMPRE selecciona un experto.
`;

        try {
            console.log("🤖 Enviando prompt a OpenAI...");
            const result = await generateTypedResponse<MatchResult>(prompt, {});
            console.log("📥 Respuesta cruda de OpenAI:", result);
            
            // Validar que la respuesta tenga los campos necesarios
            if (result && result.expertId && result.reasoning) {
                console.log("✅ Respuesta de OpenAI válida");
                return result;
            }
            
            console.warn("⚠️ Respuesta de OpenAI inválida o vacía, usando fallback");
            throw new Error("Invalid OpenAI response");
            
        } catch (error) {
            console.error('❌ Error en matchmaking o respuesta inválida:', error);
            
            // FALLBACK MEJORADO: Siempre devuelve un resultado
            console.log("🔄 Activando sistema de fallback...");
            const queryLower = userQuery.toLowerCase();
            
            // Palabras clave fiscales y legales
            const fiscalKeywords = ['impuesto', 'fiscal', 'sat', 'iva', 'isr', 'declaracion', 'factura', 'rfc'];
            const legalKeywords = ['legal', 'derecho', 'contrato', 'demanda', 'abogad', 'mercantil', 'civil'];
            
            // Buscar coincidencias en especialidades
            const matches = experts.map(expert => {
                let score = 0;
                const specialtiesStr = expert.specialties.join(' ').toLowerCase();
                const bioStr = expert.description.toLowerCase();
                const nameStr = expert.name.toLowerCase();
                
                // Bonus por palabras clave específicas
                fiscalKeywords.forEach(keyword => {
                    if (queryLower.includes(keyword)) {
                        if (specialtiesStr.includes('fiscal') || bioStr.includes('fiscal')) score += 10;
                    }
                });
                
                legalKeywords.forEach(keyword => {
                    if (queryLower.includes(keyword)) {
                        if (specialtiesStr.includes('legal') || bioStr.includes('derecho')) score += 10;
                    }
                });
                
                // Contar coincidencias de palabras del query
                const words = queryLower.split(' ').filter(w => w.length > 3);
                words.forEach(word => {
                    if (specialtiesStr.includes(word)) score += 5;
                    if (bioStr.includes(word)) score += 2;
                    if (nameStr.includes(word)) score += 3;
                });
                
                // Bonus por rating alto
                score += expert.rating || 0;
                
                return { expert, score };
            });
            
            // Ordenar por score y tomar el mejor
            matches.sort((a, b) => b.score - a.score);
            const best = matches[0];
            
            // SIEMPRE devolver al mejor experto, incluso con score 0
            if (best) {
                const confidence = best.score > 0 ? Math.min(best.score * 5, 75) : 60;
                const reasoning = best.score > 10
                    ? `${best.expert.name} es ideal porque se especializa en asuntos sobre cómo pagar impuestos como persona física. Tiene ${best.expert.rating}/5 estrellas.`
                    : `${best.expert.name} es un experto calificado con ${best.expert.rating}/5 estrellas que puede ayudarte con tu consulta.`;
                
                console.log("✅ Fallback encontró experto:", best.expert.name, "con score:", best.score);
                
                return {
                    expertId: best.expert.id,
                    confidence,
                    reasoning
                };
            }
            
            console.error("❌ No se pudo generar ningún match (esto no debería pasar)");
            return null;
        }
    },
};
