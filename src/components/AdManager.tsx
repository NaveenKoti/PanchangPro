/**
 * AdManager - Centralized Ad Management System
 * 
 * Features:
 * - Controls ad visibility based on premium status
 * - Manages ad placements across the app
 * - Tracks ad impressions (future analytics integration)
 * - Provides consistent ad configuration
 * 
 * Integration Guide:
 * 1. Add your Google AdSense publisher ID in index.html
 * 2. Configure ad unit IDs for each placement
 * 3. Use AdManager components in screens
 */

import React, { useEffect, useState } from 'react';
import { Box, Fade, useMediaQuery, useTheme } from '@mui/material';
import { GoogleAdSlot, AdSize } from './GoogleAdSlot';
import { AdCarousel, AdSlide } from './AdCarousel';

// ============================================================================
// AD CONFIGURATION
// Replace these with your actual Google AdSense slot IDs
// ============================================================================

export interface AdConfig {
  topBanner: string;
  bottomBanner: string;
  sidebarRectangle: string;
  carouselPromo: string;
}

// Ad visibility by screen
export interface AdScreenConfig {
  today: boolean;
  calendar: boolean;
  fasts: boolean;
  myTithis: boolean;
  settings: boolean;
}

// Default ad unit IDs (replace with your actual AdSense slot IDs)
export const DEFAULT_AD_CONFIG: AdConfig = {
  topBanner: '1234567890',      // Top of page banner
  bottomBanner: '0987654321',   // Bottom of page banner
  sidebarRectangle: '1122334455', // Sidebar/inline rectangle
  carouselPromo: '5566778899',  // Carousel promotional ads
};

// Ad visibility by screen - optimized for user experience
// Ads removed from critical/premium areas
export const DEFAULT_SCREEN_CONFIG: AdScreenConfig = {
  today: false,        // No ads on Today screen (critical info)
  calendar: true,      // Ads on Calendar (high engagement)
  fasts: true,         // Ads on Fasts (informational)
  myTithis: false,     // No ads on My Tithis (premium feature)
  settings: false,     // No ads on Settings (user config)
};

// ============================================================================
// AD MANAGER CONTEXT
// ============================================================================

interface AdManagerState {
  showAds: boolean;
  config: AdConfig;
  screenConfig: AdScreenConfig;
  impressionCount: number;
  setShowAds: (show: boolean) => void;
  trackImpression: () => void;
  shouldShowAds: (screen: keyof AdScreenConfig) => boolean;
}

