/**
 * Observance system tests — solar ingress (Sankranti), new fasting branches,
 * the appendable registry, and the festivals.ts dedupe guard.
 *
 * External truth sources are cited per assertion; everything else asserts
 * self-consistency (the scanned day re-matches its own rule).
 */

import { describe, it, expect } from 'vitest';
import { PanchangEngine } from '../panchang';
import { DELHI } from './referenceData';
import { FESTIVALS } from '../../data/festivals';
import {
  findNextOccurrence,
  findRangeContaining,
  getObservance,
  listObservances,
  matchesTithiRule,
  registerObservance,
} from '../../data/observances';
import { SANKRANTI_OBSERVANCES } from '../../data/observances/sankranti';
import { VRAT_OBSERVANCES } from '../../data/observances/vrats';
import { RANGE_OBSERVANCES } from '../../data/observances/ranges';

const engine = new PanchangEngine(DELHI);

function atMidnight(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d);
}

describe('Solar ingress (Sankranti)', () => {
  it('Makar Sankranti falls on Jan 14 (2025 and 2026)', () => {
    // Drik Panchang: Makara Sankranti Jan 14, 2025 and Jan 14, 2026.
    for (const year of [2025, 2026]) {
      const p = engine.calculate(atMidnight(year, 1, 14));
      expect(p.sankranti).not.toBeNull();
      expect(p.sankranti?.rashiIndex).toBe(9);
      expect(p.sankranti?.name).toBe('Makara');
      expect(p.sankranti?.nameHindi).toBe('मकर');
      expect(p.sankranti?.ingressTime.getDate()).toBe(14);
    }
  });

  it('Karka Sankranti falls ~Jul 16 (2025 and 2026)', () => {
    // Drik Panchang: Karka Sankranti Jul 16, 2025 and Jul 16, 2026.
    for (const year of [2025, 2026]) {
      const p = engine.calculate(atMidnight(year, 7, 16));
      expect(p.sankranti?.rashiIndex).toBe(3);
      expect(p.sankranti?.name).toBe('Karka');
    }
  });

  it('ordinary days have no ingress', () => {
    expect(engine.calculate(atMidnight(2025, 1, 15)).sankranti).toBeNull();
    expect(engine.calculate(atMidnight(2025, 6, 1)).sankranti).toBeNull();
  });

  it('exactly 12 ingresses per year in monotonic rashi order', () => {
    const found: number[] = [];
    for (let i = 0; i < 365; i++) {
      const day = new Date(2025, 0, 1 + i);
      const s = engine.calculate(day).sankranti;
      if (s) found.push(s.rashiIndex);
    }
    expect(found).toHaveLength(12);
    // Makara(9) Jan → … → Dhanu(8) Dec, wrapping Mesha(0) in April.
    expect(found).toEqual([9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe('Fasting branches', () => {
  it('Somvati Amavasya fires on Monday Dec 30, 2024', () => {
    // Source: Times of India (2024-12-28) + Drik Panchang via LiveMint —
    // Somvati Amavasya Dec 30, 2024 (Monday); tithi Dec 30 04:01 → Dec 31 03:56.
    // Cross-check: BAPS calendar lists Dec 30, 2024 as "Somvati Amas".
    const p = engine.calculate(atMidnight(2024, 12, 30));
    expect(p.tithi.number).toBe(15);
    expect(p.tithi.paksha).toBe('Krishna');
    expect(p.date.getDay()).toBe(1);
    expect(p.fasting?.id).toBe('somvati-amavasya');
    expect(p.fasting?.name).toBe('Somvati Amavasya');
    expect(p.fasting?.type).toBe('amavasya');
  });

  it('Shani Amavasya fires on Saturday Aug 23, 2025', () => {
    const p = engine.calculate(atMidnight(2025, 8, 23));
    expect(p.tithi.number).toBe(15);
    expect(p.tithi.paksha).toBe('Krishna');
    expect(p.date.getDay()).toBe(6);
    expect(p.fasting?.id).toBe('shani-amavasya');
  });

  it('plain Amavasya (non-Mon/Sat) keeps the base template', () => {
    // May 27, 2025 was a Tuesday Krishna-15 (engine-verified).
    const p = engine.calculate(atMidnight(2025, 5, 27));
    expect(p.tithi.number).toBe(15);
    expect(p.tithi.paksha).toBe('Krishna');
    expect(p.fasting?.id).toBe('amavasya-vrat');
  });

  it('Sankashti fires on Krishna Chaturthi (Jun 15, 2025)', () => {
    const p = engine.calculate(atMidnight(2025, 6, 15));
    expect(p.tithi.number).toBe(4);
    expect(p.tithi.paksha).toBe('Krishna');
    expect(p.fasting?.id).toBe('sankashti-chaturthi');
    expect(p.fasting?.type).toBe('sankashti');
  });

  it('Angarki Sankashti fires on a Tuesday Krishna Chaturthi', () => {
    const next = findNextOccurrence(
      { kind: 'tithi', paksha: 'Krishna', tithiNumber: 4, weekday: 2 },
      atMidnight(2025, 0, 1)
    );
    expect(next).not.toBeNull();
    const p = engine.calculate(next!);
    expect(p.date.getDay()).toBe(2);
    expect(p.fasting?.id).toBe('angarki-sankashti');
  });

  it('Soma Pradosh naming on a Monday Trayodashi evening (Jun 23, 2025)', () => {
    // Times Now: Krishna Trayodashi Jun 23 01:21 → 22:09, Pradosh observed Jun 23.
    const p = engine.calculate(atMidnight(2025, 6, 23));
    expect(p.date.getDay()).toBe(1);
    expect(p.fasting?.id).toBe('soma-pradosh');
    expect(p.fasting?.name).toBe('Soma Pradosh Vrat');
    expect(p.fasting?.type).toBe('pradosh');
  });

  it('Bhanu (plain) Pradosh on Sun Jun 8 2025, not Mon Jun 9 (Udaya-only was wrong)', () => {
    // Times Now: Shukla Trayodashi Jun 8 07:17 → Jun 9 09:35; observed Jun 8.
    expect(engine.calculate(atMidnight(2025, 6, 8)).fasting?.id).toBe('pradosh-vrat');
    expect(engine.calculate(atMidnight(2025, 6, 9)).fasting?.id ?? 'none').not.toMatch(/pradosh/);
  });

  it('plain Pradosh keeps the base id on other weekdays', () => {
    let plain: Date | null = null;
    for (let i = 0; i < 120 && !plain; i++) {
      const day = new Date(2025, 5, 1 + i);
      const p = engine.calculate(day);
      if (p.fasting?.id === 'pradosh-vrat') plain = day;
    }
    expect(plain).not.toBeNull();
    const wd = (plain as Date).getDay();
    expect([0, 3, 4, 5]).toContain(wd);
  });
});

describe('Observance registry', () => {
  it('seeds all 12 sankrantis', () => {
    expect(SANKRANTI_OBSERVANCES).toHaveLength(12);
    expect(getObservance('sankranti-makara')?.rule).toEqual({
      kind: 'solar-ingress',
      rashiIndex: 9,
    });
  });

  it('seeds pradosh×3, sankashti+angarki, somvati+shani, ahoi, dhanteras, bhai-dooj', () => {
    expect(VRAT_OBSERVANCES).toHaveLength(10);
    for (const id of [
      'soma-pradosh',
      'bhauma-pradosh',
      'shani-pradosh',
      'sankashti-chaturthi',
      'angarki-sankashti',
      'somvati-amavasya',
      'shani-amavasya',
      'ahoi-ashtami',
      'dhanteras',
      'bhai-dooj',
    ]) {
      expect(getObservance(id), id).toBeDefined();
    }
  });

  it('seeds both navratris, pitru paksha, sawan somvar', () => {
    expect(RANGE_OBSERVANCES).toHaveLength(4);
    for (const id of ['chaitra-navratri', 'sharad-navratri', 'pitru-paksha', 'sawan-somvar']) {
      expect(getObservance(id), id).toBeDefined();
    }
  });

  it('finds Makar Sankranti 2026 via solar-ingress scan', () => {
    const next = findNextOccurrence({ kind: 'solar-ingress', rashiIndex: 9 }, atMidnight(2025, 12, 1));
    expect(next?.getFullYear()).toBe(2026);
    expect(next?.getMonth()).toBe(0);
    expect(next?.getDate()).toBe(14);
  });

  it('finds Sharad Navratri 2025 start (Sep 22, published Ghatasthapana)', () => {
    const rule = getObservance('sharad-navratri')?.rule;
    expect(rule?.kind).toBe('date-range');
    const next = findNextOccurrence(rule!, atMidnight(2025, 1, 1));
    expect(next?.getFullYear()).toBe(2025);
    expect(next?.getMonth()).toBe(8);
    expect(next?.getDate()).toBe(22);
  });

  it('Pitru Paksha 2025 spans Sep 7 – Sep 21 (published)', () => {
    const rule = getObservance('pitru-paksha')?.rule;
    if (rule?.kind !== 'date-range') throw new Error('pitru-paksha must be a date-range');
    const bounds = findRangeContaining(engine, atMidnight(2025, 9, 15), rule);
    expect(bounds?.start.getDate()).toBe(7);
    expect(bounds?.start.getMonth()).toBe(8);
    expect(bounds?.end.getDate()).toBe(21);
    expect(bounds?.end.getMonth()).toBe(8);
  });

  it('Sawan Somvar resolves to Shravana Mondays', () => {
    // Self-consistency only: the engine's solar-sign lunar month is an
    // approximation (Purnimanta Shravana starts earlier in the North), so no
    // exact civil date is asserted here.
    const next = findNextOccurrence(
      { kind: 'weekday-in-month', lunarMonth: 5, weekday: 1 },
      atMidnight(2025, 6, 1)
    );
    expect(next).not.toBeNull();
    const p = engine.calculate(next!);
    expect(p.date.getDay()).toBe(1);
    expect(p.lunarMonth).toBe(5);
  });

  it('Bhai Dooj 2025 lands on Oct 23 (published)', () => {
    const rule = getObservance('bhai-dooj')?.rule;
    if (rule?.kind !== 'tithi') throw new Error('bhai-dooj must be a tithi rule');
    const next = findNextOccurrence(rule, atMidnight(2025, 1, 1));
    expect(next?.getMonth()).toBe(9);
    expect(next?.getDate()).toBe(23);
    expect(matchesTithiRule(engine.calculate(next!), rule)).toBe(true);
  });

  it('supports the append pattern (register + lookup + scan)', () => {
    registerObservance({
      id: 'test-append-vrat',
      name: 'Test Vrat',
      nameHindi: 'परीक्षण व्रत',
      meaning: 'Registry append-pattern smoke test.',
      meaningHindi: 'परीक्षण।',
      rule: { kind: 'tithi', month: 8, paksha: 'Krishna', tithiNumber: 13 },
    });
    expect(getObservance('test-append-vrat')?.name).toBe('Test Vrat');
    expect(listObservances().some((e) => e.id === 'test-append-vrat')).toBe(true);
  });
});

describe('Festivals dedupe', () => {
  it('has no duplicate festival ids', () => {
    const ids = FESTIVALS.map((f) => f.id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('keeps a single onam / gudi-padwa / ugadi / rakhi-purnima row', () => {
    for (const id of ['onam', 'gudi-padwa', 'ugadi', 'rakhi-purnima']) {
      expect(FESTIVALS.filter((f) => f.id === id)).toHaveLength(1);
    }
  });

  it('keeps non-duplicate neighbours (chhath-puja, krishna-jayanti, janmashtami-smart)', () => {
    for (const id of ['chhath-puja', 'krishna-jayanti', 'janmashtami-smart', 'janmashtami']) {
      expect(FESTIVALS.find((f) => f.id === id), id).toBeDefined();
    }
  });
});
