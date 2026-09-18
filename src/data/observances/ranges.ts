/**
 * Multi-day observances — date-range and weekday-in-month rules.
 *
 * HOW TO APPEND (copy-paste pattern): add one object to RANGE_OBSERVANCES.
 * For a span, give the Day-1 tithi rule and the closing-day tithi rule;
 * the matcher finds the start by forward scan and the end within
 * maxSpanDays after it. For a weekday-of-month (e.g. all Shravana Mondays),
 * use weekday-in-month. Example — Gupt Navratri (Ashadha Shukla 1–9):
 *
 *      {
 *        id: 'gupt-navratri-ashadha',
 *        name: 'Gupt Navratri (Ashadha)',
 *        nameHindi: 'गुप्त नवरात्रि (आषाढ़)',
 *        meaning: 'Nine-day Tantric Devi sadhana from Ashadha Shukla Pratipada.',
 *        meaningHindi: 'आषाढ़ शुक्ल प्रतिपदा से नौ दिवसीय देवी साधना।',
 *        rule: {
 *          kind: 'date-range',
 *          startRule: { kind: 'tithi', month: 4, paksha: 'Shukla', tithiNumber: 1 },
 *          endRule: { kind: 'tithi', month: 4, paksha: 'Shukla', tithiNumber: 9 },
 *        },
 *      },
 *
 * Month numbers follow the festivals.ts convention (1=Chaitra … 12=Phalguna).
 * Pitru Paksha below spans a month boundary (Bhadrapada Purnima → Ashwin
 * Amavasya); the matcher handles cross-month spans by construction.
 */

import { ObservanceEntry } from './types';

export const RANGE_OBSERVANCES: ObservanceEntry[] = [
  {
    id: 'chaitra-navratri',
    name: 'Chaitra Navratri',
    nameHindi: 'चैत्र नवरात्रि',
    meaning: 'Nine-day spring worship of Devi from Chaitra Shukla Pratipada.',
    meaningHindi: 'चैत्र शुक्ल प्रतिपदा से देवी की नौ दिवसीय वासंतिक पूजा।',
    rule: {
      kind: 'date-range',
      startRule: { kind: 'tithi', month: 1, paksha: 'Shukla', tithiNumber: 1 },
      endRule: { kind: 'tithi', month: 1, paksha: 'Shukla', tithiNumber: 9 },
    },
  },
  {
    id: 'sharad-navratri',
    name: 'Sharad Navratri',
    nameHindi: 'शारदीय नवरात्रि',
    meaning: 'Nine-day autumn worship of Durga from Ashwin Shukla Pratipada.',
    meaningHindi: 'आश्विन शुक्ल प्रतिपदा से दुर्गा की नौ दिवसीय शारदीय पूजा।',
    rule: {
      kind: 'date-range',
      startRule: { kind: 'tithi', month: 7, paksha: 'Shukla', tithiNumber: 1 },
      endRule: { kind: 'tithi', month: 7, paksha: 'Shukla', tithiNumber: 9 },
    },
  },
  {
    id: 'pitru-paksha',
    name: 'Pitru Paksha',
    nameHindi: 'पितृ पक्ष',
    meaning: 'Fortnight of ancestor rites from Bhadrapada Purnima to Mahalaya Amavasya.',
    meaningHindi: 'भाद्रपद पूर्णिमा से महालय अमावस्या तक पितृ अनुष्ठान का पक्ष।',
    rule: {
      kind: 'date-range',
      startRule: { kind: 'tithi', month: 6, paksha: 'Shukla', tithiNumber: 15 },
      endRule: { kind: 'tithi', month: 7, paksha: 'Krishna', tithiNumber: 15 },
    },
  },
  {
    id: 'sawan-somvar',
    name: 'Sawan Somvar',
    nameHindi: 'सावन सोमवार',
    meaning: 'Every Monday of Shravana — Shiva fasts through the holy month.',
    meaningHindi: 'श्रावण का प्रत्येक सोमवार — पवित्र मास में शिव व्रत।',
    rule: { kind: 'weekday-in-month', lunarMonth: 5, weekday: 1 },
  },
];
