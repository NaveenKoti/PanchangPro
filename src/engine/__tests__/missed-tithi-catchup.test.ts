/**
 * Missed custom-tithi catch-up ("While you were away") tests.
 *
 * Validates the pure window-scan in notificationService:
 *   - fire-times inside (windowStart, windowEnd] are included
 *   - fire-times outside the window are excluded (start exclusive, end inclusive)
 *   - reminderDaysBefore shifts the fire-time off the occurrence date
 *   - dedupe via already-shown ids works (incl. duplicate occurrences)
 *   - tithis without reminderEnabled/reminderTime are skipped
 *   - catch-up window is capped to the last 7 days
 */

import { describe, it, expect } from 'vitest';
import {
  findMissedCustomTithiReminders,
  getCatchupWindow,
  buildMissedReminderId,
  getLastSeenAt,
  setLastSeenAt,
  MAX_CATCHUP_LOOKBACK_DAYS,
} from '../../services/notificationService';
import type { CustomTithi } from '../../types';

const makeTithi = (overrides: Partial<CustomTithi> = {}): CustomTithi => ({
  id: 't1',
  name: "Amma's Punyatithi",
  tithiNumber: 11,
  paksha: 'Shukla',
  month: 0,
  isRecurring: true,
  reminderEnabled: true,
  reminderTime: '07:00',
  reminderDaysBefore: 0,
  createdAt: new Date(2026, 0, 1),
  ...overrides,
});

// Fixed local reference points (noon avoids DST/midnight edge flakiness).
const WINDOW_START = new Date(2026, 7, 15, 12, 0, 0); // Aug 15 12:00
const WINDOW_END = new Date(2026, 7, 18, 12, 0, 0); // Aug 18 12:00

