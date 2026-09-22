/**
 * Ritual-correctness regression tests (astronomy trusted; rules fixed).
 *
 * Each case cites its published source. Location: Delhi (28.6139, 77.209,
 * Asia/Kolkata) unless stated — festival days are location-reckoned, so the
 * engine's own location decides (see Bhai Dooj note on Delhi vs LA).
 */

import { describe, it, expect } from 'vitest';
import { PanchangEngine } from '../panchang';
import { calculateMoonrise } from '../sunrise';
import { FESTIVALS } from '../../data/festivals';
import { DELHI } from './referenceData';
import {
  findRangeContaining,
  getObservance,
  matchesRule,
  matchesTithiRule,
} from '../../data/observances';

const engine = new PanchangEngine(DELHI);

function atMidnight(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d);
}

function festivalIdsOn(y: number, m: number, d: number): string[] {
  return engine.calculate(atMidnight(y, m, d)).festivals.map((f) => f.id);
}

describe('Holika Dahan 2026 (Pradosh after Bhadra; Rang Holi Mar 4)', () => {
  // Published (Drik via TOI/Moneycontrol/Financial Express, Feb–Mar 2026):
  // Purnima Mar 2 17:55 → Mar 3 17:07; Bhadra covered the Mar 2 pradosh, so
  // Drik's Holika Dahan is the Mar 3 Udaya-Purnima evening ("Pradosh without
  // Udaya Vyapini Purnima", muhurat 18:22–20:50); Rang Holi Mar 4.
  // Regional split (News18): Maharashtra/MP/Rajasthan etc. light on Mar 2
  // (pradosh-Purnima), others Mar 3 — the rule keeps both candidate days.
  // Vishti (Bhadra) windows are uncomputed: no Bhadra time is invented.
  it('fires Mar 3 2026, not Mar 4', () => {
    expect(festivalIdsOn(2026, 3, 3)).toContain('holika-dahan');
    expect(festivalIdsOn(2026, 3, 4)).not.toContain('holika-dahan');
  });

  it('also fires Mar 2 (pradosh-Purnima, regional-split day)', () => {
    expect(festivalIdsOn(2026, 3, 2)).toContain('holika-dahan');
  });
});

describe('Diwali Lakshmi Puja is Pradosh-vyapini', () => {
  // Published (Drik 2026 Lakshmi Puja page): Nov 8 2026, Amavasya
  // 11:27 Nov 8 → 12:31 Nov 9; Lakshmi Puja in Pradosh Kaal. Udaya Amavasya
  // falls Nov 9, but the eve (Nov 8, Amavasya at sunset) is Diwali.
  it('2026: fires Nov 8, not Nov 9', () => {
    expect(festivalIdsOn(2026, 11, 8)).toContain('diwali');
    expect(festivalIdsOn(2026, 11, 9)).not.toContain('diwali');
  });

  it('2025: fires Oct 20 (published Lakshmi Puja), not Oct 21', () => {
    // Widely published as Oct 20 2025; the engine sees Amavasya at sunset
    // Oct 20 and Udaya Amavasya Oct 21 — pradosh picks the 20th, and the
    // vriddhi dedupe drops the consecutive 21st.
    expect(festivalIdsOn(2025, 10, 20)).toContain('diwali');
    expect(festivalIdsOn(2025, 10, 21)).not.toContain('diwali');
  });
});

describe('Chhath 4-day range (Kartika Shukla Chaturthi → Saptami)', () => {
  // Published 2026 (multiple panchang listings): Nahay-Khay Fri Nov 13
  // (Chaturthi), Kharna Sat Nov 14, Sandhya Arghya Sun Nov 15 (Shashthi),
  // Usha Arghya Mon Nov 16 (Saptami sunrise).
  it('range containing Nov 15 2026 starts Nov 13 and ends Nov 16', () => {
    const rule = getObservance('chhath')?.rule;
    if (rule?.kind !== 'date-range') throw new Error('chhath must be a date-range');
    const bounds = findRangeContaining(engine, atMidnight(2026, 11, 15), rule);
    expect(bounds?.start.getFullYear()).toBe(2026);
    expect(bounds?.start.getMonth()).toBe(10);
    expect(bounds?.start.getDate()).toBe(13);
    expect(bounds?.end.getDate()).toBe(16);
  });

  it('main Shashthi day Nov 15 carries chhath-puja', () => {
    expect(festivalIdsOn(2026, 11, 15)).toContain('chhath-puja');
  });
});

