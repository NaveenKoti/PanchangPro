/**
 * Panchang Pro - Type Definitions
 * Why: Central type definitions ensure consistency across the app
 */

// Geographic location for calculations
export interface GeoLocation {
  latitude: number;
  longitude: number;
  timezone: string;
  name?: string; // City name for display
}

// Tithi (Lunar day)
export interface Tithi {
  number: number; // 1-30
  name: string;
  nameHindi: string;
  paksha: 'Shukla' | 'Krishna';
  startTime: Date;
  endTime: Date;
  isKshaya: boolean; // Whether tithi is skipped
  isVriddhi: boolean; // Whether tithi repeats
}

// Nakshatra (Lunar mansion)
export interface Nakshatra {
  number: number; // 1-27
  name: string;
  nameHindi: string;
  ruler: string;
  startTime: Date;
  endTime: Date;
  favorability?: 'auspicious' | 'neutral' | 'challenging';
}

// Yoga (Sun-Moon combination)
export interface Yoga {
  number: number; // 1-27
  name: string;
  nameHindi: string;
  favorability?: 'auspicious' | 'neutral' | 'challenging';
}

// Karana (Half-tithi)
export interface Karana {
  number: number; // 1-11
  name: string;
  nameHindi: string;
  type: 'fixed' | 'variable';
}

// Var (Weekday)
export interface Var {
  number: number; // 0-6 (Sunday-Saturday)
  name: string;
  nameHindi: string;
}

// Time range for inauspicious periods
export interface TimeRange {
  start: Date;
  end: Date;
}

// Festival information
export interface Festival {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  significance: string;
  date: Date;
  tithiNumber: number;
  paksha: 'Shukla' | 'Krishna';
  month: number;
  type: 'major' | 'minor' | 'regional';
  region?: string[]; // Applicable regions
}

// Fasting information
export interface FastingInfo {
  id: string;
  name: string;
  nameHindi: string;
  type: 'ekadashi' | 'pradosh' | 'sankashti' | 'purnima' | 'amavasya' | 'custom';
  significance: string;
  benefits: string[];
  rules: string[];
  paranaTime?: TimeRange;
  date: Date;
}

// Ayurvedic dinacharya phase
export interface DinacharyaPhase {
  id: string;
  name: string;
  nameHindi: string;
  startTime: Date;
  endTime: Date;
  dosha: 'vata' | 'pitta' | 'kapha';
  activities: string[];
  description: string;
}

// Solar ingress (Sankranti) information for a civil day.
// Present (non-null) only when the Sun crosses a 30° sidereal boundary
// (enters a new rashi) during that local day.
export interface SankrantiInfo {
  /** 0-11 sidereal sign entered: 0=Mesha … 9=Makara, 10=Kumbha, 11=Meena */
  rashiIndex: number;
  name: string;
  nameHindi: string;
  /** Exact local ingress moment (Sun's sidereal longitude crosses rashiIndex*30°) */
  ingressTime: Date;
}

// Complete panchang for a day
export interface Panchang {
  date: Date;
  location: GeoLocation;
  tithi: Tithi;
  nakshatra: Nakshatra;
  yoga: Yoga;
  karana: Karana;
  var: Var;
  sunrise: Date;
  sunset: Date;
  moonrise?: Date;
  moonset?: Date;
  rahuKaal: TimeRange;
  yamagandam: TimeRange;
  gulikaKaal: TimeRange;
  festivals: Festival[];
  fasting?: FastingInfo;
  dinacharya: DinacharyaPhase[];
  samvatsara?: string; // Hindu year name (60-year cycle)
  isAuspiciousTime?: boolean;
  lunarMonth?: number; // Hindu lunar month (1=Chaitra, 12=Phalguna)
  sankranti?: SankrantiInfo | null; // Solar ingress if one occurs this day, else null
}

// User subscription tier
export type SubscriptionTier = 'free' | 'premium' | 'family';

// Premium features
export interface PremiumFeatures {
  isPremium: boolean;
  tier: SubscriptionTier;
  expiresAt?: Date;
  features: {
    unlimitedCustomTithis: boolean;
    fullYearCalendar: boolean;
    advancedMuhurta: boolean;
    allLanguages: boolean;
    allThemes: boolean;
    advancedNotifications: boolean;
    noAds: boolean;
    export: boolean;
    familySharing: boolean;
  };
}

// Custom tithi created by user
export interface CustomTithi {
  id: string;
  name: string;
  nameHindi?: string;
  tithiNumber: number;
  paksha: 'Shukla' | 'Krishna';
  month: number;
  isRecurring: boolean;
  customDate?: Date; // For one-time events
  notes?: string;
  reminderEnabled: boolean;
  reminderTime?: string;
  reminderDaysBefore?: number; // Days before to remind (0-7, 0 = on the day)
  nextOccurrence?: Date; // Calculated next occurrence date
  createdAt: Date;
}

// User preferences
export interface UserPreferences {
  location: GeoLocation;
  language: 'en' | 'hi' | 'sa' | 'kn' | 'te' | 'ta';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    fastingReminders: boolean;
    festivalAlerts: boolean;
    dinacharyaReminders: boolean;
    customTithiReminders: boolean;
  };
  dinacharya: {
    enabled: boolean;
    showRecommendations: boolean;
  };
}

// Calendar day data
export interface CalendarDay {
  date: Date;
  panchang: Panchang;
  isToday: boolean;
  isFestival: boolean;
  isFasting: boolean;
  customTithis: CustomTithi[];
}

// Live Ayurvedic clock widget data
export interface AyurvedicClockData {
  currentPhase: DinacharyaPhase;
  nextPhase: DinacharyaPhase;
  timeUntilNextPhase: number; // milliseconds
  recommendedActivity: string;
  progressInCurrentPhase: number; // 0-1
}

// App state
export interface AppState {
  currentDate: Date;
  selectedDate: Date;
  location: GeoLocation;
  preferences: UserPreferences;
  customTithis: CustomTithi[];
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
  premium: PremiumFeatures;
}

// Onboarding slide types
export type OnboardingSlideType = 
  | 'welcome' 
  | 'features' 
  | 'location' 
  | 'notifications' 
  | 'theme';

// Onboarding slide configuration
export interface OnboardingSlide {
  id: OnboardingSlideType;
  title: string;
  description?: string;
  showBackButton: boolean;
  showSkipButton: boolean;
}

// Onboarding state during setup
export interface OnboardingState {
  currentSlide: number;
  detectedLocation: GeoLocation | null;
  isDetectingLocation: boolean;
  notificationPreferences: {
    dailyPanchang: boolean;
    festivalReminders: boolean;
    fastingReminders: boolean;
  };
  selectedTheme: 'light' | 'dark' | 'system';
  selectedLanguage: 'en' | 'hi' | 'sa' | 'kn' | 'te' | 'ta';
}
