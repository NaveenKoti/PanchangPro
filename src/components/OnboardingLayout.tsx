/**
 * OnboardingLayout — Full-screen wizard layout for first-time onboarding
 *
 * Three variants matching the 3-step flow:
 * - 'welcome': gradient background, centered, no indicator (Step 0)
 * - 'setup': default background, top-aligned, step indicator (Step 1)
 * - 'ready': default background, centered, step indicator (Step 2)
 */

import React from 'react';
import { Box, Fade, useTheme } from '@mui/material';

export interface OnboardingLayoutProps {
  /** Current step variant determines background, alignment, and indicator */
  variant: 'welcome' | 'setup' | 'ready';
  /** Explicit step index for the indicator (0-based, 4 steps). Defaults to legacy mapping. */
  step?: number;
  /** Fade animation duration (ms) */
  fadeTimeout?: number;
  children: React.ReactNode;
}

const FADE_TIMEOUTS = { welcome: 600, setup: 500, ready: 500 };

const StepIndicator: React.FC<{ current: number }> = ({ current }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', gap: 0.75, mb: 5 }}>
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            height: 3,
            flex: 1,
            borderRadius: 2,
            bgcolor: i <= current ? theme.palette.primary.main : theme.palette.divider,
            transition: 'background-color 0.3s',
          }}
        />
      ))}
    </Box>
  );
};

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  variant,
  step,
  fadeTimeout,
  children,
}) => {
  const theme = useTheme();
  const timeout = fadeTimeout ?? FADE_TIMEOUTS[variant];

  return (
    <Fade in timeout={timeout}>
      <Box
        sx={
          variant === 'welcome'
            ? {
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
                background: `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 45%, ${theme.palette.primary.light} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center',
              }
            : {
                minHeight: '100vh',
                maxHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
                px: { xs: 2, sm: 4 },
                pt: 6,
                pb: 4,
                maxWidth: 480,
                mx: 'auto',
                width: '100%',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                justifyContent: variant === 'ready' ? 'center' : 'flex-start',
                alignItems: variant === 'ready' ? 'center' : 'stretch',
                textAlign: variant === 'ready' ? 'center' : 'left',
              }
        }
      >
        {variant !== 'welcome' && <StepIndicator current={step ?? (variant === 'setup' ? 1 : 2)} />}
        {children}
      </Box>
    </Fade>
  );
};

export default OnboardingLayout;
