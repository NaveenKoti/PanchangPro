import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';

const trace = (msg: string) => fs.appendFileSync('/tmp/zztrace.log', `${Date.now()} ${msg}\n`);

describe('zz debug3', () => {
  type RealModule = typeof import('../../services/notificationService');
  let realService: RealModule['notificationService'];

  beforeEach(async () => {
    trace('beforeEach start');
    ['panchangpro_scheduled_notifications', 'panchangpro_scheduled_ids'].forEach((k) =>
      localStorage.removeItem(k)
    );
    (window as any).Notification = class {
      static permission = 'granted';
      close() { /* noop */ }
      constructor(public title: string, public options?: unknown) { /* noop */ }
    };
    trace('beforeEach importing');
    const actual = await vi.importActual<RealModule>('../../services/notificationService');
    trace('beforeEach imported');
    realService = actual.notificationService;
    realService.cancelAllNotifications();
    trace('beforeEach done');
  });

  afterEach(() => {
    trace('afterEach');
    vi.useRealTimers();
    realService.cancelAllNotifications();
    delete (window as any).Notification;
  });

  it('reschedules yearly', () => {
    trace('test: fake timers on');
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
    trace('test: set system time');
    vi.setSystemTime(new Date(2026, 8, 15, 10, 0, 0));
    const tithi: any = {
      id: 'zz-year',
      name: 'ZZ Year',
      tithiNumber: 5,
      paksha: 'Shukla',
      month: 0,
      isRecurring: true,
      reminderEnabled: true,
      reminderTime: '10:05',
      reminderDaysBefore: 0,
      createdAt: new Date(),
      nextOccurrence: new Date(2026, 8, 15),
    };
    trace('test: scheduling');
    const id = realService.scheduleCustomTithiReminder(tithi, '10:05');
    trace(`test: scheduled ${id}`);
    vi.advanceTimersByTime(6 * 60 * 1000);
    trace('test: advanced');
    const rescheduled = realService.getScheduledNotifications().find((n) => n.id === id);
    trace(`test: rescheduled ${rescheduled?.scheduledTime}`);
    expect(rescheduled).toBeDefined();
  });
});
