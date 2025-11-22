/**
 * KONTIFY DESIGN SYSTEM - TOKENS
 * 
 * Única fuente de verdad para:
 * - Colores (theme-aware)
 * - Tipografía
 * - Espaciado
 * - Bordes
 * - Sombras
 * - Animaciones
 * 
 * Compatible con NativeWind v4
 */

// ============================================
// 🎨 COLOR TOKENS
// ============================================

export const colors = {
    // Brand Colors
    brand: {
        primary: '#93EC80',      // Verde oficial Kontify
        primaryDark: '#82DB6F',
        primaryLight: '#A4F091',
        secondary: '#1a1a1a',
        accent: '#3B82F6',
    },

    // Semantic Colors (Dark Theme)
    dark: {
        // Backgrounds
        background: '#0a0a0a',        // Fondo principal
        backgroundElevated: '#1a1a1a', // Cards, modales
        backgroundSubtle: '#0f0f0f',   // Inputs, áreas secundarias

        // Foregrounds
        foreground: '#FFFFFF',         // Texto principal
        foregroundMuted: '#AAAAAA',    // Texto secundario
        foregroundSubtle: '#666666',   // Texto terciario

        // Borders
        border: '#333333',
        borderSubtle: '#222222',
        borderFocus: '#93EC80',

        // States
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Overlays
        overlay: 'rgba(0, 0, 0, 0.9)',
        overlayLight: 'rgba(0, 0, 0, 0.5)',
    },

    // Semantic Colors (Light Theme - futuro)
    light: {
        background: '#FFFFFF',
        backgroundElevated: '#F9FAFB',
        backgroundSubtle: '#F3F4F6',
        foreground: '#0a0a0a',
        foregroundMuted: '#6B7280',
        foregroundSubtle: '#9CA3AF',
        border: '#E5E7EB',
        borderSubtle: '#F3F4F6',
        borderFocus: '#93EC80',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        overlay: 'rgba(0, 0, 0, 0.5)',
        overlayLight: 'rgba(0, 0, 0, 0.2)',
    },
} as const;

// ============================================
// 📝 TYPOGRAPHY TOKENS
// ============================================

export const typography = {
    // Font Families
    fontFamily: {
        default: 'System',
        mono: 'Courier',
    },

    // Font Sizes (Mobile-First)
    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
    },

    // Font Weights
    fontWeight: {
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },

    // Line Heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },

    // Letter Spacing
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
    },
} as const;

// ============================================
// 📏 SPACING TOKENS
// ============================================

export const spacing = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
} as const;

// ============================================
// 🔲 BORDER TOKENS
// ============================================

export const borders = {
    radius: {
        none: 0,
        sm: 4,
        base: 8,
        md: 12,
        lg: 16,
        xl: 20,
        full: 9999,
    },

    width: {
        none: 0,
        thin: 1,
        base: 2,
        thick: 4,
    },
} as const;

// ============================================
// 🌑 SHADOW TOKENS
// ============================================

export const shadows = {
    // iOS-style shadows
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1, // Android
    },

    base: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },

    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },

    // Glow effects
    glow: {
        primary: {
            shadowColor: '#93EC80',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        success: {
            shadowColor: '#10B981',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        error: {
            shadowColor: '#EF4444',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
    },
} as const;

// ============================================
// ⚡ ANIMATION TOKENS
// ============================================

export const animations = {
    duration: {
        fast: 150,
        base: 250,
        slow: 350,
    },

    easing: {
        default: 'ease-in-out',
        in: 'ease-in',
        out: 'ease-out',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
} as const;

// ============================================
// 📐 LAYOUT TOKENS
// ============================================

export const layout = {
    // Container widths
    container: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
    },

    // Touch targets (iOS HIG)
    touchTarget: {
        min: 44, // Mínimo recomendado
        comfortable: 48,
    },

    // Z-index layers
    zIndex: {
        base: 0,
        dropdown: 10,
        sticky: 20,
        modal: 30,
        popover: 40,
        toast: 50,
    },
} as const;

// ============================================
// 🎯 HELPER FUNCTIONS
// ============================================

/**
 * Get color based on current theme
 */
export function getColor(colorPath: string, isDark = true): string {
    const theme = isDark ? colors.dark : colors.light;
    const keys = colorPath.split('.');

    let value: any = keys[0] === 'brand' ? colors.brand : theme;

    for (const key of keys) {
        if (key === 'brand' || key === 'dark' || key === 'light') continue;
        value = value[key];
    }

    return value || colors.dark.foreground;
}

/**
 * Get spacing value
 */
export function getSpacing(size: keyof typeof spacing): number {
    return spacing[size];
}

/**
 * Get font size
 */
export function getFontSize(size: keyof typeof typography.fontSize): number {
    return typography.fontSize[size];
}

// ============================================
// 📦 EXPORTS
// ============================================

export const tokens = {
    colors,
    typography,
    spacing,
    borders,
    shadows,
    animations,
    layout,
} as const;

export default tokens;
