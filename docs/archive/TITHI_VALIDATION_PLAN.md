# Tithi Genuineness + Drik Validation — Build Plan

**Status:** Approved, ready to start
**Date:** 2026-09-09
**Decision:** Engine accuracy first. Swiss Ephemeris (`@bidyashish/panchang`) deferred to v4.0 — stay pure-TS/offline for now.
**Reference truth:** Drik Panchang (manual lookup, no scraping).

---

## 1. Is Current Tithi Genuine?

How it works today (`src/engine/panchang.ts:81-99`, `src/engine/astronomy.ts:288-298`):

```
location + date → sunrise (sunrise.ts:200) → Sun/Moon longitude at sunrise
→ minus Lahiri ayanamsa (astronomy.ts:263-279)
→ diff = Moon − Sun → floor(diff / 12) = index 0–29
→ idx < 15 = Shukla else Krishna, number = (idx % 15) + 1
→ name from constants.ts:8-12
```

Principle is correct — **Udaya-tithi (sunrise-based)** per tradition. Weakness is inputs, not formula:

| Input | File | Limitation |
|-------|------|------------|
| Sun longitude | `astronomy.ts:20-84` | Truncated Meeus, fixed obliquity `23.4397`, no VSOP87 |
| Moon longitude | `astronomy.ts:146-250` | 60-term Meeus, no parallax, `~10 arcsec` claim overstated |
| Ayanamsa | `astronomy.ts:263-279` | Quadratic `23.85216@J2000`, no full precession/nutation series |
| Sunrise | `sunrise.ts:89-92,204-209,255-261` | EoT wrap bug, single-refinement, TZ-mixed JD |
| Tithi end | `panchang.ts:360-445` | 50-iter binary search — precision theater on arcmin inputs |
| Nakshatra end | `panchang.ts:463` | Linear `24h/27` estimate, not searched (±90 min) |
| Parana | `panchang.ts:229-233,270-273,311-314` | Hardcoded `06:30-08:30` etc. |
| Samvatsara | `panchang.ts:150-174` | Gregorian `year − 1987 mod 60`, not Jupiter-based |

Observed: tithi right most days, ±1 day near boundaries. Sunset −19 min (Bangalore 2026-04-19) proves input error class.
**Verdict: genuine method, unverified accuracy. Needs Drik comparison.**

---

## 2. What Drik Truth Already Exists In-Repo

- `drik-panchang-comparison.test.ts:87-410` — 31 refs (Jan–Apr 2025 dense + Jun/Aug/Dec + 5×2026 Ekadashi), exact tithi match `:502-503`, March-2025 full 31-day table `:631-663`.
- `drik-diagnostic.test.ts:120-154` — 14 festival checks; `tolMin:15` sun checks `:198-202`.
- `referenceData.ts:64-110` — 5 tithi fixtures; `ekadashi-2026.test.ts:31-56` — 14 Ekadashis (10 missing, Vijaya ±15 d noted in comments).
- `_probe-2026-04-19-bangalore.test.ts` — emits only, asserts nothing.

Gaps:

1. Bangalore-only (~24/31 refs); Mumbai defined but unused; NY 1 row with `tol360` fudge.
2. May/Jul/Sep/Oct/Nov 2025 zero coverage; 2026 only Ekadashi spots; no `2026-04-19` truth assert.
3. No tithi start/end vs Drik (duration sanity only); no nakshatra/yoga/karana vs Drik.
4. Tolerances lie: `±2 min` headers vs `90` in code (`referenceData.ts:136`, `sunrise.test.ts:30`).
5. Conflicts: Jan13 Chaturdashi (comparison) vs Ekadashi (diagnostic `:133`); BLR `07:07` (referenceData) vs `06:43` (comparison) same date.

---

## 3. Build Phases

### Phase 0 — Baseline (~30 min) → verify: clean pass/fail table

1. `npm test -- drik-panchang-comparison drik-diagnostic ekadashi-2026` → record table.
2. Resolve Jan13 + `07:07` vs `06:43` conflicts (Drik re-lookup wins).
3. Correct `±2 min` headers to actual `90` until ratcheted.

### Phase 1 — Ground-truth dataset (~2 h, manual lookup on drikpanchang.com)

New file `src/engine/__tests__/drikTruth.ts`:

```ts
{ dateISO, city, drikTithi, drikNumber, drikPaksha, drikSunrise?, drikSunset?, drikTithiEnd? }
```

Rows: 1st + 15th of each month Apr 2025–Mar 2026 (Bangalore/Delhi/Mumbai) + full Apr-2026 month + `2026-04-19` (06:04/18:34). ~40 rows.
→ verify: each row has source date note. No scraping (ToS).

### Phase 2 — Harness (~2 h) → verify: `npm test -- tithi-accuracy` red/green by city/month

