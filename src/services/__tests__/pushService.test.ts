/**
 * pushService.test.ts — pure-helper tests for killed-app push reminders.
 *
 * Covers the due-filter (cron horizon) and the payload builder, plus the
 * fire-time math (must mirror notificationService.scheduleCustomTithiReminder:
 * occurrence minus reminderDaysBefore at reminderTime).
 */

import { describe, it, expect } from 'vitest';
import {
  buildPushPayload,
  buildPushReminders,
  computeTithiFireTime,
  filterDueReminders,
  type PushReminder,
} from '../pushService';
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

const makeReminder = (overrides: Partial<PushReminder> = {}): PushReminder => ({
  id: 'tithi-t1-2026-08-17',
  title: "🌙 Amma's Punyatithi",
  body: 'Today is ...',
  fireTimeISO: new Date(2026, 7, 17, 7, 0, 0).toISOString(),
  ...overrides,
});

describe('computeTithiFireTime', () => {
  it('sets reminderTime on the occurrence when daysBefore is 0', () => {
    const fire = computeTithiFireTime(new Date(2026, 7, 17, 0, 0, 0), 0, '07:00');
    expect(fire.getFullYear()).toBe(2026);
    expect(fire.getMonth()).toBe(7);
    expect(fire.getDate()).toBe(17);
    expect(fire.getHours()).toBe(7);
    expect(fire.getMinutes()).toBe(0);
  });

  it('shifts back by reminderDaysBefore', () => {
    const fire = computeTithiFireTime(new Date(2026, 7, 17, 12, 0, 0), 2, '18:30');
    expect(fire.getDate()).toBe(15);
    expect(fire.getHours()).toBe(18);
    expect(fire.getMinutes()).toBe(30);
  });

  it('clamps daysBefore into 0..7', () => {
    const neg = computeTithiFireTime(new Date(2026, 7, 17, 12, 0, 0), -5, '07:00');
    expect(neg.getDate()).toBe(17);
    const big = computeTithiFireTime(new Date(2026, 7, 17, 12, 0, 0), 99, '07:00');
    expect(big.getDate()).toBe(10);
  });
});

describe('buildPushReminders', () => {
  const NOW = new Date(2026, 7, 15, 12, 0, 0); // Aug 15 noon

  it('builds a reminder per future occurrence with tithi-<id>-<day> ids', () => {
    const tithi = makeTithi();
    const out = buildPushReminders(
      [tithi],
      { t1: [new Date(2026, 7, 17, 0, 0, 0)] },
      NOW
    );
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe('tithi-t1-2026-08-17');
    expect(out[0].title).toBe("🌙 Amma's Punyatithi");
    expect(out[0].body).toContain('Today is');
    expect(new Date(out[0].fireTimeISO).getHours()).toBe(7);
  });

  it('uses "in N days" copy when daysBefore > 0', () => {
    const tithi = makeTithi({ reminderDaysBefore: 2 });
    const out = buildPushReminders(
      [tithi],
      { t1: [new Date(2026, 7, 20, 0, 0, 0)] },
      NOW
    );
    expect(out).toHaveLength(1);
    expect(out[0].body).toContain('in 2 days');
    expect(new Date(out[0].fireTimeISO).getDate()).toBe(18);
  });

  it('skips tithis without reminderEnabled/reminderTime and past fires', () => {
    const off = makeTithi({ id: 'off', reminderEnabled: false });
    const noTime = makeTithi({ id: 'notime', reminderTime: undefined });
    const out = buildPushReminders(
      [off, noTime, makeTithi()],
      {
        off: [new Date(2026, 7, 17, 0, 0, 0)],
        notime: [new Date(2026, 7, 17, 0, 0, 0)],
        t1: [new Date(2026, 7, 10, 0, 0, 0)], // past
      },
      NOW
    );
    expect(out).toHaveLength(0);
  });

  it('sorts ascending and accepts string occurrences', () => {
    const out = buildPushReminders(
      [makeTithi()],
      { t1: [new Date(2026, 7, 20, 0, 0, 0).toISOString(), new Date(2026, 7, 17, 0, 0, 0)] },
      NOW
    );
    expect(out).toHaveLength(2);
    expect(new Date(out[0].fireTimeISO).getDate()).toBe(17);
    expect(new Date(out[1].fireTimeISO).getDate()).toBe(20);
  });
});

describe('buildPushPayload', () => {
  it('serializes {title, body, tag} with tag = reminder id', () => {
    const parsed = JSON.parse(buildPushPayload(makeReminder()));
    expect(parsed).toEqual({
      title: "🌙 Amma's Punyatithi",
      body: 'Today is ...',
      tag: 'tithi-t1-2026-08-17',
    });
  });
});

describe('filterDueReminders', () => {
  const NOW = new Date(2026, 7, 17, 6, 55, 0);

  it('includes fireTimes within now+10min, excludes later ones', () => {
    const due = makeReminder({ id: 'due', fireTimeISO: new Date(2026, 7, 17, 7, 0, 0).toISOString() });
    const later = makeReminder({
      id: 'later',
      fireTimeISO: new Date(2026, 7, 17, 8, 0, 0).toISOString(),
    });
    const out = filterDueReminders([later, due], NOW, 10);
    expect(out.map((r) => r.id)).toEqual(['due']);
  });

  it('is inclusive at the horizon edge and drops unparseable ISO', () => {
    const edge = makeReminder({
      id: 'edge',
      fireTimeISO: new Date(NOW.getTime() + 10 * 60 * 1000).toISOString(),
    });
    const bad = makeReminder({ id: 'bad', fireTimeISO: 'not-a-date' });
    const out = filterDueReminders([bad, edge], NOW, 10);
    expect(out.map((r) => r.id)).toEqual(['edge']);
  });

  it('sorts due reminders ascending', () => {
    const a = makeReminder({ id: 'a', fireTimeISO: new Date(2026, 7, 17, 7, 0, 0).toISOString() });
    const b = makeReminder({ id: 'b', fireTimeISO: new Date(2026, 7, 17, 6, 50, 0).toISOString() });
    expect(filterDueReminders([a, b], NOW, 10).map((r) => r.id)).toEqual(['b', 'a']);
  });
});
