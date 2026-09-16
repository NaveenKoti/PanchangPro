/**
 * Tithi + sunrise/sunset accuracy vs Drik Panchang — 490-day ground truth (Delhi).
 *
 * Ground truth: ./drikTruth.ts (drikpanchang.com month pages, Delhi,
 * 2024-12-29..2026-05-02, fetched 2026-09-10).
 *
 * Baseline 2026-09-10: tithi 482/490 exact (8 boundary misses, all Drik
 * day-page verified — engine ±1 near boundaries, 7 early / 1 late).
 * Sunrise/sunset show a SEASONAL systematic (short-day) drift, worst in
 * Delhi winter (sunset to -41min) and spring sunrise (+21min) — Phase 3 fix target.
 *
 * Ratchet mechanism: known misses use `it.fails`. If an engine fix corrects a
 * listed date, that test PASSES and vitest fails the suite on purpose — remove
 * the date from the set. If a new date starts failing, the suite fails as usual.
 * Goal: shrink all three sets to zero, then tighten tolerances to ±5.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { createPanchangEngine } from '../panchang';
import { DELHI } from './referenceData';
import { DRIK_TRUTH, KNOWN_TITHI_MISS } from './drikTruth';

const SUNRISE_TOL_MIN = 5;
const SUNSET_TOL_MIN = 5;

// Shared ratchet set lives in ./drikTruth.ts (imported below).

// Empty 2026-09-10: all 490 within ±5min after jd0+EoT fixes.
const KNOWN_RISE_MISS = new Set<string>([]);

// Empty 2026-09-10: all 490 within ±5min after jd0+EoT fixes.
const KNOWN_SET_MISS = new Set<string>([]);

function fmtTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function diffMin(actual: string, expected: string): number {
  const [ah, am] = actual.split(':').map(Number);
  const [eh, em] = expected.split(':').map(Number);
  return Math.abs(ah * 60 + am - (eh * 60 + em));
}

function normalizeEngineName(name: string, paksha: string): string {
  if (name === 'Purnima/Amavasya') return paksha === 'Shukla' ? 'Purnima' : 'Amavasya';
  return name;
}

describe('Tithi accuracy vs Drik (Delhi, 490 days)', () => {
  const engine = createPanchangEngine(DELHI);
  let pass = 0;
  const failures: string[] = [];

  for (const row of DRIK_TRUTH) {
    const t = KNOWN_TITHI_MISS.has(row.dateISO) ? it.fails : it;
    t(`${row.dateISO}: ${row.paksha} ${row.tithi}`, () => {
      const [y, m, d] = row.dateISO.split('-').map(Number);
      const p = engine.calculate(new Date(y, m - 1, d));
      const engineName = normalizeEngineName(p.tithi.name, p.tithi.paksha);
      const ok = engineName === row.tithi && p.tithi.paksha === row.paksha;
      if (ok) pass++;
      else failures.push(`${row.dateISO}: expected ${row.paksha} ${row.tithi} #${row.num}, got ${p.tithi.paksha} ${engineName} #${p.tithi.number}`);
      expect(engineName).toBe(row.tithi);
      expect(p.tithi.paksha).toBe(row.paksha);
    });
  }

  afterAll(() => {
    console.log(`\nTITHI: ${pass}/${DRIK_TRUTH.length} exact matches (${KNOWN_TITHI_MISS.size} known misses)`);
    for (const f of failures.slice(0, 1000)) console.log(`  MISS ${f}`);
  });
});

describe('Sunrise/sunset vs Drik (Delhi, 490 days)', () => {
  const engine = createPanchangEngine(DELHI);
  let risePass = 0;
  let setPass = 0;
  const riseFails: string[] = [];
  const setFails: string[] = [];

  for (const row of DRIK_TRUTH) {
    const knownMiss = KNOWN_RISE_MISS.has(row.dateISO) || KNOWN_SET_MISS.has(row.dateISO);
    const t = knownMiss ? it.fails : it;
    t(`${row.dateISO} sun ${row.sunrise}/${row.sunset}`, () => {
      const [y, m, d] = row.dateISO.split('-').map(Number);
      const p = engine.calculate(new Date(y, m - 1, d));
      const riseDiff = diffMin(fmtTime(p.sunrise), row.sunrise);
      const setDiff = diffMin(fmtTime(p.sunset), row.sunset);
      if (riseDiff <= SUNRISE_TOL_MIN) risePass++;
      else riseFails.push(`${row.dateISO}: rise engine=${fmtTime(p.sunrise)} drik=${row.sunrise} diff=${riseDiff}`);
      if (setDiff <= SUNSET_TOL_MIN) setPass++;
      else setFails.push(`${row.dateISO}: set engine=${fmtTime(p.sunset)} drik=${row.sunset} diff=${setDiff}`);
      expect(riseDiff).toBeLessThanOrEqual(SUNRISE_TOL_MIN);
      expect(setDiff).toBeLessThanOrEqual(SUNSET_TOL_MIN);
    });
  }

  afterAll(() => {
    console.log(`\nSUNRISE: ${risePass}/${DRIK_TRUTH.length} within ±${SUNRISE_TOL_MIN}min`);
    for (const f of riseFails.slice(0, 1000)) console.log(`  MISS ${f}`);
    console.log(`SUNSET: ${setPass}/${DRIK_TRUTH.length} within ±${SUNSET_TOL_MIN}min`);
    for (const f of setFails.slice(0, 1000)) console.log(`  MISS ${f}`);
  });
});
