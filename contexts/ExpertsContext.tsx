import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Expert, Specialty, ServiceType } from '../constants/Types';
import { expertsService } from '../services/expertsService';

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

  const loadExperts = async () => {
    setLoading(true);
    try {
      const data = await expertsService.getAllExperts();
      setExperts(data);
    } catch (error) {
      console.error('Error loading experts:', error);
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
      const results = await expertsService.searchExperts(query, specialty, service);
      setExperts(results);
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