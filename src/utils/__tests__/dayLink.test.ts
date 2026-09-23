/**
 * Tests for share-tithi deep links (?d=YYYY-MM-DD).
 */
import { describe, it, expect } from 'vitest';
import { buildDayLink, parseDayParam, formatDayParam } from '../dayLink';

describe('formatDayParam', () => {
  it('formats a civil date as YYYY-MM-DD', () => {
    expect(formatDayParam(new Date(2026, 9, 20))).toBe('2026-10-20');
    expect(formatDayParam(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('parseDayParam', () => {
  it('parses a valid ?d= param', () => {
    const d = parseDayParam('?d=2026-10-20');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2026);
    expect(d!.getMonth()).toBe(9);
    expect(d!.getDate()).toBe(20);
  });

  it('parses without leading ? and alongside other params', () => {
    expect(parseDayParam('d=2026-09-22')?.getDate()).toBe(22);
    expect(parseDayParam('?src=share&d=2026-09-22')?.getDate()).toBe(22);
  });

  it('rejects missing, malformed, rolled-over, and out-of-range params', () => {
    expect(parseDayParam('')).toBeNull();
    expect(parseDayParam('?foo=1')).toBeNull();
    expect(parseDayParam('?d=tomorrow')).toBeNull();
    expect(parseDayParam('?d=2026-13-01')).toBeNull();
    expect(parseDayParam('?d=2026-02-30')).toBeNull();
    expect(parseDayParam('?d=1899-01-01')).toBeNull();
    expect(parseDayParam('?d=2101-01-01')).toBeNull();
  });

  it('round-trips through buildDayLink (og unfurl path)', () => {
    const link = buildDayLink(new Date(2026, 9, 20));
    expect(link).toContain('/api/og?d=2026-10-20');
    const query = link.slice(link.indexOf('?'));
    expect(parseDayParam(query)?.getTime()).toBe(new Date(2026, 9, 20).getTime());
  });
});
