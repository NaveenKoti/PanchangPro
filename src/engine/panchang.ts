/**
 * Panchang Engine - Main Calculation Engine
 * Why: Central class that orchestrates all panchang calculations
 */

import { 
  GeoLocation, 
  Panchang, 
  Tithi, 
  Nakshatra, 
  Yoga, 
  Karana, 
  Var,
  TimeRange,
  DinacharyaPhase,
  SankrantiInfo,
  AdhikMaasInfo
} from '../types';
import {
  TITHI_NAMES,
  TITHI_NAMES_HINDI,
  NAKSHATRA_NAMES,
  NAKSHATRA_NAMES_HINDI,
  YOGA_NAMES,
  KARANA_NAMES,
  VAR_NAMES,
  VAR_NAMES_HINDI,
  LUNAR_MONTHS,
  LUNAR_MONTHS_HINDI,
  DINACHARYA_PHASES
} from './constants';
import { getFestivalsForDate } from '../data/festivals';
import { OTHER_FASTS } from '../data/fastings';
import { isVerifiedEkadashi } from '../data/verifiedEkadashis';
import {
  getSunLongitude,
  getMoonLongitude,
  calculateTithiIndex,
  calculateNakshatraIndex,
  calculateYogaIndex,
  getPaksha,
  getTithiNumber,
  getAyanamsa,
  toSidereal,
  getHinduLunarMonth
} from './astronomy';
import {
  calculateSunrise,
  calculateSunset,
  calculateRahuKaal,
  calculateYamagandam,
  calculateGulikaKaal
} from './sunrise';
import {
  getJulianDay,
  addMinutes,
  subMinutes,
  isWithinInterval
} from './utils';

// Solar-sign (rashi) names entered at each Sankranti, indexed 0-11 by
// sidereal longitude: 0=Mesha (0-30°) … 9=Makara (270-300°), 10=Kumbha, 11=Meena.
// Single source of truth — also consumed by src/data/observances/sankranti.ts.
export const SANKRANTI_NAMES = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
];
export const SANKRANTI_NAMES_HINDI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

export class PanchangEngine {
  private location: GeoLocation;

  constructor(location: GeoLocation) {
    this.location = location;
  }

  /**
   * Update location for calculations
   */
  setLocation(location: GeoLocation): void {
    this.location = location;
  }

  /**
   * Calculate complete panchang for a given date
   * Why: Main entry point for all panchang data
   * 
   * CRITICAL: In Hindu calendar system, tithi is determined by the tithi
   * present at SUNRISE (Udaya Tithi), not at midnight. This is fundamental
   * to accurate panchang calculations.
   */
  calculate(date: Date): Panchang {
    // Ensure we're working with local midnight for the date
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);

    // Calculate sunrise and sunset FIRST (needed for tithi calculation)
    const sunrise = calculateSunrise(localDate, this.location);
    const sunset = calculateSunset(localDate, this.location);

    // Calculate Sun and Moon longitudes at SUNRISE (not midnight!)
    // This is the Udaya Tithi principle - the tithi at sunrise determines
    // the tithi for the entire day
    const sunLongitudeTropical = getSunLongitude(sunrise);
    const moonLongitudeTropical = getMoonLongitude(sunrise);

    // Convert to sidereal (Nirayana) using Lahiri Ayanamsa
    const ayanamsa = getAyanamsa(sunrise);
    const sunLongitude = toSidereal(sunLongitudeTropical, ayanamsa);
    const moonLongitude = toSidereal(moonLongitudeTropical, ayanamsa);

    // Calculate Hindu lunar month from sidereal Sun position
    const lunarMonth = getHinduLunarMonth(sunLongitude);

    // Calculate panchang elements using sunrise-based positions
    const tithi = this.calculateTithi(sunLongitude, moonLongitude, localDate, sunrise, sunset);
    const nakshatra = this.calculateNakshatra(moonLongitude, localDate, sunrise, sunset);
    const yoga = this.calculateYoga(sunLongitude, moonLongitude);
    const karana = this.calculateKarana(sunLongitude, moonLongitude, tithi.number);
    const var_ = this.calculateVar(localDate);

    // Calculate inauspicious periods
    const rahuKaal = calculateRahuKaal(localDate, sunrise, sunset);
    const yamagandam = calculateYamagandam(localDate, sunrise, sunset);
    const gulikaKaal = calculateGulikaKaal(localDate, sunrise, sunset);

    // Calculate dinacharya phases
    const dinacharya = this.calculateDinacharyaPhases(sunrise, sunset);

    // Detect fasting day based on tithi (needs sunrise/sunset for parana windows)
    const fasting = this.detectFastingDay(tithi, localDate, sunrise, sunset);

