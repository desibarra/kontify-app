/**
 * KButton - Atomic Component
 * 
 * Botón base del Design System de Kontify
 * Compatible con NativeWind v4
 * 
 * Variantes:
 * - default: Botón principal (verde)
 * - outline: Botón con borde
 * - ghost: Botón transparente
 * - destructive: Botón de acción destructiva (rojo)
 * 
 * Tamaños:
 * - sm: Pequeño (32px altura)
 * - md: Mediano (44px altura) - Default
 * - lg: Grande (56px altura)
 */

import React from 'react';
import {
    Pressable,
    Text,
    ActivityIndicator,
    PressableProps,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { tokens } from '../tokens';

// ============================================
// TYPES
// ============================================

export type KButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
export type KButtonSize = 'sm' | 'md' | 'lg';

export interface KButtonProps extends Omit<PressableProps, 'style'> {
    /** Variante visual del botón */
    variant?: KButtonVariant;

    /** Tamaño del botón */
    size?: KButtonSize;

    /** Texto del botón */
    children: React.ReactNode;

    /** Estado de carga */
    loading?: boolean;

    /** Ancho completo */
    fullWidth?: boolean;

    /** Icono a la izquierda */
    leftIcon?: React.ReactNode;

    /** Icono a la derecha */
    rightIcon?: React.ReactNode;

    /** Estilos personalizados del contenedor */
    containerStyle?: ViewStyle;

    /** Estilos personalizados del texto */
    textStyle?: TextStyle;
}

// ============================================
// VARIANT STYLES
// ============================================

const variantStyles: Record<KButtonVariant, {
    container: ViewStyle;
    text: TextStyle;
    activeContainer: ViewStyle;
}> = {
    default: {
        container: {
            backgroundColor: tokens.colors.brand.primary,
            borderWidth: 0,
        },
        text: {
            color: '#000000',
            fontWeight: tokens.typography.fontWeight.bold,
        },
        activeContainer: {
            backgroundColor: tokens.colors.brand.primaryDark,
        },
    },

    outline: {
        container: {
            backgroundColor: 'transparent',
            borderWidth: tokens.borders.width.base,
            borderColor: tokens.colors.brand.primary,
        },
        text: {
            color: tokens.colors.brand.primary,
            fontWeight: tokens.typography.fontWeight.semibold,
        },
        activeContainer: {
            backgroundColor: `${tokens.colors.brand.primary}20`,
        },
    },

    ghost: {
        container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
        },
        text: {
            color: tokens.colors.dark.foreground,
            fontWeight: tokens.typography.fontWeight.semibold,
        },
        activeContainer: {
            backgroundColor: tokens.colors.dark.backgroundSubtle,
        },
    },

    destructive: {
        container: {
            backgroundColor: tokens.colors.dark.error,
            borderWidth: 0,
        },
        text: {
            color: '#FFFFFF',
            fontWeight: tokens.typography.fontWeight.bold,
        },
        activeContainer: {
            backgroundColor: '#DC2626', // Darker red
        },
    },
};

// ============================================
// SIZE STYLES
// ============================================

const sizeStyles: Record<KButtonSize, {
    container: ViewStyle;
    text: TextStyle;
}> = {
    sm: {
        container: {
            height: 32,
            paddingHorizontal: tokens.spacing[3],
            borderRadius: tokens.borders.radius.base,
        },
        text: {
            fontSize: tokens.typography.fontSize.sm,
        },
    },

    md: {
        container: {
            height: 44,
            paddingHorizontal: tokens.spacing[4],
            borderRadius: tokens.borders.radius.md,
        },
        text: {
            fontSize: tokens.typography.fontSize.base,
        },
    },

    lg: {
        container: {
            height: 56,
            paddingHorizontal: tokens.spacing[6],
            borderRadius: tokens.borders.radius.lg,
        },
        text: {
            fontSize: tokens.typography.fontSize.lg,
        },
    },
};

// ============================================
// COMPONENT
// ============================================

export function KButton({
    variant = 'default',
    size = 'md',
    children,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    containerStyle,
    textStyle,
    ...pressableProps
}: KButtonProps) {
    const variantStyle = variantStyles[variant];
    const sizeStyle = sizeStyles[size];

    const isDisabled = disabled || loading;

    return (
        <Pressable
            disabled={isDisabled}
            {...pressableProps}
            style={({ pressed }) => [
                // Base styles
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: tokens.spacing[2],
                },

                // Size styles
                sizeStyle.container,

                // Variant styles
                variantStyle.container,

                // Full width
                fullWidth && { width: '100%' },

                // Active state
                pressed && !isDisabled && variantStyle.activeContainer,

                // Disabled state
                isDisabled && {
                    opacity: 0.5,
                },

                // Custom styles
                containerStyle,
            ]}
        >
            {/* Left Icon */}
            {leftIcon && !loading && leftIcon}

            {/* Loading Spinner */}
            {loading && (
                <ActivityIndicator
                    size="small"
                    color={variantStyle.text.color}
                />
            )}

            {/* Text */}
            {typeof children === 'string' ? (
                <Text
                    style={[
                        sizeStyle.text,
                        variantStyle.text,
                        textStyle,
                    ]}
                >
                    {children}
                </Text>
            ) : (
                children
            )}

            {/* Right Icon */}
            {rightIcon && !loading && rightIcon}
        </Pressable>
    );
}

// ============================================
// EXPORTS
// ============================================

export default KButton;
