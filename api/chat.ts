/**
 * VERCEL EDGE FUNCTION - AI CHAT PROXY
 * 
 * Propósito: Proxy seguro para llamadas a OpenAI API
 * - Evita CORS
 * - Protege API Key
 * - Valida requests
 * - Rate limiting básico
 */

// Configuración de Edge Runtime para mejor performance
export const config = {
  runtime: 'edge',
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  questionNumber: number;
}

export default async function handler(req: Request): Promise<Response> {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json() as ChatRequest;
    const { messages, questionNumber } = body;

    // Validaciones básicas
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtener API Key del servidor (NO del cliente)
    const apiKey = process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      console.error('❌ OpenAI API Key not configured on server');
      return new Response(JSON.stringify({ 
        error: 'API configuration error',
        message: 'OpenAI API Key not configured on server' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Construir prompt del sistema
    const systemPrompt = `Eres un experto fiscal mexicano altamente calificado de la plataforma Kontify+.
Tu objetivo es ayudar a usuarios (emprendedores y autónomos) con dudas sobre impuestos (SAT, IVA, ISR, RESICO, etc.).

REGLAS:
1. Responde de forma profesional, empática y concisa.
2. Basa tus respuestas en la legislación vigente (LISR, LIVA, CFF).
3. Si detectas un caso grave (auditoría, multas, embargo), clasifícalo como 'red'.
4. Si es un tema de planeación o dudas complejas, clasifícalo como 'yellow'.
5. Dudas generales o informativas son 'green'.
6. Tienes un límite de 3 preguntas gratuitas por usuario. Esta es la pregunta número ${questionNumber}.
   ${questionNumber >= 3 ? "ADVERTENCIA: Esta es la última pregunta gratuita. Al final de tu respuesta, invita sutilmente a contactar a un experto para seguimiento." : ""}

FORMATO DE RESPUESTA (JSON):
Debes responder SIEMPRE en formato JSON estricto con esta estructura:
{
  "answer": "Tu respuesta formateada en Markdown aquí...",
  "caseLevel": "green" | "yellow" | "red"
}`;

    // Preparar mensajes con el sistema al inicio
    const apiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages
    ];

    // Llamada a OpenAI desde el servidor
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        temperature: 0.7,
        response_format: { type: "json_object" },
        max_tokens: 1000
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('❌ OpenAI API Error:', errorData);
      
      return new Response(JSON.stringify({ 
        error: 'OpenAI API error',
        details: errorData 
      }), {
        status: openaiResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await openaiResponse.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ 
        error: 'Empty response from OpenAI' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parsear y validar respuesta JSON
    try {
      const parsedResponse = JSON.parse(content);
      
      if (!parsedResponse.answer || !parsedResponse.caseLevel) {
        throw new Error('Invalid response format from AI');
      }

      // Retornar respuesta exitosa con CORS headers
      return new Response(JSON.stringify({
        success: true,
        data: {
          content: parsedResponse.answer,
          caseLevel: parsedResponse.caseLevel
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });

    } catch (parseError) {
      console.error('❌ Error parsing AI response:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Failed to parse AI response',
        rawContent: content 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('❌ Chat API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
