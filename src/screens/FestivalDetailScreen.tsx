/**
 * FestivalDetailScreen - Comprehensive Festival Detail Page
 *
 * Features:
 * - Hero section with festival name (EN/HI), emoji icon, date
 * - Significance & story section
 * - Rituals & observances
 * - Regional variations
 * - Fasting rules (if applicable)
 * - Next occurrence date with countdown
 * - Share button
 * - Beautiful card-based layout
 * - Dark mode support
 * - Responsive design
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Paper,
  Button,
  useTheme as useMuiTheme,
  Fade,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  ArrowBack,
  Share,
  CalendarMonth,
  Timer,
  LocationOn,
  BookmarkBorder,
  Bookmark,
  Info,
  Restaurant,
  Public,
  Celebration,
  ChevronRight,
  AutoStories,
} from '@mui/icons-material';
import { Share2 } from 'lucide-react';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionCard as LayoutSectionCard } from '../components/layout/SectionCard';
import { useI18n } from '../hooks/useI18n';
import { getFestivalStory, FESTIVAL_STORIES, findFestivalStoryByName, FestivalStory } from '../data/festivalStories';
import { getFestivalById, festivalText } from '../data/festivals';
import { findNextOccurrence } from '../data/observances';
import type { ObservanceRule } from '../data/observances/types';
import { FestivalShareCard } from '../components/FestivalShareCard';

// ============================================================================
// PROPS INTERFACE
// ============================================================================

export interface FestivalDetailScreenProps {
  /** Festival ID or name to display. Can be id (e.g. 'diwali'), English name, or Hindi name. */
  festivalId?: string;
  /** Optional festival story object. If provided, skips lookup by festivalId. */
  festivalStory?: FestivalStory;
  /** Callback when user navigates back */
  onBack?: () => void;
}

// ============================================================================
// COUNTDOWN TIMER COMPONENT
// ============================================================================

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [now, setNow] = useState(new Date());
  const theme = useMuiTheme();
  const isDark = theme.palette.mode === 'dark';

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = useMemo(() => {
    const total = targetDate.getTime() - now.getTime();
    if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, total };
  }, [now, targetDate]);

  const formatUnit = (value: number, label: string): React.ReactNode => (
    <Box
      sx={{
        textAlign: 'center',
        px: { xs: 0.75, sm: 2 },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 500,
          color: isDark ? theme.palette.primary.light : theme.palette.primary.main,
          
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
        }}
      >
        {String(value).padStart(2, '0')}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.75rem' },
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  if (getTimeRemaining.total <= 0) {
    return (
      <Typography
        variant="h6"
        sx={{
          color: 'success.main',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        The festival is today!
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 0.5, sm: 1 },
        py: { xs: 1.5, sm: 2 },
        flexWrap: 'wrap',
      }}
    >
      {formatUnit(getTimeRemaining.days, 'Days')}
      <Typography variant="h4" sx={{ color: 'text.disabled', px: 0.5 }}>:</Typography>
      {formatUnit(getTimeRemaining.hours, 'Hours')}
      <Typography variant="h4" sx={{ color: 'text.disabled', px: 0.5 }}>:</Typography>
      {formatUnit(getTimeRemaining.minutes, 'Min')}
      <Typography variant="h4" sx={{ color: 'text.disabled', px: 0.5 }}>:</Typography>
      {formatUnit(getTimeRemaining.seconds, 'Sec')}
    </Box>
  );
};

// ============================================================================
// SECTION CARD COMPONENT
// ============================================================================

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  sx?: Record<string, unknown>;
}

const SectionCard = React.forwardRef<HTMLDivElement, SectionCardProps>(({ icon, title, children, sx = {} }, ref) => {
  const theme = useMuiTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      ref={ref}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mb: 3,
        boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)',
        ...sx,
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2, md: 3.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, mb: { xs: 2, sm: 2.5 }, flexWrap: 'wrap' }}>
          <Box
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: 1,
              bgcolor: isDark
                ? alpha(theme.palette.primary.light, 0.12)
                : alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              
              color: theme.palette.text.primary,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              wordBreak: 'break-word',
            }}
          >
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
});

