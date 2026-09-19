# VedaTime (PanchangPro) — Session Notes
Last updated: 2026-09-11 (session 6 — engine fix + e2e)

## Session 6 (2026-09) — Engine jd0/EoT Fixes, 490-Day Ground Truth, Reminder Phase A, UI Hygiene

### What changed
- **Engine jd0 stale-JD bug + EoT sign flip** — Fixed Meeus Julian Day base (was ~1 month stale) and flipped EoT sign from `+` to `-` in `calculateSunrise`/`calculateSunset`. Formula: `hours = solarTime - E/60 - longitudeTimeCorrection`. Both signs now minus. **Result: sunrise/sunset all 490 Delhi days within ±5 min of Drik** (was ±47 min drift).
- **490-day Drik ground truth** — Added `drikTruth.ts` (490 Delhi days, Dec 2024–May 2026) and `tithi-accuracy.test.ts` (980 tests). Tithi exact on 482/490 days; 8 known-miss days ratcheted (Δ ≤ 1 day). Verified against Drik Panchang.
- **Sign invariant preserved** — The `-E/60 - longitudeTimeCorrection` formula is invariant; changing either sign reintroduces ±29 min seasonal error.
- **Reminder Phase A** — Inline permission prompt, engine-date scheduling, `reminderDaysBefore` support.
- **UI hygiene** — Removed share FAB (single-entry AppBar 3-dot menu only); bottom nav labels always visible.
- **Karana 0/4 bug REPORTED** — All 4 karana values compute as 0; root cause under investigation.

### Verification
- `npm test`: 1231 passing / 4 skipped / 0 failing
- `npm run build`: 0 TS errors, 12.69s, 33 PWA precache entries
- E2E `offline-smoke.spec.ts`: 1/1 passed
- E2E `critical-flows.spec.ts`: 18/19 passed, 1 failed (share FAB — fixed test expectation)
- Spot-check Bangalore 2026-04-19: sunrise ~06:04 IST, sunset ~18:34 IST

### Still open
- **Karana 0/4** — reported, not yet fixed
- **~200 hardcoded color instances** — gradual cleanup
- **Sanskrit `sa.json`** — Hindi fallback
- **AdSense placeholder** — `ca-pub-PLACEHOLDER` still in `GoogleAdSlot.tsx`

---

## Session 5 (2026-04-19) — Deployment Readiness
---

## Session 3 (2026-04-19) — Sunrise/Sunset Sign Fix

### What changed
- **`src/engine/sunrise.ts` lines 221 and 281** — flipped sign on longitude time correction.
  - Before: `sunriseHours = solarTime + E / 60 + longitudeTimeCorrection`
  - After:  `sunriseHours = solarTime + E / 60 - longitudeTimeCorrection`
  - Same flip applied to `sunsetHours` at line 281.
  - **Why:** `solarTime = 12 - H/15` gives local apparent solar time at the observer's longitude; converting to clock time at the timezone's standard meridian requires *subtracting* `(observer_lon - standard_meridian)/15`. Previous code added it. Bangalore (lon 77.5946) is west of the 82.5° IST standard meridian (longitudeDiff = -4.9°), so flipping the sign adds +19.6 min — bringing Bangalore sunrise into line with Drik Panchang.

### Verification (Bangalore 2026-04-19, via `_probe-2026-04-19-bangalore.test.ts`)
| Quantity    | Before fix   | After fix    | Drik Panchang | Delta vs Drik |
|-------------|--------------|--------------|---------------|---------------|
| Sunrise     | 05:29:39 IST | 06:08:54 IST | ~06:04        | +5 min        |
| Sunset      | 17:35:19 IST | 18:14:34 IST | ~18:34        | −19 min       |
| Tithi       | Shukla Dwitiya #2 | (unchanged) | Shukla Dwitiya | match      |
| Nakshatra   | Bharani #2   | (unchanged)  | Bharani       | match         |
| Yoga        | Ayushman #3  | (unchanged)  | Ayushman      | match         |
| Karana      | Taitila #4   | (unchanged)  | Taitila       | match         |

Rahu Kaal, Yamagandam, Gulika Kaal all shift correspondingly (derived from sunrise/sunset).

### Still open (carried to next session)
- **Residual ~19 min sunset drift** — smaller than pre-fix error; likely secondary asymmetry (refraction asymmetry, EoT evaluation time, or JD-at-0h-UT vs noon-UT). Within the 90-min test tolerance — not regression-blocking.
- **Probe test** `src/engine/__tests__/_probe-2026-04-19-bangalore.test.ts` — kept for regression.

---

## Session 5 (2026-04-19) — Deployment Readiness

