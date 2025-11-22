import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';
import { KontifyLogo } from '@/components/ui/KontifyLogo';
import { updateUserRole, UserRole } from '@/services/profileService';

export default function RoleSelectionScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const colors = Colors.dark;

  const roles = [
    {
      id: 'user' as UserRole,
      title: 'Usuario',
      description: 'Busco asesoría fiscal y legal con ayuda de IA',
      icon: 'person' as const,
      color: '#93EC80',
    },
    {
      id: 'expert' as UserRole,
      title: 'Experto',
      description: 'Soy abogado, contador o especialista fiscal',
      icon: 'briefcase' as const,
      color: '#4E9BBF',
    },
  ];

  const handleRoleSelect = async (role: UserRole) => {
    if (!user?.id) {
      Alert.alert('Error', 'No se pudo identificar al usuario');
      return;
    }

    setSelectedRole(role);
    setIsLoading(true);

    try {
      const { error } = await updateUserRole(user.id, role);

      setIsLoading(false);

      if (error) {
        Alert.alert('Error', 'No se pudo actualizar tu rol. Intenta nuevamente.');
        setSelectedRole(null);
        return;
      }

      // Navegación según el rol - Usar router.push directamente sin setTimeout
      // El update en Supabase ya ha completado exitosamente
      if (role === 'expert') {
        router.push('/experts-onboarding');
      } else {
        router.push('/(tabs)');
      }
    } catch (err) {
      console.error('Error en handleRoleSelect:', err);
      setIsLoading(false);
      Alert.alert('Error', 'Algo salió mal. Intenta nuevamente.');
      setSelectedRole(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con Logo */}
      <View style={styles.header}>
        <KontifyLogo size="medium" />
      </View>

      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>¿Cómo quieres usar Kontify?</Text>
        <Text style={styles.subtitle}>
          Selecciona tu perfil para personalizar tu experiencia
        </Text>

        {/* Opciones de Rol */}
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <Pressable
              key={role.id}
              style={({ pressed }) => [
                styles.roleCard,
                pressed && styles.roleCardPressed,
                selectedRole === role.id && styles.roleCardSelected,
              ]}
              onPress={() => handleRoleSelect(role.id)}
              disabled={isLoading}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${role.color}20` }]}>
                <Ionicons name={role.icon} size={40} color={role.color} />
              </View>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>

              {/* Loading Indicator */}
              {isLoading && selectedRole === role.id && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={role.color} />
                </View>
              )}

              {/* Checkmark si está seleccionado */}
              {!isLoading && selectedRole === role.id && (
                <View style={[styles.checkmark, { backgroundColor: role.color }]}>
                  <Ionicons name="checkmark" size={24} color="#000" />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {/* Info adicional */}
        <Text style={styles.infoText}>
          💡 Puedes cambiar tu rol más tarde desde tu perfil
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
  },
  rolesContainer: {
    gap: 20,
    marginBottom: 32,
  },
  roleCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
  },
  roleCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  roleCardSelected: {
    borderColor: '#93EC80',
    backgroundColor: 'rgba(147, 236, 128, 0.06)',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