// ============================================================================
// NEXT-OCCURRENCE RESOLUTION (engine-computed, no hardcoded dates)
// ============================================================================

/**
 * Resolve a festival story to an ObservanceRule for next-occurrence scanning.
 * Stories backed by festivals.ts reuse its month/paksha/tithiNumber
 * convention; registry-covered stories without a festivals.ts row
 * (makar-sankranti, dhanteras, bhai-dooj) map to explicit rules.
 * Returns null for stories with no computable rule — callers must show
 * graceful fallback text, never today-as-fake-date.
 */
function getRuleForFestivalStory(storyId: string): ObservanceRule | null {
  if (storyId === 'makar-sankranti') {
    return { kind: 'solar-ingress', rashiIndex: 9 };
  }
  if (storyId === 'dhanteras') {
    return { kind: 'tithi', month: 8, paksha: 'Krishna', tithiNumber: 13 };
  }
  if (storyId === 'bhai-dooj') {
    return { kind: 'tithi', month: 8, paksha: 'Shukla', tithiNumber: 2 };
  }
  const festival = getFestivalById(storyId);
  if (!festival) return null;
  if (festival.month === 0) {
    // Every-month observance (e.g. Sankashti convention): no month filter.
    return { kind: 'tithi', paksha: festival.paksha, tithiNumber: festival.tithiNumber };
  }
  return {
    kind: 'tithi',
    month: festival.month,
    paksha: festival.paksha,
    tithiNumber: festival.tithiNumber,
  };
}

// ============================================================================
// PUJA MUHURAT DISPLAY BLOCK (vyapti moment from festivals.ts)
// ============================================================================

/**
 * Observance-moment (vyapti) note for festivals whose shastra prescribes a
 * moment other than sunrise: Lakshmi Puja at sunset, Bhai Dooj in the
 * afternoon, Karva Chauth's fast ending at moonrise, and so on. Returns null
 * for Udaya-based festivals (no special muhurat to display).
 */
function getVyaptiNote(storyId: string): { en: string; hi: string } | null {
  const festival = getFestivalById(storyId);
  if (!festival || !festival.vyapti || festival.vyapti === 'udaya') return null;
  switch (festival.vyapti) {
    case 'pradosh':
      return {
        en: 'Observed in Pradosh Kaal — after sunset, while the tithi prevails.',
        hi: 'प्रदोष काल में — सूर्यास्त के बाद, तिथि व्याप्त होने पर मनाया जाता है।',
      };
    case 'madhyahna':
      return {
        en: 'Observed at midday (Madhyahna), while the tithi prevails.',
        hi: 'मध्याह्न में, तिथि व्याप्त होने पर मनाया जाता है।',
      };
    case 'nishita':
      return {
        en: 'Observed at midnight (Nishita Kaal), while the tithi prevails.',
        hi: 'मध्यरात्रि (निशिता काल) में, तिथि व्याप्त होने पर मनाया जाता है।',
      };
    case 'aparahna':
      return {
        en: 'Observed in the afternoon (Aparahna), while the tithi prevails.',
        hi: 'अपराह्न काल में, तिथि व्याप्त होने पर मनाया जाता है।',
      };
    case 'moonrise':
      return {
        en: 'Observed on the Udaya-tithi day; the fast ends at moonrise.',
        hi: 'उदया तिथि के दिन व्रत; चंद्रोदय पर पारण होता है।',
      };
    default:
      return null;
  }
}

// ============================================================================
// FESTIVAL DETAIL SCREEN
// ============================================================================

