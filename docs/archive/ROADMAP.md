# VedaTime — Deployment Roadmap
Generated: 2026-04-17

Goal: Ship VedaTime as a polished, production-ready PWA. Ordered by blocking priority.

---

## Phase 1 — Dark Mode Fixes (App is broken in dark mode today)

These are visually critical. The app is unusable in dark mode until fixed.

### 1.1 Add `:root.dark {}` block to `TodayScreen.css`
- **File:** `src/screens/TodayScreen.css`
- **Bug:** 443 lines of CSS vars defined only in `:root` (light mode). No dark overrides. Causes blinding white backgrounds in dark mode.
- **Fix:** Add the complete dark block at the top (exact values already in `UI_BUGS_FIX_PLAN.md` Step 3).
- **Estimated effort:** 30 min

### 1.2 Fix `AyurvedicClock.tsx` DOSHA_CONFIG
- **File:** `src/components/AyurvedicClock.tsx`
- **Bug:** `DOSHA_CONFIG` uses hardcoded hex (`#7C4DFF`, `#F4511E`, `#3D6B24`, `#5C6BC0`). 10+ `rgba(0,0,0,...)` backgrounds invisible in dark mode.
- **Fix:** Replace with `getDoshaConfig(theme)` function returning `theme.palette.*` values. Replace `rgba(0,0,0,...)` with `isDark ? rgba(255,255,255,0.05) : rgba(0,0,0,0.05)` pattern.
- **Estimated effort:** 20 min

### 1.3 Fix 8 remaining hardcodes in `TodayGuidanceCard.tsx`
- **File:** `src/components/TodayGuidanceCard.tsx`
- **Bug:** Solar timings graph colors (`#059669`, `#DC2626`, `#fff`) hardcoded — invisible or wrong in dark mode.
- **Fix:** Exact line-by-line replacements documented in `UI_BUGS_FIX_PLAN.md` Step 1.
- **Estimated effort:** 15 min

### 1.4 Sync CSS token values with MUI theme
- **Files:** `src/styles/globals.css`, `src/theme/vedaTheme.ts`
- **Bug:** `globals.css` saffron = `#C75B12`, but `ThemeProvider.tsx` primary.main = `#F0A060`. Mismatch causes icon color inconsistency.
- **Fix:** Align both to the same saffron value (confirm with brand guide — likely `#C75B12` for light, `#FFB380` for dark as per WCAG fix in `PRODUCTION_READINESS.md`).
- **Estimated effort:** 15 min

---

## Phase 2 — Remaining Hardcoded Colors (Medium priority)

### 2.1 Fix `BottomNav.tsx` inactive icon color
- **File:** `src/components/BottomNav.tsx`
- **Bug:** `#9CA3AF` hardcoded for inactive icons — wrong in some themes.
- **Fix:** Replace with `theme.palette.text.secondary`.

### 2.2 Fix `EkadashiDetailCard.tsx` hardcoded colors
- **File:** `src/components/EkadashiDetailCard.tsx`
- **Fix:** Replace all hardcoded hex with `theme.palette.*` equivalents.

### 2.3 Gradual cleanup of ~200 remaining instances
- **Rule:** Replace on touch — any file opened for another reason should have its hardcoded colors fixed at the same time.
- **Priority files:** `CalendarScreen.tsx` (minor), component files opened for bug fixes.

---

## Phase 3 — PWA Icon & Identity

### 3.1 Generate PNG icons from SVG logo
- **Status:** `public/logo.svg` created this session ✅ (sun-clock with ॐ, saffron palette)
- **Needed:** PNG exports at 144×144, 192×192, 512×512 (regular + maskable variants)
- **Method:** Use the generate-icons script or a browser-based SVG→PNG converter
- **Files to update:** `public/icons/` (currently empty), `public/manifest.webmanifest` (already references correct paths)
- **Note:** Maskable icons need ~20% safe-zone padding around the logo

