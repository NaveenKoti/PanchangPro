# VedaTime Improvement Plan — Engine-First (Swiss Deferred)

**Date:** 2026-09-09
**Weighting:** Track 1 Engine > Track 3 Go-live ops > Track 2 UI polish
**Basis:** Read-only audit of engine, UI/theme/i18n, build/bundle/tests/ops (Explore agents, no edits).

---

## Track 1 — Engine Accuracy (P0, ~4–6 h)

Current: sunrise +5 min, sunset **−19 min systematic** (Bangalore 2026-04-19, `session-notes.md:19`), masked by `±90 min` tolerances (`sunrise.test.ts:30`, `referenceData.ts:136`, `drik-panchang-comparison.test.ts:99ff`).

1. **Iterate solar + fix EoT wrap — ~1 h, recovers ~5–10 min.** `sunrise.ts:89-92` (`E` → wrap180 diff), `:204-209,:255-261` (loop Δ<5 s). Verify: probe → 06:04/18:34 ±5 min.
2. **Tighten golden tests — ~1 h.** Promote probe to `±5` asserts; ratchet `referenceData.ts:136,146,156,166` + comparison file `90→15→5`. Drop NY `360` fudge (`:177`) after #3. Verify: `npm test`, no tolerance-hiding.
3. **TZ-correct JD + `hoursToDate` — ~2–3 h, required pre non-IST launch.** `sunrise.ts:181-183,233-235,269-315`, `utils.ts:36-55,179-191`. Location-local midnight JD; result in location TZ. Verify: NY/DST ±15 min.
4. **NOAA/Meeus Ch.15 upgrade — ~3–5 h, →±2–3 min, still offline.** Variable ε(T), full nutation, pressure/temp refraction, keep upper-limb `-0.8333°`, remove `0.11/km` hack. Plus: nakshatra end search (not linear `:463`), un-hardcode parana, fix samvatsara. Verify: Drik full-month + Ekadashi-2026 tighter.
5. **Swiss deferred.** Collect 30-day post-fix drift first; then decide `@bidyashish/panchang` adapter (2–4 h, ±1 min, 50–100 MB ephemeris cost per `BIDYASHISH_INTEGRATION_PLAN.md`). Also fix stale `CLAUDE.md:221,281` refs → `200,209,252,261`.

---

## Track 2 — Go-live Ops (P0–P1, ~3–4 h)

1. **CI — P0.** No workflows, no `vercel.json/netlify.toml`. Minimal `npm ci → test → build → playwright`. Without it, "225/4/0" is unverifiable.
2. **Test docs + `test:e2e` — P0.** `TEST_SUMMARY.md` (134/193, deleted file ref) contradicts `PROJECT_BRIEF.md` (225/4/0); disk = 14 unit + 2 e2e files. Archive/rewrite; add script. Only 2 real skips (`tithi-management.test.ts:560,728`).
3. **PWA assets — P1.** `vite.config.ts:10` lists `favicon.ico/apple-touch-icon.png/mask-icon.svg`, absent from `public/`; dedupe manifest (file vs inline); add `screenshots/shortcuts` later.
4. **Observability — P1.** Zero Sentry; analytics local-only; WebVitals in-memory; `usePWAStatus` failures silent in prod. Add Sentry + beacon; gate `analytics.ts:58` warn (zero-log policy).
5. **Bundle/TS — P2/P3.** `chunkSizeWarningLimit:50` → noise (raise 500–1000 + CI budget); add `lottie-react` to `manualChunks`; extend `tsc` beyond `include:["src"]` to cover `e2e-tests/`.

---

## Track 3 — UI/Theme/i18n (~2 h)

Already fixed (do NOT redo): `AyurvedicClock getDoshaConfig(theme)`, `TodayGuidanceCard` clean, `BottomNav` clean, `TodayScreen.css` stub OK.

Real residue:

- **3 saffrons:** `vedaTheme.ts:23 #E8722A` vs `ThemeProvider.tsx:28 #F0A060` vs spec `#C75B12`; wrong fonts (`vedaTheme.ts:113-132` Inter/Playfair/600 vs Noto 400/500). Single-source tokens — M.
- **Second theme:** `ThemeProvider.tsx:28-132` duplicates vedaTheme + gradients — delete/merge — M.
- **Screen hardcodes:** `MuhurtaScreen.tsx:100-126,566,952,977`, `FestivalShareCard.tsx:95-117`, `PanchangShareCard.tsx:33`, `FestivalDetailScreen.tsx:36+`; engine hex `muhurta.ts:70-76` → theme keys. Replace-on-touch.
- **1-liners:** `StoriesScreen.tsx:304 #9CA3AF` → `text.secondary`; `700→500` sweep; `elevation 4/3/2→0` (`OfflineIndicator.tsx:98`, `CalendarScreen.tsx:311,407,1380`).
- **i18n logic (not data):** `sa.json` complete (283 keys) — gap is `TodayGuidanceCard.tsx:53,151,213,249,290` hi-only branches + `fallbackLng:'en'`. Add `sa` fallback — S.
- **Share policy:** 12 extra entry points (`TodayScreen:204 FAB`, `Fasts:253`, `FestivalDetail:388,800`, `Calendar:756`, `Stories:156,212,254,303`) vs AppBar-only spec — needs policy call before cleanup.

---

## Suggested Order

1. Engine #1 + #2 (~2 h) → probe + `npm test`
2. CI + test-doc reconcile (~1 h) → trustworthy baseline
3. Engine #3 (~2–3 h) → non-IST + NY tolerance
4. PWA assets + Sentry (~1–2 h) → deployable
5. Theme single-source + 1-liners (~1 h) → polish
6. Engine #4 (~3–5 h) → ±2–3 min, then revisit Swiss with data
