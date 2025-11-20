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

  generateResponse: async (message: string, questionNumber: number): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lower = message.toLowerCase();

        // Saludo SOLO en la primera pregunta Y si el mensaje es principalmente un saludo
        if (questionNumber === 1 && lower.match(/^(hola|buenos días|buenas tardes|buenas noches|hi|hello)[\s\?\!]*$/i)) {
          resolve(`¡Con gusto te apoyo!

Soy tu asistente fiscal profesional de **Kontify+**.

Tienes **3 preguntas gratuitas**.`);
          return;
        }

        // Buscar en la base de conocimiento
        for (const [, knowledge] of Object.entries(fiscalKnowledge)) {
          if (knowledge.keywords.some(k => lower.includes(k))) {
            let response = knowledge.response.trim();

            if (questionNumber === 3) {
              response += `

⚠️ **Has agotado tus 3 preguntas gratuitas.**

Para asesoría personalizada completa, te recomiendo conectar con un experto fiscal certificado.`;
            }

            resolve(response);
            return;
          }
        }

        // Respuesta por defecto - Asesor libre profesional
        let defaultResp = `Entiendo tu consulta.

Como asesor fiscal profesional, puedo ayudarte con temas relacionados a:

• **Impuestos**: IVA, ISR, IEPS
• **Declaraciones**: Mensuales, anuales, complementarias
• **CFDI**: Facturación electrónica y complementos
• **Deducciones**: Gastos deducibles y requisitos
• **Auditorías**: Defensa fiscal y requerimientos del SAT
• **Trámites**: RFC, e.firma, obligaciones fiscales

Por favor, especifica tu consulta y te daré una respuesta profesional basada en la legislación vigente.`;

        if (questionNumber === 3) {
          defaultResp += `

⚠️ **Has agotado tus 3 preguntas.**

Para asesoría fiscal profunda y personalizada, te recomiendo contactar a un experto certificado.`;
        }

        resolve(defaultResp);
      }, 350);
    });
  },

  suggestExperts: async (topic: string): Promise<string[]> => {
    const t = topic.toLowerCase();
    const list = [];

    if (t.includes('iva')) list.push('IVA', 'Devoluciones');
    if (t.includes('isr')) list.push('ISR', 'Planeación Fiscal');
    if (t.includes('cfdi')) list.push('CFDI', 'Facturación');
    if (t.includes('auditor')) list.push('Auditoría', 'Defensa Fiscal');
    if (t.includes('dedu')) list.push('Deducciones');
    if (t.includes('diot')) list.push('DIOT', 'IVA Acreditable');

    return list.length ? list : ['Consultoría General'];
  },

  classifyCase: (message: string, history: AIMessage[]): CaseLevel => {
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
  }

};
