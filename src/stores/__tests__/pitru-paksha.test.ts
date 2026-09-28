/**
 * Shraddha annual matching + Pitru Paksha companion.
 *
 * Ground truth (user-reported example, engine-verified): death 2023-03-10
 * (Krishna Tritiya) -> annual Mar 6 2026, Mar 25 2027; Pitru Paksha Sep 29
 * 2026. Fake timers pin "today" so these never rot.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAppStore } from '../../stores/appStore';

const MUMBAI = {
  latitude: 19.076,
  longitude: 72.8777,
  timezone: 'Asia/Kolkata',
  name: 'Mumbai',
};

const BASE = {
  name: 'Test',
  nameHindi: '',
  tithiNumber: 3,
  paksha: 'Krishna' as const,
  month: 11, // Phalguna (0-based; engine lunarMonth 12)
  isRecurring: true,
  notes: '',
  reminderEnabled: false,
  reminderTime: '06:00',
  reminderDaysBefore: 1,
};

describe('Shraddha annual matching', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 26, 12, 0, 0));
    useAppStore.setState((s) => ({
      preferences: { ...s.preferences, location: MUMBAI },
      customTithis: [],
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('annual entry fires ~yearly in the same amanta lunar month (Mar 25 2027, not Feb 23)', () => {
    // Fake today is Sep 26 2026, so Mar 6 2026 is past: first hit must be
    // Mar 25 2027 (amanta Phalguna) — NOT Feb 23 2027 (amanta Magha), which
    // a sun-sign month gate would wrongly pick.
    const store = useAppStore.getState();
    store.addCustomTithi({ ...BASE, annual: true });
    const id = useAppStore.getState().customTithis[0].id;
    const occ = useAppStore.getState().getNextOccurrences(id);
    expect(occ.length).toBeGreaterThan(0);
    expect([occ[0].getFullYear(), occ[0].getMonth(), occ[0].getDate()]).toEqual([2027, 2, 25]);
    if (occ.length > 1) {
      const gapDays = (occ[1].getTime() - occ[0].getTime()) / 86_400_000;
      expect(gapDays).toBeGreaterThan(300);
    }
  });

  it('monthly entry (no annual flag) fires every lunar month', () => {
    const store = useAppStore.getState();
    store.addCustomTithi({ ...BASE });
    const id = useAppStore.getState().customTithis[0].id;
    const occ = useAppStore.getState().getNextOccurrences(id);
    expect(occ.length).toBeGreaterThan(1);
    const gapDays = (occ[1].getTime() - occ[0].getTime()) / 86_400_000;
    expect(gapDays).toBeLessThan(40);
  });

  it('Pitru Paksha companion matches inside Sep-Oct 2026 (Sep 29)', () => {
    const store = useAppStore.getState();
    store.addCustomTithi({ ...BASE, month: 6, pitruPaksha: true });
    const id = useAppStore.getState().customTithis[0].id;
    const occ = useAppStore.getState().getNextOccurrences(id);
    expect(occ.length).toBeGreaterThan(0);
    const first = occ[0];
    expect(first.getFullYear()).toBe(2026);
    expect(first.getMonth()).toBe(8); // September
    expect(first.getDate()).toBe(29);
  });

  it('Pitru Paksha fires exactly once per year (annual, not monthly)', () => {
    // The ~61-day Mahalaya window holds TWO hits of the same tithi+paksha
    // (Krishna Tritiya: Sep 29 + Oct 28 2026). Phone smoke test showed the
    // reminder repeating monthly — it must return the first hit only.
    const store = useAppStore.getState();
    store.addCustomTithi({ ...BASE, month: 6, pitruPaksha: true });
    const id = useAppStore.getState().customTithis[0].id;
    const occ = useAppStore.getState().getNextOccurrences(id);
    expect(occ).toHaveLength(1);
    expect([occ[0].getFullYear(), occ[0].getMonth(), occ[0].getDate()]).toEqual([2026, 8, 29]);
  });

  it('Pitru Paksha matches nothing outside the Mahalaya window', () => {
    const store = useAppStore.getState();
    store.addCustomTithi({ ...BASE, month: 6, pitruPaksha: true });
    const id = useAppStore.getState().customTithis[0].id;
    const occ = useAppStore.getState().getNextOccurrences(id);
    for (const d of occ) {
      expect(d.getMonth() === 8 || d.getMonth() === 9).toBe(true);
    }
  });
});
