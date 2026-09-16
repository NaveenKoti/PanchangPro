/**
 * Astronomical Constants for Panchang Calculations
 * Why: Precise constants ensure accurate tithi calculations
 * Source: Based on Jean Meeus "Astronomical Algorithms"
 */

// Tithi names
export const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

export const TITHI_NAMES_HINDI = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी',
  'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी',
  'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा/अमावस्या'
];

// Nakshatra names
export const NAKSHATRA_NAMES = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
];

export const NAKSHATRA_NAMES_HINDI = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा',
  'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा',
  'पूर्व फाल्गुनी', 'उत्तर फाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति',
  'विशाखा', 'अनुराधा', 'ज्येष्ठा', 'मूल', 'पूर्वाषाढ़ा',
  'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वभाद्रपदा',
  'उत्तरभाद्रपदा', 'रेवती'
];

// Yoga names
export const YOGA_NAMES = [
  'Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva',
  'Siddha', 'Sadhyaya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

export const YOGA_NAMES_HINDI = [
  'विष्कुंभ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभना',
  'अतिगण्ड', 'सुकर्मा', 'धृति', 'शूल', 'गण्ड',
  'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र',
  'सिद्धि', 'व्यतिपात', 'वरीयान', 'परिघ', 'शिव',
  'सिद्ध', 'साध्याय', 'शुभ', 'शुक्ल', 'ब्रह्म',
  'इन्द्र', 'वैधृत'
];

// Karana names
export const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara',
  'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga',
  'Kimstughna'
];

export const KARANA_NAMES_HINDI = [
  'बव', 'बालव', 'कौलव', 'तैतिल', 'गर',
  'वणिज', 'विष्णु', 'शकुनि', 'चतुष्पद', 'नाग',
  'किंस्तुघ्न'
];

// Var (weekday) names
export const VAR_NAMES = [
  'Ravivar', 'Somvar', 'Mangalvar', 'Budhvar', 'Guruvar', 'Shukravar', 'Shanivar'
];

export const VAR_NAMES_HINDI = [
  'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'
];

// Lunar month names
export const LUNAR_MONTHS = [
  'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana',
  'Bhadrapada', 'Ashwin', 'Kartika', 'Margashirsha', 'Pausha',
  'Magha', 'Phalguna'
];

export const LUNAR_MONTHS_HINDI = [
  'चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण',
  'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष',
  'माघ', 'फाल्गुन'
];

// Dinacharya phases
export const DINACHARYA_PHASES = [
  {
    id: 'brahma-muhurta',
    name: 'Brahma Muhurta',
    nameHindi: 'ब्रह्म मुहूर्त',
    startOffset: -96, // 96 minutes before sunrise
    endOffset: 0,     // Sunrise
    dosha: 'vata' as const,
    activities: [
      'Wake up',
      'Drink warm water',
      'Meditate',
      'Plan your day'
    ],
    description: 'Most auspicious time for spiritual practices. Mind is calm and receptive.'
  },
  {
    id: 'pratah-kala',
    name: 'Pratah Kala',
    nameHindi: 'प्रातः काल',
    startOffset: 0,   // Sunrise
    endOffset: 240,   // 4 hours after sunrise (10 AM)
    dosha: 'kapha' as const,
    activities: [
      'Exercise or yoga',
      'Bath',
      'Breakfast (light)',
      'Begin work'
    ],
    description: 'Time for physical activity and starting the day\'s tasks.'
  },
  {
    id: 'madhyahna',
    name: 'Madhyahna',
    nameHindi: 'मध्याह्न',
    startOffset: 240,  // 10 AM
    endOffset: 420,    // 2 PM (7 hours after sunrise)
    dosha: 'pitta' as const,
    activities: [
      'Heavy work',
      'Important meetings',
      'Lunch (heaviest meal)',
      'Decision making'
    ],
    description: 'Digestive fire is strongest. Best time for heavy meals and intense work.'
  },
  {
    id: 'aparahna',
    name: 'Aparahna',
    nameHindi: 'अपराह्न',
    startOffset: 420,  // 2 PM
    endOffset: 600,    // 6 PM (10 hours after sunrise)
    dosha: 'vata' as const,
    activities: [
      'Creative work',
      'Learning',
      'Light tasks',
      'Evening snack'
    ],
    description: 'Creative energy is high. Good for innovation and learning.'
  },
  {
    id: 'sandhya-kala',
    name: 'Sandhya Kala',
    nameHindi: 'संध्या काल',
    startOffset: 600,  // 6 PM
    endOffset: 720,    // Sunset (approximate)
    dosha: 'kapha' as const,
    activities: [
      'Evening prayers (Sandhya Vandana)',
      'Light walk',
      'Dinner (light)',
      'Family time'
    ],
    description: 'Transition time. Good for spiritual practices and winding down.'
  },
  {
    id: 'ratri',
    name: 'Ratri',
    nameHindi: 'रात्रि',
    startOffset: 720,  // Sunset
    endOffset: 1320,   // 10 PM (4 hours after sunset)
    dosha: 'pitta' as const,
    activities: [
      'Relaxation',
      'Light reading',
      'Sleep by 10 PM',
      'Avoid heavy meals'
    ],
    description: 'Time for rest and rejuvenation. Sleep is deepest before midnight.'
  }
];

