/**
 * Vrat observances — tithi-rule entries for recurring fasts.
 *
 * HOW TO APPEND (copy-paste pattern): add one object to VRAT_OBSERVANCES.
 * Month/paksha/tithiNumber follow the festivals.ts convention
 * (month 1=Chaitra … 12=Phalguna; omit month or use 0 for every month;
 * paksha 'both'/omitted for twice-a-month; tithiNumber 1-15 where 15 is
 * Purnima in Shukla and Amavasya in Krishna). Add `weekday` (0=Sun…6=Sat)
 * only for weekday subtypes. Example — Hartalika Teej:
 *
 *      {
 *        id: 'hartalika-teej',
 *        name: 'Hartalika Teej',
 *        nameHindi: 'हरतालिका तीज',
 *        meaning: 'Bhadrapada Shukla Tritiya fast for marital bliss.',
 *        meaningHindi: 'अखंड सौभाग्य हेतु भाद्रपद शुक्ल तृतीया व्रत।',
 *        rule: { kind: 'tithi', month: 6, paksha: 'Shukla', tithiNumber: 3 },
 *      },
 *
 * NOTE — Adhik Maas: the engine has no leap-month concept, so in Adhik years
 * a month-bound rule can also match the Adhik month. Skipped deliberately;
 * fixing it requires engine work + Drik re-verification (see types.ts).
 */

import { ObservanceEntry } from './types';

export const VRAT_OBSERVANCES: ObservanceEntry[] = [
  {
    id: 'soma-pradosh',
    name: 'Soma Pradosh Vrat',
    nameHindi: 'सोम प्रदोष व्रत',
    meaning: 'Trayodashi falling on Monday — Shiva twilight fast, most auspicious Pradosh.',
    meaningHindi: 'सोमवार की त्रयोदशी — शिव संध्या व्रत, सर्वाधिक शुभ प्रदोष।',
    rule: { kind: 'tithi', paksha: 'both', tithiNumber: 13, weekday: 1 },
  },
  {
    id: 'bhauma-pradosh',
    name: 'Bhauma Pradosh Vrat',
    nameHindi: 'भौम प्रदोष व्रत',
    meaning: 'Trayodashi falling on Tuesday — Pradosh for health and Mars afflictions.',
    meaningHindi: 'मंगलवार की त्रयोदशी — स्वास्थ्य हेतु प्रदोष।',
    rule: { kind: 'tithi', paksha: 'both', tithiNumber: 13, weekday: 2 },
  },
  {
    id: 'shani-pradosh',
    name: 'Shani Pradosh Vrat',
    nameHindi: 'शनि प्रदोष व्रत',
    meaning: 'Trayodashi falling on Saturday — Pradosh for Saturn afflictions and progeny.',
    meaningHindi: 'शनिवार की त्रयोदशी — शनि दोष और संतान हेतु प्रदोष।',
    rule: { kind: 'tithi', paksha: 'both', tithiNumber: 13, weekday: 6 },
  },
  {
    id: 'sankashti-chaturthi',
    name: 'Sankashti Chaturthi',
    nameHindi: 'संकष्टी चतुर्थी',
    meaning: 'Monthly Krishna Chaturthi fast for Lord Ganesha, broken after moonrise.',
    meaningHindi: 'भगवान गणेश हेतु मासिक कृष्ण चतुर्थी व्रत, चंद्रोदय के बाद पारण।',
    rule: { kind: 'tithi', paksha: 'Krishna', tithiNumber: 4 },
  },
  {
    id: 'angarki-sankashti',
    name: 'Angarki Sankashti Chaturthi',
    nameHindi: 'अंगारकी संकष्टी चतुर्थी',
    meaning: 'Sankashti falling on Tuesday — the most powerful Ganesha fast.',
    meaningHindi: 'मंगलवार की संकष्टी — सर्वाधिक शक्तिशाली गणेश व्रत।',
    rule: { kind: 'tithi', paksha: 'Krishna', tithiNumber: 4, weekday: 2 },
  },
  {
    id: 'somvati-amavasya',
    name: 'Somvati Amavasya',
    nameHindi: 'सोमवती अमावस्या',
    meaning: 'Amavasya falling on Monday — ancestor rites and Shiva worship.',
    meaningHindi: 'सोमवार की अमावस्या — पितृ तर्पण और शिव पूजा।',
    rule: { kind: 'tithi', paksha: 'Krishna', tithiNumber: 15, weekday: 1 },
  },
  {
    id: 'shani-amavasya',
    name: 'Shani Amavasya',
    nameHindi: 'शनि अमावस्या',
    meaning: 'Amavasya falling on Saturday — Saturn remedies and ancestor rites.',
    meaningHindi: 'शनिवार की अमावस्या — शनि उपाय और पितृ अनुष्ठान।',
    rule: { kind: 'tithi', paksha: 'Krishna', tithiNumber: 15, weekday: 6 },
  },
  {
    id: 'ahoi-ashtami',
    name: 'Ahoi Ashtami',
    nameHindi: 'अहोई अष्टमी',
    meaning: 'Kartika Krishna Ashtami fast by mothers for children’s welfare. Observed when Ashtami holds the evening; the fast ends at star-sighting (tara darshan), not moonrise — the moon rises near midnight.',
    meaningHindi: 'संतान के कल्याण हेतु कार्तिक कृष्ण अष्टमी व्रत। संध्या समय अष्टमी होने पर व्रत; तारा दर्शन के बाद पारण, चंद्रोदय पर नहीं — चंद्रमा आधी रात के आसपास उदय होता है।',
    rule: { kind: 'tithi', month: 8, paksha: 'Krishna', tithiNumber: 8 },
  },
  {
    id: 'dhanteras',
    name: 'Dhanteras',
    nameHindi: 'धनतेरस',
    meaning: 'Kartika Krishna Trayodashi — Dhanvantari worship, Diwali’s first day.',
    meaningHindi: 'कार्तिक कृष्ण त्रयोदशी — धन्वंतरि पूजा, दीपावली का प्रथम दिन।',
    rule: { kind: 'tithi', month: 8, paksha: 'Krishna', tithiNumber: 13 },
  },
  {
    id: 'bhai-dooj',
    name: 'Bhai Dooj',
    nameHindi: 'भाई दूज',
    meaning: 'Kartika Shukla Dwitiya — sisters bless brothers in the afternoon (Aparahna: sunrise + 0.7 × daylength), closing Diwali.',
    meaningHindi: 'कार्तिक शुक्ल द्वितीया — अपराह्न काल में बहनें भाइयों को आशीर्वाद देती हैं, दीपावली समापन।',
    rule: { kind: 'tithi', month: 8, paksha: 'Shukla', tithiNumber: 2 },
  },
];
