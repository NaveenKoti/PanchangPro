# PanchangPro — Test Suite

**Updated:** Sep 19, 2026 · **Total:** 1464 passed / 3 skipped / 0 failing (24 files) · Run: `npm test` (TZ=Asia/Kolkata pinned — UTC environments shift Udaya-tithi by a day; see CI fix Sep 19)

## Ground truth (Drik Panchang, Delhi)
- `tithi-accuracy.test.ts` — 980 tests: tithi **490/490 exact**, sunrise/sunset 490/490 within ±5min. `KNOWN_TITHI_MISS` empty.
- `graha-accuracy.test.ts` — nakshatra 105/105, yoga/karana 6/6.
- Ratchets use `it.fails` only; never edit sunrise signs, JD, or ayanamsa without re-running this file.

## Feature suites (selected)
- `vyapti.test.ts` (8) — Ganesh 2026 Sep 14∉15, 2025 Aug 27; Shivratri 2026 Feb 15∉16; Pradosh sunset rule Jan 11/Feb 25/Mar 11/Jun 8/Jun 23 2025. Each cites its published source.
- `adhik-maas.test.ts` (8) — anchors 2023 Shravana, 2020 Ashwin, 2026 Jyeshtha; 2024/25 clean; span sanity.
- `observances.test.ts` (23) — 12 ingresses monotonic, Somvati/Shani, Sankashti/Angarki, Soma Pradosh, Navratri/Pitru/Bhai Dooj starts, dedupe guards.
- `missed-tithi-catchup.test.ts` (9) — digest window edges, dedupe ids, 7-day cap.
- `tithi-management.test.ts` — no-cap behavior (cap removed 2026-09); 1 skip left: `Update Tithi (jsdom limitation)`.
- `festival-detection.test.ts`, `panchang.test.ts` (incl. corrected Mauni Amavasya 2025-01-29 reference), E2E `critical-flows` + `offline-smoke`.

## Skips (3, all intentional)
- `Update Tithi` suite — jsdom limitation (documented in-test).
- 2 legacy skips carried from tithi-management (non-behavioral).

## Deleted (Sep 19 cleanup)
- `drik-panchang-comparison.test.ts.obsolete`, dead `vedic/festivalData.ts` + `vedic/fastingData.ts` (zero importers), skipped premium-downgrade test (feature deleted).