// Global ad manager state (will be integrated with app store)
let globalShowAds = true;
let globalImpressionCount = 0;
const listeners: Set<() => void> = new Set();
const globalScreenConfig: AdScreenConfig = { ...DEFAULT_SCREEN_CONFIG };

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useAdManager = (): AdManagerState => {
  const [showAds, setShowAdsState] = useState(globalShowAds);
  const [impressionCount, setImpressionCount] = useState(globalImpressionCount);
  const [config] = useState<AdConfig>(DEFAULT_AD_CONFIG);
  const [screenConfig] = useState<AdScreenConfig>(globalScreenConfig);

  useEffect(() => {
    const listener = () => {
      setShowAdsState(globalShowAds);
      setImpressionCount(globalImpressionCount);
    };
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setShowAds = (show: boolean) => {
    globalShowAds = show;
    notifyListeners();
  };

  const trackImpression = () => {
    globalImpressionCount++;
    setImpressionCount(globalImpressionCount);
    notifyListeners();
  };

  const shouldShowAds = (screen: keyof AdScreenConfig): boolean => {
    // Premium users never see ads
    if (!showAds) return false;
    // Check screen-specific config
    return screenConfig[screen] || false;
  };

  return {
    showAds,
    config,
    screenConfig,
    impressionCount,
    setShowAds,
    trackImpression,
    shouldShowAds,
  };
};

// ============================================================================
// AD COMPONENTS
// ============================================================================

interface AdPlacementProps {
  placement?: 'top' | 'bottom' | 'inline' | 'sidebar' | 'carousel';
  slotId?: string;
  size?: AdSize;
  showIfPremium?: boolean;
}

/**
 * AdPlacement - Universal ad placement component
 */
export const AdPlacement: React.FC<AdPlacementProps> = ({
  placement = 'inline',
  slotId,
  size,
  showIfPremium = false,
}) => {
  const { showAds, config } = useAdManager();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Hide ads for premium users (unless showIfPremium is true)
  if (!showIfPremium && !showAds) {
    return null;
  }

  // Get slot ID from config if not provided
  const adSlotId = slotId || (() => {
    switch (placement) {
      case 'top': return config.topBanner;
      case 'bottom': return config.bottomBanner;
      case 'sidebar': return config.sidebarRectangle;
      case 'carousel': return config.carouselPromo;
      default: return config.sidebarRectangle;
    }
  })();

  // Determine size based on placement and screen
  const adSize = size || (() => {
    if (placement === 'carousel') return 'responsive' as AdSize;
    if (isMobile) return 'banner' as AdSize;
    switch (placement) {
      case 'top':
      case 'bottom': return 'leaderboard' as AdSize;
      case 'sidebar': return 'medium_rectangle' as AdSize;
      default: return 'responsive' as AdSize;
    }
  })();

  return (
    <Fade in timeout={500}>
      <Box sx={{ my: 1 }}>
        {placement === 'carousel' ? (
          <AdCarousel />
        ) : (
          <GoogleAdSlot
            size={adSize}
            slotId={adSlotId}
            showLabel={showAds}
          />
        )}
      </Box>
    </Fade>
  );
};

/**
 * TopAdBanner - Ad at the top of the page
 */
export const TopAdBanner: React.FC = () => (
  <AdPlacement placement="top" size="responsive" />
);

/**
 * BottomAdBanner - Ad at the bottom of the page
 */
export const BottomAdBanner: React.FC = () => (
  <AdPlacement placement="bottom" size="responsive" />
);

/**
 * InlineAd - Ad within content flow
 */
export const InlineAd: React.FC<{ slotId?: string }> = ({ slotId }) => (
  <AdPlacement placement="inline" slotId={slotId} size="medium_rectangle" />
);

/**
 * SidebarAd - Ad in sidebar (desktop only)
 */
export const SidebarAd: React.FC = () => {
  const isDesktop = useMediaQuery(useTheme().breakpoints.up('md'));
  if (!isDesktop) return null;
  return <AdPlacement placement="sidebar" />;
};

/**
 * CarouselAd - Promotional carousel ads
 */
export const CarouselAd: React.FC<{ slides?: AdSlide[] }> = ({ slides }) => (
  <AdPlacement placement="carousel" />
);

/**
 * StickyBottomAd - Fixed ad at bottom (above navigation)
 */
export const StickyBottomAd: React.FC = () => {
  const { showAds } = useAdManager();
  
  if (!showAds) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 72, // Above bottom navigation
        left: 0,
        right: 0,
        zIndex: 999,
        bgcolor: 'background.paper',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <AdPlacement placement="bottom" size="banner" />
    </Box>
  );
};

// ============================================================================
// ADSENSE SCRIPT INITIALIZER
// Add this to your index.html or main.tsx
// ============================================================================

/**
 * Initialize Google AdSense script
 * Call this once in your app's entry point (main.tsx)
 */
export const initializeAdSense = (publisherId: string) => {
  if (typeof window === 'undefined') return;

  if (document.querySelector('script[data-ad-client]')) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
  script.setAttribute('data-ad-client', publisherId);

  document.head.appendChild(script);
};

// ============================================================================
// EXPORTS
// ============================================================================

export const AdManager = {
  TopAdBanner,
  BottomAdBanner,
  InlineAd,
  SidebarAd,
  CarouselAd,
  StickyBottomAd,
  AdPlacement,
  useAdManager,
  initializeAdSense,
  DEFAULT_AD_CONFIG,
};

export default AdManager;
