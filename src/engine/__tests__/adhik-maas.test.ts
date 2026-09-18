/**
 * Adhik Maas (leap month) / Kshaya Maas tests.
 *
 * External truth:
 * - Adhik Shravana 2023: Jul 18 → Aug 16 (amanta new-moon spans), widely
 *   reported (Times Now, HinduPad, Sakalam). Samvat 2080 ran 13 months.
 * - Adhik Ashwin 2020: Sep 18 → Oct 16 (same sources' tables).
 * - Next listed: Jyeshtha Adhik Maas 2026 (Sakalam table; Times Now notes the
 *   Adhik span starts May 17, 2026, inside the 59-day Jyeshtha).
 */

import { describe, it, expect } from 'vitest';
import { PanchangEngine } from '../panchang';
import { DELHI } from './referenceData';

const engine = new PanchangEngine(DELHI);

function atMidnight(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d);
}

describe('Adhik Maas anchors', () => {
  it('Aug 1 2023 is Adhik Shravana (span Jul 18 → Aug 16)', () => {
    const info = engine.getAdhikMaasInfo(atMidnight(2023, 8, 1));
    expect(info).not.toBeNull();
    expect(info?.isAdhik).toBe(true);
    expect(info?.isKshaya).toBe(false);
    expect(info?.monthNumber).toBe(5);
    expect(info?.name).toBe('Shravana');
    expect(info?.nameHindi).toBe('श्रावण');
    // Enclosing new-moon span matches the published dates (new moon in the
    // early hours of Jul 18 IST; Amavasya tithi observed Jul 17).
    expect(info?.spanStart.getFullYear()).toBe(2023);
    expect(info?.spanStart.getMonth()).toBe(6); // July (0-based)
    expect(info?.spanStart.getDate()).toBe(18);
    expect(info?.spanEnd.getMonth()).toBe(7); // August
    expect(info?.spanEnd.getDate()).toBe(16);
  });

  it('Jul 1 2023 is a normal month (Nija Ashadha span has Karka ingress Jul …)', () => {
    // Jun 18 → Jul 17 2023 span contains the Mithuna→Karka ingress (Jul 16),
    // so exactly one ingress → normal.
    expect(engine.getAdhikMaasInfo(atMidnight(2023, 7, 1))).toBeNull();
  });

  it('Sep 5 2023 is a normal month (Simha ingress Aug 17 in-span)', () => {
    expect(engine.getAdhikMaasInfo(atMidnight(2023, 9, 5))).toBeNull();
  });

  it('Oct 1 2020 is Adhik Ashwin (span Sep 18 → Oct 16)', () => {
    const info = engine.getAdhikMaasInfo(atMidnight(2020, 10, 1));
    expect(info).not.toBeNull();
    expect(info?.isAdhik).toBe(true);
    expect(info?.monthNumber).toBe(7);
    expect(info?.name).toBe('Ashwin');
    expect(info?.nameHindi).toBe('आश्विन');
  });

  it('2024–2025 have no Adhik month (control sweep)', () => {
    for (let m = 1; m <= 12; m++) {
      expect(engine.getAdhikMaasInfo(atMidnight(2024, m, 15))).toBeNull();
      expect(engine.getAdhikMaasInfo(atMidnight(2025, m, 15))).toBeNull();
    }
  });

  it('2026 has a single Adhik span named Jyeshtha (Sakalam table)', () => {
    const found: Array<{ start: Date; name: string }> = [];
    for (let m = 1; m <= 12; m++) {
      const info = engine.getAdhikMaasInfo(atMidnight(2026, m, 15));
      if (info?.isAdhik) found.push({ start: info.spanStart, name: info.name });
    }
    const unique = [...new Map(found.map((f) => [f.start.getTime(), f])).values()];
    expect(unique.length).toBe(1);
    expect(unique[0].name).toBe('Jyeshtha');
  });
});

describe('Adhik Maas plumbing', () => {
  it('calculate() exposes adhikMaas on every day (null when normal)', () => {
    const adhikDay = engine.calculate(atMidnight(2023, 8, 1));
    expect(adhikDay.adhikMaas?.isAdhik).toBe(true);
    expect(adhikDay.adhikMaas?.name).toBe('Shravana');
    const normalDay = engine.calculate(atMidnight(2023, 9, 5));
    expect(normalDay.adhikMaas).toBeNull();
  });

  it('new-moon spans are 27–31 days (sanity on the span finder)', () => {
    const info = engine.getAdhikMaasInfo(atMidnight(2023, 8, 1));
    const spanDays =
      (info!.spanEnd.getTime() - info!.spanStart.getTime()) / (24 * 3600 * 1000);
    expect(spanDays).toBeGreaterThan(27);
    expect(spanDays).toBeLessThan(31);
  });
});
