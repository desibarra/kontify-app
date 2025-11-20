import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/Colors';

export default function AdminScreen() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                Panel de Administración
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Bienvenido al panel de administración de Kontify+
            </Text>

            <Text style={[styles.text, { color: colors.text }]}>
                Aquí podrás administrar expertos, usuarios, casos IA y configuraciones.
            </Text>

            <Text style={[styles.text, { color: colors.textSecondary }]}>
                (Panel en desarrollo)
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        marginBottom: Spacing.md,
    },
    subtitle: {
        ...Typography.body,
        marginBottom: Spacing.md,
    },
    text: {
        ...Typography.body,
        marginBottom: Spacing.sm,
    },
});
