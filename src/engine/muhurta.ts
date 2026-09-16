/**
 * Muhurta/Choghadiya Calculation Engine
 * Why: Implements Vedic time-keeping system that divides day/night into auspicious/inauspicious periods
 * 
 * Choghadiya system divides day (sunrise to sunset) and night (sunset to next sunrise) 
 * into 8 equal parts each. The sequence of choghadiyas varies by day of the week.
 * 
 * Weekday starting choghadiyas:
 * - Sunday: Udveg
 * - Monday: Amrit
 * - Tuesday: Rog
 * - Wednesday: Labh
 * - Thursday: Shubh
 * - Friday: Char
 * - Saturday: Kaal
 */

export type MuhurtaType = 'Amrit' | 'Shubh' | 'Labh' | 'Char' | 'Rog' | 'Kaal' | 'Udveg';
export type MuhurtaPeriod = 'day' | 'night';

export interface Muhurta {
  name: MuhurtaType;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  isAuspicious: boolean;
}

// Sequence of choghadiyas in order
const CHOGHADIYA_SEQUENCE: MuhurtaType[] = [
  'Amrit', 'Shubh', 'Labh', 'Char', 'Rog', 'Kaal', 'Udveg'
];

// Mapping of weekday to starting choghadiya for day period
const DAY_STARTING_MUHURTA: Record<number, MuhurtaType> = {
  0: 'Udveg', // Sunday
  1: 'Amrit', // Monday
  2: 'Rog',   // Tuesday
  3: 'Labh',  // Wednesday
  4: 'Shubh', // Thursday
  5: 'Char',  // Friday
  6: 'Kaal',  // Saturday
};

// Mapping of weekday to starting choghadiya for night period
// Night sequence starts 4 positions ahead in the cycle from day start
const NIGHT_STARTING_MUHURTA: Record<number, MuhurtaType> = {
  0: 'Shubh', // Sunday night
  1: 'Char',  // Monday night
  2: 'Kaal',  // Tuesday night
  3: 'Udveg', // Wednesday night
  4: 'Amrit', // Thursday night
  5: 'Rog',   // Friday night
  6: 'Labh',  // Saturday night
};

// Auspiciousness mapping
const MUHURTA_AUSPICIOUSNESS: Record<MuhurtaType, boolean> = {
  'Amrit': true,  // Nectar - most auspicious
  'Shubh': true,  // Good - auspicious
  'Labh': true,   // Profit - auspicious
  'Char': true,   // Moving - neutral/auspicious for travel
  'Rog': false,   // Disease - inauspicious
  'Kaal': false,  // Death - inauspicious
  'Udveg': false, // Anxiety - inauspicious
};

// Color mapping for UI
const MUHURTA_COLORS: Record<MuhurtaType, string> = {
  'Amrit': '#3D6B24', // Green - most auspicious
  'Shubh': '#3D6B24', // Light green
  'Labh': '#3D6B24',  // Lime - profit
  'Char': '#2C3E6B',  // Cyan - good for travel
  'Rog': '#DC2626',   // Red - disease
  'Kaal': '#2C3E6B',  // Purple - death
  'Udveg': '#E8944A', // Orange - anxiety
};

// Hindi names for choghadiyas
export const MUHURTA_NAMES_HINDI: Record<MuhurtaType, string> = {
  'Amrit': 'अमृत',
  'Shubh': 'शुभ',
  'Labh': 'लाभ',
  'Char': 'चर',
  'Rog': 'रोग',
  'Kaal': 'काल',
  'Udveg': 'उद्वेग',
};

// Sanskrit names for choghadiyas
export const MUHURTA_NAMES_SANSKRIT: Record<MuhurtaType, string> = {
  'Amrit': 'अमृतम्',
  'Shubh': 'शुभम्',
  'Labh': 'लाभः',
  'Char': 'चरः',
  'Rog': 'रोगः',
  'Kaal': 'कालः',
  'Udveg': 'उद्वेगः',
};

/**
 * Get the starting index of a muhurta type in the sequence
 */
function getMuhurtaIndex(type: MuhurtaType): number {
  return CHOGHADIYA_SEQUENCE.indexOf(type);
}

/**
 * Get the muhurta type at a given index in the sequence
 * Handles wrap-around using modulo
 */
function getMuhurtaAtIndex(index: number): MuhurtaType {
  const normalizedIndex = ((index % 7) + 7) % 7;
  return CHOGHADIYA_SEQUENCE[normalizedIndex];
}

/**
 * Calculate choghadiyas for day and night periods
 * @param date - The date for calculation
 * @param sunrise - Sunrise time
 * @param sunset - Sunset time
 * @returns Object containing day and night choghadiya arrays
 */
export function calculateChoghadiyas(
  date: Date,
  sunrise: Date,
  sunset: Date
): { day: Muhurta[]; night: Muhurta[] } {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate day choghadiyas (sunrise to sunset)
  const dayChoghadiyas = calculateDayChoghadiyas(sunrise, sunset, dayOfWeek);
  
  // Calculate night choghadiyas (sunset to next sunrise)
  // For next sunrise, we estimate it as 12 hours after sunset (approximation)
  // In a real implementation, this would be calculated for the next day
  const nextSunrise = new Date(sunset);
  nextSunrise.setHours(nextSunrise.getHours() + 12);
  const nightChoghadiyas = calculateNightChoghadiyas(sunset, nextSunrise, dayOfWeek);
  
  return {
    day: dayChoghadiyas,
    night: nightChoghadiyas,
  };
}

