import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';

const STORAGE_BUCKET = 'avatars';

/**
 * Sube una foto de perfil a Supabase Storage
 */
export async function uploadProfilePhoto(
  fileUri: string,
  userId: string
): Promise<{ url: string | null; error: any }> {
  try {
    // Leer el archivo como base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Obtener la extensión del archivo
    const ext = fileUri.split('.').pop() || 'jpg';
    const fileName = `${userId}-${Date.now()}.${ext}`;
    const filePath = `${userId}/${fileName}`;

    // Convertir base64 a ArrayBuffer
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, byteArray, {
        contentType: `image/${ext}`,
        upsert: true,
      });

    if (error) {
      console.error('Error uploading to storage:', error);
      return { url: null, error };
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    console.error('Exception uploading profile photo:', err);
    return { url: null, error: err };
  }
}

/**
 * Elimina una foto de perfil del storage
 */
export async function deleteProfilePhoto(filePath: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting from storage:', error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error('Exception deleting profile photo:', err);
    return { error: err };
  }
}
