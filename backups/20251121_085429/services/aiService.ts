import { AIMessage, CaseLevel, CaseSummary, Specialty, AIRecommendation } from '../constants/Types';

/* ============================================================
   🔥 ASISTENTE FISCAL PROFESIONAL LIBRE - KONTIFY+
   Asesor fiscal que responde cualquier pregunta sin restricciones
   ============================================================ */

const fiscalKnowledge = {
  devolucion_iva: {
    keywords: [
      'devolución', 'devolucion', 'saldo a favor', 'iva a favor',
      'recuperar iva', 'reembolso iva', 'f3241', 'fed'
    ],
    response: `Para obtener una devolución de IVA debes seguir el proceso oficial del SAT:

🧾 **Proceso oficial**

**1. Tener saldo a favor declarado**
• Declaración mensual presentada correctamente
• Fundamento: *LIVA art. 6*

**2. Conciliar CFDI vs. Pagos**
• Sin facturas canceladas
• PPD con complemento de pago

**3. Presentar solicitud por FED (Formato F3241)**
Documentación requerida:
• Estados de cuenta
• Relación de CFDI
• Contratos y soporte de operaciones
• Opinión de cumplimiento vigente

**4. Plazo de respuesta**
El SAT tiene 40 días hábiles (*CFF art. 22*)

⚠️ **Riesgos comunes**
• Proveedores no localizados
• DIOT incorrecta
• CFDI con inconsistencias`
  },

  declaraciones: {
    keywords: ['declaración', 'declarar', 'complementaria', 'mensual', 'anual'],
    response: `Las declaraciones fiscales se presentan según tu régimen:

📌 **Tipos de declaraciones**

**IVA / ISR mensual**
• Fundamento: *CFF y RMF*
• Plazo: Día 17 del mes siguiente

**Declaración anual**
• Personas Físicas: Abril
• Personas Morales: Marzo
• Fundamento: *LISR*

**Complementarias**
Permitidas en la mayoría de casos, excepto restricciones específicas del SAT.`
  },

  iva: {
    keywords: ['iva', 'impuesto al valor agregado', 'acreditable', 'trasladado'],
    response: `El IVA en México funciona así:

📌 **Tasas vigentes**
• Tasa general: **16%**
• Tasa frontera: **8%**
• Tasa 0%: Exportaciones y alimentos básicos

**Conceptos clave**

**IVA trasladado**
El que cobras a tus clientes

**IVA acreditable**
El que pagas a proveedores (*LIVA art. 5*)

**Saldo a favor**
Cuando acreditable > trasladado`
  },

  facturacion: {
    keywords: ['factura', 'cfdi', 'facturación', 'timbrar', 'complemento'],
    response: `El CFDI debe cumplir requisitos del Anexo 20:

📌 **Requisitos principales**
• RFC emisor y receptor válidos
• Uso correcto del CFDI
• Método y forma de pago
• Descripción clara

**Complementos comunes**
• **PPD**: Pago en parcialidades
• **Carta Porte**: Transporte de mercancías
• **Pagos**: Relacionar facturas con pagos`
  },

  deducciones: {
    keywords: ['deducción', 'deducible', 'gasto', 'estrictamente indispensable'],
    response: `Un gasto es deducible si cumple:

✔ **Requisitos obligatorios**
• Estrictamente indispensable (*LISR*)
• CFDI válido y vigente
• Pagado por medios bancarios (si > $2,000)
• Registrado contablemente

**Gastos comunes deducibles**
• Sueldos y salarios
• Arrendamiento
• Servicios profesionales
• Combustible y mantenimiento
• Equipo de cómputo`
  },

  isr: {
    keywords: ['isr', 'renta', 'impuesto sobre la renta'],
    response: `El ISR se calcula sobre ingresos menos deducciones autorizadas:

📌 **Regímenes**

**Personas Físicas**
• RIF (Régimen de Incorporación Fiscal)
• RESICO (Régimen Simplificado de Confianza)
• Actividad empresarial
• Servicios profesionales

**Personas Morales**
• Régimen general
• Coeficiente de utilidad
• Pagos provisionales mensuales

Fundamento: *LISR, CFF, RMF vigente*`
  },

  auditoria: {
    keywords: ['auditoría', 'requerimiento', 'crédito fiscal', 'visita domiciliaria', 'embargo'],
    response: `⚠️ **Atención inmediata requerida**

Estás ante un proceso de fiscalización del SAT.

📌 **Riesgos principales**
• Plazos estrictos (15-20 días hábiles)
• Multas por incumplimiento
• Crédito fiscal determinado
• Cancelación de sellos digitales
• Embargo precautorio

**Acciones inmediatas**
1. Identifica el tipo de requerimiento
2. Revisa el plazo de respuesta
3. Reúne documentación solicitada
4. Prepara respuesta formal

Fundamento: *CFF art. 42, 46-A, 53-B*

**Recomiendo asistencia inmediata de un experto fiscal.**`
  },

  alta_sat: {
    keywords: ['alta', 'registro', 'inscripción', 'inscribir', 'darme de alta', 'como me registro', 'obtener rfc'],
    response: `Para darte de alta en el SAT necesitas:

📌 **Documentos requeridos**
• Acta de nacimiento
• Comprobante de domicilio (reciente)
• Identificación oficial vigente
• CURP

**Proceso en línea**
1. Ingresa a **sat.gob.mx**
2. Selecciona "Trámites del RFC"
3. Captura tus datos
4. Sube documentos digitalizados
5. Obtén tu constancia de RFC

**Proceso presencial**
1. Agenda cita en **sat.gob.mx**
2. Acude con documentos originales
3. Recibe tu constancia y e.firma

Fundamento: *CFF art. 27*`
  },

  rfc: {
    keywords: ['rfc', 'clave fiscal', 'registro federal', 'número de contribuyente'],
    response: `El RFC es tu clave única como contribuyente en México.

📌 **Características**
• **Personas físicas**: 13 caracteres
• **Personas morales**: 12 caracteres
• Obligatorio para facturar y declarar

**Usos principales**
• Emitir y recibir facturas (CFDI)
• Presentar declaraciones
• Realizar trámites fiscales
• Abrir cuentas bancarias empresariales

**¿Perdiste tu RFC?**
Puedes consultarlo en sat.gob.mx con tu CURP.

Fundamento: *CFF art. 27*`
  },
};