export const FestivalDetailScreen: React.FC<FestivalDetailScreenProps> = ({
  festivalId,
  festivalStory,
  onBack,
}) => {
  const theme = useMuiTheme();
  const isDark = theme.palette.mode === 'dark';
  const { currentLanguage } = useI18n();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  const festival = useMemo(() => {
    // If festival story is passed as prop, use it directly
    if (festivalStory) return festivalStory;
    // Otherwise look up by festivalId
    if (festivalId) {
      return getFestivalStory(festivalId) || findFestivalStoryByName(festivalId);
    }
    return undefined;
  }, [festivalId, festivalStory]);

  const nextOccurrence = useMemo(() => {
    if (!festival) return null;

    // Engine-computed next occurrence (≤400-day forward scan over the
    // Udaya-tithi Panchang). Null when the story has no computable rule —
    // UI shows fallback text instead of a fake date.
    const rule = getRuleForFestivalStory(festival.id);
    if (!rule) return null;
    return findNextOccurrence(rule, new Date());
  }, [festival]);

  const vyaptiNote = useMemo(() => {
    if (!festival) return null;
    return getVyaptiNote(festival.id);
  }, [festival]);

  const festivalData = useMemo(() => {
    if (!festival) return undefined;
    return getFestivalById(festival.id);
  }, [festival]);

  const formatDate = useCallback((date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const handleShare = useCallback(() => {
    if (!festival) return;
    const shareText = `${festival.emoji} ${festival.name} (${festival.nameHindi})\n\n${festival.significance}`;
    if (navigator.share) {
      navigator.share({
        title: festival.name,
        text: shareText,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        // Could show a toast here
      }).catch(() => {});
    }
  }, [festival]);

  const handleOpenShare = useCallback(() => {
    setShowShareCard(true);
  }, []);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(prev => !prev);
  }, []);

  if (!festival) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3 }}>
          Festival not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => onBack?.()}
          startIcon={<ArrowBack />}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const isHindi = currentLanguage === 'hi';

  // Localized text from festivals.ts i18n (hi/sa/kn/te/ta), English fallback.
  // detailLang resolves to currentLanguage only when i18n[lang] exists.
  const detailLang = (festivalData?.i18n as Record<string, unknown> | undefined)?.[currentLanguage]
    ? currentLanguage
    : 'en';
  // festivals.ts translations take precedence for non-English languages;
  // English keeps the story fields (unchanged legacy behavior).
  const useDetailText = !!festivalData && detailLang !== 'en';
  const detailName = useDetailText
    ? (festivalText(festivalData!, detailLang, 'name') as string)
    : festival.name;
  const detailSubtitle = currentLanguage === 'en'
    ? festival.nameHindi
    : (festivalData?.name ?? festival.name);
  const detailSignificance = useDetailText
    ? (festivalText(festivalData!, detailLang, 'significance') as string)
    : (isHindi ? festival.significanceHindi : festival.significance);
  const detailDeity = festivalData
    ? (festivalText(festivalData, detailLang, 'deity') as string | undefined)
    : undefined;
  const detailRituals = festivalData
    ? ((festivalText(festivalData, detailLang, 'rituals') as string[] | undefined) ?? [])
    : [];
  const storyRituals = (isHindi ? festival.ritualsHindi : festival.rituals) ?? [];
  const displayedRituals = (useDetailText && detailRituals.length > 0)
    ? detailRituals
    : (storyRituals.length > 0 ? storyRituals : detailRituals);

  return (
    <ScreenContainer
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        pb: 6,
        pt: 0,
      }}
    >
      {/* ================================================================== */}
      {/* HEADER / NAVIGATION */}
      {/* ================================================================== */}
      <Box
        sx={{
          position: 'sticky',
          // Token-derived: clears the AppBar Toolbar (minHeight = spacing(7)).
          top: (theme) => theme.spacing(7),
          zIndex: 100,
          backdropFilter: 'blur(12px)',
          background: isDark ? alpha(theme.palette.background.paper, 0.9) : alpha(theme.palette.common.white, 0.9),
          borderBottom: `1px solid ${isDark ? alpha(theme.palette.primary.light, 0.1) : alpha(theme.palette.primary.main, 0.08)}`,
          px: { xs: 1.5, sm: 4 },
          py: { xs: 1, sm: 1.5 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Breadcrumbs
            separator={<ChevronRight sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.disabled' }} />}
            sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' }, flex: 1, minWidth: 0 }}
          >
            <Link
              component="button"
              variant="body2"
              onClick={() => onBack?.()}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Festivals
            </Link>
            <Typography variant="body2" sx={{ color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {detailName}
            </Typography>
          </Breadcrumbs>
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            <IconButton
              onClick={handleBookmark}
              size="small"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark festival'}
              sx={{ color: isBookmarked ? 'warning.main' : 'text.secondary', minWidth: 48, minHeight: 48 }}
            >
              {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
            <IconButton
              onClick={handleShare}
              size="small"
              aria-label="Share festival"
              sx={{ color: 'text.secondary', minWidth: 48, minHeight: 48 }}
            >
              <Share />
            </IconButton>
            <IconButton
              onClick={handleOpenShare}
              size="small"
              sx={{ color: 'text.secondary', minWidth: 48, minHeight: 48 }}
              aria-label="Share festival card"
            >
              <Share2 size={20} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Single measure system: ScreenContainer owns width; no nested Container. */}
      <Box sx={{ width: '100%' }}>
        {/* ================================================================== */}
        {/* HERO SECTION */}
        {/* ================================================================== */}
        <Fade in timeout={600}>
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 4, sm: 5, md: 7 },
              px: { xs: 1.5, sm: 4 },
            }}
          >
            {/* Festival Emoji */}
            <Box
              sx={{
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                animation: 'pulse 3s ease-in-out infinite',
              }}
            >
              {festival.emoji}
            </Box>

            {/* Festival Name */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 500,
                
                color: 'primary.main',
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                mb: 1,
                lineHeight: 1.2,
                wordBreak: 'break-word',
              }}
            >
              {detailName}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                
                color: theme.palette.text.secondary,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                mb: 3,
              }}
            >
              {detailSubtitle}
            </Typography>

            {/* Presiding deity (festivals.ts i18n, English fallback) */}
            {detailDeity && (
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  mb: 3,
                }}
              >
                Deity: {detailDeity}
              </Typography>
            )}

            {/* Date Chip */}
            <Chip
              icon={<CalendarMonth />}
              label={nextOccurrence ? formatDate(nextOccurrence) : 'Date varies with the lunar calendar'}
              sx={{
                px: { xs: 1.5, sm: 2 },
                py: { xs: 2, sm: 3 },
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                fontWeight: 500,
                borderRadius: 1,
                background: isDark
                  ? alpha(theme.palette.info.main, 0.2)
                  : alpha(theme.palette.info.main, 0.08),
                color: theme.palette.secondary.main,
                border: `1px solid ${isDark ? alpha(theme.palette.info.main, 0.3) : alpha(theme.palette.info.main, 0.15)}`,
                mb: 3,
                maxWidth: '100%',
              }}
            />

            {/* Duration & Colors */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 0.75, sm: 1 },
                justifyContent: 'center',
                mb: 2,
                px: 1,
              }}
            >
              {festival.duration && (
                <Chip
                  icon={<Celebration />}
                  label={isHindi ? festival.durationHindi || festival.duration : festival.duration}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    background: isDark
                      ? alpha(theme.palette.success.main, 0.15)
                      : alpha(theme.palette.success.main, 0.1),
                    color: theme.palette.success.main,
                    border: `1px solid ${isDark ? alpha(theme.palette.success.main, 0.25) : alpha(theme.palette.success.main, 0.2)}`,
                  }}
                />
              )}
              {festival.colors?.map((color) => (
                <Chip
                  key={color}
                  label={color}
                  size="small"
                  sx={{
                    borderRadius: 1,
                    background: isDark
                      ? alpha(theme.palette.primary.light, 0.1)
                      : alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.warning.main,
                    border: `1px solid ${isDark ? alpha(theme.palette.primary.light, 0.2) : alpha(theme.palette.primary.main, 0.15)}`,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Fade>

        {/* ================================================================== */}
        {/* COUNTDOWN SECTION */}
        {/* ================================================================== */}
        <Fade in timeout={800}>
          <LayoutSectionCard
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Timer sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    minWidth: 0,
                  }}
                >
                  Next {detailName}
                </Typography>
              </Box>
            }
          >
              {nextOccurrence ? (
                <CountdownTimer targetDate={nextOccurrence} />
              ) : (
                <Typography
                  sx={{
                    color: 'text.secondary',
                    textAlign: 'center',
                    py: 2,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  This observance follows the lunar calendar — see the Calendar screen for its next date.
                </Typography>
              )}
          </LayoutSectionCard>
        </Fade>

        {/* ================================================================== */}
        {/* PUJA MUHURAT (vyapti moment — only for non-Udaya festivals) */}
        {/* ================================================================== */}
        {vyaptiNote && (
          <Fade in timeout={900}>
            <SectionCard icon={<Timer sx={{ color: theme.palette.primary.light }} />} title={isHindi ? 'पूजा मुहूर्त' : 'Puja Muhurat'}>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                }}
              >
                {isHindi ? vyaptiNote.hi : vyaptiNote.en}
              </Typography>
            </SectionCard>
          </Fade>
        )}

        {/* ================================================================== */}
        {/* SIGNIFICANCE SECTION */}
        {/* ================================================================== */}
        <Fade in timeout={1000}>
          <SectionCard icon={<Info sx={{ color: theme.palette.primary.light }} />} title="Significance">
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.8,
                fontSize: { xs: '0.95rem', sm: '1rem' },
              }}
            >
              {detailSignificance}
            </Typography>
          </SectionCard>
        </Fade>

        {/* ================================================================== */}
        {/* STORY SECTION */}
        {/* ================================================================== */}
        <Fade in timeout={1100}>
          <SectionCard
            icon={<AutoStories sx={{ color: theme.palette.primary.light }} />}
            title="Story & Legend"
          >
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.8,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                whiteSpace: 'pre-line',
              }}
            >
              {isHindi ? festival.storyHindi : festival.story}
            </Typography>
          </SectionCard>
        </Fade>

        {/* ================================================================== */}
        {/* RITUALS & OBSERVANCES (festivals.ts i18n first, story fallback) */}
        {/* ================================================================== */}
        {displayedRituals.length > 0 && (
        <Fade in timeout={1200}>
          <SectionCard
            icon={<Restaurant sx={{ color: theme.palette.primary.light }} />}
            title="Rituals & Observances"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {displayedRituals.map((ritual, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: { xs: 1, sm: 1.5 },
                    p: { xs: 1.25, sm: 1.5 },
                    borderRadius: 1,
                    background: isDark
                      ? alpha(theme.palette.primary.light, 0.05)
                      : alpha(theme.palette.primary.main, 0.03),
                    transition: 'background 0.2s ease',
                    '&:hover': {
                      background: isDark
                        ? alpha(theme.palette.primary.light, 0.1)
                        : alpha(theme.palette.primary.main, 0.06),
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 24, sm: 28 },
                      height: { xs: 24, sm: 28 },
                      minWidth: { xs: 24, sm: 28 },
                      borderRadius: '50%',
                      bgcolor: isDark
                        ? alpha(theme.palette.primary.light, 0.12)
                        : alpha(theme.palette.primary.main, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 0.25,
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: '0.6rem', sm: '0.7rem' },
                        color: theme.palette.warning.main,
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6,
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                    }}
                  >
                    {ritual}
                  </Typography>
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Fade>
        )}

        {/* ================================================================== */}
        {/* FASTING RULES */}
        {/* ================================================================== */}
        {festival.fastingRules && festival.fastingRules.length > 0 && (
          <Fade in timeout={1300}>
            <SectionCard
              icon={<Info sx={{ color: theme.palette.primary.light }} />}
              title="Fasting Rules"
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(isHindi ? (festival.fastingRulesHindi || festival.fastingRules) : festival.fastingRules).map((rule, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 1,
                      background: isDark
                        ? alpha(theme.palette.success.main, 0.08)
                        : alpha(theme.palette.success.main, 0.04),
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        minWidth: 6,
                        borderRadius: '50%',
                        background: theme.palette.success.main,
                        mt: 0.5,
                      }}
                    />
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                        fontSize: { xs: '0.9rem', sm: '0.95rem' },
                      }}
                    >
                      {rule}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </SectionCard>
          </Fade>
        )}

        {/* ================================================================== */}
        {/* REGIONAL VARIATIONS */}
        {/* ================================================================== */}
        <Fade in timeout={1400}>
          <SectionCard
            icon={<Public sx={{ color: theme.palette.primary.light }} />}
            title="Regional Variations"
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {festival.regionalVariations.map((variation, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: { xs: 1.5, sm: 2, md: 2.5 },
                    borderRadius: 1,
                    background: isDark
                      ? alpha(theme.palette.info.main, 0.1)
                      : alpha(theme.palette.info.main, 0.04),
                    border: `1px solid ${isDark ? alpha(theme.palette.info.main, 0.2) : alpha(theme.palette.info.main, 0.1)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: isDark
                        ? alpha(theme.palette.info.main, 0.15)
                        : alpha(theme.palette.info.main, 0.07),
                      transform: { xs: 'none', sm: 'translateY(-1px)' },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1 }, mb: { xs: 1, sm: 1.5 }, flexWrap: 'wrap' }}>
                    <LocationOn
                      sx={{
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        color: theme.palette.secondary.main,
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    >
                      {isHindi ? variation.regionHindi : variation.region}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      lineHeight: 1.7,
                      fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                    }}
                  >
                    {isHindi ? variation.variationHindi : variation.variation}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </SectionCard>
        </Fade>

        {/* ================================================================== */}
        {/* SHARE / ACTION BUTTONS */}
        {/* ================================================================== */}
        <Fade in timeout={1500}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              mt: 4,
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleShare}
              startIcon={<Share />}
              fullWidth
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 1,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                bgcolor: 'primary.main',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  boxShadow: 'none',
                },
              }}
            >
              Share {festival.name}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleBookmark}
              startIcon={isBookmarked ? <Bookmark /> : <BookmarkBorder />}
              fullWidth
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 1,
                fontSize: '1rem',
                fontWeight: 500,
                textTransform: 'none',
                borderColor: isDark ? alpha(theme.palette.primary.light, 0.3) : alpha(theme.palette.primary.main, 0.3),
                color: theme.palette.warning.main,
                '&:hover': {
                  borderColor: isDark ? alpha(theme.palette.primary.light, 0.5) : alpha(theme.palette.primary.main, 0.5),
                  background: isDark
                    ? alpha(theme.palette.primary.light, 0.1)
                    : alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              {isBookmarked ? 'Saved' : 'Save for Later'}
            </Button>
          </Box>
        </Fade>

        {/* ================================================================== */}
        {/* FOOTER - ALL FESTIVALS LINK */}
        {/* ================================================================== */}
        <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
          <Button
            variant="text"
            onClick={() => onBack?.()}
            startIcon={<ArrowBack />}
            sx={{
              color: theme.palette.text.secondary,
              textTransform: 'none',
              fontSize: '0.9rem',
            }}
          >
            Back to All Festivals
          </Button>
        </Box>
      </Box>

      {/* Global animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* Festival Share Card Dialog */}
      <FestivalShareCard
        isOpen={showShareCard}
        onClose={() => setShowShareCard(false)}
        festival={festival}
      />
    </ScreenContainer>
  );
};

export default FestivalDetailScreen;
