/**
 * TodayGuidanceCard - Premium Redesign
 * 
 * Design Principles:
 * - Calm, not alarming
 * - Single color indicator (not traffic lights)
 * - Generous whitespace
 * - Minimal text density
 * - Soft, breathable layout
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Collapse,
  IconButton,
  Fade,
  useTheme,
} from '@mui/material';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Panchang, TimeRange } from '../types';
import {
  calculateGuidance,
  GuidanceResult,
  calculateAbhijitMuhurta,
  getGuidanceSummary,
  getGuidanceSummaryHindi,
} from '../engine/guidanceEngine';
import { useI18n } from '../hooks/useI18n';

interface TodayGuidanceCardProps {
  panchang: Panchang;
  rahuKaal: TimeRange;
  yamagandam: TimeRange;
  gulikaKaal: TimeRange;
}

export const TodayGuidanceCard: React.FC<TodayGuidanceCardProps> = ({
  panchang,
  rahuKaal,
  yamagandam,
  gulikaKaal,
}) => {
  const theme = useTheme();
  const { currentLanguage } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [guidance, setGuidance] = useState<GuidanceResult | null>(null);
  const [currentTime] = useState(new Date());
  const isHindi = currentLanguage === 'hi';

  useEffect(() => {
    const abhijitMuhurta = calculateAbhijitMuhurta(
      panchang.sunrise,
      panchang.sunset
    );

    const result = calculateGuidance(
      panchang,
      currentTime,
      {
        rahuKaal,
        yamagandam,
        gulikaKaal,
        abhijitMuhurta,
      }
    );

    setGuidance(result);
  }, [panchang, currentTime, rahuKaal, yamagandam, gulikaKaal]);

  if (!guidance) return null;

  // Theme-aware colors
  const getColor = () => {
    if (guidance.overall === 'good') return theme.palette.success.main;
    if (guidance.overall === 'neutral') return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const color = getColor();
  const isDark = theme.palette.mode === 'dark';
  const colorLight = isDark ? `${color}15` : `${color}08`;
  const colorBorder = isDark ? `${color}30` : `${color}20`;

  // Thin SVG progress ring for the score (same value, favorability color).
  const ringSize = 44;
  const ringStroke = 3.5;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCirc = 2 * Math.PI * ringRadius;
  const ringValue = Math.min(100, Math.max(0, guidance.score));
  const ringOffset = ringCirc * (1 - ringValue / 100);

  return (
    <Fade in timeout={500}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: `1px solid ${colorBorder}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {/* Header - Always Visible */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: colorLight,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setExpanded(!expanded)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Icon */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: `${color}15`, // 8% opacity
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={22} strokeWidth={1.5} color={color} />
              </Box>

              {/* Text */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1.0625rem',
                    color: 'text.primary',
                    mb: 0.25,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {isHindi ? 'आज का मार्गदर्शन' : "Today's Guidance"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                    lineHeight: 1.45,
                  }}
                >
                  {isHindi ? getGuidanceSummaryHindi(guidance) : getGuidanceSummary(guidance)}
                </Typography>
              </Box>

              {/* Score ring & Expand */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  role="img"
                  aria-label={`Guidance score ${guidance.score} out of 100`}
                  sx={{
                    position: 'relative',
                    width: ringSize,
                    height: ringSize,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
                    <circle
                      cx={ringSize / 2}
                      cy={ringSize / 2}
                      r={ringRadius}
                      fill="none"
                      stroke={`${color}25`}
                      strokeWidth={ringStroke}
                    />
                    <circle
                      cx={ringSize / 2}
                      cy={ringSize / 2}
                      r={ringRadius}
                      fill="none"
                      stroke={color}
                      strokeWidth={ringStroke}
                      strokeLinecap="round"
                      strokeDasharray={ringCirc}
                      strokeDashoffset={ringOffset}
                      transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                    />
                  </svg>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      color: 'text.primary',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {guidance.score}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    color,
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Expanded Content */}
          <Collapse in={expanded} timeout={300}>
            <Box sx={{ p: 1.5, pt: 1.25 }}>
              {/* Good For */}
              {guidance.goodFor.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      color: theme.palette.success.main,
                      mb: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {isHindi ? 'इनके लिए अच्छा' : 'Good For'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {(isHindi ? guidance.goodForHindi : guidance.goodFor).slice(0, 6).map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        size="small"
                        sx={{
                          height: 28,
                          borderRadius: 1.5,
                          bgcolor: `${theme.palette.success.main}10`,
                          color: theme.palette.success.main,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Avoid */}
              {guidance.avoid.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      color: theme.palette.error.main,
                      mb: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {isHindi ? 'इनसे बचें' : 'Avoid'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {(isHindi ? guidance.avoidHindi : guidance.avoid).slice(0, 6).map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        size="small"
                        sx={{
                          height: 28,
                          borderRadius: 1.5,
                          bgcolor: `${theme.palette.error.main}10`,
                          color: theme.palette.error.main,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Reasons */}
              {guidance.reasons.length > 0 && (
                <Box
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      color: 'text.secondary',
                      display: 'block',
                      mb: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {isHindi ? 'कारण' : 'Why this guidance?'}
                  </Typography>
                  {(isHindi ? guidance.reasonsHindi : guidance.reasons).slice(0, 2).map((reason, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{
                        fontWeight: 400,
                        fontSize: '0.8125rem',
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        mb: index === 0 ? 0.5 : 0,
                      }}
                    >
                      • {reason}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default TodayGuidanceCard;
