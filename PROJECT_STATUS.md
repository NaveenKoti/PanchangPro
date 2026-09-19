# PanchangPro (VedaTime) — Project Status

**Version:** 3.8.0 · **Updated:** Sep 19, 2026 · **Status:** Code-complete, awaiting deploy + device smoke test

| Metric | Value |
|---|---|
| TypeScript errors | 0 |
| Build | clean, ~3.7s, PWA precache generated |
| Tests | 1464 passed / 3 skipped, 24 files, 0 failing |
| Drik ground truth (Delhi) | tithi 490/490 exact · sunrise/sunset 490/490 ±5min · nakshatra 105/105 · yoga/karana 6/6 |
| i18n | 6 languages, 0 missing keys (131/131) |
| CI | TZ=Asia/Kolkata pinned (UTC runners shifted Udaya-tithi) — confirm green on latest push |
| Deploy | NOT yet done — Vercel import pending (owner action) |

## What shipped since 3.7.0
- **Vyapti-aware festivals** — Ganesh Chaturthi (Madhyahna, Sep 14 2026), Maha Shivratri (Nishita, Feb 15 2026), Pradosh (sunset, first evening); true amanta month for rule gating.
- **Adhik Maas engine** — new-moon spans + ingress counting; anchors 2023 Shravana, 2020 Ashwin, 2026 Jyeshtha; lunar month now displayed in Today.
- **Observance registry** (`src/data/observances/`) — 12 sankrantis (live ingress detector), 10 vrats, navratris, pitru-paksha, sawan-somvar, adhik; append-by-object pattern.
- **First-time UX** — "What is Panchang?" onboarding (en+hi, hi-IN locale default), tap-to-explain glossary (Tithi/Nakshatra/Yoga/Karana/Maas), Settings About reference.
- **Honest reminders** — no-login, foreground + on-open missed digest ("While you were away"); killed-app push deferred to v3.8.
- **Premium fully removed** — no caps, no upsells, no fake upgrade (rule: paused = absent).
- **Refined sacred minimal pass** — Today (gradient hero + moon phase, score ring, icon timings), Calendar, Fasts, Muhurta; tabs now Today/Calendar/**Muhurta**/My Tithis/More (Fasts→More).
- **Festival search + coming-up strip** — 63-entry en+hi index, next-occurrence countdowns, valid taps open detail.
- **Festival stories 28 → 45** — all 16 text-only FESTIVALS ids + Vaikuntha covered (en+hi); zero duplicate ids; Holika shows Puja Muhurat block.
- **Vaikuntha Ekadashi (24th name)** — Padma + Bhavishya Purana basis; Jan 10 2025 plain, Dec 30 2025 viddha path; counts 23→24.
- **Push scaffold (v3.8-ready)** — SW injectManifest + push handlers, `/api/subscribe|unsubscribe|cron`, KV store, Vercel Cron 01:00 UTC; needs keys + KV link (docs/PUSH_SETUP.md).
- **Placeholder ads deleted** — GoogleAdSlot/AdCarousel/AdManager/AdBanner/InterstitialAd + all usages removed.

## Known limitations (documented, not defects)
- Amanta month convention (purnimanta users see boundaries a fortnight early).
- Kshaya Maas detection exists, unproven (no occurrence near testable range).
- Notification scheduler uses approximations (engine finder ready for rewire).
- Placeholder ad scaffold (no publisher ID, never initializes) — wire or remove pre-launch.
- Karva Chauth stays Udaya-based (no moonrise model); Vaishnava Ekadashi nuances open.

## Launch checklist → GO_LIVE_PLAN.md
