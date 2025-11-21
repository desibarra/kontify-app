/**
 * SUPABASE CLIENT CONFIGURATION
 * 
 * Cliente de Supabase configurado para Expo con:
 * - Persistencia segura de sesión (SecureStore en móvil, localStorage en web)
 * - Auto-refresh de tokens
 * - Manejo de errores
 * - Lazy initialization (build-time safe para Vercel)
 * 
 * REQUISITOS:
 * - expo-secure-store instalado
 * - Variables de entorno configuradas en .env.local o Vercel Dashboard
 */

import './polyfill';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { SupabaseStorageAdapter } from './storage';

// ============================================
// SUPABASE CLIENT (LAZY INITIALIZATION)
// ============================================

let supabaseInstance: SupabaseClient<Database> | null = null;

/**
 * Obtiene o crea la instancia de Supabase (Lazy Initialization)
 * Esto permite que el build pase sin crashear cuando las env vars están vacías
 */
function getSupabaseClient(): SupabaseClient<Database> {
    // Si ya existe la instancia, devolverla
    if (supabaseInstance) {
        return supabaseInstance;
    }

    // Leer variables de entorno (pueden estar vacías en build time)
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

    // Validar en runtime (cuando se intenta usar)
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            '❌ Supabase credentials missing!\n' +
            'Please configure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY\n' +
            'in .env.local (local) or Vercel Dashboard (production)'
        );
    }

    // Crear adapter de storage (Metro resolverá .ts o .web.ts automáticamente)
    const storageAdapter = new SupabaseStorageAdapter();

    // Crear y cachear la instancia
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
            storage: storageAdapter,
            autoRefreshToken: true,
            detectSessionInUrl: false,
            persistSession: true,
            flowType: 'pkce',
        },
        global: {
            headers: {
                'x-application-name': 'kontify-mobile',
            },
        },
    });

    return supabaseInstance;
}

/**
 * Cliente de Supabase configurado para Expo
 * 
 * IMPORTANTE: Usa lazy initialization para evitar errores en build time.
 * El cliente se crea solo cuando se accede por primera vez (en runtime).
 */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
    get(target, prop) {
        const client = getSupabaseClient();
        const value = (client as any)[prop];
        return typeof value === 'function' ? value.bind(client) : value;
    }
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
