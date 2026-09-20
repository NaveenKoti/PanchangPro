/**
 * ThemeProvider - Material UI Theme Management
 * Why: Provides consistent theming across the app with light/dark mode support
 * Uses canonical theme tokens from vedaTheme.ts (ONE saffron, Noto Sans 400/500)
 */

import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
  GlobalStyles,
  Theme
} from '@mui/material';
import { useAppStore } from '../stores/appStore';
import { getThemeColors, themeOptions, darkThemeOptions, metaThemeColors } from '../theme/vedaTheme';

// Theme mode type
export type ThemeMode = 'light' | 'dark' | 'system';

// Theme Provider Props
interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Hook to detect system color scheme preference
 */
function useSystemTheme(): boolean {
  const [prefersDark, setPrefersDark] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches);
    };

    // Use modern API if available, fallback to deprecated one
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersDark;
}

/**
 * Hook to determine effective theme mode
 */
function useEffectiveThemeMode(): 'light' | 'dark' {
  const themeSetting = useAppStore((state) => state.preferences.theme);
  const systemPrefersDark = useSystemTheme();

  return useMemo(() => {
    if (themeSetting === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return themeSetting;
  }, [themeSetting, systemPrefersDark]);
}

/**
 * Hook to manage immediate theme mode override
 * Prevents race conditions during menu transitions
 */
function useImmediateThemeMode() {
  const [immediateMode, setImmediateMode] = useState<'light' | 'dark' | null>(null);
  const storeThemeSetting = useAppStore((state) => state.preferences.theme);
  const systemPrefersDark = useSystemTheme();

  const effectiveMode = useMemo(() => {
    if (immediateMode) {
      return immediateMode;
    }
    
    if (storeThemeSetting === 'system') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    
    return storeThemeSetting as 'light' | 'dark';
  }, [immediateMode, storeThemeSetting, systemPrefersDark]);

  const resetImmediateMode = useCallback(() => {
    setImmediateMode(null);
  }, []);

  return {
    immediateMode,
    setImmediateMode,
    effectiveMode,
    resetImmediateMode
  };
}

export const useThemeManager = () => {
  const { setImmediateMode, resetImmediateMode } = useImmediateThemeMode();
  
  return {
    setImmediateThemeMode: setImmediateMode,
    resetImmediateThemeMode: resetImmediateMode
  };
};

/**
 * Create light theme — palette comes ONLY from themeOptions (vedaTheme.ts).
 * Do NOT re-declare hex values here; this file must stay hex-free.
 */
const createLightTheme = (): Theme => createTheme({ ...themeOptions });

/**
 * Create dark theme — palette comes ONLY from darkThemeOptions (vedaTheme.ts).
 */
const createDarkTheme = (): Theme => createTheme({ ...darkThemeOptions });

/**
 * Global styles for smooth theme transitions
 */
const globalStyles = (
  <GlobalStyles
    styles={{
      'html': {
        scrollBehavior: 'smooth',
      },
      'body': {
        transition: 'background-color 0.3s ease',
      },
    }}
  />
);

/**
 * Theme Provider Component
 * Wraps the application with Material UI theming and manages light/dark mode
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { effectiveMode } = useImmediateThemeMode();

  const theme = useMemo(() => {
    return effectiveMode === 'light' ? createLightTheme() : createDarkTheme();
  }, [effectiveMode]);

  // Update document attributes for CSS and meta theme-color
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const isDark = effectiveMode === 'dark';

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Add appropriate class
    root.classList.add(effectiveMode);

    // Set data-theme attribute for Tailwind/styling compatibility
    root.setAttribute('data-theme', effectiveMode);

    // Sync CSS vars with the MUI palette exactly (single source: vedaTheme)
    const colors = getThemeColors(isDark);
    for (const [key, value] of Object.entries(colors)) {
      root.style.setProperty(key, value);
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? metaThemeColors.dark : metaThemeColors.light);
    }

    // Update color-scheme for system UI elements
    root.style.colorScheme = effectiveMode;
  }, [effectiveMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {globalStyles}
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;

// Export theme creation functions for testing or external use
export { createLightTheme, createDarkTheme };
