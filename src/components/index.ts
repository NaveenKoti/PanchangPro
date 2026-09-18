/**
 * Components Index - Centralized exports for all UI components
 */

// Navigation
export { BottomNav, type NavTab } from './BottomNav';

// Core UI Components
export { default as TithiCard } from './TithiCard';
export { default as AyurvedicClock } from './AyurvedicClock';
export { ThemeProvider } from './ThemeProvider';

// Ad Components
export { AdBanner, InlineAd, StickyBottomAd, type AdSize } from './AdBanner';
export { AdCarousel, AdCarouselCompact, type AdSlide } from './AdCarousel';
export { InterstitialAd, useInterstitialAd } from './InterstitialAd';

// Sharing Components
export { default as PanchangShareCard } from './PanchangShareCard';

// Skeleton Loaders
export { VedaTimeSkeleton } from './VedaTimeSkeleton';

// Screen-specific Skeletons
export { TodaySkeleton } from './skeletons/TodaySkeleton';
export { CalendarSkeleton } from './skeletons/CalendarSkeleton';
export { FastsSkeleton } from './skeletons/FastsSkeleton';
export { SettingsSkeleton } from './skeletons/SettingsSkeleton';

// Dialogs & Cards
export { default as TithiExplanationDialog } from './TithiExplanationDialog';
export { default as NakshatraExplanationDialog } from './NakshatraExplanationDialog';
export { default as GlossaryDialog } from './GlossaryDialog';
export { TodayGuidanceCard } from './TodayGuidanceCard';
export { default as EkadashiDetailCard } from './EkadashiDetailCard';
export { ExpandableSection } from './ExpandableSection';
export { AuspiciousIndicator } from './AuspiciousIndicator';

// VedaUI — Redesigned components (REDESIGN_SPECIFICATION.md §8.1)
export { ScreenContainer, type ScreenContainerProps } from './ScreenContainer';
export { FastingChip, type FastingInfo, type FastingChipProps } from './FastingChip';
export { OnboardingLayout, type OnboardingLayoutProps } from './OnboardingLayout';
export { default as ErrorBoundary } from './ErrorBoundary';
