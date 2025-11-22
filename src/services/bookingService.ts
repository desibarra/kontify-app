/**
 * BOOKING SERVICE
 * 
 * Servicio para gestionar reservas/consultas (implementado usando leadsService)
 * Mantiene compatibilidad con la interfaz antigua mientras usa Supabase
 */

import { Booking } from '../constants/Types';
import { leadsService, LeadInsert } from './leadsService';
import type { Lead } from '@/types/supabase';

// ============================================
// MAPPERS: Convertir entre Booking y Lead
// ============================================

const leadToBooking = (lead: Lead): Booking => {
  return {
    id: lead.id,
    entrepreneurId: lead.user_id,
    expertId: lead.expert_id || '',
    service: lead.specialty as any, // Mapear specialty a service
    date: lead.created_at,
    status: mapLeadStatusToBookingStatus(lead.status),
    notes: lead.description,
  };
};

const mapLeadStatusToBookingStatus = (
  status: string
): 'pending' | 'confirmed' | 'completed' | 'cancelled' => {
  switch (status) {
    case 'open':
      return 'pending';
    case 'in_progress':
      return 'confirmed';
    case 'closed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

const mapBookingStatusToLeadStatus = (
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): 'open' | 'in_progress' | 'closed' | 'cancelled' => {
  switch (status) {
    case 'pending':
      return 'open';
    case 'confirmed':
      return 'in_progress';
    case 'completed':
      return 'closed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'open';
  }
};

// ============================================
// SERVICE
// ============================================

export const bookingService = {
  /**
   * Crea una nueva reserva (lead)
   * Ahora conectado a Supabase a través de leadsService
   */
  createBooking: async (
    bookingData: Omit<Booking, 'id' | 'status'>
  ): Promise<Booking> => {
    try {
      console.log('📝 Creating booking (lead):', bookingData);

      const leadData: LeadInsert = {
        user_id: bookingData.entrepreneurId,
        expert_id: bookingData.expertId || null,
        title: `Consulta de ${bookingData.service}`,
        description: bookingData.notes || 'Consulta solicitada',
        specialty: bookingData.service as string,
        status: 'open',
        priority: 'medium',
        metadata: {
          originalBookingDate: bookingData.date,
        },
      };

      const lead = await leadsService.createLead(leadData);

      if (!lead) {
        throw new Error('Failed to create lead');
      }

      console.log('✅ Booking (lead) created successfully');
      return leadToBooking(lead);
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Obtiene las reservas (leads) de un usuario
   */
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    try {
      console.log('🔍 Fetching user bookings (leads):', userId);

      const leads = await leadsService.getLeadsByUser(userId);
      const bookings = leads.map(leadToBooking);

      console.log(`✅ Found ${bookings.length} bookings`);
      return bookings;
    } catch (error) {
      console.error('❌ Error fetching user bookings:', error);
      return [];
    }
  },

  /**
   * Obtiene las reservas (leads) asignadas a un experto
   */
  getExpertBookings: async (expertId: string): Promise<Booking[]> => {
    try {
      console.log('🔍 Fetching expert bookings (leads):', expertId);

      const leads = await leadsService.getLeadsAssignedToExpert(expertId);
      const bookings = leads.map(leadToBooking);

      console.log(`✅ Found ${bookings.length} expert bookings`);
      return bookings;
    } catch (error) {
      console.error('❌ Error fetching expert bookings:', error);
      return [];
    }
  },

  /**
   * Actualiza el status de una reserva (lead)
   */
  updateBookingStatus: async (
    bookingId: string,
    status: Booking['status']
  ): Promise<boolean> => {
    try {
      console.log('✏️ Updating booking status:', { bookingId, status });

      const leadStatus = mapBookingStatusToLeadStatus(status);
      const success = await leadsService.updateLeadStatus(bookingId, leadStatus);

      if (success) {
        console.log('✅ Booking status updated');
      } else {
        console.log('❌ Failed to update booking status');
      }

      return success;
    } catch (error) {
      console.error('❌ Error updating booking status:', error);
      return false;
    }
  },
};

export default bookingService;