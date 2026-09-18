/**
 * FastingChip - Fasting status display with countdown timer
 *
 * Design per REDESIGN_SPECIFICATION.md section 8.1:
 * - Shows fasting name with icon
 * - Visual countdown to parana time (break fast)
 * - Color-coded: green for active fasting
 * - Translucent background with success accent
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme,
  Tooltip,
} from '@mui/material';
import { Leaf, Clock } from 'lucide-react';
import { useBreakpoints } from '../hooks/useBreakpoints';

export interface FastingInfo {
  name: string;
  significance?: string;
  paranaTime?: {
    start: Date;
    end: Date;
  };
}

export interface FastingChipProps {
  fasting: FastingInfo;
  /** Show extended layout with countdown */
  detailed?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Format a countdown duration from milliseconds */
function formatCountdown(ms: number): { value: string; unit: string } {
  if (ms <= 0) return { value: '00:00', unit: '' };

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return {
      value: `${hours}h ${minutes}m`,
      unit: 'remaining',
    };
  }
  if (minutes > 0) {
    return {
      value: `${minutes}m ${seconds}s`,
      unit: 'remaining',
    };
  }
  return {
    value: `${seconds}s`,
    unit: 'remaining',
  };
}

export const FastingChip: React.FC<FastingChipProps> = ({
  fasting,
  detailed = false,
  onClick,
  className,
}) => {
  const theme = useTheme();
  const { isMobile } = useBreakpoints();
  const isDark = theme.palette.mode === 'dark';

  const [now, setNow] = useState(new Date());

  // Update countdown every second
  useEffect(() => {
    if (!fasting.paranaTime) return;
    const interval = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(interval);
  }, [fasting.paranaTime]);

  const countdown = useMemo(() => {
    if (!fasting.paranaTime) return null;
    const diff = fasting.paranaTime.start.getTime() - now.getTime();
    return formatCountdown(diff);
  }, [fasting.paranaTime, now]);

  const isActive = useMemo(() => {
    if (!fasting.paranaTime) return true;
    const nowTime = now.getTime();
    return nowTime >= fasting.paranaTime.start.getTime() && nowTime <= fasting.paranaTime.end.getTime();
  }, [fasting.paranaTime, now]);

  if (detailed) {
    return (
      <Box
        className={className}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? `${fasting.name} - fasting details` : undefined}
        onKeyDown={onClick ? (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          bgcolor: isDark
            ? `${theme.palette.success.main}15`
            : `${theme.palette.success.main}10`,
          border: '1px solid',
          borderColor: isDark
            ? `${theme.palette.success.main}30`
            : `${theme.palette.success.main}25`,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
          '&:hover': onClick
            ? {
                bgcolor: isDark
                  ? `${theme.palette.success.main}25`
                  : `${theme.palette.success.main}18`,
              }
            : {},
        }}
      >
        {/* Fasting icon with glow */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isDark
              ? `${theme.palette.success.main}25`
              : `${theme.palette.success.main}15`,
            color: theme.palette.success.main,
            flexShrink: 0,
            animation: isActive ? 'fastingPulse 2s ease-in-out infinite' : 'none',
          }}
        >
          <Leaf size={20} strokeWidth={1.5} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Fasting name */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.success.main,
              lineHeight: 1.3,
              fontSize: isMobile ? '0.875rem' : '0.9375rem',
            }}
          >
            {fasting.name}
          </Typography>

          {/* Significance */}
          {fasting.significance && (
            <Typography
              variant="caption"
              sx={{
                color: isDark ? 'text.secondary' : theme.palette.success.dark,
                display: 'block',
                mt: 0.25,
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {fasting.significance}
            </Typography>
          )}

          {/* Countdown */}
          {countdown && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: isDark
                  ? `${theme.palette.success.main}20`
                  : `${theme.palette.success.main}12`,
              }}
            >
              <Clock size={11} color={theme.palette.success.main} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.success.main,
                  fontSize: '0.7rem',
                  fontFamily: '"Noto Sans", sans-serif',
                }}
              >
                {countdown.value} {countdown.unit}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // Compact version
  return (
    <Chip
      className={className}
      icon={
        <Leaf
          size={14}
          style={{
            color: theme.palette.success.main,
            animation: isActive ? 'fastingPulse 2s ease-in-out infinite' : 'none',
          }}
        />
      }
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <span>{fasting.name}</span>
          {countdown && (
            <Typography
              component="span"
              variant="caption"
              sx={{
                fontWeight: 500,
                color: theme.palette.success.main,
                fontSize: '0.6rem',
                fontFamily: 'monospace',
                ml: 0.25,
              }}
            >
              {countdown.value}
            </Typography>
          )}
        </Box>
      }
      onClick={onClick}
      size="small"
      sx={{
        height: 28,
        borderRadius: 1.5,
        bgcolor: isDark
          ? `${theme.palette.success.main}20`
          : `${theme.palette.success.main}12`,
        color: theme.palette.success.main,
        fontWeight: 500,
        fontSize: '0.75rem',
        border: `1px solid ${isDark ? `${theme.palette.success.main}35` : `${theme.palette.success.main}25`}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': onClick
          ? {
              bgcolor: isDark
                ? `${theme.palette.success.main}30`
                : `${theme.palette.success.main}20`,
            }
          : {},
        '& .MuiChip-icon': {
          ml: '6px',
        },
      }}
    />
  );
};

export default FastingChip;