/**
 * Calculate day choghadiyas (sunrise to sunset, divided into 8 parts)
 */
function calculateDayChoghadiyas(
  sunrise: Date,
  sunset: Date,
  dayOfWeek: number
): Muhurta[] {
  const dayDuration = sunset.getTime() - sunrise.getTime();
  const choghadiyaDuration = dayDuration / 8;
  const startingMuhurta = DAY_STARTING_MUHURTA[dayOfWeek];
  const startIndex = getMuhurtaIndex(startingMuhurta);
  
  const muhurtas: Muhurta[] = [];
  
  for (let i = 0; i < 8; i++) {
    const muhurtaType = getMuhurtaAtIndex(startIndex + i);
    const startTime = new Date(sunrise.getTime() + i * choghadiyaDuration);
    const endTime = new Date(sunrise.getTime() + (i + 1) * choghadiyaDuration);
    
    muhurtas.push({
      name: muhurtaType,
      startTime,
      endTime,
      duration: Math.round(choghadiyaDuration / (1000 * 60)), // Convert to minutes
      isAuspicious: MUHURTA_AUSPICIOUSNESS[muhurtaType],
    });
  }
  
  return muhurtas;
}

/**
 * Calculate night choghadiyas (sunset to next sunrise, divided into 8 parts)
 */
function calculateNightChoghadiyas(
  sunset: Date,
  nextSunrise: Date,
  dayOfWeek: number
): Muhurta[] {
  const nightDuration = nextSunrise.getTime() - sunset.getTime();
  const choghadiyaDuration = nightDuration / 8;
  const startingMuhurta = NIGHT_STARTING_MUHURTA[dayOfWeek];
  const startIndex = getMuhurtaIndex(startingMuhurta);
  
  const muhurtas: Muhurta[] = [];
  
  for (let i = 0; i < 8; i++) {
    const muhurtaType = getMuhurtaAtIndex(startIndex + i);
    const startTime = new Date(sunset.getTime() + i * choghadiyaDuration);
    const endTime = new Date(sunset.getTime() + (i + 1) * choghadiyaDuration);
    
    muhurtas.push({
      name: muhurtaType,
      startTime,
      endTime,
      duration: Math.round(choghadiyaDuration / (1000 * 60)), // Convert to minutes
      isAuspicious: MUHURTA_AUSPICIOUSNESS[muhurtaType],
    });
  }
  
  return muhurtas;
}

/**
 * Get the current active choghadiya from a list of muhurtas
 * @param date - Current date/time to check
 * @param muhurtas - Array of muhurtas (either day or night)
 * @returns The currently active muhurta or null if none found
 */
export function getCurrentChoghadiya(date: Date, muhurtas: Muhurta[]): Muhurta | null {
  const currentTime = date.getTime();
  
  for (const muhurta of muhurtas) {
    const startTime = muhurta.startTime.getTime();
    const endTime = muhurta.endTime.getTime();
    
    if (currentTime >= startTime && currentTime < endTime) {
      return muhurta;
    }
  }
  
  return null;
}

/**
 * Get the color for a muhurta type (for UI display)
 * @param type - The muhurta type
 * @returns Color hex code
 */
export function getMuhurtaColor(type: MuhurtaType): string {
  return MUHURTA_COLORS[type];
}

/**
 * Get the Hindi name for a muhurta type
 * @param type - The muhurta type
 * @returns Hindi name
 */
export function getMuhurtaNameHindi(type: MuhurtaType): string {
  return MUHURTA_NAMES_HINDI[type];
}

/**
 * Get the Sanskrit name for a muhurta type
 * @param type - The muhurta type
 * @returns Sanskrit name
 */
export function getMuhurtaNameSanskrit(type: MuhurtaType): string {
  return MUHURTA_NAMES_SANSKRIT[type];
}

/**
 * Format time for display (HH:MM AM/PM)
 * @param date - Date object to format
 * @returns Formatted time string
 */
export function formatMuhurtaTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get description for a muhurta type
 * @param type - The muhurta type
 * @returns Description of the muhurta
 */
export function getMuhurtaDescription(type: MuhurtaType): string {
  const descriptions: Record<MuhurtaType, string> = {
    'Amrit': 'Best time for all auspicious activities. Brings success and prosperity.',
    'Shubh': 'Good for starting new ventures, marriages, and important decisions.',
    'Labh': 'Favorable for business, trade, and profit-making activities.',
    'Char': 'Suitable for travel, movement, and transient activities.',
    'Rog': 'Avoid starting new activities. Good for health-related matters only.',
    'Kaal': 'Inauspicious period. Avoid important decisions and new beginnings.',
    'Udveg': 'Time of anxiety. Avoid conflicts and major undertakings.',
  };
  
  return descriptions[type];
}
