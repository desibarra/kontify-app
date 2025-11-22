import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AIMessage, CaseLevel, CaseSummary, UserContactData } from '../constants/Types';
import { aiService } from '../services/aiService';

const STORAGE_KEY = '@kontify_chat_state_v1';

/**
 * Hook para gestionar el Asistente Fiscal IA
 * 
 * Características:
 * - Límite de 3 preguntas gratuitas (Persistente)
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
  const [isLoading, setIsLoading] = useState(true);

  // Estados de clasificación de casos
  const [caseLevel, setCaseLevel] = useState<CaseLevel>('green');
  const [caseSummary, setCaseSummary] = useState<CaseSummary | null>(null);
  const [userContactData, setUserContactData] = useState<UserContactData | null>(null);
  const [needsUserData, setNeedsUserData] = useState(false);

  // Cargar estado guardado al iniciar
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setMessages(parsed.messages || []);
          setQuestionsUsed(parsed.questionsUsed || 0);
          setHasGreeted(parsed.hasGreeted || false);
          setCaseLevel(parsed.caseLevel || 'green');
        }
      } catch (error) {
        console.error('Error loading chat state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, []);

  // Guardar estado cuando cambia
  useEffect(() => {
    if (isLoading) return;

    const saveState = async () => {
      try {
        const stateToSave = {
          messages,
          questionsUsed,
          hasGreeted,
          caseLevel,
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Error saving chat state:', error);
      }
    };
    saveState();
  }, [messages, questionsUsed, hasGreeted, caseLevel, isLoading]);

  // Mostrar mensaje de bienvenida automáticamente si es nuevo usuario
  useEffect(() => {
    if (!isLoading && !hasGreeted && messages.length === 0) {
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
  }, [isLoading, hasGreeted, messages.length]);

  const sendMessage = useCallback(
    async (content: string) => {
      // Bloqueo estricto si ya usó las 3 preguntas
      if (questionsUsed >= 3) {
        setNeedsUserData(true);
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

        // Obtener respuesta del asistente (ahora devuelve objeto con content y caseLevel)
        const aiResponse = await aiService.generateAIResponse(
          content,
          messages, // Historial actual (sin el mensaje nuevo aún en estado, pero lo incluimos en el servicio si es necesario, o pasamos [...messages, userMessage])
          newQuestionCount
        );

        // Actualizar nivel del caso con la respuesta de la IA
        setCaseLevel(aiResponse.caseLevel);

        const aiMessage: AIMessage = {
          id: `msg_${Date.now()}_ai`,
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);

        // Solicitar datos de usuario SOLO al agotar las 3 preguntas
        if (newQuestionCount >= 3 && !userContactData) {
          setTimeout(() => {
            setNeedsUserData(true);
          }, 2000);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);

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
    [questionsUsed, messages, userContactData]
  );

  const resetSession = useCallback(async () => {
    setMessages([]);
    setQuestionsUsed(0);
    setHasGreeted(false);
    setCaseLevel('green');
    setCaseSummary(null);
    setUserContactData(null);
    setNeedsUserData(false);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Generar resumen del caso para expertos
  const generateCaseSummary = useCallback(() => {
    const summary = aiService.generateCaseSummary(messages, caseLevel);
    setCaseSummary(summary);
    return summary;
  }, [messages, caseLevel]);

  // Guardar datos de contacto del usuario Y crear lead en Supabase
  const saveUserContactData = useCallback(async (data: UserContactData) => {
    setUserContactData(data);
    setNeedsUserData(false);

    // Generar resumen del caso
    const summary = aiService.generateCaseSummary(messages, caseLevel);
    setCaseSummary(summary);

    // NUEVO: Crear lead real en Supabase
    try {
      console.log('📝 Creando lead en Supabase desde chat IA...');
      
      // Importar leadsService dinámicamente para evitar dependencias circulares
      const { leadsService } = await import('../services/leadsService');

      const leadData = {
        user_id: userId,
        title: summary.userQuery.substring(0, 100) || 'Consulta desde Chat IA',
        description: summary.userQuery || 'Consulta generada por el asistente IA',
        specialty: summary.detectedSpecialties[0] || 'Consultoría General',
        status: 'open' as const,
        priority: summary.urgency as 'low' | 'medium' | 'high' | 'urgent',
        metadata: {
          fromAIChat: true,
          caseLevel: summary.level,
          detectedSpecialties: summary.detectedSpecialties,
          conversationContext: summary.conversationContext.substring(0, 1000), // Limitar tamaño
          userContactData: data,
          generatedAt: summary.generatedAt.toISOString(),
        },
      };

      const createdLead = await leadsService.createLead(leadData);

      if (createdLead) {
        console.log('✅ Lead creado exitosamente:', createdLead.id);
      } else {
        console.error('❌ No se pudo crear el lead');
      }
    } catch (error) {
      console.error('❌ Error creating lead from AI chat:', error);
      // No bloqueamos el flujo si falla la creación del lead
    }
  }, [messages, caseLevel, userId]);

  // Activar solicitud de datos de usuario
  const triggerRequestUserData = useCallback(() => {
    setNeedsUserData(true);
  }, []);

  return {
    messages,
    questionsUsed,
    questionsRemaining: Math.max(0, 3 - questionsUsed),
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
    isLoading,
  };
}