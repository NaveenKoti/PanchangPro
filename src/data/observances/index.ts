/**
 * Observance registry — register, lookup, match, and next-occurrence.
 *
 * HOW TO APPEND A NEW OBSERVANCE FILE (copy-paste pattern):
 *   1. Create `myobservance.ts` exporting `MY_OBSERVANCES: ObservanceEntry[]`
 *      (copy the header + one entry from vrats.ts).
 *   2. Add two lines here:
 *      import { MY_OBSERVANCES } from './myobservance';
 *      ... inside REGISTRY_SEED below: ...MY_OBSERVANCES,
 *   3. Done — lookup and findNextOccurrence pick it up automatically.
 *
 * Matching is always done through PanchangEngine.calculate output
 * (Udaya-tithi Panchang), so registry results agree with the rest of the app.
 */

import { GeoLocation, Panchang } from '../../types';
import { PanchangEngine } from '../../engine/panchang';
import {
  ObservanceEntry,
  ObservanceRule,
  TithiObservanceRule,
  DateRangeRule,
} from './types';
import { SANKRANTI_OBSERVANCES } from './sankranti';
import { VRAT_OBSERVANCES } from './vrats';
import { RANGE_OBSERVANCES } from './ranges';
import { ADHIK_OBSERVANCES } from './adhik';

const REGISTRY_SEED: ObservanceEntry[] = [
  ...SANKRANTI_OBSERVANCES,
  ...VRAT_OBSERVANCES,
  ...RANGE_OBSERVANCES,
  ...ADHIK_OBSERVANCES,
];

const REGISTRY: ObservanceEntry[] = [...REGISTRY_SEED];

/** Append a new observance at runtime (e.g. a user-defined vrat). */
export function registerObservance(entry: ObservanceEntry): void {
  const existing = REGISTRY.findIndex((e) => e.id === entry.id);
  if (existing >= 0) {
    REGISTRY[existing] = entry;
  } else {
    REGISTRY.push(entry);
  }
}

/** Look up a registered observance by id. */
export function getObservance(id: string): ObservanceEntry | undefined {
  return REGISTRY.find((e) => e.id === id);
}

/** All registered observances (seed + runtime-appended). */
export function listObservances(): ObservanceEntry[] {
  return [...REGISTRY];
}

/** Day-granularity tithi matching shared by the scanner and range bounds. */
export function matchesTithiRule(
  p: Panchang,
  rule: TithiObservanceRule,
  engine?: PanchangEngine
): boolean {
  if (p.tithi.number !== rule.tithiNumber) return false;
  if (rule.paksha !== undefined && rule.paksha !== 'both' && p.tithi.paksha !== rule.paksha) {
    return false;
  }
  if (rule.month !== undefined && rule.month !== 0) {
    if (p.lunarMonth === rule.month) return true;
    // Amanta union: near month boundaries the solar-sign lunarMonth lags or
    // leads the true amanta span (Pitru 2026: Bhadrapada Purnima Sep 26 reads
    // solar month 7 but amanta month 6). Accepting either keeps both
    // reckonings observable; forward-scan first matches are unchanged for all
    // seeded rules (Bhai Dooj 2025 still Oct 23, Navratri 2025 still Sep 22).
    // Without an engine only the legacy solar month is available.
    if (engine && engine.getAmantaMonthNumber(p.date) === rule.month) return true;
    return false;
  }
  if (rule.weekday !== undefined && p.date.getDay() !== rule.weekday) {
    return false;
  }
  return true;
}

