/**
 * InterstitialAd - Full-screen ad placeholder component
 * Why: Provides integration points for full-screen interstitial ads
 * Use cases: Between screen transitions, after completing actions
 * Compatible with: Google AdMob, Facebook Audience Network, Unity Ads
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { X, Timer } from 'lucide-react';

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
  adUnitId?: string;
  autoCloseDelay?: number; // Seconds before auto-close (default: 5)
  showCountdown?: boolean;
}

/**
 * InterstitialAd Component
 * Displays a full-screen ad placeholder with countdown timer
 */
export const InterstitialAd: React.FC<InterstitialAdProps> = ({
  isOpen,
  onClose,
  adUnitId,
  autoCloseDelay = 5,
  showCountdown = true,
}) => {
  const theme = useTheme();
  const [countdown, setCountdown] = useState(autoCloseDelay);
  const [canClose, setCanClose] = useState(false);
  const [progress, setProgress] = useState(0);
  const isDark = theme.palette.mode === 'dark';

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setCountdown(autoCloseDelay);
      setCanClose(false);
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanClose(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, autoCloseDelay]);

  // Progress bar animation
  useEffect(() => {
    if (!isOpen) return;

    const duration = autoCloseDelay * 1000;
    const interval = 50;
    const step = 100 / (duration / interval);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(progressInterval);
  }, [isOpen, autoCloseDelay]);

  // Handle close
  const handleClose = useCallback(() => {
    if (canClose) {
      onClose();
    }
  }, [canClose, onClose]);

  if (!isOpen) return null;

  return (
    <Fade in={isOpen} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          bgcolor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        {/* Progress Bar */}
        {showCountdown && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
              },
            }}
          />
        )}

        {/* Close Button */}
        <Button
          onClick={handleClose}
          disabled={!canClose}
          startIcon={<X size={18} />}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            opacity: canClose ? 1 : 0.5,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {canClose ? 'Skip Ad' : (
            <>
              <Timer size={16} style={{ marginRight: 4 }} />
              {countdown}s
            </>
          )}
        </Button>

        {/* Ad Content Area */}
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            height: 600,
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isDark ? theme.palette.action.hover : theme.palette.action.hover,
            border: `2px dashed ${isDark ? theme.palette.divider : theme.palette.divider}`,
            borderRadius: 3,
            p: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              mb: 2,
            }}
          >
            Interstitial Ad
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.disabled',
              textAlign: 'center',
              fontSize: '0.75rem',
            }}
          >
            {adUnitId || 'Ad Unit ID not configured'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              textAlign: 'center',
              mt: 2,
              fontSize: '0.65rem',
            }}
          >
            320x480 (Mobile Interstitial)
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
};

/**
 * useInterstitialAd Hook
 * Hook for managing interstitial ad state and triggers
 */
export const useInterstitialAd = (adUnitId?: string) => {
  const [isOpen, setIsOpen] = useState(false);

  const showAd = useCallback(() => {
    // In production, this would:
    // 1. Check if ad is loaded
    // 2. Show the ad
    // 3. Handle ad events (impression, click, close)
    setIsOpen(true);
  }, [adUnitId]);

  const hideAd = useCallback(() => {
    setIsOpen(false);
  }, []);

  const preloadAd = useCallback(() => {
    // In production: admob.interstitial.load({ id: adUnitId })
  }, [adUnitId]);

  return {
    isOpen,
    showAd,
    hideAd,
    preloadAd,
    InterstitialAdComponent: (
      <InterstitialAd
        isOpen={isOpen}
        onClose={hideAd}
        adUnitId={adUnitId}
      />
    ),
  };
};

export default InterstitialAd;
