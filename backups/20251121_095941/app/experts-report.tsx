import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../constants/Colors';
import { expertApplicationService, ExpertMetrics, ExpertLead } from '../services/expertApplicationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExpertsReportScreen() {
    const colors = Colors.dark;
    const router = useRouter();
    const [metrics, setMetrics] = useState<ExpertMetrics | null>(null);
    const [leads, setLeads] = useState<ExpertLead[]>([]);

    useEffect(() => {
        loadReportData();
    }, []);

    const loadReportData = async () => {
        const metricsData = await expertApplicationService.calculateMetrics();
        const leadsData = await expertApplicationService.getAllLeads();
        setMetrics(metricsData);
        setLeads(leadsData);
    };

    const handleExportReport = async () => {
        const reportData = {
            metrics,
            leads,
            exportedAt: new Date().toISOString(),
        };

        // Simulate export (save to AsyncStorage)
        await AsyncStorage.setItem('@kontify_last_export', JSON.stringify(reportData));
        Alert.alert('Reporte Exportado', 'El reporte ha sido guardado exitosamente en formato JSON.');
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Reporte Completo
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Análisis detallado de tu actividad
                </Text>
            </View>

            {/* Bar Chart */}
            <View style={[styles.chartCard, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.chartTitle, { color: colors.text }]}>
                    Leads por Gravedad
                </Text>
                <BarChart metrics={metrics} colors={colors} />
            </View>

            {/* Leads Table */}
            <View style={[styles.tableCard, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.tableTitle, { color: colors.text }]}>
                    Todos los Leads ({leads.length})
                </Text>
                <LeadsTable leads={leads} colors={colors} />
            </View>

            {/* Export Button */}
            <TouchableOpacity
                style={[styles.exportButton, { backgroundColor: colors.primary }]}
                onPress={handleExportReport}
            >
                <Ionicons name="download" size={24} color={colors.background} />
                <Text style={[styles.exportButtonText, { color: colors.background }]}>
                    Exportar Reporte (JSON)
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// Bar Chart Component (Pure CSS/Views)
const BarChart = ({ metrics, colors }: { metrics: ExpertMetrics | null; colors: any }) => {
    if (!metrics) {
        return (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No hay datos disponibles
            </Text>
        );
    }

    const maxCount = Math.max(
        metrics.greenCount || 0,
        metrics.yellowCount || 0,
        metrics.redCount || 0,
        1 // Avoid division by zero
    );

    const getBarHeight = (count: number) => {
        return maxCount > 0 ? (count / maxCount) * 200 : 0;
    };

    return (
        <View style={styles.chart}>
            <View style={styles.chartBars}>
                {/* Green Bar */}
                <View style={styles.barContainer}>
                    <View
                        style={[
                            styles.bar,
                            {
                                height: getBarHeight(metrics.greenCount || 0),
                                backgroundColor: '#10B981',
                            },
                        ]}
                    />
                    <Text style={[styles.barLabel, { color: colors.text }]}>
                        {metrics.greenCount || 0}
                    </Text>
                    <Text style={[styles.barCategory, { color: colors.textSecondary }]}>
                        Bajo
                    </Text>
                </View>

                {/* Yellow Bar */}
                <View style={styles.barContainer}>
                    <View
                        style={[
                            styles.bar,
                            {
                                height: getBarHeight(metrics.yellowCount || 0),
                                backgroundColor: '#F59E0B',
                            },
                        ]}
                    />
                    <Text style={[styles.barLabel, { color: colors.text }]}>
                        {metrics.yellowCount || 0}
                    </Text>
                    <Text style={[styles.barCategory, { color: colors.textSecondary }]}>
                        Medio
                    </Text>
                </View>

                {/* Red Bar */}
                <View style={styles.barContainer}>
                    <View
                        style={[
                            styles.bar,
                            {
                                height: getBarHeight(metrics.redCount || 0),
                                backgroundColor: '#EF4444',
                            },
                        ]}
                    />
                    <Text style={[styles.barLabel, { color: colors.text }]}>
                        {metrics.redCount || 0}
                    </Text>
                    <Text style={[styles.barCategory, { color: colors.textSecondary }]}>
                        Alto
                    </Text>
                </View>
            </View>
        </View>
    );
};

// Leads Table Component
const LeadsTable = ({ leads, colors }: { leads: ExpertLead[]; colors: any }) => {
    if (leads.length === 0) {
        return (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No hay leads registrados
            </Text>
        );
    }

    // Helper to get severity from caseSummary
    const getSeverity = (lead: ExpertLead): 'low' | 'medium' | 'high' => {
        const caseLevel = lead.caseSummary?.caseLevel?.toLowerCase();
        if (caseLevel === 'urgent' || caseLevel === 'critical') return 'high';
        if (caseLevel === 'important' || caseLevel === 'medium') return 'medium';
        return 'low';
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return '#EF4444';
            case 'medium':
                return '#F59E0B';
            default:
                return '#10B981';
        }
    };

    const getSeverityLabel = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'Alto';
            case 'medium':
                return 'Medio';
            default:
                return 'Bajo';
        }
    };

    return (
        <View style={styles.table}>
            {/* Header */}
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, flex: 2 }]}>
                    Nombre
                </Text>
                <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, flex: 1.5 }]}>
                    Especialidad
                </Text>
                <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, flex: 1 }]}>
                    Gravedad
                </Text>
                <Text style={[styles.tableHeaderCell, { color: colors.textSecondary, flex: 1 }]}>
                    Fecha
                </Text>
            </View>

            {/* Rows */}
            {leads.map((lead) => {
                const severity = getSeverity(lead);
                return (
                    <View key={lead.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.tableCell, { color: colors.text, flex: 2 }]} numberOfLines={1}>
                            {lead.fullName}
                        </Text>
                        <Text style={[styles.tableCell, { color: colors.text, flex: 1.5 }]} numberOfLines={1}>
                            {lead.specialty}
                        </Text>
                        <View style={[styles.tableCell, { flex: 1 }]}>
                            <View
                                style={[
                                    styles.tableSeverityBadge,
                                    {
                                        backgroundColor: getSeverityColor(severity),
                                    },
                                ]}
                            >
                                <Text style={styles.tableSeverityText}>
                                    {getSeverityLabel(severity)}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.tableCell, { color: colors.textSecondary, flex: 1 }]} numberOfLines={1}>
                            {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('es-MX', {
                                month: 'short',
                                day: 'numeric'
                            }) : 'N/A'}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    title: {
        ...Typography.h1,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
        fontSize: 15,
    },
    // Chart Card
    chartCard: {
        margin: Spacing.lg,
        marginTop: 0,
        padding: Spacing.lg,
        borderRadius: 12,
    },
    chartTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: Spacing.lg,
    },
    chart: {
        alignItems: 'center',
    },
    chartBars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        width: '100%',
        height: 250,
        paddingHorizontal: Spacing.md,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal: Spacing.sm,
    },
    bar: {
        width: '100%',
        maxWidth: 60,
        borderRadius: 8,
        marginBottom: Spacing.sm,
    },
    barLabel: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    barCategory: {
        ...Typography.caption,
        fontSize: 12,
    },
    // Table Card
    tableCard: {
        margin: Spacing.lg,
        marginTop: 0,
        padding: Spacing.lg,
        borderRadius: 12,
    },
    tableTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: Spacing.md,
    },
    table: {
        width: '100%',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: Spacing.sm,
        borderBottomWidth: 2,
        borderBottomColor: '#374151',
        marginBottom: Spacing.sm,
    },
    tableHeaderCell: {
        ...Typography.caption,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    tableCell: {
        ...Typography.body,
        fontSize: 14,
    },
    tableSeverityBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    tableSeverityText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
    },
    // Export Button
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        margin: Spacing.lg,
        marginTop: 0,
        paddingVertical: Spacing.md,
        borderRadius: 12,
    },
    exportButtonText: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '700',
    },
    emptyText: {
        ...Typography.body,
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: Spacing.xl,
    },
});
