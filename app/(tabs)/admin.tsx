import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/Colors';

export default function AdminScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Panel de Administración
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Bienvenido al panel de administración de Kontify+
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          📊 Estadísticas
        </Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          • Total de expertos: 0
        </Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          • Total de usuarios: 0
        </Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          • Consultas IA: 0
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          🔧 Funciones Disponibles
        </Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          • Gestión de expertos
        </Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          • Gestión de usuarios
        </Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          • Análisis de casos IA
        </Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          • Configuración del sistema
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          ℹ️ Estado
        </Text>
        <Text style={[styles.cardText, { color: colors.textSecondary }]}>
          Panel en desarrollo - Próximamente disponible
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 16,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  cardText: {
    ...Typography.body,
    marginBottom: Spacing.xs,
    lineHeight: 22,
  },
});