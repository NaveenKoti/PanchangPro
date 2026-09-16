/**
 * Vedic Guidance Engine
 * 
 * Rule-based guidance system that combines:
 * - Tithi significance
 * - Nakshatra nature
 * - Muhurta (Rahu Kaal, etc.)
 * - Current time
 * 
 * Outputs:
 * - Good activities
 * - Activities to avoid
 * - Neutral activities
 * 
 * Sources: Traditional Panchang rules from Brihat Samhita, Muhurta Chintamani
 */

import { Tithi, Nakshatra, TimeRange, Panchang } from '../types';
import { getTithiByIndex, TITHI_DATA } from '../data/vedic/tithiData';
import { getNakshatraByNumber, NAKSHATRA_DATA } from '../data/vedic/nakshatraData';

export interface GuidanceResult {
  overall: 'good' | 'neutral' | 'avoid';
  score: number; // 0-100
  goodFor: string[];
  goodForHindi: string[];
  avoid: string[];
  avoidHindi: string[];
  neutral: string[];
  neutralHindi: string[];
  reasons: string[];
  reasonsHindi: string[];
  muhurtaStatus: {
    rahuKaal: boolean;
    yamagandam: boolean;
    gulikaKaal: boolean;
    abhijitMuhurta: boolean;
  };
  specialYoga?: string;
  specialYogaHindi?: string;
}

export interface MuhurtaData {
  rahuKaal: TimeRange;
  yamagandam: TimeRange;
  gulikaKaal: TimeRange;
  abhijitMuhurta?: TimeRange;
}

/**
 * Calculate overall guidance for current panchang
 */
