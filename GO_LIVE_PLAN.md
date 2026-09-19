# VedaTime — Go-Live Checklist (rewritten Sep 19, 2026; supersedes all prior plans)

Locked decisions: host = **Vercel** · reminders = **foreground + on-open digest** (true push = v3.8) · premium = **absent** · analytics = **local-only**.

## 1. Confirm CI green (5 min)
Latest push pins `TZ=Asia/Kolkata` (fixes red CI Sep 18–19). Check:
`gh run list --repo NaveenKoti/PanchangPro --limit 3`. If red, paste the failure — do not deploy on red.

## 2. Deploy (15 min, owner)
Vercel → Add New → Import `NaveenKoti/PanchangPro` → Deploy (no env vars).
Validate `/og-image.png`, manifest, SW precache in prod build.

## 3. Two-phone smoke test (1 evening)
- Install (Add to Home Screen) Android + iPhone; airplane-mode kill + reopen (offline works, digest appears if a reminder was missed).
- Foreground reminder fires while app open; Notification permission flow in installed PWA (iOS quirks noted).
- Timings vs Drik for that city; Hindi onboarding read-through (hi-IN browser).
- Share link on WhatsApp → preview card renders.

## 4. Decided since (no longer open)
- Placeholder ads: **deleted** (Sep 19) — GoogleAdSlot/AdCarousel/AdManager/AdBanner/InterstitialAd + usages removed.
- Scheduler approximations vs engine finder rewire: finder ready, rewire deferred (works today).
- Purnimanta one-liner in Settings: open (amanta is the convention).

## 5. Fast follows (v3.8+)
Push backend (VAPID + scheduler + SW push) · nav IA from More-menu telemetry · Karva moonrise rule · Vaishnava Ekadashi nuances · Stories non-English content.
