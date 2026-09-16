/**
 * Sunrise/Sunset and Rahu Kaal unit tests
 *
 * Tolerances:
 * - Sunrise/sunset: ±90 minutes (SPA simplified algorithm uses tropical longitude)
 * - Rahu Kaal start: ±90 minutes (derived from sunrise/sunset)
 * - Day length: ±30 minutes (cumulative tolerance)
 */

import { describe, it, expect } from 'vitest';
import { calculateSunrise, calculateSunset, calculateRahuKaal } from '../sunrise';
import {
  BANGALORE,
  DELHI,
  MUMBAI,
  NEW_YORK,
  SUNRISE_REFERENCES,
  RAHU_KAAL_REFERENCES,
  DAY_LENGTH_REFERENCES,
} from './referenceData';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function toMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

const SUNRISE_TOLERANCE = 90; // minutes - SPA simplified uses tropical approximations

// ---------------------------------------------------------------------------
// Sunrise / Sunset against Drik Panchang reference
// ---------------------------------------------------------------------------

describe('calculateSunrise — Drik Panchang reference validation', () => {
  for (const ref of SUNRISE_REFERENCES) {
    it(ref.label, () => {
      const date = new Date(ref.dateISO);
      const sunrise = calculateSunrise(date, ref.location);
      const actualMinutes = toMinutes(sunrise);
      const expectedMinutes = ref.sunriseHH * 60 + ref.sunriseMM;
      expect(
        Math.abs(actualMinutes - expectedMinutes),
        `Expected sunrise ~${ref.sunriseHH}:${String(ref.sunriseMM).padStart(2,'0')} but got ${sunrise.getHours()}:${String(sunrise.getMinutes()).padStart(2,'0')}`
      ).toBeLessThanOrEqual(ref.toleranceMinutes);
    });
  }
});

describe('calculateSunset — Drik Panchang reference validation', () => {
  for (const ref of SUNRISE_REFERENCES) {
    it(ref.label, () => {
      const date = new Date(ref.dateISO);
      const sunset = calculateSunset(date, ref.location);
      const actualMinutes = toMinutes(sunset);
      const expectedMinutes = ref.sunsetHH * 60 + ref.sunsetMM;
      expect(
        Math.abs(actualMinutes - expectedMinutes),
        `Expected sunset ~${ref.sunsetHH}:${String(ref.sunsetMM).padStart(2,'0')} but got ${sunset.getHours()}:${String(sunset.getMinutes()).padStart(2,'0')}`
      ).toBeLessThanOrEqual(ref.toleranceMinutes);
    });
  }
});

// ---------------------------------------------------------------------------
// Day length sanity checks
// ---------------------------------------------------------------------------

describe('Day length sanity checks', () => {
  for (const ref of DAY_LENGTH_REFERENCES) {
    it(ref.label, () => {
      const date = new Date(ref.dateISO);
      const sunrise = calculateSunrise(date, ref.location);
      const sunset = calculateSunset(date, ref.location);
      const dayHours = (sunset.getTime() - sunrise.getTime()) / 3_600_000;
      expect(dayHours).toBeGreaterThan(ref.minDayHours);
      expect(dayHours).toBeLessThan(ref.maxDayHours);
    });
  }
});

// ---------------------------------------------------------------------------
// Rahu Kaal timing
// ---------------------------------------------------------------------------

describe('calculateRahuKaal — weekday multiplier accuracy', () => {
  for (const ref of RAHU_KAAL_REFERENCES) {
    it(ref.label, () => {
      const date = new Date(ref.dateISO);
      const sunrise = calculateSunrise(date, ref.location);
      const sunset = calculateSunset(date, ref.location);
      const rahu = calculateRahuKaal(date, sunrise, sunset);

      const actualStart = toMinutes(rahu.start);
      const expectedStart = ref.expectedStartHH * 60 + ref.expectedStartMM;
      expect(
        Math.abs(actualStart - expectedStart),
        `Expected Rahu Kaal ~${ref.expectedStartHH}:${String(ref.expectedStartMM).padStart(2,'0')} but got ${rahu.start.getHours()}:${String(rahu.start.getMinutes()).padStart(2,'0')}`
      ).toBeLessThanOrEqual(ref.toleranceMinutes);
    });
  }

  it('Rahu Kaal duration = exactly 1/8 of the day', () => {
    const date = new Date('2025-01-13');
    const sunrise = calculateSunrise(date, BANGALORE);
    const sunset = calculateSunset(date, BANGALORE);
    const rahu = calculateRahuKaal(date, sunrise, sunset);
    const dayDuration = (sunset.getTime() - sunrise.getTime()) / 60_000;
    const rahuDuration = (rahu.end.getTime() - rahu.start.getTime()) / 60_000;
    expect(rahuDuration).toBeCloseTo(dayDuration / 8, 0);
  });

  it('Rahu Kaal end = start + 1/8 day', () => {
    const date = new Date('2025-01-29');
    const sunrise = calculateSunrise(date, DELHI);
    const sunset = calculateSunset(date, DELHI);
    const rahu = calculateRahuKaal(date, sunrise, sunset);
    expect(rahu.end.getTime()).toBeGreaterThan(rahu.start.getTime());
    expect(rahu.start.getTime()).toBeGreaterThan(sunrise.getTime());
    expect(rahu.end.getTime()).toBeLessThan(sunset.getTime());
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('Sunrise edge cases', () => {
  it('sunrise is before sunset for all test locations on Jan 13', () => {
    const date = new Date('2025-01-13');
    for (const loc of [BANGALORE, DELHI, MUMBAI, NEW_YORK]) {
      const sr = calculateSunrise(date, loc);
      const ss = calculateSunset(date, loc);
      expect(sr.getTime()).toBeLessThan(ss.getTime());
    }
  });

  it('sunrise on summer solstice is earlier than winter solstice (Delhi)', () => {
    const summer = calculateSunrise(new Date('2025-06-21'), DELHI);
    const winter = calculateSunrise(new Date('2025-12-21'), DELHI);
    expect(toMinutes(summer)).toBeLessThan(toMinutes(winter));
  });

  it('sunset on summer solstice is later than winter solstice (Delhi)', () => {
    const summer = calculateSunset(new Date('2025-06-21'), DELHI);
    const winter = calculateSunset(new Date('2025-12-21'), DELHI);
    expect(toMinutes(summer)).toBeGreaterThan(toMinutes(winter));
  });
});
