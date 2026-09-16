/**
 * i18n Configuration - Internationalization setup
 * Why: Provides multi-language support with browser detection and app store integration
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './en.json';
import hiTranslations from './hi.json';
import saTranslations from './sa.json';
import knTranslations from './kn.json';
import teTranslations from './te.json';
import taTranslations from './ta.json';

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'sa', 'kn', 'te', 'ta'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Language names for display
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिंदी',
  sa: 'संस्कृत',
  kn: 'ಕನ್ನಡ',
  te: 'తెలుగు',
  ta: 'தமிழ்'
};

// Translation resources
const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  sa: {
    translation: saTranslations
  },
  kn: {
    translation: knTranslations
  },
  te: {
    translation: teTranslations
  },
  ta: {
    translation: taTranslations
  }
};

// Initialize i18next
i18n
  // Use browser language detector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize configuration
  .init({
    resources,
    fallbackLng: 'en',
    
    // Language detection options
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache user language in localStorage
      caches: ['localStorage'],
      // Key for localStorage
      lookupLocalStorage: 'i18nextLng'
    },
    
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React configuration
    react: {
      useSuspense: false
    }
  });

// Function to sync i18n language with app store
export const syncLanguageWithStore = (language: SupportedLanguage): void => {
  if (i18n.language !== language) {
    i18n.changeLanguage(language);
  }
};

// Function to get current language
export const getCurrentLanguage = (): SupportedLanguage => {
  const lang = i18n.language as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en';
};

// Function to check if a language is supported
export const isSupportedLanguage = (lang: string): lang is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
};

export default i18n;
