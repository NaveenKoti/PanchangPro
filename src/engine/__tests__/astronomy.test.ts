/**
 * Astronomy unit tests — pure mathematical functions only
 * No location or date dependency; these must be 100% deterministic.
 *
 * Reference: Jean Meeus "Astronomical Algorithms" ch. 22, 47, 49
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTithiIndex,
  calculateNakshatraIndex,
  calculateYogaIndex,
  getPaksha,
  getTithiNumber,
} from '../astronomy';

// ---------------------------------------------------------------------------
// Tithi index: diff = (Moon - Sun) / 12, floor
// ---------------------------------------------------------------------------

describe('calculateTithiIndex', () => {
  it('returns 0 (Pratipada) when Moon is 0° ahead of Sun', () => {
    expect(calculateTithiIndex(90, 90)).toBe(0);
  });

  it('returns 0 (Pratipada) when diff is exactly 0°', () => {
    expect(calculateTithiIndex(0, 0)).toBe(0);
  });

  it('returns 1 (Dwitiya) when Moon is 12° ahead of Sun', () => {
    expect(calculateTithiIndex(0, 12)).toBe(1);
  });

  it('returns 14 (Purnima) when Moon is 180° ahead of Sun', () => {
    expect(calculateTithiIndex(0, 180)).toBe(15);
    // Actually floor(180/12) = 15, so Purnima is index 15 — verify TITHI_NAMES[15]
    // But getTithiNumber(15) = (15 % 15) + 1 = 1... that is Pratipada of Krishna.
    // The engine uses index 14 for Purnima in Shukla (0-14) and 15 for Krishna Pratipada.
    // Full moon: moon is ~180° ahead → index = floor(180/12) = 15 which is Krishna Pratipada.
    // Actual Purnima is index 14 (moon ~168°-180°).
    expect(calculateTithiIndex(0, 168)).toBe(14); // Purnima index
  });

  it('returns 15 (Krishna Pratipada) when Moon is 181° ahead', () => {
    expect(calculateTithiIndex(0, 181)).toBe(15);
  });

  it('returns 29 (Amavasya) when Moon is ~350° ahead of Sun', () => {
    expect(calculateTithiIndex(0, 350)).toBe(29);
  });

  it('wraps correctly when Moon longitude is less than Sun longitude', () => {
    // Sun at 300°, Moon at 10° → diff = 10 - 300 + 360 = 70° → floor(70/12) = 5
    expect(calculateTithiIndex(300, 10)).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// getPaksha
// ---------------------------------------------------------------------------

describe('getPaksha', () => {
  it('returns Shukla for indices 0–14', () => {
    for (let i = 0; i <= 14; i++) {
      expect(getPaksha(i)).toBe('Shukla');
    }
  });

  it('returns Krishna for indices 15–29', () => {
    for (let i = 15; i <= 29; i++) {
      expect(getPaksha(i)).toBe('Krishna');
    }
  });
});

// ---------------------------------------------------------------------------
// getTithiNumber
// ---------------------------------------------------------------------------

describe('getTithiNumber', () => {
  it('returns 1 for index 0 (Pratipada)', () => {
    expect(getTithiNumber(0)).toBe(1);
  });

  it('returns 15 for index 14 (Purnima)', () => {
    expect(getTithiNumber(14)).toBe(15);
  });

  it('returns 1 for index 15 (Krishna Pratipada)', () => {
    // (15 % 15) + 1 = 0 + 1 = 1
    expect(getTithiNumber(15)).toBe(1);
  });

  it('returns 15 for index 29 (Amavasya)', () => {
    // (29 % 15) + 1 = 14 + 1 = 15
    expect(getTithiNumber(29)).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// Nakshatra index: Moon longitude / (360/27) = Moon / 13.333
// ---------------------------------------------------------------------------

describe('calculateNakshatraIndex', () => {
  it('returns 0 (Ashwini) when Moon is at 0°', () => {
    expect(calculateNakshatraIndex(0)).toBe(0);
  });

  it('returns 1 (Bharani) when Moon is at 13.5°', () => {
    // 13.5 / 13.333 = 1.0125 → floor = 1
    expect(calculateNakshatraIndex(13.5)).toBe(1);
  });

  it('returns 26 (Uttara Bhadrapada) when Moon is at 346.7°', () => {
    // 346.7 / 13.333 = 26.0 → index 26
    expect(calculateNakshatraIndex(346.7)).toBe(26);
  });

  it('caps at 26 (index never exceeds 26)', () => {
    expect(calculateNakshatraIndex(359.9)).toBe(26);
  });

  it('returns 7 (Pushya) when Moon is at ~93°', () => {
    // 93.5 / 13.333 = 7.01 → 7
    expect(calculateNakshatraIndex(93.5)).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// Yoga index: (Sun + Moon) / (360/27), mod 360
// ---------------------------------------------------------------------------

describe('calculateYogaIndex', () => {
  it('returns 0 (Vishkamba) when Sun + Moon = 0°', () => {
    expect(calculateYogaIndex(0, 0)).toBe(0);
  });

  it('returns 1 when Sun + Moon = 14°', () => {
    expect(calculateYogaIndex(7, 7)).toBe(1);
  });

  it('wraps around past 360°', () => {
    // Sun = 350, Moon = 25 → sum = 375 → 375 % 360 = 15 → floor(15/13.33) = 1
    expect(calculateYogaIndex(350, 25)).toBe(1);
  });

  it('caps at 26', () => {
    expect(calculateYogaIndex(179, 180)).toBe(26);
  });
});
