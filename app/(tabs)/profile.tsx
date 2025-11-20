import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Modal,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../constants/Types';

export default function ProfileScreen() {
  // Always use dark theme
  const colors = Colors.dark;
  const insets = useSafeAreaInsets();
  const { user, switchRole } = useAuth();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk?: () => void;
  }>({ visible: false, title: '', message: '' });

  const showWebAlert = (title: string, message: string, onOk?: () => void) => {
    if (Platform.OS === 'web') {
      setAlertConfig({ visible: true, title, message, onOk });
    }
  };

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    setShowRoleModal(false);
    showWebAlert('Rol cambiado', `Ahora estás usando la app como ${getRoleName(role)}`);
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'entrepreneur':
        return 'Empresario';
      case 'expert':
        return 'Experto';
      case 'admin':
        return 'Administrador';
    }
  };

  const menuItems = [
    { icon: 'calendar-outline', label: 'Mis Citas', onPress: () => { } },
    { icon: 'card-outline', label: 'Métodos de Pago', onPress: () => { } },
    { icon: 'document-text-outline', label: 'Historial', onPress: () => { } },
    { icon: 'settings-outline', label: 'Configuración', onPress: () => { } },
    { icon: 'help-circle-outline', label: 'Ayuda y Soporte', onPress: () => { } },
  ];

  if (!user) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.cardBackground }]}>
          <Image
            source={{ uri: user.avatar || 'https://i.pravatar.cc/150' }}
            style={styles.avatar}
            contentFit="cover"
          />
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user.email}</Text>

          <TouchableOpacity
            style={[styles.roleButton, { backgroundColor: colors.backgroundTertiary }]}
            onPress={() => setShowRoleModal(true)}
          >
            <Text style={[styles.roleText, { color: colors.primary }]}>
              {getRoleName(user.role)}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.primary} />
          </TouchableOpacity>

          <View style={[styles.demoBanner, { backgroundColor: colors.warning }]}>
            <Ionicons name="information-circle" size={16} color="#000" />
            <Text style={styles.demoText}>
              Modo Demo - Cambia de rol para explorar diferentes vistas
            </Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                { backgroundColor: colors.cardBackground, borderBottomColor: colors.border },
              ]}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon as any} size={24} color={colors.textSecondary} />
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={() => showWebAlert('Cerrar sesión', 'Esta función estará disponible próximamente')}
        >
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textTertiary }]}>
          Kontify+ v1.0.0
        </Text>
      </ScrollView>

      <Modal
        visible={showRoleModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Rol</Text>
            <TouchableOpacity onPress={() => setShowRoleModal(false)}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.rolesContainer}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                { backgroundColor: colors.cardBackground },
                user.role === 'entrepreneur' && { borderColor: colors.primary, borderWidth: 2 },
              ]}
              onPress={() => handleRoleChange('entrepreneur')}
            >
              <Ionicons name="business" size={32} color={colors.primary} />
              <Text style={[styles.roleOptionTitle, { color: colors.text }]}>Empresario</Text>
              <Text style={[styles.roleOptionDesc, { color: colors.textSecondary }]}>
                Busca y contrata expertos fiscales
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleOption,
                { backgroundColor: colors.cardBackground },
                user.role === 'expert' && { borderColor: colors.primary, borderWidth: 2 },
              ]}
              onPress={() => handleRoleChange('expert')}
            >
              <Ionicons name="ribbon" size={32} color={colors.primary} />
              <Text style={[styles.roleOptionTitle, { color: colors.text }]}>Experto</Text>
              <Text style={[styles.roleOptionDesc, { color: colors.textSecondary }]}>
                Ofrece tus servicios de asesoría
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleOption,
                { backgroundColor: colors.cardBackground },
                user.role === 'admin' && { borderColor: colors.primary, borderWidth: 2 },
              ]}
              onPress={() => handleRoleChange('admin')}
            >
              <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
              <Text style={[styles.roleOptionTitle, { color: colors.text }]}>Administrador</Text>
              <Text style={[styles.roleOptionDesc, { color: colors.textSecondary }]}>
                Gestiona usuarios y expertos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {Platform.OS === 'web' && (
        <Modal visible={alertConfig.visible} transparent animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={[styles.alertBox, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.alertTitle, { color: colors.text }]}>{alertConfig.title}</Text>
              <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>
                {alertConfig.message}
              </Text>
              <TouchableOpacity
                style={[styles.alertButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  alertConfig.onOk?.();
                  setAlertConfig(prev => ({ ...prev, visible: false }));
                }}
              >
                <Text style={[styles.alertButtonText, { color: colors.background }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  profileCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  name: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  email: {
    ...Typography.body,
    marginBottom: Spacing.md,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  roleText: {
    ...Typography.button,
    fontSize: 14,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  demoText: {
    ...Typography.caption,
    color: '#000',
    flex: 1,
  },
  menuSection: {
    marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  menuLabel: {
    ...Typography.body,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  logoutText: {
    ...Typography.button,
    color: '#FFF',
  },
  version: {
    ...Typography.caption,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...Typography.h3,
  },
  rolesContainer: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  roleOption: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  roleOptionTitle: {
    ...Typography.h4,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  roleOptionDesc: {
    ...Typography.bodySmall,
    textAlign: 'center',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    padding: 20,
    borderRadius: 8,
    minWidth: 280,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  alertButton: {
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  alertButtonText: {
    fontWeight: 'bold',
  },
});