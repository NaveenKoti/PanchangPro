/**
 * FastsScreen - Complete Fasting Information
 *
 * Shows:
 * - Today's fast (if any)
 * - Upcoming fasts (next 30 days)
 * - All 23 Ekadashis
 * - Other fasting days (Pradosh, Sankashti, Purnima, Amavasya)
 */

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  useTheme as useMuiTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Divider,
  Fade,
  Zoom,
  Button,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Calendar, Clock, Sparkles, ChevronDown, ChevronRight, X, Share2, Moon } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useI18n } from '../hooks/useI18n';
import { EKADASHIS, OTHER_FASTS, FastingInfo } from '../data/fastings';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionCard } from '../components/layout/SectionCard';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { PanchangShareCard } from '../components/PanchangShareCard';
import EkadashiDetailCard from '../components/EkadashiDetailCard';
import { triggerHapticIfSupported } from '../utils/haptics';
import { findFestivalStoryByName } from '../data/festivalStories';
import { FESTIVALS, FestivalData, festivalText } from '../data/festivals';

interface FastsScreenProps {
  /** Callback when user taps a festival to view its full story */
  onFestivalOpen?: (festivalId: string) => void;
}

/**
 * Fast-type icon + tint for upcoming-list rows.
 * Mirrors the Today timings icon-led rows (36px tinted square + label + right value).
 */
const getFastTypeVisual = (
  type: string,
  palette: { primary: { main: string } },
): { Icon: React.ComponentType<{ size?: number | string; color?: string }>; color: string } => {
  if (type === 'festival') return { Icon: Sparkles, color: palette.primary.main };
  if (type === 'purnima' || type === 'amavasya') return { Icon: Moon, color: palette.primary.main };
  return { Icon: Clock, color: palette.primary.main };
};