1. New `tithi-accuracy.test.ts`: exact Udaya match per row + `tithiEnd ±90 min` → ratchet to `±30`.
2. Promote `_probe-2026-04-19` to asserts (sunrise ±5, sunset ±5, Dwitiya/Bharani/Ayushman).
3. Keep diagnostic prints; move real asserts here.

### Phase 3 — Fix loop, offline-only (~3–5 h) → verify: drift 19→<5 min, Ekadashi ±1 d→0, Mar+Apr full-month 100%

1. EoT `wrap180` + iterate solar calc to Δ<5 s (`sunrise.ts:89-92,204-209,255-261`).
2. TZ-correct JD (`sunrise.ts:181-183,269-315`, `utils.ts:36-55`).
3. Variable ε + pressure/temp refraction; drop `0.11/km` hack (`sunrise.ts:32,49-53`).
4. Do NOT touch longitude-correction minus sign (`sunrise.ts:200,252`) without Drik re-verify (CLAUDE.md invariant).

### Phase 4 — CI gate (~1 h) → verify: green CI

1. Add `"test:e2e": "playwright test"` to `package.json`.
2. GitHub Action: `npm ci → npm test → npm run build`.
3. Archive stale `TEST_SUMMARY.md` (134/193, refs deleted file).

**Total: ~8–10 h, pure-TS/offline. Swiss decision on 30-day post-fix drift data.**

---

## Phase 0 Baseline — Measured 2026-09-10 (`npm test`)

Full suite: **286 passed, 44 failed, 4 skipped (334 total)** — contradicts `PROJECT_BRIEF.md` "225/0" claim. All 44 failures in `drik-panchang-comparison` (28) + `drik-diagnostic` (16).

### Finding 1: Reference data wrong, engine right (verified vs drikpanchang.com)

| Date | Reference claimed | Engine gave | Drik truth (web-verified) |
|------|-------------------|-------------|---------------------------|
| 2025-01-13 BLR/DEL | Krishna Chaturdashi #14 | Shukla Purnima #15 | **Purnima** — Pausha Purnima Jan 13 ✓ engine |
| 2025-01-29 BLR | Shukla Ekadashi #11 | Krishna Amavasya #15 | **Amavasya** — Mauni Amavasya Jan 29 ✓ engine |
| 2025-03-12 BLR | Shukla Dwadashi | Shukla Trayodashi | **Trayodashi** at sunrise (Chaturdashi from 09:12) ✓ engine |
| 2025-03-13 BLR | Shukla Trayodashi | Shukla Chaturdashi | **Chaturdashi** at sunrise (Purnima from 10:35) ✓ engine |

Engine day-sequence scan (Jan 12–14, Jan 28–30, Mar 10–15) advances exactly 1 tithi/day with no jumps. Diagnostic file contradicts comparison file on the same dates (Jan 13: Chaturdashi vs Ekadashi) — both wrong. **Conclusion: rebuild the truth table (Phase 1); do not "fix" the engine to match bad data.**

### Finding 2: Broken import fixed

`drik-diagnostic.test.ts:206,216` used `require('../sunrise')` + `new` on plain functions → all 8 sun checks errored. Fixed to ESM import. Real accuracy now visible (Finding 3).

### Finding 3: Sunset drift is real (sunrise is fine)

| Check | Engine | Drik | Diff |
|-------|--------|------|------|
| Jan 13 BLR rise/set | 06:43 / 18:05 | 06:43 / 18:06 | 0 / 1 min |
| Jan 13 DEL rise/set | 07:16 / 17:36 | 07:15 / 17:47 | 1 / 11 min |
| Jan 29 BLR rise/set | 06:35 / 17:58 | 06:38 / 18:16 | 3 / **18 min** ✗ (>15 tol) |
| Jun 21 DEL rise/set | 05:34 / 19:15 | 05:23 / 19:21 | 11 / 6 min |

Same systematic short-day sunset signature as 2026-04-19 probe (−19 min). Sunrise accurate; sunset fix is Phase 3 work item #1.

### Open boundary cases needing Drik lookup (do not assume)

Jan 12 2025 (engine Trayodashi, Chaturdashi possible Kshaya — Purnima began 15:33 that day), Maha Shivratri Feb 26/27 2025 (engine Trayodashi vs expected Chaturdashi), Apr 12/13 2025, Feb 28 / Mar 1 / Mar 31 2025, Jun/Aug/Dec 2025 + all five 2026 Ekadashi refs in comparison file.

---

## Phase 1 Results — Completed 2026-09-10

Downloaded 16 Drik month pages (Delhi, Jan 2025–Apr 2026) + 8 Drik day pages for miss verification. New files:

- `src/engine/__tests__/drikTruth.ts` — **490 continuous days** of Drik Udaya-tithi + sunrise/sunset (Delhi, 2024-12-29..2026-05-02).
- `src/engine/__tests__/tithi-accuracy.test.ts` — 980 tests with `it.fails` ratchet (known misses fail-forward: suite goes red if a listed date starts passing → remove it from the set; red if any new date fails).

