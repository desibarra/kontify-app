/**
 * MESSAGES SERVICE
 * 
 * Servicio para gestionar mensajes entre usuarios y expertos usando Supabase
 * Incluye soporte para Realtime y notificaciones
 */

import { supabase } from '@/lib/supabase';
import type { Message } from '@/types/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================
// TYPES
// ============================================

export interface MessageInsert {
  lead_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  attachments?: any[];
  metadata?: Record<string, any>;
}

export interface MessageWithProfiles extends Message {
  sender_profile?: any;
  receiver_profile?: any;
}

// ============================================
// SERVICE
// ============================================

export const messagesService = {
  /**
   * Envía un mensaje
   * RLS: Solo el sender puede crear mensajes (sender_id debe ser auth.uid())
   */
  sendMessage: async (messageData: MessageInsert): Promise<Message | null> => {
    try {
      console.log('📨 Sending message:', {
        lead_id: messageData.lead_id,
        from: messageData.sender_id,
        to: messageData.receiver_id,
      });

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error sending message:', error);
        throw error;
      }

      console.log('✅ Message sent successfully:', data?.id);
      return data;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  },

  /**
   * Obtiene todos los mensajes de un lead
   * RLS: Solo usuarios involucrados en el lead pueden ver mensajes
   */
  getMessagesByLead: async (leadId: string): Promise<MessageWithProfiles[]> => {
    try {
      console.log('🔍 Fetching messages for lead:', leadId);

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(*),
          receiver_profile:profiles!messages_receiver_id_fkey(*)
        `)
        .eq('lead_id', leadId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error fetching messages:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} messages`);
      return (data as MessageWithProfiles[]) || [];
    } catch (error) {
      console.error('Error in getMessagesByLead:', error);
      return [];
    }
  },

  /**
   * Marca un mensaje como leído
   * RLS: Solo el receiver puede marcar sus mensajes como leídos
   */
  markMessageAsRead: async (messageId: string): Promise<boolean> => {
    try {
      console.log('✓ Marking message as read:', messageId);

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) {
        console.error('❌ Error marking message as read:', error);
        return false;
      }

      console.log('✅ Message marked as read');
      return true;
    } catch (error) {
      console.error('Error in markMessageAsRead:', error);
      return false;
    }
  },

  /**
   * Marca todos los mensajes de un lead como leídos
   * RLS: Solo el receiver puede marcar sus mensajes
   */
  markAllMessagesAsRead: async (
    leadId: string,
    receiverId: string
  ): Promise<boolean> => {
    try {
      console.log('✓ Marking all messages as read for lead:', leadId);

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('lead_id', leadId)
        .eq('receiver_id', receiverId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Error marking all messages as read:', error);
        return false;
      }

      console.log('✅ All messages marked as read');
      return true;
    } catch (error) {
      console.error('Error in markAllMessagesAsRead:', error);
      return false;
    }
  },

  /**
   * Obtiene el conteo de mensajes no leídos para un usuario
   */
  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      console.log('🔢 Getting unread count for user:', userId);

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Error getting unread count:', error);
        return 0;
      }

      console.log(`✅ Unread messages: ${count || 0}`);
      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return 0;
    }
  },

  /**
   * Obtiene el conteo de mensajes no leídos por lead
   */
  getUnreadCountByLead: async (
    leadId: string,
    userId: string
  ): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('lead_id', leadId)
        .eq('receiver_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Error getting unread count by lead:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getUnreadCountByLead:', error);
      return 0;
    }
  },

  /**
   * Obtiene las conversaciones (leads con mensajes) de un usuario
   */
  getUserConversations: async (userId: string) => {
    try {
      console.log('💬 Fetching conversations for user:', userId);

      // Obtener leads donde el usuario es owner o experto asignado
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select(`
          *,
          user_profile:profiles!leads_user_id_fkey(*),
          expert_profile:experts!leads_expert_id_fkey(
            *,
            profile:profiles(*)
          )
        `)
        .or(`user_id.eq.${userId},expert_id.in.(select id from experts where profile_id = '${userId}')`)
        .order('updated_at', { ascending: false });

      if (leadsError) {
        console.error('❌ Error fetching conversations:', leadsError);
        return [];
      }

      // Para cada lead, obtener el último mensaje y conteo de no leídos
      const conversations = await Promise.all(
        (leads || []).map(async (lead) => {
          // Último mensaje
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('lead_id', lead.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Conteo de no leídos
          const unreadCount = await messagesService.getUnreadCountByLead(
            lead.id,
            userId
          );

          return {
            ...lead,
            lastMessage,
            unreadCount,
          };
        })
      );

      console.log(`✅ Found ${conversations.length} conversations`);
      return conversations;
    } catch (error) {
      console.error('Error in getUserConversations:', error);
      return [];
    }
  },

  /**
   * Elimina un mensaje
   * Nota: Solo el sender puede eliminar sus propios mensajes
   * (Requiere agregar política RLS custom si se desea esta funcionalidad)
   */
  deleteMessage: async (messageId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting message:', messageId);

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('❌ Error deleting message:', error);
        return false;
      }

      console.log('✅ Message deleted');
      return true;
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      return false;
    }
  },

  // ============================================
  // REALTIME SUBSCRIPTIONS
  // ============================================

  /**
   * Suscribirse a mensajes nuevos de un lead
   * Útil para chat en tiempo real
   */
  subscribeToLeadMessages: (
    leadId: string,
    onNewMessage: (message: Message) => void
  ): RealtimeChannel => {
    console.log('🔔 Subscribing to messages for lead:', leadId);

    const channel = supabase
      .channel(`lead_messages:${leadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `lead_id=eq.${leadId}`,
        },
        (payload) => {
          console.log('📨 New message received:', payload.new);
          onNewMessage(payload.new as Message);
        }
      )
      .subscribe();

    return channel;
  },

  /**
   * Suscribirse a mensajes actualizados (ej: cuando se marcan como leídos)
   */
  subscribeToMessageUpdates: (
    leadId: string,
    onUpdate: (message: Message) => void
  ): RealtimeChannel => {
    console.log('🔔 Subscribing to message updates for lead:', leadId);

    const channel = supabase
      .channel(`lead_message_updates:${leadId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `lead_id=eq.${leadId}`,
        },
        (payload) => {
          console.log('✏️ Message updated:', payload.new);
          onUpdate(payload.new as Message);
        }
      )
      .subscribe();

    return channel;
  },

  /**
   * Suscribirse a contador de no leídos para un usuario
   */
  subscribeToUnreadCount: (
    userId: string,
    onCountChange: (count: number) => void
  ): RealtimeChannel => {
    console.log('🔔 Subscribing to unread count for user:', userId);

    const channel = supabase
      .channel(`user_unread_count:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        async () => {
          // Recalcular contador cuando cambia algo
          const count = await messagesService.getUnreadCount(userId);
          onCountChange(count);
        }
      )
      .subscribe();

    return channel;
  },

  /**
   * Desuscribirse de un canal
   */
  unsubscribe: async (channel: RealtimeChannel): Promise<void> => {
    await supabase.removeChannel(channel);
    console.log('🔕 Unsubscribed from channel');
  },
};

export default messagesService;
