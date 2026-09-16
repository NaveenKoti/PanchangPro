import { describe, it } from 'vitest';
import { createPanchangEngine } from '../panchang';
import type { GeoLocation } from '../../types';

const BANGALORE: GeoLocation = {
  latitude: 12.9716,
  longitude: 77.5946,
  timezone: 'Asia/Kolkata',
  name: 'Bangalore'
};

function fmt(d: Date): string {
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

describe('PROBE Bangalore 2026-04-19', () => {
  it('emits panchang for parity comparison', () => {
    const engine = createPanchangEngine(BANGALORE);
    const date = new Date(2026, 3, 19);
    const p = engine.calculate(date);

    const out = {
      date: p.date.toISOString().slice(0, 10),
      sunrise: fmt(p.sunrise),
      sunset: fmt(p.sunset),
      tithi: `${p.tithi.paksha} ${p.tithi.name} (#${p.tithi.number}) ends ${fmt(p.tithi.endTime)}`,
      nakshatra: `${p.nakshatra.name} (#${p.nakshatra.number}) ends ${fmt(p.nakshatra.endTime)}`,
      yoga: `${p.yoga.name} (#${p.yoga.number})`,
      karana: `${p.karana.name} (#${p.karana.number}, ${p.karana.type})`,
      weekday: p.var.name,
      lunarMonth: p.lunarMonth,
      rahuKaal: `${fmt(p.rahuKaal.start)} - ${fmt(p.rahuKaal.end)}`,
      yamagandam: `${fmt(p.yamagandam.start)} - ${fmt(p.yamagandam.end)}`,
      gulikaKaal: `${fmt(p.gulikaKaal.start)} - ${fmt(p.gulikaKaal.end)}`,
    };

    // eslint-disable-next-line no-console
    console.log('PROBE_OUTPUT', JSON.stringify(out, null, 2));
  });
});
