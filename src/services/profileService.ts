import { supabase } from '@/lib/supabase';

export type UserRole = 'user' | 'expert' | 'admin';

/**
 * Actualiza el rol del usuario en la tabla profiles
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Exception updating user role:', err);
    return { error: err };
  }
}

/**
 * Actualiza la foto de perfil del usuario
 */
export async function updateProfileAvatar(userId: string, avatarUrl: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', userId);

    if (error) {
      console.error('Error updating avatar:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Exception updating avatar:', err);
    return { error: err };
  }
}

/**
 * Obtiene el perfil completo del usuario
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Exception fetching user profile:', err);
    return { data: null, error: err };
  }
}
