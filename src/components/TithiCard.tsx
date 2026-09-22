/**
 * TithiCard - Premium Redesign
 * 
 * Design Principles:
 * - Minimal, calm, focused
 * - Generous whitespace
 * - Single accent color (saffron)
 * - Soft shadows, no gradients
 * - Clear hierarchy
 */

import React from 'react';
import { Card, CardContent, Typography, Box, Chip, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Moon } from 'lucide-react';
import { Tithi } from '../types';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { triggerHapticIfSupported } from '../utils/haptics';

interface TithiCardProps {
  tithi: Tithi;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const TithiCard: React.FC<TithiCardProps> = ({ tithi, compact = false, onClick }) => {
  const theme = useTheme();
  const { isMobile } = useBreakpoints();
  const isDark = theme.palette.mode === 'dark';
  const isShukla = tithi.paksha === 'Shukla';

  // Use primary (saffron) for Shukla, secondary (indigo) for Krishna
  const accent = isShukla ? theme.palette.primary : theme.palette.secondary;
  const accentLight = alpha(accent.main, isDark ? 0.14 : 0.08);
  const accentBorder = alpha(accent.main, 0.18);

  // Moon-phase illumination: 0 = new, 15 = full.
  // Waxing (Shukla): lit fraction grows with tithi number; waning (Krishna): shrinks.
  const tithiNum = Math.min(15, Math.max(1, tithi.number));
  const litFraction = isShukla ? tithiNum / 15 : 1 - (tithiNum - 1) / 15;
  const moonSize = 24;
  const litWidth = Math.max(1, Math.round(moonSize * litFraction));
  // Waxing lights the right limb, waning lights the left limb.
  const litX = isShukla ? moonSize - litWidth : 0;
  const clipId = `tithi-moon-${isShukla ? 'sh' : 'kr'}-${tithiNum}`;

  const handleClick = () => {
    if (onClick) {
      triggerHapticIfSupported('selection');
      onClick();
    }
  };

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderColor: accentBorder, flexShrink: 0 }}>
          <Moon
            size={18}
            strokeWidth={1.5}
            color={accent.main}
          />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
          {tithi.name}
        </Typography>
      </Box>
    );
  }

  return (
    <Card
      onClick={handleClick}
      elevation={0}
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        // HERO exception: saffron-tinted wash (low alpha, readable both modes)
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.light, 0.08)} 45%, ${theme.palette.background.paper} 100%)`,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.04)}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': onClick ? {
          boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.06)}`,
          transform: 'translateY(-1px)',
          bgcolor: alpha(theme.palette.primary.main, 0.04),
        } : {},
        '&:active': onClick ? { transform: 'scale(0.98)' } : {},
        height: isMobile ? 'auto' : undefined,
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        {/* Header - Minimal */}
        <Box sx={{ px: 2, pt: 2.5, pb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                bgcolor: isDark ? `${accent.main}22` : accentLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: accentBorder,
                flexShrink: 0,
              }}
            >
              {/* Deterministic moon-phase visual: dark disc + lit overlay via clip */}
              <svg
                width={moonSize}
                height={moonSize}
                viewBox={`0 0 ${moonSize} ${moonSize}`}
                role="img"
                aria-label={`${isShukla ? 'Waxing' : 'Waning'} moon, tithi ${tithi.number}`}
              >
                <defs>
                  <clipPath id={clipId}>
                    <rect x={litX} y={0} width={litWidth} height={moonSize} />
                  </clipPath>
                </defs>
                <circle
                  cx={moonSize / 2}
                  cy={moonSize / 2}
                  r={moonSize / 2 - 1}
                  fill="none"
                  stroke={accent.main}
                  strokeWidth={1.5}
                />
                <circle
                  cx={moonSize / 2}
                  cy={moonSize / 2}
                  r={moonSize / 2 - 2.5}
                  fill={alpha(accent.main, 0.18)}
                />
                <circle
                  cx={moonSize / 2}
                  cy={moonSize / 2}
                  r={moonSize / 2 - 2.5}
                  fill={accent.main}
                  clipPath={`url(#${clipId})`}
                />
              </svg>
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  fontSize: isMobile ? 'clamp(1.75rem, 7vw, 2rem)' : '2.25rem',
                  color: 'text.primary',
                  letterSpacing: '-0.02em',
                  mb: 0.25,
                  lineHeight: 1.15,
                }}
              >
                {tithi.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                }}
              >
                {tithi.nameHindi}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Paksha Chips - Minimal */}
        <Box sx={{ px: 2, pb: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={isShukla ? 'Shukla Paksha' : 'Krishna Paksha'}
              size="small"
              sx={{
                height: 28,
                borderRadius: 1.5,
                bgcolor: accentLight,
                color: accent.main,
                fontWeight: 500,
                fontSize: '0.75rem',
                border: '1px solid',
                borderColor: accentBorder,
              }}
            />
            <Chip
              label={`Tithi ${tithi.number}`}
              size="small"
              variant="outlined"
              sx={{
                height: 28,
                borderRadius: 1.5,
                fontWeight: 500,
                fontSize: '0.75rem',
                borderColor: 'divider',
                color: 'text.secondary',
              }}
            />
          </Box>
        </Box>

        {/* End Time - Subtle divider */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: theme.palette.action.hover,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 400,
              fontSize: '0.75rem',
              color: 'text.secondary',
              letterSpacing: '0.01em',
            }}
          >
            Ends at {tithi.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TithiCard;
