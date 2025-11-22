import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/useAuth';
import { uploadProfilePhoto } from '@/services/storageService';
import { updateProfileAvatar } from '@/services/profileService';

interface ProfileAvatarUploadProps {
  currentAvatarUrl?: string | null;
  onUploadComplete?: (avatarUrl: string) => void;
  size?: number;
}

export function ProfileAvatarUpload({
  currentAvatarUrl,
  onUploadComplete,
  size = 120,
}: ProfileAvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(
    currentAvatarUrl || null
  );
  const { user } = useAuth();

  const pickImage = async () => {
    // Pedir permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a tu galería para subir una foto de perfil.'
      );
      return;
    }

    // Abrir selector de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Pedir permisos de cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Necesitamos acceso a tu cámara para tomar una foto de perfil.'
      );
      return;
    }

    // Abrir cámara
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (fileUri: string) => {
    if (!user?.id) {
      Alert.alert('Error', 'No se pudo identificar al usuario');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Subir imagen a Supabase Storage
      const { publicUrl, error: uploadError } = await uploadProfilePhoto(
        fileUri,
        user.id
      );

      if (uploadError) {
        throw uploadError;
      }

      if (!publicUrl) {
        throw new Error('No se obtuvo URL pública');
      }

      // 2. Actualizar perfil en base de datos
      const { error: updateError } = await updateProfileAvatar(
        user.id,
        publicUrl
      );

      if (updateError) {
        throw updateError;
      }

      // 3. Actualizar UI
      setAvatarUri(publicUrl);
      onUploadComplete?.(publicUrl);

      Alert.alert('¡Listo!', 'Tu foto de perfil se actualizó correctamente');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Error', 'No se pudo subir la foto. Intenta nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const showOptions = () => {
    Alert.alert('Foto de perfil', 'Elige una opción', [
      {
        text: 'Tomar foto',
        onPress: takePhoto,
      },
      {
        text: 'Elegir de galería',
        onPress: pickImage,
      },
      {
        text: 'Cancelar',
        style: 'cancel',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.avatarContainer, { width: size, height: size }]}
        onPress={showOptions}
        disabled={isUploading}
      >
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Ionicons name="person" size={size * 0.5} color="#666" />
          </View>
        )}

        {/* Botón de edición */}
        <View style={styles.editButton}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Ionicons name="camera" size={20} color="#000" />
          )}
        </View>
      </Pressable>

      <Text style={styles.helperText}>Toca para cambiar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 3,
    borderColor: '#333',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  placeholderAvatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#92BF4E',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  helperText: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
  },
});
