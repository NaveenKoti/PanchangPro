/**
 * api/subscribe.ts — store a push subscription + upcoming reminders.
 *
 * Design truth (no-login ethos): the server NEVER sees user tithis.
 * The CLIENT posts its upcoming reminders (already resolved to plain
 * {id,title,body,fireTimeISO}); the server is a dumb time-triggered sender.
 *
 * POST { subscription: PushSubscription, reminders: [{id,title,body,fireTimeISO}] }
 * → 200 { ok: true, stored: n }
 * → 503 { error: 'KV not configured', hint } when @vercel/kv env is missing
 */

import { kv } from '@vercel/kv';

export interface ClientReminder {
  id: string;
  title: string;
  body: string;
  fireTimeISO: string;
}

export interface StoredPushRecord {
  subscription: {
    endpoint: string;
    keys?: { p256dh?: string; auth?: string };
    expirationTime?: number | null;
  };
  reminders: ClientReminder[];
  updatedAt: string;
}

/** One KV key per subscription endpoint (fnv-1a hex — no user data in the key). */
export function keyForEndpoint(endpoint: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < endpoint.length; i++) {
    hash ^= endpoint.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `push:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function isKvNotConfigured(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /KV_REST_API_URL|KV_REST_API_TOKEN|@vercel\/kv/i.test(msg);
}

export const KV_SETUP_HINT =
  'Create a Vercel KV database (Storage → KV) and link it to this project so KV_REST_API_URL / KV_REST_API_TOKEN are set. See docs/PUSH_SETUP.md.';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { subscription, reminders } = req.body ?? {};
  if (!subscription || typeof subscription.endpoint !== 'string') {
    res.status(400).json({ error: 'Missing subscription.endpoint' });
    return;
  }
  if (!Array.isArray(reminders)) {
    res.status(400).json({ error: 'Missing reminders array' });
    return;
  }

  const clean: ClientReminder[] = reminders
    .filter(
      (r) =>
        r &&
        typeof r.id === 'string' &&
        typeof r.title === 'string' &&
        typeof r.body === 'string' &&
        typeof r.fireTimeISO === 'string' &&
        !isNaN(Date.parse(r.fireTimeISO))
    )
    .slice(0, 100);

  const record: StoredPushRecord = {
    subscription,
    reminders: clean,
    updatedAt: new Date().toISOString(),
  };

  try {
    await kv.set(keyForEndpoint(subscription.endpoint), record);
  } catch (err) {
    if (isKvNotConfigured(err)) {
      res.status(503).json({ error: 'KV not configured', hint: KV_SETUP_HINT });
      return;
    }
    res.status(500).json({ error: 'Failed to store subscription' });
    return;
  }

  res.status(200).json({ ok: true, stored: clean.length });
}
