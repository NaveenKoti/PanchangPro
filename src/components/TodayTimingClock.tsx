/**
 * TodayTimingClock - live choghadiya hero for the Today screen.
 *
 * Main-page timing clock: current muhurta + countdown, ticking every
 * second. Detail stays on the full Muhurta screen ("Full timing" link).
 * Tone uses theme semantics only (success/info/error/warning alphas).
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  useTheme as useMuiTheme,
} from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';
import { useAppStore } from '../stores/appStore';
import { useI18n } from '../hooks/useI18n';
import { SectionCard } from './layout/SectionCard';
import {
  calculateChoghadiyas,
  getCurrentChoghadiya,
  getMuhurtaNameHindi,
  type MuhurtaType,
} from '../engine/muhurta';
import { calculateSunrise, calculateSunset } from '../engine/sunrise';
import { triggerHapticIfSupported } from '../utils/haptics';

const AUSPICIOUS: MuhurtaType[] = ['Amrit', 'Shubh', 'Labh'];
const INAUSPICIOUS: MuhurtaType[] = ['Rog', 'Kaal'];

function toneColor(name: MuhurtaType, theme: Theme): string {
  if (AUSPICIOUS.includes(name)) return theme.palette.success.main;
  if (INAUSPICIOUS.includes(name)) return theme.palette.error.main;
  if (name === 'Udveg') return theme.palette.warning.main;
  return theme.palette.info.main;
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export interface TodayTimingClockProps {
  onOpenTiming: () => void;
}

export const TodayTimingClock: React.FC<TodayTimingClockProps> = ({ onOpenTiming }) => {
  const muiTheme = useMuiTheme();
  const { t, currentLanguage } = useI18n();
  const { selectedDate, preferences } = useAppStore();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(id);
  }, []);

  const { active, isDaytime } = useMemo(() => {
    const loc = preferences.location;
    const args = {
      latitude: loc.latitude ?? 12.9716,
      longitude: loc.longitude ?? 77.5946,
      timezone: loc.timezone ?? 'Asia/Kolkata',
      name: loc.name ?? '',
    };
    const sr = calculateSunrise(selectedDate, args);
    const ss = calculateSunset(selectedDate, args);
    const { day, night } = calculateChoghadiyas(selectedDate, sr, ss);
    const daytime = now >= sr && now < ss;
    const list = daytime ? day : night;
    return {
      active: getCurrentChoghadiya(now, list) ?? getCurrentChoghadiya(now, daytime ? night : day),
      isDaytime: daytime,
    };
  }, [now, selectedDate, preferences.location]);

  if (!active) return null;

  const tone = toneColor(active.name, muiTheme);
  const total = active.endTime.getTime() - active.startTime.getTime();
  const elapsed = now.getTime() - active.startTime.getTime();
  const progress = total > 0 ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 0;
  const name =
    currentLanguage === 'hi' ? getMuhurtaNameHindi(active.name) : active.name;

  return (
    <SectionCard
      dense
      title={
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}
        >
          {t('today.timingNow') || 'Right now'}
          {isDaytime ? '' : ` · ${t('today.night') || 'night'}`}
        </Typography>
      }
    >
      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 500, color: tone, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          {name}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.primary', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }} aria-live="off">
          {formatCountdown(active.endTime.getTime() - now.getTime())}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mt: 1.25,
          height: 8,
          borderRadius: 999,
          bgcolor: alpha(tone, 0.15),
          '& .MuiLinearProgress-bar': { bgcolor: tone, borderRadius: 999 },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
        <Button
          size="small"
          onClick={() => {
            triggerHapticIfSupported('light');
            onOpenTiming();
          }}
          sx={{ textTransform: 'none', fontWeight: 500, minHeight: 48, color: 'primary.main' }}
        >
          {t('today.fullTiming') || 'Full timing'}
        </Button>
      </Box>
    </SectionCard>
  );
};

export default TodayTimingClock;
