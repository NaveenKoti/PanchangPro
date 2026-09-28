/**
 * TodayScreen - main page: slim date bar + live timing clock + sun line +
 * inauspicious strip + quick links to detail screens + ONE AlertStack.
 * Details live on their own screens; Today links out via requestTab.
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  CardContent,
  IconButton,
  Alert,
  Divider,
  Fade,
  Zoom,
  Skeleton,
  Paper,
  Snackbar,
  Button,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Star,
  Sunrise,
  Sunset,
  Clock,
  Heart,
  Leaf,
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import {
  findMissedCustomTithiReminders,
  getCatchupWindow,
  getLastSeenAt,
  setLastSeenAt,
  getShownMissedReminderIds,
  markMissedReminderIdsShown,
  MAX_CATCHUP_LOOKBACK_DAYS,
  type MissedTithiReminder,
} from '../services/notificationService';
import { useI18n } from '../hooks/useI18n';
import { TodayTimingClock } from '../components/TodayTimingClock';
import { GlossaryDialog } from '../components/GlossaryDialog';
import type { GlossaryEntry } from '../data/panchangGlossary';
import { festivalText } from '../data/festivals';
import { LUNAR_MONTHS, LUNAR_MONTHS_HINDI } from '../engine/constants';
import { ScreenContainer } from '../components/ScreenContainer';
import { SearchUpcoming } from '../components/SearchUpcoming';
import { SectionCard } from '../components/layout/SectionCard';
import { AlertStack, type AlertItem } from '../components/layout/AlertStack';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { triggerHapticIfSupported } from '../utils/haptics';
import './TodayScreen.css';

/** Relative-day label for a missed fire-time (translated via common.* + today.daysAgo). */
function relativeDayLabel(
  fireTime: Date,
  now: Date,
  t: (key: string, options?: Record<string, unknown>) => string
): string {
  const startOfDay = (d: Date): number => {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c.getTime();
  };
  const diff = Math.round((startOfDay(now) - startOfDay(fireTime)) / 86400000);
  if (diff <= 0) return t('common.today');
  if (diff === 1) return t('common.yesterday');
  return t('today.daysAgo', { count: diff });
}

