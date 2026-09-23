/**
 * Share-tithi deep links: `?d=YYYY-MM-DD`.
 *
 * Pure helpers (no React): build a link for a civil date, parse one back.
 * The app boots to the linked day so a recipient sees the shared tithi and
 * gets an install nudge — the self-marketing loop. Strict validation:
 * malformed/out-of-range params return null and the app boots normally.
 */

const DAY_PARAM = 'd';
const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

export function formatDayParam(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Absolute share URL for a civil date (falls back to path-only off-browser). */
export function buildDayLink(date: Date): string {
  const param = `${DAY_PARAM}=${formatDayParam(date)}`;
  if (typeof window === 'undefined') return `/?${param}`;
  return `${window.location.origin}${window.location.pathname}?${param}`;
}

/** Parse `?d=YYYY-MM-DD` from a query string; null when absent/invalid. */
export function parseDayParam(search: string): Date | null {
  const query = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(query);
  const raw = params.get(DAY_PARAM);
  if (!raw) return null;
  const match = DAY_RE.exec(raw.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (y < MIN_YEAR || y > MAX_YEAR || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, m - 1, d);
  // Reject rollovers (e.g. Feb 30 → Mar 2).
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}
