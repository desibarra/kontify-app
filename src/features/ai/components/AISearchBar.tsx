import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Text,
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/Colors';
import { matchmakingService } from '../services/matchmakingService';
import { Expert } from '@/constants/Types';
import { useRouter } from 'expo-router';

interface AISearchBarProps {
    experts: Expert[];
}

export default function AISearchBar({ experts }: AISearchBarProps) {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const colors = Colors.dark;
    const router = useRouter();

    const handleMagicSearch = async () => {
        // 🎯 PASO 1: LOG DE DEPURACIÓN - Confirmar que el botón funciona
        console.log("🖱️ BOTÓN IA CLICKADO. Texto ingresado:", query);
        console.log("📋 Total de expertos disponibles:", experts.length);
        
        if (!query.trim()) {
            console.warn("⚠️ Query vacío, búsqueda cancelada");
            return;
        }
        
        if (experts.length === 0) {
            console.error("❌ No hay expertos para analizar");
            Alert.alert('Error', 'No hay expertos disponibles para analizar.');
            return;
        }

        // 🎯 PASO 2: ACTIVAR LOADING STATE (Feedback Visual)
        console.log("🔄 Iniciando búsqueda IA...");
        setIsSearching(true);
        setStatusMessage('🤖 Analizando tu consulta con IA...');
        
        try {
            console.log("🤖 Llamando a matchmakingService.findBestExpert...");
            const match = await matchmakingService.findBestExpert(query, experts);
            console.log("✅ Respuesta de IA recibida:", match);
            setStatusMessage('✅ ¡Encontré una recomendación!');

            // 🎯 PASO 3: MOSTRAR RESULTADO (El "Habla")
            if (match && match.expertId) {
                console.log("🎯 Match encontrado! Expert ID:", match.expertId);
                console.log("💬 Reasoning:", match.reasoning);
                console.log("📊 Confidence:", match.confidence);
                
                // Find the full expert object to ensure it exists
                const expert = experts.find(e => e.id === match.expertId);

                if (expert) {
                    console.log("✅ Experto encontrado en lista:", expert.name);
                    
                    // 🎯 MOSTRAR ALERTA CON RECOMENDACIÓN (UX Principal)
                    const title = match.confidence > 85 
                        ? `✨ Recomendación IA (${match.confidence}% match)` 
                        : `💡 Sugerencia (${match.confidence}% match)`;
                    
                    const message = `${match.reasoning}\n\n👤 Experto: ${expert.name}\n⭐ Rating: ${expert.rating}/5`;
                    
                    if (Platform.OS === 'web') {
                        // Para web, mostrar alert nativo
                        alert(`${title}\n\n${message}`);
                        console.log("🌐 Alert mostrado en web");
                    } else {
                        // Para móvil, mostrar Alert de React Native
                        Alert.alert(title, message, [
                            {
                                text: 'Ver Perfil',
                                onPress: () => {
                                    console.log("👤 Navegando a perfil del experto");
                                    router.push({
                                        pathname: '/expert-detail',
                                        params: {
                                            id: match.expertId,
                                            aiReasoning: match.reasoning
                                        },
                                    });
                                }
                            },
                            { text: 'Cerrar', style: 'cancel' }
                        ]);
                        console.log("📱 Alert mostrado en móvil");
                    }
                } else {
                    console.error("❌ Experto NO encontrado en lista local. ID:", match.expertId);
                    Alert.alert(
                        'IA dice...', 
                        `Tengo una recomendación, pero el experto no está en lista visible.\n\nRazonamiento: ${match.reasoning}`
                    );
                }
            } else {
                console.warn("⚠️ No se encontró ningún match para la consulta");
                Alert.alert(
                    'Sin resultados específicos', 
                    'No encontramos un experto específico para esa consulta. Intenta con otros términos o usa la búsqueda tradicional abajo.',
                    [{ text: 'Entendido' }]
                );
            }
        } catch (error: any) {
            console.error('❌ ERROR EN BÚSQUEDA IA:', error);
            console.error('📄 Detalles del error:', {
                message: error?.message,
                status: error?.status,
                name: error?.name
            });
            
            // Mensaje más amigable si es error de API Key
            if (error?.message?.includes('API Key') || error?.status === 401) {
                console.error("🔑 Error de autenticación con OpenAI API");
                setStatusMessage('⚠️ IA descansando, mostrando todos los expertos');
                Alert.alert(
                    '🌟 IA descansando',
                    'La búsqueda inteligente está tomando un descanso. No te preocupes, aquí tienes la lista completa de expertos disponibles para ayudarte.',
                    [{ text: 'Ver expertos' }]
                );
            } else {
                console.error("💥 Error desconocido en búsqueda IA");
                setStatusMessage('⚠️ Error temporal, intenta nuevamente');
                Alert.alert(
                    'Ups...', 
                    'Hubo un problema al consultar con la IA. ¿Quieres intentar de nuevo o ver la lista completa?',
                    [
                        { text: 'Reintentar', onPress: () => handleMagicSearch() }, 
                        { text: 'Ver lista', style: 'cancel' }
                    ]
                );
            }
        } finally {
            // 🎯 PASO 2B: DESACTIVAR LOADING STATE
            console.log("🏁 Búsqueda IA finalizada. Desactivando spinner...");
            setIsSearching(false);
            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    return (
        <View>
            <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
                <View style={styles.inputContainer}>
                    <Ionicons name="sparkles" size={20} color={colors.primary} style={styles.icon} />
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="¿Qué necesitas? (ej. ayuda con impuestos)"
                        placeholderTextColor={colors.textTertiary}
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleMagicSearch}
                        returnKeyType="search"
                        editable={!isSearching}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: query.trim() ? colors.primary : colors.surface },
                    ]}
                    onPress={handleMagicSearch}
                    disabled={!query.trim() || isSearching}
                >
                    {isSearching ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Ionicons
                            name="arrow-forward"
                            size={20}
                            color={query.trim() ? '#FFFFFF' : colors.textTertiary}
                        />
                    )}
                </TouchableOpacity>
            </View>
            
            {/* Status Message */}
            {statusMessage && (
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                    {statusMessage}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.xs,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        marginBottom: Spacing.md,
        ...Shadows.sm,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
    },
    icon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        ...Typography.body,
        height: 44,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        ...Typography.bodySmall,
        textAlign: 'center',
        marginTop: -Spacing.xs,
        marginBottom: Spacing.sm,
        fontStyle: 'italic',
    },
});
