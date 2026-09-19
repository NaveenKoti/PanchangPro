# VedaTime — Project Brief

**Package:** `veda-time` v3.8.0
**Tagline:** Sacred Rhythms of Time
**Location:** `/Users/naveenkoti/Applications/myCode/myProjects/PanchangPro/`
**Status (2026-09-19):** Code-complete, awaiting deploy + device smoke test. See GO_LIVE_PLAN.md.

---

## 1. What Is the App

VedaTime (formerly PanchangPro) is a **Progressive Web App (PWA)** that delivers a digital **Hindu Panchang** — the traditional Vedic almanac — on mobile and desktop. It answers the daily questions a practicing Hindu householder, astrologer, or spiritually curious user asks:

- What tithi, nakshatra, yoga, karana is today?
- When is sunrise, sunset, Rahu Kaal, Brahma Muhurta?
- Is today a fast day (Ekadashi, Pradosh, Sankashti)?
- Is there a festival today, and what's the story behind it?
- What does today's muhurta favor — new work, travel, rituals?

Built with React 18 + TypeScript + Vite 5 + MUI v5 + Zustand. Six languages (EN, HI, SA, KN, TE, TA). Offline-capable via service worker.

---

## 2. What It Is Trying to Do

**End result (the vision):**
A single polished app a Hindu user opens every morning — like a Gita-meets-Calendar — that:

1. **Replaces the paper almanac** with accurate, location-aware panchang calculations (verified against Drik Panchang).
2. **Connects ritual to understanding** — not just "today is Ekadashi" but *why*, the story, the benefits, the parana time.
3. **Respects the user** — privacy-first analytics, no dark patterns, beautiful in both light and dark mode, typographically disciplined (Noto Sans, weights 400/500 only, saffron/sacred green/cosmic indigo palette).
4. **Works for any devotee** — not just Delhi/Mumbai users. Location-aware sunrise, regional festival recognition, six Indic languages.
5. **Ships as a PWA** — installable, offline-capable, no app-store tax, one codebase.

**Monetization (future):** AdSense + an optional premium tier for advanced tithi tracking, reminders, and muhurta features. Currently paused pending functional parity.

---

## 3. Current State

| Area | Status |
|------|--------|
| Panchang engine (tithi, nakshatra, yoga, karana, sunrise/sunset, Rahu Kaal) | Working, Drik-verified |
| Festival detection (38 festivals, tithi+paksha+lunar-month matching) | No false positives |
| Calendar (responsive grid, festival highlighting, tap-to-detail) | Done |
| Fasts screen (Ekadashis, Vrats, Festivals tabs) | Done |
| Muhurta screen (live countdown, day/night toggle) | Done |
| Stories screen (tithi meaning, verses, festival lore) | Done |
| My Tithis (custom CRUD, reminders) | Done |
| Dark mode (all components, WCAG AA contrast) | Verified |
| i18n (6 languages; Sanskrit falls back to Hindi) | Sanskrit incomplete |
| PWA (service worker, manifest, icons 144/192/512 + maskable) | Done |
| Tests | 225 passed, 4 skipped, 0 failed |
| Build | `tsc && vite build` — 0 errors, ~3.6s, 33 precache entries |
| AdSense | Placeholder ID — silently hidden in prod |
| Payments | UI exists, no backend |
| Push notifications | Browser-only (no server) |

**Known non-blocking issues:** ~19 min residual sunset drift (within tolerance), ~200 hardcoded color instances (replace-on-touch policy), lunar month ±1 day variance in edge cases.

---

## 4. Tasks Required — Ordered by Priority

### A. To Deploy (DONE — green-lit)
No remaining blockers. The app can ship today as-is, with ads silently hidden.

### B. Pre-Launch Polish (optional, ~1–2 hours each)
1. **Ads** — placeholder system deleted Sep 19; reintroduce only with a real publisher ID.
2. **Verify PWA install flow** on a real iOS and Android device.
3. **Final Lighthouse pass** — target ≥90 on Performance, Accessibility, Best Practices, SEO, PWA.
4. **Deploy target decision** — Vercel / Netlify / Cloudflare Pages. Configure custom domain + HTTPS.

