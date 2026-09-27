/**
 * User acceptance case: death 2023-03-10 -> Shraddha 2026-03-06,
 * Pitru Paksha 2026-09-29.
 *
 * Verifies the whole one-way chain: death-date tithi resolution
 * (Krishna Tritiya, amanta Phalguna) + annual matching + Mahalaya window.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAppStore } from '../../stores/appStore';
import { PanchangEngine } from '../../engine/panchang';

const MUMBAI = {
  latitude: 19.076,
  longitude: 72.8777,
  timezone: 'Asia/Kolkata',
  name: 'Mumbai',
};

const BASE = {
  name: 'Shraddha',
  nameHindi: '',
  paksha: 'Krishna' as const,
  isRecurring: true,
  notes: '',
  reminderEnabled: false,
  reminderTime: '06:00',
  reminderDaysBefore: 1,
};

describe('user acceptance: death 2023-03-10', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 15, 12, 0, 0)); // Jan 15 2026
    useAppStore.setState((s) => ({
      preferences: { ...s.preferences, location: MUMBAI },
      customTithis: [],
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('death date resolves to Krishna Tritiya, amanta Phalguna (12)', () => {
    const eng = new PanchangEngine(MUMBAI);
    const p = eng.calculate(new Date(2023, 2, 10, 12, 0, 0));
    expect(p.tithi.number).toBe(3);
    expect(p.tithi.paksha).toBe('Krishna');
    expect(eng.getAmantaMonthNumber(new Date(2023, 2, 10, 12, 0, 0))).toBe(12);
  });

  it('annual Shraddha falls on 2026-03-06', () => {
    const store = useAppStore.getState();
    store.addCustomTithi({ ...BASE, tithiNumber: 3, month: 11, annual: true });
    const id = useAppStore.getState().customTithis[0].id;
    const occ = useAppStore.getState().getNextOccurrences(id);
    expect(occ.length).toBeGreaterThan(0);
    expect([occ[0].getFullYear(), occ[0].getMonth(), occ[0].getDate()]).toEqual([2026, 2, 6]);
  });

  it('Pitru Paksha companion falls on 2026-09-29', () => {
    const store = useAppStore.getState();
    store.addCustomTithi({ ...BASE, tithiNumber: 3, month: 11, annual: true, pitruPaksha: true });
    const id = useAppStore.getState().customTithis[0].id;
    const occ = useAppStore.getState().getNextOccurrences(id);
    expect(occ.length).toBeGreaterThan(0);
    expect([occ[0].getFullYear(), occ[0].getMonth(), occ[0].getDate()]).toEqual([2026, 8, 29]);
  });
});
