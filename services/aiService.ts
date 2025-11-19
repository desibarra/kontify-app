import { AIMessage, CaseLevel, CaseSummary, Specialty, AIRecommendation } from '../constants/Types';

const fiscalKnowledge = {
  iva: {
    keywords: ['iva', 'impuesto al valor agregado', 'valor agregado', '16%'],
    response: 'El IVA (Impuesto al Valor Agregado) en México es del 16% general y 0% en zonas fronterizas. Se aplica a la venta de bienes, prestación de servicios y arrendamiento. Debes emitir facturas y presentar declaraciones mensuales. ¿Tienes dudas sobre cómo calcular el IVA acreditable o trasladado?',
  },
  deducciones: {
    keywords: ['deducción', 'deducir', 'gasto deducible', 'comprobante'],
    response: 'Para que un gasto sea deducible debe cumplir: ser estrictamente indispensable, estar respaldado por CFDI, cumplir requisitos fiscales, y estar pagado con medios bancarios si excede $2,000. Las deducciones comunes incluyen: sueldos, arrendamiento, servicios profesionales, combustible, equipo de cómputo. ¿Necesitas ayuda con algún tipo específico de deducción?',
  },
  facturacion: {
    keywords: ['factura', 'cfdi', 'facturación electrónica', 'comprobante fiscal'],
    response: 'La facturación electrónica (CFDI) es obligatoria en México. Debe contener: RFC emisor y receptor, descripción del bien/servicio, forma de pago, uso del CFDI. Tienes hasta 72 horas para facturar después de la operación. Es importante usar el uso de CFDI correcto para maximizar deducciones. ¿Tienes dudas sobre cómo emitir o solicitar facturas?',
  },
  isr: {
    keywords: ['isr', 'impuesto sobre la renta', 'renta', 'declaración anual'],
    response: 'El ISR (Impuesto Sobre la Renta) se paga sobre ingresos. Personas físicas: pagas mensual o anual según tu régimen. Personas morales: pagos provisionales mensuales y declaración anual. Las tasas varían según ingresos. Existen deducciones personales para personas físicas. ¿Necesitas orientación sobre tu régimen fiscal o cómo calcular tu ISR?',
  },
  declaraciones: {
    keywords: ['declaración', 'declarar', 'sat', 'presentar'],
    response: 'Las declaraciones fiscales se presentan en el portal del SAT con e.firma o contraseña. Principales declaraciones: mensuales (IVA, ISR provisional), anual (ISR, informativa). Es crucial presentarlas a tiempo para evitar multas y recargos. Puedes hacerlas tú mismo o con un contador. ¿Tienes dudas sobre qué declaraciones te corresponden?',
  },
};

