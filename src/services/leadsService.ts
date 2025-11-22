/**
 * LEADS SERVICE
 * 
 * Servicio para gestionar leads (solicitudes de consulta) usando Supabase
 * Conecta los leads generados por IA con expertos reales
 */

import { supabase } from '@/lib/supabase';
import type { Lead } from '@/types/supabase';

// ============================================
// TYPES
// ============================================

export interface LeadInsert {
  user_id: string;
  expert_id?: string | null;
  title: string;
  description: string;
  specialty: string;
  status?: 'open' | 'in_progress' | 'closed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  budget?: number;
  estimated_hours?: number;
  deadline?: string;
  metadata?: Record<string, any>;
}

export interface LeadUpdate {
  expert_id?: string | null;
  title?: string;
  description?: string;
  specialty?: string;
  status?: 'open' | 'in_progress' | 'closed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  budget?: number;
  estimated_hours?: number;
  deadline?: string;
  metadata?: Record<string, any>;
}

export interface LeadWithProfiles extends Lead {
  user_profile?: any;
  expert_profile?: any;
}

// ============================================
// SERVICE
// ============================================

export const leadsService = {
  /**
   * Crea un nuevo lead
   * RLS: Solo el usuario puede crear sus propios leads (user_id debe ser auth.uid())
   */
  createLead: async (leadData: LeadInsert): Promise<Lead | null> => {
    try {
      console.log('📝 Creating lead:', leadData);

      const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating lead:', error);
        throw error;
      }

      console.log('✅ Lead created successfully:', data?.id);
      return data;
    } catch (error) {
      console.error('Error in createLead:', error);
      return null;
    }
  },

  /**
   * Obtiene todos los leads de un usuario
   * RLS: Los usuarios solo pueden ver sus propios leads
   */
  getLeadsByUser: async (userId: string): Promise<LeadWithProfiles[]> => {
    try {
      console.log('🔍 Fetching leads for user:', userId);

      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          user_profile:profiles!leads_user_id_fkey(*),
          expert_profile:experts!leads_expert_id_fkey(
            *,
            profile:profiles(*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching user leads:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} leads for user`);
      return (data as LeadWithProfiles[]) || [];
    } catch (error) {
      console.error('Error in getLeadsByUser:', error);
      return [];
    }
  },

  /**
   * Obtiene todos los leads asignados a un experto
   * RLS: Los expertos solo pueden ver leads asignados a ellos
   */
  getLeadsAssignedToExpert: async (expertId: string): Promise<LeadWithProfiles[]> => {
    try {
      console.log('🔍 Fetching leads for expert:', expertId);

      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          user_profile:profiles!leads_user_id_fkey(*),
          expert_profile:experts!leads_expert_id_fkey(
            *,
            profile:profiles(*)
          )
        `)
        .eq('expert_id', expertId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching expert leads:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} leads for expert`);
      return (data as LeadWithProfiles[]) || [];
    } catch (error) {
      console.error('Error in getLeadsAssignedToExpert:', error);
      return [];
    }
  },

  /**
   * Obtiene leads abiertos (sin asignar)
   * Útil para que expertos vean leads disponibles
   */
  getOpenLeads: async (): Promise<LeadWithProfiles[]> => {
    try {
      console.log('🔍 Fetching open leads');

      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          user_profile:profiles!leads_user_id_fkey(*)
        `)
        .eq('status', 'open')
        .is('expert_id', null)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching open leads:', error);
        throw error;
      }

      console.log(`✅ Found ${data?.length || 0} open leads`);
      return (data as LeadWithProfiles[]) || [];
    } catch (error) {
      console.error('Error in getOpenLeads:', error);
      return [];
    }
  },

  /**
   * Obtiene un lead por ID
   * RLS: Solo el usuario o el experto asignado pueden ver el lead
   */
  getLeadById: async (leadId: string): Promise<LeadWithProfiles | null> => {
    try {
      console.log('🔍 Fetching lead:', leadId);

      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          user_profile:profiles!leads_user_id_fkey(*),
          expert_profile:experts!leads_expert_id_fkey(
            *,
            profile:profiles(*)
          )
        `)
        .eq('id', leadId)
        .single();

      if (error) {
        console.error('❌ Error fetching lead:', error);
        return null;
      }

      console.log('✅ Lead found');
      return data as LeadWithProfiles;
    } catch (error) {
      console.error('Error in getLeadById:', error);
      return null;
    }
  },

  /**
   * Actualiza un lead
   * RLS: Solo el usuario o el experto asignado pueden actualizar
   */
  updateLead: async (
    leadId: string,
    updates: LeadUpdate
  ): Promise<Lead | null> => {
    try {
      console.log('✏️ Updating lead:', leadId, updates);

      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating lead:', error);
        throw error;
      }

      console.log('✅ Lead updated successfully');
      return data;
    } catch (error) {
      console.error('Error in updateLead:', error);
      return null;
    }
  },

  /**
   * Actualiza el status de un lead
   * RLS: Solo el usuario o el experto asignado pueden actualizar
   */
  updateLeadStatus: async (
    leadId: string,
    status: 'open' | 'in_progress' | 'closed' | 'cancelled'
  ): Promise<boolean> => {
    try {
      console.log('✏️ Updating lead status:', leadId, status);

      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) {
        console.error('❌ Error updating lead status:', error);
        return false;
      }

      console.log('✅ Lead status updated');
      return true;
    } catch (error) {
      console.error('Error in updateLeadStatus:', error);
      return false;
    }
  },

  /**
   * Asigna un experto a un lead
   * Cambia el status a 'in_progress' automáticamente
   */
  assignExpertToLead: async (
    leadId: string,
    expertId: string
  ): Promise<boolean> => {
    try {
      console.log('👤 Assigning expert to lead:', { leadId, expertId });

      const { error } = await supabase
        .from('leads')
        .update({
          expert_id: expertId,
          status: 'in_progress',
        })
        .eq('id', leadId);

      if (error) {
        console.error('❌ Error assigning expert:', error);
        return false;
      }

      console.log('✅ Expert assigned successfully');
      return true;
    } catch (error) {
      console.error('Error in assignExpertToLead:', error);
      return false;
    }
  },

  /**
   * Elimina un lead
   * RLS: Solo el usuario puede eliminar sus propios leads
   */
  deleteLead: async (leadId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting lead:', leadId);

      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) {
        console.error('❌ Error deleting lead:', error);
        return false;
      }

      console.log('✅ Lead deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteLead:', error);
      return false;
    }
  },

  /**
   * Obtiene estadísticas de leads de un usuario
   */
  getUserLeadStats: async (userId: string) => {
    try {
      const leads = await leadsService.getLeadsByUser(userId);

      const stats = {
        total: leads.length,
        open: leads.filter(l => l.status === 'open').length,
        in_progress: leads.filter(l => l.status === 'in_progress').length,
        closed: leads.filter(l => l.status === 'closed').length,
        cancelled: leads.filter(l => l.status === 'cancelled').length,
        by_priority: {
          low: leads.filter(l => l.priority === 'low').length,
          medium: leads.filter(l => l.priority === 'medium').length,
          high: leads.filter(l => l.priority === 'high').length,
          urgent: leads.filter(l => l.priority === 'urgent').length,
        },
      };

      return stats;
    } catch (error) {
      console.error('Error in getUserLeadStats:', error);
      return null;
    }
  },

  /**
   * Obtiene estadísticas de leads de un experto
   */
  getExpertLeadStats: async (expertId: string) => {
    try {
      const leads = await leadsService.getLeadsAssignedToExpert(expertId);

      const stats = {
        total: leads.length,
        open: leads.filter(l => l.status === 'open').length,
        in_progress: leads.filter(l => l.status === 'in_progress').length,
        closed: leads.filter(l => l.status === 'closed').length,
        cancelled: leads.filter(l => l.status === 'cancelled').length,
        by_priority: {
          low: leads.filter(l => l.priority === 'low').length,
          medium: leads.filter(l => l.priority === 'medium').length,
          high: leads.filter(l => l.priority === 'high').length,
          urgent: leads.filter(l => l.priority === 'urgent').length,
        },
        by_specialty: leads.reduce((acc, lead) => {
          acc[lead.specialty] = (acc[lead.specialty] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };

      return stats;
    } catch (error) {
      console.error('Error in getExpertLeadStats:', error);
      return null;
    }
  },
};

export default leadsService;
