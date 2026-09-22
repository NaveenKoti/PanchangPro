/**
 * VedaTime Theme - Design Tokens (Redesign Stage 1)
 *
 * Single-accent system:
 * - Canvas/paper, ink text, ONE accent (maroon light / gold dark)
 * - Semantic success/warning/error/info are MUTED and reserved for alerts only
 * - dividers are ~12% ink in both modes
 *
 * Dark mode mechanism: `[data-theme='dark']` on <html> (set by ThemeProvider
 * + useTheme) paired with MUI `palette.mode`. CSS vars below MUST equal the
 * MUI palette values exactly.
 */

// ============================================================================
// COLOR TOKENS — SINGLE SOURCE OF TRUTH (hex lives ONLY in this file)
// ============================================================================

// Canvas / paper
const canvasLight = '#FAF7F2';
const paperLight = '#FFFFFF';
const canvasDark = '#161310';
const paperDark = '#1E1A15';

// Ink
const inkLight = '#221C15';
const inkDark = '#F2ECE3';

// Single accent: deep maroon (light) / warm gold (dark)
const accentLight = {
  light: '#A34A1F',
  main: '#7C2D12',
  dark: '#5C1F0C',
  contrastText: '#FFFFFF',
};

const accentDark = {
  light: '#F2C184',
  main: '#E8A04C',
  dark: '#C67F2E',
  contrastText: '#221C15',
};

// Supporting bronze — muted companion for secondary slots only, never a
// second brand accent. Retained because components reference palette.secondary.
const bronzeLight = {
  light: '#B89A6E',
  main: '#8A6B42',
  dark: '#5F4A2E',
  contrastText: '#FFFFFF',
};

const bronzeDark = {
  light: '#D9BC8F',
  main: '#B89A6E',
  dark: '#8A6B42',
  contrastText: '#221C15',
};

// Semantic colors — MUTED, slightly desaturated MUI-adjacent hues.
// Reserved for alerts/status ONLY. Never use for branding or decoration.
const semanticsLight = {
  success: { light: '#82B190', main: '#4E7F5B', dark: '#35593F', contrastText: '#FFFFFF' },
  warning: { light: '#DCAE6A', main: '#B07A2E', dark: '#7E5620', contrastText: '#FFFFFF' },
  error: { light: '#D68A82', main: '#B05148', dark: '#7E3833', contrastText: '#FFFFFF' },
  info: { light: '#7FA9C9', main: '#4E7FA3', dark: '#385A73', contrastText: '#FFFFFF' },
};

const semanticsDark = {
  success: { light: '#A9D3B2', main: '#82B190', dark: '#4E7F5B', contrastText: '#221C15' },
  warning: { light: '#EAC68C', main: '#DCAE6A', dark: '#B07A2E', contrastText: '#221C15' },
  error: { light: '#E5ADA6', main: '#D68A82', dark: '#B05148', contrastText: '#221C15' },
  info: { light: '#A4C6DE', main: '#7FA9C9', dark: '#4E7FA3', contrastText: '#221C15' },
};

// Meta theme-color for mobile browsers — equals canvas in each mode.
export const metaThemeColors = {
  light: canvasLight,
  dark: canvasDark,
} as const;

// ============================================================================
// BREAKPOINTS — SINGLE SOURCE OF TRUTH FOR RESPONSIVE LAYOUT
// ============================================================================
// Canonical MUI breakpoints so `sx` props + `useMediaQuery` agree everywhere.
// Consumed via `src/hooks/useBreakpoints.ts` (the ONE hook):
//   isMobile = down('sm') (<600), isTablet = between sm-md,
//   isDesktop = up('md'), isLargeDesktop = up('lg').
// Do NOT define competing breakpoint values in any other file.

export const breakpointValues = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

// ============================================================================
// CANONICAL CARD SPEC (documented token — do NOT restyle components here)
// ============================================================================
// Card = elevation 0 + border `1px solid` theme.palette.divider +
// borderRadius 8 (shape.borderRadius) +
// shadow `0 1px 3px rgba(0,0,0,0.04)` light /
// `0 1px 3px rgba(0,0,0,0.3)` dark.
// Component-level card styling is owned by other agents; this file only
// provides the radius token + this spec comment. Do NOT override the full
// MUI `shadows` array.

