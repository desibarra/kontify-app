/**
 * PROFILE SERVICE (VERSIÓN ESTABLE)
 * Corrige fallos de .single(), problemas de RLS y race conditions después de signUp
 */

import { supabase } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export type UserRole = 'user' | 'expert' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ============================================
// HELPERS
// ============================================

/**
 * Espera hasta que exista un registro en profiles (máx 2 segundos)
 */
async function waitForProfile(userId: string) {
  const maxAttempts = 10;
  const delay = 200; // ms

  for (let i = 0; i < maxAttempts; i++) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle(); // ← evita fallas

    if (data) return data;

    await new Promise(res => setTimeout(res, delay));
  }

  return null;
}

// ============================================
// SERVICE
// ============================================

export async function getCurrentProfile(): Promise<{ data: Profile | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: new Error("No authenticated user") };
    }

    return getUserProfile(user.id);
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Obtiene el perfil completo por ID (versión estable)
 */
export async function getUserProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
  try {
    console.log("🔍 Fetching profile", userId);

    // 1) Intentar obtenerlo normal
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    // 2) Si no existe aún → esperar a que el trigger lo cree
    if (!data) {
      console.log("⏳ Profile not found, waiting...");
      data = await waitForProfile(userId);
    }

    if (!data) {
      return { data: null, error: new Error("Profile not found") };
    }

    return { data: data as Profile, error: null };
  } catch (err) {
    console.error("❌ Error getUserProfile:", err);
    return { data: null, error: err };
  }
}

// ============================================
// UPDATE FUNCTIONS
// (se mantienen sin cambios porque ya estaban bien)
// ============================================

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
}

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    console.log(`🔄 Updating user ${userId} role to ${role}`);
    
    const { error, data } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select();

    if (error) {
      console.error('❌ Error updating role:', error);
      return { error };
    }

    console.log('✅ Role updated successfully:', data);
    return { error: null };
  } catch (err) {
    console.error('❌ Exception in updateUserRole:', err);
    return { error: err };
  }
}

export async function updateProfileAvatar(userId: string, avatarUrl: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);
  return { error };
}
