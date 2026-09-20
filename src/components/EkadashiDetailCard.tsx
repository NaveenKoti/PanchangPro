/**
 * EkadashiDetailCard - Compact & User-Friendly
 * 
 * Design:
 * - Compact header always visible
 * - Expandable details (click to view more)
 * - Clean, scannable layout
 * - Essential info at a glance
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FastingInfo } from '../data/fastings';
import { useI18n } from '../hooks/useI18n';

interface EkadashiDetailCardProps {
  ekadashi: FastingInfo;
}

export const EkadashiDetailCard: React.FC<EkadashiDetailCardProps> = ({ ekadashi }) => {
  const { currentLanguage } = useI18n();
  const muiTheme = useMuiTheme();
  const isHindi = currentLanguage === 'hi';
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
        },
      }}
    >
      {/* Compact Header - Always Visible */}
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Icon */}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 164, 215, 0.12)' : 'rgba(44, 62, 107, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={18} strokeWidth={1.5} color={muiTheme.palette.info.main} />
          </Box>
          
          {/* Name & Month */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 500,
                fontSize: '0.9375rem',
                color: 'text.primary',
                mb: 0.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isHindi ? ekadashi.nameHindi : ekadashi.name}
            </Typography>
            
            {/* Quick chips */}
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {ekadashi.month && (
                <Chip
                  label={[
                    'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
                    'Shravana', 'Bhadrapada', 'Ashwin', 'Kartik',
                    'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
                  ][ekadashi.month - 1]}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(199, 91, 18, 0.15)' : 'rgba(199, 91, 18, 0.06)',
                    color: muiTheme.palette.primary.main,
                    minWidth: 'auto',
                    px: 0.5,
                  }}
                />
              )}
              {ekadashi.paksha && (
                <Chip
                  label={ekadashi.paksha === 'Shukla' ? 'Shukla' : 'Krishna'}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 164, 215, 0.1)' : 'rgba(44, 62, 107, 0.06)',
                    color: muiTheme.palette.info.main,
                    minWidth: 'auto',
                    px: 0.5,
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Expand Button */}
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
            sx={{
              width: 32,
              height: 32,
              flexShrink: 0,
              transition: 'transform 0.2s ease',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </IconButton>
        </Box>

        {/* Brief significance preview */}
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            fontWeight: 400,
            fontSize: '0.8125rem',
            color: 'text.secondary',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: expanded ? 'visible' : 'hidden',
          }}
        >
          {isHindi ? ekadashi.significanceHindi : ekadashi.significance}
        </Typography>
      </CardContent>

      {/* Expanded Details */}
      <Collapse in={expanded} timeout={200}>
        <CardContent sx={{ pt: 0, pb: 1.5, '&:last-child': { pb: 1.5 } }}>
          {/* Fasting Rules */}
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
              fontWeight: 500,
              color: muiTheme.palette.primary.main,
              display: 'block',
                mb: 0.5,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              {isHindi ? 'व्रत के नियम' : 'Fasting Rules'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(isHindi ? ekadashi.rulesHindi : ekadashi.rules).slice(0, 4).map((rule, index) => (
                <Chip
                  key={index}
                  label={rule}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(199, 91, 18, 0.15)' : 'rgba(199, 91, 18, 0.06)',
                    color: muiTheme.palette.primary.main,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Benefits */}
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                color: muiTheme.palette.success.main,
                display: 'block',
                mb: 0.5,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              {isHindi ? 'लाभ' : 'Benefits'}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(isHindi ? ekadashi.benefitsHindi : ekadashi.benefits).slice(0, 4).map((benefit, index) => (
                <Chip
                  key={index}
                  label={benefit}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(5, 150, 105, 0.06)',
                    color: muiTheme.palette.success.main,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Parana Time */}
          {ekadashi.paranaTime && (
            <Box
              sx={{
                p: 1,
                bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(129, 199, 106, 0.08)' : 'rgba(61, 107, 36, 0.04)',
                borderRadius: 1,
                border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(129, 199, 106, 0.15)' : 'rgba(61, 107, 36, 0.08)'}`,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: muiTheme.palette.success.main,
                  display: 'block',
                  mb: 0.25,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
              >
                {isHindi ? 'पारण का समय' : 'Parana Time'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  color: muiTheme.palette.success.main,
                  lineHeight: 1.4,
                }}
              >
                {isHindi ? ekadashi.paranaTimeHindi : ekadashi.paranaTime}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default EkadashiDetailCard;