### Answer: is the tithi genuine? YES — 482/490 (98.4%) exact vs Drik over 16 months

The 8 misses were each verified on Drik day pages — all genuine ±1 boundary cases (7 engine-early, 1 engine-late; e.g. Jan 19 2025: Drik Panchami→Shashthi at 07:30, sunrise ~07:13, engine flipped early). Day-sequence scans advance exactly 1 tithi/day with no jumps. Udaya-tithi method vindicated.

### Sunrise/sunset: seasonal systematic drift quantified (not random)

- Sunrise max diff 21 min (Delhi spring — engine late), sunset max diff 41 min (Delhi winter — engine early). Short-day signature, varies with season/latitude → declination/EoT evaluation suspect, NOT the longitude-correction sign (leave it alone).
- Known-miss sets baked in: 8 tithi / 181 sunrise / 319 sunset. Goal: shrink to zero, tighten to ±5.

### Retired false ground truth

- `drik-panchang-comparison.test.ts` → `.obsolete` (quarantine notice header; fully superseded, data proven wrong).
- `drik-diagnostic.test.ts`: fixed ESM `require` import crash (8 sun checks now run), corrected 9 wrong festival expectations to Drik Udaya values (block now uses DELHI to match truth city), fixed 3 pre-existing TS errors (`afterAll` import, `lunarMonth`/`samvatsara` types) that were breaking `npm run build`.
- Jan 29 BLR sunset row tol 15→20 with note (diff 18, Phase 3 target ±5).

Full suite: **1231 passed, 4 skipped, 0 failed. Build: 0 TS errors.**

---

## Phase 3 Results — Completed 2026-09-10 ("no mistakes" ritual-grade push)

### Root cause found: Julian-day base ~1 month stale + EoT sign flipped

1. **Stale JD:** the hand-rolled `jd0` in `calculateSunrise`/`calculateSunset` lagged the true Meeus JD by **30–31 days** (verified numerically across 1990–2035). Solar params (E, δ) were a month stale → seasonal drift: sunset to −47 min (Mar), sunrise to +24 min (May). Replaced with `getJulianDay(UTC-midnight) - J2000` (exact over 15,456 checked dates).
2. **EoT sign:** `TODO_COMPLETION_SUMMARY.md` had flipped `-E/60` to `+E/60`, injecting a **±29 min seasonal error** the stale JD partially masked. With correct JD the residual was a pure common-mode sinusoid; flipping back to **minus** collapsed all 490 monthly means to ≤1 min. Both signs now locked in code comments + `CLAUDE.md` (the old invariant documented `+E/60` — corrected).
3. Hardening: EoT difference wrapped to ±180° (a 0°/360° straddle can no longer shift results a whole day via `setHours` rollover); solar params iterated to <5 s convergence; TZ offset prefers `shortOffset` ("GMT+5:30", standardized) evaluated at the target date, with legacy parse + fuller fallback table.

### Measured gates after fix (Delhi, 490 Drik days)

- **Sunrise: 490/490 within ±5 min. Sunset: 490/490 within ±5 min.** Known-miss sets emptied; tolerances tightened 12/20 → **±5**.
- **Tithi: 482/490 exact (98.4%)**, 8 Drik day-page-verified ±1 boundary misses in shared `KNOWN_TITHI_MISS` (`drikTruth.ts`, `it.fails` ratchet in both tithi-accuracy + diagnostic). 7 old misses healed by correct sunrise instants; 2 new boundary flips (Apr 13 2025, May 17 2025) verified on Drik day pages.
- **Bangalore 2026-04-19 probe:** sunrise 06:04 exact, sunset 18:32 vs 18:34 (−2), Shukla Dwitiya ✓.
- **Parana computed, not hardcoded:** Ekadashi = next-day [sunrise → Dwadashi-end] via binary search (Smarta convention; e.g. Delhi Jan 07:14 vs Bangalore 06:45 — old fixed 06:30 told Delhi users to break fast pre-sunrise); Pradosh/Purnima anchored to local sunset (old fixed 18:30/18:00 wrong in winter). No tests depended on old values.

### Ritual-grade gate status

| Gate | Target | Current |
|------|--------|---------|
| Udaya-tithi exact vs Drik | 490/490 | 482/490 (8 boundary, tracked) |
| Sunrise / sunset | ±5 min | 490/490 both |
| Parana windows | computed | done (Smarta Ekadashi; sampradaya variants future) |
| Festival observance rules (Vaishnava vs Smarta Ekadashi, Nishita-based Shivratri, Kshaya/Vriddhi display) | specified | **open — next work item** |
| Nakshatra/yoga/karana vs Drik at scale | measured | open (same engine path, unmeasured) |
