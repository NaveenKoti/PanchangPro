/**
 * api/cron.ts — time-triggered push sender (Vercel Cron, GET /api/cron).
 *
 * Scans KV for stored subscriptions, sends every reminder with
 * fireTime <= now + SEND_WINDOW_MINUTES, then deletes what was sent.
 * No-ops cleanly without env: { sent: 0, errors: 0, skipped }.
 *
 * → 200 { sent: number, errors: number, skipped?: string }
 */

import webpush from 'web-push';
import { isKvNotConfigured, getKv, type StoredPushRecord } from './subscribe';

export const SEND_WINDOW_MINUTES = 10;
/** Reminders older than this are dropped without sending (stale-blast guard). */
export const STALE_DROP_MS = 24 * 60 * 60 * 1000;

function isSubscriptionGone(err: unknown): boolean {
  const status =
    (err as { statusCode?: number })?.statusCode ??
    (err as { status?: number })?.status;
  return status === 404 || status === 410;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const publicKey = process.env.VAPID_PUBLIC_KEY ?? process.env.VITE_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? 'mailto:admin@example.com';
  if (!publicKey || !privateKey) {
    res.status(200).json({ sent: 0, errors: 0, skipped: 'vapid-not-configured' });
    return;
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const kv = await getKv();
  if (!kv) {
    res.status(200).json({ sent: 0, errors: 0, skipped: 'kv-not-configured' });
    return;
  }

  let keys: string[];
  try {
    keys = await kv.keys('push:*');
  } catch (err) {
    if (isKvNotConfigured(err)) {
      res.status(200).json({ sent: 0, errors: 0, skipped: 'kv-not-configured' });
      return;
    }
    res.status(500).json({ sent: 0, errors: 1, skipped: 'kv-read-failed' });
    return;
  }

  const now = Date.now();
  const horizon = now + SEND_WINDOW_MINUTES * 60 * 1000;
  let sent = 0;
  const errorDetails: string[] = [];

  for (const key of keys) {
    let record: StoredPushRecord | null;
    try {
      record = (await kv.get(key)) as StoredPushRecord | null;
    } catch {
      errorDetails.push(`read-failed:${key}`);
      continue;
    }
    if (!record || !record.subscription || !Array.isArray(record.reminders)) {
      continue;
    }

    const consumedIds = new Set<string>();
    let subscriptionGone = false;

    for (const reminder of record.reminders) {
      const fireMs = Date.parse(reminder.fireTimeISO);
      if (isNaN(fireMs)) {
        consumedIds.add(reminder.id); // unparseable — drop
        continue;
      }
      if (fireMs < now - STALE_DROP_MS) {
        consumedIds.add(reminder.id); // stale — drop without sending
        continue;
      }
      if (fireMs > horizon) continue; // not due yet

      try {
        await webpush.sendNotification(
          record.subscription as Parameters<typeof webpush.sendNotification>[0],
          JSON.stringify({ title: reminder.title, body: reminder.body, tag: reminder.id })
        );
        sent++;
        consumedIds.add(reminder.id);
      } catch (err) {
        if (isSubscriptionGone(err)) {
          subscriptionGone = true;
          break;
        }
        errorDetails.push(`send-failed:${reminder.id}`);
      }
    }

    try {
      if (subscriptionGone) {
        await kv.del(key);
      } else {
        const remaining = record.reminders.filter((r) => !consumedIds.has(r.id));
        if (remaining.length === 0) {
          await kv.del(key);
        } else if (remaining.length !== record.reminders.length) {
          await kv.set(key, { ...record, reminders: remaining });
        }
      }
    } catch {
      errorDetails.push(`cleanup-failed:${key}`);
    }
  }

  res.status(200).json({
    sent,
    errors: errorDetails.length,
    ...(errorDetails.length > 0 ? { details: errorDetails.slice(0, 10) } : {}),
  });
}
