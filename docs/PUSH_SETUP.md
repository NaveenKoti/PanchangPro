# Push reminders (killed-app) — setup

Fires custom-tithi reminders even when the app is closed, via Web Push.

## Design (no-login ethos)

- The server NEVER sees user tithis. The client resolves its own custom
  tithis to plain upcoming reminders `{id, title, body, fireTimeISO}` and
  POSTs them to `/api/subscribe`.
- The server (`api/`) is a dumb time-triggered sender: Vercel Cron hits
  `/api/cron` daily, which sends due reminders via `web-push` and deletes
  what was sent.

## Finish list (3 steps — the only remaining work)

1. **Vercel env vars** (Dashboard → Project → Settings → Environment
   Variables), then redeploy:
   - `VAPID_PRIVATE_KEY=<private key from the release engineer — never committed>`
   - `VAPID_SUBJECT=mailto:you@example.com`
   - `VITE_VAPID_PUBLIC_KEY=<same public key as in .env.example>`
2. **Link a Vercel KV store** (Dashboard → Storage → KV → link to this
   project). This auto-sets `KV_REST_API_URL` / `KV_REST_API_TOKEN`.
   Without it, `/api/subscribe` returns `503 KV not configured`.
3. **Verify**: enable “Killed-app reminders (push)” in Settings →
   Notifications on a deployed build, then
   `curl https://<your-app>/api/cron` → `{"sent":…,"errors":…}`.
   (Cron runs daily at `01:00 UTC ≈ 06:30 IST`; see `crons` in `vercel.json`.)

## Files

| File | Role |
|---|---|
| `src/services/pushService.ts` | Client: VAPID key, permission flow, subscribe/unsubscribe/sync, pure helpers |
| `src/sw.ts` | Custom SW: precache + runtime caching + `push`/`notificationclick` |
| `api/subscribe.ts` | `POST {subscription, reminders}` → KV (key per endpoint hash) |
| `api/unsubscribe.ts` | `POST {endpoint}` → delete |
| `api/cron.ts` | Cron sender: fireTime ≤ now+10min → send → delete; `{sent, errors}` |
| `vercel.json` | Daily cron schedule + SPA rewrite excluding `/api/` |
| `src/services/pushService.test.ts` | Unit tests for pure helpers |

## Notes

- Key rotation: run `npx web-push generate-vapid-keys` once, update
  `VITE_VAPID_PUBLIC_KEY` (client + `.env.example`) and `VAPID_PRIVATE_KEY`
  (Vercel env). Old subscriptions stop working and clients re-subscribe on
  next toggle/app open.
- Live push is not verifiable in local dev (needs deployed HTTPS + env).
