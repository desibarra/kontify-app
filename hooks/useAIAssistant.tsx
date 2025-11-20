import { useState, useCallback, useEffect } from 'react';
import { AIMessage, CaseLevel, CaseSummary, UserContactData } from '../constants/Types';
import { aiService } from '../services/aiService';

/**
 * Hook para gestionar el Asistente Fiscal IA
 * 
 * Características:
 * - Límite de 3 preguntas gratuitas
 * - Clasificación automática de casos (verde/amarillo/rojo)
 * - Generación de resumen para expertos
 * - Solicitud de datos de contacto
 */
export function useAIAssistant(userId: string) {
  // Estado de mensajes (sin mensaje de bienvenida inicial)
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  // Estados de clasificación de casos
  const [caseLevel, setCaseLevel] = useState<CaseLevel>('green');
  const [caseSummary, setCaseSummary] = useState<CaseSummary | null>(null);
  const [userContactData, setUserContactData] = useState<UserContactData | null>(null);
  const [needsUserData, setNeedsUserData] = useState(false);

  // Mostrar mensaje de bienvenida automáticamente al cargar
  useEffect(() => {
    if (!hasGreeted && messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `¡Hola! Soy tu asistente fiscal profesional de **Kontify+**.

Tienes **3 preguntas gratuitas**.`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      setHasGreeted(true);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (questionsUsed >= 3) {
        return;
      }

      // Agregar mensaje del usuario
      const userMessage: AIMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      try {
        const newQuestionCount = questionsUsed + 1;
        setQuestionsUsed(newQuestionCount);

        // Clasificar nivel del caso
        const level = aiService.classifyCase(content, messages);
        setCaseLevel(level);

        // Obtener respuesta del asistente
        const response = await aiService.generateResponse(content, newQuestionCount);

        const aiMessage: AIMessage = {
          id: `msg_${Date.now()}_ai`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);

        // Solicitar datos de usuario SOLO al agotar las 3 preguntas
        // NO mostrar modal inmediatamente en casos red/yellow
        if (newQuestionCount >= 3 && !userContactData) {
          // Esperar un momento para que el usuario vea la respuesta
          setTimeout(() => {
            setNeedsUserData(true);
          }, 1500);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);

        // Mensaje de error amigable
        const errorMessage: AIMessage = {
          id: `msg_${Date.now()}_error`,
          role: 'assistant',
          content: 'Disculpa, hubo un error al procesar tu consulta. Por favor, intenta de nuevo o contacta a un experto.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [questionsUsed, messages, userContactData, hasGreeted]
  );

  const resetSession = useCallback(() => {
    setMessages([]);
    setQuestionsUsed(0);
    setHasGreeted(false);
    setCaseLevel('green');
    setCaseSummary(null);
    setUserContactData(null);
    setNeedsUserData(false);
  }, []);

  // Generar resumen del caso para expertos
  const generateCaseSummary = useCallback(() => {
    const summary = aiService.generateCaseSummary(messages, caseLevel);
    setCaseSummary(summary);
    return summary;
  }, [messages, caseLevel]);

  // Guardar datos de contacto del usuario
  const saveUserContactData = useCallback((data: UserContactData) => {
    setUserContactData(data);
    setNeedsUserData(false);
  }, []);

  // Activar solicitud de datos de usuario
  const triggerRequestUserData = useCallback(() => {
    setNeedsUserData(true);
  }, []);

  return {
    messages,
    questionsUsed,
    questionsRemaining: 3 - questionsUsed,
    isTyping,
    canAskMore: questionsUsed < 3,
    sendMessage,
    resetSession,
    // Clasificación de casos
    caseLevel,
    caseSummary,
    userContactData,
    needsUserData,
    generateCaseSummary,
    saveUserContactData,
    triggerRequestUserData,
  };
}