export const FastsScreen: React.FC<FastsScreenProps> = ({ onFestivalOpen }) => {
  const { t, currentLanguage } = useI18n();
  const muiTheme = useMuiTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const { isMobile } = useBreakpoints();
  const isHindi = currentLanguage === 'hi';

  const { selectedDate, calculatePanchang, preferences } = useAppStore();
  const [activeTab, setActiveTab] = useState(0);
  const [fastsExpanded, setFastsExpanded] = useState(false);
  const [festivalsExpanded, setFestivalsExpanded] = useState(false);
  const [festivalsTabExpanded, setFestivalsTabExpanded] = useState<Record<string, boolean>>({});
  const [selectedFasting, setSelectedFasting] = useState<FastingInfo | null>(null);
  const [fastingDialogOpen, setFastingDialogOpen] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const panchang = calculatePanchang(selectedDate);

  const handleFastingCardClick = (fastingInfo: FastingInfo) => {
    triggerHapticIfSupported('light');
    setSelectedFasting(fastingInfo);
    setFastingDialogOpen(true);
  };

  const handleFastingDialogClose = () => {
    setFastingDialogOpen(false);
    setSelectedFasting(null);
  };

  // Helper to find fasting info by name
  const findFastingByName = (name: string): FastingInfo | null => {
    // Check OTHER_FASTS first
    for (const fast of Object.values(OTHER_FASTS)) {
      if (fast.name === name || fast.nameHindi === name) {
        return fast;
      }
    }
    // Check EKADASHIS
    for (const ekadashi of EKADASHIS) {
      if (ekadashi.name === name || ekadashi.nameHindi === name) {
        return ekadashi;
      }
    }
    return null;
  };

  // Calculate upcoming fasts for next 30 days
  const upcomingFasts = useMemo(() => {
    const fasts: Array<{ date: Date; name: string; type: string; daysUntil: number }> = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayPanchang = calculatePanchang(date);
      
      if (dayPanchang.fasting) {
        fasts.push({
          date: date,
          name: currentLanguage === 'hi' ? dayPanchang.fasting.nameHindi : dayPanchang.fasting.name,
          type: dayPanchang.fasting.type,
          daysUntil: i,
        });
      }
      
      // Also check for festivals that involve fasting
      if (dayPanchang.festivals.length > 0) {
        dayPanchang.festivals.forEach((festival: any) => {
          if (festival.name.toLowerCase().includes('fast') || 
              festival.name.toLowerCase().includes('vrat') ||
              festival.name.toLowerCase().includes('ekadashi') ||
              festival.name.toLowerCase().includes('chaturthi')) {
            // Avoid duplicates
            const alreadyAdded = fasts.some(f => f.date.toDateString() === date.toDateString());
            if (!alreadyAdded) {
              fasts.push({
                date: date,
                name: festivalText(festival, currentLanguage, 'name') as string,
                type: 'festival',
                daysUntil: i,
              });
            }
          }
        });
      }
    }
    
    // Sort by daysUntil ascending and return top 10
    return fasts
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 10);
  }, [calculatePanchang, currentLanguage]);

  // Calculate upcoming festivals for next 60 days
  const upcomingFestivals = useMemo(() => {
    const festivals: Array<{
      date: Date;
      name: string;
      description: string;
      type: 'major' | 'minor' | 'regional';
      daysUntil: number;
    }> = [];
    const today = new Date();

    for (let i = 1; i <= 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const panchang = calculatePanchang(date);

      if (panchang.festivals && panchang.festivals.length > 0) {
        panchang.festivals.forEach((festival: any) => {
          festivals.push({
            date,
            name: festivalText(festival, currentLanguage, 'name') as string,
            description: festival.description || festival.significance?.substring(0, 100) || '',
            type: festival.type || 'minor',
            daysUntil: i,
          });
        });
      }
    }

    // Sort by daysUntil ascending and return top 10
    return festivals
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 10);
  }, [calculatePanchang, currentLanguage]);

  // Group festivals by type for the Festivals tab
  const festivalsByType = useMemo(() => {
    const grouped: Record<string, FestivalData[]> = {
      major: [],
      minor: [],
      regional: [],
    };

    // Deduplicate by id (FESTIVALS has some duplicates)
    const uniqueFestivals = FESTIVALS.filter(
      (festival, index, self) => index === self.findIndex((f) => f.id === festival.id)
    );

    uniqueFestivals.forEach((festival) => {
      grouped[festival.type].push(festival);
    });

    return grouped;
  }, []);

  const monthNames = useMemo(() => [
    '', // 0 is special case (Sankashti - every month)
    'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
    'Shravana', 'Bhadrapada', 'Ashwin', 'Kartik',
    'Margashirsha', 'Pausha', 'Magha', 'Phalguna',
  ], []);

  const monthNamesHindi = useMemo(() => [
    '', // 0 is special case
    'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़',
    'श्रावण', 'भाद्रपद', 'आश्विन', 'कार्तिक',
    'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन',
  ], []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    triggerHapticIfSupported('light');
    setActiveTab(newValue);
  };

  const handleShare = () => {
    triggerHapticIfSupported('medium');
    setShowShareCard(true);
  };

  return (
    <ScreenContainer
      sx={{ pt: 1.5 }}
    >
      {/* Header */}
      <Fade in timeout={250}>
        <Box sx={{ mb: 1.5, textAlign: 'center', px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
              }}
            >
              {t('fasting.title')}
            </Typography>
            <Box
              onClick={handleShare}
              role="button"
              tabIndex={0}
              aria-label="share fasting info"
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleShare(); }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: isDark
                  ? alpha(muiTheme.palette.primary.main, 0.08)
                  : alpha(muiTheme.palette.primary.main, 0.06),
                color: 'primary.main',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                '&:hover': {
                  bgcolor: isDark
                    ? alpha(muiTheme.palette.primary.main, 0.15)
                    : alpha(muiTheme.palette.primary.main, 0.13),
                  transform: 'scale(1.05)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            >
              <Share2 size={20} />
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
            {t('fasting.subtitle') || 'Spiritual observances & fasting days'}
          </Typography>
        </Box>
      </Fade>

      {/* Today's Fast Card */}
      {panchang?.fasting && (
        <Zoom in timeout={300}>
        <SectionCard
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={18} color={muiTheme.palette.primary.main} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3, flex: 1, minWidth: 0 }}>
                {currentLanguage === 'hi' ? panchang.fasting.nameHindi : panchang.fasting.name}
              </Typography>
            </Box>
          }
        >
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {panchang.fasting.significance?.substring(0, 200)}...
          </Typography>
        </SectionCard>
        </Zoom>
      )}

      {/* Upcoming Fasts */}
      {upcomingFasts.length > 0 && (
        <Fade in timeout={350}>
        <SectionCard
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Clock size={18} color={muiTheme.palette.primary.main} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3, flex: 1, minWidth: 0 }}>
                {t('fasting.upcoming') || 'Upcoming Fasts'}
              </Typography>
            </Box>
          }
        >

          {/* First fast as prominent card - tappable if it matches a festival or has fasting details */}
          {(() => {
            const matchedStory = findFestivalStoryByName(upcomingFasts[0].name);
            const matchedFasting = findFastingByName(upcomingFasts[0].name);
            const canViewStory = !!matchedStory && !!onFestivalOpen;
            const canViewDetails = !!matchedFasting;
            const visual = getFastTypeVisual(upcomingFasts[0].type, muiTheme.palette);
            return (
            <Box
              onClick={() => {
                if (canViewStory && matchedStory) {
                  triggerHapticIfSupported('light');
                  onFestivalOpen!(matchedStory.id);
                } else if (canViewDetails && matchedFasting) {
                  handleFastingCardClick(matchedFasting);
                }
              }}
              sx={{
                p: { xs: 1.25, sm: 1.5 },
                borderRadius: 1.5,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.07),
                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                mb: upcomingFasts.length > 1 ? 0.75 : 0,
                cursor: (canViewStory || canViewDetails) ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                '&:hover': (canViewStory || canViewDetails) ? {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                } : {},
                '&:active': (canViewStory || canViewDetails) ? {
                  transform: 'scale(0.98)',
                } : {},
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: isDark
                      ? alpha(visual.color, 0.15)
                      : alpha(visual.color, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <visual.Icon size={20} color={visual.color} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                    {upcomingFasts[0].name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4, display: 'block' }}>
                    {upcomingFasts[0].date.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0, alignItems: 'center' }}>
                  {canViewStory && (
                    <Chip
                      label="View Story"
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.6rem',
                        fontWeight: 500,
                        bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                        color: muiTheme.palette.primary.main,
                        border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.19)}`,
                      }}
                    />
                  )}
                  {canViewDetails && !canViewStory && (
                    <Chip
                      label="Details"
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.6rem',
                        fontWeight: 500,
                        bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                        color: muiTheme.palette.primary.main,
                        border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.19)}`,
                      }}
                    />
                  )}
                  <Chip
                    label={upcomingFasts[0].daysUntil === 1 ? 'Tomorrow' : `In ${upcomingFasts[0].daysUntil} days`}
                    size="small"
                    sx={{
                      height: 26,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      minWidth: 48,
                      bgcolor: upcomingFasts[0].daysUntil <= 3
                        ? (theme) => alpha(theme.palette.error.main, 0.15)
                        : (theme) => alpha(theme.palette.primary.main, 0.15),
                      color: upcomingFasts[0].daysUntil <= 3
                        ? 'error.main'
                        : 'primary.main',
                    }}
                  />
                  {(canViewStory || canViewDetails) && (
                    <ChevronRight size={16} color={muiTheme.palette.primary.main} aria-hidden="true" />
                  )}
                </Box>
              </Box>
            </Box>
            );
          })()}

          {/* Accordion for remaining fasts */}
          {upcomingFasts.length > 1 && (
            <Accordion
              expanded={fastsExpanded}
              onChange={(_, expanded) => setFastsExpanded(expanded)}
              disableGutters
              elevation={0}
              sx={{
                bgcolor: 'transparent',
                '&::before': { display: 'none' },
                boxShadow: 'none',
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={20} color={muiTheme.palette.primary.main} />}
                sx={{
                  minHeight: 48,
                  px: 1,
                  py: 0.5,
                  '& .MuiAccordionSummary-content': {
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                  }}
                >
                  Show {upcomingFasts.length - 1} more upcoming fast{upcomingFasts.length - 1 > 1 ? 's' : ''}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0.5, pt: 0, pb: 0.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {upcomingFasts.slice(1).map((fast, index) => {
                    const matchedStory = findFestivalStoryByName(fast.name);
                    const matchedFasting = findFastingByName(fast.name);
                    const canViewStory = !!matchedStory && !!onFestivalOpen;
                    const canViewDetails = !!matchedFasting;
                    const visual = getFastTypeVisual(fast.type, muiTheme.palette);
                    return (
                    <Box
                      key={index}
                      onClick={() => {
                        if (canViewStory && matchedStory) {
                          triggerHapticIfSupported('light');
                          onFestivalOpen!(matchedStory.id);
                        } else if (canViewDetails && matchedFasting) {
                          handleFastingCardClick(matchedFasting);
                        }
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1.25,
                        px: 1,
                        py: 0.75,
                        minHeight: 48,
                        borderRadius: 1.5,
                        bgcolor: muiTheme.palette.action.hover,
                        cursor: (canViewStory || canViewDetails) ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        '&:hover': (canViewStory || canViewDetails) ? {
                          bgcolor: muiTheme.palette.action.selected,
                        } : {},
                        '&:active': (canViewStory || canViewDetails) ? {
                          transform: 'scale(0.98)',
                        } : {},
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1,
                          bgcolor: isDark
                            ? alpha(visual.color, 0.13)
                            : alpha(visual.color, 0.06),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <visual.Icon size={20} color={visual.color} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                          {fast.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0, alignItems: 'center' }}>
                        {canViewStory && (
                          <Chip
                            label="Story"
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.55rem',
                              fontWeight: 500,
                              bgcolor: alpha(muiTheme.palette.primary.main, 0.07),
                              color: muiTheme.palette.primary.main,
                              border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.15)}`,
                            }}
                          />
                        )}
                        {canViewDetails && !canViewStory && (
                          <Chip
                            label="Details"
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.55rem',
                              fontWeight: 500,
                              bgcolor: alpha(muiTheme.palette.primary.main, 0.07),
                              color: muiTheme.palette.primary.main,
                              border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.15)}`,
                            }}
                          />
                        )}
                        <Chip
                          label={fast.daysUntil === 1 ? 'Tomorrow' : `In ${fast.daysUntil} days`}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            minWidth: 48,
                            bgcolor: fast.daysUntil <= 3
                              ? (theme) => alpha(theme.palette.error.main, 0.12)
                              : (theme) => alpha(theme.palette.primary.main, 0.12),
                            color: fast.daysUntil <= 3
                              ? 'error.main'
                              : 'primary.main',
                          }}
                        />
                      </Box>
                    </Box>
                    );
                  })}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </SectionCard>
        </Fade>
      )}
      {upcomingFasts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 2, mb: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1,
            }}
          >
            <Moon size={24} color={muiTheme.palette.primary.main} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ px: 0.5, lineHeight: 1.6 }}>
            {isHindi ? 'अगले 30 दिनों में कोई व्रत नहीं — एकादशी और प्रदोष यहाँ दिखेंगे।' : 'No fasts in the next 30 days — Ekadashi and Pradosh will appear here.'}
          </Typography>
        </Box>
      )}

      {/* Upcoming Festivals */}
      {upcomingFestivals.length > 0 && (
        <Fade in timeout={400}>
        <SectionCard
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Calendar size={18} color={muiTheme.palette.primary.main} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3, flex: 1, minWidth: 0 }}>
                {t('festivals.upcoming') || 'Upcoming Festivals'}
              </Typography>
            </Box>
          }
        >

          {/* First festival as prominent card - tappable */}
          {upcomingFestivals[0] && (() => {
            const matchedStory = findFestivalStoryByName(upcomingFestivals[0].name);
            const canViewStory = !!matchedStory && !!onFestivalOpen;
            return (
            <Box
              onClick={() => {
                if (canViewStory && matchedStory) {
                  triggerHapticIfSupported('light');
                  onFestivalOpen!(matchedStory.id);
                }
              }}
              sx={{
                p: { xs: 1.25, sm: 1.5 },
                borderRadius: 1.5,
                bgcolor: alpha(muiTheme.palette.primary.main, 0.07),
                border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.15)}`,
                mb: upcomingFestivals.length > 1 ? 0.75 : 0,
                cursor: canViewStory ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                '&:hover': canViewStory ? {
                  bgcolor: alpha(muiTheme.palette.primary.main, 0.09),
                } : {},
                '&:active': canViewStory ? {
                  transform: 'scale(0.98)',
                } : {},
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: isDark
                      ? alpha(muiTheme.palette.primary.main, 0.15)
                      : alpha(muiTheme.palette.primary.main, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={20} color={muiTheme.palette.primary.main} />
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: muiTheme.palette.primary.main,
                    flex: 1,
                    minWidth: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {upcomingFestivals[0].name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0, alignItems: 'center' }}>
                  {canViewStory && (
                    <Chip
                      label="View Story"
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.6rem',
                        fontWeight: 500,
                        bgcolor: alpha(muiTheme.palette.primary.main, 0.13),
                        color: muiTheme.palette.primary.main,
                        border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.21)}`,
                      }}
                    />
                  )}
                  <Chip
                    label={upcomingFestivals[0].daysUntil === 0 ? 'Today' : upcomingFestivals[0].daysUntil === 1 ? 'Tomorrow' : `In ${upcomingFestivals[0].daysUntil} days`}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      minWidth: 48,
                      bgcolor: upcomingFestivals[0].daysUntil <= 3
                        ? (theme) => alpha(theme.palette.error.main, 0.15)
                        : (theme) => alpha(theme.palette.primary.main, 0.15),
                      color: upcomingFestivals[0].daysUntil <= 3
                        ? 'error.main'
                        : 'primary.main',
                    }}
                  />
                  {canViewStory && (
                    <ChevronRight size={16} color={muiTheme.palette.primary.main} aria-hidden="true" />
                  )}
                </Box>
              </Box>
              {upcomingFestivals[0].description && (
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.4,
                    display: 'block',
                    mb: 0.5,
                  }}
                >
                  {upcomingFestivals[0].description}
                </Typography>
              )}
              <Chip
                label={upcomingFestivals[0].type.charAt(0).toUpperCase() + upcomingFestivals[0].type.slice(1)}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                  color: muiTheme.palette.primary.main,
                  border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.19)}`,
                }}
              />
            </Box>
            );
          })()}

          {/* Accordion for remaining festivals */}
          {upcomingFestivals.length > 1 && (
            <Accordion
              expanded={festivalsExpanded}
              onChange={(_, expanded) => setFestivalsExpanded(expanded)}
              disableGutters
              elevation={0}
              sx={{
                bgcolor: 'transparent',
                '&::before': { display: 'none' },
                boxShadow: 'none',
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={20} color={muiTheme.palette.primary.main} />}
                sx={{
                  minHeight: 48,
                  px: 1,
                  py: 0.5,
                  '& .MuiAccordionSummary-content': {
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: muiTheme.palette.primary.main,
                    fontWeight: 500,
                    fontSize: '0.8rem',
                  }}
                >
                  Show {upcomingFestivals.length - 1} more upcoming festival{upcomingFestivals.length - 1 > 1 ? 's' : ''}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0.5, pt: 0, pb: 0.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {upcomingFestivals.slice(1).map((festival, index) => {
                    const typeColors = {
                      major: {
                        bg: alpha(muiTheme.palette.primary.main, 0.07),
                        text: muiTheme.palette.primary.main,
                        border: alpha(muiTheme.palette.primary.main, 0.15),
                      },
                      minor: {
                        bg: alpha(muiTheme.palette.success.main, 0.07),
                        text: muiTheme.palette.success.main,
                        border: alpha(muiTheme.palette.success.main, 0.15),
                      },
                      regional: {
                        bg: alpha(muiTheme.palette.info.main, 0.07),
                        text: muiTheme.palette.info.main,
                        border: alpha(muiTheme.palette.info.main, 0.15),
                      },
                    };
                    const colors = typeColors[festival.type] || typeColors.minor;
                    const matchedStory = findFestivalStoryByName(festival.name);
                    const canViewStory = !!matchedStory && !!onFestivalOpen;

                    return (
                      <Box
                        key={index}
                        onClick={() => {
                          if (canViewStory && matchedStory) {
                            triggerHapticIfSupported('light');
                            onFestivalOpen!(matchedStory.id);
                          }
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                          px: 1,
                          py: 0.75,
                          minHeight: 48,
                          borderRadius: 1.5,
                          bgcolor: muiTheme.palette.action.hover,
                          border: `1px solid ${muiTheme.palette.divider}`,
                          cursor: canViewStory ? 'pointer' : 'default',
                          transition: 'all 0.2s ease',
                          '&:hover': canViewStory ? {
                            bgcolor: muiTheme.palette.action.selected,
                          } : {},
                          '&:active': canViewStory ? {
                            transform: 'scale(0.98)',
                          } : {},
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1,
                            bgcolor: isDark
                              ? alpha(muiTheme.palette.primary.main, 0.13)
                              : alpha(muiTheme.palette.primary.main, 0.06),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Sparkles size={20} color={muiTheme.palette.primary.main} />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: 'text.primary',
                              flex: 1,
                              minWidth: 0,
                              lineHeight: 1.3,
                            }}
                          >
                            {festival.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0, alignItems: 'center' }}>
                            {canViewStory && (
                              <Chip
                                label="Story"
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '0.55rem',
                                  fontWeight: 500,
                                  bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                                  color: muiTheme.palette.primary.main,
                                  border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.19)}`,
                                }}
                              />
                            )}
                            <Chip
                            label={festival.daysUntil === 0 ? 'Today' : festival.daysUntil === 1 ? 'Tomorrow' : `In ${festival.daysUntil} days`}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              minWidth: 48,
                              flexShrink: 0,
                              bgcolor: festival.daysUntil <= 3
                                ? (theme) => alpha(theme.palette.error.main, 0.12)
                                : (theme) => alpha(theme.palette.primary.main, 0.12),
                              color: festival.daysUntil <= 3
                                ? 'error.main'
                                : 'primary.main',
                            }}
                          />
                        </Box>
                        {festival.description && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.4,
                              display: 'block',
                              mb: 0.75,
                            }}
                          >
                            {festival.description}
                          </Typography>
                        )}
                        <Chip
                          label={festival.type.charAt(0).toUpperCase() + festival.type.slice(1)}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.6rem',
                            fontWeight: 500,
                            bgcolor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        />
                      </Box>
                      </Box>
                    );
                  })}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </SectionCard>
        </Fade>
      )}
      {upcomingFestivals.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 2, mb: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1,
            }}
          >
            <Sparkles size={24} color={muiTheme.palette.primary.main} />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ px: 0.5, lineHeight: 1.6 }}>
            {isHindi ? 'अगले 60 दिनों में कोई त्योहार नहीं — तिथि अनुसार त्योहार यहाँ दिखेंगे।' : 'No festivals in the next 60 days — festivals appear here by tithi.'}
          </Typography>
        </Box>
      )}

      {/* Tabs */}
      <Zoom in timeout={450}>
      <SectionCard noPadding>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: {
              backgroundColor: muiTheme.palette.primary.main,
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 400,
              color: 'text.secondary',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              minHeight: 48,
              minWidth: { xs: 80, sm: 120 },
              px: { xs: 1, sm: 2 },
            },
            '& .Mui-selected': {
              color: 'primary.main !important',
              fontWeight: 500,
            },
          }}
        >
          <Tab value={0} label={t('fasting.ekadashi')} />
          <Tab value={1} label={t('fasting.otherVrats')} />
          <Tab value={2} label={t('festivals.title') || 'Festivals'} />
        </Tabs>
      </SectionCard>
      </Zoom>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box sx={{ px: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.25, px: 1, fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {t('fasting.ekadashiList') || (isHindi ? 'सभी 24 एकादशी व्रत' : 'All 24 Ekadashi Fasts')}
          </Typography>
          {EKADASHIS.map((ekadashi) => (
            <Box
              key={ekadashi.id}
              onClick={() => handleFastingCardClick(ekadashi)}
              sx={{ cursor: 'pointer' }}
            >
              <EkadashiDetailCard ekadashi={ekadashi} />
            </Box>
          ))}
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ px: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.25, px: 1, fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {t('fasting.otherFasts') || (isHindi ? 'अन्य व्रत' : 'Other Fasting Days')}
          </Typography>
          {Object.values(OTHER_FASTS).map((fast) => (
            <Box
              key={fast.id}
              onClick={() => handleFastingCardClick(fast)}
              sx={{ cursor: 'pointer' }}
            >
              <EkadashiDetailCard ekadashi={fast} />
            </Box>
          ))}
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ px: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.25, px: 1, fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {isHindi ? 'प्रमुख और क्षेत्रीय त्योहार' : 'Major and Regional Festivals'}
          </Typography>

          {/* Major Festivals */}
          {festivalsByType.major.length > 0 && (
            <Accordion
              disableGutters
              elevation={0}
              defaultExpanded
              sx={{
                mb: 1.5,
                bgcolor: 'transparent',
                '&::before': { display: 'none' },
                boxShadow: 'none',
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={20} color={muiTheme.palette.primary.main} />}
                sx={{
                  minHeight: 48,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1.5,
                  bgcolor: alpha(muiTheme.palette.primary.main, 0.03),
                  border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.08)}`,
                  '& .MuiAccordionSummary-content': {
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: muiTheme.palette.primary.main,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                  }}
                >
                  {isHindi ? 'प्रमुख त्योहार' : 'Major Festivals'} ({festivalsByType.major.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0.5, pt: 0.75, pb: 0.5 }}>
                {festivalsByType.major.map((festival) => {
                  const matchedStory = findFestivalStoryByName(festival.name);
                  const canViewStory = !!matchedStory && !!onFestivalOpen;
                  const monthIndex = festival.month;
                  const monthName = monthIndex > 0
                    ? (isHindi ? monthNamesHindi[monthIndex] : monthNames[monthIndex])
                    : (isHindi ? 'प्रत्येक माह' : 'Every Month');

                  return (
                    <Box
                      key={festival.id}
                      onClick={() => {
                        if (canViewStory && matchedStory) {
                          triggerHapticIfSupported('light');
                          onFestivalOpen!(matchedStory.id);
                        }
                      }}
                      sx={{
                        mb: 0.75,
                        p: { xs: 1, sm: 1.25 },
                        borderRadius: 1.5,
                        bgcolor: muiTheme.palette.action.hover,
                        border: `1px solid ${muiTheme.palette.divider}`,
                        cursor: canViewStory ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        '&:hover': canViewStory ? {
                          bgcolor: muiTheme.palette.action.selected,
                        } : {},
                        '&:active': canViewStory ? {
                          transform: 'scale(0.98)',
                        } : {},
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5, gap: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                            flex: 1,
                            minWidth: 0,
                            lineHeight: 1.3,
                          }}
                        >
                          {festivalText(festival, currentLanguage, 'name')}
                        </Typography>
                        {canViewStory && (
                          <Chip
                            label={isHindi ? 'कहानी' : 'Story'}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.6rem',
                              fontWeight: 500,
                              bgcolor: alpha(muiTheme.palette.primary.main, 0.07),
                              color: muiTheme.palette.primary.main,
                              border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.15)}`,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>
                      {festival.description && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.4,
                            display: 'block',
                            mb: 0.75,
                          }}
                        >
                          {festival.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Chip
                          label={monthName}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: muiTheme.palette.action.selected,
                            color: muiTheme.palette.text.primary,
                          }}
                        />
                        <Chip
                          label={isHindi ? 'प्रमुख' : 'Major'}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                            color: muiTheme.palette.primary.main,
                            border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.19)}`,
                          }}
                        />
                        {festival.region && festival.region.length > 0 && (
                          <Chip
                            label={festival.region[0]}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.6rem',
                              fontWeight: 500,
                              bgcolor: alpha(muiTheme.palette.info.main, 0.07),
                              color: muiTheme.palette.info.main,
                              border: `1px solid ${alpha(muiTheme.palette.info.main, 0.15)}`,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          )}

          {/* Minor Festivals */}
          {festivalsByType.minor.length > 0 && (
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                mb: 1.5,
                bgcolor: 'transparent',
                '&::before': { display: 'none' },
                boxShadow: 'none',
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={20} color={muiTheme.palette.success.main} />}
                sx={{
                  minHeight: 48,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1.5,
                  bgcolor: alpha(muiTheme.palette.success.main, 0.03),
                  border: `1px solid ${alpha(muiTheme.palette.success.main, 0.08)}`,
                  '& .MuiAccordionSummary-content': {
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: muiTheme.palette.success.main,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                  }}
                >
                  {isHindi ? 'लघु त्योहार' : 'Minor Festivals'} ({festivalsByType.minor.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0.5, pt: 0.75, pb: 0.5 }}>
                {festivalsByType.minor.map((festival) => {
                  const matchedStory = findFestivalStoryByName(festival.name);
                  const canViewStory = !!matchedStory && !!onFestivalOpen;
                  const monthIndex = festival.month;
                  const monthName = monthIndex > 0
                    ? (isHindi ? monthNamesHindi[monthIndex] : monthNames[monthIndex])
                    : (isHindi ? 'प्रत्येक माह' : 'Every Month');

                  return (
                    <Box
                      key={festival.id}
                      onClick={() => {
                        if (canViewStory && matchedStory) {
                          triggerHapticIfSupported('light');
                          onFestivalOpen!(matchedStory.id);
                        }
                      }}
                      sx={{
                        mb: 0.75,
                        p: { xs: 1, sm: 1.25 },
                        borderRadius: 1.5,
                        bgcolor: muiTheme.palette.action.hover,
                        border: `1px solid ${muiTheme.palette.divider}`,
                        cursor: canViewStory ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        '&:hover': canViewStory ? {
                          bgcolor: muiTheme.palette.action.selected,
                        } : {},
                        '&:active': canViewStory ? {
                          transform: 'scale(0.98)',
                        } : {},
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5, gap: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                            flex: 1,
                            minWidth: 0,
                            lineHeight: 1.3,
                          }}
                        >
                          {festivalText(festival, currentLanguage, 'name')}
                        </Typography>
                        {canViewStory && (
                          <Chip
                            label={isHindi ? 'कहानी' : 'Story'}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.6rem',
                              fontWeight: 500,
                              bgcolor: alpha(muiTheme.palette.primary.main, 0.07),
                              color: muiTheme.palette.primary.main,
                              border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.15)}`,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>
                      {festival.description && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.4,
                            display: 'block',
                            mb: 0.75,
                          }}
                        >
                          {festival.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Chip
                          label={monthName}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: muiTheme.palette.action.selected,
                            color: muiTheme.palette.text.primary,
                          }}
                        />
                        <Chip
                          label={isHindi ? 'लघु' : 'Minor'}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: alpha(muiTheme.palette.success.main, 0.07),
                            color: muiTheme.palette.success.main,
                            border: `1px solid ${alpha(muiTheme.palette.success.main, 0.15)}`,
                          }}
                        />
                        {festival.region && festival.region.length > 0 && (
                          <Chip
                            label={festival.region[0]}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.6rem',
                              fontWeight: 500,
                              bgcolor: alpha(muiTheme.palette.info.main, 0.07),
                              color: muiTheme.palette.info.main,
                              border: `1px solid ${alpha(muiTheme.palette.info.main, 0.15)}`,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          )}

          {/* Regional Festivals */}
          {festivalsByType.regional.length > 0 && (
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                mb: 1.5,
                bgcolor: 'transparent',
                '&::before': { display: 'none' },
                boxShadow: 'none',
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={20} color={muiTheme.palette.info.main} />}
                sx={{
                  minHeight: 48,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1.5,
                  bgcolor: alpha(muiTheme.palette.info.main, 0.03),
                  border: `1px solid ${alpha(muiTheme.palette.info.main, 0.08)}`,
                  '& .MuiAccordionSummary-content': {
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: muiTheme.palette.info.main,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                  }}
                >
                  {isHindi ? 'क्षेत्रीय त्योहार' : 'Regional Festivals'} ({festivalsByType.regional.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0.5, pt: 0.75, pb: 0.5 }}>
                {festivalsByType.regional.map((festival) => {
                  const matchedStory = findFestivalStoryByName(festival.name);
                  const canViewStory = !!matchedStory && !!onFestivalOpen;
                  const monthIndex = festival.month;
                  const monthName = monthIndex > 0
                    ? (isHindi ? monthNamesHindi[monthIndex] : monthNames[monthIndex])
                    : (isHindi ? 'प्रत्येक माह' : 'Every Month');

                  return (
                    <Box
                      key={festival.id}
                      onClick={() => {
                        if (canViewStory && matchedStory) {
                          triggerHapticIfSupported('light');
                          onFestivalOpen!(matchedStory.id);
                        }
                      }}
                      sx={{
                        mb: 0.75,
                        p: { xs: 1, sm: 1.25 },
                        borderRadius: 1.5,
                        bgcolor: muiTheme.palette.action.hover,
                        border: `1px solid ${muiTheme.palette.divider}`,
                        cursor: canViewStory ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        '&:hover': canViewStory ? {
                          bgcolor: muiTheme.palette.action.selected,
                        } : {},
                        '&:active': canViewStory ? {
                          transform: 'scale(0.98)',
                        } : {},
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5, gap: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                            flex: 1,
                            minWidth: 0,
                            lineHeight: 1.3,
                          }}
                        >
                          {festivalText(festival, currentLanguage, 'name')}
                        </Typography>
                        {canViewStory && (
                          <Chip
                            label={isHindi ? 'कहानी' : 'Story'}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.6rem',
                              fontWeight: 500,
                              bgcolor: alpha(muiTheme.palette.primary.main, 0.07),
                              color: muiTheme.palette.primary.main,
                              border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.15)}`,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>
                      {festival.description && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.4,
                            display: 'block',
                            mb: 0.75,
                          }}
                        >
                          {festival.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        <Chip
                          label={monthName}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: muiTheme.palette.action.selected,
                            color: muiTheme.palette.text.primary,
                          }}
                        />
                        <Chip
                          label={isHindi ? 'क्षेत्रीय' : 'Regional'}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            bgcolor: alpha(muiTheme.palette.info.main, 0.08),
                            color: muiTheme.palette.info.main,
                            border: `1px solid ${alpha(muiTheme.palette.info.main, 0.19)}`,
                          }}
                        />
                        {festival.region && festival.region.length > 0 && (
                          <Chip
                            label={festival.region[0]}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.6rem',
                              fontWeight: 500,
                              bgcolor: alpha(muiTheme.palette.info.main, 0.07),
                              color: muiTheme.palette.info.main,
                              border: `1px solid ${alpha(muiTheme.palette.info.main, 0.15)}`,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      )}

      {/* Fasting Detail Dialog */}
      <Dialog
        open={fastingDialogOpen}
        onClose={handleFastingDialogClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 2 },
            bgcolor: 'background.paper',
          },
        }}
      >
        {selectedFasting && (
          <>
            <DialogTitle
              sx={{
                m: 0,
                p: 1.5,
                bgcolor: alpha(muiTheme.palette.primary.main, 0.03),
                borderBottom: `1px solid ${muiTheme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={20} color={muiTheme.palette.primary.main} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      component="span"
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                        letterSpacing: '-0.02em',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isHindi ? selectedFasting.nameHindi : selectedFasting.name}
                    </Typography>
                    <Chip
                      label={selectedFasting.type.charAt(0).toUpperCase() + selectedFasting.type.slice(1)}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        mt: 0.5,
                        bgcolor: alpha(muiTheme.palette.primary.main, 0.07),
                        color: muiTheme.palette.primary.main,
                        border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.15)}`,
                      }}
                    />
                  </Box>
                </Box>
                <IconButton
                  onClick={handleFastingDialogClose}
                  aria-label="close fasting details"
                  sx={{
                    width: 48,
                    height: 48,
                    color: 'text.secondary',
                    bgcolor: muiTheme.palette.action.hover,
                    '&:hover': {
                      bgcolor: muiTheme.palette.action.selected,
                    },
                  }}
                >
                  <X size={20} />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              {/* Deity */}
              <Box
                sx={{
                  mb: 1.5,
                  p: 1.25,
                  borderRadius: 1,
                  bgcolor: alpha(muiTheme.palette.info.main, 0.03),
                  border: `1px solid ${alpha(muiTheme.palette.info.main, 0.13)}`,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: 'info.main',
                    display: 'block',
                    mb: 0.5,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {isHindi ? 'अधिष्ठाता देवता' : 'Presiding Deity'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '1rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                  }}
                >
                  {isHindi ? selectedFasting.deityHindi : selectedFasting.deity}
                </Typography>
              </Box>

              {/* Significance */}
              <Box sx={{ mb: 1.75 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: 'primary.main',
                    display: 'block',
                    mb: 0.75,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {isHindi ? 'महत्व' : 'Significance'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    fontSize: '0.9rem',
                  }}
                >
                  {isHindi ? selectedFasting.significanceHindi : selectedFasting.significance}
                </Typography>
              </Box>

              {/* Benefits */}
              <Box sx={{ mb: 1.75 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: 'success.main',
                    display: 'block',
                    mb: 0.75,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {isHindi ? 'लाभ' : 'Benefits'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(isHindi ? selectedFasting.benefitsHindi : selectedFasting.benefits).map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        p: 0.75,
                        borderRadius: 1.5,
                        bgcolor: alpha(muiTheme.palette.success.main, 0.03),
                        border: `1px solid ${alpha(muiTheme.palette.success.main, 0.08)}`,
                        flex: '1 1 calc(50% - 6px)',
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: 'success.main',
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          fontSize: '0.8rem',
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {benefit}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Rules */}
              <Box sx={{ mb: 1.75 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: 'primary.main',
                    display: 'block',
                    mb: 0.75,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {isHindi ? 'व्रत के नियम' : 'Fasting Rules'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {(isHindi ? selectedFasting.rulesHindi : selectedFasting.rules).map((rule, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                        p: 0.75,
                        borderRadius: 1,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'primary.main',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          lineHeight: 1.4,
                          flexShrink: 0,
                          width: 18,
                          textAlign: 'center',
                        }}
                      >
                        {index + 1}.
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.8rem',
                          lineHeight: 1.5,
                          flex: 1,
                        }}
                      >
                        {rule}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Parana Time */}
              {selectedFasting.paranaTime && (
                <Box
                  sx={{
                    mb: 1,
                    p: 1.25,
                    borderRadius: 1,
                    bgcolor: alpha(muiTheme.palette.success.main, 0.07),
                    border: `1px solid ${alpha(muiTheme.palette.success.main, 0.15)}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: 'success.main',
                      display: 'block',
                      mb: 0.5,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {isHindi ? 'पारण का समय' : 'Parana Time (Fast Breaking)'}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.primary',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {isHindi ? selectedFasting.paranaTimeHindi : selectedFasting.paranaTime}
                  </Typography>
                </Box>
              )}

              {/* Special Notes */}
              {selectedFasting.specialNotes && (
                <Box
                  sx={{
                    p: 1.25,
                    borderRadius: 1,
                    bgcolor: alpha(muiTheme.palette.info.main, 0.03),
                    border: `1px solid ${alpha(muiTheme.palette.info.main, 0.13)}`,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: 'info.main',
                      display: 'block',
                      mb: 0.5,
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {isHindi ? 'विशेष नोट' : 'Special Notes'}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.primary',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {isHindi ? selectedFasting.specialNotesHindi : selectedFasting.specialNotes}
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Share Card Dialog */}
      <PanchangShareCard
        isOpen={showShareCard}
        onClose={() => setShowShareCard(false)}
        panchang={panchang}
        locationName={preferences.location.name ?? 'Unknown Location'}
      />
    </ScreenContainer>
  );
};

export default FastsScreen;
