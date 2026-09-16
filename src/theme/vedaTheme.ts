/**
 * VedaTime Theme - Revamped Branding
 * 
 * New Color Palette - Warm, Pleasant & Professional
 * Inspired by temple aesthetics, nature, and sacred geometry
 * 
 * Design Philosophy:
 * - Warm, inviting colors that are easy on the eyes
 * - Professional yet spiritual aesthetic
 * - High contrast for readability (WCAG AA/AAA compliant)
 * - Consistent semantic meaning across light/dark modes
 */

import type { ThemeOptions } from '@mui/material/styles';

// ============================================================================
// COLOR PALETTE - REVAMPED
// ============================================================================

// Primary: Warm Saffron (sacred, auspicious) — ONE canonical saffron per CLAUDE.md
const saffron = {
  light: '#E8944A',
  main: '#C75B12',
  dark: '#7A3008',
  contrastText: '#FFFFFF',
};

// Secondary: Deep Indigo/Temple Blue (divine, serene)
const indigo = {
  light: '#7B8CDE',
  main: '#4A55A8',   // Replaces harsh #2C3E6B
  dark: '#37427A',
  contrastText: '#FFFFFF',
};

// Success: Soft Forest Green (growth, prosperity)
const forest = {
  light: '#68D391',
  main: '#38A169',   // More vibrant than #3D6B24
  dark: '#276749',
  contrastText: '#FFFFFF',
};

// Warning: Warm Amber (caution, attention)
const amber = {
  light: '#F6AD55',
  main: '#DD6B20',
  dark: '#C05621',
  contrastText: '#FFFFFF',
};

// Error: Soft Rose Red (alert, important)
const rose = {
  light: '#FC8181',
  main: '#E53E3E',
  dark: '#C53030',
  contrastText: '#FFFFFF',
};

// Info: Calm Sky Blue (information, guidance)
const sky = {
  light: '#63B3ED',
  main: '#3182CE',
  dark: '#2B6CB0',
  contrastText: '#FFFFFF',
};

// Neutral Palette - Warm Grays (easier on eyes than cool grays)
const neutrals = {
  50: '#FEFCF9',    // Warm white
  100: '#F9F6F1',   // Cream
  200: '#F0EBE3',   // Light warm gray
  300: '#E2D9CC',   // Warm gray
  400: '#C4B8A8',   // Medium warm gray
  500: '#A89B8C',   // Mid gray
  600: '#8B7D6E',   // Dark mid gray
  700: '#6B5D50',   // Dark warm gray
  800: '#4A3F35',   // Very dark
  900: '#2D241C',   // Near black (warm)
};

// ============================================================================
// THEME OPTIONS
// ============================================================================

export const themeOptions: ThemeOptions = {
  palette: {
    primary: saffron,
    secondary: indigo,
    success: forest,
    warning: amber,
    error: rose,
    info: sky,
    background: {
      default: neutrals[50],
      paper: '#FFFFFF',
    },
    text: {
      primary: neutrals[900],
      secondary: neutrals[700],
      disabled: neutrals[400],
    },
    // Custom semantic colors
    saffron,
    indigo,
    forest,
    amber,
    rose,
    sky,
    neutrals,
  },
  typography: {
    fontFamily: '"Noto Sans", "Noto Sans Devanagari", sans-serif',
    h1: {
      fontWeight: 500,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 500,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none' as const,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontWeight: 500,
      letterSpacing: '0.08em',
    },
  },
  shape: {
    borderRadius: 12, // More rounded, modern feel
  },
  spacing: 8, // 8px base unit
};

// ============================================================================
// DARK THEME OVERRIDES
// ============================================================================

export const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      ...saffron,
      light: '#FDDCB5',
      main: '#E8944A',
      dark: '#C75B12',
    },
    secondary: {
      ...indigo,
      light: '#A3B1F0',
      main: '#7B8CDE',
      dark: '#4A55A8',
    },
    success: {
      ...forest,
      light: '#9AE6B4',
      main: '#68D391',
      dark: '#38A169',
    },
    warning: {
      ...amber,
      light: '#FBD38D',
      main: '#F6AD55',
      dark: '#DD6B20',
    },
    error: {
      ...rose,
      light: '#FEB2B2',
      main: '#FC8181',
      dark: '#E53E3E',
    },
    info: {
      ...sky,
      light: '#90CDF4',
      main: '#63B3ED',
      dark: '#3182CE',
    },
    background: {
      default: '#1A1612',    // Warm dark background
      paper: '#242019',      // Warm dark cards
    },
    text: {
      primary: '#F5F0E8',    // Warm white text
      secondary: '#C4B8A8',  // Warm gray text
      disabled: '#6B5D50',
    },
  },
};

