import { useState, useCallback } from 'react';
import { AIMessage, AISession, CaseLevel, CaseSummary, UserContactData } from '../constants/Types';
import { aiService } from '../services/aiService';

export function useAIAssistant(userId: string) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente fiscal de Kontify+. Puedo ayudarte con preguntas sobre IVA, ISR, deducciones, facturación y más. Tienes 3 preguntas gratuitas. ¿En qué puedo asistirte?',
      timestamp: new Date(),
    },
  ]);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // NEW: Case classification states
  const [caseLevel, setCaseLevel] = useState<CaseLevel>('green');
  const [caseSummary, setCaseSummary] = useState<CaseSummary | null>(null);
  const [userContactData, setUserContactData] = useState<UserContactData | null>(null);
  const [needsUserData, setNeedsUserData] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      if (questionsUsed >= 3) {
        return;
      }

      // Add user message
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

        // NEW: Classify case level
        const level = aiService.classifyCase(content, messages);
        setCaseLevel(level);

        // Get AI response
        const response = await aiService.generateResponse(content, newQuestionCount);

        const aiMessage: AIMessage = {
          id: `msg_${Date.now()}_ai`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);

        // NEW: Trigger user data request for yellow/red cases or after 3rd question
        if ((level === 'yellow' || level === 'red') && !userContactData) {
          setNeedsUserData(true);
        } else if (newQuestionCount >= 3 && !userContactData) {
          setNeedsUserData(true);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
      } finally {
        setIsTyping(false);
      }
    },
    [questionsUsed]
  );

  const resetSession = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: '¡Hola! Soy tu asistente fiscal de Kontify+. Puedo ayudarte con preguntas sobre IVA, ISR, deducciones, facturación y más. Tienes 3 preguntas gratuitas. ¿En qué puedo asistirte?',
        timestamp: new Date(),
      },
    ]);
    setQuestionsUsed(0);
    setCaseLevel('green');
    setCaseSummary(null);
    setUserContactData(null);
    setNeedsUserData(false);
  }, []);

  // NEW: Generate case summary
  const generateCaseSummary = useCallback(() => {
    const summary = aiService.generateCaseSummary(messages, caseLevel);
    setCaseSummary(summary);
    return summary;
  }, [messages, caseLevel]);

  // NEW: Save user contact data
  const saveUserContactData = useCallback((data: UserContactData) => {
    setUserContactData(data);
    setNeedsUserData(false);
  }, []);

  // NEW: Trigger request for user data
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
    // NEW: Case classification
    caseLevel,
    caseSummary,
    userContactData,
    needsUserData,
    generateCaseSummary,
    saveUserContactData,
    triggerRequestUserData,
  };
}