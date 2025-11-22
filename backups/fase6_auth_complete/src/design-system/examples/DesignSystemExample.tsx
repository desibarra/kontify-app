/**
 * DESIGN SYSTEM USAGE EXAMPLE
 * 
 * Demostración de cómo usar los componentes del Design System de Kontify
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { KButton, KCard } from '@/design-system';
import { Ionicons } from '@expo/vector-icons';

export default function DesignSystemExample() {
    return (
        <ScrollView className="flex-1 bg-background p-4">
            {/* Header */}
            <Text className="text-3xl font-bold text-foreground mb-6">
                Design System Demo
            </Text>

            {/* KButton Examples */}
            <KCard variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
                <Text className="text-xl font-semibold text-foreground mb-4">
                    KButton Variants
                </Text>

                {/* Default */}
                <KButton
                    variant="default"
                    size="md"
                    fullWidth
                    onPress={() => console.log('Default pressed')}
                    style={{ marginBottom: 12 }}
                >
                    Default Button
                </KButton>

                {/* Outline */}
                <KButton
                    variant="outline"
                    size="md"
                    fullWidth
                    onPress={() => console.log('Outline pressed')}
                    style={{ marginBottom: 12 }}
                >
                    Outline Button
                </KButton>

                {/* Ghost */}
                <KButton
                    variant="ghost"
                    size="md"
                    fullWidth
                    onPress={() => console.log('Ghost pressed')}
                    style={{ marginBottom: 12 }}
                >
                    Ghost Button
                </KButton>

                {/* Destructive */}
                <KButton
                    variant="destructive"
                    size="md"
                    fullWidth
                    onPress={() => console.log('Destructive pressed')}
                >
                    Destructive Button
                </KButton>
            </KCard>

            {/* KButton Sizes */}
            <KCard variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
                <Text className="text-xl font-semibold text-foreground mb-4">
                    KButton Sizes
                </Text>

                <KButton
                    variant="default"
                    size="sm"
                    fullWidth
                    onPress={() => console.log('Small pressed')}
                    style={{ marginBottom: 12 }}
                >
                    Small Button
                </KButton>

                <KButton
                    variant="default"
                    size="md"
                    fullWidth
                    onPress={() => console.log('Medium pressed')}
                    style={{ marginBottom: 12 }}
                >
                    Medium Button (Default)
                </KButton>

                <KButton
                    variant="default"
                    size="lg"
                    fullWidth
                    onPress={() => console.log('Large pressed')}
                >
                    Large Button
                </KButton>
            </KCard>

            {/* KButton with Icons */}
            <KCard variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
                <Text className="text-xl font-semibold text-foreground mb-4">
                    KButton with Icons
                </Text>

                <KButton
                    variant="default"
                    size="md"
                    fullWidth
                    leftIcon={<Ionicons name="add" size={20} color="#000" />}
                    onPress={() => console.log('Add pressed')}
                    style={{ marginBottom: 12 }}
                >
                    Add Item
                </KButton>

                <KButton
                    variant="outline"
                    size="md"
                    fullWidth
                    rightIcon={<Ionicons name="arrow-forward" size={20} color="#92BF4E" />}
                    onPress={() => console.log('Next pressed')}
                >
                    Next Step
                </KButton>
            </KCard>

            {/* KButton Loading State */}
            <KCard variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
                <Text className="text-xl font-semibold text-foreground mb-4">
                    KButton Loading State
                </Text>

                <KButton
                    variant="default"
                    size="md"
                    fullWidth
                    loading
                    onPress={() => console.log('Loading pressed')}
                >
                    Loading...
                </KButton>
            </KCard>

            {/* KCard Variants */}
            <View className="mb-4">
                <Text className="text-xl font-semibold text-foreground mb-4">
                    KCard Variants
                </Text>

                <KCard variant="flat" padding="md" style={{ marginBottom: 12 }}>
                    <Text className="text-base text-foreground">
                        Flat Card - Sin elevación, solo borde
                    </Text>
                </KCard>

                <KCard variant="elevated" padding="md" style={{ marginBottom: 12 }}>
                    <Text className="text-base text-foreground">
                        Elevated Card - Con sombra sutil (default)
                    </Text>
                </KCard>

                <KCard variant="outlined" padding="md" style={{ marginBottom: 12 }}>
                    <Text className="text-base text-foreground">
                        Outlined Card - Borde verde destacado
                    </Text>
                </KCard>

                <KCard variant="glass" padding="md" style={{ marginBottom: 12 }}>
                    <Text className="text-base text-foreground">
                        Glass Card - Efecto glassmorphism
                    </Text>
                </KCard>
            </View>

            {/* KCard Pressable */}
            <KCard
                variant="elevated"
                padding="lg"
                pressable
                onPress={() => console.log('Card pressed')}
                style={{ marginBottom: 16 }}
            >
                <Text className="text-lg font-semibold text-foreground mb-2">
                    Pressable Card
                </Text>
                <Text className="text-sm text-muted-foreground">
                    Toca esta card para ver el efecto de presión
                </Text>
            </KCard>

            {/* Combined Example */}
            <KCard variant="elevated" padding="lg" style={{ marginBottom: 32 }}>
                <Text className="text-xl font-bold text-foreground mb-2">
                    Ejemplo Completo
                </Text>
                <Text className="text-sm text-muted-foreground mb-4">
                    Combinación de componentes del Design System
                </Text>

                <View className="flex-row gap-3">
                    <KButton
                        variant="default"
                        size="md"
                        onPress={() => console.log('Confirm')}
                        containerStyle={{ flex: 1 }}
                    >
                        Confirmar
                    </KButton>

                    <KButton
                        variant="outline"
                        size="md"
                        onPress={() => console.log('Cancel')}
                        containerStyle={{ flex: 1 }}
                    >
                        Cancelar
                    </KButton>
                </View>
            </KCard>
        </ScrollView>
    );
}
