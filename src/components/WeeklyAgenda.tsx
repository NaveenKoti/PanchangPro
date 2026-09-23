/**
 * WeeklyAgenda — 7 day rows for the CalendarScreen week view.
 *
 * Each row: weekday + date numeral + tithi name + sunrise–sunset +
 * festival/fast chips (tappable → onFestivalOpen when a detail id exists,
 * else onSelectDate). Today gets a primary tint + Today chip.
 * Tokens via useTheme() + alpha() only. Noto 400/500.
 */
import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  useTheme as useMuiTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Panchang } from '../types';
import { useAppStore } from '../stores/appStore';
import { triggerHapticIfSupported } from '../utils/haptics';

export interface WeeklyAgendaProps {
  weekStart: Date;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  calculatePanchang: (d: Date) => Panchang;
  onFestivalOpen?: (id: string) => void;
  isHindi: boolean;
}

export const WeeklyAgenda: React.FC<WeeklyAgendaProps> = ({
  weekStart,
  selectedDate,
  onSelectDate,
  calculatePanchang,
  onFestivalOpen,
  isHindi,
}) => {
  const muiTheme = useMuiTheme();
  const { preferences } = useAppStore();
  const locale = isHindi ? 'hi-IN' : 'en-IN';
  const timezone = preferences.location.timezone;

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    });

  const days = useMemo(() => {
    const out: { date: Date; panchang: Panchang }[] = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      out.push({ date: d, panchang: calculatePanchang(d) });
    }
    return out;
  }, [weekStart, calculatePanchang]);

  const todayStr = new Date().toDateString();
  const selectedStr = selectedDate.toDateString();

  return (
    <Box
      role="list"
      aria-label={isHindi ? 'साप्ताहिक एजेंडा' : 'Weekly agenda'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
        p: 1,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {days.map(({ date, panchang }) => {
        const isToday = date.toDateString() === todayStr;
        const isSelected = date.toDateString() === selectedStr;
        const tithiName = isHindi ? panchang.tithi.nameHindi : panchang.tithi.name;
        const weekday = date.toLocaleDateString(locale, { weekday: 'long' });
        const festivals = panchang.festivals ?? [];
        const fastingName = panchang.fasting
          ? (isHindi ? panchang.fasting.nameHindi : panchang.fasting.name)
          : '';
        const sunRange = `${formatTime(panchang.sunrise)} – ${formatTime(panchang.sunset)}`;

        return (
          <Paper
            key={date.toISOString()}
            role="listitem"
            elevation={0}
            onClick={() => {
              triggerHapticIfSupported('light');
              onSelectDate(date);
            }}
            tabIndex={0}
            aria-label={`${weekday} ${date.getDate()} ${tithiName}`}
            aria-pressed={isSelected}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectDate(date);
              }
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              p: 1,
              minHeight: 48,
              width: '100%',
              boxSizing: 'border-box',
              borderRadius: 1,
              cursor: 'pointer',
              bgcolor: isSelected
                ? alpha(muiTheme.palette.primary.main, 0.19)
                : isToday
                  ? alpha(muiTheme.palette.primary.main, 0.10)
                  : 'background.paper',
              border: isSelected || isToday
                ? `2px solid ${muiTheme.palette.primary.main}`
                : '1px solid',
              borderColor: isSelected || isToday
                ? muiTheme.palette.primary.main
                : 'divider',
              '&:hover': {
                bgcolor: isSelected
                  ? alpha(muiTheme.palette.primary.main, 0.25)
                  : isToday
                    ? alpha(muiTheme.palette.primary.main, 0.13)
                    : alpha(muiTheme.palette.primary.main, 0.04),
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                width: '100%',
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 48,
                  minHeight: 48,
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '1rem',
                    lineHeight: 1.2,
                    color: isToday ? 'primary.main' : 'text.primary',
                  }}
                >
                  {date.getDate()}
                </Typography>
                <Typography
                  sx={{ fontSize: '0.65rem', color: 'text.secondary', lineHeight: 1.2 }}
                >
                  {date.toLocaleDateString(locale, { month: 'short' })}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    lineHeight: 1.3,
                    overflowWrap: 'break-word',
                  }}
                >
                  {weekday}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'primary.main', display: 'block', overflowWrap: 'break-word' }}
                >
                  {tithiName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', display: 'block', overflowWrap: 'break-word' }}
                >
                  {sunRange}
                </Typography>
              </Box>
              {isToday && (
                <Chip
                  label={isHindi ? 'आज' : 'Today'}
                  size="small"
                  sx={{
                    minHeight: 32,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    flexShrink: 0,
                    bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                    color: muiTheme.palette.primary.main,
                    border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.19)}`,
                  }}
                />
              )}
            </Box>
            {(festivals.length > 0 || fastingName) && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  pl: { xs: 0, sm: 7.5 },
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {festivals.map((festival: Panchang['festivals'][number]) => {
                  const detailId = festival.id || festival.name;
                  return (
                    <Chip
                      key={detailId}
                      label={isHindi ? festival.nameHindi : festival.name}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHapticIfSupported('light');
                        if (detailId && onFestivalOpen) {
                          onFestivalOpen(detailId);
                        } else {
                          onSelectDate(date);
                        }
                      }}
                      sx={{
                        minHeight: 32,
                        maxWidth: '100%',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                        color: muiTheme.palette.primary.main,
                        border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.19)}`,
                        '&:hover': {
                          bgcolor: alpha(muiTheme.palette.primary.main, 0.15),
                        },
                      }}
                    />
                  );
                })}
                {fastingName && (
                  <Chip
                    label={fastingName}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHapticIfSupported('light');
                      onSelectDate(date);
                    }}
                    sx={{
                      minHeight: 32,
                      maxWidth: '100%',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      bgcolor: alpha(muiTheme.palette.success.main, 0.08),
                      color: 'success.main',
                      border: `1px solid ${alpha(muiTheme.palette.success.main, 0.19)}`,
                      '&:hover': {
                        bgcolor: alpha(muiTheme.palette.success.main, 0.15),
                      },
                    }}
                  />
                )}
              </Box>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

export default WeeklyAgenda;