/* ============================================================
   🔥 SERVICIO PRINCIPAL DEL ASISTENTE FISCAL
   ============================================================ */

export const aiService = {

  generateAIResponse: async (
    message: string,
    history: AIMessage[],
    questionNumber: number,
    userData?: any
  ): Promise<{ content: string; caseLevel: CaseLevel }> => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
      console.log('AI Service - API Key configured:', !!apiKey);

      if (!apiKey) {
        throw new Error('API Key no configurada');
      }

      // Construir el contexto del sistema
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

      // Preparar mensajes para la API
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...history.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
        { role: 'user', content: message }
      ];

      // Llamada a OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // O gpt-3.5-turbo si prefieres
          messages: apiMessages,
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI Error:', errorData);
        throw new Error('Error en la respuesta de OpenAI');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Respuesta vacía de OpenAI');
      }

      // Parsear el JSON de la respuesta
      const parsedResponse = JSON.parse(content);

      return {
        content: parsedResponse.answer,
        caseLevel: parsedResponse.caseLevel as CaseLevel
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback en caso de error
      return {
        content: "Lo siento, estoy teniendo problemas para conectar con mi cerebro fiscal en este momento. Por favor intenta de nuevo en unos segundos.",
        caseLevel: 'green'
      };
    }
  },

  // Mantener métodos auxiliares por compatibilidad si es necesario, o actualizarlos
  classifyCase: (message: string, history: AIMessage[]): CaseLevel => {
    // Esta función ahora es redundante si usamos generateAIResponse, 
    // pero la mantenemos para no romper contratos existentes si se usa en otro lado.
    // Podríamos hacerla usar la lógica local como fallback.
    const lower = message.toLowerCase();
    const full = history.map(x => x.content.toLowerCase()).join(' ');

    const RED = [
      'auditoría', 'requerimiento', 'crédito fiscal', 'visita',
      'embargo', 'sellos', 'multas', 'urgente', 'fiscalización'
    ];
    const YELLOW = [
      'planear', 'planeacion', 'anual', 'complementaria',
      'deducciones', 'estructura', 'régimen'
    ];

    if (RED.some(k => lower.includes(k) || full.includes(k))) return 'red';
    if (YELLOW.some(k => lower.includes(k) || full.includes(k))) return 'yellow';
    return 'green';
  },

  generateCaseSummary: (history: AIMessage[], level: CaseLevel): CaseSummary => {
    const last = history.filter(x => x.role === 'user').at(-1)?.content || '';
    const all = history.map(x => `${x.role}: ${x.content}`).join('\n').toLowerCase();

    const specialties: Specialty[] = [];

    if (all.includes('iva')) specialties.push('IVA');
    if (all.includes('devolu')) specialties.push('Devoluciones');
    if (all.includes('cfdi') || all.includes('factura')) specialties.push('Facturación Electrónica');
    if (all.includes('isr')) specialties.push('ISR');
    if (all.includes('auditor')) specialties.push('Auditoría');
    if (all.includes('dedu')) specialties.push('Deducciones');
    if (all.includes('declar')) specialties.push('Declaraciones');

    if (!specialties.length) specialties.push('Consultoría General');

    return {
      level,
      detectedSpecialties: specialties,
      userQuery: last,
      conversationContext: all,
      urgency: level === 'red' ? 'high' : level === 'yellow' ? 'medium' : 'low',
      generatedAt: new Date()
    };
  },

  getExpertRecommendations: (summary: CaseSummary): AIRecommendation[] => {
    return summary.detectedSpecialties.map((spec, i) => ({
      specialty: spec,
      confidence: i === 0 ? 0.9 : 0.7 - i * 0.1,
      reason: `Caso relacionado con ${spec} detectado en la conversación.`
    }));
  },

  // Deprecated mock method kept for interface compatibility if needed, but unused in new flow
  generateResponse: async (message: string, questionNumber: number): Promise<string> => {
    return "Deprecated: Use generateAIResponse instead";
  }

};
