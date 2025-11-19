export type UserRole = 'entrepreneur' | 'expert' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  company?: string;
  createdAt: Date;
}

export interface Expert extends User {
  role: 'expert';
  specialties: string[];
  services: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  description: string;
  experience: string;
  certifications: string[];
  availability: string[];
  verified: boolean;
  approved: boolean;
  testimonials: Testimonial[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface Booking {
  id: string;
  entrepreneurId: string;
  expertId: string;
  expertName: string;
  expertAvatar?: string;
  service: string;
  date: Date;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  totalCost: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AISession {
  id: string;
  userId: string;
  messages: AIMessage[];
  questionsUsed: number;
  createdAt: Date;
}

export type Specialty = 
  | 'IVA' 
  | 'ISR' 
  | 'Nómina' 
  | 'Deducciones' 
  | 'Facturación Electrónica'
  | 'Declaraciones'
  | 'Auditoría'
  | 'Planeación Fiscal';

export type ServiceType =
  | 'Consultoría General'
  | 'Revisión de Declaraciones'
  | 'Optimización Fiscal'
  | 'Asesoría en Auditoría'
  | 'Capacitación'
  | 'Resolución de Controversias';

// ============================================
// NEW TYPES FOR AI → EXPERT FLOW
// ============================================

export type CaseLevel = 'green' | 'yellow' | 'red';

export interface UserContactData {
  name: string;
  email: string;
  whatsapp: string;
}

export interface CaseSummary {
  level: CaseLevel;
  detectedSpecialties: Specialty[];
  userQuery: string;
  conversationContext: string;
  urgency: 'low' | 'medium' | 'high';
  generatedAt: Date;
}

export interface AIRecommendation {
  specialty: Specialty;
  confidence: number;
  reason: string;
}

export interface ExtendedBooking extends Booking {
  caseSummary?: CaseSummary;
  userContactData?: UserContactData;
  caseLevel?: CaseLevel;
  aiRecommendations?: AIRecommendation[];
}