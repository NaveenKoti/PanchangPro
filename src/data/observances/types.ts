/**
 * Observance rule types — the schema every observance in this directory follows.
 *
 * HOW TO APPEND A NEW OBSERVANCE (copy-paste pattern):
 *   1. Pick the rule kind that fits (tithi | solar-ingress | weekday-in-month |
 *      date-range | static) and add an entry to the right file
 *      (vrats.ts, sankranti.ts, or ranges.ts):
 *
 *      // Vrats (tithi-based, e.g. Hartalika Teej — Bhadrapada Shukla Tritiya):
 *      {
 *        id: 'hartalika-teej',
 *        name: 'Hartalika Teej',
 *        nameHindi: 'हरतालिका तीज',
 *        meaning: 'One-line meaning in English.',
 *        meaningHindi: 'हिंदी में एक पंक्ति का अर्थ।',
 *        rule: { kind: 'tithi', month: 6, paksha: 'Shukla', tithiNumber: 3 },
 *      },
 *
 *      // Sankranti (solar ingress, rashiIndex 0=Mesha … 9=Makara … 11=Meena):
 *      {
 *        id: 'sankranti-mesha',
 *        name: 'Mesha Sankranti',
 *        nameHindi: 'मेष संक्रांति',
 *        meaning: 'Solar new year — Sun enters Mesha.',
 *        meaningHindi: 'सौर नववर्ष — सूर्य मेष में प्रवेश।',
 *        rule: { kind: 'solar-ingress', rashiIndex: 0 },
 *      },
 *
 *   2. No registration call needed — index.ts aggregates the *-list exports.
 *   3. Rules here must be computable by the engine. Do NOT seed static dates
 *      you invented; the `static` kind exists only for hand-verified manual
 *      entries (e.g. a government-declared holiday) added with a source note.
 *
 * KNOWN LIMITATION — Adhik Maas: the engine (getHinduLunarMonth) has no
 * leap-month concept, so tithi-in-month rules may match the Adhik month as
 * well as the Nija month in Adhik years. Do not attempt Adhik handling here;
 * it belongs in the engine with Drik re-verification (see panchang.ts).
 */

export interface TithiObservanceRule {
  kind: 'tithi';
  /**
   * Hindu lunar month 1-12 (1=Chaitra … 12=Phalguna), following the
   * festivals.ts convention. Omit or pass 0 for "every lunar month"
   * (e.g. Sankashti, Pradosh).
   */
  month?: number;
  /**
   * Lunar fortnight. Omit or pass 'both' for twice-a-month observances
   * (e.g. Pradosh on both Trayodashis).
   */
  paksha?: 'Shukla' | 'Krishna' | 'both';
  /** Tithi number 1-15 (15 = Purnima in Shukla, Amavasya in Krishna). */
  tithiNumber: number;
  /**
   * Optional civil-weekday filter 0=Sun … 6=Sat for weekday subtypes
   * (Soma/Bhauma/Shani Pradosh, Somvati/Shani Amavasya, Angarki Sankashti).
   */
  weekday?: number;
}

export interface SolarIngressRule {
  kind: 'solar-ingress';
  /** Entered sidereal sign 0=Mesha … 9=Makara, 10=Kumbha, 11=Meena. */
  rashiIndex: number;
}

export interface WeekdayInMonthRule {
  kind: 'weekday-in-month';
  /** Hindu lunar month 1-12 (e.g. 5=Shravana for Sawan Somvar). */
  lunarMonth: number;
  /** Civil weekday 0=Sun … 6=Sat (e.g. 1=Monday). */
  weekday: number;
}

export interface DateRangeRule {
  kind: 'date-range';
  /** Tithi rule marking Day 1 of the span (e.g. Ashwin Shukla Pratipada). */
  startRule: TithiObservanceRule;
  /** Tithi rule marking the closing day (e.g. Ashwin Shukla Navami). */
  endRule: TithiObservanceRule;
  /** Max span length in days (search bound). Defaults to 20. */
  maxSpanDays?: number;
}

export interface StaticDateRule {
  kind: 'static';
  /**
   * Hand-verified ISO dates (yyyy-mm-dd). MANUAL ENTRIES ONLY — never seed
   * computed dates here; every entry needs a source note in a comment.
   */
  dates: string[];
}

export type ObservanceRule =
  | TithiObservanceRule
  | SolarIngressRule
  | WeekdayInMonthRule
  | DateRangeRule
  | StaticDateRule;

export interface ObservanceEntry {
  id: string;
  name: string;
  nameHindi: string;
  meaning: string;
  meaningHindi: string;
  rule: ObservanceRule;
}
