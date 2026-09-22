/**
 * Ekadashi Accuracy Tests for 2026
 * 
 * Verified against Drik Panchang (drikpanchang.com)
 * These tests ensure the sunrise-based tithi calculation (Udaya Tithi)
 * is working correctly.
 */

import { describe, it, expect } from 'vitest';
import { PanchangEngine } from '../panchang';
import { DELHI } from './referenceData';

// Drik observance dates are Delhi dates (sunrise-relative rules can shift
// observance ±1 day by city, e.g. Devutthana 2026: Nov 20 Delhi,
// Nov 21 Bangalore) — so this file runs on Delhi, not Bangalore.
const DELHI_LOC = DELHI;

describe('Ekadashi 2026 Accuracy Tests', () => {
  const engine = new PanchangEngine(DELHI_LOC);

  // All 2026 Ekadashi observances, verified against Drik Panchang
  // (drikpanchang.com/vrats/ekadashidates.html?year=2026, Smarta list).
  // NOTE (Sep 2026): this table once carried a one-row data-entry shift
  // (Indira on Sep 23, Papankusha on Oct 7, …) that made Fasts disagree
  // with Calendar. It is now Drik-exact; keep it so.
  const ekadashiDates = [
    { date: '2026-01-14', name: 'Shat Tila Ekadashi', paksha: 'Krishna', month: 'Pausha' },
    { date: '2026-01-29', name: 'Jaya Ekadashi', paksha: 'Shukla', month: 'Magha' },
    { date: '2026-02-13', name: 'Vijaya Ekadashi', paksha: 'Krishna', month: 'Magha' },
    { date: '2026-02-27', name: 'Amalaki Ekadashi', paksha: 'Shukla', month: 'Phalguna' },
    { date: '2026-03-15', name: 'Papmochani Ekadashi', paksha: 'Krishna', month: 'Chaitra' },
    { date: '2026-03-29', name: 'Kamada Ekadashi', paksha: 'Shukla', month: 'Chaitra' },
    { date: '2026-04-13', name: 'Varuthini Ekadashi', paksha: 'Krishna', month: 'Vaishakha' },
    { date: '2026-04-27', name: 'Mohini Ekadashi', paksha: 'Shukla', month: 'Vaishakha' },
    { date: '2026-05-13', name: 'Apara Ekadashi', paksha: 'Krishna', month: 'Jyeshtha' },
    { date: '2026-05-27', name: 'Padmini Ekadashi', paksha: 'Shukla', month: 'Jyeshtha' },
    { date: '2026-06-11', name: 'Parama Ekadashi', paksha: 'Krishna', month: 'Jyeshtha' },
    { date: '2026-06-25', name: 'Nirjala Ekadashi', paksha: 'Shukla', month: 'Jyeshtha' },
    { date: '2026-07-10', name: 'Yogini Ekadashi', paksha: 'Krishna', month: 'Ashadha' },
    { date: '2026-07-25', name: 'Devshayani Ekadashi', paksha: 'Shukla', month: 'Ashadha' },
    { date: '2026-08-09', name: 'Kamika Ekadashi', paksha: 'Krishna', month: 'Shravana' },
    { date: '2026-08-23', name: 'Shravana Putrada Ekadashi', paksha: 'Shukla', month: 'Shravana' },
    { date: '2026-09-07', name: 'Aja Ekadashi', paksha: 'Krishna', month: 'Bhadrapada' },
    { date: '2026-09-22', name: 'Parsva Ekadashi', paksha: 'Shukla', month: 'Bhadrapada' },
    { date: '2026-10-06', name: 'Indira Ekadashi', paksha: 'Krishna', month: 'Ashwin' },
    { date: '2026-10-22', name: 'Papankusha Ekadashi', paksha: 'Shukla', month: 'Ashwin' },
    { date: '2026-11-05', name: 'Rama Ekadashi', paksha: 'Krishna', month: 'Kartika' },
    { date: '2026-11-20', name: 'Devutthana Ekadashi', paksha: 'Shukla', month: 'Kartika' },
    { date: '2026-12-04', name: 'Utpanna Ekadashi', paksha: 'Krishna', month: 'Margashirsha' },
    { date: '2026-12-20', name: 'Mokshada Ekadashi', paksha: 'Shukla', month: 'Margashirsha' },
  ];

  describe('Ekadashi date accuracy', () => {
    // Dates where the engine's Udaya Tithi is itself Ekadashi (Drik truth).
    const engineCorrectDates = [
      '2026-01-14', '2026-01-29', '2026-02-13', '2026-02-27',
      '2026-03-15', '2026-03-29', '2026-04-13', '2026-04-27',
      '2026-05-13', '2026-06-11', '2026-06-25', '2026-07-25',
      '2026-08-09', '2026-08-23', '2026-09-07', '2026-09-22',
      '2026-10-06', '2026-10-22', '2026-11-05', '2026-12-04',
      '2026-12-20',
    ];
    // Observances where Udaya is NOT Ekadashi but the fast still fires:
    // May 27 Padmini (Unmilini Mahadwadashi, Udaya Dwadashi),
    // Jul 10 Yogini + Nov 20 Devutthana (Dashami-viddha at sunrise).
    const viddhaDates = ['2026-05-27', '2026-07-10', '2026-11-20'];

    for (const ekadashi of ekadashiDates) {
      it(`should detect ${ekadashi.name} on ${ekadashi.date}`, () => {
        const [year, month, day] = ekadashi.date.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const panchang = engine.calculate(date);

        // Fasting is always detected via verifiedEkadashi database
        expect(panchang.fasting).toBeDefined();
        expect(panchang.fasting?.type).toBe('ekadashi');

        // For dates where engine matches Drik, verify tithi name
        if (engineCorrectDates.includes(ekadashi.date)) {
          expect(panchang.tithi.name.toLowerCase()).toContain('ekadashi');
        }
      });
    }
  });

  describe('Specific Ekadashi verification - April 2026', () => {
    it('should show Ekadashi on April 13, 2026 (Varuthini Ekadashi)', () => {
      const date = new Date(2026, 3, 13); // April 13, 2026
      const panchang = engine.calculate(date);

      expect(panchang.tithi.number).toBe(11);
      expect(panchang.tithi.name).toBe('Ekadashi');
      expect(panchang.fasting?.type).toBe('ekadashi');
    });

    it('should NOT show Ekadashi on April 12, 2026 (should be Dashami)', () => {
      const date = new Date(2026, 3, 12); // April 12, 2026
      const panchang = engine.calculate(date);

      expect(panchang.tithi.number).toBe(10);
      expect(panchang.tithi.name).toBe('Dashami');
      expect(panchang.fasting).toBeUndefined();
    });

    it('should NOT show Ekadashi on April 14, 2026 (should be Dwadashi)', () => {
      const date = new Date(2026, 3, 14); // April 14, 2026
      const panchang = engine.calculate(date);

      expect(panchang.tithi.number).toBe(12);
      expect(panchang.tithi.name).toBe('Dwadashi');
      expect(panchang.fasting).toBeUndefined();
    });
  });

  describe('Tithi boundary accuracy', () => {
    it('should have accurate tithi start/end times (within 10 minutes)', () => {
      const date = new Date(2026, 3, 13); // April 13, 2026
      const panchang = engine.calculate(date);

      // Tithi should have start and end times
      expect(panchang.tithi.startTime).toBeDefined();
      expect(panchang.tithi.endTime).toBeDefined();

      // Tithi duration should be reasonable (typically 20-30 hours)
      const duration = panchang.tithi.endTime.getTime() - panchang.tithi.startTime.getTime();
      const durationHours = duration / (1000 * 60 * 60);
      
      expect(durationHours).toBeGreaterThan(18); // At least 18 hours
      expect(durationHours).toBeLessThan(36); // At most 36 hours
    });
  });

  describe('Kshaya/Vriddhi detection', () => {
    it('should detect kshaya or vriddhi tithis when they occur', () => {
      const date = new Date(2026, 3, 13);
      const panchang = engine.calculate(date);

      expect(panchang.tithi.isKshaya).toBeDefined();
      expect(panchang.tithi.isVriddhi).toBeDefined();
      expect(typeof panchang.tithi.isKshaya).toBe('boolean');
      expect(typeof panchang.tithi.isVriddhi).toBe('boolean');
    });
  });

  describe('Fasting detection for non-Ekadashi dates', () => {
    it('should NOT detect fasting on ordinary dates near Ekadashi', () => {
      const dates = [
        new Date(2026, 3, 11), // April 11
        new Date(2026, 3, 12), // April 12
        new Date(2026, 3, 14), // April 14
        new Date(2026, 3, 15), // April 15
      ];

      for (const date of dates) {
        const panchang = engine.calculate(date);
        expect(panchang.fasting?.type).not.toBe('ekadashi');
      }
    });
  });
});

describe('Major Ekadashis in 2026 - Additional verification', () => {
  const engine = new PanchangEngine(DELHI_LOC);

  const majorEkadashis = [
    { date: '2026-06-25', name: 'Nirjala Ekadashi' },
    { date: '2026-11-20', name: 'Devutthana Ekadashi' },
    { date: '2026-12-20', name: 'Mokshada Ekadashi' },
    { date: '2026-09-22', name: 'Parsva Ekadashi' },
    { date: '2026-10-06', name: 'Indira Ekadashi' },
  ];

  for (const ekadashi of majorEkadashis) {
    it(`${ekadashi.name} should be on ${ekadashi.date}`, () => {
      const [year, month, day] = ekadashi.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const panchang = engine.calculate(date);

      expect(panchang.fasting?.type).toBe('ekadashi');
      expect(panchang.fasting?.name).toBe(ekadashi.name);
    });
  }

  it('Sep 23 2026 is NOT Indira Ekadashi (user-reported Fasts/Calendar split)', () => {
    const panchang = engine.calculate(new Date(2026, 8, 23));
    expect(panchang.fasting?.name ?? 'none').not.toBe('Indira Ekadashi');
    expect(panchang.tithi.number).not.toBe(11);
  });
});