### 3.2 Update index.html favicon
- **File:** `index.html`
- **Current:** 🙏 emoji favicon
- **Fix:** Link to `/icons/icon-192x192.png` and add apple-touch-icon link

---

## Phase 4 — Deploy Blockers (Must resolve before first user)

### 4.1 AdSense publisher ID
- **File:** `src/components/GoogleAdSlot.tsx`
- **Current:** `ca-pub-PLACEHOLDER`
- **Action:** Replace with real publisher ID when available. Until then, ads are silently hidden (safe).
- **Status:** Waiting on user to obtain publisher ID from Google AdSense.

### 4.2 Verify PWA service worker precache list
- **File:** `vite.config.ts` / workbox config
- **Action:** Confirm all 33 precached entries are still valid after any build changes. (Verified 2026-09-15: `dist/sw.js` precache manifest = 33 entries.)

### 4.3 Configure deployment target
- **Options:** Vercel (zero-config for Vite), Netlify, or GitHub Pages (static)
- **Required:** Set `VITE_APP_URL` or any env vars if referenced
- **PWA note:** Service worker requires HTTPS — Vercel/Netlify provide this automatically.

---

## Phase 5 — Content & Localization

### 5.1 Sanskrit translations (`sa.json`)
- **File:** `src/i18n/sa.json`
- **Current:** Uses Hindi as fallback — not proper Sanskrit
- **Action:** Write proper Sanskrit for all keys (requires domain knowledge)

### 5.2 Review FastsScreen and OnboardingScreen on mobile
- **Status:** Not fully reviewed for mobile edge cases per memory note
- **Action:** Manual QA pass on small screen (375px) for both screens

---

## Phase 6 — Post-Launch: Engine Accuracy (v4.0.0)

### 6.1 `@bidyashish/panchang` integration (Swiss Ephemeris)
- **Current accuracy:** ±2 min sunrise, ~70% tithi exact (30% ±1 day)
- **Proposed:** `@bidyashish/panchang` — Swiss Ephemeris, ±1 min, 80% verified vs Drik Panchang
- **Trade-off:** ~50–100MB ephemeris data downloaded on first use
- **Full plan:** `BIDYASHISH_INTEGRATION_PLAN.md`
- **Target version:** v4.0.0

### 6.2 Planetary positions screen
- **Prerequisite:** Phase 6.1 (Swiss Ephemeris provides this)
- **Scope:** Display positions of Sun, Moon, all 9 Grahas with degrees

---

## Phase 7 — Post-Launch: Features

### 7.1 Premium payment integration
- **Status:** Paywall UI exists; no backend. Deliberately paused.
- **Options:** Razorpay (India-first), Stripe (global)
- **Re-enable when:** Full functional parity achieved and user confirms.

### 7.2 Additional languages
- Bengali, Marathi, Gujarati — high-reach Indian languages

### 7.3 Push notifications backend
- **Current:** Browser-only notification scheduler (no server-sent push)
- **Needed:** Backend for reliable 30-day-advance festival reminders

### 7.4 Family sharing / multi-profile

### 7.5 Widget support (iOS/Android home screen)

---

## Quick Reference: File → Fix Mapping

| File | Issue | Phase |
|---|---|---|
| `TodayScreen.css` | No `:root.dark {}` — blinding white in dark mode | 1.1 |
| `AyurvedicClock.tsx` | DOSHA_CONFIG hardcoded hex | 1.2 |
| `TodayGuidanceCard.tsx` | 8 hardcoded colors in JSX | 1.3 |
| `globals.css` + `vedaTheme.ts` | Saffron token mismatch | 1.4 |
| `BottomNav.tsx` | `#9CA3AF` inactive color | 2.1 |
| `EkadashiDetailCard.tsx` | Hardcoded colors | 2.2 |
| `public/icons/` | Empty — PNG icons needed | 3.1 |
| `index.html` | 🙏 emoji favicon | 3.2 |
| `GoogleAdSlot.tsx` | `ca-pub-PLACEHOLDER` | 4.1 |
| `sa.json` | Hindi fallback, not Sanskrit | 5.1 |
