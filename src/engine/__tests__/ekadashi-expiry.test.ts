/**
 * ekadashi-expiry — time-bomb guard for the verified Ekadashi table.
 *
 * The verified table (src/data/verifiedEkadashis.ts) currently ends at
 * 2030-12-15. Past that coverage, Ekadashi detection would silently fall
 * back to unverified computation — this test forces a visible failure so
 * the table gets extended and re-verified against Drik in time.
 *
 * Behaviour (pure date math, no engine dependency):
 * - PASSES while the system date is on/before 2030-12-15.
 * - FAILS when the system date is within 180 days AFTER 2030-12-15.
 *
 * To re-arm after extending the table, update VERIFIED_TABLE_END below to
 * the new last verified date.
 */
import { describe, it } from 'vitest';

// Last date covered by src/data/verifiedEkadashis.ts (inclusive).
const VERIFIED_TABLE_END = new Date('2030-12-15T00:00:00Z').getTime();

// Grace window after coverage ends, in days.
const GRACE_DAYS = 180;

describe('verified Ekadashi table expiry', () => {
  it('fails within 180 days after the verified table ends', () => {
    const now = Date.now();
    const graceMs = GRACE_DAYS * 86_400_000;
    const withinGraceAfterExpiry = now > VERIFIED_TABLE_END && now <= VERIFIED_TABLE_END + graceMs;
    if (withinGraceAfterExpiry) {
      throw new Error('extend verifiedEkadashis + re-verify vs Drik');
    }
  });
});
