/**
 * AdBanner - Reusable Banner Ad Placeholder Component
 * Why: Provides standardized ad slots for monetization with major ad networks
 * Compatible with: Google AdSense, Google AdMob, Facebook Audience Network
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Skeleton, useTheme } from '@mui/material';

export type AdSize = 'banner' | 'large_banner' | 'medium_rectangle' | 'leaderboard' | 'smart_banner';

interface AdBannerProps {
  size?: AdSize;
  adUnitId?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Ad dimensions mapping (width x height in pixels)
const adDimensions: Record<AdSize, { width: number; height: number; label: string }> = {
  banner: { width: 320, height: 50, label: 'Banner (320x50)' },
  large_banner: { width: 320, height: 100, label: 'Large Banner (320x100)' },
  medium_rectangle: { width: 300, height: 250, label: 'Medium Rectangle (300x250)' },
  leaderboard: { width: 728, height: 90, label: 'Leaderboard (728x90)' },
  smart_banner: { width: 320, height: 50, label: 'Smart Banner' },
};

/**
 * AdBanner Component
 * Displays a placeholder for banner ads with proper dimensions
 * In production, this would integrate with actual ad SDKs
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  size = 'banner',
  adUnitId,
  className,
  style,
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);
  const dimensions = adDimensions[size];

  useEffect(() => {
    // Simulate ad loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAdLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // In production, this would initialize the actual ad
  useEffect(() => {
    if (adLoaded && adRef.current && adUnitId) {
      // Example integration points:
      // - Google AdSense: (window.adsbygoogle = window.adsbygoogle || []).push({});
      // - Google AdMob: admob.banner.show({ id: adUnitId });
      // - Facebook Audience Network: FBAdView.show(adUnitId);
    }
  }, [adLoaded, adUnitId, size]);

  // Don't render a visible placeholder when there's no real ad unit
  if (!adUnitId) return null;

  return (
    <Paper
      elevation={0}
      className={className}
      sx={{
        width: '100%',
        maxWidth: dimensions.width,
        minHeight: dimensions.height,
        margin: '8px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'transparent',
        borderRadius: 2,
        overflow: 'hidden',
        ...style,
      }}
    >
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={dimensions.height}
          sx={{ borderRadius: 2 }}
          animation="wave"
        />
      ) : (
        <Box
          ref={adRef}
          sx={{ width: '100%', height: dimensions.height }}
        />
      )}
    </Paper>
  );
};

/**
 * StickyBottomAd - Fixed position ad at bottom of screen
 * Common placement for mobile apps - appears above bottom navigation
 */
export const StickyBottomAd: React.FC<Omit<AdBannerProps, 'size'>> = (props) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 72, // Above bottom navigation
        left: 0,
        right: 0,
        zIndex: 100,
        bgcolor: 'background.paper',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: isDark
          ? '0 -2px 10px rgba(0,0,0,0.5)'
          : '0 -2px 10px rgba(0,0,0,0.08)',
      }}
    >
      <AdBanner size="smart_banner" {...props} />
    </Box>
  );
};

/**
 * InlineAd - Ad that flows within content
 */
export const InlineAd: React.FC<Omit<AdBannerProps, 'size'>> = (props) => {
  return (
    <Box sx={{ my: 2 }}>
      <AdBanner size="medium_rectangle" {...props} />
    </Box>
  );
};

export default AdBanner;
