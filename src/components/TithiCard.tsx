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
import { Moon } from 'lucide-react';
import { Tithi } from '../types';
import { useBreakpoints } from '../theme/breakpoints';
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
  const isShukla = tithi.paksha === 'Shukla';

  // Use primary (saffron) for Shukla, secondary (indigo) for Krishna
  const accent = isShukla ? theme.palette.primary : theme.palette.secondary;
  const accentLight = `${accent.main}15`;
  const accentBorder = `${accent.main}25`;

  const handleClick = () => {
    if (onClick) {
      triggerHapticIfSupported('selection');
      onClick();
    }
  };

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Moon
          size={18}
          strokeWidth={1.5}
          color={accent.main}
        />
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
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': onClick ? {
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          transform: 'translateY(-1px)',
        } : {},
        height: isMobile ? 'auto' : undefined,
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        {/* Header - Minimal */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                bgcolor: accentLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: accentBorder,
              }}
            >
              <Moon
                size={24}
                strokeWidth={isShukla ? 1.5 : 2}
                color={accent.main}
              />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  fontSize: isMobile ? '1.75rem' : '2rem',
                  color: 'text.primary',
                  letterSpacing: '-0.02em',
                  mb: 0.25,
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
        <Box sx={{ px: 2.5, pb: 2.5 }}>
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
            px: 2.5,
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