describe('findMissedCustomTithiReminders', () => {
  it('includes fire-times falling inside the window', () => {
    const tithi = makeTithi();
    const missed = findMissedCustomTithiReminders(
      [tithi],
      { t1: [new Date(2026, 7, 17, 0, 0, 0)] },
      WINDOW_START,
      WINDOW_END
    );

    expect(missed).toHaveLength(1);
    expect(missed[0].tithiId).toBe('t1');
    expect(missed[0].tithiName).toBe("Amma's Punyatithi");
    expect(missed[0].daysBefore).toBe(0);
    // Occurrence Aug 17 at reminderTime 07:00.
    expect(missed[0].fireTime.getFullYear()).toBe(2026);
    expect(missed[0].fireTime.getMonth()).toBe(7);
    expect(missed[0].fireTime.getDate()).toBe(17);
    expect(missed[0].fireTime.getHours()).toBe(7);
    expect(missed[0].fireTime.getMinutes()).toBe(0);
  });

  it('excludes fire-times outside the window (start exclusive, end inclusive)', () => {
    // Fire Aug 10 07:00 — before the window.
    const before = findMissedCustomTithiReminders(
      [makeTithi()],
      { t1: [new Date(2026, 7, 10)] },
      WINDOW_START,
      WINDOW_END
    );
    expect(before).toHaveLength(0);

    // Fire exactly at windowStart — excluded (window is start-exclusive).
    const atStart = findMissedCustomTithiReminders(
      [makeTithi({ reminderTime: '12:00' })],
      { t1: [new Date(2026, 7, 15)] },
      WINDOW_START,
      WINDOW_END
    );
    expect(atStart).toHaveLength(0);

    // Fire exactly at windowEnd — included (window is end-inclusive).
    const atEnd = findMissedCustomTithiReminders(
      [makeTithi({ reminderTime: '12:00' })],
      { t1: [new Date(2026, 7, 18)] },
      WINDOW_START,
      WINDOW_END
    );
    expect(atEnd).toHaveLength(1);
  });

  it('shifts the fire-time back by reminderDaysBefore', () => {
    const tithi = makeTithi({ reminderTime: '08:00', reminderDaysBefore: 2 });
    // Occurrence Aug 20 (future) → fire Aug 18 08:00, inside the window.
    const missed = findMissedCustomTithiReminders(
      [tithi],
      { t1: [new Date(2026, 7, 20)] },
      WINDOW_START,
      WINDOW_END
    );

    expect(missed).toHaveLength(1);
    expect(missed[0].daysBefore).toBe(2);
    expect(missed[0].fireTime.getDate()).toBe(18);
    expect(missed[0].fireTime.getHours()).toBe(8);
    expect(missed[0].occurrenceDate.getDate()).toBe(20);
  });

  it('dedupes via already-shown ids and duplicate occurrences', () => {
    const tithi = makeTithi();
    const occurrences = { t1: [new Date(2026, 7, 17)] };

    const first = findMissedCustomTithiReminders([tithi], occurrences, WINDOW_START, WINDOW_END);
    expect(first).toHaveLength(1);

    // Re-scan with the shown id recorded → nothing re-shown.
    const second = findMissedCustomTithiReminders(
      [tithi],
      occurrences,
      WINDOW_START,
      WINDOW_END,
      [first[0].id]
    );
    expect(second).toHaveLength(0);

    // Id is deterministic for the same tithi + fire day.
    expect(buildMissedReminderId('t1', first[0].fireTime)).toBe(first[0].id);

    // Duplicate occurrence entries for the same day collapse to one item.
    const dupes = findMissedCustomTithiReminders(
      [tithi],
      { t1: [new Date(2026, 7, 17), new Date(2026, 7, 17, 15, 30)] },
      WINDOW_START,
      WINDOW_END
    );
    expect(dupes).toHaveLength(1);
  });

  it('skips tithis without reminderEnabled/reminderTime', () => {
    const occurrences = { t1: [new Date(2026, 7, 17)], t2: [new Date(2026, 7, 17)] };
    const missed = findMissedCustomTithiReminders(
      [makeTithi({ id: 't1', reminderEnabled: false }), makeTithi({ id: 't2', reminderTime: undefined })],
      occurrences,
      WINDOW_START,
      WINDOW_END
    );
    expect(missed).toHaveLength(0);
  });

  it('returns items sorted ascending by fireTime', () => {
    const missed = findMissedCustomTithiReminders(
      [makeTithi({ id: 't1' }), makeTithi({ id: 't2', name: 'Second' })],
      { t1: [new Date(2026, 7, 17)], t2: [new Date(2026, 7, 16)] },
      WINDOW_START,
      WINDOW_END
    );
    expect(missed).toHaveLength(2);
    expect(missed[0].tithiId).toBe('t2');
    expect(missed[1].tithiId).toBe('t1');
  });
});

describe('getCatchupWindow', () => {
  it('caps the lookback to the last 7 days', () => {
    const now = new Date(2026, 7, 18, 12, 0, 0);
    const thirtyDaysAgo = new Date(2026, 6, 19, 12, 0, 0);
    const { start, end } = getCatchupWindow(now, thirtyDaysAgo);

    expect(end.getTime()).toBe(now.getTime());
    expect(now.getTime() - start.getTime()).toBe(
      MAX_CATCHUP_LOOKBACK_DAYS * 24 * 60 * 60 * 1000
    );
  });

  it('uses lastSeenAt when inside the 7-day cap', () => {
    const now = new Date(2026, 7, 18, 12, 0, 0);
    const twoDaysAgo = new Date(2026, 7, 16, 12, 0, 0);
    const { start } = getCatchupWindow(now, twoDaysAgo);
    expect(start.getTime()).toBe(twoDaysAgo.getTime());
  });
});

describe('lastSeenAt storage', () => {
  it('round-trips through localStorage', () => {
    const stamp = new Date(2026, 7, 17, 9, 30, 0);
    setLastSeenAt(stamp);
    expect(getLastSeenAt()?.getTime()).toBe(stamp.getTime());
    setLastSeenAt(new Date());
  });
});
