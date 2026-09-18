/**
 * Sankranti observances — the 12 solar ingresses.
 *
 * HOW TO APPEND (copy-paste pattern): entries are data-only; the engine
 * (PanchangEngine.findSolarIngress + `sankranti` on the Panchang output)
 * already computes all 12 ingresses, so no new rule kind is ever needed here.
 * To add a Sankranti-adjacent observance (e.g. Pongal on Makara day), append:
 *
 *      {
 *        id: 'pongal-day',
 *        name: 'Pongal (Makara day)',
 *        nameHindi: 'पोंगल',
 *        meaning: 'Tamil harvest festival on the day Sun enters Makara.',
 *        meaningHindi: 'सूर्य के मकर में प्रवेश के दिन तमिल फसल उत्सव।',
 *        rule: { kind: 'solar-ingress', rashiIndex: 9 },
 *      },
 *
 * rashiIndex follows the engine convention 0=Mesha … 9=Makara, 10=Kumbha,
 * 11=Meena (see SANKRANTI_NAMES in src/engine/panchang.ts — imported below
 * so names cannot drift from the engine).
 */

import { SANKRANTI_NAMES, SANKRANTI_NAMES_HINDI } from '../../engine/panchang';
import { ObservanceEntry } from './types';

const MEANINGS_EN: string[] = [
  'Solar new year — Sun enters Mesha; new Saka-era reckoning begins.',
  'Sun enters Vrishabha; peak summer month begins.',
  'Sun enters Mithuna; monsoon approach in tradition.',
  'Sun enters Karka; Dakshinayana (southward solar journey) begins.',
  'Sun enters Simha; Shravana austerities deepen.',
  'Sun enters Kanya; harvest-season festivals approach.',
  'Sun enters Tula; autumn equinox period, Sharad rites.',
  'Sun enters Vrishchika; Kartika deep-daan season nears.',
  'Sun enters Dhanu; Dhanurmasa austerities begin.',
  'Sun enters Makara; Uttarayana begins — kite-and-til harvest festival.',
  'Sun enters Kumbha; Magha sacred-bath season.',
  'Sun enters Meena; last solar month, Holi season nears.',
];

const MEANINGS_HI: string[] = [
  'सौर नववर्ष — सूर्य मेष में प्रवेश; नई शक-गणना आरंभ।',
  'सूर्य वृषभ में प्रवेश; ग्रीष्म का चरम मास आरंभ।',
  'सूर्य मिथुन में प्रवेश; परंपरा में मानसून का आगमन निकट।',
  'सूर्य कर्क में प्रवेश; दक्षिणायन आरंभ।',
  'सूर्य सिंह में प्रवेश; श्रावण तपस्या गहन।',
  'सूर्य कन्या में प्रवेश; फसल उत्सव निकट।',
  'सूर्य तुला में प्रवेश; शरद ऋतु, शारदीय अनुष्ठान।',
  'सूर्य वृश्चिक में प्रवेश; कार्तिक दीपदान ऋतु निकट।',
  'सूर्य धनु में प्रवेश; धनुर्मास तपस्या आरंभ।',
  'सूर्य मकर में प्रवेश; उत्तरायण आरंभ — तिल-गुड़ फसल उत्सव।',
  'सूर्य कुंभ में प्रवेश; माघ स्नान ऋतु।',
  'सूर्य मीन में प्रवेश; अंतिम सौर मास, होली ऋतु निकट।',
];

const DISPLAY_NAMES: string[] = [
  'Mesha Sankranti',
  'Vrishabha Sankranti',
  'Mithuna Sankranti',
  'Karka Sankranti',
  'Simha Sankranti',
  'Kanya Sankranti',
  'Tula Sankranti',
  'Vrishchika Sankranti',
  'Dhanu Sankranti',
  'Makar Sankranti',
  'Kumbha Sankranti',
  'Meena Sankranti',
];

function sankrantiId(rashiIndex: number): string {
  return `sankranti-${SANKRANTI_NAMES[rashiIndex].toLowerCase()}`;
}

export const SANKRANTI_OBSERVANCES: ObservanceEntry[] = DISPLAY_NAMES.map(
  (name, rashiIndex) => ({
    id: sankrantiId(rashiIndex),
    name,
    nameHindi: `${SANKRANTI_NAMES_HINDI[rashiIndex]} संक्रांति`,
    meaning: MEANINGS_EN[rashiIndex],
    meaningHindi: MEANINGS_HI[rashiIndex],
    rule: { kind: 'solar-ingress', rashiIndex },
  })
);
