/**
 * i18n key parity: every key in en.json must exist in hi/sa/kn/te/ta.
 * Guards the "onboarding in Kannada, screens in English" class of bug —
 * screens must use t() keys (which exist in all locales), never
 * isHindi-only ternaries with hardcoded English fallbacks.
 */
import { describe, it, expect } from 'vitest';
import en from '../../i18n/en.json';
import hi from '../../i18n/hi.json';
import sa from '../../i18n/sa.json';
import kn from '../../i18n/kn.json';
import te from '../../i18n/te.json';
import ta from '../../i18n/ta.json';

function keys(o: unknown, prefix = ''): string[] {
  if (typeof o !== 'object' || o === null) return [prefix];
  return Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    keys(v, prefix ? `${prefix}.${k}` : k)
  );
}

const LOCALES = { hi, sa, kn, te, ta } as const;

describe('i18n key parity', () => {
  const enKeys = new Set(keys(en));

  for (const [name, bundle] of Object.entries(LOCALES)) {
    it(`${name} covers every en key`, () => {
      const missing = keys(bundle).length === 0 ? [...enKeys] : [...enKeys].filter((k) => {
        let node: unknown = bundle;
        for (const part of k.split('.')) {
          if (typeof node !== 'object' || node === null || !(part in node)) return true;
          node = (node as Record<string, unknown>)[part];
        }
        return false;
      });
      expect(missing).toEqual([]);
    });
  }

  it('no locale has keys missing from en (no orphans)', () => {
    for (const [name, bundle] of Object.entries(LOCALES)) {
      const orphans = keys(bundle).filter((k) => !enKeys.has(k));
      expect(orphans, `${name} orphans`).toEqual([]);
    }
  });
});
