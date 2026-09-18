/**
 * TodayScreen - Redesigned with Sacred Minimalism
 *
 * Implements REDESIGN_SPECIFICATION.md:
 * - §4.2 Asymmetric Layout: Golden ratio (1:0.618) hero grid
 * - §2.2 Content Priority Hierarchy: Above-the-fold content first
 * - §8.1 ScreenContainer: Responsive layout with safe areas
 * - §9.2 Page transitions & staggered entrance animations
 * - §4.4 Micro-interactions: Hover lifts, press effects
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Alert,
  Divider,
  Fade,
  Zoom,
  Skeleton,
  Paper,
  Snackbar,
  useTheme as useMuiTheme,
  Button,
} from '@mui/material';
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PartyPopper,
  Heart,
  Calendar as CalendarIcon,
  Star,
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useI18n } from '../hooks/useI18n';
import { AyurvedicClock } from '../components/AyurvedicClock';
import { TithiCard } from '../components/TithiCard';
import { TodayGuidanceCard } from '../components/TodayGuidanceCard';
import { AuspiciousIndicator } from '../components/AuspiciousIndicator';
import { ExpandableSection } from '../components/ExpandableSection';
import { TithiExplanationDialog } from '../components/TithiExplanationDialog';
import { NakshatraExplanationDialog } from '../components/NakshatraExplanationDialog';
import { GlossaryDialog } from '../components/GlossaryDialog';
import type { GlossaryEntry } from '../data/panchangGlossary';
import { ScreenContainer } from '../components/ScreenContainer';
import { FastingChip } from '../components/FastingChip';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { triggerHapticIfSupported } from '../utils/haptics';
import './TodayScreen.css';

export const TodayScreen: React.FC = () => {
  const { t } = useI18n();
  const muiTheme = useMuiTheme();
  const { isMobile } = useBreakpoints();
  const isDark = muiTheme.palette.mode === 'dark';

  const {
    selectedDate,
    setSelectedDate,
    preferences,
    calculatePanchang,
    addCustomTithi,
    canAddMoreTithis,
  } = useAppStore();

  const [isTithiDialogOpen, setIsTithiDialogOpen] = useState(false);
  const [isNakshatraDialogOpen, setIsNakshatraDialogOpen] = useState(false);
  const [glossaryLimb, setGlossaryLimb] = useState<GlossaryEntry['id'] | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
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
    if (!canAddMoreTithis()) {
      setSnackbar({
        open: true,
        message: t('premium.upgradeRequired') || 'Upgrade to premium to add more tithis',
        severity: 'info',
      });
      return;
    }

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
  }, [addCustomTithi, canAddMoreTithis, panchang, selectedDate, t]);

  const formatDate = useCallback((date: Date) => {
    const locale =
      preferences.language === 'hi'
        ? 'hi-IN'
        : preferences.language === 'sa'
        ? 'sa-IN'
        : 'en-IN';
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [preferences.language]);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const isExpanded = (sectionId: string) => expandedSections.has(sectionId);

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

  return (
    <ScreenContainer>
      {/* ========== SEGMENT 1. STICKY DATE BAR — location + date nav merged, mobile-first ========== */}
      <Zoom in timeout={250}>
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 56,
            zIndex: 500,
            bgcolor: 'background.paper',
            boxShadow: isDark
              ? '0 2px 8px rgba(0,0,0,0.2)'
              : '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'box-shadow 0.25s ease',
            '&:hover': {
              boxShadow: isDark
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.08)',
            },
          }}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            {/* Merged header row: location + sunrise (was standalone header) */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin size={16} color={muiTheme.palette.primary.main} />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      lineHeight: 1,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: 'text.secondary',
                      display: 'block',
                    }}
                  >
                    {t('common.location')}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.9rem' }}
                  >
                    {preferences.location.name}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Sparkles size={16} color={muiTheme.palette.primary.light} />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 500, fontSize: '0.75rem', color: 'primary.main' }}
                >
                  {formatTime(panchang.sunrise)}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 1, borderColor: 'divider' }} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <IconButton
                onClick={handlePrevDay}
                size="small"
                aria-label="previous day"
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  bgcolor: isDark
                    ? `${muiTheme.palette.primary.main}15`
                    : `${muiTheme.palette.primary.main}8`,
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: isDark
                      ? `${muiTheme.palette.primary.main}25`
                      : `${muiTheme.palette.primary.main}15`,
                  },
                  '&:active': { transform: 'scale(0.92)' },
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronLeft size={22} />
              </IconButton>

              <Box sx={{ textAlign: 'center', flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mb: 0.25 }}>
                  <CalendarIcon size={16} color={muiTheme.palette.primary.main} />
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
                      minHeight: 28,
                      p: '2px 8px',
                      borderRadius: 1.5,
                      bgcolor: isDark
                        ? `${muiTheme.palette.primary.main}15`
                        : `${muiTheme.palette.primary.main}10`,
                      '&:hover': {
                        bgcolor: isDark
                          ? `${muiTheme.palette.primary.main}25`
                          : `${muiTheme.palette.primary.main}20`,
                      },
                      '&:active': { transform: 'scale(0.95)' },
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
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  bgcolor: isDark
                    ? `${muiTheme.palette.primary.main}15`
                    : `${muiTheme.palette.primary.main}8`,
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: isDark
                      ? `${muiTheme.palette.primary.main}25`
                      : `${muiTheme.palette.primary.main}15`,
                  },
                  '&:active': { transform: 'scale(0.92)' },
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronRight size={22} />
              </IconButton>
            </Box>
          </CardContent>
        </Paper>
      </Zoom>

      {/* ========== SEGMENT 2. HERO + GUIDANCE (guidance directly under hero) ========== */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 0.618fr', // Golden ratio on tablet+
          },
          gap: { xs: 2, md: 3 },
          mb: 2,
          width: '100%',
        }}
      >
        {/* LEFT (61.8%): Tithi Hero Card */}
        <Box sx={{ minWidth: 0 }}>
          <TithiCard
            tithi={panchang.tithi}
            onClick={() => {
              triggerHapticIfSupported('light');
              setIsTithiDialogOpen(true);
            }}
            style={{ height: '100%' }}
          />
        </Box>

        {/* RIGHT (38.2%): Nakshatra, Yoga, Karana Summary */}
        <Box
          sx={{ display: { xs: 'none', md: 'block' }, minWidth: 0 }}
        >
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              boxShadow: isDark
                ? '0 2px 8px rgba(0,0,0,0.2)'
                : '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            {/* Nakshatra */}
            <Box sx={{ py: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: isDark
                    ? `${muiTheme.palette.primary.main}20`
                    : `${muiTheme.palette.primary.main}10`,
                  mb: 0.75,
                }}
              >
                <Star size={18} color={muiTheme.palette.primary.main} />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  display: 'block',
                  mb: 0.25,
                }}
              >
                {t('panchang.nakshatra')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                }}
              >
                {panchang.nakshatra.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
              >
                Ends {formatTime(panchang.nakshatra.endTime)}
              </Typography>
            </Box>

            <Divider sx={{ my: 1, borderColor: 'divider' }} />

            {/* Yoga */}
            <Box
              sx={{ py: 1, cursor: 'pointer' }}
              onClick={() => {
                triggerHapticIfSupported('light');
                setGlossaryLimb('yoga');
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: isDark
                    ? `${muiTheme.palette.secondary.main}20`
                    : `${muiTheme.palette.secondary.main}10`,
                  mb: 0.75,
                }}
              >
                <Sparkles size={18} color={muiTheme.palette.secondary.main} />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  display: 'block',
                  mb: 0.25,
                }}
              >
                {t('panchang.yoga')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                }}
              >
                {panchang.yoga.name}
              </Typography>
              {panchang.yoga.favorability && (
                <AuspiciousIndicator
                  favorability={panchang.yoga.favorability}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              )}
            </Box>

            <Divider sx={{ my: 1, borderColor: 'divider' }} />

            {/* Karana */}
            <Box
              sx={{ py: 1, cursor: 'pointer' }}
              onClick={() => {
                triggerHapticIfSupported('light');
                setGlossaryLimb('karana');
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: isDark
                    ? `${muiTheme.palette.info.main}20`
                    : `${muiTheme.palette.info.main}10`,
                  mb: 0.75,
                }}
              >
                <CalendarIcon size={18} color={muiTheme.palette.info.main} />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  display: 'block',
                  mb: 0.25,
                }}
              >
                {t('panchang.karana')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  color: 'text.primary',
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                }}
              >
                {panchang.karana.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
              >
                {panchang.karana.type}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Guidance directly under hero — single timings source via props, times render once in Timings row below */}
      {/* ========== SEGMENT 2b. TODAY'S GUIDANCE CARD ========== */}
      <Fade in timeout={300}>
        <Box sx={{ mb: 2 }}>
          <TodayGuidanceCard
            panchang={panchang}
            rahuKaal={panchang.rahuKaal}
            yamagandam={panchang.yamagandam}
            gulikaKaal={panchang.gulikaKaal}
          />
        </Box>
      </Fade>

      {/* ========== SEGMENT 2c. TIMINGS ROW — single source for Rahu Kaal / Yamagandam / Gulika
          (moved up directly under guidance so sunrise/Rahu Kaal are visible without deep scroll;
          TodayGuidanceCard above already receives these as props; times live here once) ========== */}
      <Fade in timeout={325}>
        <Box sx={{ mb: 2 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: '1px solid',
              borderColor: isDark
                ? `${muiTheme.palette.warning.main}30`
                : `${muiTheme.palette.warning.main}20`,
              bgcolor: isDark
                ? `${muiTheme.palette.warning.main}8`
                : `${muiTheme.palette.warning.main}5`,
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: isDark
                  ? '0 4px 12px rgba(0,0,0,0.3)'
                  : '0 4px 12px rgba(0,0,0,0.08)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Typography variant="overline" sx={{ color: 'warning.main', fontWeight: 500, letterSpacing: '0.08em', fontSize: '0.7rem', display: 'block' }}>
                {t('panchang.timings') || 'Timings'}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.primary', mt: 0.25, fontSize: { xs: '0.875rem', sm: '0.95rem' } }}>
                {t('panchang.rahuKaal')}: {formatTime(panchang.rahuKaal.start)} - {formatTime(panchang.rahuKaal.end)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {t('panchang.yamagandam') || 'Yamagandam'}: {formatTime(panchang.yamagandam.start)} - {formatTime(panchang.yamagandam.end)}
                {'  ·  '}
                {t('panchang.gulikaKaal') || 'Gulika'}: {formatTime(panchang.gulikaKaal.start)} - {formatTime(panchang.gulikaKaal.end)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'warning.main', display: 'block', mt: 0.25 }}>
                {t('panchang.rahuKaalWarning')}
              </Typography>
              <AuspiciousIndicator
                favorability="challenging"
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Box>
      </Fade>

      {/* ========== SEGMENT 4. ALERTS / CLOCK / ACTIONS (all data kept, reorganized) ========== */}
      {/* ========== 5. AUSPICIOUS TIMES BADGE ========== */}
      {panchang.isAuspiciousTime && (
        <Zoom in timeout={350}>
          <Box sx={{ mb: 2 }}>
            <AuspiciousIndicator
              favorability="auspicious"
              size="large"
              message={t('panchang.auspiciousTime')}
              sx={{ width: '100%' }}
            />
          </Box>
        </Zoom>
      )}

      {/* ========== 6. FESTIVAL & FASTING ALERTS (§2.2) ========== */}
      <Fade in timeout={350}>
        <Box sx={{ mb: 2 }}>
          {/* Festival Alert */}
          {panchang.festivals.length > 0 && (
            <Alert
              icon={<PartyPopper size={20} />}
              severity="success"
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: isDark
                  ? `${muiTheme.palette.success.main}30`
                  : `${muiTheme.palette.success.main}20`,
                bgcolor: isDark
                  ? `${muiTheme.palette.success.main}12`
                  : `${muiTheme.palette.success.main}8`,
                mb: 1.5,
                '& .MuiAlert-icon': { color: muiTheme.palette.success.main },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Noto Sans", sans-serif',
                  color: isDark ? muiTheme.palette.success.light : muiTheme.palette.success.dark,
                }}
              >
                {preferences.language === 'hi'
                  ? panchang.festivals[0].nameHindi
                  : panchang.festivals[0].name}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.25, opacity: 0.9, color: 'text.secondary' }}>
                {panchang.festivals[0].significance}
              </Typography>
            </Alert>
          )}

          {/* Fasting Card — using new FastingChip component (§8.1) */}
          {panchang.fasting && (
            <FastingChip
              fasting={{
                name: preferences.language === 'hi'
                  ? panchang.fasting.nameHindi
                  : panchang.fasting.name,
                significance: panchang.fasting.significance,
                paranaTime: panchang.fasting.paranaTime,
              }}
              detailed
            />
          )}
        </Box>
      </Fade>

      {/* ========== SEGMENT 3. DETAIL GRID — Stories rhythm (overline + h5 + body2) ========== */}
      <Fade in timeout={400}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              mb: 1.5,
              pl: 0.5,
              fontFamily: '"Noto Sans", sans-serif',
              letterSpacing: '-0.01em',
              color: 'text.primary',
            }}
          >
            {t('panchang.title')}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
              width: '100%',
            }}
          >
            {/* Nakshatra Section */}
            <ExpandableSection
              title={t('panchang.nakshatra')}
              icon={<Star size={20} />}
              expanded={isExpanded('nakshatra')}
              onToggle={() => toggleSection('nakshatra')}
            >
              <Card
                elevation={0}
                onClick={() => {
                  triggerHapticIfSupported('light');
                  setIsNakshatraDialogOpen(true);
                }}
                sx={{
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: isDark
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.08)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': { transform: 'scale(0.98)' },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {panchang.nakshatra.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                    {panchang.nakshatra.nameHindi}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                    Ruler: {panchang.nakshatra.ruler}
                  </Typography>
                  {panchang.nakshatra.favorability && (
                    <AuspiciousIndicator
                      favorability={panchang.nakshatra.favorability}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
              </Card>
            </ExpandableSection>

            {/* Yoga Section */}
            <ExpandableSection
              title={t('panchang.yoga')}
              icon={<Sparkles size={20} />}
              expanded={isExpanded('yoga')}
              onToggle={() => toggleSection('yoga')}
            >
              <Card
                elevation={0}
                onClick={() => {
                  triggerHapticIfSupported('light');
                  setGlossaryLimb('yoga');
                }}
                sx={{
                  borderRadius: 2,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: isDark
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.08)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': { transform: 'scale(0.98)' },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {panchang.yoga.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                    {panchang.yoga.nameHindi}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                    #{panchang.yoga.number}
                  </Typography>
                  {panchang.yoga.favorability && (
                    <AuspiciousIndicator
                      favorability={panchang.yoga.favorability}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </CardContent>
              </Card>
            </ExpandableSection>

            {/* Samvatsara Section */}
            {panchang.samvatsara && (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: isDark
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: isDark
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.08)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem' }}>
                    {t('panchang.samvatsara') || 'Samvatsara'}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary', mt: 0.25 }}>
                    {panchang.samvatsara}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                    {t('panchang.samvatsaraDesc') || 'Hindu Year (60-year cycle)'}
                  </Typography>
                </CardContent>
              </Card>
            )}

          </Box>
        </Box>
      </Fade>

      {/* ========== 8. AYURVEDIC CLOCK ========== */}
      <Fade in timeout={450}>
        <Box sx={{ mb: 2 }}>
          <AyurvedicClock panchang={panchang} />
        </Box>
      </Fade>

      {/* ========== 9. QUICK ACTION: Add to My Tithis ========== */}
      <Fade in timeout={500}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Button
            variant="outlined"
            size="medium"
            startIcon={<Heart size={18} />}
            onClick={handleQuickAddTithi}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              borderRadius: 2,
              py: 1,
              px: 3,
              fontWeight: 500,
              fontSize: '0.875rem',
              textTransform: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: isDark
                  ? `${muiTheme.palette.primary.main}15`
                  : `${muiTheme.palette.primary.main}8`,
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${muiTheme.palette.primary.main}30`,
              },
              '&:active': { transform: 'scale(0.97)' },
            }}
          >
            {t('myTithis.addNew') || 'Add to My Tithis'}
          </Button>
        </Box>
      </Fade>

      {/* ========== SNACKBAR ========== */}
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
          sx={{ borderRadius: 2, fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ========== DIALOGS ========== */}
      <TithiExplanationDialog
        open={isTithiDialogOpen}
        onClose={() => setIsTithiDialogOpen(false)}
        tithiNumber={panchang?.tithi.number || 1}
        paksha={panchang?.tithi.paksha || 'Shukla'}
      />

      <NakshatraExplanationDialog
        open={isNakshatraDialogOpen}
        onClose={() => setIsNakshatraDialogOpen(false)}
        nakshatraNumber={panchang?.nakshatra.number || 1}
      />

      <GlossaryDialog
        open={glossaryLimb !== null}
        onClose={() => setGlossaryLimb(null)}
        limbId={glossaryLimb ?? 'yoga'}
      />
    </ScreenContainer>
  );
};

export default TodayScreen;
