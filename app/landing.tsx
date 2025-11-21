import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LandingPage() {
    const router = useRouter();

    const handleCTA = () => {
        router.push('/(tabs)/ai-chat');
    };

    const openLink = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* HERO SECTION */}
            <LinearGradient
                colors={['#000000', '#0a0a0a', '#111111']}
                style={styles.hero}
            >
                <View style={styles.heroContent}>
                    {/* Badge */}
                    <View style={styles.badge}>
                        <View style={styles.badgeDot} />
                        <Text style={styles.badgeText}>Impulsado por IA Avanzada</Text>
                    </View>

                    {/* Main Headline */}
                    <Text style={styles.heroTitle}>
                        Tu Asesor Fiscal{'\n'}
                        <Text style={styles.heroTitleAccent}>Inteligente</Text>
                    </Text>

                    {/* Subheadline */}
                    <Text style={styles.heroSubtitle}>
                        Diagnósticos fiscales instantáneos. Respuestas precisas.{'\n'}
                        Expertos certificados cuando los necesites.
                    </Text>

                    {/* CTA Button */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.ctaButton,
                            pressed && styles.ctaButtonPressed
                        ]}
                        onPress={handleCTA}
                    >
                        <LinearGradient
                            colors={['#92BF4E', '#7DA842']}
                            style={styles.ctaGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.ctaText}>Empieza tu Diagnóstico Gratis</Text>
                            <Ionicons name="arrow-forward" size={20} color="#000" />
                        </LinearGradient>
                    </Pressable>

                    {/* Trust Line */}
                    <Text style={styles.trustLine}>
                        Sin tarjeta de crédito • Respuesta en segundos
                    </Text>
                </View>

                {/* Floating Cards Animation */}
                <View style={styles.floatingCards}>
                    <View style={[styles.floatingCard, styles.card1]}>
                        <Ionicons name="shield-checkmark" size={24} color="#92BF4E" />
                        <Text style={styles.cardText}>100% Seguro</Text>
                    </View>
                    <View style={[styles.floatingCard, styles.card2]}>
                        <Ionicons name="flash" size={24} color="#92BF4E" />
                        <Text style={styles.cardText}>Instantáneo</Text>
                    </View>
                    <View style={[styles.floatingCard, styles.card3]}>
                        <Ionicons name="people" size={24} color="#92BF4E" />
                        <Text style={styles.cardText}>Expertos 24/7</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* VALUE PROPOSITION */}
            <View style={styles.valueSection}>
                <Text style={styles.valueText}>
                    Kontify+ combina inteligencia artificial con expertise humano para resolver tus dudas fiscales en minutos, no días.
                </Text>
            </View>

            {/* BENEFITS SECTION */}
            <View style={styles.benefitsSection}>
                <Text style={styles.sectionTitle}>Por qué elegir Kontify+</Text>

                <View style={styles.benefitsGrid}>
                    {/* Benefit 1 */}
                    <View style={styles.benefitCard}>
                        <View style={styles.benefitIconContainer}>
                            <LinearGradient
                                colors={['#92BF4E20', '#92BF4E10']}
                                style={styles.benefitIconBg}
                            >
                                <Ionicons name="analytics" size={32} color="#92BF4E" />
                            </LinearGradient>
                        </View>
                        <Text style={styles.benefitTitle}>Diagnóstico Inteligente</Text>
                        <Text style={styles.benefitDescription}>
                            Nuestra IA analiza tu situación fiscal y te da respuestas precisas al instante.
                        </Text>
                    </View>

                    {/* Benefit 2 */}
                    <View style={styles.benefitCard}>
                        <View style={styles.benefitIconContainer}>
                            <LinearGradient
                                colors={['#92BF4E20', '#92BF4E10']}
                                style={styles.benefitIconBg}
                            >
                                <Ionicons name="chatbubbles" size={32} color="#92BF4E" />
                            </LinearGradient>
                        </View>
                        <Text style={styles.benefitTitle}>IA Fiscal Inmediata</Text>
                        <Text style={styles.benefitDescription}>
                            Pregunta lo que necesites. Obtén respuestas claras sin esperas ni complicaciones.
                        </Text>
                    </View>

                    {/* Benefit 3 */}
                    <View style={styles.benefitCard}>
                        <View style={styles.benefitIconContainer}>
                            <LinearGradient
                                colors={['#92BF4E20', '#92BF4E10']}
                                style={styles.benefitIconBg}
                            >
                                <Ionicons name="people-circle" size={32} color="#92BF4E" />
                            </LinearGradient>
                        </View>
                        <Text style={styles.benefitTitle}>Expertos Certificados</Text>
                        <Text style={styles.benefitDescription}>
                            Cuando necesites más, conecta con contadores y abogados fiscales verificados.
                        </Text>
                    </View>

                    {/* Benefit 4 */}
                    <View style={styles.benefitCard}>
                        <View style={styles.benefitIconContainer}>
                            <LinearGradient
                                colors={['#92BF4E20', '#92BF4E10']}
                                style={styles.benefitIconBg}
                            >
                                <Ionicons name="lock-closed" size={32} color="#92BF4E" />
                            </LinearGradient>
                        </View>
                        <Text style={styles.benefitTitle}>Total Confidencialidad</Text>
                        <Text style={styles.benefitDescription}>
                            Tus datos están protegidos con encriptación de nivel bancario.
                        </Text>
                    </View>
                </View>
            </View>

            {/* HOW IT WORKS */}
            <View style={styles.howItWorksSection}>
                <Text style={styles.sectionTitle}>Cómo funciona</Text>
                <Text style={styles.sectionSubtitle}>Tres pasos para resolver tus dudas fiscales</Text>

                <View style={styles.stepsContainer}>
                    {/* Step 1 */}
                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Pregunta a la IA</Text>
                            <Text style={styles.stepDescription}>
                                Describe tu situación fiscal en lenguaje natural. Sin formularios complicados.
                            </Text>
                        </View>
                        <Ionicons name="chatbubble-ellipses-outline" size={48} color="#92BF4E40" style={styles.stepIcon} />
                    </View>

                    {/* Connector */}
                    <View style={styles.stepConnector} />

                    {/* Step 2 */}
                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Recibe Análisis Inteligente</Text>
                            <Text style={styles.stepDescription}>
                                Obtén un diagnóstico detallado con recomendaciones específicas para tu caso.
                            </Text>
                        </View>
                        <Ionicons name="bulb-outline" size={48} color="#92BF4E40" style={styles.stepIcon} />
                    </View>

                    {/* Connector */}
                    <View style={styles.stepConnector} />

                    {/* Step 3 */}
                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Conéctate con un Experto</Text>
                            <Text style={styles.stepDescription}>
                                Si necesitas más ayuda, habla directamente con un profesional certificado.
                            </Text>
                        </View>
                        <Ionicons name="person-circle-outline" size={48} color="#92BF4E40" style={styles.stepIcon} />
                    </View>
                </View>
            </View>

            {/* TRUST SECTION */}
            <View style={styles.trustSection}>
                <View style={styles.trustBadges}>
                    <View style={styles.trustBadge}>
                        <Ionicons name="shield-checkmark" size={32} color="#92BF4E" />
                        <Text style={styles.trustBadgeText}>Datos Encriptados</Text>
                    </View>
                    <View style={styles.trustBadge}>
                        <Ionicons name="checkmark-circle" size={32} color="#92BF4E" />
                        <Text style={styles.trustBadgeText}>Expertos Verificados</Text>
                    </View>
                    <View style={styles.trustBadge}>
                        <Ionicons name="time" size={32} color="#92BF4E" />
                        <Text style={styles.trustBadgeText}>Disponible 24/7</Text>
                    </View>
                </View>

                <View style={styles.guarantee}>
                    <Text style={styles.guaranteeTitle}>Garantía de Satisfacción</Text>
                    <Text style={styles.guaranteeText}>
                        Si no quedas satisfecho con tu primera consulta, te devolvemos tu dinero. Sin preguntas.
                    </Text>
                </View>
            </View>

            {/* TESTIMONIALS */}
            <View style={styles.testimonialsSection}>
                <Text style={styles.sectionTitle}>Lo que dicen nuestros usuarios</Text>

                <View style={styles.testimonialsGrid}>
                    {/* Testimonial 1 */}
                    <View style={styles.testimonialCard}>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons key={star} name="star" size={16} color="#92BF4E" />
                            ))}
                        </View>
                        <Text style={styles.testimonialText}>
                            "Kontify+ me ahorró horas de investigación. La IA es increíblemente precisa y cuando necesité hablar con un experto, la conexión fue inmediata."
                        </Text>
                        <View style={styles.testimonialAuthor}>
                            <View style={styles.authorAvatar}>
                                <Text style={styles.authorInitials}>MR</Text>
                            </View>
                            <View>
                                <Text style={styles.authorName}>María Rodríguez</Text>
                                <Text style={styles.authorRole}>CEO, TechStart MX</Text>
                            </View>
                        </View>
                    </View>

                    {/* Testimonial 2 */}
                    <View style={styles.testimonialCard}>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons key={star} name="star" size={16} color="#92BF4E" />
                            ))}
                        </View>
                        <Text style={styles.testimonialText}>
                            "Como contador, uso Kontify+ para validar casos complejos. La calidad de los expertos es excepcional y el sistema es súper intuitivo."
                        </Text>
                        <View style={styles.testimonialAuthor}>
                            <View style={styles.authorAvatar}>
                                <Text style={styles.authorInitials}>CG</Text>
                            </View>
                            <View>
                                <Text style={styles.authorName}>Carlos Gómez</Text>
                                <Text style={styles.authorRole}>Contador Público Certificado</Text>
                            </View>
                        </View>
                    </View>

                    {/* Testimonial 3 */}
                    <View style={styles.testimonialCard}>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons key={star} name="star" size={16} color="#92BF4E" />
                            ))}
                        </View>
                        <Text style={styles.testimonialText}>
                            "Perfecto para emprendedores. Respuestas rápidas, claras y confiables. Ya no pierdo tiempo buscando información contradictoria en internet."
                        </Text>
                        <View style={styles.testimonialAuthor}>
                            <View style={styles.authorAvatar}>
                                <Text style={styles.authorInitials}>AL</Text>
                            </View>
                            <View>
                                <Text style={styles.authorName}>Ana López</Text>
                                <Text style={styles.authorRole}>Fundadora, EcoCommerce</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* FINAL CTA */}
            <View style={styles.finalCTA}>
                <LinearGradient
                    colors={['#1a1a1a', '#0a0a0a']}
                    style={styles.finalCTAGradient}
                >
                    <Text style={styles.finalCTATitle}>
                        Resuelve tus dudas fiscales ahora
                    </Text>
                    <Text style={styles.finalCTASubtitle}>
                        Únete a miles de emprendedores y contadores que confían en Kontify+
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.ctaButton,
                            pressed && styles.ctaButtonPressed
                        ]}
                        onPress={handleCTA}
                    >
                        <LinearGradient
                            colors={['#92BF4E', '#7DA842']}
                            style={styles.ctaGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.ctaText}>Comenzar Gratis</Text>
                            <Ionicons name="arrow-forward" size={20} color="#000" />
                        </LinearGradient>
                    </Pressable>
                </LinearGradient>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
                <Text style={styles.footerBrand}>Kontify+</Text>
                <Text style={styles.footerTagline}>
                    Inteligencia fiscal al alcance de todos
                </Text>
                <View style={styles.footerLinks}>
                    <Pressable onPress={() => openLink('https://kontify.com/privacy')}>
                        <Text style={styles.footerLink}>Privacidad</Text>
                    </Pressable>
                    <Text style={styles.footerDivider}>•</Text>
                    <Pressable onPress={() => openLink('https://kontify.com/terms')}>
                        <Text style={styles.footerLink}>Términos</Text>
                    </Pressable>
                    <Text style={styles.footerDivider}>•</Text>
                    <Pressable onPress={() => openLink('mailto:hola@kontify.com')}>
                        <Text style={styles.footerLink}>Contacto</Text>
                    </Pressable>
                </View>
                <Text style={styles.footerCopyright}>
                    © 2025 Kontify+. Todos los derechos reservados.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },

    // HERO SECTION
    hero: {
        paddingTop: 80,
        paddingBottom: 120,
        paddingHorizontal: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    heroContent: {
        alignItems: 'center',
        zIndex: 2,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#92BF4E20',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#92BF4E40',
        marginBottom: 32,
    },
    badgeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#92BF4E',
        marginRight: 8,
    },
    badgeText: {
        color: '#92BF4E',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    heroTitle: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 56,
        letterSpacing: -1,
    },
    heroTitleAccent: {
        color: '#92BF4E',
    },
    heroSubtitle: {
        fontSize: 18,
        color: '#AAAAAA',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 28,
        maxWidth: 600,
    },
    ctaButton: {
        marginBottom: 24,
    },
    ctaButtonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 12,
        gap: 12,
    },
    ctaText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    trustLine: {
        color: '#666666',
        fontSize: 14,
        textAlign: 'center',
    },

    // FLOATING CARDS
    floatingCards: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    floatingCard: {
        position: 'absolute',
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#92BF4E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    card1: {
        top: 100,
        left: 20,
    },
    card2: {
        top: 200,
        right: 20,
    },
    card3: {
        bottom: 100,
        left: '50%',
        transform: [{ translateX: -80 }],
    },
    cardText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },

    // VALUE SECTION
    valueSection: {
        paddingVertical: 60,
        paddingHorizontal: 24,
        backgroundColor: '#0a0a0a',
    },
    valueText: {
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 36,
        fontWeight: '500',
        maxWidth: 800,
        marginHorizontal: 'auto',
    },

    // BENEFITS SECTION
    benefitsSection: {
        paddingVertical: 80,
        paddingHorizontal: 24,
        backgroundColor: '#000000',
    },
    sectionTitle: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        fontSize: 18,
        color: '#888888',
        textAlign: 'center',
        marginBottom: 60,
    },
    benefitsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 24,
        justifyContent: 'center',
    },
    benefitCard: {
        width: '100%',
        maxWidth: 280,
        backgroundColor: '#0f0f0f',
        borderWidth: 1,
        borderColor: '#222222',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
    },
    benefitIconContainer: {
        marginBottom: 24,
    },
    benefitIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    benefitTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    benefitDescription: {
        fontSize: 15,
        color: '#888888',
        textAlign: 'center',
        lineHeight: 24,
    },

    // HOW IT WORKS
    howItWorksSection: {
        paddingVertical: 80,
        paddingHorizontal: 24,
        backgroundColor: '#0a0a0a',
    },
    stepsContainer: {
        maxWidth: 600,
        marginHorizontal: 'auto',
        marginTop: 60,
    },
    step: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 20,
        position: 'relative',
    },
    stepNumber: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#92BF4E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        color: '#000000',
        fontSize: 20,
        fontWeight: '800',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    stepDescription: {
        fontSize: 16,
        color: '#888888',
        lineHeight: 24,
    },
    stepIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    stepConnector: {
        width: 2,
        height: 60,
        backgroundColor: '#333333',
        marginLeft: 23,
        marginVertical: 12,
    },

    // TRUST SECTION
    trustSection: {
        paddingVertical: 80,
        paddingHorizontal: 24,
        backgroundColor: '#000000',
    },
    trustBadges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 32,
        marginBottom: 60,
    },
    trustBadge: {
        alignItems: 'center',
        gap: 12,
    },
    trustBadgeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    guarantee: {
        backgroundColor: '#0f0f0f',
        borderWidth: 1,
        borderColor: '#92BF4E40',
        borderRadius: 16,
        padding: 32,
        maxWidth: 600,
        marginHorizontal: 'auto',
    },
    guaranteeTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#92BF4E',
        marginBottom: 12,
        textAlign: 'center',
    },
    guaranteeText: {
        fontSize: 16,
        color: '#AAAAAA',
        textAlign: 'center',
        lineHeight: 24,
    },

    // TESTIMONIALS
    testimonialsSection: {
        paddingVertical: 80,
        paddingHorizontal: 24,
        backgroundColor: '#0a0a0a',
    },
    testimonialsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 24,
        justifyContent: 'center',
        marginTop: 60,
    },
    testimonialCard: {
        width: '100%',
        maxWidth: 350,
        backgroundColor: '#0f0f0f',
        borderWidth: 1,
        borderColor: '#222222',
        borderRadius: 20,
        padding: 32,
    },
    stars: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 20,
    },
    testimonialText: {
        fontSize: 16,
        color: '#CCCCCC',
        lineHeight: 26,
        marginBottom: 24,
        fontStyle: 'italic',
    },
    testimonialAuthor: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    authorAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#92BF4E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    authorInitials: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '700',
    },
    authorName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    authorRole: {
        color: '#888888',
        fontSize: 14,
    },

    // FINAL CTA
    finalCTA: {
        marginVertical: 80,
        marginHorizontal: 24,
        borderRadius: 24,
        overflow: 'hidden',
    },
    finalCTAGradient: {
        paddingVertical: 80,
        paddingHorizontal: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333333',
    },
    finalCTATitle: {
        fontSize: 40,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    finalCTASubtitle: {
        fontSize: 18,
        color: '#AAAAAA',
        textAlign: 'center',
        marginBottom: 40,
        maxWidth: 500,
    },

    // FOOTER
    footer: {
        paddingVertical: 60,
        paddingHorizontal: 24,
        backgroundColor: '#000000',
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
        alignItems: 'center',
    },
    footerBrand: {
        fontSize: 24,
        fontWeight: '800',
        color: '#92BF4E',
        marginBottom: 8,
    },
    footerTagline: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 32,
    },
    footerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    footerLink: {
        color: '#AAAAAA',
        fontSize: 14,
    },
    footerDivider: {
        color: '#444444',
    },
    footerCopyright: {
        color: '#555555',
        fontSize: 12,
    },
});