    // Detect festivals based on tithi, paksha, AND lunar month
    const festivals = getFestivalsForDate(localDate, tithi.number, tithi.paksha, undefined, lunarMonth);

    // Detect solar ingress (Sankranti) occurring during this civil day
    const ingress = this.findSolarIngress(localDate);
    const sankranti: SankrantiInfo | null = ingress
      ? {
          rashiIndex: ingress.rashiIndex,
          name: SANKRANTI_NAMES[ingress.rashiIndex] || 'Unknown',
          nameHindi: SANKRANTI_NAMES_HINDI[ingress.rashiIndex] || 'Unknown',
          ingressTime: ingress.ingressTime
        }
      : null;

    // Detect Adhik/Kshaya Maas for the enclosing lunar month (additive;
    // legacy lunarMonth/festival matching untouched)
    const adhikMaas = this.getAdhikMaasInfo(localDate);

    return {
      date: localDate,
      location: this.location,
      tithi,
      nakshatra,
      yoga,
      karana,
      var: var_,
      sunrise,
      sunset,
      rahuKaal,
      yamagandam,
      gulikaKaal,
      festivals,
      fasting,
      dinacharya,
      samvatsara: this.calculateSamvatsara(localDate),
      lunarMonth,
      sankranti,
      adhikMaas
    };
  }

  /**
   * Calculate Samvatsara (Hindu year name in 60-year cycle)
   * Based on Jupiter's position and traditional calculations
   */
  private calculateSamvatsara(date: Date): string {
    // The 60-year cycle starts from Prabhava
    // Current cycle reference: 1987 was Prabhava year
    const samvatsaraNames = [
      'Prabhava', 'Vibhava', 'Shukla', 'Pramoda', 'Prajapati',
      'Angirasa', 'Shrimukha', 'Bhava', 'Yuva', 'Dhatri',
      'Ishvara', 'Bahudhanya', 'Pramathi', 'Vikrama', 'Vrisha',
      'Chitrabhanu', 'Svabhanu', 'Tarana', 'Parthiva', 'Vyaya',
      'Sarvajit', 'Sarvadhari', 'Virodhi', 'Vikrita', 'Khara',
      'Nandana', 'Vijaya', 'Jaya', 'Manmatha', 'Durmukhi',
      'Hevilambi', 'Vilambi', 'Vikari', 'Sharvari', 'Plava',
      'Shubhakrit', 'Shobhakrit', 'Krodhi', 'Vishvavasu', 'Parabhava',
      'Plavanga', 'Kilaka', 'Saumya', 'Sadharana', 'Virodhikrit',
      'Paridhavi', 'Pramadicha', 'Ananda', 'Rakshasa', 'Nala',
      'Pingala', 'Kalayukti', 'Siddharthi', 'Raudra', 'Durmati',
      'Dundubhi', 'Rudhirodgari', 'Raktakshi', 'Krodhana', 'Akshaya'
    ];
    
    // 1987 was Prabhava (year 0 in cycle)
    const baseYear = 1987;
    const currentYear = date.getFullYear();
    const cyclePosition = (currentYear - baseYear) % 60;
    
    return samvatsaraNames[cyclePosition] || 'Prabhava';
  }

  /**
   * Detect fasting day based on tithi
   * Uses verified Ekadashi database for 100% accuracy on Ekadashi dates
   *
   * RITUAL CORRECTNESS: parana windows are computed from actual sunrise/sunset
   * and tithi boundaries for the user's location — never fixed clock times
   * (Delhi winter sunrise is ~07:15, so a fixed 06:30 parana would be wrong).
   * Ekadashi parana follows the Smarta convention: next morning after sunrise,
   * while Dwadashi prevails. Sampradaya-specific rules (e.g. Vaishnava
   * Dwadashi-observance, Hari-Vasara exclusion) are a known future refinement.
   */
  private detectFastingDay(tithi: Tithi, date: Date, sunrise: Date, sunset: Date) {
    const tithiName = tithi.name.toLowerCase();
    const isShukla = tithi.paksha === 'Shukla';
    const weekday = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, …, 6=Sat

    // Ekadashi detection - use verified database first
    const verifiedEkadashi = isVerifiedEkadashi(date);
    
    if (verifiedEkadashi || tithiName.includes('ekadashi')) {
      // If we have verified database entry, use it
      // Otherwise fallback to algorithmic detection
      const actualPaksha = verifiedEkadashi ? verifiedEkadashi.paksha : tithi.paksha;
      const actualIsShukla = actualPaksha === 'Shukla';
      
      return {
        id: actualIsShukla ? 'ekadashi-shukla' : 'ekadashi-krishna',
        name: verifiedEkadashi ? verifiedEkadashi.name : 'Ekadashi',
        nameHindi: 'एकादशी',
        type: 'ekadashi' as const,
        significance: actualIsShukla
          ? 'Shukla Paksha Ekadashi - Dedicated to Lord Vishnu for spiritual purification'
          : 'Krishna Paksha Ekadashi - Dedicated to Lord Vishnu for removing sins',
        significanceHindi: actualIsShukla
          ? 'शुक्ल पक्ष एकादशी - आध्यात्मिक शुद्धि के लिए भगवान विष्णु को समर्पित'
          : 'कृष्ण पक्ष एकादशी - पापों को दूर करने के लिए भगवान विष्णु को समर्पित',
        benefits: [
          'Spiritual purification',
          'Removes sins',
          'Pleases Lord Vishnu',
          'Improves willpower'
        ],
        benefitsHindi: [
          'आध्यात्मिक शुद्धि',
          'पाप दूर',
          'भगवान विष्णु को प्रसन्न',
          'इच्छाशक्ति में सुधार'
        ],
        rules: [
          'No grains, beans, or cereals',
          'Fruits, milk, and nuts allowed',
          'Some observe complete water fast',
          'Break fast next day during Parana time'
        ],
        rulesHindi: [
          'अनाज, फलियां या अनाज नहीं',
          'फल, दूध और मेवे की अनुमति',
          'कुछ पूर्ण निर्जल व्रत observance करते हैं',
          'अगले दिन पारण के समय व्रत तोड़ें'
        ],
        date,
        paranaTime: this.calculateEkadashiParana(date)
      };
    }

    // Pradosh (Trayodashi, either paksha) with weekday subtyping:
    // Monday=Soma, Tuesday=Bhauma, Saturday=Shani. Content comes from the
    // OTHER_FASTS['pradosh-vrat'] template; only the subtype name/id varies.
    if (tithiName.includes('trayodashi')) {
      let id = 'pradosh-vrat';
      let name = 'Pradosh Vrat';
      let nameHindi = 'प्रदोष व्रत';
      if (weekday === 1) {
        id = 'soma-pradosh';
        name = 'Soma Pradosh Vrat';
        nameHindi = 'सोम प्रदोष व्रत';
      } else if (weekday === 2) {
        id = 'bhauma-pradosh';
        name = 'Bhauma Pradosh Vrat';
        nameHindi = 'भौम प्रदोष व्रत';
      } else if (weekday === 6) {
        id = 'shani-pradosh';
        name = 'Shani Pradosh Vrat';
        nameHindi = 'शनि प्रदोष व्रत';
      }
      return this.buildFastingFromTemplate(
        'pradosh-vrat',
        { id, name, nameHindi },
        date,
        // Pradosh fast is broken after evening Shiva worship during twilight:
        // window opens at local sunset, closes 2h later.
        { start: sunset, end: addMinutes(sunset, 120) }
      );
    }

    // Sankashti (Krishna Chaturthi) with Angarki subtyping on Tuesday.
    if (tithi.number === 4 && !isShukla) {
      const isAngarki = weekday === 2;
      return this.buildFastingFromTemplate(
        'sankashti-chaturthi',
        isAngarki
          ? { id: 'angarki-sankashti', name: 'Angarki Sankashti Chaturthi', nameHindi: 'अंगारकी संकष्टी चतुर्थी' }
          : { id: 'sankashti-chaturthi', name: 'Sankashti Chaturthi', nameHindi: 'संकष्टी चतुर्थी' },
        date,
        // Fast is broken after moonrise; the engine has no moonrise model,
        // so the window opens at local sunset (conservative) for 2h.
        { start: sunset, end: addMinutes(sunset, 120) }
      );
    }

    // Amavasya (Krishna 15) with Somvati (Monday) / Shani (Saturday) subtyping.
    // NOTE: tithi number 15 is named 'Purnima/Amavasya' for both pakshas, so
    // matching is by number+paksha and this branch MUST precede the Purnima
    // branch below (which is now explicitly guarded to Shukla).
    if (tithi.number === 15 && !isShukla) {
      let id = 'amavasya-vrat';
      let name = 'Amavasya Vrat';
      let nameHindi = 'अमावस्या व्रत';
      if (weekday === 1) {
        id = 'somvati-amavasya';
        name = 'Somvati Amavasya';
        nameHindi = 'सोमवती अमावस्या';
      } else if (weekday === 6) {
        id = 'shani-amavasya';
        name = 'Shani Amavasya';
        nameHindi = 'शनि अमावस्या';
      }
      return this.buildFastingFromTemplate(
        'amavasya-vrat',
        { id, name, nameHindi },
        date,
        // Pitru rites run through the day; fast concludes after sunset.
        { start: sunset, end: addMinutes(sunset, 120) }
      );
    }

    // Purnima (Full Moon — Shukla 15 only; Krishna 15 is Amavasya, handled above)
    if (tithiName.includes('purnima') && isShukla) {
      return {
        id: 'purnima-vrat',
        name: 'Purnima Vrat',
        nameHindi: 'पूर्णिमा व्रत',
        type: 'purnima' as const,
        significance: 'Full moon day - Highly auspicious for spiritual practices and fasting',
        significanceHindi: 'पूर्णिमा का दिन - आध्यात्मिक अभ्यास और व्रत के लिए अत्यंत शुभ',
        benefits: [
          'Mental peace',
          'Spiritual growth',
          'Fulfills desires',
          'Removes sins'
        ],
        benefitsHindi: [
          'मानसिक शांति',
          'आध्यात्मिक विकास',
          'इच्छाएं पूरी',
          'पाप दूर'
        ],
        rules: [
          'Fast or light sattvic food',
          'Worship Lord Satyanarayan',
          'Donate food and clothes',
          'Chant Vishnu mantras'
        ],
        rulesHindi: [
          'व्रत या हल्का सात्विक भोजन',
          'भगवान सत्यनारायण की पूजा',
          'भोजन और वस्त्र दान',
          'विष्णु मंत्र जाप'
        ],
        date,
        // Purnima vrat concludes with evening Satyanarayan katha/vrat-break:
        // anchored to local sunset (previously fixed 18:00–20:00 regardless of
        // actual sunset). A future refinement is moonrise-based timing.
        paranaTime: {
          start: sunset,
          end: addMinutes(sunset, 120)
        }
      };
    }

    return undefined;
  }

  /**
   * Build an engine FastingInfo object from an OTHER_FASTS template,
   * overriding only id/name/nameHindi for weekday subtypes (Soma/Bhauma/
   * Shani Pradosh, Angarki Sankashti, Somvati/Shani Amavasya). The template
   * carries the scriptural content; parana windows stay location-computed
   * (sunset-anchored) per the ritual-correctness rule above.
   */
  private buildFastingFromTemplate(
    templateId: 'pradosh-vrat' | 'sankashti-chaturthi' | 'amavasya-vrat' | 'purnima-vrat',
    override: { id: string; name: string; nameHindi: string },
    date: Date,
    paranaTime: TimeRange
  ) {
    const template = OTHER_FASTS[templateId];
    return {
      id: override.id,
      name: override.name,
      nameHindi: override.nameHindi,
      type: template.type as 'pradosh' | 'sankashti' | 'purnima' | 'amavasya',
      significance: template.significance,
      significanceHindi: template.significanceHindi,
      benefits: template.benefits,
      benefitsHindi: template.benefitsHindi,
      rules: template.rules,
      rulesHindi: template.rulesHindi,
      date,
      paranaTime
    };
  }

  /**
   * Ekadashi parana window (Smarta convention): next morning after sunrise,
   * closing when Dwadashi ends (Trayodashi begins). Both endpoints are computed
   * for the user's location. Fallback (Dwadashi kshaya — ends before sunrise):
   * a 2-hour window from sunrise, so the UI never shows an empty/inverted range.
   */
  private calculateEkadashiParana(ekadashiDate: Date): TimeRange {
    const nextDay = new Date(ekadashiDate);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);
    const nextSunrise = calculateSunrise(nextDay, this.location);

    const sunLong = toSidereal(getSunLongitude(nextSunrise), getAyanamsa(nextSunrise));
    const moonLong = toSidereal(getMoonLongitude(nextSunrise), getAyanamsa(nextSunrise));
    const idxAtSunrise = calculateTithiIndex(sunLong, moonLong);

    const windowEnd = new Date(nextSunrise.getTime() + 30 * 3600 * 1000);
    const dwadashiEnd = this.findTithiChangeTime(nextSunrise, windowEnd, (idxAtSunrise + 1) % 30);

    const start = nextSunrise;
    const end = dwadashiEnd.getTime() > nextSunrise.getTime()
      ? dwadashiEnd
      : addMinutes(nextSunrise, 120);
    return { start, end };
  }

  /**
   * Calculate tithi details with accurate boundary times
   * 
   * Uses iterative binary search to find exact tithi change times
   * instead of rough estimates.
   */
  private calculateTithi(
    sunLongitude: number,
    moonLongitude: number,
    date: Date,
    sunrise: Date,
    sunset: Date
  ): Tithi {
    const tithiIndex = calculateTithiIndex(sunLongitude, moonLongitude);
    const paksha = getPaksha(tithiIndex);
    const tithiNumber = getTithiNumber(tithiIndex);

    // Calculate accurate tithi start/end times using binary search
    const { startTime, endTime, isKshaya, isVriddhi } = 
      this.calculateTithiBoundaries(tithiIndex, date, sunrise);

    return {
      number: tithiNumber,
      name: TITHI_NAMES[tithiNumber - 1] || TITHI_NAMES[14],
      nameHindi: TITHI_NAMES_HINDI[tithiNumber - 1] || TITHI_NAMES_HINDI[14],
      paksha,
      startTime,
      endTime,
      isKshaya,
      isVriddhi
    };
  }

  /**
   * Calculate accurate tithi start and end times using binary search
   * 
   * A tithi changes when (moonLongitude - sunLongitude) / 12 crosses an integer.
   * We use binary search to find the exact time within a 2-day window.
   */
  private calculateTithiBoundaries(
    currentTithiIndex: number,
    date: Date,
    sunrise: Date
  ): { startTime: Date; endTime: Date; isKshaya: boolean; isVriddhi: boolean } {
    // Search window: from previous day's sunrise to next day's sunrise
    const prevDaySunrise = new Date(sunrise);
    prevDaySunrise.setDate(prevDaySunrise.getDate() - 1);
    
    const nextDaySunrise = new Date(sunrise);
    nextDaySunrise.setDate(nextDaySunrise.getDate() + 1);

    // Find when the current tithi STARTED
    // Binary search in [prevDaySunrise, sunrise]
    const tithiStartTime = this.findTithiChangeTime(
      prevDaySunrise,
      sunrise,
      currentTithiIndex
    );

    // Find when the current tithi ENDS
    // Binary search in [sunrise, nextDaySunrise]
    const tithiEndTime = this.findTithiChangeTime(
      sunrise,
      nextDaySunrise,
      (currentTithiIndex + 1) % 30
    );

    // For kshaya/vriddhi detection, we need the previous day's tithi
    // We'll calculate it directly without calling calculate() to avoid recursion
    const prevSunLong = toSidereal(getSunLongitude(prevDaySunrise), getAyanamsa(prevDaySunrise));
    const prevMoonLong = toSidereal(getMoonLongitude(prevDaySunrise), getAyanamsa(prevDaySunrise));
    const prevTithiIdx = calculateTithiIndex(prevSunLong, prevMoonLong);
    
    const isKshaya = prevTithiIdx < currentTithiIndex - 1;
    const isVriddhi = prevTithiIdx === currentTithiIndex;

    return {
      startTime: tithiStartTime,
      endTime: tithiEndTime,
      isKshaya,
      isVriddhi
    };
  }

  /**
   * Find the exact time when a tithi changes using binary search
   * 
   * @param startTime Start of search window
   * @param endTime End of search window
   * @param targetTithiIndex The tithi index we're looking for (the one that should exist at endTime)
   * @returns The time when the tithi boundary occurs
   */
  private findTithiChangeTime(
    startTime: Date,
    endTime: Date,
    targetTithiIndex: number
  ): Date {
    const maxIterations = 50; // Gives precision to ~0.03 seconds
    let low = startTime.getTime();
    let high = endTime.getTime();

    for (let i = 0; i < maxIterations; i++) {
      const mid = new Date((low + high) / 2);
      
      // Calculate tithi at mid time
      const sunLong = toSidereal(getSunLongitude(mid), getAyanamsa(mid));
      const moonLong = toSidereal(getMoonLongitude(mid), getAyanamsa(mid));
      const tithiIdx = calculateTithiIndex(sunLong, moonLong);

      if (tithiIdx === targetTithiIndex) {
        // We're in the target tithi, check if we're near the boundary
        const diff = high - low;
        if (diff < 1000) { // Within 1 second
          return new Date(low);
        }
        // Try to narrow down
        high = mid.getTime();
      } else {
        // We're before the target tithi
        low = mid.getTime();
      }
    }

    return new Date(low);
  }

  /**
   * Sidereal (Nirayana, Lahiri) Sun longitude at a given moment.
   * Thin wrapper over the untouched astronomy primitives — no formula change.
   */
  private getSiderealSunLongitude(at: Date): number {
    return toSidereal(getSunLongitude(at), getAyanamsa(at));
  }

  /**
   * Find the solar ingress (Sankranti) occurring during a civil day, if any.
   *
   * Mirrors the findTithiChangeTime bisection pattern: the Sun moves forward
   * ~1°/day, so at most one 30° sidereal boundary can be crossed per day.
   * Compares the rashi index at local midnight vs next midnight; when they
   * differ, bisects to locate the exact crossing moment.
   *
   * @param date Any time during the civil day of interest (local time)
   * @returns ingressTime + entered rashiIndex (0=Mesha … 11=Meena), or null
   */
  findSolarIngress(date: Date): { ingressTime: Date; rashiIndex: number } | null {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const lonStart = this.getSiderealSunLongitude(dayStart);
    const lonEnd = this.getSiderealSunLongitude(dayEnd);

    const startSign = Math.floor(lonStart / 30);
    const endSign = Math.floor(lonEnd / 30);
    if (endSign === startSign) return null;

    // Unwrap longitudes relative to day start so the Meena→Mesha
    // wrap (359.x° → 0.x°) bisects correctly in a monotonic space.
    const unwrap = (lon: number): number => (lon < lonStart ? lon + 360 : lon);
    const rawBoundary = endSign * 30;
    const boundary = rawBoundary <= lonStart ? rawBoundary + 360 : rawBoundary;

    const maxIterations = 50;
    let low = dayStart.getTime();
    let high = dayEnd.getTime();
    for (let i = 0; i < maxIterations; i++) {
      const mid = new Date((low + high) / 2);
      if (unwrap(this.getSiderealSunLongitude(mid)) >= boundary) {
        high = mid.getTime();
      } else {
        low = mid.getTime();
      }
    }

    return { ingressTime: new Date(low), rashiIndex: endSign };
  }

  /**
   * Tithi index (0-29) at an arbitrary moment. Index 0 = Shukla Pratipada
   * (just after new moon); 29 = Krishna Amavasya (just before new moon).
   */
  private tithiIndexAt(at: Date): number {
    const sunLong = toSidereal(getSunLongitude(at), getAyanamsa(at));
    const moonLong = toSidereal(getMoonLongitude(at), getAyanamsa(at));
    return calculateTithiIndex(sunLong, moonLong);
  }

  /**
   * Nearest new-moon moment (tithi 29→0 transition) in the given direction.
   *
   * Walks a 12h grid (any tithi lasts ≥19h, so a 29→0 crossing always shows
   * as an exact (29, 0) pair on this grid) up to 32 days out — a lunation is
   * ~29.53d, so a new moon is always found. Bisects with findTithiChangeTime.
   *
   * @param from Reference moment (local time)
   * @param direction -1 = latest new moon at/before `from`, +1 = earliest at/after
   */
  findNewMoonMoment(from: Date, direction: -1 | 1): Date | null {
    const stepMs = 12 * 3600 * 1000;
    const base = from.getTime();
    for (let k = 0; k < 64; k++) {
      const a = new Date(base + direction * k * stepMs);
      const b = new Date(base + direction * (k + 1) * stepMs);
      // Chronological window (s < e) regardless of direction.
      const s = direction === -1 ? b : a;
      const e = direction === -1 ? a : b;
      if (this.tithiIndexAt(s) === 29 && this.tithiIndexAt(e) === 0) {
        return this.findTithiChangeTime(s, e, 0);
      }
    }
    return null;
  }

  /**
   * Solar ingresses with ingressTime in (spanStart, spanEnd].
   * Day-by-day reuse of the tested findSolarIngress detector.
   */
  private findIngressInSpan(spanStart: Date, spanEnd: Date): Array<{ ingressTime: Date; rashiIndex: number }> {
    const out: Array<{ ingressTime: Date; rashiIndex: number }> = [];
    const day = new Date(spanStart);
    day.setHours(0, 0, 0, 0);
    const endDay = new Date(spanEnd);
    endDay.setHours(0, 0, 0, 0);
    for (let d = new Date(day); d.getTime() <= endDay.getTime(); d.setDate(d.getDate() + 1)) {
      const ingress = this.findSolarIngress(d);
      if (
        ingress &&
        ingress.ingressTime.getTime() > spanStart.getTime() &&
        ingress.ingressTime.getTime() <= spanEnd.getTime()
      ) {
        out.push(ingress);
      }
    }
    return out;
  }

  /** Amanta month number (1=Chaitra … 12=Phalguna) from an ingress rashi. */
  private amantaMonthFromRashi(rashiIndex: number): { monthNumber: number; name: string; nameHindi: string } {
    // The lunar month containing an ingress into rashi R takes R's month:
    // Mesha ingress (Apr) falls in Chaitra, Karka ingress (Jul) in Shravana, etc.
    const monthNumber = rashiIndex + 1;
    return {
      monthNumber,
      name: LUNAR_MONTHS[rashiIndex] ?? 'Unknown',
      nameHindi: LUNAR_MONTHS_HINDI[rashiIndex] ?? 'Unknown',
    };
  }

  /**
   * Adhik Maas (leap month) / Kshaya Maas (deleted month) for the lunar
   * month containing `date` (amanta: new-moon → new-moon span).
   *
   * - 0 ingresses in the span → Adhik, named after the FOLLOWING Nija month
   *   (e.g. the Jul 18–Aug 16 2023 span has none → "Adhik Shravana", after
   *   the Aug 16–Sep 15 span whose Simha ingress names it Shravana).
   * - 2 ingresses → Kshaya (vanishingly rare; named from the first ingress).
   * - 1 ingress → normal month → null.
   *
   * Additive only: the legacy sun-sign `lunarMonth` field is untouched.
   */
  getAdhikMaasInfo(date: Date): AdhikMaasInfo | null {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    const prevNM = this.findNewMoonMoment(day, -1);
    if (!prevNM) return null;
    // Step just past prevNM so the forward search cannot return the same moment.
    const nextNM = this.findNewMoonMoment(new Date(prevNM.getTime() + 3600 * 1000), 1);
    if (!nextNM || nextNM.getTime() <= prevNM.getTime()) return null;

    const ingresses = this.findIngressInSpan(prevNM, nextNM);
    if (ingresses.length === 1) return null;

    if (ingresses.length === 0) {
      // Adhik: name comes from the next (Nija) month's sankranti.
      const followingNM = this.findNewMoonMoment(new Date(nextNM.getTime() + 3600 * 1000), 1);
      const nextSpanIngress = followingNM
        ? this.findIngressInSpan(nextNM, followingNM)[0]
        : undefined;
      // Fallback (should not happen): name from the span's own sun sign.
      const named = nextSpanIngress
        ? this.amantaMonthFromRashi(nextSpanIngress.rashiIndex)
        : (() => {
            const mid = new Date((prevNM.getTime() + nextNM.getTime()) / 2);
            const rashi = Math.floor(this.getSiderealSunLongitude(mid) / 30);
            return this.amantaMonthFromRashi(rashi);
          })();
      return {
        isAdhik: true,
        isKshaya: false,
        monthNumber: named.monthNumber,
        name: named.name,
        nameHindi: named.nameHindi,
        spanStart: prevNM,
        spanEnd: nextNM,
      };
    }

    // 2+ ingresses: Kshaya Maas (last occurred 1983; next far future).
    const named = this.amantaMonthFromRashi(ingresses[0].rashiIndex);
    return {
      isAdhik: false,
      isKshaya: true,
      monthNumber: named.monthNumber,
      name: named.name,
      nameHindi: named.nameHindi,
      spanStart: prevNM,
      spanEnd: nextNM,
    };
  }

  /**
   * Calculate nakshatra details
   */
  private calculateNakshatra(
    moonLongitude: number,
    date: Date,
    sunrise: Date,
    sunset: Date
  ): Nakshatra {
    const nakshatraIndex = calculateNakshatraIndex(moonLongitude);
    const nakshatraSpan = 360 / 27;
    const startLongitude = nakshatraIndex * nakshatraSpan;
    const progress = (moonLongitude - startLongitude) / nakshatraSpan;
    const fractionRemaining = 1 - progress;

    // Estimate end time (nakshatra changes every ~24 hours / 27)
    const nakshatraDuration = (24 * 60 * 60 * 1000) / 27;
    const endTime = addMinutes(date, fractionRemaining * (nakshatraDuration / 60000));
    const startTime = subMinutes(endTime, nakshatraDuration / 60000);

    return {
      number: nakshatraIndex + 1,
      name: NAKSHATRA_NAMES[nakshatraIndex],
      nameHindi: NAKSHATRA_NAMES_HINDI[nakshatraIndex],
      ruler: this.getNakshatraRuler(nakshatraIndex),
      startTime,
      endTime
    };
  }

  /**
   * Get nakshatra ruler (deity)
   */
  private getNakshatraRuler(index: number): string {
    const rulers = [
      'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
      'Rahu', 'Jupiter', 'Saturn', 'Mercury',
      'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
      'Rahu', 'Jupiter', 'Saturn', 'Mercury',
      'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
      'Rahu', 'Jupiter', 'Saturn', 'Mercury'
    ];
    return rulers[index] || 'Unknown';
  }

  /**
   * Calculate yoga
   */
  private calculateYoga(sunLongitude: number, moonLongitude: number): Yoga {
    const yogaIndex = calculateYogaIndex(sunLongitude, moonLongitude);
    
    return {
      number: yogaIndex + 1,
      name: YOGA_NAMES[yogaIndex] || 'Unknown',
      nameHindi: YOGA_NAMES[yogaIndex] || 'Unknown' // Add Hindi names to constants
    };
  }

  /**
   * Calculate karana using the traditional 60-slot system.
   * fullIndex = floor(moonSunDiff / 6), where moonSunDiff is the
   * normalized sidereal (moon - sun) longitude in degrees.
   * Mapping:
   *   fullIndex === 0 → Kimstughna
   *   fullIndex 1..56 → VARIABLES[(fullIndex-1) % 7]
   *   fullIndex === 57 → Shakuni
   *   fullIndex === 58 → Chatushpada
   *   fullIndex === 59 → Nagava
   */
  private calculateKarana(sunLongitude: number, moonLongitude: number, tithiNumber: number): Karana {
    let diff = moonLongitude - sunLongitude;
    if (diff < 0) diff += 360;
    const fullIndex = Math.floor(diff / 6);

    const VARIABLES = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti'];

    let name: string;
    let type: 'fixed' | 'variable';
    let karanaNumber: number;

    if (fullIndex === 0) {
      name = 'Kimstughna';
      type = 'fixed';
      karanaNumber = 11;
    } else if (fullIndex >= 1 && fullIndex <= 56) {
      name = VARIABLES[(fullIndex - 1) % 7];
      type = 'variable';
      karanaNumber = (fullIndex - 1) % 7 + 1;
    } else if (fullIndex === 57) {
      name = 'Shakuni';
      type = 'fixed';
      karanaNumber = 8;
    } else if (fullIndex === 58) {
      name = 'Chatushpada';
      type = 'fixed';
      karanaNumber = 9;
    } else {
      name = 'Nagava';
      type = 'fixed';
      karanaNumber = 10;
    }

    return {
      number: karanaNumber,
      name,
      nameHindi: name,
      type
    };
  }

  /**
   * Calculate var (weekday)
   */
  private calculateVar(date: Date): Var {
    const dayIndex = date.getDay();
    
    return {
      number: dayIndex,
      name: VAR_NAMES[dayIndex],
      nameHindi: VAR_NAMES_HINDI[dayIndex]
    };
  }

  /**
   * Calculate dinacharya phases for the day
   */
  private calculateDinacharyaPhases(sunrise: Date, sunset: Date): DinacharyaPhase[] {
    const phases = DINACHARYA_PHASES.map(phase => {
      const startTime = addMinutes(sunrise, phase.startOffset);
      const endTime = addMinutes(sunrise, phase.endOffset);
      
      return {
        id: phase.id,
        name: phase.name,
        nameHindi: phase.nameHindi,
        startTime,
        endTime,
        dosha: phase.dosha,
        activities: phase.activities,
        description: phase.description
      };
    });

    return phases;
  }

  /**
   * Get current dinacharya phase
   */
  getCurrentDinacharyaPhase(panchang: Panchang, now: Date = new Date()): DinacharyaPhase | undefined {
    return panchang.dinacharya.find(phase => 
      isWithinInterval(now, { start: phase.startTime, end: phase.endTime })
    );
  }

  /**
   * Get next dinacharya phase
   */
  getNextDinacharyaPhase(panchang: Panchang, now: Date = new Date()): DinacharyaPhase | undefined {
    const currentIndex = panchang.dinacharya.findIndex(phase => 
      isWithinInterval(now, { start: phase.startTime, end: phase.endTime })
    );
    
    if (currentIndex >= 0 && currentIndex < panchang.dinacharya.length - 1) {
      return panchang.dinacharya[currentIndex + 1];
    }
    
    return undefined;
  }

  /**
   * Calculate panchang for an entire month
   * Why: Efficient batch calculation for calendar view
   */
  calculateMonth(year: number, month: number): Panchang[] {
    const results: Panchang[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      results.push(this.calculate(date));
    }
    
    return results;
  }

  /**
   * Get lunar month name
   */
  getLunarMonth(panchang: Panchang): { name: string; nameHindi: string } {
    const monthIndex = panchang.lunarMonth ?? (panchang.date.getMonth() + 1); // 1-based
    // monthIndex is 1-based (1=Chaitra, 12=Phalguna)
    const arrayIndex = (monthIndex - 1) % 12;
    return {
      name: LUNAR_MONTHS[arrayIndex],
      nameHindi: LUNAR_MONTHS_HINDI[arrayIndex]
    };
  }
}

// Export singleton instance creator
export function createPanchangEngine(location: GeoLocation): PanchangEngine {
  return new PanchangEngine(location);
}
