/**
 * KCard - Atomic Component
 * 
 * Contenedor base del Design System de Kontify
 * Compatible con NativeWind v4
 * 
 * Variantes:
 * - flat: Sin elevación (solo borde)
 * - elevated: Con sombra sutil
 * - outlined: Con borde destacado
 * - glass: Efecto glassmorphism
 * 
 * Padding:
 * - none: Sin padding
 * - sm: Pequeño (12px)
 * - md: Mediano (16px) - Default
 * - lg: Grande (24px)
 */

import React from 'react';
import {
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import { tokens } from '../tokens';

// ============================================
// TYPES
// ============================================

export type KCardVariant = 'flat' | 'elevated' | 'outlined' | 'glass';
export type KCardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface KCardProps extends Omit<ViewProps, 'style'> {
    /** Variante visual de la card */
    variant?: KCardVariant;

    /** Padding interno */
    padding?: KCardPadding;

    /** Contenido de la card */
    children: React.ReactNode;

    /** Estilos personalizados */
    style?: ViewStyle;

    /** Hacer la card presionable */
    pressable?: boolean;

    /** Callback al presionar (si pressable=true) */
    onPress?: () => void;
}

// ============================================
// VARIANT STYLES
// ============================================

const variantStyles: Record<KCardVariant, ViewStyle> = {
    flat: {
        backgroundColor: tokens.colors.dark.backgroundElevated,
        borderWidth: tokens.borders.width.thin,
        borderColor: tokens.colors.dark.border,
        ...tokens.shadows.sm,
    },

    elevated: {
        backgroundColor: tokens.colors.dark.backgroundElevated,
        borderWidth: tokens.borders.width.thin,
        borderColor: tokens.colors.dark.border,
        ...tokens.shadows.md,
    },

    outlined: {
        backgroundColor: tokens.colors.dark.backgroundElevated,
        borderWidth: tokens.borders.width.base,
        borderColor: tokens.colors.brand.primary,
        ...tokens.shadows.sm,
    },

    glass: {
        backgroundColor: `${tokens.colors.dark.backgroundElevated}CC`, // 80% opacity
        borderWidth: tokens.borders.width.thin,
        borderColor: `${tokens.colors.dark.border}80`,
        ...tokens.shadows.lg,
    },
};

// ============================================
// PADDING STYLES
// ============================================

const paddingStyles: Record<KCardPadding, ViewStyle> = {
    none: {
        padding: 0,
    },
    sm: {
        padding: tokens.spacing[3],
    },
    md: {
        padding: tokens.spacing[4],
    },
    lg: {
        padding: tokens.spacing[6],
    },
};

// ============================================
// COMPONENT
// ============================================

export function KCard({
    variant = 'elevated',
    padding = 'md',
    children,
    style,
    pressable = false,
    onPress,
    ...viewProps
}: KCardProps) {
    const variantStyle = variantStyles[variant];
    const paddingStyle = paddingStyles[padding];

    const containerStyle: ViewStyle = {
        borderRadius: tokens.borders.radius.lg,
        overflow: 'hidden',
        ...variantStyle,
        ...paddingStyle,
        ...style,
    };

    // Si es presionable, usar Pressable (importar si es necesario)
    if (pressable && onPress) {
        const { Pressable } = require('react-native');
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    containerStyle,
                    pressed && {
                        opacity: 0.9,
                        transform: [{ scale: 0.98 }],
                    },
                ]}
                {...viewProps}
            >
                {children}
            </Pressable>
        );
    }

    return (
        <View style={containerStyle} {...viewProps}>
            {children}
        </View>
    );
}

// ============================================
// EXPORTS
// ============================================

export default KCard;
