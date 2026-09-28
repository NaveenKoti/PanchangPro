/**
 * Locale helpers — single place mapping app language to Intl locale and to
 * localized lunar-month names. Replaces scattered `isHindi ? 'hi-IN' :
 * undefined` ternaries that left kn/te/ta/sa on device-default formatting.
 */
import {
  LUNAR_MONTHS,
  LUNAR_MONTHS_HINDI,
  LUNAR_MONTHS_SANSKRIT,
  LUNAR_MONTHS_KANNADA,
  LUNAR_MONTHS_TELUGU,
  LUNAR_MONTHS_TAMIL,
} from '../engine/constants';

export type AppLanguage = 'en' | 'hi' | 'sa' | 'kn' | 'te' | 'ta';

export function appLocale(lang: AppLanguage): string {
  switch (lang) {
    case 'hi':
      return 'hi-IN';
    case 'sa':
      return 'sa-IN';
    case 'kn':
      return 'kn-IN';
    case 'te':
      return 'te-IN';
    case 'ta':
      return 'ta-IN';
    default:
      return 'en-IN';
  }
}

/** 1-based lunar month number → localized name. Falls back to English. */
export function lunarMonthName(lang: AppLanguage, month1Based: number): string {
  const i = month1Based - 1;
  switch (lang) {
    case 'hi':
      return LUNAR_MONTHS_HINDI[i] ?? LUNAR_MONTHS[i];
    case 'sa':
      return LUNAR_MONTHS_SANSKRIT[i] ?? LUNAR_MONTHS[i];
    case 'kn':
      return LUNAR_MONTHS_KANNADA[i] ?? LUNAR_MONTHS[i];
    case 'te':
      return LUNAR_MONTHS_TELUGU[i] ?? LUNAR_MONTHS[i];
    case 'ta':
      return LUNAR_MONTHS_TAMIL[i] ?? LUNAR_MONTHS[i];
    default:
      return LUNAR_MONTHS[i];
  }
}
