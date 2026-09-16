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
  DinacharyaPhase 
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
      lunarMonth
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

    // Pradosh (Trayodashi)
    if (tithiName.includes('trayodashi')) {
      return {
        id: 'pradosh-vrat',
        name: 'Pradosh Vrat',
        nameHindi: 'प्रदोष व्रत',
        type: 'pradosh' as const,
        significance: 'Twilight worship on Trayodashi - Dedicated to Lord Shiva for removing obstacles',
        significanceHindi: 'त्रयोदशी पर संध्या पूजा - बाधाएं दूर करने के लिए भगवान शिव को समर्पित',
        benefits: [
          'Removes obstacles',
          'Brings prosperity',
          'Fulfills desires',
          'Mental peace'
        ],
        benefitsHindi: [
          'बाधाएं दूर',
          'समृद्धि लाता है',
          'इच्छाएं पूरी',
          'मानसिक शांति'
        ],
        rules: [
          'Fast during the day',
          'Worship Shiva during twilight',
          'Offer water and bilva leaves',
          'Chant Om Namah Shivaya'
        ],
        rulesHindi: [
          'दिन के दौरान व्रत',
          'संध्या के दौरान शिव पूजा',
          'जल और बिल्व पत्र अर्पित करें',
          'ॐ नमः शिवाय जाप'
        ],
        date,
        // Pradosh fast is broken after evening Shiva worship during twilight:
        // window opens at local sunset (previously a fixed 18:30, wrong whenever
        // sunset differed — e.g. Delhi winter ~17:30), closes 2h later.
        paranaTime: {
          start: sunset,
          end: addMinutes(sunset, 120)
        }
      };
    }

    // Purnima (Full Moon)
    if (tithiName.includes('purnima')) {
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
