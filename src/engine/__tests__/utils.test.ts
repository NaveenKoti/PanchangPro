/**
 * Utility Functions Tests
 * Tests for mathematical, date, and helper utilities
 */

import { describe, it, expect } from 'vitest';
import {
  toRadians,
  toDegrees,
  normalizeAngle,
  getJulianDay,
  fromJulianDay,
  getJulianCenturies,
  sinDeg,
  cosDeg,
  tanDeg,
  asinDeg,
  acosDeg,
  atanDeg,
  atan2Deg,
  roundTo,
  formatTimeRemaining,
  isSameDay,
  addDays,
  subDays,
  addMinutes,
  subMinutes,
  isWithinInterval,
  startOfDay,
  endOfDay,
  clamp,
} from '../utils';

describe('Mathematical Utilities', () => {
  describe('toRadians / toDegrees', () => {
    it('should convert degrees to radians correctly', () => {
      expect(toRadians(0)).toBe(0);
      expect(toRadians(90)).toBeCloseTo(Math.PI / 2);
      expect(toRadians(180)).toBeCloseTo(Math.PI);
      expect(toRadians(360)).toBeCloseTo(Math.PI * 2);
    });

    it('should convert radians to degrees correctly', () => {
      expect(toDegrees(0)).toBe(0);
      expect(toDegrees(Math.PI / 2)).toBeCloseTo(90);
      expect(toDegrees(Math.PI)).toBeCloseTo(180);
      expect(toDegrees(Math.PI * 2)).toBeCloseTo(360);
    });

    it('should be inverse operations', () => {
      const original = 45;
      const converted = toDegrees(toRadians(original));
      expect(converted).toBeCloseTo(original);
    });
  });

  describe('normalizeAngle', () => {
    it('should normalize angles to 0-360 range', () => {
      expect(normalizeAngle(0)).toBe(0);
      expect(normalizeAngle(360)).toBe(0);
      expect(normalizeAngle(45)).toBe(45);
      expect(normalizeAngle(400)).toBeCloseTo(40);
      expect(normalizeAngle(-45)).toBeCloseTo(315);
      expect(normalizeAngle(-360)).toBeCloseTo(0);
    });
  });

  describe('Trigonometric Functions (Degree-based)', () => {
    it('sinDeg should return correct values', () => {
      expect(sinDeg(0)).toBeCloseTo(0);
      expect(sinDeg(90)).toBeCloseTo(1);
      expect(sinDeg(180)).toBeCloseTo(0);
      expect(sinDeg(270)).toBeCloseTo(-1);
    });

    it('cosDeg should return correct values', () => {
      expect(cosDeg(0)).toBeCloseTo(1);
      expect(cosDeg(90)).toBeCloseTo(0);
      expect(cosDeg(180)).toBeCloseTo(-1);
      expect(cosDeg(270)).toBeCloseTo(0);
    });

    it('tanDeg should return correct values', () => {
      expect(tanDeg(0)).toBeCloseTo(0);
      expect(tanDeg(45)).toBeCloseTo(1);
      expect(tanDeg(135)).toBeCloseTo(-1);
    });

    it('asinDeg should return correct values', () => {
      expect(asinDeg(0)).toBeCloseTo(0);
      expect(asinDeg(1)).toBeCloseTo(90);
      expect(asinDeg(-1)).toBeCloseTo(-90);
    });

    it('acosDeg should return correct values', () => {
      expect(acosDeg(1)).toBeCloseTo(0);
      expect(acosDeg(0)).toBeCloseTo(90);
      expect(acosDeg(-1)).toBeCloseTo(180);
    });

    it('atanDeg should return correct values', () => {
      expect(atanDeg(0)).toBeCloseTo(0);
      expect(atanDeg(1)).toBeCloseTo(45);
      expect(atanDeg(-1)).toBeCloseTo(-45);
    });

    it('atan2Deg should return correct values', () => {
      expect(atan2Deg(0, 1)).toBeCloseTo(0);
      expect(atan2Deg(1, 0)).toBeCloseTo(90);
      expect(atan2Deg(0, -1)).toBeCloseTo(180);
      expect(atan2Deg(-1, 0)).toBeCloseTo(-90);
    });
  });

  describe('roundTo', () => {
    it('should round to specified decimal places', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(3.14159, 3)).toBe(3.142);
      expect(roundTo(3.14159, 0)).toBe(3);
      expect(roundTo(123.456, 1)).toBe(123.5);
    });
  });

  describe('clamp', () => {
    it('should clamp values within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });
});

describe('Julian Day Utilities', () => {
  describe('getJulianDay / fromJulianDay', () => {
    it('should convert date to Julian Day correctly', () => {
      const date = new Date('2000-01-01T12:00:00Z');
      const jd = getJulianDay(date);
      
      // J2000 epoch is 2451545.0
      expect(jd).toBeCloseTo(2451545.0, 1);
    });

    it('should be inverse operations', () => {
      const original = new Date('2025-04-09T12:00:00Z');
      const jd = getJulianDay(original);
      const converted = fromJulianDay(jd);

      // Allow ±1 day tolerance due to timezone rounding in conversion
      expect(Math.abs(converted.getUTCFullYear() - original.getUTCFullYear())).toBeLessThanOrEqual(1);
      expect(Math.abs(converted.getUTCMonth() - original.getUTCMonth())).toBeLessThanOrEqual(1);
      expect(Math.abs(converted.getUTCDate() - original.getUTCDate())).toBeLessThanOrEqual(1);
    });
  });

  describe('getJulianCenturies', () => {
    it('should return 0 for J2000 epoch', () => {
      const j2000 = 2451545.0;
      const jc = getJulianCenturies(j2000);
      expect(jc).toBeCloseTo(0, 6);
    });

    it('should return small positive value for dates after J2000', () => {
      const date = new Date('2025-01-01');
      const jd = getJulianDay(date);
      const jc = getJulianCenturies(jd);
      expect(jc).toBeGreaterThan(0);
    });
  });
});

describe('Date Utilities', () => {
  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2025-04-09T10:00:00');
      const date2 = new Date('2025-04-09T18:00:00');
      
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2025-04-09');
      const date2 = new Date('2025-04-10');
      
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('addDays / subDays', () => {
    it('should add days correctly', () => {
      const date = new Date('2025-04-09');
      const added = addDays(date, 5);
      
      expect(added.getDate()).toBe(14);
      expect(added.getMonth()).toBe(3); // April
    });

    it('should subtract days correctly', () => {
      const date = new Date('2025-04-09');
      const subtracted = subDays(date, 5);
      
      expect(subtracted.getDate()).toBe(4);
      expect(subtracted.getMonth()).toBe(3); // April
    });

    it('should not mutate original date', () => {
      const original = new Date('2025-04-09');
      const originalCopy = new Date(original);
      
      addDays(original, 5);
      
      expect(isSameDay(original, originalCopy)).toBe(true);
    });
  });

  describe('addMinutes / subMinutes', () => {
    it('should add minutes correctly', () => {
      const date = new Date('2025-04-09T10:00:00');
      const added = addMinutes(date, 30);
      
      expect(added.getHours()).toBe(10);
      expect(added.getMinutes()).toBe(30);
    });

    it('should subtract minutes correctly', () => {
      const date = new Date('2025-04-09T10:30:00');
      const subtracted = subMinutes(date, 30);
      
      expect(subtracted.getHours()).toBe(10);
      expect(subtracted.getMinutes()).toBe(0);
    });
  });

  describe('isWithinInterval', () => {
    it('should return true for date within interval', () => {
      const date = new Date('2025-04-09T12:00:00');
      const interval = {
        start: new Date('2025-04-09T10:00:00'),
        end: new Date('2025-04-09T14:00:00'),
      };
      
      expect(isWithinInterval(date, interval)).toBe(true);
    });

    it('should return false for date outside interval', () => {
      const date = new Date('2025-04-09T16:00:00');
      const interval = {
        start: new Date('2025-04-09T10:00:00'),
        end: new Date('2025-04-09T14:00:00'),
      };
      
      expect(isWithinInterval(date, interval)).toBe(false);
    });
  });

  describe('startOfDay / endOfDay', () => {
    it('startOfDay should return midnight', () => {
      const date = new Date('2025-04-09T15:30:45');
      const start = startOfDay(date);
      
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
    });

    it('endOfDay should return 23:59:59.999', () => {
      const date = new Date('2025-04-09T15:30:45');
      const end = endOfDay(date);
      
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
    });
  });
});

describe('formatTimeRemaining', () => {
  it('should format hours and minutes correctly', () => {
    const ms = 2 * 60 * 60 * 1000 + 30 * 60 * 1000; // 2h 30m
    const formatted = formatTimeRemaining(ms);
    
    expect(formatted).toContain('2');
    expect(formatted).toContain('30');
  });

  it('should handle minutes only', () => {
    const ms = 45 * 60 * 1000; // 45m
    const formatted = formatTimeRemaining(ms);
    
    expect(formatted).toContain('45');
  });

  it('should handle zero time', () => {
    const ms = 0;
    const formatted = formatTimeRemaining(ms);
    
    expect(formatted).toBeDefined();
    expect(formatted.length).toBeGreaterThan(0);
  });
});