export const aiService = {
  generateResponse: async (message: string, questionNumber: number): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerMessage = message.toLowerCase();

        // Check for greeting
        if (lowerMessage.match(/hola|buenos días|buenas tardes|buenas noches/)) {
          resolve('¡Hola! Soy tu asistente fiscal de Kontify+. Puedo ayudarte con preguntas sobre IVA, ISR, deducciones, facturación y más temas fiscales. Tienes 3 preguntas gratuitas. ¿En qué puedo asistirte hoy?');
          return;
        }

        // Search knowledge base
        for (const [key, knowledge] of Object.entries(fiscalKnowledge)) {
          if (knowledge.keywords.some(keyword => lowerMessage.includes(keyword))) {
            let response = knowledge.response;

            // Add suggestion to contact expert on 3rd question
            if (questionNumber === 3) {
              response += '\n\nℹ️ Has usado tus 3 preguntas gratuitas. Te recomiendo conectar con uno de nuestros expertos certificados para asesoría personalizada. Puedes buscarlos en la pestaña principal.';
            }

            resolve(response);
            return;
          }
        }

        // Default response
        let defaultResponse = 'Entiendo tu consulta sobre temas fiscales. Te recomendaría especificar más sobre tu situación: ¿Es sobre IVA, ISR, deducciones, facturación u otro tema? Así podré orientarte mejor.';

        if (questionNumber === 3) {
          defaultResponse += '\n\nℹ️ Has usado tus 3 preguntas gratuitas. Para recibir asesoría personalizada y detallada, te sugiero contactar a uno de nuestros expertos certificados en la pestaña principal.';
        }

        resolve(defaultResponse);
      }, 800);
    });
  },

  suggestExperts: async (topic: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions: string[] = [];
        const lowerTopic = topic.toLowerCase();

        if (lowerTopic.includes('iva')) {
          suggestions.push('IVA', 'Declaraciones');
        }
        if (lowerTopic.includes('dedu')) {
          suggestions.push('Deducciones', 'Optimización Fiscal');
        }
        if (lowerTopic.includes('factur')) {
          suggestions.push('Facturación Electrónica');
        }
        if (lowerTopic.includes('isr') || lowerTopic.includes('renta')) {
          suggestions.push('ISR', 'Planeación Fiscal');
        }
        if (lowerTopic.includes('nómina') || lowerTopic.includes('empleado')) {
          suggestions.push('Nómina');
        }

        resolve(suggestions.length > 0 ? suggestions : ['Consultoría General']);
      }, 200);
    });
  },

  // ============================================
  // NEW METHODS FOR AI → EXPERT FLOW
  // ============================================

  classifyCase: (message: string, conversationHistory: AIMessage[]): CaseLevel => {
    const lowerMessage = message.toLowerCase();
    const fullConversation = conversationHistory.map(m => m.content.toLowerCase()).join(' ');

    // RED LEVEL: Urgent/complex cases
    const redKeywords = [
      'auditoría', 'auditoria', 'sat me está auditando', 'revisión del sat',
      'multa', 'sanción', 'crédito fiscal', 'requerimiento',
      'urgente', 'inmediato', 'hoy mismo', 'mañana',
      'demanda', 'juicio', 'controversia fiscal', 'amparo',
      'cierre de negocio', 'embargo', 'cancelación de sellos'
    ];

    // YELLOW LEVEL: Moderate complexity
    const yellowKeywords = [
      'declaración anual', 'declaracion anual', 'complementaria',
      'planeación fiscal', 'planeacion fiscal', 'optimización',
      'reestructura', 'fusión', 'escisión',
      'nómina compleja', 'nomina compleja', 'imss', 'infonavit',
      'facturación masiva', 'facturacion masiva',
      'régimen fiscal', 'regimen fiscal', 'cambio de régimen'
    ];

    // Check for RED level
    if (redKeywords.some(keyword => lowerMessage.includes(keyword) || fullConversation.includes(keyword))) {
      return 'red';
    }

    // Check for YELLOW level
    if (yellowKeywords.some(keyword => lowerMessage.includes(keyword) || fullConversation.includes(keyword))) {
      return 'yellow';
    }

    // GREEN level: Simple questions
    return 'green';
  },

  generateCaseSummary: (conversationHistory: AIMessage[], caseLevel: CaseLevel): CaseSummary => {
    const userMessages = conversationHistory.filter(m => m.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';
    const fullConversation = conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n');

    // Detect specialties from conversation
    const detectedSpecialties: Specialty[] = [];
    const conversationLower = fullConversation.toLowerCase();

    if (conversationLower.includes('iva') || conversationLower.includes('valor agregado')) {
      detectedSpecialties.push('IVA');
    }
    if (conversationLower.includes('isr') || conversationLower.includes('renta')) {
      detectedSpecialties.push('ISR');
    }
    if (conversationLower.includes('nómina') || conversationLower.includes('nomina') || conversationLower.includes('empleado')) {
      detectedSpecialties.push('Nómina');
    }
    if (conversationLower.includes('deducción') || conversationLower.includes('deduccion') || conversationLower.includes('gasto')) {
      detectedSpecialties.push('Deducciones');
    }
    if (conversationLower.includes('factura') || conversationLower.includes('cfdi')) {
      detectedSpecialties.push('Facturación Electrónica');
    }
    if (conversationLower.includes('declaración') || conversationLower.includes('declaracion')) {
      detectedSpecialties.push('Declaraciones');
    }
    if (conversationLower.includes('auditoría') || conversationLower.includes('auditoria')) {
      detectedSpecialties.push('Auditoría');
    }
    if (conversationLower.includes('planeación') || conversationLower.includes('planeacion') || conversationLower.includes('optimización')) {
      detectedSpecialties.push('Planeación Fiscal');
    }

    // If no specialties detected, default to general
    if (detectedSpecialties.length === 0) {
      detectedSpecialties.push('Declaraciones');
    }

    // Determine urgency
    let urgency: 'low' | 'medium' | 'high' = 'low';
    if (caseLevel === 'red') urgency = 'high';
    else if (caseLevel === 'yellow') urgency = 'medium';

    return {
      level: caseLevel,
      detectedSpecialties,
      userQuery: lastUserMessage,
      conversationContext: fullConversation,
      urgency,
      generatedAt: new Date(),
    };
  },

  getExpertRecommendations: (caseSummary: CaseSummary): AIRecommendation[] => {
    const recommendations: AIRecommendation[] = [];

    // Create recommendations based on detected specialties
    caseSummary.detectedSpecialties.forEach((specialty, index) => {
      const confidence = index === 0 ? 0.9 : 0.7 - (index * 0.1);

      let reason = '';
      switch (specialty) {
        case 'IVA':
          reason = 'Tu consulta involucra temas de IVA y cálculos de impuestos';
          break;
        case 'ISR':
          reason = 'Necesitas asesoría sobre Impuesto Sobre la Renta';
          break;
        case 'Nómina':
          reason = 'Tu caso requiere experiencia en nóminas y seguridad social';
          break;
        case 'Deducciones':
          reason = 'Puedes optimizar tus deducciones fiscales';
          break;
        case 'Facturación Electrónica':
          reason = 'Necesitas ayuda con facturación y CFDI';
          break;
        case 'Declaraciones':
          reason = 'Requieres apoyo para presentar declaraciones correctamente';
          break;
        case 'Auditoría':
          reason = 'Tu situación requiere experiencia en auditorías fiscales';
          break;
        case 'Planeación Fiscal':
          reason = 'Puedes beneficiarte de una estrategia fiscal personalizada';
          break;
      }

      recommendations.push({
        specialty,
        confidence,
        reason,
      });
    });

    return recommendations;
  },
};