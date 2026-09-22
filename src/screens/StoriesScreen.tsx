/**
 * StoriesScreen - Daily spiritual stories & wisdom feed
 * Shows tithi meaning, nakshatra wisdom, muhurta highlights, and daily inspiration
 */

import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Fade,
  Zoom,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionCard } from '../components/layout/SectionCard';
import { Share2, Moon, Sun, Star, BookOpen, Sunrise, Sunset, Flame } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useI18n } from '../hooks/useI18n';
import { getDailyVerse, VerseData } from '../services/verseApi';

// Tithi meanings — colors use MUI palette slot names resolved at render time
// Slots are checked for WCAG AA against the canvas token in both modes
type PaletteSlot = 'primary.main' | 'primary.light' | 'primary.dark' | 'secondary.main' | 'info.main' | 'error.main' | 'text.secondary';

const TITHI_MEANINGS: Record<number, { meaning: string; significance: string; paletteSlot: PaletteSlot }> = {
  1: { meaning: 'Pratipada — New Beginnings', significance: 'Ideal for starting new ventures, worship of Brahma, and planting seeds of intention.', paletteSlot: 'primary.main' },
  2: { meaning: 'Dwitiya — Duality & Balance', significance: 'Good for partnerships, trade, and creative expression. The divine feminine is honored.', paletteSlot: 'secondary.main' },
  3: { meaning: 'Tritiya — Growth & Action', significance: 'Auspicious for most activities. Associated with goddess Gauri, beauty, and abundance.', paletteSlot: 'primary.main' },
  4: { meaning: 'Chaturthi — Obstacles Removed', significance: 'Sacred to Lord Ganesha. Clear obstacles, begin important tasks after prayer.', paletteSlot: 'primary.dark' },
  5: { meaning: 'Panchami — Wisdom & Serpents', significance: 'Day of Naga Panchami significance. Good for learning, wisdom, and healing.', paletteSlot: 'info.main' },
  6: { meaning: 'Shashthi — Vitality & Children', significance: 'Associated with Skanda/Murugan. Blessings for children, health, and victory.', paletteSlot: 'secondary.main' },
  7: { meaning: 'Saptami — Sun & Radiance', significance: 'Day of the Sun god. Excellent for health, authority, and spiritual practices.', paletteSlot: 'primary.light' },
  8: { meaning: 'Ashtami — Durga & Strength', significance: 'Sacred to Goddess Durga. Powerful day for protection, courage, and transformation.', paletteSlot: 'error.main' },
  9: { meaning: 'Navami — Divine Mother', significance: 'Associated with Goddess Shakti. Ideal for worship, healing, and new endeavors.', paletteSlot: 'primary.main' },
  10: { meaning: 'Dashami — Victory & Dharma', significance: 'Day of Dharma. Good for legal matters, travel, and acts of service.', paletteSlot: 'secondary.main' },
  11: { meaning: 'Ekadashi — Fasting & Liberation', significance: 'Most sacred tithi. Fasting brings spiritual merit. Worship Vishnu for liberation.', paletteSlot: 'info.main' },
  12: { meaning: 'Dwadashi — Vishnu & Prosperity', significance: 'Day after Ekadashi fast breaking. Associated with Lord Vishnu and spiritual completion.', paletteSlot: 'info.main' },
  13: { meaning: 'Trayodashi — Shiva & Austerity', significance: 'Pradosh tithi — sacred to Lord Shiva. Evening prayers are especially powerful.', paletteSlot: 'text.secondary' },
  14: { meaning: 'Chaturdashi — Ancestors & Transition', significance: 'Associated with Shiva and the ancestors. Good for remembrance and letting go.', paletteSlot: 'primary.dark' },
  15: { meaning: 'Purnima / Amavasya — Full / New Moon', significance: 'Powerful lunar peak. Meditate, offer gratitude, and set intentions for the cycle ahead.', paletteSlot: 'primary.main' },
};