export const calculateGuidance = (
  panchang: Panchang,
  currentTime: Date,
  muhurtaData: MuhurtaData
): GuidanceResult => {
  const tithiData = getTithiByIndex(panchang.tithi.number);
  const nakshatraData = getNakshatraByNumber(panchang.nakshatra.number);

  let score = 50; // Start neutral
  const goodFor: string[] = [];
  const goodForHindi: string[] = [];
  const avoid: string[] = [];
  const avoidHindi: string[] = [];
  const neutral: string[] = [];
  const neutralHindi: string[] = [];
  const reasons: string[] = [];
  const reasonsHindi: string[] = [];

  // Check Muhurta status
  const isRahuKaal = isTimeInRange(currentTime, muhurtaData.rahuKaal);
  const isYamagandam = isTimeInRange(currentTime, muhurtaData.yamagandam);
  const isGulikaKaal = isTimeInRange(currentTime, muhurtaData.gulikaKaal);
  const isAbhijitMuhurta = muhurtaData.abhijitMuhurta 
    ? isTimeInRange(currentTime, muhurtaData.abhijitMuhurta)
    : false;

  // MUHURTA RULES (Highest Priority)
  if (isRahuKaal) {
    score -= 30;
    avoid.push('All auspicious works', 'New ventures', 'Travel', 'Important decisions');
    avoidHindi.push('सभी शुभ कार्य', 'नए उद्यम', 'यात्रा', 'महत्वपूर्ण निर्णय');
    reasons.push('Rahu Kaal is active - inauspicious period');
    reasonsHindi.push('राहु काल सक्रिय है - अशुभ अवधि');
  }

  if (isYamagandam) {
    score -= 20;
    avoid.push('Starting new work', 'Business deals');
    avoidHindi.push('नया कार्य शुरू करना', 'व्यापार सौदे');
    reasons.push('Yamagandam is active - avoid new beginnings');
    reasonsHindi.push('यमगंडम सक्रिय है - नई शुरुआत से बचें');
  }

  if (isGulikaKaal) {
    score -= 15;
    avoid.push('Important meetings', 'Financial transactions');
    avoidHindi.push('महत्वपूर्ण बैठकें', 'वित्तीय लेनदेन');
    reasons.push('Gulika Kaal is active - use caution');
    reasonsHindi.push('गुलिका काल सक्रिय है - सावधानी बरतें');
  }

  if (isAbhijitMuhurta) {
    score += 25;
    goodFor.push('All auspicious works', 'Important decisions', 'New ventures', 'Travel');
    goodForHindi.push('सभी शुभ कार्य', 'महत्वपूर्ण निर्णय', 'नए उद्यम', 'यात्रा');
    reasons.push('Abhijit Muhurta is active - highly auspicious');
    reasonsHindi.push('अभिजीत मुहूर्त सक्रिय है - अत्यंत शुभ');
  }

  // TITHI RULES
  if (tithiData) {
    if (tithiData.nature === 'good') {
      score += 15;
      goodFor.push(...tithiData.recommendedActivities);
      goodForHindi.push(...tithiData.recommendedActivitiesHindi);
      avoid.push(...tithiData.avoidActivities);
      avoidHindi.push(...tithiData.avoidActivitiesHindi);
      reasons.push(`${tithiData.name} is generally auspicious (${tithiData.category} category)`);
      reasonsHindi.push(`${tithiData.name} आमतौर पर शुभ है (${tithiData.category} वर्ग)`);
    } else if (tithiData.nature === 'avoid') {
      score -= 20;
      avoid.push('All auspicious ceremonies', 'Marriage', 'New ventures', 'Travel');
      avoidHindi.push('सभी शुभ समारोह', 'विवाह', 'नए उद्यम', 'यात्रा');
      goodFor.push('Spiritual practices', 'Meditation', 'Temple visits', 'Charity');
      goodForHindi.push('आध्यात्मिक अभ्यास', 'ध्यान', 'मंदिर यात्रा', 'दान');
      reasons.push(`${tithiData.name} is inauspicious for worldly activities`);
      reasonsHindi.push(`${tithiData.name} सांसारिक गतिविधियों के लिए अशुभ है`);
    } else {
      // Neutral
      neutral.push('Regular activities', 'Routine work');
      neutralHindi.push('नियमित गतिविधियां', 'रूटीन कार्य');
      reasons.push(`${tithiData.name} gives mixed results`);
      reasonsHindi.push(`${tithiData.name} मिश्रित परिणाम देता है`);
    }

    // Special Tithi Rules
    if (tithiData.name === 'Ekadashi') {
      goodFor.push('Fasting', 'Vishnu worship', 'Spiritual practices');
      goodForHindi.push('व्रत', 'विष्णु पूजा', 'आध्यात्मिक अभ्यास');
      avoid.push('Grains consumption', 'Non-vegetarian food');
      avoidHindi.push('अनाज सेवन', 'मांसाहारी भोजन');
      reasons.push('Ekadashi - sacred fasting day');
      reasonsHindi.push('एकादशी - पवित्र व्रत दिन');
    }

    if (tithiData.name === 'Purnima') {
      score += 10;
      goodFor.push('All auspicious works', 'Fasting', 'Spiritual practices', 'Charity');
      goodForHindi.push('सभी शुभ कार्य', 'व्रत', 'आध्यात्मिक अभ्यास', 'दान');
      reasons.push('Purnima - full moon, highly auspicious');
      reasonsHindi.push('पूर्णिमा - पूर्ण चंद्रमा, अत्यंत शुभ');
    }

    if (tithiData.name === 'Amavasya') {
      avoid.push('Marriage', 'New ventures', 'Auspicious ceremonies');
      avoidHindi.push('विवाह', 'नए उद्यम', 'शुभ समारोह');
      goodFor.push('Ancestor worship', 'Tarpan', 'Spiritual practices');
      goodForHindi.push('पितृ पूजा', 'तर्पण', 'आध्यात्मिक अभ्यास');
      reasons.push('Amavasya - new moon, good for ancestor rituals');
      reasonsHindi.push('अमावस्या - नया चंद्रमा, पितृ अनुष्ठान के लिए अच्छा');
    }
  }

  // NAKSHATRA RULES
  if (nakshatraData) {
    if (nakshatraData.guna === 'Sattva') {
      score += 10;
      goodFor.push('Spiritual activities', 'Education', 'Peaceful work');
      goodForHindi.push('आध्यात्मिक गतिविधियां', 'शिक्षा', 'शांतिपूर्ण कार्य');
      reasons.push(`${nakshatraData.name} is Sattvic (pure) - spiritually favorable`);
      reasonsHindi.push(`${nakshatraData.name} सात्विक है - आध्यात्मिक रूप से अनुकूल`);
    } else if (nakshatraData.guna === 'Tamas' && nakshatraData.nature !== 'fixed') {
      score -= 10;
      reasons.push(`${nakshatraData.name} has Tamasic influence - use caution`);
      reasonsHindi.push(`${nakshatraData.name} का तामसिक प्रभाव है - सावधानी बरतें`);
    }

    // Add nakshatra-specific guidance
    goodFor.push(...nakshatraData.goodFor.slice(0, 5)); // Top 5
    goodForHindi.push(...nakshatraData.goodForHindi.slice(0, 5));
    avoid.push(...nakshatraData.avoidFor.slice(0, 3)); // Top 3
    avoidHindi.push(...nakshatraData.avoidForHindi.slice(0, 3));

    // Special Nakshatra Rules
    if (nakshatraData.name === 'Rohini' || nakshatraData.name === 'Pushya') {
      score += 15;
      reasons.push(`${nakshatraData.name} - one of the most auspicious nakshatras`);
      reasonsHindi.push(`${nakshatraData.name} - सबसे शुभ नक्षत्रों में से एक`);
    }

    if (nakshatraData.name === 'Bharani' || nakshatraData.name === 'Ardra' || 
        nakshatraData.name === 'Ashlesha' || nakshatraData.name === 'Mula') {
      score -= 15;
      avoid.push('Marriage', 'New ventures', 'Auspicious ceremonies');
      avoidHindi.push('विवाह', 'नए उद्यम', 'शुभ समारोह');
      reasons.push(`${nakshatraData.name} - generally inauspicious for worldly works`);
      reasonsHindi.push(`${nakshatraData.name} - आमतौर पर सांसारिक कार्यों के लिए अशुभ`);
    }
  }

  // Calculate overall rating
  let overall: 'good' | 'neutral' | 'avoid';
  if (score >= 70) {
    overall = 'good';
  } else if (score >= 40) {
    overall = 'neutral';
  } else {
    overall = 'avoid';
  }

  // Remove duplicates
  const unique = (arr: string[]) => Array.from(new Set(arr));
  const uniqueHindi = (arr: string[]) => Array.from(new Set(arr));

  return {
    overall,
    score: Math.max(0, Math.min(100, score)),
    goodFor: unique(goodFor),
    goodForHindi: uniqueHindi(goodForHindi),
    avoid: unique(avoid),
    avoidHindi: uniqueHindi(avoidHindi),
    neutral: unique(neutral),
    neutralHindi: uniqueHindi(neutralHindi),
    reasons: unique(reasons),
    reasonsHindi: unique(reasonsHindi),
    muhurtaStatus: {
      rahuKaal: isRahuKaal,
      yamagandam: isYamagandam,
      gulikaKaal: isGulikaKaal,
      abhijitMuhurta: isAbhijitMuhurta,
    },
  };
};