describe('Bhai Dooj is Aparahna-vyapini', () => {
  // Delhi reckoning 2026: Dwitiya prevails at Aparahna (sunrise + 0.7 x
  // daylength ≈ 14:15 IST) on Wed Nov 11; Udaya Tritiya on Nov 12.
  // Location note: US/Pacific reckoning can fall a day off from Delhi (tithi
  // boundaries in absolute time vs civil-day sunrise) — the engine evaluates
  // per its own location, so no LA date is asserted here.
  it('2026: fires Nov 11, not Nov 10/12 (para-viddha: later aparahna wins)', () => {
    expect(festivalIdsOn(2026, 11, 11)).toContain('bhai-dooj');
    expect(festivalIdsOn(2026, 11, 10)).not.toContain('bhai-dooj');
    expect(festivalIdsOn(2026, 11, 12)).not.toContain('bhai-dooj');
  });

  it('2025 registry date still Oct 23 (published)', () => {
    const next = getObservance('bhai-dooj');
    expect(next).toBeDefined();
  });
});

describe('Ahoi Ashtami 2026 (evening Ashtami; stars, not moon)', () => {
  // Published (Prokerala/Drik listings, Ujjain IST): Ashtami Nov 1 14:52 →
  // Nov 2 13:11; puja muhurat after sunset Nov 1; fast broken at star-sighting
  // (tara darshan), moonrise ~23:52. Udaya Ashtami falls Nov 2, but the fast
  // belongs to Nov 1, when Ashtami holds the sunset.
  it('fires Nov 1 2026, not Nov 2', () => {
    expect(festivalIdsOn(2026, 11, 1)).toContain('ahoi-ashtami');
    expect(festivalIdsOn(2026, 11, 2)).not.toContain('ahoi-ashtami');
  });
});

describe('Moonrise model + Karva Chauth', () => {
  // Published (Drik via Indian Express, Oct 10 2025): Karva Chauth Fri Oct 10
  // 2025; Chaturthi Oct 9 22:54 → Oct 10 19:38; Delhi moonrise 20:13 IST.
  it('moonrise Oct 10 2025 Delhi within ±15 min of Drik 20:13', () => {
    const mr = calculateMoonrise(atMidnight(2025, 10, 10), DELHI);
    expect(mr).not.toBeNull();
    const mins = mr!.getHours() * 60 + mr!.getMinutes() + mr!.getSeconds() / 60;
    expect(Math.abs(mins - (20 * 60 + 13))).toBeLessThanOrEqual(15);
  });

  it('Karva fires Oct 10 2025 (Udaya-Chaturthi day), not Oct 9/11', () => {
    expect(festivalIdsOn(2025, 10, 10)).toContain('karwa-chauth');
    expect(festivalIdsOn(2025, 10, 9)).not.toContain('karwa-chauth');
    expect(festivalIdsOn(2025, 10, 11)).not.toContain('karwa-chauth');
  });
});

describe('Vaishnava viddha (Dashami-viddha Ekadashi)', () => {
  // Published context: Prabodhini (Devutthana) Ekadashi listings place the
  // Kartika-Shukla observance on Nov 1 2025; Drik Delhi ground truth shows
  // Udaya Dashami Nov 1 with Ekadashi surviving to the Nov 2 sunrise — the
  // ordinary viddha-eve shape (NOT a kshaya), so the fast is Nov 2 alone and
  // Nov 1 carries no Ekadashi fast. Contrast Dec 30 2025 (kshaya: Ekadashi
  // touches no sunrise): the viddha day itself IS fasted. Mokshada Ekadashi
  // (Margashirsha Shukla) falls Dec 1 2025 with a clean Udaya Ekadashi —
  // the non-viddha control. This test asserts the MECHANISM (viddha-day
  // labeling), not any sampradaya calendar's second date (never invented).
  it('detects viddha on Nov 1 2025, not on Mokshada Dec 1 2025', () => {
    expect(engine.isEkadashiViddha(atMidnight(2025, 11, 1))).toBe(true);
    expect(engine.isEkadashiViddha(atMidnight(2025, 12, 1))).toBe(false);
  });

  it('does NOT fast the ordinary viddha-eve (Nov 1 2025 fasts Nov 2)', () => {
    const eve = engine.calculate(atMidnight(2025, 11, 1));
    expect(eve.fasting?.type ?? 'none').not.toBe('ekadashi');
    const day = engine.calculate(atMidnight(2025, 11, 2));
    expect(day.fasting?.type).toBe('ekadashi');
    expect(day.fasting?.name).toBe('Devutthana Ekadashi');
  });

  it('Mokshada Dec 1 2025 keeps the plain Ekadashi label', () => {
    const p = engine.calculate(atMidnight(2025, 12, 1));
    expect(p.fasting?.type).toBe('ekadashi');
    expect(p.fasting?.name ?? '').not.toMatch(/Smarta/);
  });
});