const NAKSHATRA_WISDOM: Record<number, string> = {
  1: 'Ashwini — ruled by the Ashwini Kumaras, divine healers. A day of swift beginnings and vitality.',
  2: 'Bharani — ruled by Yama, lord of dharma. A day for discipline, transformation, and deep truths.',
  3: 'Krittika — ruled by Agni, the sacred fire. Purification, courage, and illumination are supported.',
  4: 'Rohini — ruled by Brahma, the creator. Creativity, beauty, and abundance flow naturally today.',
  5: 'Mrigashira — ruled by Soma, the moon. A gentle day for seeking, curiosity, and renewal.',
  6: 'Ardra — ruled by Rudra. Storms bring transformation. Release what no longer serves.',
  7: 'Punarvasu — ruled by Aditi. Return to light after darkness. Restoration and renewal.',
  8: 'Pushya — ruled by Brihaspati (Jupiter). Most auspicious nakshatra for beginnings and nourishment.',
  9: 'Ashlesha — ruled by Nagas. Wisdom, healing, and intuition are heightened. Trust inner knowing.',
  10: 'Magha — ruled by Pitrus (ancestors). Honor your lineage and elders. Dignity and leadership.',
  11: 'Purva Phalguni — ruled by Bhaga. Joy, pleasure, and creative expression are favored.',
  12: 'Uttara Phalguni — ruled by Aryaman. Long-term commitments and partnerships are blessed.',
  13: 'Hasta — ruled by Savitar. Skilled handwork, healing touch, and craftsmanship excel.',
  14: 'Chitra — ruled by Vishwakarma. Artistic creation, design, and jewel-like beauty shine.',
  15: 'Swati — ruled by Vayu. Independence, learning, and flexible movement are supported.',
  16: 'Vishakha — ruled by Indra and Agni. Goal-oriented action with determination and fire.',
  17: 'Anuradha — ruled by Mitra. Friendship, devotion, and loyal partnerships are highlighted.',
  18: 'Jyeshtha — ruled by Indra. Courage, authority, and protection of the vulnerable.',
  19: 'Mula — ruled by Nirriti. Deep roots, ancestral wisdom, and fundamental truths emerge.',
  20: 'Purva Ashadha — ruled by Apas (water). Purification, cleansing, and refreshing new starts.',
  21: 'Uttara Ashadha — ruled by Vishwedevas. Lasting victory through righteousness and patience.',
  22: 'Shravana — ruled by Vishnu. Listening deeply, learning, and spiritual transmission.',
  23: 'Dhanishtha — ruled by the Vasus. Abundance, music, and collective celebration.',
  24: 'Shatabhisha — ruled by Varuna. Healing, hidden knowledge, and mystical understanding.',
  25: 'Purva Bhadrapada — ruled by Aja Ekapad. Transformation through fire and purification.',
  26: "Uttara Bhadrapada — ruled by Ahirbudhnya. Depth, patience, and the cosmic serpent's wisdom.",
  27: 'Revati — ruled by Pushan. Safe journeys, nourishment, completion, and spiritual prosperity.',
};

