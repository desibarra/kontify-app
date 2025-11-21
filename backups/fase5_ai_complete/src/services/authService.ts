/**
 * AUTH SERVICE
 * 
 * Servicio de autenticación usando Supabase Auth
 * Maneja registro, login, logout y gestión de sesiones
 */

import { supabase } from '@/lib/supabase';
import type { Profile, ProfileInsert } from '@/types/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

// ============================================
// TYPES
// ============================================

export interface SignUpData {
    email: string;
    password: string;
    fullName: string;
    role?: 'user' | 'expert' | 'admin';
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

export interface ProfileResponse {
    profile: Profile | null;
    error: Error | null;
}

// ============================================
// SERVICE
// ============================================

export const authService = {
    /**
     * Registra un nuevo usuario
     */
    signUp: async (data: SignUpData): Promise<AuthResponse> => {
        try {
            // 1. Crear usuario en Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                    },
                },
            });

            if (authError) {
                console.error('Error signing up:', authError);
                return {
                    user: null,
                    session: null,
                    error: authError,
                };
            }

            // 2. Verificar que el perfil se creó (el trigger debería hacerlo automáticamente)
            if (authData.user) {
                // Esperar un momento para que el trigger se ejecute
                await new Promise(resolve => setTimeout(resolve, 500));

                // Verificar si el perfil existe
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authData.user.id)
                    .single();

                // Si el perfil no existe, crearlo manualmente (doble seguridad)
                if (profileError || !profile) {
                    console.log('Profile not found, creating manually...');

                    const { error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: authData.user.id,
                            email: data.email,
                            full_name: data.fullName,
                            role: data.role || 'user',
                        });

                    if (insertError) {
                        console.error('Error creating profile:', insertError);
                    }
                }
            }

            return {
                user: authData.user,
                session: authData.session,
                error: null,
            };
        } catch (error) {
            console.error('Error in signUp:', error);
            return {
                user: null,
                session: null,
                error: error as AuthError,
            };
        }
    },

    /**
     * Inicia sesión con email y contraseña
     */
    signIn: async (data: SignInData): Promise<AuthResponse> => {
        try {
            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                console.error('Error signing in:', error);
                return {
                    user: null,
                    session: null,
                    error,
                };
            }

            return {
                user: authData.user,
                session: authData.session,
                error: null,
            };
        } catch (error) {
            console.error('Error in signIn:', error);
            return {
                user: null,
                session: null,
                error: error as AuthError,
            };
        }
    },

    /**
     * Cierra la sesión del usuario
     */
    signOut: async (): Promise<{ error: AuthError | null }> => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Error signing out:', error);
                return { error };
            }

            return { error: null };
        } catch (error) {
            console.error('Error in signOut:', error);
            return { error: error as AuthError };
        }
    },

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser: async (): Promise<User | null> => {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Error getting current user:', error);
                return null;
            }

            return user;
        } catch (error) {
            console.error('Error in getCurrentUser:', error);
            return null;
        }
    },

    /**
     * Obtiene la sesión actual
     */
    getCurrentSession: async (): Promise<Session | null> => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting current session:', error);
                return null;
            }

            return session;
        } catch (error) {
            console.error('Error in getCurrentSession:', error);
            return null;
        }
    },

    /**
     * Verifica si el usuario está autenticado
     */
    isAuthenticated: async (): Promise<boolean> => {
        const session = await authService.getCurrentSession();
        return session !== null;
    },

    /**
     * Obtiene el perfil del usuario actual
     */
    getCurrentProfile: async (): Promise<ProfileResponse> => {
        try {
            const user = await authService.getCurrentUser();

            if (!user) {
                return {
                    profile: null,
                    error: new Error('No user logged in'),
                };
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                return {
                    profile: null,
                    error: new Error(error.message),
                };
            }

            return {
                profile,
                error: null,
            };
        } catch (error) {
            console.error('Error in getCurrentProfile:', error);
            return {
                profile: null,
                error: error as Error,
            };
        }
    },

    /**
     * Actualiza el perfil del usuario actual
     */
    updateProfile: async (updates: Partial<ProfileInsert>): Promise<ProfileResponse> => {
        try {
            const user = await authService.getCurrentUser();

            if (!user) {
                return {
                    profile: null,
                    error: new Error('No user logged in'),
                };
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) {
                console.error('Error updating profile:', error);
                return {
                    profile: null,
                    error: new Error(error.message),
                };
            }

            return {
                profile,
                error: null,
            };
        } catch (error) {
            console.error('Error in updateProfile:', error);
            return {
                profile: null,
                error: error as Error,
            };
        }
    },

    /**
     * Envía un email de recuperación de contraseña
     */
    resetPassword: async (email: string): Promise<{ error: AuthError | null }> => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'kontify://reset-password',
            });

            if (error) {
                console.error('Error sending password reset email:', error);
                return { error };
            }

            return { error: null };
        } catch (error) {
            console.error('Error in resetPassword:', error);
            return { error: error as AuthError };
        }
    },

    /**
     * Actualiza la contraseña del usuario
     */
    updatePassword: async (newPassword: string): Promise<{ error: AuthError | null }> => {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                console.error('Error updating password:', error);
                return { error };
            }

            return { error: null };
        } catch (error) {
            console.error('Error in updatePassword:', error);
            return { error: error as AuthError };
        }
    },

    /**
     * Escucha cambios en el estado de autenticación
     */
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
        return supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event);
            callback(event, session);
        });
    },

    /**
     * Refresca la sesión actual
     */
    refreshSession: async (): Promise<{ session: Session | null; error: AuthError | null }> => {
        try {
            const { data, error } = await supabase.auth.refreshSession();

            if (error) {
                console.error('Error refreshing session:', error);
                return { session: null, error };
            }

            return { session: data.session, error: null };
        } catch (error) {
            console.error('Error in refreshSession:', error);
            return { session: null, error: error as AuthError };
        }
    },
};

export default authService;