function formatDueDate(date: Date): string {
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export interface TodayScreenProps {
  /** Opens a festival detail overlay (provided by App; used by search results). */
  onFestivalOpen?: (id: string) => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({ onFestivalOpen }) => {
  const { t, currentLanguage } = useI18n();
  const muiTheme = useMuiTheme();
  const { isMobile } = useBreakpoints();

  const {
    selectedDate,
    setSelectedDate,
    preferences,
    calculatePanchang,
    addCustomTithi,
    requestTab,
  } = useAppStore();

  // "While you were away" catch-up: custom-tithi reminders due while the app
  // was closed are silently skipped by the in-page scheduler, so surface them
  // here with a "View My Tithis" CTA (store-requested tab → App subscribes).
  // NOTE (device-TZ vs location-TZ): this banner lists day-precision labels
  // only (Today/Yesterday + due MMM d), so no sacred-time instant renders
  // here — engine instants untouched; no timeZone threading needed in this
  // region. MyTithis occurrence dates render in location TZ (see
  // MyTithisScreen formatOccurrence); Today timings/formatTime call sites are
  // outside the owned digest region and intentionally left unchanged.
  const [missedReminders, setMissedReminders] = useState<MissedTithiReminder[]>([]);

  useEffect(() => {
    const now = new Date();
    const lastSeen = getLastSeenAt();
    if (!lastSeen) {
      // First-ever run: establish baseline, no backfill.
      setLastSeenAt(now);
      return;
    }
    const { start, end } = getCatchupWindow(now, lastSeen);
    if (start >= end) {
      setLastSeenAt(now);
      return;
    }

    const { customTithis, calculatePanchang: calc } = useAppStore.getState();
    const withReminders = customTithis.filter((t) => t.reminderEnabled && t.reminderTime);
    if (withReminders.length === 0) {
      setLastSeenAt(now);
      return;
    }

    // Resolve Gregorian occurrences per tithi with the same rules the store
    // uses (one-time: customDate; recurring: tithiNumber+paksha engine match
    // per day, as in getCalendarMonth). A fire-time in the window can come
    // from an occurrence up to 7 days in the future (early reminder), so scan
    // through end + 7 days.
    const occurrencesByTithiId: Record<string, Date[]> = {};
    const scanStart = new Date(start);
    scanStart.setHours(0, 0, 0, 0);
    const scanEnd = new Date(end);
    scanEnd.setDate(scanEnd.getDate() + MAX_CATCHUP_LOOKBACK_DAYS);
    scanEnd.setHours(0, 0, 0, 0);
    for (const tithi of withReminders) {
      if (!tithi.isRecurring) {
        if (tithi.customDate) {
          const custom = new Date(tithi.customDate);
          if (!isNaN(custom.getTime())) occurrencesByTithiId[tithi.id] = [custom];
        }
        continue;
      }
      const dates: Date[] = [];
      for (let d = new Date(scanStart); d <= scanEnd; d.setDate(d.getDate() + 1)) {
        const day = new Date(d);
        let tithiAtDay: { number: number; paksha: string } | null = null;
        try {
          tithiAtDay = calc(day)?.tithi ?? null;
        } catch {
          continue;
        }
        if (
          tithiAtDay &&
          tithiAtDay.number === tithi.tithiNumber &&
          tithiAtDay.paksha === tithi.paksha
        ) {
          dates.push(day);
        }
      }
      occurrencesByTithiId[tithi.id] = dates;
    }

    const missed = findMissedCustomTithiReminders(
      withReminders,
      occurrencesByTithiId,
      start,
      end,
      getShownMissedReminderIds()
    );
    if (missed.length > 0) {
      setMissedReminders(missed);
      markMissedReminderIdsShown(missed.map((m) => m.id));
    }
    setLastSeenAt(now);

    const onVisibilityChange = (): void => {
      if (document.visibilityState === 'hidden') setLastSeenAt(new Date());
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const [glossaryLimb, setGlossaryLimb] = useState<GlossaryEntry['id'] | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Memoize panchang calculation - computed only when date changes
  const panchang = useMemo(() => {
    return calculatePanchang(selectedDate);
  }, [calculatePanchang, selectedDate]);

  const handlePrevDay = () => {
    triggerHapticIfSupported('light');
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    triggerHapticIfSupported('light');
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    triggerHapticIfSupported('selection');
    setSelectedDate(new Date());
  };

  const handleQuickAddTithi = useCallback(() => {
    // No tithi cap (premium paused): quick-add always proceeds.
    if (!panchang) return;

    const success = addCustomTithi({
      name: `Tithi ${panchang.tithi.number} - ${panchang.tithi.name}`,
      nameHindi: panchang.tithi.nameHindi,
      tithiNumber: panchang.tithi.number,
      paksha: panchang.tithi.paksha,
      month: selectedDate.getMonth(),
      isRecurring: true,
      notes: `Added from Today screen on ${selectedDate.toLocaleDateString()}`,
      reminderEnabled: false,
    });

    if (success) {
      triggerHapticIfSupported('success');
      setSnackbar({
        open: true,
        message: '✨ Tithi added to My Tithis!',
        severity: 'success',
      });
    }
  }, [addCustomTithi, panchang, selectedDate]);

  const formatDate = useCallback((date: Date) => {
    const locale =
      preferences.language === 'hi'
        ? 'hi-IN'
        : preferences.language === 'sa'
        ? 'sa-IN'
        : preferences.language === 'kn'
        ? 'kn-IN'
        : preferences.language === 'te'
        ? 'te-IN'
        : preferences.language === 'ta'
        ? 'ta-IN'
        : 'en-IN';
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [preferences.language]);

  const formatTime = useCallback((date: Date) => {
    // Render sacred times in the LOCATION timezone — engine instants are
    // absolute, but device-local formatting corrupts them when traveling.
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: preferences.location.timezone,
    });
  }, [preferences.location.timezone]);

  // Loading state
  if (!panchang) {
    return (
      <ScreenContainer>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Skeleton
            variant="circular"
            width={60}
            height={60}
            sx={{ mx: 'auto', mb: 2 }}
            animation="wave"
          />
          <Skeleton variant="text" width={200} sx={{ mx: 'auto', mb: 1 }} animation="wave" />
          <Skeleton variant="text" width={150} sx={{ mx: 'auto' }} animation="wave" />
        </Box>
      </ScreenContainer>
    );
  }

  // ---- ONE AlertStack: all conditional alerts render as items here ----
  const alerts: AlertItem[] = [];
  if (missedReminders.length > 0) {
    alerts.push({
      key: 'missed-reminders',
      severity: 'warning',
      children: (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
            {t('today.whileAway')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {missedReminders.length === 1
              ? t('today.missedSingle')
              : t('today.missedPlural', { count: missedReminders.length })}
          </Typography>
          <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
            {missedReminders.map((m) => (
              <Typography key={m.id} component="li" variant="body2" sx={{ color: 'text.primary' }}>
                {relativeDayLabel(m.fireTime, new Date(), t)} — {m.tithiName}
                {m.daysBefore > 0 ? ` (${t('today.dueDate', { date: formatDueDate(m.occurrenceDate) })})` : ''}
              </Typography>
            ))}
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => requestTab('myTithis')}
            sx={{ mt: 1, borderRadius: 1, textTransform: 'none', fontWeight: 500, minHeight: 48 }}
          >
            {t('today.viewMyTithis')}
          </Button>
        </Box>
      ),
    });
  }
  if (panchang.isAuspiciousTime) {
    alerts.push({
      key: 'auspicious',
      severity: 'success',
      children: (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {t('panchang.auspiciousTime')}
        </Typography>
      ),
    });
  }
  if (panchang.festivals.length > 0) {
    alerts.push({
      key: 'festival',
      severity: 'success',
      children: (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
            {festivalText(panchang.festivals[0], currentLanguage, 'name')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {panchang.festivals[0].significance}
          </Typography>
        </Box>
      ),
    });
  }
  if (panchang.sankranti) {
    alerts.push({
      key: 'sankranti',
      severity: 'info',
      children: (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
            {t('today.sankrantiTitle', {
              name:
                preferences.language === 'hi'
                  ? panchang.sankranti.nameHindi
                  : panchang.sankranti.name,
            })}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('today.solarIngress')}
            {' · '}
            {formatTime(panchang.sankranti.ingressTime)}
          </Typography>
        </Box>
      ),
    });
  }
  if (panchang.fasting) {
    alerts.push({
      key: 'fasting',
      severity: 'info',
      children: (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
            {preferences.language === 'hi'
              ? panchang.fasting.nameHindi
              : panchang.fasting.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {panchang.fasting.significance}
            {panchang.fasting.paranaTime
              ? ` · Parana ${formatTime(panchang.fasting.paranaTime.start)} - ${formatTime(panchang.fasting.paranaTime.end)}`
              : ''}
          </Typography>
        </Box>
      ),
    });
  }

  return (
    <ScreenContainer>
      {/* ========== 1. SLIM STICKY DATE BAR (offset via theme token) ========== */}
      <Zoom in timeout={250}>
        <Paper
          elevation={0}
          sx={{
            mb: 1.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: muiTheme.mixins.toolbar.minHeight,
            zIndex: 500,
            bgcolor: 'background.paper',
          }}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <IconButton
                onClick={handlePrevDay}
                size="small"
                aria-label="previous day"
                sx={{ width: 48, height: 48, flexShrink: 0, color: 'primary.main' }}
              >
                <ChevronLeft size={20} />
              </IconButton>

              <Box sx={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
                  <CalendarIcon size={20} color={muiTheme.palette.primary.main} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      lineHeight: 1.3,
                      color: 'text.primary',
                      fontSize: isMobile ? '0.85rem' : '1.05rem',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                    }}
                  >
                    {formatDate(selectedDate)}
                  </Typography>
                </Box>
                {/* Location + lunar month, tappable → glossary */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.25 }}>
                  <MapPin size={16} color={muiTheme.palette.text.secondary} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                    {preferences.location.name}
                  </Typography>
                  {panchang.lunarMonth !== undefined && (
                    <Typography
                      variant="caption"
                      onClick={() => {
                        triggerHapticIfSupported('light');
                        setGlossaryLimb(panchang.adhikMaas?.isAdhik ? 'adhik' : 'maas');
                      }}
                      sx={{
                        color: panchang.adhikMaas?.isAdhik ? 'primary.main' : 'text.secondary',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {' · '}
                      {preferences.language === 'hi'
                        ? panchang.adhikMaas?.isAdhik
                          ? t('today.adhikMaas', { month: panchang.adhikMaas.nameHindi })
                          : t('today.lunarMonth', { month: LUNAR_MONTHS_HINDI[panchang.lunarMonth - 1] })
                        : panchang.adhikMaas?.isAdhik
                          ? t('today.adhikMaas', { month: panchang.adhikMaas.name })
                          : t('today.lunarMonth', { month: LUNAR_MONTHS[panchang.lunarMonth - 1] })}
                    </Typography>
                  )}
                </Box>
                {new Date().toDateString() !== selectedDate.toDateString() && (
                  <Button
                    size="small"
                    onClick={handleToday}
                    sx={{
                      mt: 0.25,
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      color: 'primary.main',
                      textTransform: 'none',
                      minHeight: 48,
                      p: '2px 8px',
                    }}
                  >
                    {t('calendar.goToToday')}
                  </Button>
                )}
              </Box>

              <IconButton
                onClick={handleNextDay}
                size="small"
                aria-label="next day"
                sx={{ width: 48, height: 48, flexShrink: 0, color: 'primary.main' }}
              >
                <ChevronRight size={20} />
              </IconButton>
            </Box>
          </CardContent>
        </Paper>
      </Zoom>

      {/* ========== 2. LIVE TIMING CLOCK (hero) ========== */}
      <Box sx={{ mb: 1.5, minWidth: 0 }}>
        <TodayTimingClock onOpenTiming={() => requestTab('muhurta')} />
      </Box>

      {/* ========== 3. QUICK LINKS (details live on their screens) ========== */}
      <SectionCard dense>
        {(
          [
            { key: 'calendar', icon: CalendarIcon, label: t('today.dayDetails') || 'Day details', tab: 'calendar' },
            { key: 'fasts', icon: Leaf, label: t('navigation.fasts'), tab: 'fasts' },
            { key: 'muhurta', icon: Clock, label: t('navigation.muhurta'), tab: 'muhurta' },
            { key: 'myTithis', icon: Star, label: t('myTithis.title'), tab: 'myTithis' },
          ] as const
        ).map((link, i, arr) => (
          <Box
            key={link.key}
            role="link"
            tabIndex={0}
            aria-label={link.label}
            onClick={() => {
              triggerHapticIfSupported('light');
              requestTab(link.tab);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') requestTab(link.tab);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1,
              px: 0.5,
              minHeight: 48,
              cursor: 'pointer',
              borderBottom: i < arr.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            <link.icon size={20} color={muiTheme.palette.primary.main} />
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', flex: 1 }}>
              {link.label}
            </Typography>
            <ChevronRight size={20} color={muiTheme.palette.text.secondary} />
          </Box>
        ))}
      </SectionCard>

      {/* ========== 3. SINGLE SUNRISE/SUNSET LINE ========== */}
      <SectionCard dense>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Sunrise size={16} color={muiTheme.palette.primary.main} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {formatTime(panchang.sunrise)}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Sunset size={16} color={muiTheme.palette.primary.main} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {formatTime(panchang.sunset)}
            </Typography>
          </Box>
        </Box>
      </SectionCard>

      {/* ========== 4. SINGLE INAUSPICIOUS-PERIODS STRIP (one neutral line) ========== */}
      <SectionCard dense>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, flexWrap: 'wrap' }}>
          <Clock size={16} color={muiTheme.palette.text.secondary} />
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            {t('panchang.rahuKaal')} {formatTime(panchang.rahuKaal.start)}–{formatTime(panchang.rahuKaal.end)}
            {' · '}
            {t('panchang.yamagandam') || 'Yamagandam'} {formatTime(panchang.yamagandam.start)}–{formatTime(panchang.yamagandam.end)}
            {' · '}
            {t('panchang.gulikaKaal') || 'Gulika'} {formatTime(panchang.gulikaKaal.start)}–{formatTime(panchang.gulikaKaal.end)}
          </Typography>
        </Box>
      </SectionCard>

      {/* ========== 5. ADD TO MY TITHIS (stays visible) ========== */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<Heart size={20} />}
          onClick={handleQuickAddTithi}
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            borderRadius: 1,
            py: 1,
            px: 3,
            fontWeight: 500,
            fontSize: '0.875rem',
            textTransform: 'none',
          }}
        >
          {t('myTithis.addNew') || 'Add to My Tithis'}
        </Button>
      </Box>

      {/* ========== 6. ONE ALERT STACK (max 2 visible + expander) ========== */}
      <Fade in timeout={350}>
        <Box>
          <AlertStack alerts={alerts} />
        </Box>
      </Fade>

      {/* ========== 7. SEARCH + COMING UP ========== */}
      <Box sx={{ mt: 0.5, mb: 1.5 }}>
        <SearchUpcoming onFestivalOpen={onFestivalOpen} />
      </Box>

      {/* ========== SNACKBAR (as-is) ========== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 9 }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 1, fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ========== DIALOGS ========== */}
      <GlossaryDialog
        open={glossaryLimb !== null}
        onClose={() => setGlossaryLimb(null)}
        limbId={glossaryLimb ?? 'yoga'}
      />
    </ScreenContainer>
  );
};

export default TodayScreen;