function toIsoDay(d: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Match a single day's Panchang against a rule.
 * NOTE: `date-range` rules need multi-day context (an engine + location),
 * so they are NOT matched here — use isInObservanceRange / findNextOccurrence
 * for those. Returns false for date-range by design.
 */
export function matchesRule(p: Panchang, rule: ObservanceRule, engine?: PanchangEngine): boolean {
  switch (rule.kind) {
    case 'tithi':
      return matchesTithiRule(p, rule, engine);
    case 'solar-ingress':
      return (p.sankranti?.rashiIndex ?? -1) === rule.rashiIndex;
    case 'weekday-in-month': {
      if (p.date.getDay() !== rule.weekday) return false;
      if (p.lunarMonth === rule.lunarMonth) return true;
      // Amanta union (engine required): the solar-sign month (Karka sun =
      // solar Shravana ~Jul 16–Aug 16) misses weeks the amanta span covers
      // and vice versa (amanta Shravana 2026 ~Aug 14–Sep 12). Purnimanta
      // households observe pre-ingress Mondays (Aug 3/10), Amanta ones
      // post-ingress (Aug 17/24); accepting either covers all of them.
      // Without an engine only the legacy solar month is available.
      return engine !== undefined && engine.getAmantaMonthNumber(p.date) === rule.lunarMonth;
    }
    case 'static':
      return rule.dates.includes(toIsoDay(p.date));
    case 'adhik':
      return p.adhikMaas?.isAdhik === true;
    case 'date-range':
      return false;
    default:
      return false;
  }
}

/** Default location for next-occurrence scans when the caller has none. */
export const DEFAULT_SCAN_LOCATION: GeoLocation = {
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 'Asia/Kolkata',
  name: 'New Delhi',
};

const DEFAULT_MAX_SPAN_DAYS = 20;

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

function rangeSpan(rule: DateRangeRule): number {
  return rule.maxSpanDays ?? DEFAULT_MAX_SPAN_DAYS;
}

/** Find the end of the range occurrence that starts on `start` (Day 1). */
function findRangeEnd(
  engine: PanchangEngine,
  start: Date,
  rule: DateRangeRule
): Date {
  const span = rangeSpan(rule);
  for (let j = 0; j <= span; j++) {
    const candidate = addDays(start, j);
    if (matchesTithiRule(engine.calculate(candidate), rule.endRule, engine)) {
      return candidate;
    }
  }
  // Kshaya fallback: the closing tithi never rose at sunrise — the span is
  // still real, so close 8 days after Day 1 (a 9-day span like Navratri).
  return addDays(start, 8);
}

/**
 * If `day` falls inside a range occurrence, return its { start, end } bounds.
 * Scans back at most maxSpanDays for the Day-1 tithi, then forward for the end.
 */
export function findRangeContaining(
  engine: PanchangEngine,
  day: Date,
  rule: DateRangeRule
): { start: Date; end: Date } | null {
  const span = rangeSpan(rule);
  const target = addDays(day, 0);
  for (let back = 0; back <= span; back++) {
    const startCandidate = addDays(target, -back);
    if (matchesTithiRule(engine.calculate(startCandidate), rule.startRule, engine)) {
      const end = findRangeEnd(engine, startCandidate, rule);
      if (startCandidate.getTime() <= target.getTime() && target.getTime() <= end.getTime()) {
        return { start: startCandidate, end };
      }
      // A Day-1 older than this occurrence's end means we walked past it.
      if (end.getTime() < target.getTime()) return null;
    }
  }
  return null;
}

/** True when `day` lies inside an occurrence of a date-range rule. */
export function isInObservanceRange(
  engine: PanchangEngine,
  day: Date,
  rule: DateRangeRule
): boolean {
  return findRangeContaining(engine, day, rule) !== null;
}

/**
 * Next occurrence of a rule on or after the day following `fromDate`.
 * Forward-scans at most `maxDays` (default 400) day-by-day with full
 * PanchangEngine.calculate matching, so results agree with the app's
 * Udaya-tithi Panchang. For date-range rules returns the Day-1 date of the
 * next occurrence (the containing occurrence's start when already inside one).
 * Returns null when nothing matches within the window.
 */
export function findNextOccurrence(
  rule: ObservanceRule,
  fromDate: Date,
  location: GeoLocation = DEFAULT_SCAN_LOCATION,
  maxDays: number = 400
): Date | null {
  const engine = new PanchangEngine(location);
  const fromDay = addDays(fromDate, 0);

  if (rule.kind === 'date-range') {
    const containing = findRangeContaining(engine, fromDay, rule);
    if (containing) return containing.start;
    for (let i = 1; i <= maxDays; i++) {
      const candidate = addDays(fromDay, i);
      if (matchesTithiRule(engine.calculate(candidate), rule.startRule, engine)) {
        return candidate;
      }
    }
    return null;
  }

  for (let i = 1; i <= maxDays; i++) {
    const candidate = addDays(fromDay, i);
    if (matchesRule(engine.calculate(candidate), rule, engine)) {
      return candidate;
    }
  }
  return null;
}

/** Next occurrence of a REGISTERED observance by id (null when unknown). */
export function findNextOccurrenceById(
  id: string,
  fromDate: Date,
  location: GeoLocation = DEFAULT_SCAN_LOCATION,
  maxDays: number = 400
): Date | null {
  const entry = getObservance(id);
  if (!entry) return null;
  return findNextOccurrence(entry.rule, fromDate, location, maxDays);
}
