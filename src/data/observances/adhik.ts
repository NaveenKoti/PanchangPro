/**
 * Adhik Maas (Purushottam Maas) — the leap month.
 *
 * HOW TO APPEND: Adhik needs no per-month entries — the single rule below
 * matches ANY Adhik span via the engine (getAdhikMaasInfo). Only add entries
 * here for Adhik-specific observances (e.g. a named vrat kept in Adhik
 * Shravana), using kind 'tithi' with a comment citing the span.
 */

import { ObservanceEntry } from './types';

export const ADHIK_OBSERVANCES: ObservanceEntry[] = [
  {
    id: 'adhik-maas',
    name: 'Adhik Maas',
    nameHindi: 'अधिक मास',
    meaning:
      'Leap month (Purushottam Maas) — a lunar month with no solar ingress, occurring about every 32 months. Sacred for devotion, not for new beginnings.',
    meaningHindi:
      'अधिक मास (पुरुषोत्तम मास) — बिना संक्रांति वाला चांद्र मास, लगभग हर 32 महीने में। भक्ति के लिए पवित्र, नई शुरुआत के लिए नहीं।',
    rule: { kind: 'adhik' },
  },
];
