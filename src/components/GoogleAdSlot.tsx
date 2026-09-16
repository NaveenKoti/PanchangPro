/**
 * GoogleAdSlot - Google AdSense Integration Component
 * 
 * Usage:
 * 1. Set up Google AdSense account at https://adsense.google.com
 * 2. Replace 'ca-pub-XXXXXXXXXXXXXXXX' with your publisher ID
 * 3. Create ad units in AdSense dashboard and replace slot IDs
 * 4. Add AdSense script to index.html (see documentation)
 * 
 * @see https://support.google.com/adsense/answer/10175505
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Skeleton, useTheme } from '@mui/material';

export type AdSize = 
  | 'banner'           // 320x50 - Mobile banner
  | 'large_banner'     // 320x100 - Large mobile banner
  | 'medium_rectangle' // 300x250 - Medium rectangle
  | 'large_rectangle'  // 336x280 - Large rectangle
  | 'leaderboard'      // 728x90 - Desktop leaderboard
  | 'half_page'        // 300x600 - Half page
  | 'responsive';      // Auto-size responsive

interface GoogleAdSlotProps {
  size?: AdSize;
  slotId: string; // AdSense slot ID (e.g., '1234567890')
  format?: 'auto' | 'display' | 'fluid';
  className?: string;
  style?: React.CSSProperties;
  showLabel?: boolean;
}

// Ad dimensions mapping (width x height in pixels)
const adDimensions: Record<AdSize, { width: string; height: string; label: string }> = {
  banner: { width: '320px', height: '50px', label: 'Banner 320x50' },
  large_banner: { width: '320px', height: '100px', label: 'Large Banner 320x100' },
  medium_rectangle: { width: '300px', height: '250px', label: 'Medium Rectangle 300x250' },
  large_rectangle: { width: '336px', height: '280px', label: 'Large Rectangle 336x280' },
  leaderboard: { width: '728px', height: '90px', label: 'Leaderboard 728x90' },
  half_page: { width: '300px', height: '600px', label: 'Half Page 300x600' },
  responsive: { width: '100%', height: 'auto', label: 'Responsive' },
};

/**
 * GoogleAdSlot Component
 * 
 * Renders a Google AdSense ad slot with proper styling and loading states.
 * In development mode, shows a placeholder instead of actual ads.
 */
export const GoogleAdSlot: React.FC<GoogleAdSlotProps> = ({
  size = 'responsive',
  slotId,
  format = 'auto',
  className,
  style,
  showLabel = true,
}) => {
  const theme = useTheme();
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isPlaceholder = !slotId || slotId.includes('PLACEHOLDER');
  const dimensions = adDimensions[size];

  useEffect(() => {
    // Simulate ad loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!isDevelopment) {
        setAdLoaded(true);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isDevelopment]);

  // Initialize Google AdSense ad (production only)
  useEffect(() => {
    if (adLoaded && !isDevelopment && adRef.current && slotId) {
      try {
        // Push ad configuration to Google AdSense
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).adsbygoogle.push({});
      } catch {
        setHasError(true);
      }
    }
  }, [adLoaded, isDevelopment, slotId, size]);

  // Don't render ads with placeholder publisher ID in production
  if (isPlaceholder && !isDevelopment) return null;

  // Placeholder content for development
  if (isDevelopment || hasError) {
    return (
      <Paper
        elevation={0}
        className={className}
        sx={{
          width: dimensions.width === '100%' ? '100%' : dimensions.width,
          minHeight: dimensions.height,
          margin: '12px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
          border: `2px dashed ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          ...style,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'primary.main',
              fontWeight: 500,
              fontSize: '0.875rem',
              mb: 0.5,
            }}
          >
            📢 Advertisement
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.7rem',
              textAlign: 'center',
            }}
          >
            {dimensions.label}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontSize: '0.65rem',
              mt: 0.5,
              fontFamily: 'monospace',
            }}
          >
            Slot: {slotId}
          </Typography>
          {isDevelopment && (
            <Typography
              variant="caption"
              sx={{
                color: 'warning.main',
                fontSize: '0.6rem',
                mt: 1,
                bgcolor: 'warning.light',
                px: 1,
                py: 0.25,
                borderRadius: 1,
              }}
            >
              DEV MODE
            </Typography>
          )}
        </Box>
      </Paper>
    );
  }

  // Production: Render actual Google AdSense slot
  return (
    <Box
      ref={adRef}
      className={className}
      sx={{
        width: dimensions.width === '100%' ? '100%' : dimensions.width,
        minHeight: dimensions.height,
        margin: '12px auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={dimensions.height === 'auto' ? 90 : dimensions.height}
          sx={{
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            borderRadius: 2,
          }}
        />
      ) : (
        <ins
          className="adsbygoogle"
          style={{
            display: 'block',
            width: dimensions.width === '100%' ? '100%' : dimensions.width,
            height: dimensions.height === 'auto' ? undefined : dimensions.height,
            textAlign: 'center',
          }}
          data-ad-client="ca-pub-PLACEHOLDER"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={size === 'responsive'}
        />
      )}
      {showLabel && !isLoading && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            fontSize: '0.55rem',
            letterSpacing: '0.05em',
          }}
        >
          Ad
        </Typography>
      )}
    </Box>
  );
};

/**
 * ResponsiveBanner - Auto-sizing banner for any screen
 */
export const ResponsiveBanner: React.FC<{ slotId: string }> = ({ slotId }) => (
  <GoogleAdSlot size="responsive" slotId={slotId} />
);

/**
 * MobileBanner - Fixed size banner optimized for mobile
 */
export const MobileBanner: React.FC<{ slotId: string }> = ({ slotId }) => (
  <GoogleAdSlot size="banner" slotId={slotId} />
);

/**
 * MediumRectangle - Medium rectangle ad for content integration
 */
export const MediumRectangle: React.FC<{ slotId: string }> = ({ slotId }) => (
  <GoogleAdSlot size="medium_rectangle" slotId={slotId} />
);

export default GoogleAdSlot;
