# PanchangPro (VedaTime) — Project Status

**Version:** 3.8.0 · **Updated:** Sep 19, 2026 · **Status:** Code-complete, awaiting deploy + device smoke test

| Metric | Value |
|---|---|
| TypeScript errors | 0 |
| Build | clean, ~3.7s, PWA precache generated |
| Tests | 1411 passed / 3 skipped, 19 files, 0 failing |
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
- **Hygiene** — zero `console.*` prod, bold→500, 48px targets, dead data/docs deleted, `og:image` share card, local-only More-menu telemetry.

## Known limitations (documented, not defects)
- Amanta month convention (purnimanta users see boundaries a fortnight early).
- Kshaya Maas detection exists, unproven (no occurrence near testable range).
- Notification scheduler uses approximations (engine finder ready for rewire).
- Placeholder ad scaffold (no publisher ID, never initializes) — wire or remove pre-launch.
- Karva Chauth stays Udaya-based (no moonrise model); Vaishnava Ekadashi nuances open.

## Launch checklist → GO_LIVE_PLAN.md
