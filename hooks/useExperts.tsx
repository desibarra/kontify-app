import { useContext } from 'react';
import { ExpertsContext } from '../contexts/ExpertsContext';

export function useExperts() {
  const context = useContext(ExpertsContext);
  if (!context) {
    throw new Error('useExperts must be used within ExpertsProvider');
  }
  return context;
}