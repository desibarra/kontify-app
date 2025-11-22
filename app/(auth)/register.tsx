import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';
import { KontifyLogo } from '@/components/ui/KontifyLogo';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'entrepreneur' | 'expert' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const colors = Colors.dark;

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return false;
    }

    if (!selectedRole) {
      Alert.alert('Error', 'Por favor selecciona tu perfil (Empresario o Asesor)');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Enviar role en metadata para que el trigger lo capture
    const { error } = await signUp(email, password, { 
      full_name: name,
      role: selectedRole // ✅ CAMPO CRÍTICO: Se envía a Supabase
    });
    
    setIsLoading(false);

    if (error) {
      Alert.alert('Error al registrarse', error.message);
    } else {
      // IMPORTANTE: En web, el Alert.alert con callbacks tiene comportamiento inconsistente
      // Por eso lo saltamos y navegamos directamente después de un pequeño delay
      // para permitir que el perfil se cree en Supabase
      
      // Mostrar Alert pero también navegar después del delay
      Alert.alert(
        '¡Cuenta creada!',
        selectedRole === 'expert' 
          ? 'Completa tu perfil de asesor para empezar'
          : '¡Bienvenido a Kontify!',
        [
          {
            text: 'Continuar',
            onPress: () => {
              navigateAfterSignup();
            },
          },
        ]
      );

      // Navegar automáticamente después de 1 segundo (fallback para web)
      // Esto asegura que funcione incluso si el Alert callback falla
      setTimeout(() => {
        navigateAfterSignup();
      }, 1000);
    }
  };

  const navigateAfterSignup = () => {
    // Si es experto, redirigir a completar perfil
    if (selectedRole === 'expert') {
      router.push('/experts-onboarding');
    } else {
      // Si es empresario, ir al dashboard
      router.push('/(tabs)/index');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <KontifyLogo size="medium" />
          </View>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Únete a Kontify y conecta con expertos fiscales
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Juan Pérez"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {/* Role Selection - NUEVO */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>¿Cómo quieres usar Kontify? *</Text>
            <Text style={styles.roleSubtitle}>Selecciona tu perfil</Text>
            
            <View style={styles.roleContainer}>
              {/* Opción: Empresario */}
              <Pressable
                style={[
                  styles.roleCard,
                  selectedRole === 'entrepreneur' && styles.roleCardSelected,
                ]}
                onPress={() => setSelectedRole('entrepreneur')}
              >
                <View style={[
                  styles.roleIconContainer,
                  selectedRole === 'entrepreneur' && styles.roleIconContainerSelected,
                ]}>
                  <Ionicons
                    name="business"
                    size={32}
                    color={selectedRole === 'entrepreneur' ? '#93EC80' : colors.textSecondary}
                  />
                </View>
                <Text style={[
                  styles.roleTitle,
                  selectedRole === 'entrepreneur' && styles.roleTitleSelected,
                ]}>
                  Empresario
                </Text>
                <Text style={styles.roleDescription}>
                  Busco asesoría fiscal para mi negocio
                </Text>
                {selectedRole === 'entrepreneur' && (
                  <View style={styles.roleCheck}>
                    <Ionicons name="checkmark-circle" size={24} color="#93EC80" />
                  </View>
                )}
              </Pressable>

              {/* Opción: Asesor */}
              <Pressable
                style={[
                  styles.roleCard,
                  selectedRole === 'expert' && styles.roleCardSelected,
                ]}
                onPress={() => setSelectedRole('expert')}
              >
                <View style={[
                  styles.roleIconContainer,
                  selectedRole === 'expert' && styles.roleIconContainerSelected,
                ]}>
                  <Ionicons
                    name="school"
                    size={32}
                    color={selectedRole === 'expert' ? '#93EC80' : colors.textSecondary}
                  />
                </View>
                <Text style={[
                  styles.roleTitle,
                  selectedRole === 'expert' && styles.roleTitleSelected,
                ]}>
                  Asesor
                </Text>
                <Text style={styles.roleDescription}>
                  Quiero ofrecer mis servicios de consultoría
                </Text>
                {selectedRole === 'expert' && (
                  <View style={styles.roleCheck}>
                    <Ionicons name="checkmark-circle" size={24} color="#93EC80" />
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Register Button */}
          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.registerButtonPressed,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#93EC80', '#82DB6F']}
              style={styles.registerGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Text style={styles.registerText}>Crear cuenta</Text>
                  <Ionicons name="arrow-forward" size={20} color="#000" />
                </>
              )}
            </LinearGradient>
          </Pressable>

          {/* Terms */}
          <Text style={styles.terms}>
            Al registrarte, aceptas nuestros{' '}
            <Text style={styles.termsLink}>Términos de Servicio</Text> y{' '}
            <Text style={styles.termsLink}>Política de Privacidad</Text>
          </Text>
        </View>

        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </Pressable>
          </Link>
        </View>

        {/* Back to Landing */}
        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
            <Text style={styles.backText}>Volver al inicio</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#FFF',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  registerButton: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  registerButtonPressed: {
    opacity: 0.8,
  },
  registerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  registerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  terms: {
    marginTop: 16,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#93EC80',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#93EC80',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  backText: {
    fontSize: 14,
    color: '#999',
  },
  // Estilos para selección de rol
  roleSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: '#93EC80',
    backgroundColor: 'rgba(147, 236, 128, 0.05)',
  },
  roleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  roleIconContainerSelected: {
    backgroundColor: 'rgba(147, 236, 128, 0.15)',
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
  },
  roleTitleSelected: {
    color: '#93EC80',
  },
  roleDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  roleCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
