/**
 * Vaikuntha Ekadashi (Pausha Shukla Ekadashi) tests.
 *
 * Scripture basis: Padma Purana (Mura demon slain by Ekadashi Devi;
 * Vaikuntha Dwara opening) + Bhavishya Purana (Pausa-sukla Ekadasi
 * called Putrada, per ISKCON Juhu citation). Also called Mukkoti /
 * Swargavathil / Pausha Putrada Ekadashi. Deity: Vishnu (Sri Narayana)
 * + Lakshmi. Fasting equivalence: merit of all 24 Ekadashis.
 *
 * Published dates (Drik Panchang): Jan 10 2025 (Fri, plain observance,
 * Udaya Ekadashi); Dec 30 2025 Ekadashi tithi 07:50 Dec 30 -> 05:00
 * Dec 31 with Udaya Dashami on Dec 30, so the Smarta fast is the
 * Dashami-viddha day (Dec 30) and Vaishnavas keep the Dwadashi day
 * (Dec 31, Udaya Dwadashi per Drik ground truth in drikTruth.ts).
 *
 * These tests assert the EXISTING engine mechanism (verified-DB naming
 * + isEkadashiViddha labeling) — no engine logic was changed.
 */

import { describe, it, expect } from 'vitest';
import { PanchangEngine } from '../panchang';
import {
  COMPLETE_EKADASHI_DATA,
  getEkadashiByMonth,
} from '../../data/vedic/completeEkadashiData';
import { DELHI } from './referenceData';

const engine = new PanchangEngine(DELHI);

function atMidnight(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d);
}

describe('Vaikuntha Ekadashi vedic data (24th named Ekadashi)', () => {
  it('exists as the Pausha (month 10) Shukla entry', () => {
    const entry = COMPLETE_EKADASHI_DATA.find((e) => e.id === 'vaikuntha');
    expect(entry).toBeDefined();
    expect(entry!.name).toBe('Vaikuntha Ekadashi');
    expect(entry!.nameHindi).toBe('वैकुंठ एकादशी');
    expect(entry!.month).toBe(10);
    expect(entry!.monthName).toBe('Pausha');
    expect(entry!.paksha).toBe('Shukla');
    expect(entry!.tithiNumber).toBe(11);
  });

  it('names Vishnu (Sri Narayana) + Lakshmi as deity', () => {
    const entry = getEkadashiByMonth(10, 'Shukla');
    expect(entry!.presidingDeity).toMatch(/Vishnu/);
    expect(entry!.presidingDeity).toMatch(/Lakshmi/);
  });

  it('records the Mura / Ekadashi Devi / Vaikuntha Dwara katha and alternate names', () => {
    const entry = getEkadashiByMonth(10, 'Shukla');
    expect(entry!.legend).toMatch(/Mura/);
    expect(entry!.legend).toMatch(/Ekadashi Devi/);
    expect(entry!.legend).toMatch(/Vaikuntha Dwara/);
    const altNames = (entry!.specialObservances ?? []).join(' ');
    expect(altNames).toMatch(/Mukkoti/);
    expect(altNames).toMatch(/Swargavathil/);
    expect(altNames).toMatch(/Pausha Putrada/);
  });

  it('records fasting equivalence with all 24 Ekadashis', () => {
    const entry = getEkadashiByMonth(10, 'Shukla');
    expect(entry!.benefits.join(' ')).toMatch(/all 24 Ekadashis/);
  });

  it('completes the set to 24 named Ekadashis', () => {
    expect(COMPLETE_EKADASHI_DATA).toHaveLength(24);
  });
});

describe('Vaikuntha Ekadashi Jan 10 2025 (plain, non-viddha)', () => {
  it('fires by name via the verified database', () => {
    const p = engine.calculate(atMidnight(2025, 1, 10));
    expect(p.fasting?.type).toBe('ekadashi');
    expect(p.fasting?.name).toBe('Vaikuntha Ekadashi');
  });

  it('is not Dashami-viddha', () => {
    expect(engine.isEkadashiViddha(atMidnight(2025, 1, 10))).toBe(false);
    const p = engine.calculate(atMidnight(2025, 1, 10));
    expect(p.fasting?.name ?? '').not.toMatch(/Smarta/);
  });
});

describe('Vaikuntha Ekadashi Dec 30-31 2025 (Dashami-viddha split)', () => {
  it('Dec 30 labels Smarta-viddha per the existing isEkadashiViddha mechanism', () => {
    expect(engine.isEkadashiViddha(atMidnight(2025, 12, 30))).toBe(true);
    const p = engine.calculate(atMidnight(2025, 12, 30));
    expect(p.fasting?.type).toBe('ekadashi');
    // Computed naming: Pausha Shukla midday Ekadashi = Vaikuntha
    // (Mokshada was Dec 1, Margashirsha Shukla).
    expect(p.fasting?.name).toBe('Vaikuntha Ekadashi');
    expect(p.fasting?.significance).toMatch(/Vaishnavas observe the Dwadashi day/);
  });

  it('Dec 31 carries the Dwadashi-day guidance (Udaya Dwadashi)', () => {
    const p = engine.calculate(atMidnight(2025, 12, 31));
    expect(p.tithi.name).toBe('Dwadashi');
    expect(p.tithi.number).toBe(12);
  });
});
