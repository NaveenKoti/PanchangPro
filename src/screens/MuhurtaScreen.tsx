/**
 * MuhurtaScreen - Dynamic Choghadiya Clock
 *
 * Shows:
 * - Live clock with real-time countdown to next choghadiya
 * - Visual timeline/clock showing all 8 choghadiyas as a horizontal bar
 * - Day/Night toggle with smooth transitions
 * - Hero section with animated countdown, pulsing indicator, gradient backgrounds
 * - Color-coded segments (green=auspicious, red=inauspicious, blue=neutral)
 * - Legend explaining each choghadiya type
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
  Collapse,
  Fade,
  Zoom,
  useTheme as useMuiTheme,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { ScreenContainer } from '../components/ScreenContainer';
import {
  Sunrise,
  Moon,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Timer,
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useI18n } from '../hooks/useI18n';
import { useBreakpoints } from '../hooks/useBreakpoints';
import {
  calculateChoghadiyas,
  getCurrentChoghadiya,
  getMuhurtaDescription,
  getMuhurtaNameHindi,
  getMuhurtaNameSanskrit,
  formatMuhurtaTime,
  type MuhurtaType,
  type Muhurta,
} from '../engine/muhurta';
import { calculateSunrise, calculateSunset } from '../engine/sunrise';

type DayNightMode = 'day' | 'night' | 'both';

const MuhurtaScreen: React.FC = () => {
  const { t, currentLanguage } = useI18n();
  const muiTheme = useMuiTheme();
  const { isMobile } = useBreakpoints();
  const isDark = muiTheme.palette.mode === 'dark';

  const MUHURTA_BORDER: Record<MuhurtaType, string> = {
    Amrit: muiTheme.palette.success.main,
    Shubh: muiTheme.palette.success.dark,
    Labh: muiTheme.palette.success.light,
    Char: muiTheme.palette.info.main,
    Rog: muiTheme.palette.error.main,
    Kaal: muiTheme.palette.error.dark,
    Udveg: muiTheme.palette.warning.main,
  };

  const MUHURTA_GRADIENTS: Record<MuhurtaType, { light: string; dark: string }> = {
    Amrit: { light: `${muiTheme.palette.success.main}14`, dark: `${muiTheme.palette.success.main}24` },
    Shubh: { light: `${muiTheme.palette.success.dark}14`, dark: `${muiTheme.palette.success.dark}24` },
    Labh: { light: `${muiTheme.palette.success.light}1A`, dark: `${muiTheme.palette.success.light}24` },
    Char: { light: `${muiTheme.palette.info.main}14`, dark: `${muiTheme.palette.info.main}24` },
    Rog: { light: `${muiTheme.palette.error.main}14`, dark: `${muiTheme.palette.error.main}24` },
    Kaal: { light: `${muiTheme.palette.error.dark}14`, dark: `${muiTheme.palette.error.dark}29` },
    Udveg: { light: `${muiTheme.palette.warning.main}14`, dark: `${muiTheme.palette.warning.main}24` },
  };

  const MUHURTA_BG: Record<MuhurtaType, string> = {
    Amrit: `${muiTheme.palette.success.main}1F`,
    Shubh: `${muiTheme.palette.success.dark}1F`,
    Labh: `${muiTheme.palette.success.light}1F`,
    Char: `${muiTheme.palette.info.main}1A`,
    Rog: `${muiTheme.palette.error.main}1A`,
    Kaal: `${muiTheme.palette.error.dark}24`,
    Udveg: `${muiTheme.palette.warning.main}1A`,
  };

  const { selectedDate, preferences, calculatePanchang } = useAppStore();

  // Update every 1 second for live countdown
  const [now, setNow] = useState(new Date());
  const [expandedDesc, setExpandedDesc] = useState<Set<MuhurtaType>>(new Set());
  const [dayNightMode, setDayNightMode] = useState<DayNightMode>('day');
  const [prevMuhurtaName, setPrevMuhurtaName] = useState<MuhurtaType | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refresh every 1 second for live clock and countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(interval);
  }, []);

  // Calculate sunrise/sunset and choghadiyas
  const { dayChoghadiyas, nightChoghadiyas, sunrise, sunset } = useMemo(() => {
    const location = preferences.location;
    const lat = location.latitude ?? 12.9716;
    const lng = location.longitude ?? 77.5946;

    const sr = calculateSunrise(selectedDate, {
      latitude: lat,
      longitude: lng,
      timezone: location.timezone ?? 'Asia/Kolkata',
      name: location.name ?? '',
    });
    const ss = calculateSunset(selectedDate, {
      latitude: lat,
      longitude: lng,
      timezone: location.timezone ?? 'Asia/Kolkata',
      name: location.name ?? '',
    });
    const choghadiyas = calculateChoghadiyas(selectedDate, sr, ss);

    return {
      dayChoghadiyas: choghadiyas.day,
      nightChoghadiyas: choghadiyas.night,
      sunrise: sr,
      sunset: ss,
    };
  }, [selectedDate, preferences.location, calculatePanchang]);

  // Determine current active choghadiya
  const currentMuhurta = useMemo(() => {
    const hour = now.getHours();
    const isDaytime = hour >= sunrise.getHours() && hour < sunset.getHours();
    const activeList = isDaytime ? dayChoghadiyas : nightChoghadiyas;
    let active = getCurrentChoghadiya(now, activeList);
    let foundIsDaytime = isDaytime;

    // Fallback: if not found in primary list, try the other list
    // This handles edge cases like early morning hours before sunrise
    // where night choghadiyas from the previous evening may still be active
    if (!active) {
      const fallbackList = isDaytime ? nightChoghadiyas : dayChoghadiyas;
      active = getCurrentChoghadiya(now, fallbackList);
      foundIsDaytime = !isDaytime;
    }

    // Second fallback: if still not found, find the closest upcoming muhurta
    if (!active) {
      const allMuhurtas = [...dayChoghadiyas, ...nightChoghadiyas];
      const nowTime = now.getTime();
      let closest: Muhurta | null = null;
      let closestDiff = Infinity;
      for (const m of allMuhurtas) {
        const diff = m.startTime.getTime() - nowTime;
        if (diff > 0 && diff < closestDiff) {
          closest = m;
          closestDiff = diff;
        }
      }
      if (closest) {
        active = closest;
        foundIsDaytime = dayChoghadiyas.some(m => m.name === closest!.name && m.startTime.getTime() === closest!.startTime.getTime());
      }
    }

    return { muhurta: active, isDaytime: foundIsDaytime };
  }, [now, dayChoghadiyas, nightChoghadiyas, sunrise, sunset]);

  // Detect muhurta change for transition animation
  useEffect(() => {
    const currentName = currentMuhurta.muhurta?.name ?? null;
    if (currentName && currentName !== prevMuhurtaName && prevMuhurtaName !== null) {
      setIsTransitioning(true);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setPrevMuhurtaName(currentName);
      }, 1500);
    } else if (currentName && prevMuhurtaName === null) {
      setPrevMuhurtaName(currentName);
    }
  }, [currentMuhurta.muhurta?.name, prevMuhurtaName]);

  // Cleanup transition timeout
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  // Countdown HH:MM:SS to end of current muhurta (or to start if not yet active)
  const countdown = useMemo(() => {
    if (!currentMuhurta.muhurta) return '00:00:00';
    const nowTime = now.getTime();
    const endTime = currentMuhurta.muhurta.endTime.getTime();
    const startTime = currentMuhurta.muhurta.startTime.getTime();

    // If muhurta hasn't started yet, show countdown to start
    if (nowTime < startTime) {
      const diff = startTime - nowTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    const diff = endTime - nowTime;
    if (diff <= 0) return '00:00:00';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [now, currentMuhurta.muhurta]);

  // Human-readable time remaining
  const timeRemainingShort = useMemo(() => {
    if (!currentMuhurta.muhurta) return '';
    const nowTime = now.getTime();
    const endTime = currentMuhurta.muhurta.endTime.getTime();
    const startTime = currentMuhurta.muhurta.startTime.getTime();

    // If muhurta hasn't started yet
    if (nowTime < startTime) {
      const diff = startTime - nowTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return hours > 0 ? `starts in ${hours}h ${mins}m` : `starts in ${mins}m`;
    }

    const diff = endTime - nowTime;
    if (diff <= 0) return '0m';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, [now, currentMuhurta.muhurta]);

  // Whether the current muhurta is actually active right now (not upcoming)
  const isMuhurtaActive = useMemo(() => {
    if (!currentMuhurta.muhurta) return false;
    const nowTime = now.getTime();
    return nowTime >= currentMuhurta.muhurta.startTime.getTime() && nowTime < currentMuhurta.muhurta.endTime.getTime();
  }, [now, currentMuhurta.muhurta]);

  // Progress within current muhurta
  const progressPercent = useMemo(() => {
    if (!currentMuhurta.muhurta) return 0;
    const total =
      currentMuhurta.muhurta.endTime.getTime() -
      currentMuhurta.muhurta.startTime.getTime();
    const elapsed = now.getTime() - currentMuhurta.muhurta.startTime.getTime();
    // Handle case where muhurta hasn't started yet (fallback upcoming muhurta)
    if (elapsed < 0) return 0;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  }, [now, currentMuhurta.muhurta]);

  // Current time formatted
  const currentTimeFormatted = useMemo(() => {
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }, [now]);

  // Get the muhurtas to display based on day/night mode
  const visibleMuhurtas = useMemo(() => {
    if (dayNightMode === 'day') return dayChoghadiyas;
    if (dayNightMode === 'night') return nightChoghadiyas;
    return dayChoghadiyas; // for 'both', day is primary for timeline
  }, [dayNightMode, dayChoghadiyas, nightChoghadiyas]);

  // Check if a given muhurta is the current active one
  const isCurrentMuhurta = useCallback(
    (m: Muhurta, list: Muhurta[]) => {
      if (!currentMuhurta.muhurta) return false;
      return (
        currentMuhurta.muhurta.name === m.name &&
        currentMuhurta.muhurta.startTime.getTime() === m.startTime.getTime()
      );
    },
    [currentMuhurta.muhurta]
  );

  const toggleDesc = useCallback((type: MuhurtaType) => {
    setExpandedDesc((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getLocalizedName = (type: MuhurtaType): string => {
    if (currentLanguage === 'hi') return getMuhurtaNameHindi(type);
    if (currentLanguage === 'sa') return getMuhurtaNameSanskrit(type);
    return type;
  };

  const handleDayNightChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: DayNightMode
  ) => {
    if (newMode !== null) setDayNightMode(newMode);
  };

  // Timeline segment component — icon-led band rows (Today Timings language):
  // 36px tinted tile + uppercase label + right-aligned time, 48px min-height,
  // auspicious/inauspicious coding via the existing MUHURTA_BORDER scheme.
  const renderTimelineSegment = (muhurta: Muhurta, index: number, total: number) => {
    const isCurrent = isCurrentMuhurta(muhurta, visibleMuhurtas);
    const color = MUHURTA_BORDER[muhurta.name];
    void index;
    void total;

    return (
      <Box
        key={`${muhurta.name}-${index}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          py: 0.75,
          px: 1,
          minHeight: 48,
          maxWidth: '100%',
          borderRadius: 1.5,
          bgcolor: isDark ? MUHURTA_BG[muhurta.name] : `${color}14`,
          border: '1px solid',
          borderColor: isCurrent ? color : `${color}40`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          ...(isCurrent && {
            boxShadow: isDark
              ? '0 2px 8px rgba(0,0,0,0.2)'
              : '0 1px 3px rgba(0,0,0,0.04)',
          }),
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        }}
      >
        {/* Progress fill for current segment */}
        {isCurrent && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: `${progressPercent}%`,
              height: '100%',
              bgcolor: `${color}30`,
              transition: 'width 1s linear',
            }}
          />
        )}
        {/* Active indicator */}
        {isCurrent && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              bgcolor: color,
              animation: 'timelinePulse 2s ease-in-out infinite',
            }}
          />
        )}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            bgcolor: `${color}1A`,
            border: '1px solid',
            borderColor: `${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: color,
              ...(isCurrent && {
                animation: 'pulseDot 1.5s ease-in-out infinite',
              }),
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.7rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: isCurrent ? color : 'text.secondary',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {getLocalizedName(muhurta.name)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'text.primary',
            ml: 'auto',
            textAlign: 'right',
            whiteSpace: 'nowrap',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {formatMuhurtaTime(muhurta.startTime)}
        </Typography>
      </Box>
    );
  };

  // Full timeline showing all muhurtas — stacked scannable bands
  const renderTimeline = (muhurtas: Muhurta[], label: string, icon: React.ReactNode) => (
    <Box sx={{ mb: 1.5, maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        {icon}
        <Typography
          variant="overline"
          sx={{
            fontWeight: 500,
            letterSpacing: '0.1em',
            fontSize: '0.75rem',
            color: 'text.secondary',
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          borderRadius: 2,
          overflow: 'hidden',
          maxWidth: '100%',
        }}
      >
        {muhurtas.map((m, i) => renderTimelineSegment(m, i, muhurtas.length))}
      </Box>
    </Box>
  );

  const renderMuhurtaCard = (muhurta: Muhurta, isCurrent: boolean) => {
    const { name, startTime, endTime, duration, isAuspicious } = muhurta;
    const isExpanded = expandedDesc.has(name);
    const bg = isDark ? MUHURTA_GRADIENTS[name].dark : MUHURTA_GRADIENTS[name].light;
    const border = MUHURTA_BORDER[name];
    const textColor = border;

    return (
      <Paper
        key={`${name}-${startTime.getTime()}`}
        elevation={0}
        sx={{
          p: { xs: 1.25, sm: 1.5 },
          mb: 0.75,
          background: isCurrent
            ? `${border}15`
            : bg,
          border: '1px solid',
          borderColor: isCurrent ? border : `${border}40`,
          borderRadius: 2,
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '100%',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: isDark
              ? '0 4px 12px rgba(0,0,0,0.3)'
              : '0 4px 12px rgba(0,0,0,0.08)',
          },
        }}
      >
        {isCurrent && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 3,
              bgcolor: border,
            }}
          />
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}>
            {/* Icon-led tile (Today Timings language) with live pulse for current */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: `${border}1A`,
                border: '1px solid',
                borderColor: `${border}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: isCurrent ? 10 : 8,
                  height: isCurrent ? 10 : 8,
                  borderRadius: '50%',
                  bgcolor: isAuspicious ? muiTheme.palette.success.main : muiTheme.palette.error.main,
                  flexShrink: 0,
                  ...(isCurrent && {
                    animation: 'pulseDot 1.5s ease-in-out infinite',
                  }),
                }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant={isCurrent ? 'subtitle1' : 'body2'}
                sx={{
            fontWeight: 500,
                  color: isCurrent ? textColor : 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getLocalizedName(name)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', whiteSpace: 'nowrap' }}>
                {formatMuhurtaTime(startTime)} - {formatMuhurtaTime(endTime)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, flexWrap: 'wrap' }}>
            {isCurrent && (
              <Chip
                icon={<Timer size={12} />}
                label={isMuhurtaActive ? `${timeRemainingShort} left` : timeRemainingShort}
                size="small"
                sx={{
                  height: 26,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  bgcolor: border,
                  color: muiTheme.palette.common.white,
                }}
              />
            )}
            <Chip
              label={formatDuration(duration)}
              size="small"
              variant="outlined"
              sx={{ height: 26, fontSize: '0.7rem' }}
            />
            <IconButton
              size="small"
              onClick={() => toggleDesc(name)}
              sx={{ p: 0.75, minWidth: 48, minHeight: 48 }}
            >
              {isExpanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </IconButton>
          </Box>
        </Box>

        {isCurrent && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                Progress
              </Typography>
              <Typography variant="caption" sx={{ color: border, fontWeight: 500, fontSize: '0.65rem' }}>
                {Math.round(progressPercent)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 6,
                borderRadius: 2,
                bgcolor: muiTheme.palette.action.hover,
                '& .MuiLinearProgress-bar': {
                  bgcolor: border,
                  borderRadius: 2,
                  transition: 'width 1s linear',
                  backgroundImage: 'none',
                },
              }}
            />
          </Box>
        )}

        <Collapse in={isExpanded}>
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {getMuhurtaDescription(name)}
            </Typography>
          </Box>
        </Collapse>
      </Paper>
    );
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    muhurtas: Muhurta[],
    accentColor: string,
  ) => (
    <Box sx={{ mb: 1.5, maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: isDark ? `${accentColor}20` : `${accentColor}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
            fontSize: '1.1rem',
            fontFamily: '"Noto Sans", sans-serif',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', ml: 'auto', fontSize: '0.7rem' }}
        >
          {muhurtas.length}
        </Typography>
      </Box>
      {muhurtas.map((m) => {
        const isCurrent = isCurrentMuhurta(m, muhurtas);
        return renderMuhurtaCard(m, isCurrent);
      })}
    </Box>
  );

  // Legend
  const legendItems: { type: MuhurtaType; meaning: string }[] = [
    { type: 'Amrit', meaning: 'Most Auspicious' },
    { type: 'Shubh', meaning: 'Auspicious' },
    { type: 'Labh', meaning: 'Profit / Gain' },
    { type: 'Char', meaning: 'Good for Travel' },
    { type: 'Udveg', meaning: 'Anxiety - Avoid' },
    { type: 'Rog', meaning: 'Disease - Avoid' },
    { type: 'Kaal', meaning: 'Inauspicious - Avoid' },
  ];

  const activeMuhurtas = dayNightMode === 'night' ? nightChoghadiyas : dayChoghadiyas;

  return (
    <ScreenContainer
      maxWidth={800}
      sx={{ pt: 1.5 }}
    >
      {/* Live Clock Header */}
      <Fade in timeout={400}>
        <Box
          sx={{
            textAlign: 'center',
            mb: 1.25,
            p: { xs: 1.25, sm: 1.5 },
            borderRadius: 2,
            bgcolor: isDark
              ? `${muiTheme.palette.primary.main}14`
              : `${muiTheme.palette.primary.main}0A`,
            border: '1px solid',
            borderColor: isDark ? `${muiTheme.palette.primary.main}4D` : `${muiTheme.palette.primary.main}26`,
            maxWidth: '100%',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
            }}
          >
            <Clock size={14} />
            {t('muhurta.current')}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 500,
              fontFamily: '"Noto Sans", sans-serif',
              color: 'primary.main',
              lineHeight: 1.2,
              my: 0.5,
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            {currentTimeFormatted}
          </Typography>
        </Box>
      </Fade>

      {/* Current Muhurta Hero with Countdown — saffron-gradient wash (Today hero language) */}
      {currentMuhurta.muhurta && (
        <Zoom in={!isTransitioning} timeout={500}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              mb: 1.5,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${MUHURTA_BORDER[currentMuhurta.muhurta.name]}1F 0%, ${MUHURTA_BORDER[currentMuhurta.muhurta.name]}14 45%, ${muiTheme.palette.background.paper} 100%)`,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: `${MUHURTA_BORDER[currentMuhurta.muhurta.name]}40`,
              position: 'relative',
              overflow: 'hidden',
              maxWidth: '100%',
              boxShadow: isDark
                ? '0 2px 8px rgba(0,0,0,0.2)'
                : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.25s ease',
              ...(isTransitioning && {
                animation: 'heroTransition 1.5s ease-in-out',
              }),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1.25, sm: 1.5 }, position: 'relative', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              {/* Animated icon ring */}
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  flexShrink: 0,
                }}
              >
                {/* Outer pulsing ring */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    border: `2px solid ${MUHURTA_BORDER[currentMuhurta.muhurta.name]}40`,
                    animation: 'pulseRing 2s ease-in-out infinite',
                  }}
                />
                {/* Main circle */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    bgcolor: MUHURTA_BORDER[currentMuhurta.muhurta.name],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulseDot 2s ease-in-out infinite',
                  }}
                >
                  <Sparkles size={28} color={muiTheme.palette.common.white} />
                </Box>
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Live-ness: pulsing LIVE dot + day/night context */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: MUHURTA_BORDER[currentMuhurta.muhurta.name],
                        animation: 'pulseDot 1.5s ease-in-out infinite',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        color: MUHURTA_BORDER[currentMuhurta.muhurta.name],
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '0.7rem',
                      }}
                    >
                      Live
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 400,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontSize: '0.7rem',
                    }}
                  >
                    {currentMuhurta.isDaytime ? t('muhurta.day') : t('muhurta.night')} {t('muhurta.current').toLowerCase()}
                  </Typography>
                </Box>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 500,
                    fontFamily: '"Noto Sans", sans-serif',
                    color: MUHURTA_BORDER[currentMuhurta.muhurta.name],
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    my: 0.5,
                    fontSize: { xs: '1.75rem', sm: '2.25rem' },
                    overflowWrap: 'break-word',
                  }}
                >
                  {getLocalizedName(currentMuhurta.muhurta.name)}
                  {currentLanguage !== 'en' && (
                    <Typography
                      component="span"
                      variant="h6"
                      sx={{ ml: 1, fontWeight: 400, color: 'text.secondary' }}
                    >
                      ({currentMuhurta.muhurta.name})
                    </Typography>
                  )}
                </Typography>

                {/* Badges */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip
                    label={
                      currentMuhurta.muhurta.isAuspicious
                        ? t('muhurta.auspiciousTitle')
                        : t('muhurta.inauspiciousTitle')
                    }
                    size="small"
                    sx={{
                      height: 26,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      bgcolor: currentMuhurta.muhurta.isAuspicious
                        ? `${muiTheme.palette.success.main}20`
                        : `${muiTheme.palette.error.main}20`,
                      color: currentMuhurta.muhurta.isAuspicious ? muiTheme.palette.success.main : muiTheme.palette.error.main,
                      border: `1px solid ${currentMuhurta.muhurta.isAuspicious ? muiTheme.palette.success.main : muiTheme.palette.error.main}`,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {formatMuhurtaTime(currentMuhurta.muhurta.startTime)} -{' '}
                    {formatMuhurtaTime(currentMuhurta.muhurta.endTime)}
                  </Typography>
                </Box>

                {/* Big Countdown Timer */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    p: 0.75,
                    borderRadius: 1.5,
                    bgcolor: muiTheme.palette.action.hover,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    maxWidth: '100%',
                  }}
                >
                  <Timer size={16} color={MUHURTA_BORDER[currentMuhurta.muhurta.name]} />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 500,
                      fontFamily: '"Noto Sans", sans-serif',
                      color: MUHURTA_BORDER[currentMuhurta.muhurta.name],
                      letterSpacing: '0.05em',
                      fontSize: { xs: '1.2rem', sm: '1.8rem' },
                    }}
                  >
                    {countdown}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                    {isMuhurtaActive ? 'remaining' : 'starting'}
                  </Typography>
                </Box>

                {/* Progress bar */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Progress
                    </Typography>
                    <Typography variant="caption" sx={{ color: MUHURTA_BORDER[currentMuhurta.muhurta.name], fontWeight: 500 }}>
                      {Math.round(progressPercent)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      height: 6,
                      borderRadius: 4,
                      bgcolor: muiTheme.palette.action.hover,
                      '& .MuiLinearProgress-bar': {
                        bgcolor: MUHURTA_BORDER[currentMuhurta.muhurta.name],
                        borderRadius: 4,
                        transition: 'width 1s linear',
                        backgroundImage: 'none',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Zoom>
      )}

      {/* Solar timing info — icon-led rows (Today Timings language) */}
      <Fade in timeout={600}>
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 1.5 },
            mb: 1.5,
            flexWrap: 'wrap',
            maxWidth: '100%',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              flex: '1 1 140px',
              minWidth: 140,
              p: 1.25,
              borderRadius: 2,
              bgcolor: muiTheme.palette.action.hover,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: isDark
                  ? `${muiTheme.palette.warning.main}25`
                  : `${muiTheme.palette.warning.main}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sunrise size={18} color={muiTheme.palette.warning.main} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                {t('panchang.sunrise')}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                {formatMuhurtaTime(sunrise)}
              </Typography>
            </Box>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              flex: '1 1 140px',
              minWidth: 140,
              p: 1.25,
              borderRadius: 2,
              bgcolor: muiTheme.palette.action.hover,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: isDark
                  ? `${muiTheme.palette.info.main}20`
                  : `${muiTheme.palette.info.main}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Moon size={18} color={muiTheme.palette.info.main} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block' }}>
                {t('panchang.sunset')}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                {formatMuhurtaTime(sunset)}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Fade>

      {/* Day/Night Toggle — refined pill, 48px targets */}
      <Fade in timeout={500}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5, px: 1, maxWidth: '100%' }}>
          <ToggleButtonGroup
            value={dayNightMode}
            exclusive
            onChange={handleDayNightChange}
            size="small"
            fullWidth={isMobile}
            sx={{
              bgcolor: muiTheme.palette.action.hover,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              p: 0.5,
              maxWidth: '100%',
              '& .MuiToggleButton-root': {
                px: { xs: 1.5, sm: 3 },
                py: 1,
                border: 'none',
                borderRadius: 1.5,
                color: 'text.secondary',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 500,
                minHeight: 48,
                minWidth: 48,
                textTransform: 'none',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: muiTheme.palette.common.white,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="day">
              <Sunrise size={16} style={{ marginRight: 6 }} />
              {t('muhurta.day')}
            </ToggleButton>
            <ToggleButton value="night">
              <Moon size={16} style={{ marginRight: 6 }} />
              {t('muhurta.night')}
            </ToggleButton>
            <ToggleButton value="both">
              {t('muhurta.both') || 'Both'}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Fade>

      {/* Visual Timeline - Day */}
      {(dayNightMode === 'day' || dayNightMode === 'both') && (
        <Fade in timeout={600}>
          <Box>
            {renderTimeline(
              dayChoghadiyas,
              `${t('muhurta.day')} Choghadiya Timeline`,
              <Sunrise size={16} color={muiTheme.palette.warning.main} />
            )}
          </Box>
        </Fade>
      )}

      {/* Visual Timeline - Night */}
      {(dayNightMode === 'night' || dayNightMode === 'both') && (
        <Fade in timeout={700}>
          <Box>
            {renderTimeline(
              nightChoghadiyas,
              `${t('muhurta.night')} Choghadiya Timeline`,
              <Moon size={16} color={muiTheme.palette.info.main} />
            )}
          </Box>
        </Fade>
      )}

      {/* Detailed Cards - based on mode */}
      {dayNightMode === 'both' ? (
        <>
          <Fade in timeout={700}>
            <Box>{renderSection(t('muhurta.day'), <Sunrise size={20} />, dayChoghadiyas, muiTheme.palette.warning.main)}</Box>
          </Fade>
          <Fade in timeout={800}>
            <Box>{renderSection(t('muhurta.night'), <Moon size={20} />, nightChoghadiyas, muiTheme.palette.info.main)}</Box>
          </Fade>
        </>
      ) : (
        <Fade in timeout={700}>
          <Box>
            {renderSection(
              dayNightMode === 'day' ? t('muhurta.day') : t('muhurta.night'),
              dayNightMode === 'day' ? <Sunrise size={20} /> : <Moon size={20} />,
              activeMuhurtas,
              dayNightMode === 'day' ? muiTheme.palette.warning.main : muiTheme.palette.info.main,
            )}
          </Box>
        </Fade>
      )}

      {/* Legend */}
      <Fade in timeout={900}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            mt: 1.5,
            mb: 1.5,
            borderRadius: 2,
            bgcolor: muiTheme.palette.action.hover,
            border: '1px solid',
            borderColor: 'divider',
            maxWidth: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                bgcolor: isDark
                  ? `${muiTheme.palette.primary.main}20`
                  : `${muiTheme.palette.primary.main}10`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Info size={18} color={muiTheme.palette.primary.main} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                fontSize: '1.1rem',
                fontFamily: '"Noto Sans", sans-serif',
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
                color: 'text.primary',
              }}
            >
              {t('muhurta.legend')}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 0.75,
            }}
          >
            {legendItems.map(({ type, meaning }) => (
              <Box
                key={type}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  p: 0.75,
                  borderRadius: 1.5,
                  bgcolor: MUHURTA_BG[type],
                  border: '1px solid',
                  borderColor: `${MUHURTA_BORDER[type]}40`,
                  minHeight: 48,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: `${MUHURTA_BORDER[type]}1A`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: MUHURTA_BORDER[type],
                      flexShrink: 0,
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {getLocalizedName(type)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                    {meaning}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Fade>

      {/* Keyframe animations */}
      <style>{`

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.2; }
        }
        @keyframes timelinePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes heroTransition {
          0% { transform: scale(1); }
          25% { transform: scale(0.98); opacity: 0.7; }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </ScreenContainer>
  );
};

export default MuhurtaScreen;
