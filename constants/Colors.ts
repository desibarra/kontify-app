export const Colors = {
  light: {
    // Primary - Professional green from logo
    primary: '#C4F082',
    primaryDark: '#A8D96E',
    primaryLight: '#D4F5A0',
    
    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F0F2F5',
    
    // Text
    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    
    // Functional
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',
    
    // UI Elements
    border: '#E0E0E0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Cards
    cardBackground: '#FFFFFF',
    cardBorder: '#E8E8E8',
    
    // Trust indicators
    verified: '#2E7D32',
    rating: '#FFB400',
  },
  dark: {
    // Primary - Adjusted for dark mode
    primary: '#C4F082',
    primaryDark: '#A8D96E',
    primaryLight: '#D4F5A0',
    
    // Backgrounds
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    backgroundTertiary: '#2A2A2A',
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    
    // Functional
    success: '#4CAF50',
    warning: '#FFB300',
    error: '#EF5350',
    info: '#29B6F6',
    
    // UI Elements
    border: '#333333',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    // Cards
    cardBackground: '#1E1E1E',
    cardBorder: '#333333',
    
    // Trust indicators
    verified: '#66BB6A',
    rating: '#FFB400',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
};