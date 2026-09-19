/**
 * pushService.ts — killed-app push reminders (client side).
 *
 * Design truth (no-login ethos): the server NEVER sees user tithis.
 * This client resolves the user's custom tithis to plain upcoming reminders
 * {id,title,body,fireTimeISO} and POSTs them to /api/subscribe; the server
 * is a dumb time-triggered sender (see api/cron.ts).
 *
 * Fire-time math mirrors notificationService.scheduleCustomTithiReminder:
 * occurrence date minus reminderDaysBefore days, at reminderTime.
 */

import type { CustomTithi } from '../types';

export interface PushReminder {
  id: string;
  title: string;
  body: string;
  fireTimeISO: string;
}

export interface PushPayload {
  title: string;
  body: string;
  tag: string;
}

export type PushStatus = 'on' | 'off' | 'unsupported' | 'unconfigured';

export const VAPID_MISSING_MESSAGE =
  'Push reminders are not configured yet (missing VITE_VAPID_PUBLIC_KEY). See docs/PUSH_SETUP.md.';

function getVapidKey(): string | undefined {
  try {
    const key = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
      ?.VITE_VAPID_PUBLIC_KEY;
    return key && key.length > 0 ? key : undefined;
  } catch {
    return undefined;
  }
}

function hasPushSupport(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

// ─── Pure helpers (unit-tested in pushService.test.ts) ──────────────

export function clampReminderDaysBefore(value: unknown): number {
  const n = typeof value === 'number' && !isNaN(value) ? Math.floor(value) : 0;
  return Math.min(7, Math.max(0, n));
}

export function parseReminderTimeOfDay(reminderTime: string): { hours: number; minutes: number } {
  const [h, m] = (reminderTime ?? '').split(':').map(Number);
  return {
    hours: !isNaN(h) ? h : 7,
    minutes: !isNaN(m) ? m : 0,
  };
}

function toLocalDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Pure: fire-time for one occurrence — occurrence minus daysBefore, at time.
 * Mirrors notificationService.scheduleCustomTithiReminder.
 */
export function computeTithiFireTime(
  occurrence: Date,
  reminderDaysBefore: unknown,
  reminderTime: string
): Date {
  const daysBefore = clampReminderDaysBefore(reminderDaysBefore);
  const { hours, minutes } = parseReminderTimeOfDay(reminderTime);
  const fire = new Date(occurrence);
  fire.setDate(fire.getDate() - daysBefore);
  fire.setHours(hours, minutes, 0, 0);
  return fire;
}

/**
 * Pure: build POST-ready reminders for custom tithis.
 * Skips tithis without reminderEnabled/reminderTime and fires at/past `now`.
 * Sorted ascending by fireTimeISO. Caps at 100 (server limit).
 */
export function buildPushReminders(
  tithis: CustomTithi[],
  occurrencesByTithiId: Record<string, Array<Date | string>>,
  now: Date = new Date()
): PushReminder[] {
  const nowMs = now.getTime();
  const reminders: PushReminder[] = [];

  for (const tithi of tithis) {
    if (!tithi.reminderEnabled || !tithi.reminderTime) continue;
    const daysBefore = clampReminderDaysBefore(tithi.reminderDaysBefore);
    const occurrences = occurrencesByTithiId[tithi.id] ?? [];

    for (const raw of occurrences) {
      const occurrence = raw instanceof Date ? new Date(raw) : new Date(raw);
      if (isNaN(occurrence.getTime())) continue;
      const fire = computeTithiFireTime(occurrence, daysBefore, tithi.reminderTime);
      if (fire.getTime() <= nowMs) continue;

      reminders.push({
        id: `tithi-${tithi.id}-${toLocalDayKey(fire)}`,
        title: `🌙 ${tithi.name}`,
        body:
          daysBefore > 0
            ? `${tithi.name} is in ${daysBefore} day${daysBefore > 1 ? 's' : ''}. ${
                tithi.notes || "Don't forget your special tithi!"
              }`
            : `Today is ${tithi.name}. ${tithi.notes || "Don't forget your special tithi!"}`,
        fireTimeISO: fire.toISOString(),
      });
    }
  }

  reminders.sort((a, b) => a.fireTimeISO.localeCompare(b.fireTimeISO));
  return reminders.slice(0, 100);
}

/** Pure: JSON payload the server forwards to web-push (tag = reminder id). */
export function buildPushPayload(reminder: PushReminder): string {
  const payload: PushPayload = { title: reminder.title, body: reminder.body, tag: reminder.id };
  return JSON.stringify(payload);
}

/**
 * Pure: reminders due within the next `windowMinutes` (fireTime <= now+window).
 * Mirrors the api/cron.ts send horizon. Sorted ascending.
 */
export function filterDueReminders(
  reminders: PushReminder[],
  now: Date = new Date(),
  windowMinutes = 10
): PushReminder[] {
  const horizon = now.getTime() + windowMinutes * 60 * 1000;
  return reminders
    .filter((r) => {
      const fireMs = Date.parse(r.fireTimeISO);
      return !isNaN(fireMs) && fireMs <= horizon;
    })
    .sort((a, b) => a.fireTimeISO.localeCompare(b.fireTimeISO));
}

// ─── Browser / network layer (not unit-tested) ──────────────────────

function urlBase64ToUint8Array(base64: string): BufferSource {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob(base64.replace(/-/g, '+').replace(/_/g, '/') + padding);
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function getSubscription(): Promise<PushSubscription | null> {
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

/** 'on' if subscribed, 'off' if subscribable, 'unsupported', or 'unconfigured'. */
export async function getPushStatus(): Promise<PushStatus> {
  if (!hasPushSupport()) return 'unsupported';
  if (!getVapidKey()) return 'unconfigured';
  try {
    const sub = await getSubscription();
    return sub ? 'on' : 'off';
  } catch {
    return 'off';
  }
}

export interface PushResult {
  ok: boolean;
  error?: string;
}

/**
 * Subscribe this device and upload upcoming reminders.
 * buildReminders composes store data (customTithis × getNextOccurrences) —
 * passed in so this module stays store-free and testable.
 */
export async function enablePush(
  buildReminders: () => PushReminder[] | Promise<PushReminder[]>
): Promise<PushResult> {
  if (!hasPushSupport()) return { ok: false, error: 'Push not supported on this device.' };
  const vapidKey = getVapidKey();
  if (!vapidKey) return { ok: false, error: VAPID_MISSING_MESSAGE };

  try {
    if (Notification.permission === 'denied') {
      return { ok: false, error: 'Notifications are blocked in browser settings.' };
    }
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      if (result !== 'granted') return { ok: false, error: 'Notification permission required.' };
    }

    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
    const reminders = await buildReminders();
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: subscription.toJSON(), reminders }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      await subscription.unsubscribe().catch(() => undefined);
      return {
        ok: false,
        error:
          res.status === 503
            ? `Server storage not configured yet. ${(data as { hint?: string }).hint ?? ''}`.trim()
            : 'Could not save push subscription. Try again later.',
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not enable push reminders. Try again later.' };
  }
}

export async function disablePush(): Promise<PushResult> {
  try {
    const sub = hasPushSupport() ? await getSubscription().catch(() => null) : null;
    if (sub) {
      await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      }).catch(() => undefined);
      await sub.unsubscribe().catch(() => undefined);
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not turn off push reminders.' };
  }
}

/** Re-upload upcoming reminders (call on app open / after tithi edits). */
export async function syncPushReminders(
  buildReminders: () => PushReminder[] | Promise<PushReminder[]>
): Promise<void> {
  if (!hasPushSupport() || !getVapidKey()) return;
  try {
    const sub = await getSubscription();
    if (!sub) return;
    const reminders = await buildReminders();
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub.toJSON(), reminders }),
    });
  } catch {
    // Best-effort sync — never break the app for push.
  }
}
