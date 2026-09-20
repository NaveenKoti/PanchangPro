/**
 * Vyapti (observance-moment) regression tests.
 *
 * Udaya-tithi matching alone misdates festivals whose shastra prescribes
 * another moment of the day. Each case cites its external source.
 */

import { describe, it, expect } from 'vitest';
import { PanchangEngine } from '../panchang';
import { DELHI } from './referenceData';

const engine = new PanchangEngine(DELHI);

function atMidnight(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d);
}

describe('Ganesh Chaturthi is Madhyahna-vyapini', () => {
  it('2026: Sep 14 has it, Sep 15 does not (TOI Sep 12 2026, Outlook Sep 13 2026)', () => {
    // Chaturthi Sep 14 07:06 → Sep 15 07:44 IST; Madhyahna falls on the 14th.
    const on14 = engine.calculate(atMidnight(2026, 9, 14));
    expect(on14.festivals.some((f) => f.id === 'ganesh-chaturthi')).toBe(true);
    const on15 = engine.calculate(atMidnight(2026, 9, 15));
    expect(on15.festivals.some((f) => f.id === 'ganesh-chaturthi')).toBe(false);
  });

  it('2025: Aug 27 has it, Aug 28 does not (observed Aug 27 across calendars)', () => {
    const on27 = engine.calculate(atMidnight(2025, 8, 27));
    expect(on27.festivals.some((f) => f.id === 'ganesh-chaturthi')).toBe(true);
    const on28 = engine.calculate(atMidnight(2025, 8, 28));
    expect(on28.festivals.some((f) => f.id === 'ganesh-chaturthi')).toBe(false);
  });
});

describe('Maha Shivratri is Nishita-vyapini', () => {
  it('2026: Feb 15 has it, Feb 16 does not (TOI Feb 12 2026, IndiaTV: Chaturdashi Feb 15 17:04 → Feb 16 17:34)', () => {
    // TOI explicitly: Shivratri "does not follow the Udaya Tithi rule".
    const on15 = engine.calculate(atMidnight(2026, 2, 15));
    expect(on15.festivals.some((f) => f.id === 'maha-shivratri')).toBe(true);
    const on16 = engine.calculate(atMidnight(2026, 2, 16));
    expect(on16.festivals.some((f) => f.id === 'maha-shivratri')).toBe(false);
  });
});

describe('Pradosh is sunset-vyapini (first evening)', () => {
  it('fires when Trayodashi begins mid-day: Sat Jan 11 2025 Shani Pradosh', () => {
    // Udaya Dwadashi, sunset Trayodashi → evening vrat (previously missed).
    const p = engine.calculate(atMidnight(2025, 1, 11));
    expect(p.fasting?.id).toBe('shani-pradosh');
  });

  it('fires Tue Feb 25 2025 Bhauma Pradosh, not Wed Feb 26 (Trayodashi ends before sunset)', () => {
    expect(engine.calculate(atMidnight(2025, 2, 25)).fasting?.id).toBe('bhauma-pradosh');
    const next = engine.calculate(atMidnight(2025, 2, 26));
    expect(next.fasting?.id ?? 'none').not.toMatch(/pradosh/);
  });

  it('fires Tue Mar 11 2025 Bhauma Pradosh, not Wed Mar 12', () => {
    expect(engine.calculate(atMidnight(2025, 3, 11)).fasting?.id).toBe('bhauma-pradosh');
    const next = engine.calculate(atMidnight(2025, 3, 12));
    expect(next.fasting?.id ?? 'none').not.toMatch(/pradosh/);
  });

  it('regression: Mon Jun 23 2025 stays Soma Pradosh; Jun 9 has none (was Udaya-misdated)', () => {
    // Times Now Jun 2025: Shukla Pradosh observed Jun 8 (Trayodashi ends Jun 9 09:35,
    // before sunset), Krishna/Soma Pradosh Jun 23 (Trayodashi 01:21 → 22:09).
    expect(engine.calculate(atMidnight(2025, 6, 23)).fasting?.id).toBe('soma-pradosh');
    expect(engine.calculate(atMidnight(2025, 6, 9)).fasting?.id ?? 'none').not.toMatch(/pradosh/);
  });
});

describe('Dussehra is Aparahna-vyapini, purva-viddha (first day)', () => {
  // Dashami Oct 20 13:00 → Oct 21 ~15:00 IST: Aparahna-Dashami on two days,
  // Drik observes the FIRST (Tue Oct 20 2026). Udaya alone says Oct 21.
  it('2026: Oct 20 has it, Oct 21 does not', () => {
    expect(engine.calculate(atMidnight(2026, 10, 20)).festivals.some((f) => f.id === 'dussehra')).toBe(true);
    expect(engine.calculate(atMidnight(2026, 10, 21)).festivals.some((f) => f.id === 'dussehra')).toBe(false);
  });
});

describe('Festival month gating is amanta (no solar-month phantoms)', () => {
  // Sep 21 2026: Udaya Shukla Dashami but amanta Bhadrapada (solar Ashwin
  // flips at Kanya Sankranti Sep 17) — not Dussehra (user-reported: Fasts
  // showed "Dussehra Tomorrow Sep 21").
  it('2026: Sep 21 has no Dussehra', () => {
    expect(engine.calculate(atMidnight(2026, 9, 21)).festivals.some((f) => f.id === 'dussehra')).toBe(false);
  });

  // Sep 26 2026: Udaya Purnima of amanta Bhadrapada — not Sharad Purnima
  // (Ashwin Purnima is Oct 26 2026 per VedJyotix/PanchangBodh/ShubhPanchang).
  it('2026: Sep 26 has no Sharad Purnima; Oct 26 does', () => {
    expect(engine.calculate(atMidnight(2026, 9, 26)).festivals.some((f) => f.id === 'sharad-purnima')).toBe(false);
    expect(engine.calculate(atMidnight(2026, 10, 26)).festivals.some((f) => f.id === 'sharad-purnima')).toBe(true);
  });
});
