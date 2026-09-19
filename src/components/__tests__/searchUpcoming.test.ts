/**
 * SearchUpcoming helper tests — index build, en+hi filtering, rule adapter,
 * detail-id validity, and the 400-day null window.
 */

import { describe, it, expect } from 'vitest';
import {
  buildSearchIndex,
  filterSearch,
  nextOccurrenceFor,
} from '../SearchUpcoming';
import type { SearchIndexEntry } from '../SearchUpcoming';
import { FESTIVALS } from '../../data/festivals';
import { getFestivalStory } from '../../data/festivalStories';

describe('buildSearchIndex', () => {
  it('covers every FESTIVALS row plus registry-only entries', () => {
    const index = buildSearchIndex();
    for (const f of FESTIVALS) {
      expect(index.some((e) => e.id === f.id)).toBe(true);
    }
    // Registry-only entries (no FESTIVALS row) are appended, e.g. Ekadashi vrats.
    expect(index.length).toBeGreaterThanOrEqual(FESTIVALS.length);
  });

  it('adapts FESTIVALS rows to tithi rules (diwali)', () => {
    const index = buildSearchIndex();
    const diwali = index.find((e) => e.id === 'diwali');
    expect(diwali).toBeDefined();
    expect(diwali?.rule).toEqual({
      kind: 'tithi',
      month: 8,
      paksha: 'Krishna',
      tithiNumber: 15,
    });
  });

  it('omits month for every-month rows (sankashti, month 0)', () => {
    const index = buildSearchIndex();
    const sankashti = index.find((e) => e.id === 'sankashti-chaturthi');
    expect(sankashti).toBeDefined();
    expect(sankashti?.rule.kind).toBe('tithi');
    expect(sankashti?.rule).not.toHaveProperty('month');
  });

  it('every non-null detailId opens a valid FestivalDetail story', () => {
    const index = buildSearchIndex();
    const withDetail = index.filter((e) => e.detailId !== null);
    expect(withDetail.length).toBeGreaterThan(0);
    for (const e of withDetail) {
      expect(getFestivalStory(e.detailId as string)).toBeDefined();
    }
  });

  it('diwali resolves to the diwali story', () => {
    const index = buildSearchIndex();
    expect(index.find((e) => e.id === 'diwali')?.detailId).toBe('diwali');
  });
});

describe('filterSearch', () => {
  const index = buildSearchIndex();

  it('matches English case-insensitively', () => {
    const hits = filterSearch(index, 'DIWALI');
    expect(hits.some((h) => h.id === 'diwali')).toBe(true);
  });

  it('matches Hindi substring', () => {
    const hits = filterSearch(index, 'दीपावली');
    expect(hits.some((h) => h.id === 'diwali')).toBe(true);
  });

  it('matches partial queries across the registry', () => {
    const hits = filterSearch(index, 'ekadashi');
    expect(hits.length).toBeGreaterThan(0);
  });

  it('returns [] for blank queries and no-match queries', () => {
    expect(filterSearch(index, '')).toEqual([]);
    expect(filterSearch(index, '   ')).toEqual([]);
    expect(filterSearch(index, 'zzz-no-such-festival')).toEqual([]);
  });
});

describe('nextOccurrenceFor', () => {
  it('finds Diwali within the 400-day window', () => {
    const index = buildSearchIndex();
    const diwali = index.find((e) => e.id === 'diwali');
    expect(diwali).toBeDefined();
    const next = nextOccurrenceFor(diwali as SearchIndexEntry, new Date(2026, 0, 1));
    expect(next).not.toBeNull();
  });

  it('returns null when nothing matches within the window', () => {
    const entry: SearchIndexEntry = {
      id: 'test-static-past',
      name: 'Test Past',
      nameHindi: 'टेस्ट',
      detailId: null,
      rule: { kind: 'static', dates: ['2000-01-01'] },
    };
    expect(nextOccurrenceFor(entry, new Date(2026, 0, 1), 30)).toBeNull();
  });
});
