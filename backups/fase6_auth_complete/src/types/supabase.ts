/**
 * SUPABASE DATABASE TYPES
 * 
 * Este archivo contiene los tipos TypeScript generados desde el schema de Supabase.
 * 
 * IMPORTANTE: Este archivo debe ser regenerado cada vez que cambies el schema.
 * 
 * Para regenerar:
 * 1. Asegúrate de tener Supabase CLI instalado
 * 2. Ejecuta: npx supabase gen types typescript --local > src/types/supabase.ts
 * 
 * O si usas Supabase Cloud:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    role: 'user' | 'expert' | 'admin'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'expert' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'user' | 'expert' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
            }
            experts: {
                Row: {
                    id: string
                    profile_id: string
                    specialty: string
                    rating: number
                    hourly_rate: number
                    status: 'pending' | 'active' | 'inactive' | 'suspended'
                    bio: string | null
                    years_experience: number
                    certifications: string[] | null
                    languages: string[]
                    availability_hours: Json
                    total_consultations: number
                    total_revenue: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    profile_id: string
                    specialty: string
                    rating?: number
                    hourly_rate?: number
                    status?: 'pending' | 'active' | 'inactive' | 'suspended'
                    bio?: string | null
                    years_experience?: number
                    certifications?: string[] | null
                    languages?: string[]
                    availability_hours?: Json
                    total_consultations?: number
                    total_revenue?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    profile_id?: string
                    specialty?: string
                    rating?: number
                    hourly_rate?: number
                    status?: 'pending' | 'active' | 'inactive' | 'suspended'
                    bio?: string | null
                    years_experience?: number
                    certifications?: string[] | null
                    languages?: string[]
                    availability_hours?: Json
                    total_consultations?: number
                    total_revenue?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            leads: {
                Row: {
                    id: string
                    user_id: string
                    expert_id: string | null
                    title: string
                    description: string
                    specialty: string
                    status: 'open' | 'in_progress' | 'closed' | 'cancelled'
                    priority: 'low' | 'medium' | 'high' | 'urgent'
                    budget: number | null
                    estimated_hours: number | null
                    deadline: string | null
                    metadata: Json
                    created_at: string
                    updated_at: string
                    closed_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    expert_id?: string | null
                    title: string
                    description: string
                    specialty: string
                    status?: 'open' | 'in_progress' | 'closed' | 'cancelled'
                    priority?: 'low' | 'medium' | 'high' | 'urgent'
                    budget?: number | null
                    estimated_hours?: number | null
                    deadline?: string | null
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                    closed_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    expert_id?: string | null
                    title?: string
                    description?: string
                    specialty?: string
                    status?: 'open' | 'in_progress' | 'closed' | 'cancelled'
                    priority?: 'low' | 'medium' | 'high' | 'urgent'
                    budget?: number | null
                    estimated_hours?: number | null
                    deadline?: string | null
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                    closed_at?: string | null
                }
            }
            messages: {
                Row: {
                    id: string
                    lead_id: string
                    sender_id: string
                    receiver_id: string
                    content: string
                    is_read: boolean
                    read_at: string | null
                    attachments: Json
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    lead_id: string
                    sender_id: string
                    receiver_id: string
                    content: string
                    is_read?: boolean
                    read_at?: string | null
                    attachments?: Json
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    lead_id?: string
                    sender_id?: string
                    receiver_id?: string
                    content?: string
                    is_read?: boolean
                    read_at?: string | null
                    attachments?: Json
                    metadata?: Json
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_expert_stats: {
                Args: {
                    expert_uuid: string
                }
                Returns: {
                    total_leads: number
                    active_leads: number
                    closed_leads: number
                    unread_messages: number
                    avg_rating: number
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// ============================================
// HELPER TYPES
// ============================================

export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row']

export type Inserts<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Insert']

export type Updates<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
    Database['public']['Enums'][T]

// ============================================
// CONVENIENCE TYPES
// ============================================

export type Profile = Tables<'profiles'>
export type Expert = Tables<'experts'>
export type Lead = Tables<'leads'>
export type Message = Tables<'messages'>

export type ProfileInsert = Inserts<'profiles'>
export type ExpertInsert = Inserts<'experts'>
export type LeadInsert = Inserts<'leads'>
export type MessageInsert = Inserts<'messages'>

export type ProfileUpdate = Updates<'profiles'>
export type ExpertUpdate = Updates<'experts'>
export type LeadUpdate = Updates<'leads'>
export type MessageUpdate = Updates<'messages'>

// ============================================
// EXTENDED TYPES (con relaciones)
// ============================================

export interface ExpertWithProfile extends Expert {
    profile: Profile
}

export interface LeadWithExpert extends Lead {
    expert: ExpertWithProfile | null
}

export interface LeadWithMessages extends Lead {
    messages: Message[]
    unread_count: number
}

export interface MessageWithProfiles extends Message {
    sender: Profile
    receiver: Profile
}

// ============================================
// FUNCTION RETURN TYPES
// ============================================

export type ExpertStats = {
    total_leads: number
    active_leads: number
    closed_leads: number
    unread_messages: number
    avg_rating: number
}