/**
 * Check if current time is within a time range
 */
const isTimeInRange = (time: Date, range: TimeRange): boolean => {
  return time >= range.start && time <= range.end;
};

/**
 * Calculate Abhijit Muhurta (approximately mid-day)
 */
export const calculateAbhijitMuhurta = (
  sunrise: Date,
  sunset: Date
): TimeRange => {
  const dayDuration = sunset.getTime() - sunrise.getTime();
  const midDay = new Date(sunrise.getTime() + dayDuration / 2);
  
  // Abhijit Muhurta is approximately 48 minutes around midday
  const start = new Date(midDay.getTime() - 24 * 60 * 1000);
  const end = new Date(midDay.getTime() + 24 * 60 * 1000);

  return { start, end };
};

/**
 * Get simplified guidance text for UI display
 */
export const getGuidanceSummary = (guidance: GuidanceResult): string => {
  if (guidance.overall === 'good') {
    return 'Auspicious time for most activities';
  } else if (guidance.overall === 'neutral') {
    return 'Moderate time - use discretion';
  } else {
    return 'Inauspicious - avoid important work';
  }
};

export const getGuidanceSummaryHindi = (guidance: GuidanceResult): string => {
  if (guidance.overall === 'good') {
    return 'अधिकांश गतिविधियों के लिए शुभ समय';
  } else if (guidance.overall === 'neutral') {
    return 'मध्यम समय - विवेक का प्रयोग करें';
  } else {
    return 'अशुभ - महत्वपूर्ण कार्य से बचें';
  }
};

/**
 * Get color code for guidance
 */
export const getGuidanceColor = (guidance: GuidanceResult): string => {
  if (guidance.overall === 'good') return '#3D6B24'; // Green
  if (guidance.overall === 'neutral') return '#E8944A'; // Orange
  return '#DC2626'; // Red
};