// ============================================================================
// THEME OPTIONS
// ============================================================================

import type { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  breakpoints: {
    values: breakpointValues,
  },
  palette: {
    mode: 'light',
    primary: accentLight,
    secondary: bronzeLight,
    ...semanticsLight,
    background: {
      default: canvasLight,
      paper: paperLight,
    },
    text: {
      primary: inkLight,
      secondary: 'rgba(34, 28, 21, 0.6)',
      disabled: 'rgba(34, 28, 21, 0.38)',
    },
    divider: 'rgba(34, 28, 21, 0.12)',
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
    borderRadius: 8, // Single canonical radius (crisp, professional) — see CARD SPEC above
  },
  spacing: 8, // 8px base unit
};

// ============================================================================
// DARK THEME OVERRIDES
// ============================================================================

export const darkThemeOptions: ThemeOptions = {
  breakpoints: {
    values: breakpointValues,
  },
  shape: {
    borderRadius: 8, // Single canonical radius (crisp, professional) — see CARD SPEC above
  },
  palette: {
    mode: 'dark',
    primary: accentDark,
    secondary: bronzeDark,
    ...semanticsDark,
    background: {
      default: canvasDark,
      paper: paperDark,
    },
    text: {
      primary: inkDark,
      secondary: 'rgba(242, 236, 227, 0.6)',
      disabled: 'rgba(242, 236, 227, 0.38)',
    },
    divider: 'rgba(242, 236, 227, 0.12)',
  },
};

// ============================================================================
// EXPORT COLOR TOKENS FOR CSS VARIABLES
// ============================================================================
// Values MUST equal the MUI palettes above exactly.

export const lightThemeColors = {
  '--color-primary-light': accentLight.light,
  '--color-primary-main': accentLight.main,
  '--color-primary-dark': accentLight.dark,
  '--color-secondary-light': bronzeLight.light,
  '--color-secondary-main': bronzeLight.main,
  '--color-secondary-dark': bronzeLight.dark,
  '--color-success-light': semanticsLight.success.light,
  '--color-success-main': semanticsLight.success.main,
  '--color-success-dark': semanticsLight.success.dark,
  '--color-warning-light': semanticsLight.warning.light,
  '--color-warning-main': semanticsLight.warning.main,
  '--color-warning-dark': semanticsLight.warning.dark,
  '--color-error-light': semanticsLight.error.light,
  '--color-error-main': semanticsLight.error.main,
  '--color-error-dark': semanticsLight.error.dark,
  '--color-info-light': semanticsLight.info.light,
  '--color-info-main': semanticsLight.info.main,
  '--color-info-dark': semanticsLight.info.dark,
  '--color-bg-default': canvasLight,
  '--color-bg-paper': paperLight,
  '--color-text-primary': inkLight,
  '--color-text-secondary': 'rgba(34, 28, 21, 0.6)',
};

export const darkThemeColors = {
  '--color-primary-light': accentDark.light,
  '--color-primary-main': accentDark.main,
  '--color-primary-dark': accentDark.dark,
  '--color-secondary-light': bronzeDark.light,
  '--color-secondary-main': bronzeDark.main,
  '--color-secondary-dark': bronzeDark.dark,
  '--color-success-light': semanticsDark.success.light,
  '--color-success-main': semanticsDark.success.main,
  '--color-success-dark': semanticsDark.success.dark,
  '--color-warning-light': semanticsDark.warning.light,
  '--color-warning-main': semanticsDark.warning.main,
  '--color-warning-dark': semanticsDark.warning.dark,
  '--color-error-light': semanticsDark.error.light,
  '--color-error-main': semanticsDark.error.main,
  '--color-error-dark': semanticsDark.error.dark,
  '--color-info-light': semanticsDark.info.light,
  '--color-info-main': semanticsDark.info.main,
  '--color-info-dark': semanticsDark.info.dark,
  '--color-bg-default': canvasDark,
  '--color-bg-paper': paperDark,
  '--color-text-primary': inkDark,
  '--color-text-secondary': 'rgba(242, 236, 227, 0.6)',
};

// ============================================================================
// USAGE HELPERS
// ============================================================================

export const getThemeColors = (isDark: boolean) => {
  return isDark ? darkThemeColors : lightThemeColors;
};
