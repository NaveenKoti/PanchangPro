/**
 * ScreenContainer - Responsive layout container with safe area support
 *
 * Design per REDESIGN_SPECIFICATION.md sections 2.2 & 8.1:
 * - Mobile (<600px): 100% width, 16px padding
 * - Tablet (600-960px): 720px max-width, 24px padding
 * - Desktop (960-1280px): 1140px max-width, 32px padding
 * - Large (>1280px): 1200px max-width, 48px padding
 * - Safe area insets for notched devices
 * - Consistent bottom spacing for navigation bar
 */

import React from 'react';
import { Box, BoxProps, useTheme } from '@mui/material';

export interface ScreenContainerProps extends BoxProps {
  /** Disable bottom padding for the nav bar (default: false) */
  disableNavPadding?: boolean;
  /** Whether to show a subtle background variant */
  variant?: 'default' | 'elevated';
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  disableNavPadding = false,
  variant = 'default',
  sx,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: {
          xs: '100%',
          sm: 720,
          md: 1140,
          lg: 1200,
        },
        mx: 'auto',
        px: {
          xs: 2,    // 16px
          sm: 3,    // 24px
          md: 4,    // 32px
          lg: 6,    // 48px
        },
        pt: {
          xs: 2,
          sm: 3,
        },
        minHeight: '100vh',
        boxSizing: 'border-box',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        // Safe area insets for notched phones (combined with responsive spacing)
        paddingTop: `calc(env(safe-area-inset-top, 0px) + ${theme.spacing(2)})`,
        paddingBottom: disableNavPadding
          ? 'env(safe-area-inset-bottom, 0px)'
          : {
              xs: `calc(env(safe-area-inset-bottom, 0px) + ${theme.spacing(10)})`,
              sm: `calc(env(safe-area-inset-bottom, 0px) + ${theme.spacing(12)})`,
              md: `calc(env(safe-area-inset-bottom, 0px) + ${theme.spacing(4)})`,
            },
        // Background variant
        bgcolor: variant === 'elevated'
          ? theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(0,0,0,0.01)'
          : 'transparent',
        // Smooth transitions
        transition: 'background-color 0.3s ease, padding 0.3s ease',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ScreenContainer;
