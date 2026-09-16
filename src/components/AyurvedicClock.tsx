/**
 * AyurvedicClock - Live Dinacharya Phase Widget (REVAMPED)
 *
 * Fixes:
 * 1. Shows "Nidra Kala" fallback when no phase matches (4AM–4:24AM gap)
 * 2. Next-phase lookup via array index, not broken Date comparison
 * 3. Updates every minute (not every second) — battery friendly
 *
 * Design:
 * - Dosha-color-coded header band + chip
 * - Thick rounded progress bar
 * - "Next phase" row with dot indicator
 * - Activity chips at bottom
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  useTheme,
} from '@mui/material';
import { Clock, Sun, Moon, Sunrise, Sunset, Wind, Flame, Leaf } from 'lucide-react';
import { Panchang, DinacharyaPhase } from '../types';

// Dosha visual config — colors now theme-aware
const getDoshaConfig = (theme: any) => ({
  vata: {
    color: theme.palette.info.main,
    bg: `${theme.palette.info.main}15`,
    name: 'Vata',
    element: 'Air & Ether',
    Icon: Wind,
  },
  pitta: {
    color: theme.palette.warning.main,
    bg: `${theme.palette.warning.main}15`,
    name: 'Pitta',
    element: 'Fire & Water',
    Icon: Flame,
  },
  kapha: {
    color: theme.palette.success.main,
    bg: `${theme.palette.success.main}15`,
    name: 'Kapha',
    element: 'Earth & Water',
    Icon: Leaf,
  },
});

interface AyurvedicClockProps {
  panchang: Panchang | null;
}

export const AyurvedicClock: React.FC<AyurvedicClockProps> = ({ panchang }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const doshaConfig = getDoshaConfig(theme);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPhase, setCurrentPhase] = useState<DinacharyaPhase | null>(null);
  const [nextPhase, setNextPhase] = useState<DinacharyaPhase | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Theme-aware background colors
  const getBoxBg = () => isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
  const getBorder = () => isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';

  // Update clock every minute — sufficient for this display
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!panchang?.dinacharya?.length) return;

    const now = currentTime.getTime();
    const phases = panchang.dinacharya;

    const phaseIndex = phases.findIndex(
      p => now >= p.startTime.getTime() && now < p.endTime.getTime()
    );

    if (phaseIndex !== -1) {
      const phase = phases[phaseIndex];
      setCurrentPhase(phase);

      // Fix: use index-based next lookup, not Date comparison
      setNextPhase(phaseIndex < phases.length - 1 ? phases[phaseIndex + 1] : null);

      const duration = phase.endTime.getTime() - phase.startTime.getTime();
      const elapsed = now - phase.startTime.getTime();
      setProgress(Math.min((elapsed / duration) * 100, 100));

      const remaining = phase.endTime.getTime() - now;
      const h = Math.floor(remaining / 3_600_000);
      const m = Math.floor((remaining % 3_600_000) / 60_000);
      setTimeRemaining(h > 0 ? `${h}h ${m}m` : `${m}m`);
    } else {
      // Nidra Kala — the gap between Ratri end and Brahma Muhurta start (~24 min)
      setCurrentPhase(null);
      const firstPhase = phases[0] ?? null;
      setNextPhase(firstPhase);
      if (firstPhase) {
        const remaining = firstPhase.startTime.getTime() - now;
        if (remaining > 0) {
          const m = Math.floor(remaining / 60_000);
          setTimeRemaining(`${m}m`);
        } else {
          setTimeRemaining('');
        }
      }
    }
  }, [currentTime, panchang]);

  const getTimeIcon = () => {
    const h = currentTime.getHours();
    if (h >= 4 && h < 6) return <Sunrise size={18} />;
    if (h >= 6 && h < 18) return <Sun size={18} />;
    if (h >= 18 && h < 20) return <Sunset size={18} />;
    return <Moon size={18} />;
  };

  const timeLabel = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!panchang) return null;

  // ── Nidra Kala fallback ──────────────────────────────────────────────────────
  if (!currentPhase) {
    const nidraColor = theme.palette.info.main;
    const nidraBg = `${nidraColor}15`;
    
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          mb: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: `1px solid ${getBorder()}`,
        }}
      >
        <Box sx={{ height: 4, bgcolor: `${nidraColor}80` }} />
        <CardContent sx={{ p: 2, pb: '16px !important' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  bgcolor: nidraBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock size={18} color={nidraColor} />
              </Box>
              <Typography
                variant="overline"
                sx={{ fontSize: '0.65rem', color: 'text.secondary', lineHeight: 1 }}
              >
                AYURVEDIC CLOCK
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: nidraColor }}>
              {getTimeIcon()}
              <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                {timeLabel}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 500, color: nidraColor }}>
            Nidra Kala
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            निद्रा काल · Deep rest period
          </Typography>
          <Chip
            icon={<Moon size={14} />}
            label="Vata · Ether & Air"
            size="small"
            sx={{
              bgcolor: nidraBg,
              color: nidraColor,
              border: `1px solid ${nidraColor}40`,
              fontWeight: 500,
              fontSize: '0.7rem',
              height: 26,
              mb: 1.5,
              '& .MuiChip-icon': { color: nidraColor },
            }}
          />
          {nextPhase && timeRemaining && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                borderRadius: 2,
                bgcolor: getBoxBg(),
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: doshaConfig[nextPhase.dosha].color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                Next: <strong>{nextPhase.name}</strong> in {timeRemaining}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  // ── Active phase ─────────────────────────────────────────────────────────────
  const dosha = doshaConfig[currentPhase.dosha];
  const DoshaIcon = dosha.Icon;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        mb: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: `1px solid ${getBorder()}`,
      }}
    >
      {/* Dosha accent band */}
      <Box
        sx={{
          height: 4,
          background: `linear-gradient(90deg, ${dosha.color}, ${dosha.color}66)`,
        }}
      />

      <CardContent sx={{ p: 2, pb: '16px !important' }}>
        {/* Header row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: dosha.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={18} color={dosha.color} />
            </Box>
            <Typography
              variant="overline"
              sx={{ fontSize: '0.65rem', color: 'text.secondary', lineHeight: 1 }}
            >
              AYURVEDIC CLOCK
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: dosha.color }}>
            {getTimeIcon()}
            <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {timeLabel}
            </Typography>
          </Box>
        </Box>

        {/* Phase name */}
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.2, mb: 0.25 }}>
            {currentPhase.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {currentPhase.nameHindi}
          </Typography>
        </Box>

        {/* Dosha chip */}
        <Chip
          icon={<DoshaIcon size={14} />}
          size="small"
          label={`${dosha.name} · ${dosha.element}`}
          sx={{
            bgcolor: dosha.bg,
            color: dosha.color,
            border: `1px solid ${dosha.color}44`,
            fontWeight: 500,
            fontSize: '0.7rem',
            height: 26,
            mb: 1.5,
            '& .MuiChip-icon': { color: dosha.color },
          }}
        />

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: dosha.bg,
            '& .MuiLinearProgress-bar': {
              bgcolor: dosha.color,
              borderRadius: 4,
            },
            mb: 0.75,
          }}
        />

        {/* Progress labels */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {Math.round(progress)}% complete
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 500, color: dosha.color }}>
            {timeRemaining} remaining
          </Typography>
        </Box>

        {/* Next phase indicator */}
        {nextPhase && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              borderRadius: 2,
              bgcolor: getBoxBg(),
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: doshaConfig[nextPhase.dosha].color,
                flexShrink: 0,
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              Next: <strong>{nextPhase.name}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {nextPhase.startTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
        )}

        {/* Recommended activities */}
        {currentPhase.activities.length > 0 && (
          <Box sx={{ borderTop: '1px dashed', borderColor: 'divider', pt: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mb: 0.75,
                fontWeight: 500,
                color: 'text.secondary',
                letterSpacing: '0.5px',
                fontSize: '0.65rem',
              }}
            >
              RECOMMENDED NOW
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {currentPhase.activities.slice(0, 3).map((activity, i) => (
                <Chip
                  key={i}
                  label={activity}
                  size="small"
                  sx={{
                    fontSize: '0.68rem',
                    height: 22,
                    bgcolor: getBoxBg(),
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AyurvedicClock;
