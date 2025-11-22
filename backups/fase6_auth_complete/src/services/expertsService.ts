/**
 * EXPERTS SERVICE
 * 
 * Servicio para gestionar expertos usando Supabase
 * Reemplaza el mock data con queries reales a la base de datos
 */

import { supabase } from '@/lib/supabase';
import type {
  Expert,
  ExpertWithProfile,
  ExpertInsert,
  ExpertUpdate
} from '@/types/supabase';

// ============================================
// TYPES
// ============================================

export interface ExpertFilters {
  specialty?: string;
  status?: 'pending' | 'active' | 'inactive' | 'suspended';
  minRating?: number;
  maxHourlyRate?: number;
  search?: string;
}

export interface ExpertStats {
  total_leads: number;
  active_leads: number;
  closed_leads: number;
  unread_messages: number;
  avg_rating: number;
}

// ============================================
// SERVICE
// ============================================

export const expertsService = {
  /**
   * Obtiene todos los expertos activos con sus perfiles
   */
  getAllExperts: async (): Promise<ExpertWithProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('status', 'active')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching experts:', error);
        throw error;
      }

      return (data as ExpertWithProfile[]) || [];
    } catch (error) {
      console.error('Error in getAllExperts:', error);
      return [];
    }
  },

  /**
   * Obtiene un experto por ID con su perfil
   */
  getExpertById: async (id: string): Promise<ExpertWithProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching expert by ID:', error);
        return null;
      }

      return data as ExpertWithProfile;
    } catch (error) {
      console.error('Error in getExpertById:', error);
      return null;
    }
  },

  /**
   * Busca expertos con filtros
   */
  searchExperts: async (filters: ExpertFilters = {}): Promise<ExpertWithProfile[]> => {
    try {
      let query = supabase
        .from('experts')
        .select(`
          *,
          profile:profiles(*)
        `);

      // Filtro por status (default: active)
      if (filters.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.eq('status', 'active');
      }

      // Filtro por especialidad
      if (filters.specialty) {
        query = query.eq('specialty', filters.specialty);
      }

      // Filtro por rating mínimo
      if (filters.minRating) {
        query = query.gte('rating', filters.minRating);
      }

      // Filtro por tarifa máxima
      if (filters.maxHourlyRate) {
        query = query.lte('hourly_rate', filters.maxHourlyRate);
      }

      // Búsqueda por texto (en bio o nombre del perfil)
      if (filters.search) {
        query = query.or(
          `bio.ilike.%${filters.search}%,profile.full_name.ilike.%${filters.search}%`
        );
      }

      // Ordenar por rating
      query = query.order('rating', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error searching experts:', error);
        throw error;
      }

      return (data as ExpertWithProfile[]) || [];
    } catch (error) {
      console.error('Error in searchExperts:', error);
      return [];
    }
  },

  /**
   * Obtiene expertos por especialidad
   */
  getExpertsBySpecialty: async (specialty: string): Promise<ExpertWithProfile[]> => {
    return expertsService.searchExperts({ specialty, status: 'active' });
  },

  /**
   * Obtiene expertos pendientes de aprobación
   */
  getPendingExperts: async (): Promise<ExpertWithProfile[]> => {
    return expertsService.searchExperts({ status: 'pending' });
  },

  /**
   * Aprueba un experto (cambia status a 'active')
   */
  approveExpert: async (expertId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('experts')
        .update({ status: 'active' })
        .eq('id', expertId);

      if (error) {
        console.error('Error approving expert:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in approveExpert:', error);
      return false;
    }
  },

  /**
   * Crea un nuevo experto
   */
  createExpert: async (expertData: ExpertInsert): Promise<Expert | null> => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .insert(expertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating expert:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createExpert:', error);
      return null;
    }
  },

  /**
   * Actualiza un experto
   */
  updateExpert: async (
    expertId: string,
    updates: ExpertUpdate
  ): Promise<Expert | null> => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .update(updates)
        .eq('id', expertId)
        .select()
        .single();

      if (error) {
        console.error('Error updating expert:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateExpert:', error);
      return null;
    }
  },

  /**
   * Obtiene estadísticas de un experto
   */
  getExpertStats: async (expertId: string): Promise<ExpertStats | null> => {
    try {
      const { data, error } = await supabase
        .rpc('get_expert_stats', { expert_uuid: expertId });

      if (error) {
        console.error('Error fetching expert stats:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Error in getExpertStats:', error);
      return null;
    }
  },

  /**
   * Obtiene los mejores expertos (top rated)
   */
  getTopExperts: async (limit: number = 10): Promise<ExpertWithProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('status', 'active')
        .order('rating', { ascending: false })
        .order('total_consultations', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching top experts:', error);
        throw error;
      }

      return (data as ExpertWithProfile[]) || [];
    } catch (error) {
      console.error('Error in getTopExperts:', error);
      return [];
    }
  },

  /**
   * Verifica si un usuario es experto
   */
  isUserExpert: async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select('id')
        .eq('profile_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('Error checking if user is expert:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in isUserExpert:', error);
      return false;
    }
  },

  /**
   * Obtiene el perfil de experto de un usuario
   */
  getExpertByUserId: async (userId: string): Promise<ExpertWithProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('experts')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('profile_id', userId)
        .single();

      if (error) {
        console.error('Error fetching expert by user ID:', error);
        return null;
      }

      return data as ExpertWithProfile;
    } catch (error) {
      console.error('Error in getExpertByUserId:', error);
      return null;
    }
  },
};

export default expertsService;