### What changed
- **GoogleAdSlot.tsx** — Added `isPlaceholder` guard: returns `null` in production when `ca-pub-PLACEHOLDER` is still set. No broken ad slots in prod.
- **PNG icons generated** — `icon-144x144.png`, `icon-192x192.png`, `icon-512x512.png`, `icon-192x192-maskable.png`, `icon-512x512-maskable.png` from `icon.svg` using sharp-cli. All match `manifest.webmanifest` paths.
- **index.html** — `apple-touch-icon` updated from `/logo.svg` to `/icons/icon-192x192.png`.
- **tithi-management.test.ts** — Skipped 1 premium-downgrade test (premium is paused). 225 tests pass, 4 skipped, 0 failures.
- **Build verified** — `tsc && vite build` passes with 0 TS errors, 3.64s build time, 33 PWA precache entries.

### Verification
- **Tests:** 225 passed, 4 skipped, 0 failed
- **Build:** 0 errors, ~1.5 MB total bundle (compressed)
- **Previously flagged UI bugs:** All 6 critical/high items already fixed in sessions 1-4 (confirmed by re-reading source files)

### Deployment checklist
- [x] All critical dark mode fixes applied (TodayScreen.css, AyurvedicClock, TodayGuidanceCard, BottomNav, EkadashiDetailCard)
- [x] CSS vars synced with MUI theme
- [x] GoogleAdSlot gracefully handles placeholder ID
- [x] PNG icons generated for PWA manifest
- [x] apple-touch-icon points to PNG
- [x] Tests pass (225/225)
- [x] Build passes (0 TS errors)
- [ ] Replace `ca-pub-PLACEHOLDER` with real AdSense ID when ready
- [ ] Sanskrit translations (sa.json still uses Hindi fallback)
- [ ] Push notification backend (browser-only currently)

---

## What Is Complete and Working (v3.7.0)

- **Panchang engine** — tithi, nakshatra, yoga, karana, sunrise/sunset (±2 min), Rahu Kaal, Yamagandam, Gulika Kaal; Lahiri ayanamsa; 33-term Moon perturbation
- **Festival detection** — 38 festivals using tithi + paksha + lunar month matching; verified against Drik Panchang; no false positives
- **5 screens via bottom nav** — Today, Calendar, Fasts, My Tithis, More (Stories & Muhurta inside More)
- **Today screen** — hero tithi card, panchang details, ayurvedic clock, fasting card (when applicable), share via three-dot menu
- **Calendar screen** — tap-to-expand day detail panel; festival highlighting; fasting dots; "Today" button
- **Fasts screen** — Ekadashi, Other Vrats, Festivals tabs; clickable with detail dialogs; upcoming sorted
- **Muhurta screen** — live countdown, progress bar, visual timeline, 3-tier fallback
- **Stories screen** — tithi meaning, nakshatra wisdom, festival card, daily verse (186+), solar timings
- **My Tithis** — CRUD, reminders, export/import, upcoming occurrences
- **Share** — Panchang + Festival share cards (PNG), WhatsApp text, single entry point (three-dot menu only)
- **Theme** — full light/dark mode; WCAG AAA (11:1 contrast); all tokens via MUI theme
- **i18n** — 6 languages (en, hi, sa, kn, te, ta)
- **PWA** — service worker, offline page, 18 precached entries, install prompt
- **Analytics** — privacy-first, localStorage-based, 7-day rolling window
- **Testing** — 169/169 Vitest tests passing; Playwright E2E setup (75% pass rate)
- **Build** — 0 TypeScript errors, ~3.3s build time, ~752KB compressed bundle

---

## Partially Built / Needs Attention

| Area | Status |
|---|---|
| `TodayGuidanceCard.tsx` | Partially theme-fixed: 8 hardcoded color instances remain in JSX (lines 170, 204, 221-222, 240, 257-258, 274) |
| `AyurvedicClock.tsx` | DOSHA_CONFIG still uses hardcoded hex; 10+ `rgba(0,0,0,...)` backgrounds not theme-aware |
| `TodayScreen.css` | No `:root.dark { }` block — CSS vars all light-mode-only; 443 lines; causes blinding white BG in dark mode |
| `BottomNav.tsx` | Icon color uses `#9CA3AF` hardcoded for inactive state |
| `EkadashiDetailCard.tsx` | Some hardcoded colors remain |
| `CalendarScreen.tsx` | Some hardcoded colors (~minor) |
| AdSense | `ca-pub-PLACEHOLDER` in `GoogleAdSlot.tsx` — must replace with real publisher ID before going live |
| Sanskrit translations | `sa.json` uses Hindi as fallback — proper Sanskrit not yet written |
| App icon | `public/icons/icon.svg` generated ✅ — PNG exports still needed (144, 192, 512 + maskable) |
| Push notifications | Browser-only; no backend for server-sent push |
| Payment processing | Premium paywall UI exists; no payment backend (deliberately paused) |
| `@bidyashish/panchang` integration | Planned for v4.0.0 (Swiss Ephemeris, ±1 min accuracy) — not started |

---

## Known Bugs (from .md files + scan)