// ============================================================================
// THEME CREATION
// ============================================================================

// ============================================================================
// EXPORT COLOR TOKENS FOR CSS VARIABLES
// ============================================================================

export const lightThemeColors = {
  '--color-primary-light': saffron.light,
  '--color-primary-main': saffron.main,
  '--color-primary-dark': saffron.dark,
  '--color-secondary-light': indigo.light,
  '--color-secondary-main': indigo.main,
  '--color-secondary-dark': indigo.dark,
  '--color-success-light': forest.light,
  '--color-success-main': forest.main,
  '--color-success-dark': forest.dark,
  '--color-warning-light': amber.light,
  '--color-warning-main': amber.main,
  '--color-warning-dark': amber.dark,
  '--color-error-light': rose.light,
  '--color-error-main': rose.main,
  '--color-error-dark': rose.dark,
  '--color-info-light': sky.light,
  '--color-info-main': sky.main,
  '--color-info-dark': sky.dark,
  '--color-bg-default': neutrals[50],
  '--color-bg-paper': '#FFFFFF',
  '--color-text-primary': neutrals[900],
  '--color-text-secondary': neutrals[700],
  '--color-neutral-50': neutrals[50],
  '--color-neutral-100': neutrals[100],
  '--color-neutral-200': neutrals[200],
  '--color-neutral-300': neutrals[300],
  '--color-neutral-400': neutrals[400],
  '--color-neutral-500': neutrals[500],
  '--color-neutral-600': neutrals[600],
  '--color-neutral-700': neutrals[700],
  '--color-neutral-800': neutrals[800],
  '--color-neutral-900': neutrals[900],
};

export const darkThemeColors = {
  '--color-primary-light': '#FDDCB5',
  '--color-primary-main': '#E8944A',
  '--color-primary-dark': '#C75B12',
  '--color-secondary-light': '#A3B1F0',
  '--color-secondary-main': '#7B8CDE',
  '--color-secondary-dark': '#4A55A8',
  '--color-success-light': '#9AE6B4',
  '--color-success-main': '#68D391',
  '--color-success-dark': '#38A169',
  '--color-warning-light': '#FBD38D',
  '--color-warning-main': '#F6AD55',
  '--color-warning-dark': '#DD6B20',
  '--color-error-light': '#FEB2B2',
  '--color-error-main': '#FC8181',
  '--color-error-dark': '#E53E3E',
  '--color-info-light': '#90CDF4',
  '--color-info-main': '#63B3ED',
  '--color-info-dark': '#3182CE',
  '--color-bg-default': '#1A1612',
  '--color-bg-paper': '#242019',
  '--color-text-primary': '#F5F0E8',
  '--color-text-secondary': '#C4B8A8',
  '--color-neutral-50': '#2D241C',
  '--color-neutral-100': '#4A3F35',
  '--color-neutral-200': '#6B5D50',
  '--color-neutral-300': '#8B7D6E',
  '--color-neutral-400': '#A89B8C',
  '--color-neutral-500': '#C4B8A8',
  '--color-neutral-600': '#E2D9CC',
  '--color-neutral-700': '#F0EBE3',
  '--color-neutral-800': '#F9F6F1',
  '--color-neutral-900': '#FEFCF9',
};

// ============================================================================
// USAGE HELPERS
// ============================================================================

export const getThemeColors = (isDark: boolean) => {
  return isDark ? darkThemeColors : lightThemeColors;
};

declare module '@mui/material/styles' {
  interface Palette {
    saffron: Palette['primary'];
    indigo: Palette['primary'];
    forest: Palette['primary'];
    amber: Palette['primary'];
    rose: Palette['primary'];
    sky: Palette['primary'];
    neutrals: Record<string, string>;
  }
  
  interface PaletteOptions {
    saffron?: PaletteOptions['primary'];
    indigo?: PaletteOptions['primary'];
    forest?: PaletteOptions['primary'];
    amber?: PaletteOptions['primary'];
    rose?: PaletteOptions['primary'];
    sky?: PaletteOptions['primary'];
    neutrals?: Record<string, string>;
  }
}
