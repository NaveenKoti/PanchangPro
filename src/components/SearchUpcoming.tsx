/**
 * SearchUpcoming — festival/vrat search + "Coming up · next 15 days" strip.
 *
 * Why: users ask "when is Diwali?" and "what's this week?". This is the
 * highest usefulness-per-effort discovery surface, embedded in TodayScreen.
 *
 * Navigation contract: a row is tappable ONLY when its id resolves through
 * the same mapping FestivalDetailScreen uses (getFestivalStory ||
 * findFestivalStoryByName). Entries with no detail render countdown
 * text-only — never a dead tap.
 */

import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  useTheme as useMuiTheme,
} from '@mui/material';
import { Search } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useI18n } from '../hooks/useI18n';
import { FESTIVALS } from '../data/festivals';
import {
  findNextOccurrence,
  listObservances,
} from '../data/observances';
import type {
  ObservanceRule,
  TithiObservanceRule,
} from '../data/observances/types';
import {
  findFestivalStoryByName,
  getFestivalStory,
} from '../data/festivalStories';
import { triggerHapticIfSupported } from '../utils/haptics';

// ============================================================================
// PURE HELPERS (exported for unit tests)
// ============================================================================

export interface SearchIndexEntry {
  id: string;
  name: string;
  nameHindi: string;
  /** Story id that opens a valid FestivalDetail, or null (text-only row). */
  detailId: string | null;
  rule: ObservanceRule;
}

/** Resolve an id through the FestivalDetailScreen mapping; null = no detail. */
export function resolveDetailId(id: string, name: string, nameHindi: string): string | null {
  const byId = getFestivalStory(id);
  if (byId) return byId.id;
  const byName = findFestivalStoryByName(name) ?? findFestivalStoryByName(nameHindi);
  return byName ? byName.id : null;
}

/**
 * Build the search index from FESTIVALS (name/nameHindi) plus the registry
 * (listObservances). FESTIVALS rows adapt to { kind: 'tithi', ... } with
 * month omitted when 0 (every-month observance, e.g. Sankashti).
 */
export function buildSearchIndex(): SearchIndexEntry[] {
  const index: SearchIndexEntry[] = [];
  const seen = new Set<string>();
  for (const f of FESTIVALS) {
    seen.add(f.id);
    const rule: TithiObservanceRule =
      f.month === 0
        ? { kind: 'tithi', paksha: f.paksha, tithiNumber: f.tithiNumber }
        : { kind: 'tithi', month: f.month, paksha: f.paksha, tithiNumber: f.tithiNumber };
    index.push({
      id: f.id,
      name: f.name,
      nameHindi: f.nameHindi,
      detailId: resolveDetailId(f.id, f.name, f.nameHindi),
      rule,
    });
  }
  for (const e of listObservances()) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    index.push({
      id: e.id,
      name: e.name,
      nameHindi: e.nameHindi,
      detailId: resolveDetailId(e.id, e.name, e.nameHindi),
      rule: e.rule,
    });
  }
  return index;
}

/** Case-insensitive substring match on English; plain substring on Hindi. */
export function filterSearch(index: SearchIndexEntry[], query: string): SearchIndexEntry[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const q = trimmed.toLowerCase();
  return index.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.nameHindi.includes(trimmed) ||
      e.id.toLowerCase().includes(q)
  );
}

/**
 * Next occurrence of an entry's rule, capped to a 400-day forward window.
 * Null when nothing matches within the window.
 */
export function nextOccurrenceFor(
  entry: SearchIndexEntry,
  fromDate: Date = new Date(),
  maxDays: number = 400
): Date | null {
  return findNextOccurrence(entry.rule, fromDate, undefined, maxDays);
}

// ============================================================================
// FORMATTING
// ============================================================================

function formatShortDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function relativeDayText(days: number, isHindi: boolean): string {
  if (days <= 0) return isHindi ? 'आज' : 'Today';
  if (isHindi) return `${days} दिन में`;
  return days === 1 ? 'in 1 day' : `in ${days} days`;
}

function countdownText(days: number, isHindi: boolean, date: Date): string {
  return `${relativeDayText(days, isHindi)} · ${formatShortDate(date)}`;
}

function daysUntil(from: Date, to: Date): number {
  const startOfDay = (d: Date): Date => {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
  };
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / 86400000);
}

// ============================================================================
// COMPONENT
// ============================================================================

export interface SearchUpcomingProps {
  onFestivalOpen?: (id: string) => void;
}

interface UpcomingDay {
  date: Date;
  name: string;
  detailId: string | null;
}

