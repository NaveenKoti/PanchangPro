/**
 * App Store - Zustand State Management
 * Why: Centralized state with persistence for offline-first app
 * Features: Premium tier, custom tithis, location, preferences, sharing
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  GeoLocation, 
  CustomTithi, 
  UserPreferences, 
  PremiumFeatures,
  SubscriptionTier 
} from '../types';
import { createPanchangEngine } from '../engine';
import { notificationService } from '../services/notificationService';

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate next 5 occurrences of a custom tithi using lunar calendar.
// Location must be the USER's location (callers pass preferences.location) —
// never fall back to a hardcoded city here, or reminders fire on wrong dates.
const calculateNextOccurrences = (tithi: CustomTithi, location: GeoLocation): Date[] => {
  const occurrences: Date[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // For one-time tithis, just return the custom date if it's in the future
  if (!tithi.isRecurring) {
    if (tithi.customDate) {
      const customDate = new Date(tithi.customDate);
      customDate.setHours(0, 0, 0, 0);
      if (customDate >= now) {
        occurrences.push(customDate);
      }
    }
    return occurrences;
  }

  // For recurring tithis, use the PanchangEngine to find when this specific
  // tithi (number + paksha) actually occurs in the lunar calendar over the next 5 months
  const engine = createPanchangEngine(location);

  // Start searching from today, scan up to ~6 months to find 5 occurrences
  // (a lunar month is ~29.5 days, so 5 occurrences fit within ~5 lunar months)
  const maxSearchDays = 180; // ~6 months
  const targetTithiNumber = tithi.tithiNumber;
  const targetPaksha = tithi.paksha;

  for (let dayOffset = 0; dayOffset < maxSearchDays && occurrences.length < 5; dayOffset++) {
    const candidateDate = new Date(now);
    candidateDate.setDate(candidateDate.getDate() + dayOffset);

    const panchang = engine.calculate(candidateDate);

    // Check if this date has the target tithi at sunrise (Udaya Tithi)
    if (
      panchang.tithi.number === targetTithiNumber &&
      panchang.tithi.paksha === targetPaksha
    ) {
      occurrences.push(new Date(candidateDate));
    }
  }

  return occurrences;
};

// Default location (Mumbai)
const DEFAULT_LOCATION: GeoLocation = {
  latitude: 19.0760,
  longitude: 72.8777,
  timezone: 'Asia/Kolkata',
  name: 'Mumbai'
};

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  location: DEFAULT_LOCATION,
  language: 'en',
  theme: 'light',
  notifications: {
    fastingReminders: false,
    festivalAlerts: false,
    dinacharyaReminders: false,
    customTithiReminders: false
  },
  dinacharya: {
    enabled: true,
    showRecommendations: true
  }
};

// Default premium features
const DEFAULT_PREMIUM: PremiumFeatures = {
  isPremium: false,
  tier: 'free',
  features: {
    unlimitedCustomTithis: false,
    fullYearCalendar: false,
    advancedMuhurta: false,
    allLanguages: false,
    allThemes: false,
    advancedNotifications: false,
    noAds: false,
    export: false,
    familySharing: false
  }
};

// Premium is PAUSED repo-wide: no tithi cap. canAddMoreTithis() always
// returns true and addCustomTithi() never rejects on count.

interface AppState {
  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  
  // Premium
  premium: PremiumFeatures;
  setPremiumTier: (tier: SubscriptionTier) => void;
  downgradeToFree: () => void;
  
  // Date
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  
  // Preferences
  preferences: UserPreferences;
  setLocation: (location: GeoLocation) => void;
  setLanguage: (language: 'en' | 'hi' | 'sa' | 'kn' | 'te' | 'ta') => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleNotification: (key: keyof UserPreferences['notifications']) => void;
  updateDinacharyaSettings: (enabled: boolean, showRecommendations: boolean) => void;
  
  // Custom Tithis
  customTithis: CustomTithi[];
  addCustomTithi: (data: Omit<CustomTithi, 'id' | 'createdAt' | 'nextOccurrence'>) => boolean;
  updateCustomTithi: (id: string, data: Partial<CustomTithi>) => void;
  deleteCustomTithi: (id: string) => void;
  canAddMoreTithis: () => boolean;
  getNextOccurrences: (tithiId: string) => Date[];
  
  // Export/Import
  exportCustomTithis: () => string;
  importCustomTithis: (json: string) => { success: boolean; imported: number; errors: string[] };
  
  // Share
  sharePanchang: () => Promise<void>;
  
  // Invite family
  inviteFamilyMember: (phone: string, name: string) => void;
  
  // Calculate panchang
  calculatePanchang: (date: Date) => any;
  
  // Get calendar month data
  getCalendarMonth: (year: number, month: number) => any[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Onboarding
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      
      // Premium
      premium: DEFAULT_PREMIUM,
      setPremiumTier: (tier: SubscriptionTier) => {
        const isPremium = tier === 'premium' || tier === 'family';
        set({
          premium: {
            isPremium,
            tier,
            features: {
              unlimitedCustomTithis: tier === 'family',
              fullYearCalendar: isPremium,
              advancedMuhurta: isPremium,
              allLanguages: isPremium,
              allThemes: isPremium,
              advancedNotifications: isPremium,
              noAds: isPremium,
              export: tier === 'family' || tier === 'premium',
              familySharing: tier === 'family'
            }
          }
        });
      },
      downgradeToFree: () => set({ premium: DEFAULT_PREMIUM }),
      
      // Date
      selectedDate: new Date(),
      setSelectedDate: (date: Date) => set({ selectedDate: date }),
      
      // Preferences
      preferences: DEFAULT_PREFERENCES,
      setLocation: (location: GeoLocation) => 
        set((state) => ({ preferences: { ...state.preferences, location } })),
      setLanguage: (language: 'en' | 'hi' | 'sa' | 'kn' | 'te' | 'ta') =>
        set((state) => ({ preferences: { ...state.preferences, language } })),
      setTheme: (theme: 'light' | 'dark' | 'system') =>
        set((state) => ({ preferences: { ...state.preferences, theme } })),
      toggleNotification: (key: keyof UserPreferences['notifications']) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            notifications: {
              ...state.preferences.notifications,
              [key]: !state.preferences.notifications[key]
            }
          }
        })),
      updateDinacharyaSettings: (enabled: boolean, showRecommendations: boolean) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            dinacharya: { enabled, showRecommendations }
          }
        })),
      
      // Custom Tithis
      customTithis: [],
      addCustomTithi: (data) => {
        const { preferences } = get();
        
        const newTithi: CustomTithi = {
          ...data,
          id: generateId(),
          createdAt: new Date(),
          nextOccurrence: calculateNextOccurrences(data as CustomTithi, preferences.location)[0]
        };
        
        // Schedule notification if reminder is enabled
        if (newTithi.reminderEnabled && newTithi.reminderTime) {
          notificationService.scheduleCustomTithiReminder(newTithi, newTithi.reminderTime, newTithi.nextOccurrence);
        }
        
        set((state) => ({
          customTithis: [...state.customTithis, newTithi]
        }));
        
        return true;
      },
      updateCustomTithi: (id: string, data: Partial<CustomTithi>) => {
        const { preferences } = get();
        set((state) => ({
          customTithis: state.customTithis.map((t) => {
            if (t.id === id) {
              const updated = { ...t, ...data };
              // Recalculate next occurrences if anything date-affecting changed
              // (use !== undefined: month 0 = Chaitra and isRecurring false are valid)
              if (data.tithiNumber !== undefined || data.paksha !== undefined || data.isRecurring !== undefined || data.month !== undefined || data.customDate !== undefined || data.reminderDaysBefore !== undefined) {
                updated.nextOccurrence = calculateNextOccurrences(updated, preferences.location)[0];
              }
              // Reschedule notification if reminder settings changed
              if (data.reminderEnabled !== undefined || data.reminderTime !== undefined || data.reminderDaysBefore !== undefined || data.month !== undefined || data.customDate !== undefined) {
                if (updated.reminderEnabled && updated.reminderTime) {
                  notificationService.cancelNotification(`tithi-${id}`);
                  notificationService.scheduleCustomTithiReminder(updated, updated.reminderTime, updated.nextOccurrence);
                } else {
                  notificationService.cancelNotification(`tithi-${id}`);
                }
              }
              return updated;
            }
            return t;
          })
        }));
      },
      deleteCustomTithi: (id: string) => {
        // Cancel any scheduled notifications
        notificationService.cancelNotification(`tithi-${id}`);
        set((state) => ({
          customTithis: state.customTithis.filter((t) => t.id !== id)
        }));
      },
      // Premium is PAUSED: no cap — adding always works.
      canAddMoreTithis: () => true,
      getNextOccurrences: (tithiId: string) => {
        const { customTithis, preferences } = get();
        const tithi = customTithis.find(t => t.id === tithiId);
        if (!tithi) return [];
        return calculateNextOccurrences(tithi, preferences.location);
      },
      
      // Export/Import
      exportCustomTithis: () => {
        // Premium is PAUSED repo-wide: export is available to all users.
        const { customTithis } = get();
        
        const exportData = {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          tithis: customTithis.map(t => ({
            ...t,
            createdAt: t.createdAt?.toISOString(),
            customDate: t.customDate?.toISOString(),
            nextOccurrence: t.nextOccurrence?.toISOString()
          }))
        };
        
        return JSON.stringify(exportData, null, 2);
      },
      importCustomTithis: (json: string) => {
        // Premium is PAUSED repo-wide: import is available to all users.
        const { preferences } = get();
        
        try {
          const data = JSON.parse(json);
          if (!data.tithis || !Array.isArray(data.tithis)) {
            return { success: false, imported: 0, errors: ['Invalid format'] };
          }
          
          const errors: string[] = [];
          let imported = 0;
          
          data.tithis.forEach((t: any, index: number) => {
            try {
              const newTithi: CustomTithi = {
                id: generateId(),
                name: t.name || 'Unknown',
                nameHindi: t.nameHindi,
                tithiNumber: t.tithiNumber || 1,
                paksha: t.paksha === 'Krishna' ? 'Krishna' : 'Shukla',
                month: t.month || 0,
                isRecurring: t.isRecurring !== false,
                customDate: t.customDate ? new Date(t.customDate) : undefined,
                notes: t.notes,
                reminderEnabled: t.reminderEnabled || false,
                reminderTime: t.reminderTime,
                reminderDaysBefore: t.reminderDaysBefore,
                createdAt: new Date()
              };
              newTithi.nextOccurrence = calculateNextOccurrences(newTithi, preferences.location)[0];
              
              // Schedule notification if reminder is enabled
              if (newTithi.reminderEnabled && newTithi.reminderTime) {
                notificationService.scheduleCustomTithiReminder(newTithi, newTithi.reminderTime, newTithi.nextOccurrence);
              }
              
              set((state) => ({
                customTithis: [...state.customTithis, newTithi]
              }));
              
              imported++;
            } catch (e) {
              errors.push(`Item ${index}: ${e instanceof Error ? e.message : 'Unknown error'}`);
            }
          });
          
          return { success: true, imported, errors };
        } catch (e) {
          return { 
            success: false, 
            imported: 0, 
            errors: [e instanceof Error ? e.message : 'Invalid JSON'] 
          };
        }
      },
      
      // Share
      sharePanchang: async () => {
        const { selectedDate, preferences } = get();
        const engine = createPanchangEngine(preferences.location);
        const panchang = engine.calculate(selectedDate);

        // Create share text
        const shareText = `🙏 Today's Panchang - ${preferences.location.name}
📅 ${selectedDate.toLocaleDateString()}
🌙 Tithi: ${panchang.tithi.name} (${panchang.tithi.paksha})
⭐ Nakshatra: ${panchang.nakshatra.name}
🧘 Yoga: ${panchang.yoga.name}
☀️ Sunrise: ${panchang.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
🌅 Sunset: ${panchang.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

Shared from VedaTime — Sacred Rhythms of Time`;

        // Try native share first
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'VedaTime',
              text: shareText
            });
            return;
          } catch {
            // User cancelled share — not an error
          }
        }

        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(shareText);
          alert('Panchang copied to clipboard!');
        } catch {
          // Clipboard not available
        }
      },
      
      // Invite family
      inviteFamilyMember: (_phone: string, _name: string) => {
        // Backend integration placeholder for family sharing feature
      },
      
      // Calculate panchang
      calculatePanchang: (date: Date) => {
        const { preferences } = get();
        const engine = createPanchangEngine(preferences.location);
        return engine.calculate(date);
      },
      
      // Get calendar month data
      getCalendarMonth: (year: number, month: number) => {
        const { preferences, customTithis, premium } = get();
        const engine = createPanchangEngine(preferences.location);
        const days: any[] = [];
        const today = new Date();
        
        // Get the first day of the month
        const firstDay = new Date(year, month, 1);
        // Get the last day of the month
        const lastDay = new Date(year, month + 1, 0);
        
        for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
          const date = new Date(d);
          const panchang = engine.calculate(date);
          
          // Find custom tithis for this date
          const dayCustomTithis = customTithis.filter(t => {
            if (t.isRecurring) {
              // Check if tithi matches this date's tithi
              return t.tithiNumber === panchang.tithi.number && t.paksha === panchang.tithi.paksha;
            } else if (t.customDate) {
              const tDate = new Date(t.customDate);
              return tDate.toDateString() === date.toDateString();
            }
            return false;
          });
          
          days.push({
            date,
            panchang,
            isToday: date.toDateString() === today.toDateString(),
            isFestival: panchang.festivals.length > 0,
            isFasting: !!panchang.fasting,
            customTithis: dayCustomTithis
          });
        }
        
        return days;
      }
    }),
    {
      name: 'veda-time-storage',
      storage: createJSONStorage(() => {
        // Migrate from old storage key on first load
        if (typeof window !== 'undefined') {
          const oldKey = 'panchang-pro-storage';
          const newKey = 'veda-time-storage';
          if (!localStorage.getItem(newKey) && localStorage.getItem(oldKey)) {
            const old = localStorage.getItem(oldKey);
            if (old) localStorage.setItem(newKey, old);
            localStorage.removeItem(oldKey);
          }
        }
        return localStorage;
      }),
  partialize: (state) => ({
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    premium: state.premium,
    preferences: state.preferences,
    customTithis: state.customTithis
  })
    }
  )
);

// Clear all user data (for "Delete Everything" feature)
export const clearAllData = () => {
  if (typeof window !== 'undefined') {
    // Clear all VedaTime-related localStorage keys
    const keysToRemove = [
      'veda-time-storage',
      'panchang-pro-storage',
    ];

    keysToRemove.forEach(key => {
      try { localStorage.removeItem(key); } catch { /* ignore */ }
    });

    // Reload to reset state
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
};

export default useAppStore;
