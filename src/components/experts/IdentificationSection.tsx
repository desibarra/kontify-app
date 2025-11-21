import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/Colors';

export default function IdentificationSection() {
    // Always use dark theme
    const colors = Colors.dark;

    const painPoints = [
        'Clientes que no valoran tu experiencia',
        'Ingresos irregulares e impredecibles',
        'Horas perdidas en prospección',
        'Competencia desleal de "asesores" sin título',
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.question, { color: colors.text }]}>
                ¿Eres contador, fiscalista o abogado fiscal?
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Sabemos que enfrentas estos retos a diario:
            </Text>

            <View style={styles.painPointsContainer}>
                {painPoints.map((point, index) => (
                    <View key={index} style={styles.painPoint}>
                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                        <Text style={[styles.painText, { color: colors.text }]}>
                            {point}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={[styles.solutionBox, { backgroundColor: colors.backgroundElevated, borderColor: colors.primary }]}>
                <Text style={[styles.solutionText, { color: colors.primary }]}>
                    💡 Kontify+ resuelve todo esto para ti
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.xxl,
        paddingHorizontal: Spacing.lg,
    },
    question: {
        ...Typography.h2,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    subtitle: {
        ...Typography.body,
        fontSize: 16,
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    painPointsContainer: {
        marginBottom: Spacing.xl,
    },
    painPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    painText: {
        ...Typography.body,
        fontSize: 16,
        marginLeft: Spacing.md,
        flex: 1,
    },
    solutionBox: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        alignItems: 'center',
    },
    solutionText: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
    },
});