const StoriesScreen: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useI18n();
  const { calculatePanchang, selectedDate } = useAppStore();

  // Resolve a palette slot path (e.g. 'primary.main') to its current hex value
  const resolveColor = (slot: PaletteSlot): string => {
    const [group, variant] = slot.split('.') as [string, string];
    const paletteGroup = (theme.palette as any)[group];
    return paletteGroup?.[variant] ?? theme.palette.primary.main;
  };

  const panchang = useMemo(() => calculatePanchang(selectedDate), [calculatePanchang, selectedDate]);

  const tithiInfo = panchang?.tithi ? TITHI_MEANINGS[panchang.tithi.number] || TITHI_MEANINGS[1] : TITHI_MEANINGS[1];
  const tithiColor = resolveColor(tithiInfo.paletteSlot);
  const nakshatraInfo = panchang?.nakshatra ? NAKSHATRA_WISDOM[panchang.nakshatra.number] || NAKSHATRA_WISDOM[1] : NAKSHATRA_WISDOM[1];

  // Get today's verse from verse service (changes daily)
  const todayVerse = getDailyVerse();

  const handleShare = async (text: string) => {
    if (navigator.share) {
      await navigator.share({ text, title: 'VedaTime — Sacred Rhythms' });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <ScreenContainer sx={{ pt: 2.5 }}>
      {/* Header */}
      <Fade in timeout={200}>
        <Box sx={{ mb: 3, textAlign: 'center', px: { xs: 1, sm: 2 } }}>
        <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          {t('stories.title') || 'Daily Wisdom'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Typography>
        </Box>
      </Fade>

      {/* Card 1: Tithi */}
      {panchang?.tithi && (
        <Zoom in timeout={300}>
        <SectionCard
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Moon size={16} color={tithiColor} />
              <Typography variant="overline" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: tithiColor, lineHeight: 1 }}>
                {t('stories.tithiMeaning') || "Today's Tithi"}
              </Typography>
            </Box>
          }
          action={
            <IconButton size="small" aria-label="Share tithi wisdom" onClick={() => handleShare(`Today's Tithi: ${panchang.tithi.name} (${panchang.tithi.paksha} Paksha)\n${tithiInfo.significance}`)} sx={{ minWidth: 48, minHeight: 48 }}>
              <Share2 size={20} color={theme.palette.text.secondary} />
            </IconButton>
          }
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
              <Box sx={{
                width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 }, borderRadius: 1, flexShrink: 0,
                bgcolor: alpha(tithiColor, 0.08),
                border: `1px solid ${alpha(tithiColor, 0.19)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{ display: 'flex', lineHeight: 1 }}>
                  <Moon size={20} color={tithiColor} />
                </Typography>
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.primary', letterSpacing: '-0.02em', mb: 0.25, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                  {panchang.tithi.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  {panchang.tithi.nameHindi}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={panchang.tithi.paksha === 'Shukla' ? 'Shukla Paksha' : 'Krishna Paksha'} size="small"
                sx={{ height: 24, borderRadius: 1.5, fontSize: '0.7rem', fontWeight: 500,
                  bgcolor: alpha(tithiColor, 0.07), color: tithiColor,
                  border: `1px solid ${alpha(tithiColor, 0.15)}` }} />
              <Chip label={`Tithi ${panchang.tithi.number}`} size="small" variant="outlined"
                sx={{ height: 24, borderRadius: 1.5, fontSize: '0.7rem', fontWeight: 500,
                  borderColor: isDark ? alpha(theme.palette.common.white, 0.15) : alpha(theme.palette.common.black, 0.1), color: 'text.secondary' }} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: tithiColor, mb: 0.75, fontSize: '0.875rem' }}>
              {tithiInfo.meaning}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.875rem' }}>
              {tithiInfo.significance}
            </Typography>
        </SectionCard>
        </Zoom>
      )}

      {/* Card 2: Nakshatra */}
      {panchang?.nakshatra && (
        <Fade in timeout={400}>
        <SectionCard
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star size={16} color={theme.palette.info.main} />
              <Typography variant="overline" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'info.main', lineHeight: 1 }}>
                {t('stories.nakshatraWisdom') || "Nakshatra of the Day"}
              </Typography>
            </Box>
          }
          action={
            <IconButton size="small" aria-label="Share nakshatra wisdom" onClick={() => handleShare(`Today's Nakshatra: ${panchang.nakshatra.name}\n${nakshatraInfo}`)} sx={{ minWidth: 48, minHeight: 48 }}>
              <Share2 size={20} color={theme.palette.text.secondary} />
            </IconButton>
          }
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
              <Box sx={{
                width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 }, borderRadius: 1, flexShrink: 0,
                bgcolor: isDark ? alpha(theme.palette.info.main, 0.25) : alpha(theme.palette.info.main, 0.1),
                border: `1px solid ${alpha(theme.palette.info.main, 0.25)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{ display: 'flex', lineHeight: 1 }}>
                  <Star size={20} color={theme.palette.info.main} />
                </Typography>
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.primary', letterSpacing: '-0.02em', mb: 0.25, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                  {panchang.nakshatra.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Ruler: {panchang.nakshatra.ruler} · #{panchang.nakshatra.number} of 27
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.875rem' }}>
              {nakshatraInfo}
            </Typography>
        </SectionCard>
        </Fade>
      )}

      {/* Card 3: Festival (only if present) */}
      {panchang?.festivals && panchang.festivals.length > 0 && (
        <Fade in timeout={500}>
        <SectionCard
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Sun size={16} color={theme.palette.secondary.main} />
              <Typography variant="overline" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'secondary.main', lineHeight: 1 }}>
                {t('stories.sacredDay') || "Sacred Day"}
              </Typography>
            </Box>
          }
          action={
            <IconButton size="small" aria-label="Share sacred day" onClick={() => handleShare(`Today: ${panchang.festivals[0].name}\n${panchang.festivals[0].significance}`)} sx={{ minWidth: 48, minHeight: 48 }}>
              <Share2 size={20} color={theme.palette.text.secondary} />
            </IconButton>
          }
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
              <Box sx={{
                width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 }, borderRadius: 1, flexShrink: 0,
                bgcolor: isDark ? alpha(theme.palette.secondary.main, 0.25) : alpha(theme.palette.secondary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.25)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{ display: 'flex', lineHeight: 1 }}>
                  <Flame size={20} color={theme.palette.secondary.main} />
                </Typography>
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.primary', letterSpacing: '-0.02em', mb: 0.25, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                  {panchang.festivals[0].name}
                </Typography>
                {panchang.festivals[0].type && (
                  <Chip label={panchang.festivals[0].type} size="small"
                    sx={{ height: 22, borderRadius: 1.5, fontSize: '0.68rem', fontWeight: 500,
                      bgcolor: isDark ? alpha(theme.palette.secondary.main, 0.25) : alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main',
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.25)}` }} />
                )}
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.875rem' }}>
              {panchang.festivals[0].significance || 'A sacred day celebrated with devotion, prayer, and community gathering.'}
            </Typography>
        </SectionCard>
        </Fade>
      )}

      {/* Card 4: Daily Verse */}
      <Fade in timeout={600}>
      <SectionCard
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookOpen size={16} color={theme.palette.primary.main} />
            <Typography variant="overline" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'primary.main', lineHeight: 1 }}>
              {t('stories.todaysVerse') || "Today's Verse"}
            </Typography>
          </Box>
        }
        action={
          <IconButton size="small" aria-label="Share verse" onClick={() => handleShare(`${todayVerse.sanskrit}\n\n${todayVerse.translation}\n— ${todayVerse.source}`)} sx={{ minWidth: 48, minHeight: 48 }}>
            <Share2 size={20} color={theme.palette.text.secondary} />
          </IconButton>
        }
      >
          <Typography
            variant="body1"
            sx={{

              fontSize: '1.05rem',
              fontWeight: 500,
              color: isDark ? theme.palette.warning.light : theme.palette.warning.main,
              lineHeight: 1.7,
              mb: 2,
              letterSpacing: '0.01em',
            }}
          >
            {todayVerse.sanskrit}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.875rem', mb: 1.5 }}>
            {todayVerse.translation}
          </Typography>
          {todayVerse.meaning && (
            <Typography variant="body2" sx={{ lineHeight: 1.7, fontSize: '0.875rem', mb: 1.5, color: theme.palette.text.secondary }}>
              <Box component="span" sx={{ fontWeight: 500 }}>Meaning:</Box> {todayVerse.meaning}
            </Typography>
          )}
          <Typography variant="caption" sx={{ color: isDark ? alpha(theme.palette.common.white, 0.6) : alpha(theme.palette.text.secondary, 0.7), fontStyle: 'italic' }}>
            — {todayVerse.source}
            {todayVerse.chapter && todayVerse.verse ? `, Chapter ${todayVerse.chapter}, Verse ${todayVerse.verse}` : ''}
          </Typography>
      </SectionCard>
      </Fade>

      {/* Card 5: Sunrise/Sunset */}
      {panchang?.sunrise && panchang?.sunset && (
        <Fade in timeout={700}>
        <SectionCard
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Sun size={16} color={isDark ? theme.palette.primary.light : theme.palette.primary.main} />
              <Typography variant="overline" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: isDark ? theme.palette.primary.light : theme.palette.primary.main, lineHeight: 1 }}>
                {t('stories.solarTimings') || "Solar Timings"}
              </Typography>
            </Box>
          }
        >
          <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
              <Typography sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                <Sunrise size={20} color={isDark ? theme.palette.primary.light : theme.palette.primary.main} />
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.25, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {t('panchang.sunrise')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, color: isDark ? theme.palette.primary.light : theme.palette.primary.main, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                {panchang.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
            <Box sx={{ width: 2, minWidth: 2, bgcolor: isDark ? alpha(theme.palette.common.white, 0.2) : alpha(theme.palette.common.black, 0.15), my: 1, borderRadius: 1, display: { xs: 'none', sm: 'block' } }} />
            <Box sx={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
              <Typography sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
                <Sunset size={20} color={theme.palette.primary.main} />
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', mb: 0.25, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {t('panchang.sunset')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, color: theme.palette.primary.main, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                {panchang.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
        </SectionCard>
        </Fade>
      )}
    </ScreenContainer>
  );
};

export default StoriesScreen;
