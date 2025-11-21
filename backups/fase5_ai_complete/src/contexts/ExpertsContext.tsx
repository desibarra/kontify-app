import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Expert, Specialty, ServiceType } from '../constants/Types';
import { expertsService } from '../services/expertsService';
import { ExpertWithProfile } from '@/types/supabase';

interface ExpertsContextType {
  experts: Expert[];
  loading: boolean;
  searchExperts: (query: string, specialty?: Specialty, service?: ServiceType) => Promise<void>;
  refreshExperts: () => Promise<void>;
}

export const ExpertsContext = createContext<ExpertsContextType | undefined>(undefined);

export function ExpertsProvider({ children }: { children: ReactNode }) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to map Supabase expert to App expert
  const mapExpert = (e: ExpertWithProfile): Expert => ({
    id: e.id,
    name: e.profile?.full_name || 'Experto',
    email: e.profile?.email || '',
    role: 'expert',
    avatar: e.profile?.avatar_url || 'https://i.pravatar.cc/150',
    phone: '', // Not in DB yet
    specialties: [e.specialty], // DB has single specialty for now, app expects array
    services: [], // Not in DB yet
    hourlyRate: e.hourly_rate,
    rating: e.rating,
    reviewCount: e.total_consultations, // Using consultations as proxy for reviews
    description: e.bio || '',
    experience: `${e.years_experience} años`,
    certifications: e.certifications || [],
    availability: [], // Need to parse JSON
    verified: e.status === 'active',
    approved: e.status === 'active',
    createdAt: new Date(e.created_at),
    testimonials: [], // Not in DB yet
  });

  const loadExperts = async () => {
    setLoading(true);
    try {
      console.log("🔄 INICIANDO CARGA DE EXPERTOS DESDE SUPABASE...");
      const data = await expertsService.getAllExperts();
      console.log("✅ DATOS CRUDOS RECIBIDOS DE SUPABASE:", JSON.stringify(data, null, 2));

      const mappedExperts = data.map(mapExpert);
      console.log("✨ EXPERTOS MAPEADOS PARA UI:", JSON.stringify(mappedExperts, null, 2));

      setExperts(mappedExperts);
    } catch (error) {
      console.error("❌ ERROR CRÍTICO CARGANDO EXPERTOS:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchExperts = async (
    query: string,
    specialty?: Specialty,
    service?: ServiceType
  ) => {
    setLoading(true);
    try {
      // Map app filters to service filters
      const results = await expertsService.searchExperts({
        search: query,
        specialty: specialty as string,
        // service not supported in DB yet
      });
      setExperts(results.map(mapExpert));
    } catch (error) {
      console.error('Error searching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshExperts = async () => {
    await loadExperts();
  };

  useEffect(() => {
    loadExperts();
  }, []);

  return (
    <ExpertsContext.Provider
      value={{
        experts,
        loading,
        searchExperts,
        refreshExperts,
      }}
    >
      {children}
    </ExpertsContext.Provider>
  );
}