export const Colors = {
  // Premium Dark Theme - Default
  dark: {
    // Corporate Green Accents
    primary: '#92BF4E',           // Bright lime green - CTAs, highlights
    primaryHover: '#A3D05F',      // Brighter on hover
    primaryActive: '#81AE3D',     // Darker on active
    secondary: '#7FA646',         // Olive green - badges, tags
    accent: '#347361',            // Teal - secondary actions
    accentDark: '#025940',        // Deep teal - active states

    // Dark Backgrounds
    background: '#000000',        // Pure black - premium sections
    backgroundSecondary: '#0E0E0E', // Deep charcoal - main areas
    backgroundTertiary: '#111111',  // Cards and elevated surfaces
    backgroundElevated: '#1A1A1A',  // Modals, overlays, raised elements

    // Text Hierarchy
    text: '#FFFFFF',              // White - primary text, maximum legibility
    textSecondary: '#F2E8DC',     // Soft cream - subtitles, descriptions
    textTertiary: '#999999',      // Gray - labels, meta info
    textMuted: '#666666',         // Muted gray - disabled text

    // Functional Colors
    success: '#92BF4E',           // Use primary green for success
    warning: '#FFA726',           // Warm orange
    error: '#EF5350',             // Soft red
    info: '#347361',              // Use accent teal for info

    // UI Elements
    border: '#222222',            // Subtle borders for cards
    borderLight: '#333333',       // Lighter borders for dividers
    shadow: 'rgba(0, 0, 0, 0.5)', // Depth and elevation
    shadowLight: 'rgba(0, 0, 0, 0.3)', // Lighter shadows
    overlay: 'rgba(0, 0, 0, 0.8)', // Modal overlays

    // Cards
    cardBackground: '#111111',    // Card backgrounds
    cardBackgroundHover: '#1A1A1A', // Card hover state
    cardBorder: '#222222',        // Card borders

    // Interactive Elements
    inputBackground: '#1A1A1A',   // Input fields
    inputBorder: '#333333',       // Input borders
    inputFocus: '#92BF4E',        // Input focus state

    // Trust indicators
    verified: '#92BF4E',          // Verified badge - use primary green
    rating: '#92BF4E',            // Star ratings - use primary green
    premium: '#FFD700',           // Premium badge - gold
  },
  // Light mode kept for compatibility but app will use dark theme
  light: {
    primary: '#025940',
    primaryHover: '#347361',
    primaryActive: '#004D3D',
    secondary: '#7FA646',
    accent: '#92BF4E',
    accentDark: '#347361',

    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F0F2F5',
    backgroundElevated: '#FFFFFF',

    text: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textMuted: '#CCCCCC',

    success: '#7FA646',
    warning: '#FFA726',
    error: '#DC3545',
    info: '#347361',

    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    overlay: 'rgba(0, 0, 0, 0.5)',

    cardBackground: '#FFFFFF',
    cardBackgroundHover: '#F8F9FA',
    cardBorder: '#E8E8E8',

    inputBackground: '#FFFFFF',
    inputBorder: '#E0E0E0',
    inputFocus: '#025940',

    verified: '#7FA646',
    rating: '#92BF4E',
    premium: '#FFD700',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32, letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28, letterSpacing: -0.2 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  green: {
    shadowColor: '#92BF4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};