### C. Post-Launch v4.0 Roadmap
1. **@bidyashish/panchang integration** — swap custom engine for battle-tested library to close residual drift.
2. **Sanskrit translation completion** — replace Hindi fallbacks in `src/i18n/sa.json`.
3. **Push notification backend** — move from browser-scheduled to server-pushed (Firebase / OneSignal).
4. **Premium payments** — Razorpay (India) or Stripe. Wire to existing paywall UI. Re-enable premium gating.
5. **Family sharing** — shared My-Tithis lists across devices.
6. **Home-screen widgets** — iOS WidgetKit / Android Glance for today's tithi.
7. **More languages** — Bengali, Marathi, Gujarati.
8. **E2E tests** — Playwright journeys for today / calendar / fasts flows (scaffold exists in `e2e-tests/`).
9. **Gradual color cleanup** — eliminate remaining hardcoded hex via the replace-on-touch rule.

---

## 5. How to Test — Verification Checklist

### Automated
```bash
npm test                # Vitest — must show 225 passed, 4 skipped, 0 failed
npm run build           # tsc && vite build — must exit 0, no TS errors
npm run lint            # ESLint — zero warnings policy
```

### Manual smoke test (~15 min)
1. **`npm run dev`** → open `http://localhost:5173`.
2. **Today screen:** panchang loads, sunrise/sunset display, AyurvedicClock animates without the "Loading dinacharya..." gap.
3. **Location:** allow geolocation → values update for your city.
4. **Calendar screen:** tap a festival date → detail panel opens → festival card navigates to FestivalDetailScreen.
5. **Fasts screen:** cycle Ekadashis / Other Vrats / Festivals tabs → each card opens a detail dialog.
6. **Muhurta screen:** countdown ticks every second; Day / Night / Both toggle works.
7. **Stories screen:** today's verse renders; it changes on a different date.
8. **My Tithis:** add → edit → delete a custom tithi; reminder toggle persists.
9. **Language switcher (Settings):** cycle EN → HI → KN → TE → TA → SA. Verify key strings translate.
10. **Dark mode toggle:** no blinding white backgrounds; all borders visible; saffron / green / indigo adapt.
11. **Share:** three-dot menu → share card renders as PNG; no duplicate share entry points inside screens.
12. **PWA:** Chrome DevTools → Application → Service Workers → active. Lighthouse → PWA installable.
13. **Offline:** Network → Offline → reload → offline fallback or cached view renders.

### Reference-truth spot check
Drik Panchang, Bangalore **2026-04-19**: sunrise ~06:04 IST, sunset ~18:34 IST. App should match within ±5 min.

---

## 6. Deployment Readiness — Go / No-Go

| Gate | Required | Current | Status |
|------|----------|---------|--------|
| TypeScript errors | 0 | 0 | Pass |
| Tests passing | 100% non-skipped | 225/225 | Pass |
| Production build succeeds | yes | yes | Pass |
| Sourcemaps disabled in prod | yes | yes | Pass |
| Console.logs in bundle | 0 | 0 | Pass |
| PWA manifest + all icons present | yes | yes | Pass |
| apple-touch-icon is PNG | yes | yes | Pass |
| Dark mode verified on all screens | yes | yes | Pass |
| AdSense gracefully disabled with placeholder | yes | yes | Pass |
| Hardcoded secrets / API keys | 0 | 0 | Pass |
| HTTPS deploy target chosen | — | pending | Pre-launch |
| Real AdSense publisher ID | — | placeholder (safe) | Post-launch |

**Verdict: GO.** Deploy v3.7.0 to a static host (Vercel / Netlify / Cloudflare Pages). Post-launch work continues in parallel.

### Deploy command sketch
```bash
npm run build
# output in dist/ — upload to your host, or:
# vercel --prod
# netlify deploy --prod --dir=dist
# wrangler pages deploy dist
```

---

## 7. Success Criteria (90 days post-launch)

- Install rate: ≥15% of returning visitors install the PWA.
- Daily active usage: users open the app in the first 2 hours after sunrise (morning-ritual signal).
- Lighthouse scores hold ≥90 across all 5 categories on mobile.
- Zero Drik-Panchang-verifiable panchang errors reported.
- Festival detection: zero false positives across the full year.
- Accessibility: zero WCAG AA contrast regressions.

If those hold, v4.0 (premium + @bidyashish engine + push backend) ships as the next meaningful milestone.
