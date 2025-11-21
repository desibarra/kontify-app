import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/Colors';

export default function Community() {
    // Always use dark theme
    const colors = Colors.dark;
    const router = useRouter();

    const communityFeatures = [
        { icon: 'people', text: '500+ expertos activos' },
        { icon: 'chatbubbles', text: 'Grupo privado de WhatsApp' },
        { icon: 'calendar', text: 'Webinars mensuales' },
        { icon: 'trophy', text: 'Programa de reconocimientos' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.primary }]}>
            <Text style={[styles.title, { color: colors.background }]}>
                Únete a la comunidad de expertos fiscales más grande de México
            </Text>

            <Text style={[styles.subtitle, { color: colors.background, opacity: 0.9 }]}>
                No solo es una plataforma, es una red de profesionales de élite
            </Text>

            <View style={styles.featuresContainer}>
                {communityFeatures.map((feature, index) => (
                    <View key={index} style={styles.feature}>
                        <Ionicons name={feature.icon as any} size={24} color={colors.background} />
                        <Text style={[styles.featureText, { color: colors.background }]}>
                            {feature.text}
                        </Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: colors.background }, Shadows.green]}
                onPress={() => router.push('/experts-register')}
                activeOpacity={0.9}
            >
                <Text style={[styles.ctaText, { color: colors.primary }]}>
                    Comenzar mi registro ahora
                </Text>
                <Ionicons name="arrow-forward" size={24} color={colors.primary} />
            </TouchableOpacity>

            <Text style={[styles.guarantee, { color: colors.background, opacity: 0.8 }]}>
                ✓ Sin compromiso inicial • ✓ Cancela cuando quieras • ✓ Soporte 24/7
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.xxl * 2,
        paddingHorizontal: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        fontSize: 28,
        fontWeight: '700',
        marginBottom: Spacing.md,
        textAlign: 'center',
        lineHeight: 36,
    },
    subtitle: {
        ...Typography.body,
        fontSize: 16,
        marginBottom: Spacing.xl,
        textAlign: 'center',
        lineHeight: 24,
    },
    featuresContainer: {
        marginBottom: Spacing.xl,
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        justifyContent: 'center',
    },
    featureText: {
        ...Typography.body,
        fontSize: 16,
        marginLeft: Spacing.sm,
        fontWeight: '500',
    },
    ctaButton: {
        flexDirection: 'row',
        paddingVertical: Spacing.md + 2,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    ctaText: {
        ...Typography.h3,
        fontSize: 18,
        fontWeight: '700',
        marginRight: Spacing.sm,
    },
    guarantee: {
        ...Typography.body,
        fontSize: 14,
        textAlign: 'center',
    },
});
