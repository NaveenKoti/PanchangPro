/**
 * AuspiciousIndicator - Visual badge for timing favorability
 *
 * Color-coded based on REDESIGN_SPECIFICATION.md:
 * - Saffron: Auspicious periods
 * - Temple Green: Neutral periods
 * - Gray: Challenging periods
 */

import React from 'react';
import { Box, Chip, BoxProps, useTheme } from '@mui/material';
import { Sparkles } from 'lucide-react';

export type Favorability = 'auspicious' | 'neutral' | 'challenging';

export interface AuspiciousIndicatorProps extends BoxProps {
  favorability: Favorability;
  size?: 'small' | 'medium' | 'large';
  message?: string;
  showIcon?: boolean;
}

export const AuspiciousIndicator: React.FC<AuspiciousIndicatorProps> = ({
  favorability,
  size = 'medium',
  message,
  showIcon = true,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getColor = (favorability: Favorability) => {
    switch (favorability) {
      case 'auspicious':
        return {
          bg: isDark ? `${theme.palette.primary.main}20` : `${theme.palette.primary.main}15`,
          color: theme.palette.primary.main,
          border: isDark ? `${theme.palette.primary.main}40` : `${theme.palette.primary.main}30`,
        };
      case 'neutral':
        return {
          bg: isDark ? `${theme.palette.secondary.main}20` : `${theme.palette.secondary.main}15`,
          color: theme.palette.secondary.main,
          border: isDark ? `${theme.palette.secondary.main}40` : `${theme.palette.secondary.main}30`,
        };
      case 'challenging':
        return {
          bg: isDark ? theme.palette.action.hover : theme.palette.action.hover,
          color: 'text.secondary',
          border: theme.palette.divider,
        };
    }
  };

  const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return {
          height: 24,
          fontSize: '0.75rem',
          padding: '0 8px',
        };
      case 'medium':
        return {
          height: 32,
          fontSize: '0.875rem',
          padding: '0 12px',
        };
      case 'large':
        return {
          height: 40,
          fontSize: '1rem',
          padding: '0 16px',
        };
    }
  };

  const colors = getColor(favorability);
  const sizeStyles = getSizeStyles(size);

  if (size === 'large' || message) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.border}`,
          borderRadius: 2,
          padding: '12px 16px',
          fontFamily: '"Noto Sans", sans-serif',
          fontWeight: 500,
          ...sx,
        }}
        {...props}
      >
        {showIcon && <Sparkles size={16} />}
        <span>{message || `✨ ${favorability.charAt(0).toUpperCase() + favorability.slice(1)} timing`}</span>
      </Box>
    );
  }

  return (
    <Box
      component="div"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        px: 1.5,
        py: 0.75,
        fontSize: sizeStyles.fontSize,
        fontWeight: 500,
        fontFamily: '"Noto Sans", sans-serif',
        ...sx,
      }}
      {...props}
    >
      {showIcon && <Sparkles size={14} />}
      <span>{favorability.charAt(0).toUpperCase() + favorability.slice(1)}</span>
    </Box>
  );
};

export default AuspiciousIndicator;
