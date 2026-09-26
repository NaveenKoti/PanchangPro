/**
 * Backup reminder flags (localStorage).
 *
 * Safari may evict unused site data after ~2 weeks, so the app nudges the
 * user to keep a fresh My Tithis export: first prompt when tithis exist but
 * no export was ever made, then again when the last export is older than
 * BACKUP_STALE_DAYS. "Later" snoozes for SNOOZE_DAYS. Every export replaces
 * (never appends to) the previous backup — latest always wins.
 * All storage access is guarded; failures mean "don't prompt", never crash.
 */

export const BACKUP_STALE_DAYS = 30;
export const BACKUP_SNOOZE_DAYS = 7;

const LAST_EXPORT_KEY = 'vedatime_backup_last_export';
const SNOOZED_UNTIL_KEY = 'vedatime_backup_snoozed_until';

function readMs(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const ms = Date.parse(raw);
    return Number.isNaN(ms) ? null : ms;
  } catch {
    return null;
  }
}

function writeNow(key: string, nowMs: number): void {
  try {
    localStorage.setItem(key, new Date(nowMs).toISOString());
  } catch {
    // Private mode / denied — prompting logic treats as absent.
  }
}

export interface BackupPromptState {
  prompt: boolean;
  /** 'never' = first export pending, 'stale' = last export too old. */
  reason: 'never' | 'stale';
  /** Whole days since last export (0 when never). */
  daysSince: number;
}

export function shouldPromptBackup(args: {
  tithiCount: number;
  nowMs?: number;
}): BackupPromptState {
  const no: BackupPromptState = { prompt: false, reason: 'never', daysSince: 0 };
  if (args.tithiCount <= 0) return no;
  const now = args.nowMs ?? Date.now();
  const snoozedUntil = readMs(SNOOZED_UNTIL_KEY);
  if (snoozedUntil !== null && now < snoozedUntil) return no;
  const last = readMs(LAST_EXPORT_KEY);
  if (last === null) return { prompt: true, reason: 'never', daysSince: 0 };
  const daysSince = Math.floor((now - last) / 86_400_000);
  if (daysSince < 0) return no; // Clock moved backwards — stay quiet.
  if (daysSince < BACKUP_STALE_DAYS) return no;
  return { prompt: true, reason: 'stale', daysSince };
}

/** Record a successful export now (clears any snooze). */
export function markExported(nowMs: number = Date.now()): void {
  writeNow(LAST_EXPORT_KEY, nowMs);
  try {
    localStorage.removeItem(SNOOZED_UNTIL_KEY);
  } catch {
    // ignore
  }
}

/** Snooze the nudge for BACKUP_SNOOZE_DAYS. */
export function snoozeBackup(nowMs: number = Date.now()): void {
  writeNow(SNOOZED_UNTIL_KEY, nowMs + BACKUP_SNOOZE_DAYS * 86_400_000);
}

/**
 * Perform the export: download JSON file, fall back to clipboard.
 * Returns how it completed so callers can message accurately.
 */
export async function performBackupExport(json: string): Promise<'downloaded' | 'clipboard' | 'failed'> {
  try {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vedatime-tithis.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return 'downloaded';
  } catch {
    try {
      await navigator.clipboard.writeText(json);
      return 'clipboard';
    } catch {
      return 'failed';
    }
  }
}
