/**
 * Deep Astronomical Analysis
 *
 * Compute sun/moon longitudes for reference dates and compare
 * against known astronomical positions to find systematic errors.
 */

import { describe, it } from 'vitest';
import {
  getSunLongitude,
  getMoonLongitude,
  calculateTithiIndex,
  getPaksha,
  getTithiNumber,
  getAyanamsa,
  toSidereal
} from '../astronomy';
import { PanchangEngine } from '../panchang';

const BANGALORE = { latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', name: 'Bangalore' };

describe('Astronomical Position Analysis', () => {
  it('print sun/moon longitudes for key dates', () => {
    console.log('\n=== Astronomical Position Analysis ===');
    console.log('Date       | Sun (tropical) | Moon (tropical) | Diff  | TithiIdx | Paksha  | Tithi# | Ayanamsa | Sun (sidereal) | Moon (sidereal)');
    console.log('-----------|----------------|-----------------|-------|----------|---------|--------|----------|----------------|----------------');

    const dates = [
      '2025-03-29', // Expected new moon
      '2025-04-01',
      '2025-04-02',
      '2025-04-03',
      '2025-04-05',
      '2025-04-10',
      '2025-04-12',
      '2025-04-13', // Expected full moon
      '2025-04-14',
      '2025-04-15',
      '2025-04-17',
      '2025-04-20',
      '2025-04-25',
      '2025-04-27', // Expected new moon
      '2025-04-28',
      '2025-04-29',
      '2025-08-15', // Actual Janmashtami period
      '2025-08-16',
    ];

    for (const dateStr of dates) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);

      const sunTropical = getSunLongitude(date);
      const moonTropical = getMoonLongitude(date);
      const ayanamsa = getAyanamsa(date);
      const sunSidereal = toSidereal(sunTropical, ayanamsa);
      const moonSidereal = toSidereal(moonTropical, ayanamsa);

      // Tithi based on tropical
      let diffTropical = moonTropical - sunTropical;
      if (diffTropical < 0) diffTropical += 360;
      const tithiIdxTropical = Math.floor(diffTropical / 12);
      const pakshaTropical = getPaksha(tithiIdxTropical);
      const tithiNumTropical = getTithiNumber(tithiIdxTropical);

      // Tithi based on sidereal
      let diffSidereal = moonSidereal - sunSidereal;
      if (diffSidereal < 0) diffSidereal += 360;
      const tithiIdxSidereal = Math.floor(diffSidereal / 12);
      const pakshaSidereal = getPaksha(tithiIdxSidereal);
      const tithiNumSidereal = getTithiNumber(tithiIdxSidereal);

      console.log(
        `${dateStr} | ${sunTropical.toFixed(1).padStart(14)} | ${moonTropical.toFixed(1).padStart(15)} | ${diffTropical.toFixed(1).padStart(5)} | ` +
        `${String(tithiIdxTropical).padStart(8)} | ${pakshaTropical.padEnd(7)} | ${String(tithiNumTropical).padStart(6)} | ` +
        `${ayanamsa.toFixed(2).padStart(8)} | ${sunSidereal.toFixed(1).padStart(14)} | ${moonSidereal.toFixed(1).padStart(14)}`
      );
    }
    console.log('=== End ===\n');
  });

  it('compute tithis using sidereal longitudes via engine', () => {
    const engine = new PanchangEngine(BANGALORE);

    console.log('\n=== Engine Tithi Output ===');
    const dates = [
      '2025-03-29', '2025-04-01', '2025-04-02', '2025-04-03', '2025-04-05',
      '2025-04-10', '2025-04-13', '2025-04-14', '2025-04-17', '2025-04-20',
      '2025-04-27', '2025-04-28', '2025-04-29',
    ];

    for (const dateStr of dates) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const panchang = engine.calculate(date);
      console.log(
        `${dateStr} | ${panchang.tithi.paksha.padEnd(8)} | ${panchang.tithi.name.padEnd(17)} | #${panchang.tithi.number}`
      );
    }
    console.log('=== End ===\n');
  });

  it('compute Hindu lunar month for key dates', () => {
    const engine = new PanchangEngine(BANGALORE);

    console.log('\n=== Lunar Month Detection ===');
    const dates = [
      '2025-01-15', '2025-02-15', '2025-03-15', '2025-04-01', '2025-04-15',
      '2025-05-15', '2025-06-15', '2025-07-15', '2025-08-15', '2025-09-15',
      '2025-10-15', '2025-11-15', '2025-12-15',
    ];

    for (const dateStr of dates) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const panchang = engine.calculate(date);
      const lunarMonth = engine.getLunarMonth(panchang);
      console.log(
        `${dateStr} | Lunar Month (stub): ${lunarMonth.name.padEnd(14)} | ` +
        `Tithi: ${panchang.tithi.paksha} ${panchang.tithi.name} (${panchang.tithi.number})`
      );
    }
    console.log('=== End ===\n');
  });
});
