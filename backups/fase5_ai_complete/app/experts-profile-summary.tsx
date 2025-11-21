import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/constants/Colors';
import { expertApplicationService } from '@/services/expertApplicationService';

export default function ExpertsProfileSummaryScreen() {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const router = useRouter();

    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        const profile = expertApplicationService.getProfessionalProfile();
        if (profile) {
            setProfileData(profile);
        }
    }, []);

    if (!profileData) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    Cargando perfil...
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Resumen de Perfil
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Así te ven los clientes potenciales
                </Text>
            </View>

            {/* Basic Info */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Información Básica
                </Text>

                <View style={styles.infoRow}>
                    <Ionicons name="person" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Nombre completo
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {profileData.fullName || 'No especificado'}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="mail" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Email
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {profileData.email || 'No especificado'}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="call" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Teléfono
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {profileData.phone || 'No especificado'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Professional Info */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Información Profesional
                </Text>

                <View style={styles.infoRow}>
                    <Ionicons name="card" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Cédula profesional
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {profileData.cedula || 'No especificado'}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="time" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Años de experiencia
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {profileData.yearsOfExperience ? `${profileData.yearsOfExperience} años` : 'No especificado'}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="briefcase" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Especialidades
                        </Text>
                        <View style={styles.chipsContainer}>
                            {profileData.specializations?.length > 0 ? (
                                profileData.specializations.map((spec: string, index: number) => (
                                    <View key={index} style={[styles.chip, { backgroundColor: colors.primary, opacity: 0.15 }]}>
                                        <Text style={[styles.chipText, { color: colors.primary }]}>
                                            {spec}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                                    No especificado
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="list" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Servicios
                        </Text>
                        <View style={styles.chipsContainer}>
                            {profileData.services?.length > 0 ? (
                                profileData.services.map((service: string, index: number) => (
                                    <View key={index} style={[styles.chip, { backgroundColor: colors.primary, opacity: 0.15 }]}>
                                        <Text style={[styles.chipText, { color: colors.primary }]}>
                                            {service}
                                        </Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                                    No especificado
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>

            {/* Biography */}
            {profileData.bio && (
                <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Biografía Profesional
                    </Text>
                    <Text style={[styles.bioText, { color: colors.text }]}>
                        {profileData.bio}
                    </Text>
                </View>
            )}

            {/* Location */}
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Ubicación
                </Text>

                <View style={styles.infoRow}>
                    <Ionicons name="location" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Ciudad
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {profileData.city || 'No especificado'}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="map" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                            Estado
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>
                            {profileData.state || 'No especificado'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Social Links */}
            {(profileData.website || profileData.linkedin || profileData.facebookPage) && (
                <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Redes Sociales
                    </Text>

                    {profileData.website && (
                        <View style={styles.infoRow}>
                            <Ionicons name="globe" size={20} color={colors.primary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                    Página web
                                </Text>
                                <Text style={[styles.infoValue, { color: colors.primary }]}>
                                    {profileData.website}
                                </Text>
                            </View>
                        </View>
                    )}

                    {profileData.linkedin && (
                        <View style={styles.infoRow}>
                            <Ionicons name="logo-linkedin" size={20} color={colors.primary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                    LinkedIn
                                </Text>
                                <Text style={[styles.infoValue, { color: colors.primary }]}>
                                    {profileData.linkedin}
                                </Text>
                            </View>
                        </View>
                    )}

                    {profileData.facebookPage && (
                        <View style={styles.infoRow}>
                            <Ionicons name="logo-facebook" size={20} color={colors.primary} />
                            <View style={styles.infoContent}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                    Facebook
                                </Text>
                                <Text style={[styles.infoValue, { color: colors.primary }]}>
                                    {profileData.facebookPage}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            )}

            {/* RFC */}
            {profileData.rfc && (
                <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        Información Fiscal
                    </Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="document" size={20} color={colors.primary} />
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                RFC
                            </Text>
                            <Text style={[styles.infoValue, { color: colors.text }]}>
                                {profileData.rfc}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Edit Button */}
            <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/experts-profile-form')}
            >
                <Ionicons name="create" size={24} color={colors.background} />
                <Text style={[styles.editButtonText, { color: colors.background }]}>
                    Editar perfil
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    loadingText: {
        ...Typography.body,
        fontSize: 16,
        textAlign: 'center',
        marginTop: Spacing.xxl,
    },
    header: {
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h2,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
        fontSize: 15,
    },
    section: {
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: Spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
    },
    infoContent: {
        flex: 1,
        marginLeft: Spacing.sm,
    },
    infoLabel: {
        ...Typography.caption,
        fontSize: 12,
        marginBottom: Spacing.xs,
    },
    infoValue: {
        ...Typography.body,
        fontSize: 16,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
        marginTop: Spacing.xs,
    },
    chip: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderRadius: 12,
    },
    chipText: {
        ...Typography.caption,
        fontSize: 12,
        fontWeight: '600',
    },
    bioText: {
        ...Typography.body,
        fontSize: 15,
        lineHeight: 24,
    },
    editButton: {
        flexDirection: 'row',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    editButtonText: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
        marginLeft: Spacing.sm,
    },
});

