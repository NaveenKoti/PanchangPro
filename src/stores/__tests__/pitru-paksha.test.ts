/**
 * Shraddha one-way flow: death date -> tithi (annual, recurring) + optional
 * Pitru Paksha companion matched ONLY in the Sep-Oct Mahalaya window.
 * Ground truth: death 2023-03-10 (Krishna Tritiya) -> annual Mar 6 2026,
 * Mar 25 2027; Pitru Paksha Sep 29 2026 (user-reported example).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../stores/appStore';

const MUMBAI = {
  latitude: 19.076,
  longitude: 72.8777,
  timezone: 'Asia/Kolkata',
  name: 'Mumbai',
};

describe('Shraddha Pitru Paksha companion', () => {
  beforeEach(() => {
    useAppStore.setState((s) => ({
      preferences: { ...s.preferences, location: MUMBAI },
      customTithis: [],
    }));
  });

  it('matches Krishna Tritiya inside Sep-Oct 2026 (Sep 29)', () => {
    const store = useAppStore.getState();
    store.addCustomTithi({
      name: 'Test (Pitru Paksha)',
      nameHindi: '',
      tithiNumber: 3,
      paksha: 'Krishna',
      month: 6,
      isRecurring: true,
      notes: '',
      reminderEnabled: false,
      reminderTime: '06:00',
      reminderDaysBefore: 1,
      pitruPaksha: true,
    });
    const id = useAppStore.getState().customTithis[0].id;
    const occ = useAppStore.getState().getNextOccurrences(id);
    expect(occ.length).toBeGreaterThan(0);
    const first = occ[0];
    expect(first.getFullYear()).toBe(2026);
    expect(first.getMonth()).toBe(8); // September
    expect(first.getDate()).toBe(29);
  });

  it('does not match outside the Mahalaya window', () => {
    const store = useAppStore.getState();
    store.addCustomTithi({
      name: 'Test (Pitru Paksha)',
      nameHindi: '',
      tithiNumber: 3,
      paksha: 'Krishna',
      month: 6,
      isRecurring: true,
      notes: '',
      reminderEnabled: false,
      reminderTime: '06:00',
      reminderDaysBefore: 1,
      pitruPaksha: true,
    });
    const id = useAppStore.getState().customTithis[0].id;
    const occ = useAppStore.getState().getNextOccurrences(id);
    for (const d of occ) {
      expect(d.getMonth() === 8 || d.getMonth() === 9).toBe(true);
    }
  });
});
