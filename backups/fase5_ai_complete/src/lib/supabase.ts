/**
 * SUPABASE CLIENT CONFIGURATION
 * 
 * Cliente de Supabase configurado para Expo con:
 * - Persistencia segura de sesión (SecureStore en móvil, localStorage en web)
 * - Auto-refresh de tokens
 * - Manejo de errores
 * 
 * REQUISITOS:
 * - expo-secure-store instalado
 * - Variables de entorno configuradas en .env.local
 */

import './polyfill';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { SupabaseStorageAdapter } from './storage';

// ============================================
// SUPABASE CLIENT
// ============================================

// Validar variables de entorno
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env.local file.'
    );
}

// Crear adapter de storage (Metro resolverá storage.ts o storage.web.ts automáticamente)
const storageAdapter = new SupabaseStorageAdapter();

/**
 * Cliente de Supabase configurado para Expo
 * 
 * Features:
 * - Persistencia segura de sesión
 * - Auto-refresh de tokens
 * - Detección automática de cambios de sesión
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Storage personalizado
        storage: storageAdapter,

        // Auto-refresh de tokens
        autoRefreshToken: true,

        // Detectar cambios de sesión
        detectSessionInUrl: false, // No aplica en mobile

        // Persistir sesión
        persistSession: true,

        // Flow type para mobile
        flowType: 'pkce', // Proof Key for Code Exchange (más seguro)
    },

    // Configuración global
    global: {
        headers: {
            'x-application-name': 'kontify-mobile',
        },
    },
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Obtiene la sesión actual del usuario
 */
export async function getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error getting session:', error);
        return null;
    }

    return session;
}

/**
 * Obtiene el usuario actual
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Error getting user:', error);
        return null;
    }

    return user;
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getCurrentSession();
    return session !== null;
}

/**
 * Cierra la sesión del usuario
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error signing out:', error);
        throw error;
    }
}

/**
 * Escucha cambios en el estado de autenticación
 */
export function onAuthStateChange(
    callback: (event: string, session: any) => void
) {
    return supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        callback(event, session);
    });
}

// ============================================
// EXPORTS
// ============================================

export default supabase;
export type { Database };
