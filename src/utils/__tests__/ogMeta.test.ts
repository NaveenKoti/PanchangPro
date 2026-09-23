/**
 * Tests for Open-Graph meta (share-tithi unfurl).
 * Asserts REAL engine output for known Drik dates — the unfurl must never
 * show a different tithi than the app.
 */
import { describe, it, expect } from 'vitest';
import { buildOgMeta } from '../ogMeta';

const HOST = 'panchang-pro.vercel.app';

describe('buildOgMeta', () => {
  it('Parsva Ekadashi Sep 22 2026', () => {
    const meta = buildOgMeta('2026-09-22', HOST);
    expect(meta.ok).toBe(true);
    if (!meta.ok) return;
    expect(meta.title).toBe('Ekadashi · 22 Sept 2026');
    expect(meta.description).toContain('Shukla Paksha');
    expect(meta.imageUrl).toBe(`https://${HOST}/api/og-image?d=2026-09-22`);
    expect(meta.pageUrl).toBe(`https://${HOST}/api/og?d=2026-09-22`);
    expect(meta.redirectUrl).toBe(`https://${HOST}/?d=2026-09-22`);
  });

  it('Dussehra Oct 20 2026 names the festival', () => {
    const meta = buildOgMeta('2026-10-20', HOST);
    expect(meta.ok).toBe(true);
    if (!meta.ok) return;
    expect(meta.festivalName).toBe('Dussehra');
    expect(meta.description).toContain('Dussehra');
  });

  it('rejects invalid dates', () => {
    expect(buildOgMeta('not-a-date', HOST)).toEqual({ ok: false });
    expect(buildOgMeta('2026-02-30', HOST)).toEqual({ ok: false });
    expect(buildOgMeta('', HOST)).toEqual({ ok: false });
  });
});
