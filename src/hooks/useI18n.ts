/**
 * useI18n Hook - Custom hook for internationalization
 * Why: Wraps react-i18next's useTranslation and syncs with appStore's language preference
 */

import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../stores/appStore';
import { SupportedLanguage, syncLanguageWithStore } from '../i18n';

export interface UseI18nReturn {
  /** Translation function */
  t: (key: string, options?: Record<string, unknown>) => string;
  /** i18n instance */
  i18n: ReturnType<typeof useTranslation>['i18n'];
  /** Current language code */
  currentLanguage: SupportedLanguage;
  /** Set language function */
  setLanguage: (language: SupportedLanguage) => void;
  /** Check if translation key exists */
  exists: (key: string) => boolean;
}

/**
 * Custom hook for internationalization with app store integration
 * @returns UseI18nReturn object with translation utilities
 */
export const useI18n = (): UseI18nReturn => {
  const { t, i18n } = useTranslation();
  const { preferences, setLanguage: setStoreLanguage } = useAppStore();

  // Sync i18n with app store language on mount and when preferences change
  useEffect(() => {
    const storeLang = preferences.language;
    if (i18n.language !== storeLang) {
      i18n.changeLanguage(storeLang);
    }
  }, [preferences.language, i18n]);

  // Set language function that updates both i18n and app store
  const setLanguage = useCallback((language: SupportedLanguage) => {
    // Update i18n immediately for reactive UI updates
    i18n.changeLanguage(language);
    // Update app store for persistence
    setStoreLanguage(language);
    // Sync with localStorage for browser detection
    syncLanguageWithStore(language);
  }, [i18n, setStoreLanguage]);

  // Check if translation key exists
  const exists = useCallback((key: string): boolean => {
    return i18n.exists(key);
  }, [i18n]);

  return {
    t,
    i18n,
    currentLanguage: preferences.language,
    setLanguage,
    exists
  };
};

export default useI18n;