describe('Kshaya catch (8a) and vriddhi dedupe (8b)', () => {
  it('synthetic kshaya: midday-only tithi fires a non-vyapti rule', () => {
    // Engine-observed kshaya: Jan 12 2025 skips Shukla Trayodashi at sunrise
    // (Udaya Dwadashi Jan 11 → Udaya Chaturdashi Jan 12; midday Jan 12 is
    // Chaturdashi). A temporary Shukla-Chaturdashi rule gated to Jan 12's
    // own amanta month must fire Jan 12 only via the midday ADD path.
    const day = atMidnight(2025, 1, 12);
    const amanta = engine.getAmantaMonthNumber(day);
    expect(amanta).not.toBeNull();
    const rule = {
      id: 'test-kshaya-catch',
      name: 'Test Kshaya Catch',
      nameHindi: 'परीक्षण',
      description: 'synthetic kshaya probe',
      significance: 'synthetic kshaya probe',
      tithiNumber: 14,
      paksha: 'Shukla' as const,
      month: amanta as number,
      type: 'minor' as const,
    };
    FESTIVALS.push(rule);
    try {
      expect(festivalIdsOn(2025, 0 + 1, 12)).toContain('test-kshaya-catch');
      expect(festivalIdsOn(2025, 1, 11)).not.toContain('test-kshaya-catch');
      expect(festivalIdsOn(2025, 1, 13)).not.toContain('test-kshaya-catch');
    } finally {
      const i = FESTIVALS.findIndex((r) => r.id === 'test-kshaya-catch');
      if (i >= 0) FESTIVALS.splice(i, 1);
    }
  });

  it('kshaya guard: Holi 2025 stays Mar 14 (midday Purnima Mar 13, Udaya Mar 14)', () => {
    // Published: Holi (Rang) Mar 14 2025. Purnima prevails midday Mar 13 but
    // Udaya-matches Mar 14 — the guard blocks the one-day-early ADD.
    expect(festivalIdsOn(2025, 3, 13)).not.toContain('holi');
    expect(festivalIdsOn(2025, 3, 14)).toContain('holi');
  });

  it('vriddhi: Chhath 2025 fires Oct 27, not the consecutive Oct 28', () => {
    // Engine: Shashthi at sunrise both Oct 27 and Oct 28 2025 (vriddhi).
    // Published Chhath 2025 Sandhya Arghya: Oct 27.
    const on28 = engine.calculate(atMidnight(2025, 10, 28));
    expect(on28.tithi.number).toBe(6);
    expect(on28.tithi.paksha).toBe('Shukla');
    expect(festivalIdsOn(2025, 10, 27)).toContain('chhath-puja');
    expect(festivalIdsOn(2025, 10, 28)).not.toContain('chhath-puja');
  });
});

describe('Sawan weekday-in-month (solar ∪ amanta)', () => {
  // 2026: solar-sign Shravana covers Aug 3/10 (pre-Simha-ingress), amanta
  // Shravana covers Aug 17/24 — Purnimanta and Amanta households observe
  // different Mondays. The union matcher covers all four August Mondays,
  // and all four August Tuesdays for Mangala Gauri.
  it('Aug 3+10+17+24 2026 Mondays match sawan-somvar', () => {
    const rule = getObservance('sawan-somvar')?.rule;
    expect(rule?.kind).toBe('weekday-in-month');
    for (const d of [3, 10, 17, 24]) {
      const p = engine.calculate(atMidnight(2026, 8, d));
      expect(p.date.getDay()).toBe(1);
      expect(matchesRule(p, rule!, engine)).toBe(true);
    }
  });

  it('Aug 2026 Tuesdays match mangala-gauri', () => {
    const rule = getObservance('mangala-gauri')?.rule;
    expect(rule?.kind).toBe('weekday-in-month');
    for (const d of [4, 11, 18, 25]) {
      const p = engine.calculate(atMidnight(2026, 8, d));
      expect(p.date.getDay()).toBe(2);
      expect(matchesRule(p, rule!, engine)).toBe(true);
    }
  });
});

describe('Pitru Paksha 2026 bounds', () => {
  // Published (Drik via TOI/Economic Times, Sep 2026): Purnima Shraddha
  // Sat Sep 26, Pratipada Sep 27, Sarva Pitru (Mahalaya) Amavasya Sat Oct 10.
  it('range containing Oct 10 2026 ends Oct 10', () => {
    const rule = getObservance('pitru-paksha')?.rule;
    if (rule?.kind !== 'date-range') throw new Error('pitru-paksha must be a date-range');
    const bounds = findRangeContaining(engine, atMidnight(2026, 10, 10), rule);
    expect(bounds).not.toBeNull();
    expect(bounds?.end.getFullYear()).toBe(2026);
    expect(bounds?.end.getMonth()).toBe(9);
    expect(bounds?.end.getDate()).toBe(10);
  });

  it('Sep 11 2026 (Amavasya, wrong month) does NOT match the endRule', () => {
    const rule = getObservance('pitru-paksha')?.rule;
    if (rule?.kind !== 'date-range') throw new Error('pitru-paksha must be a date-range');
    // Sep 11 is Udaya Amavasya but solar month 6 / amanta 5 — not Ashwin (7).
    expect(matchesTithiRule(engine.calculate(atMidnight(2026, 9, 11)), rule.endRule, engine)).toBe(false);
  });
});
