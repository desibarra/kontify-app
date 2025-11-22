import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { expertApplicationService, ExpertLead, LeadStatus } from '@/services/expertApplicationService';
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages';

type FilterStatus = LeadStatus | 'all';
type FilterSeverity = 'low' | 'medium' | 'high' | 'all';

export default function ExpertsLeadsScreen() {
    const router = useRouter();
    const { leadsWithNewMessages, refreshNow } = useRealTimeMessages();

    const [leads, setLeads] = useState<ExpertLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('all');

    useEffect(() => {
        loadLeads();
    }, []);

    // Auto-refresh when new messages arrive
    useEffect(() => {
        if (leadsWithNewMessages.length > 0) {
            loadLeads();
        }
    }, [leadsWithNewMessages]);

    const loadLeads = async () => {
        setLoading(true);
        try {
            const allLeads = await expertApplicationService.getLeads();
            setLeads(allLeads);
        } catch (error) {
            console.error('Error loading leads:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtered and searched leads
    const filteredLeads = useMemo(() => {
        let result = [...leads];

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(lead =>
                lead.fullName.toLowerCase().includes(query) ||
                lead.email.toLowerCase().includes(query) ||
                lead.specialty.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (filterStatus !== 'all') {
            result = result.filter(lead => lead.status === filterStatus);
        }

        // Apply severity filter
        if (filterSeverity !== 'all') {
            result = result.filter(lead => lead.severity === filterSeverity);
        }

        // Sort by date (newest first)
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return result;
    }, [leads, searchQuery, filterStatus, filterSeverity]);

    // Stats
    const stats = useMemo(() => {
        return {
            total: leads.length,
            new: leads.filter(l => l.status === 'new').length,
            inProgress: leads.filter(l => l.status === 'in_progress').length,
            closed: leads.filter(l => l.status === 'closed').length,
        };
    }, [leads]);

    const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
        switch (severity) {
            case 'low': return '#10B981';
            case 'medium': return '#F59E0B';
            case 'high': return '#EF4444';
        }
    };

    const getStatusColor = (status: LeadStatus) => {
        switch (status) {
            case 'new': return '#3B82F6';
            case 'in_progress': return '#F59E0B';
            case 'closed': return '#10B981';
        }
    };

    const getStatusLabel = (status: LeadStatus) => {
        switch (status) {
            case 'new': return 'Nuevo';
            case 'in_progress': return 'En Progreso';
            case 'closed': return 'Cerrado';
        }
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;

        return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    };

    const renderLeadCard = (lead: ExpertLead) => {
        const hasNewMessage = leadsWithNewMessages.includes(lead.id);

        return (
            <Pressable
                key={lead.id}
                style={[
                    styles.leadCard,
                    hasNewMessage && styles.leadCardHighlight
                ]}
                onPress={() => router.push(`/experts-lead-detail?id=${lead.id}`)}
            >
                <View style={styles.leadHeader}>
                    <View style={styles.leadInfo}>
                        <Text style={styles.leadName} numberOfLines={1}>{lead.fullName}</Text>
                        <Text style={styles.leadSpecialty} numberOfLines={1}>{lead.specialty}</Text>
                    </View>
                    <View style={styles.leadBadges}>
                        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(lead.severity) + '20', borderColor: getSeverityColor(lead.severity) }]}>
                            <View style={[styles.severityDot, { backgroundColor: getSeverityColor(lead.severity) }]} />
                        </View>
                    </View>
                </View>

                <View style={styles.leadMeta}>
                    <View style={[styles.statusBadge, { borderColor: getStatusColor(lead.status) }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(lead.status) }]}>
                            {getStatusLabel(lead.status)}
                        </Text>
                    </View>
                    <Text style={styles.leadDate}>{formatDate(lead.createdAt)}</Text>
                </View>

                {lead.responses.length > 0 && (
                    <View style={styles.leadFooter}>
                        <Ionicons name="chatbubble-outline" size={14} color="#666" />
                        <Text style={styles.responseCount}>{lead.responses.length} respuesta{lead.responses.length !== 1 ? 's' : ''}</Text>
                        <Text style={styles.lastResponse}>• Última: {formatDate(lead.responses[lead.responses.length - 1].createdAt)}</Text>
                    </View>
                )}

                {/* New Message Badge */}
                {hasNewMessage && (
                    <View style={styles.newMessageBadge}>
                        <View style={styles.newMessageDot} />
                        <Text style={styles.newMessageText}>Nuevo mensaje</Text>
                    </View>
                )}
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Mis Leads</Text>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: '#3B82F6' }]}>{stats.new}</Text>
                        <Text style={styles.statLabel}>Nuevos</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: '#F59E0B' }]}>{stats.inProgress}</Text>
                        <Text style={styles.statLabel}>En Progreso</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.closed}</Text>
                        <Text style={styles.statLabel}>Cerrados</Text>
                    </View>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre, email o especialidad..."
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <Pressable onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="#666" />
                    </Pressable>
                )}
            </View>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
                {/* Status Filters */}
                <Pressable
                    style={[styles.filterChip, filterStatus === 'all' && styles.filterChipActive]}
                    onPress={() => setFilterStatus('all')}
                >
                    <Text style={[styles.filterText, filterStatus === 'all' && styles.filterTextActive]}>
                        Todos
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.filterChip, filterStatus === 'new' && styles.filterChipActive]}
                    onPress={() => setFilterStatus('new')}
                >
                    <Text style={[styles.filterText, filterStatus === 'new' && styles.filterTextActive]}>
                        Nuevos
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.filterChip, filterStatus === 'in_progress' && styles.filterChipActive]}
                    onPress={() => setFilterStatus('in_progress')}
                >
                    <Text style={[styles.filterText, filterStatus === 'in_progress' && styles.filterTextActive]}>
                        En Progreso
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.filterChip, filterStatus === 'closed' && styles.filterChipActive]}
                    onPress={() => setFilterStatus('closed')}
                >
                    <Text style={[styles.filterText, filterStatus === 'closed' && styles.filterTextActive]}>
                        Cerrados
                    </Text>
                </Pressable>

                <View style={styles.filterDivider} />

                {/* Severity Filters */}
                <Pressable
                    style={[styles.filterChip, filterSeverity === 'high' && styles.filterChipActive]}
                    onPress={() => setFilterSeverity(filterSeverity === 'high' ? 'all' : 'high')}
                >
                    <View style={[styles.severityDot, { backgroundColor: '#EF4444' }]} />
                    <Text style={[styles.filterText, filterSeverity === 'high' && styles.filterTextActive]}>
                        Alta
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.filterChip, filterSeverity === 'medium' && styles.filterChipActive]}
                    onPress={() => setFilterSeverity(filterSeverity === 'medium' ? 'all' : 'medium')}
                >
                    <View style={[styles.severityDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={[styles.filterText, filterSeverity === 'medium' && styles.filterTextActive]}>
                        Media
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.filterChip, filterSeverity === 'low' && styles.filterChipActive]}
                    onPress={() => setFilterSeverity(filterSeverity === 'low' ? 'all' : 'low')}
                >
                    <View style={[styles.severityDot, { backgroundColor: '#10B981' }]} />
                    <Text style={[styles.filterText, filterSeverity === 'low' && styles.filterTextActive]}>
                        Baja
                    </Text>
                </Pressable>
            </ScrollView>

            {/* Leads List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#92BF4E" />
                    <Text style={styles.loadingText}>Cargando leads...</Text>
                </View>
            ) : filteredLeads.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="folder-open-outline" size={64} color="#444" />
                    <Text style={styles.emptyTitle}>
                        {searchQuery || filterStatus !== 'all' || filterSeverity !== 'all'
                            ? 'No se encontraron leads'
                            : 'No tienes leads aún'}
                    </Text>
                    <Text style={styles.emptyText}>
                        {searchQuery || filterStatus !== 'all' || filterSeverity !== 'all'
                            ? 'Intenta ajustar los filtros o la búsqueda'
                            : 'Los nuevos leads aparecerán aquí'}
                    </Text>
                </View>
            ) : (
                <ScrollView style={styles.leadsList} showsVerticalScrollIndicator={false}>
                    <View style={styles.resultsHeader}>
                        <Text style={styles.resultsCount}>
                            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                    {filteredLeads.map(renderLeadCard)}
                    <View style={styles.bottomSpacer} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        backgroundColor: '#1a1a1a',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
    },
    backBtn: {
        padding: 8,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '700',
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabel: {
        color: '#888',
        fontSize: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        margin: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        gap: 12,
    },
    searchIcon: {
        marginRight: 4,
    },
    searchInput: {
        flex: 1,
        color: '#FFF',
        fontSize: 16,
    },
    filtersContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#444',
        marginRight: 8,
        gap: 6,
    },
    filterChipActive: {
        backgroundColor: '#92BF4E20',
        borderColor: '#92BF4E',
    },
    filterText: {
        color: '#AAA',
        fontSize: 14,
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#92BF4E',
    },
    filterDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#444',
        marginHorizontal: 8,
    },
    severityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#AAA',
        fontSize: 16,
        marginTop: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
    },
    leadsList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    resultsHeader: {
        paddingVertical: 8,
        marginBottom: 8,
    },
    resultsCount: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
    },
    leadCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    leadHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    leadInfo: {
        flex: 1,
        marginRight: 12,
    },
    leadName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    leadSpecialty: {
        color: '#AAA',
        fontSize: 14,
    },
    leadBadges: {
        flexDirection: 'row',
        gap: 8,
    },
    severityBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leadMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    leadDate: {
        color: '#666',
        fontSize: 12,
    },
    leadFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    responseCount: {
        color: '#92BF4E',
        fontSize: 12,
        fontWeight: '600',
    },
    lastResponse: {
        color: '#666',
        fontSize: 12,
    },
    bottomSpacer: {
        height: 32,
    },
    // Phase 11: Real-Time Messaging
    leadCardHighlight: {
        borderColor: '#92BF4E',
        borderWidth: 2,
        shadowColor: '#92BF4E',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    newMessageBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#92BF4E20',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
        marginTop: 8,
    },
    newMessageDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#92BF4E',
    },
    newMessageText: {
        color: '#92BF4E',
        fontSize: 12,
        fontWeight: '600',
    },
});

