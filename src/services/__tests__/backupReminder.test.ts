/**
 * backupReminder flags: first-export / 30-day-stale / 7-day-snooze matrix.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  shouldPromptBackup,
  markExported,
  snoozeBackup,
  BACKUP_STALE_DAYS,
} from '../backupReminder';

const DAY = 86_400_000;
const NOW = new Date('2026-09-26T12:00:00Z').getTime();

describe('shouldPromptBackup', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stays quiet with no tithis, even without flags', () => {
    expect(shouldPromptBackup({ tithiCount: 0, nowMs: NOW }).prompt).toBe(false);
  });

  it('prompts reason=never on first tithis with no export flag', () => {
    const s = shouldPromptBackup({ tithiCount: 2, nowMs: NOW });
    expect(s).toEqual({ prompt: true, reason: 'never', daysSince: 0 });
  });

  it('stays quiet within 30 days of export', () => {
    markExported(NOW - 10 * DAY);
    expect(
      shouldPromptBackup({ tithiCount: 2, nowMs: NOW }).prompt
    ).toBe(false);
  });

  it('prompts reason=stale at and past 30 days', () => {
    markExported(NOW - BACKUP_STALE_DAYS * DAY);
    const s = shouldPromptBackup({ tithiCount: 1, nowMs: NOW });
    expect(s.prompt).toBe(true);
    expect(s.reason).toBe('stale');
    expect(s.daysSince).toBe(BACKUP_STALE_DAYS);
  });

  it('snooze suppresses for 7 days then re-prompts', () => {
    snoozeBackup(NOW);
    expect(shouldPromptBackup({ tithiCount: 3, nowMs: NOW }).prompt).toBe(false);
    expect(
      shouldPromptBackup({ tithiCount: 3, nowMs: NOW + 8 * DAY }).prompt
    ).toBe(true);
  });

  it('markExported clears snooze and resets the 30-day clock', () => {
    snoozeBackup(NOW);
    markExported(NOW);
    expect(shouldPromptBackup({ tithiCount: 1, nowMs: NOW }).prompt).toBe(false);
    const s = shouldPromptBackup({ tithiCount: 1, nowMs: NOW + 31 * DAY });
    expect(s.prompt).toBe(true);
    expect(s.reason).toBe('stale');
  });

  it('ignores corrupt flag values (treat as absent)', () => {
    localStorage.setItem('vedatime_backup_last_export', 'not-a-date');
    localStorage.setItem('vedatime_backup_snoozed_until', '!!!');
    const s = shouldPromptBackup({ tithiCount: 1, nowMs: NOW });
    expect(s.prompt).toBe(true);
    expect(s.reason).toBe('never');
  });

  it('stays quiet on backwards clock', () => {
    markExported(NOW + 5 * DAY);
    expect(shouldPromptBackup({ tithiCount: 1, nowMs: NOW }).prompt).toBe(false);
  });
});
