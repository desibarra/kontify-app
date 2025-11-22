import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter, useSegments } from 'expo-router';
import { getCurrentProfile, type Profile } from '@/services/profileService';

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Cargar perfil del usuario
  const loadProfile = async (userId: string) => {
    try {
      console.log('👤 Loading user profile...');
      const { data, error } = await getCurrentProfile();

      if (error) {
        console.error('❌ Error loading profile:', error);
        setProfile(null);
        return;
      }

      if (data) {
        console.log('✅ Profile loaded:', data.email, '- Role:', data.role);
        setProfile(data);
      }
    } catch (error) {
      console.error('Exception loading profile:', error);
      setProfile(null);
    }
  };

  // Función para refrescar el perfil manualmente
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  // Inicializar sesión y escuchar cambios
  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Cargar perfil si hay usuario autenticado
      if (session?.user) {
        await loadProfile(session.user.id);
      }

      setIsLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔐 Auth state changed:', _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);

      // Cargar perfil cuando el usuario inicia sesión
      if (session?.user && _event === 'SIGNED_IN') {
        await loadProfile(session.user.id);
      }

      // Limpiar perfil cuando el usuario cierra sesión
      if (_event === 'SIGNED_OUT') {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Protección de rutas (middleware)
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!session && inTabsGroup) {
      // Usuario no autenticado intentando acceder a app -> Login
      console.log('🚫 No auth, redirecting to login');
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Usuario autenticado en pantalla de login -> App
      console.log('✅ Already authenticated, redirecting to app');
      router.replace('/(tabs)');
    }
  }, [session, segments, isLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}