export const SearchUpcoming: React.FC<SearchUpcomingProps> = ({ onFestivalOpen }) => {
  const muiTheme = useMuiTheme();
  const { currentLanguage } = useI18n();
  const isHindi = currentLanguage === 'hi';
  const { calculatePanchang } = useAppStore();
  const [query, setQuery] = useState('');

  const index = useMemo(() => buildSearchIndex(), []);

  const results = useMemo(() => {
    const today = new Date();
    return filterSearch(index, query)
      .slice(0, 6)
      .map((entry) => ({ entry, next: nextOccurrenceFor(entry, today) }));
  }, [index, query]);

  // 15-day scan with the store's calculator (same source as FastsScreen).
  const upcoming = useMemo(() => {
    const days: UpcomingDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      let p: {
        festivals?: Array<{ id: string; name: string; nameHindi: string }>;
        fasting?: { name: string; nameHindi: string } | null;
        sankranti?: { name: string; nameHindi: string } | null;
      } | null = null;
      try {
        p = calculatePanchang(date);
      } catch {
        p = null;
      }
      if (!p) continue;
      const fest = p.festivals?.[0];
      if (fest) {
        const story = getFestivalStory(fest.id) ?? findFestivalStoryByName(fest.name);
        days.push({
          date,
          name: isHindi ? fest.nameHindi : fest.name,
          detailId: story ? story.id : null,
        });
      } else if (p.fasting) {
        days.push({
          date,
          name: isHindi ? p.fasting.nameHindi : p.fasting.name,
          detailId: null,
        });
      } else if (p.sankranti) {
        days.push({
          date,
          name: isHindi ? `${p.sankranti.nameHindi} संक्रांति` : `${p.sankranti.name} Sankranti`,
          detailId: null,
        });
      }
    }
    return days;
  }, [calculatePanchang, isHindi]);

  const handleOpen = (detailId: string): void => {
    if (!onFestivalOpen) return;
    triggerHapticIfSupported('light');
    onFestivalOpen(detailId);
  };

  return (
    <Box sx={{ mb: 1.5, maxWidth: '100%', minWidth: 0 }}>
      <Typography
        variant="overline"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          letterSpacing: '0.1em',
          fontSize: '0.75rem',
          display: 'block',
          mb: 1,
          pl: 0.5,
          fontFamily: '"Noto Sans", sans-serif',
        }}
      >
        {isHindi ? 'त्योहार और व्रत खोजें' : 'Search festivals & vrats'}
      </Typography>

      <TextField
        fullWidth
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        label={isHindi ? 'त्योहार खोजें' : 'Search festivals'}
        placeholder={isHindi ? 'जैसे: दीपावली, एकादशी…' : 'Try: Diwali, Ekadashi…'}
        InputProps={{
          startAdornment: <Search size={18} color={muiTheme.palette.text.secondary} />,
        }}
        sx={{
          mb: query.trim() ? 1 : 0,
          '& .MuiOutlinedInput-root': {
            minHeight: 48,
            borderRadius: 2,
            bgcolor: 'background.paper',
            fontFamily: '"Noto Sans", sans-serif',
          },
          '& .MuiOutlinedInput-input': {
            fontWeight: 400,
            fontFamily: '"Noto Sans", sans-serif',
          },
        }}
      />

      {query.trim() !== '' && (
        results.length > 0 ? (
          <List
            disablePadding
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
              overflow: 'hidden',
              mb: 1.5,
              maxWidth: '100%',
            }}
          >
            {results.map(({ entry, next }) => {
              const tappable = !!entry.detailId && !!onFestivalOpen;
              const label = next
                ? countdownText(daysUntil(new Date(), next), isHindi, next)
                : isHindi
                  ? 'तिथि चंद्र पंचांग के अनुसार'
                  : 'Follows the lunar calendar';
              return (
                <ListItemButton
                  key={entry.id}
                  disabled={!tappable}
                  onClick={() => entry.detailId && handleOpen(entry.detailId)}
                  sx={{
                    minHeight: 48,
                    borderBottom: '1px solid',
                    borderBottomColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                    '&.Mui-disabled': { opacity: 1 },
                  }}
                >
                  <ListItemText
                    primary={isHindi ? entry.nameHindi : entry.name}
                    secondary={label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontFamily: '"Noto Sans", sans-serif',
                      color: 'text.primary',
                      noWrap: true,
                    }}
                    secondaryTypographyProps={{
                      fontWeight: 400,
                      fontFamily: '"Noto Sans", sans-serif',
                      color: 'text.secondary',
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontFamily: '"Noto Sans", sans-serif',
              pl: 0.5,
              mb: 1.5,
            }}
          >
            {isHindi ? 'कोई परिणाम नहीं' : 'No matches'}
          </Typography>
        )
      )}

      <Typography
        variant="overline"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          letterSpacing: '0.1em',
          fontSize: '0.75rem',
          display: 'block',
          mb: 1,
          pl: 0.5,
          fontFamily: '"Noto Sans", sans-serif',
        }}
      >
        {isHindi ? 'आगे · अगले 15 दिन' : 'Coming up · next 15 days'}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          maxWidth: '100%',
          pb: 0.5,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {upcoming.map((day) => {
          const tappable = !!day.detailId && !!onFestivalOpen;
          return (
            <Box
              key={day.date.toISOString()}
              role={tappable ? 'button' : undefined}
              tabIndex={tappable ? 0 : undefined}
              onClick={tappable && day.detailId ? () => handleOpen(day.detailId as string) : undefined}
              onKeyDown={
                tappable && day.detailId
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleOpen(day.detailId as string);
                    }
                  : undefined
              }
              sx={{
                flexShrink: 0,
                scrollSnapAlign: 'start',
                minWidth: 104,
                maxWidth: 140,
                p: 1,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                cursor: tappable ? 'pointer' : 'default',
                minHeight: 48,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  fontWeight: 400,
                  fontFamily: '"Noto Sans", sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                {formatShortDate(day.date)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontFamily: '"Noto Sans", sans-serif',
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {day.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'primary.main',
                  fontWeight: 400,
                  fontFamily: '"Noto Sans", sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                {relativeDayText(daysUntil(new Date(), day.date), isHindi)}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SearchUpcoming;