1. **`TodayScreen.css` missing dark mode block** — `CRITICAL` — No `:root.dark` overrides; all CSS vars stay light-mode; blinding white backgrounds in dark mode (`UI_BUGS_FIX_PLAN.md` Step 3)
2. **`AyurvedicClock.tsx` DOSHA_CONFIG hardcoded** — `CRITICAL` — `#7C4DFF`, `#F4511E`, etc. don't adapt to theme; icons invisible in dark mode (`UI_BUGS_FIX_PLAN.md` Step 2)
3. **`TodayGuidanceCard.tsx` 8 residual hardcodes** — `HIGH` — Solar timings graph invisible/wrong colors in dark mode; fix is exact replacements documented in `UI_BUGS_FIX_PLAN.md` Step 1
4. **`BottomNav.tsx` inactive icon color** — `MEDIUM` — `#9CA3AF` hardcoded; invisible in some themes
5. **CSS/MUI theme value mismatch** — `MEDIUM` — `globals.css` saffron `#C75B12` vs `ThemeProvider.tsx` primary.main `#F0A060`; causes inconsistent icon colors (`FIX_PLAN.md`)
6. **Bundle size** — `LOW` — MUI core chunk 445KB; circular dependency `utils → mui-core → utils`; build warns but doesn't fail
7. **~200 remaining hardcoded color instances** — `LOW` — gradual cleanup on touch

---

## Next Steps (Priority Order)

1. **[CRITICAL] Add `:root.dark { }` block to `TodayScreen.css`** — exact values documented in `UI_BUGS_FIX_PLAN.md` Step 3; ~30 min
2. **[CRITICAL] Fix `AyurvedicClock.tsx` DOSHA_CONFIG** — replace with `getDoshaConfig(theme)` function; replace `rgba(0,0,0,...)` with dark-aware variants; ~20 min
3. **[HIGH] Fix remaining 8 hardcodes in `TodayGuidanceCard.tsx`** — exact line/replacement documented in `UI_BUGS_FIX_PLAN.md` Step 1; ~15 min
4. **[HIGH] Sync CSS vars with MUI theme values** — align `globals.css` saffron token with `vedaTheme.ts` primary.main; ~15 min
5. **[MEDIUM] Fix `BottomNav.tsx` inactive color** — replace `#9CA3AF` with `theme.palette.text.secondary`
6. **[MEDIUM] Fix `EkadashiDetailCard.tsx` hardcoded colors**
7. **[DEPLOY BLOCKER] Replace AdSense placeholder** — `ca-pub-PLACEHOLDER` → real publisher ID in `GoogleAdSlot.tsx` before going live
8. **[DEPLOY BLOCKER] Generate PNG icons from SVG** — `public/icons/icon.svg` exists; need PNG exports at 144, 192, 512 (regular + maskable). Update `index.html` favicon link.
9. **[POST-LAUNCH] `@bidyashish/panchang` integration** — Swiss Ephemeris wrapper for v4.0.0 (plan in `BIDYASHISH_INTEGRATION_PLAN.md`)
10. **[POST-LAUNCH] Sanskrit translations** — write proper `sa.json` (currently Hindi fallback)

---

## Key Architectural Decisions

| Decision | Rationale |
|---|---|
| All colors via `useTheme()` / MUI tokens | Dark mode correctness; WCAG compliance |
| Udaya Tithi principle (sunrise-based) | Correct per Hindu calendar tradition; timeless calculation |
| 33-term Moon perturbation | Balance: accuracy vs bundle size (Swiss Ephemeris adds 50-100MB) |
| Panchang engine is pure TS (no API) | Offline-first; no server dependency; fast |
| Single share entry point (three-dot menu) | User mandate — no duplicate share buttons inside screens |
| Premium paused | User wants full functional parity before monetization |
| Noto Sans 400/500 only | VedaTime brand guide — no Inter, no bold/700 |
| Privacy-first analytics (localStorage) | No external tracking; 7-day rolling window |

## Session 7 (2026-09-19) — Vyapti, Adhik, launch cleanup, modern hero
- **Vyapti fix (user-reported Ganesh bug)**: Udaya-only matching showed Sep 15 2026; Madhyahna rule → Sep 14. Added `FestivalData.vyapti` (udaya/madhyahna/pradosh/nishita), engine vyapti pass + amanta month, Pradosh sunset rule (Jun 8 not Jun 9 2025). 8 vyapti tests, all sourced.
- **Adhik Maas engine**: new-moon spans + ingress counting; anchors 2023/2020/2026; month label in Today; registry `adhik` kind.
- **Cleanup**: premium fully removed (no caps/upsells), dead data/tests deleted, 19 stale docs → `docs/archive/`, PROJECT_STATUS/TEST_SUMMARY/GO_LIVE_PLAN rewritten, version 3.8.0.
- **CI fix**: TZ=Asia/Kolkata pinned (UTC runners red since Sep 18).
- **Modern Today**: gradient hero + moon-phase visual, score ring, icon timings, tighter rhythm (light+dark verified).
- Suite 1411 passed / 3 skipped. Pending: Vercel import, device smoke test (owner).
