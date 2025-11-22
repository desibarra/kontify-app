import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/Colors';

export default function IncomeCalculator() {
    // Always use dark theme
    const colors = Colors.dark;

    const [casesPerMonth, setCasesPerMonth] = useState(10);
    const avgCaseValue = 2500; // MXN promedio por caso
    const commission = 0.15; // 15% comisión Kontify+

    const grossIncome = casesPerMonth * avgCaseValue;
    const netIncome = grossIncome * (1 - commission);

    const adjustCases = (increment: number) => {
        const newValue = casesPerMonth + increment;
        if (newValue >= 5 && newValue <= 50) {
            setCasesPerMonth(newValue);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                Calcula tu potencial de ingresos
            </Text>

            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Transparencia total desde el inicio
            </Text>

            <View style={[styles.calculatorCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }, Shadows.md]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                    ¿Cuántos casos quieres atender al mes?
                </Text>

                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={() => adjustCases(-5)}
                    >
                        <Ionicons name="remove" size={24} color={colors.background} />
                    </TouchableOpacity>

                    <Text style={[styles.casesNumber, { color: colors.text }]}>
                        {casesPerMonth}
                    </Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={() => adjustCases(5)}
                    >
                        <Ionicons name="add" size={24} color={colors.background} />
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.resultRow}>
                    <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>
                        Ingreso bruto:
                    </Text>
                    <Text style={[styles.resultValue, { color: colors.text }]}>
                        ${grossIncome.toLocaleString('es-MX')} MXN
                    </Text>
                </View>

                <View style={styles.resultRow}>
                    <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>
                        Comisión Kontify+ (15%):
                    </Text>
                    <Text style={[styles.resultValue, { color: colors.textSecondary }]}>
                        -${(grossIncome * commission).toLocaleString('es-MX')} MXN
                    </Text>
                </View>

                <View style={[styles.netIncomeBox, { backgroundColor: colors.backgroundElevated, borderColor: colors.primary }]}>
                    <Text style={[styles.netIncomeLabel, { color: colors.primary }]}>
                        Tu ingreso neto mensual:
                    </Text>
                    <Text style={[styles.netIncomeValue, { color: colors.primary }]}>
                        ${netIncome.toLocaleString('es-MX')} MXN
                    </Text>
                </View>

                <Text style={[styles.disclaimer, { color: colors.textTertiary }]}>
                    * Cálculo estimado basado en promedio de casos. Valor real puede variar según especialidad y tarifa.
                </Text>
            </View>

            <View style={styles.successStories}>
                <Text style={[styles.storiesTitle, { color: colors.text }]}>
                    💼 Casos de éxito reales
                </Text>
                <Text style={[styles.storyText, { color: colors.textSecondary }]}>
                    "En 3 meses pasé de $15k a $52k mensuales" - Lic. María G., Fiscalista
                </Text>
                <Text style={[styles.storyText, { color: colors.textSecondary }]}>
                    "Duplicé mis ingresos sin aumentar mi carga de trabajo" - CP. Carlos R., Contador
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
    title: {
        ...Typography.h2,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        ...Typography.body,
        fontSize: 16,
        marginBottom: Spacing.xl,
        textAlign: 'center',
    },
    calculatorCard: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.xl,
    },
    label: {
        ...Typography.body,
        fontSize: 16,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    button: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    casesNumber: {
        ...Typography.h1,
        fontSize: 48,
        fontWeight: '700',
        marginHorizontal: Spacing.xl,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: Spacing.md,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    resultLabel: {
        ...Typography.body,
        fontSize: 15,
    },
    resultValue: {
        ...Typography.body,
        fontSize: 15,
        fontWeight: '600',
    },
    netIncomeBox: {
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        marginTop: Spacing.md,
        marginBottom: Spacing.md,
    },
    netIncomeLabel: {
        ...Typography.body,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    netIncomeValue: {
        ...Typography.h2,
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
    },
    disclaimer: {
        ...Typography.caption,
        fontSize: 12,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    successStories: {
        marginTop: Spacing.lg,
    },
    storiesTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    storyText: {
        ...Typography.body,
        fontSize: 15,
        marginBottom: Spacing.sm,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
