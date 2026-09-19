/**
 * api/unsubscribe.ts — delete a stored push subscription.
 *
 * POST { endpoint: string } → 200 { ok: true } (also when nothing was stored)
 * → 503 when @vercel/kv env is missing.
 */

import { keyForEndpoint, isKvNotConfigured, getKv, KV_SETUP_HINT } from './subscribe';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { endpoint } = req.body ?? {};
  if (!endpoint || typeof endpoint !== 'string') {
    res.status(400).json({ error: 'Missing endpoint' });
    return;
  }

  try {
    const kv = await getKv();
    if (!kv) {
      res.status(503).json({ error: 'KV not configured', hint: KV_SETUP_HINT });
      return;
    }
    await kv.del(keyForEndpoint(endpoint));
  } catch (err) {
    if (isKvNotConfigured(err)) {
      res.status(503).json({ error: 'KV not configured', hint: KV_SETUP_HINT });
      return;
    }
    res.status(500).json({ error: 'Failed to remove subscription' });
    return;
  }

  res.status(200).json({ ok: true });
}
