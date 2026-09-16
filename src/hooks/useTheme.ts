/**
 * useTheme Hook - Theme/Dark Mode Detection
 * Why: Detects system dark mode preference and syncs with app theme settings
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppStore } from '../stores/appStore';

export type ThemeValue = 'light' | 'dark' | 'system';

export interface UseThemeReturn {
  theme: ThemeValue;
  isDarkMode: boolean;
  setTheme: (theme: ThemeValue) => void;
}

/**
 * Hook for theme/dark mode detection
 * Detects system preference via matchMedia API
 * Syncs with appStore theme settings
 * @returns Theme state with dark mode detection and setter
 */
export function useTheme(): UseThemeReturn {
  // Get theme from app store
  const appTheme = useAppStore((state) => state.preferences.theme);
  const setAppTheme = useAppStore((state) => state.setTheme);

  // Local state for system preference
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Modern browsers
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Set initial value
    setSystemPrefersDark(mediaQuery.matches);

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Compute effective dark mode state
  const isDarkMode = useMemo(() => {
    if (appTheme === 'system') {
      return systemPrefersDark;
    }
    return appTheme === 'dark';
  }, [appTheme, systemPrefersDark]);

  // Set theme wrapper that updates both local and store
  const setTheme = useCallback((newTheme: ThemeValue) => {
    setAppTheme(newTheme);
  }, [setAppTheme]);

  // Apply theme to document for CSS styling
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Add appropriate class
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }

    // Also set data-theme attribute for Tailwind compatibility
    root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#1a1a1a' : '#ffffff');
    }
  }, [isDarkMode]);

  return {
    theme: appTheme,
    isDarkMode,
    setTheme
  };
}

export default useTheme;
