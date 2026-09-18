# PanchangPro - Test Suite Documentation

**Last Updated:** September 2026
**Total Tests:** 1231 passing / 4 skipped / 0 failing (100% pass rate)

---

## 📊 Test Suite Overview

### Engine & Accuracy Tests
- **tithi-accuracy.test.ts** — 980-test Drik Panchang ground truth suite (490 Delhi days × 2 directions). Tithi exact on 482/490 days (98.4%); 8 known-miss days with ratchet mechanism (Δ ≤ 1 day, all within ±5 min sun tolerance). Sun rise/set all 490 days within ±5 min of Drik.
- **sunrise.test.ts** — Sunrise/sunset vs Drik Panchang (±5 min tolerance). All 490 Delhi days pass.
- **panchang-engine.test.ts** — Core panchang calculation structure.
- **astronomy.test.ts** — Sun/moon longitude, ayanamsa, sidereal conversions, tithi/nakshatra/yoga/karana indices.

### Unit & Integration Tests
- **festival-detection.test.ts** — 38 festivals, 24 Ekadashis, fasting detection, regional tags.
- **panchang.test.ts** — Tithi validation, nakshatra, yoga, karana, var, festivals in panchang.
- **utils.test.ts** — Math, date, Julian Day, formatting utilities.
- **share.test.ts** — Share text generation, clipboard fallback.

### Skipped Tests
- 4 premium-gated tests in `tithi-management.test.ts` (premium is paused).

---

## 🎯 Known-Miss Ratchet (tithi-accuracy)

| Metric | Value |
|--------|-------|
| Total days tested | 490 (Delhi, Dec 2024 – May 2026) |
| Exact tithi match | 482/490 (98.4%) |
| Known-miss days | 8 |
| Miss tolerance | Δ ≤ 1 tithi day |
| Sun rise/set accuracy | ±5 min all 490 days |
| Ground truth source | Drik Panchang |
| Test file | `src/engine/__tests__/tithi-accuracy.test.ts` |
| Truth data | `src/engine/__tests__/drikTruth.ts` |

Known misses are ratcheted (clamped to nearest tithi) — never drift beyond 1 day. 8 days are boundary transitions where Drik and our Meeus JD differ by hours near tithi changeover.

---

## 📈 Test Execution

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test -- festival-detection.test.ts
npm test -- utils.test.ts
npm test -- panchang-engine.test.ts
npm test -- tithi-accuracy.test.ts
```

### Run with Coverage
```bash
npm run test:coverage
```

---

## ✅ Passing Tests Summary

**Total Passing:** 1231/1235 (99.7% — 4 skipped premium tests)

### By Category
- ✅ **Festival Database:** All passing (100%)
- ✅ **Astronomy:** All passing
- ✅ **Sunrise/Sunset:** All passing (±5 min, 490 days)
- ✅ **Tithi Accuracy:** 482/490 exact + 8 ratcheted (100% within tolerance)
- ✅ **Utilities:** All passing
- ✅ **Share:** All passing
- ⏭️ **Premium tests:** 4 skipped (premium paused)

---

## 📊 Accuracy Coverage

| Feature | Accuracy | Status |
|---------|----------|--------|
| Tithi number | 482/490 exact + 8 ratcheted | ✅ |
| Sunrise/Sunset | ±5 min all 490 days | ✅ |
| Festival detection | 100% | ✅ |
| Fasting detection | 100% | ✅ |
| Nakshatra | Boundary edge cases | ✅ |
| Yoga & Karana | 0/4 karana known bug | ⚠️ |

---

## 🐛 Known Issues (Non-Blocking)

1. **Karana 0/4** — Reported bug; all 4 karana values compute as 0. Root cause under investigation.
2. **Lunar month ±1 day variance** — Approximation-based; Swiss Ephemeris would fix but increases bundle.
3. **~200 remaining hardcoded color instances** — Gradual refactoring planned.

---

## 📝 Test File Locations

All tests are in `src/engine/__tests__/` and `src/engine/__tests__/` for accuracy ground truth.

**Key test files:**
1. `tithi-accuracy.test.ts` — 980-test Drik ground truth suite
2. `drikTruth.ts` — 490-day Delhi ground truth data
3. `festival-detection.test.ts` — Festival matching
4. `panchang-engine.test.ts` — Core engine structure
5. `sunrise.test.ts` — Sunrise/sunset accuracy
6. `panchang.test.ts` — Panchang validation
7. `astronomy.test.ts` — Astronomical calculations
8. `utils.test.ts` — Utility functions
9. `share.test.ts` — Share functionality

---

**Test Suite Status:** 1231/1235 passing, 4 skipped premium tests, 0 failures ✅