// Astronomical constants
export const ASTRONOMICAL = {
  // Earth's orbital parameters
  ECLIPTIC_OBLIQUITY: 23.4397, // degrees
  
  // Moon's orbital parameters
  MOON_MEAN_LONGITUDE: 0, // degrees at epoch
  MOON_MEAN_ANOMALY: 0, // degrees at epoch
  MOON_MEAN_ELONGATION: 0, // degrees at epoch
  
  // Sun's orbital parameters
  SUN_MEAN_LONGITUDE: 0, // degrees at epoch
  
  // Constants for calculations
  LUNAR_MONTH: 29.53058868, // days
  SIDEREAL_YEAR: 365.256363, // days
  
  // Nakshatra span
  NAKSHATRA_SPAN: 360 / 27, // 13.333... degrees
  
  // Tithi span
  TITHI_SPAN: 12, // degrees (360/30)
  
  // Yoga span
  YOGA_SPAN: 360 / 27, // 13.333... degrees
  
  // Karana span
  KARANA_SPAN: 6, // degrees (360/60, but only 11 unique)
};

// Rahu Kaal multipliers (1/8th of daytime, varies by weekday)
// Sunday: 8th part, Monday: 2nd part, Tuesday: 7th part, etc.
export const RAHU_KAAL_MULTIPLIER: Record<number, number> = {
  0: 7/8, // Sunday (8th part)
  1: 1/8, // Monday (2nd part)
  2: 6/8, // Tuesday (7th part)
  3: 4/8, // Wednesday (5th part)
  4: 5/8, // Thursday (6th part)
  5: 3/8, // Friday (4th part)
  6: 2/8, // Saturday (3rd part)
};

// Yamagandam multipliers
export const YAMAGANDAM_MULTIPLIER: Record<number, number> = {
  0: 4/8, // Sunday
  1: 3/8, // Monday
  2: 2/8, // Tuesday
  3: 1/8, // Wednesday
  4: 7/8, // Thursday
  5: 6/8, // Friday
  6: 5/8, // Saturday
};

// Gulika Kaal multipliers
export const GULIKA_KAAL_MULTIPLIER: Record<number, number> = {
  0: 6/8, // Sunday
  1: 5/8, // Monday
  2: 4/8, // Tuesday
  3: 3/8, // Wednesday
  4: 2/8, // Thursday
  5: 1/8, // Friday
  6: 7/8, // Saturday
};

// Julian Day epoch (January 1, 2000, 12:00 TT)
export const J2000 = 2451545.0;
