/**
 * Sunrise/Sunset Calculations
 * Why: Accurate sunrise/sunset times based on location for panchang
 * Algorithm: SPA (Solar Position Algorithm) - simplified version
 */

import { GeoLocation } from '../types';
import { J2000 } from './constants';
import { 
  getJulianDay, 
  toRadians, 
  toDegrees, 
  sinDeg, 
  cosDeg, 
  tanDeg,
  atan2Deg,
  normalizeAngle,
  addMinutes
} from './utils';

// Atmospheric refraction at horizon (degrees)
// Standard value: 0.8333° for sea level
// This combines:
// - 0.5667° average atmospheric refraction
// - 0.2667° for Sun's apparent radius
// Source: Jean Meeus "Astronomical Algorithms" Chapter 15
const ATMOSPHERIC_REFRACTION = 0.8333;

// Atmospheric refraction reduction factor per kilometer of elevation
// At higher altitudes, atmospheric pressure decreases, reducing refraction
// Each kilometer reduces refraction by approximately 11%
// Source: NOAA Solar Position Calculator documentation
const REFRACTION_REDUCTION_PER_KM = 0.11;

// Earth's obliquity of the ecliptic for J2000.0 epoch
const ECLIPTIC_OBLIQUITY = 23.4397;

/**
 * Calculate atmospheric refraction adjustment based on elevation
 * Why: At higher altitudes, reduced atmospheric pressure decreases refraction
 * @param elevation Elevation in meters above sea level
 * @returns Adjusted refraction in degrees
 */
export function getElevationAdjustedRefraction(elevation: number = 0): number {
  // Convert elevation from meters to kilometers
  const elevationKm = elevation / 1000;
  
  // Calculate refraction reduction factor
  // Each kilometer reduces refraction by REFRACTION_REDUCTION_PER_KM
  const reductionFactor = 1 - (REFRACTION_REDUCTION_PER_KM * elevationKm);
  
  // Apply minimum bounds - never reduce by more than 25%
  // At very high elevations (>2km), refraction approaches 0.5° but doesn't go to zero
  const clampedFactor = Math.max(0.75, Math.min(1.0, reductionFactor));
  
  return ATMOSPHERIC_REFRACTION * clampedFactor;
}

/**
 * Calculate the Sun's equation of time
 * Why: Accounts for the difference between apparent and mean solar time
 */
function getEquationOfTime(julianCenturies: number): number {
  // L0 = 280.46646 + 36000.76983*T + 0.0003032*T^2
  const L0 = normalizeAngle(280.46646 + 36000.76983 * julianCenturies + 0.0003032 * julianCenturies * julianCenturies);
  
  // M = 357.52911 + 35999.05029*T - 0.0001537*T^2
  const M = normalizeAngle(357.52911 + 35999.05029 * julianCenturies - 0.0001537 * julianCenturies * julianCenturies);
  
  // e = 0.016708634 - 0.000042037*T - 0.0000001267*T^2
  const e = 0.016708634 - 0.000042037 * julianCenturies - 0.0000001267 * julianCenturies * julianCenturies;
  
  // C = (1.914602 - 0.004817*T - 0.000014*T^2) * sin(M)
  //    + (0.019993 - 0.000101*T) * sin(2*M)
  //    + 0.000289 * sin(3*M)
  const C = (1.914602 - 0.004817 * julianCenturies - 0.000014 * julianCenturies * julianCenturies) * sinDeg(M)
          + (0.019993 - 0.000101 * julianCenturies) * sinDeg(2 * M)
          + 0.000289 * sinDeg(3 * M);
  
  // Sun's true longitude
  const lambda = L0 + C;
  
  // Sun's apparent longitude
  const omega = 125.04 - 1934.136 * julianCenturies;
  const lambdaApparent = lambda - 0.00569 - 0.00478 * sinDeg(omega);
  
  // Right ascension of the Sun
  const alpha = toDegrees(Math.atan2(cosDeg(ECLIPTIC_OBLIQUITY) * sinDeg(lambdaApparent), cosDeg(lambdaApparent)));

  // Equation of time in minutes.
  // The raw difference must be wrapped to [-180, 180] so E stays within ±30 min.
  // Without this, dates where L0 and RA straddle 0°/360° yield E off by ±1440 min
  // (a whole day), silently shifting the resulting Date via setHours rollover.
  const diff = ((L0 - normalizeAngle(alpha) + 540) % 360) - 180;
  const E = 4 * diff;

  return E;
}

/**
 * Calculate the Sun's declination
 */
function getSunDeclination(julianCenturies: number): number {
  // L0 = 280.46646 + 36000.76983*T + 0.0003032*T^2
  const L0 = normalizeAngle(280.46646 + 36000.76983 * julianCenturies + 0.0003032 * julianCenturies * julianCenturies);
  
  // M = 357.52911 + 35999.05029*T - 0.0001537*T^2
  const M = normalizeAngle(357.52911 + 35999.05029 * julianCenturies - 0.0001537 * julianCenturies * julianCenturies);
  
  // C = (1.914602 - 0.004817*T - 0.000014*T^2) * sin(M)
  //    + (0.019993 - 0.000101*T) * sin(2*M)
  //    + 0.000289 * sin(3*M)
  const C = (1.914602 - 0.004817 * julianCenturies - 0.000014 * julianCenturies * julianCenturies) * sinDeg(M)
          + (0.019993 - 0.000101 * julianCenturies) * sinDeg(2 * M)
          + 0.000289 * sinDeg(3 * M);
  
  // Sun's true longitude
  const lambda = L0 + C;
  
  // Sun's apparent longitude
  const omega = 125.04 - 1934.136 * julianCenturies;
  const lambdaApparent = lambda - 0.00569 - 0.00478 * sinDeg(omega);
  
  // Declination
  const delta = toDegrees(Math.asin(sinDeg(ECLIPTIC_OBLIQUITY) * sinDeg(lambdaApparent)));
  
  return delta;
}

/**
 * Calculate hour angle for sunrise/sunset
 * Why: Determines when the Sun crosses the horizon
 * @param latitude Observer's latitude in degrees
 * @param declination Sun's declination in degrees
 * @param altitude Sun's altitude at horizon (negative for refraction, typically -0.8333°)
 * @param elevation Observer's elevation in meters above sea level (default 0 for sea level)
 */
function getHourAngle(latitude: number, declination: number, altitude: number = -ATMOSPHERIC_REFRACTION, elevation: number = 0): number {
  const latRad = toRadians(latitude);
  const decRad = toRadians(declination);
  
  // Apply elevation-based correction to atmospheric refraction
  const adjustedRefraction = getElevationAdjustedRefraction(elevation);
  const adjustedAltitude = altitude === -ATMOSPHERIC_REFRACTION ? -adjustedRefraction : altitude;
  const altRad = toRadians(adjustedAltitude);

  // cos(H) = (sin(alt) - sin(lat)*sin(dec)) / (cos(lat)*cos(dec))
  const cosH = (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad));

  // Clamp to valid range
  if (cosH > 1) return 0; // Sun never rises
  if (cosH < -1) return 180; // Sun never sets

  return toDegrees(Math.acos(cosH));
}

/**
 * Calculate hour angle for sunrise/sunset with backward compatibility
 * Note: Significantly improves accuracy at high elevations (>1000m)
 */
function getHourAngleLegacy(latitude: number, declination: number, altitude: number = -ATMOSPHERIC_REFRACTION): number {
  return getHourAngle(latitude, declination, altitude, 0); // No elevation correction
}

/**
/**
 * Calculate sunrise time for a given date and location
 * @param date Date for which to calculate sunrise
 * @param location Geographic location with latitude, longitude, and timezone
 * @param elevation Elevation in meters above sea level (optional, default 0)
 * @returns Sunrise time as Date object
 */
export function calculateSunrise(date: Date, location: GeoLocation, elevation: number = 0): Date {
  // Validate location
  if (!location || location.latitude === undefined || location.longitude === undefined) {
    throw new Error('Invalid location: latitude and longitude required');
  }
  if (location.latitude < -90 || location.latitude > 90) {
    throw new Error(`Invalid latitude: ${location.latitude} (must be -90 to +90)`);
  }
  if (location.longitude < -180 || location.longitude > 180) {
    throw new Error(`Invalid longitude: ${location.longitude} (must be -180 to +180)`);
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Timezone and longitude correction (constant for this location)
  const timezoneOffset = getTimezoneOffsetHours(location.timezone);
  const standardMeridian = timezoneOffset * 15;
  const longitudeDiff = location.longitude - standardMeridian;
  const longitudeTimeCorrection = longitudeDiff * 4 / 60; // Hours

  // Julian day at 0h UT for this date, in days since J2000.0.
  // Uses the tested Meeus implementation in utils (verified exact over 1990-2035).
  // NOTE: a previous hand-rolled formula lagged the true JD by ~1 month (30-31
  // days), feeding month-stale E/delta into the calc and causing the seasonal
  // sunrise/sunset drift (up to -47 min sunset, +24 min sunrise vs Drik).
  // Verified 2026-09-10 against Drik 490-day ground truth. Do not regress.
  const jd0 = getJulianDay(new Date(Date.UTC(year, month - 1, day, 0, 0, 0))) - J2000;

  // Iterate solar params to convergence (evaluated at the event time, not midnight).
  // Solar params drift during the day; one pass leaves minutes of error at sunset.
  // SIGN INVARIANTS (verified 2026-09-10 vs Drik 490-day Delhi ground truth,
  // all 490 sunrises/sunsets within ±5 min — see TITHI_VALIDATION_PLAN.md):
  //   hours = solarTime - E/60 - longitudeTimeCorrection
  // - EoT term is MINUS. A prior change (TODO_COMPLETION_SUMMARY.md) flipped it to
  //   plus, injecting a ±29 min seasonal error that month-stale JD partially masked.
  // - Longitude term is MINUS (pre-existing invariant, unchanged).
  // Do not flip either sign without re-verifying against Drik.
  let T = jd0 / 36525;
  let sunriseHours = 0;
  for (let i = 0; i < 5; i++) {
    const E = getEquationOfTime(T);
    const delta = getSunDeclination(T);
    const H = getHourAngle(location.latitude, delta, -ATMOSPHERIC_REFRACTION, elevation);
    const next = (12 - H / 15) - E / 60 - longitudeTimeCorrection;
    if (Math.abs(next - sunriseHours) < 5 / 3600) { sunriseHours = next; break; }
    sunriseHours = next;
    T = (jd0 + (sunriseHours - timezoneOffset) / 24) / 36525;
  }

  return hoursToDate(date, sunriseHours);
}

/**
 * Calculate sunset time for a given date and location
 * @param date Date for which to calculate sunset
 * @param location Geographic location with latitude, longitude, and timezone
 * @param elevation Elevation in meters above sea level (optional, default 0)
 * @returns Sunset time as Date object
 */
export function calculateSunset(date: Date, location: GeoLocation, elevation: number = 0): Date {
  // Validate location
  if (!location || location.latitude === undefined || location.longitude === undefined) {
    throw new Error('Invalid location: latitude and longitude required');
  }
  if (location.latitude < -90 || location.latitude > 90) {
    throw new Error(`Invalid latitude: ${location.latitude} (must be -90 to +90)`);
  }
  if (location.longitude < -180 || location.longitude > 180) {
    throw new Error(`Invalid longitude: ${location.longitude} (must be -180 to +180)`);
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Timezone and longitude correction (constant for this location)
  const timezoneOffset = getTimezoneOffsetHours(location.timezone);
  const standardMeridian = timezoneOffset * 15;
  const longitudeDiff = location.longitude - standardMeridian;
  const longitudeTimeCorrection = longitudeDiff * 4 / 60;

  // Julian day at 0h UT for this date, in days since J2000.0.
  // Same month-stale-JD warning as calculateSunrise above — keep in sync.
  const jd0 = getJulianDay(new Date(Date.UTC(year, month - 1, day, 0, 0, 0))) - J2000;

  // Iterate to convergence (critical for sunset: ~13h from midnight UT means
  // significant solar param drift if evaluated only at midnight).
  let T = jd0 / 36525;
  let sunsetHours = 0;
  for (let i = 0; i < 5; i++) {
    const E = getEquationOfTime(T);
    const delta = getSunDeclination(T);
    const H = getHourAngle(location.latitude, delta, -ATMOSPHERIC_REFRACTION, elevation);
    const next = (12 + H / 15) - E / 60 - longitudeTimeCorrection;
    if (Math.abs(next - sunsetHours) < 5 / 3600) { sunsetHours = next; break; }
    sunsetHours = next;
    T = (jd0 + (sunsetHours - timezoneOffset) / 24) / 36525;
  }

  return hoursToDate(date, sunsetHours);
}

/**
 * Convert hours (decimal) to Date object
 */
function hoursToDate(baseDate: Date, hours: number): Date {
  const result = new Date(baseDate);
  result.setHours(0, 0, 0, 0);
  
  const totalMinutes = hours * 60;
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const s = Math.floor(((hours - h) * 60 - m) * 60);
  
  result.setHours(h, m, s);
  return result;
}

/**
 * Get timezone offset in hours from timezone string
 * Why: Needed for longitude correction calculations
 *
 * Robustness (ritual-grade): the old implementation parsed timeZoneName:'short',
 * which returns locale-dependent abbreviations like "IST" (no numeric offset) in
 * some browsers/ICU builds — silently falling back to 0 and shifting every
 * sunrise/sunset by hours. We now prefer timeZoneName:'shortOffset' ("GMT+5:30",
 * standardized since ECMA-402), evaluate at the TARGET date (DST correctness for
 * non-IST zones), and keep the legacy parse as fallback.
 */
function getTimezoneOffsetHours(timezone: string, refDate?: Date): number {
  const at = refDate ?? new Date();
  const parseOffset = (tzName: string): number | null => {
    const offsetMatch = tzName.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!offsetMatch) return null;
    const sign = offsetMatch[1] === '+' ? 1 : -1;
    const hours = parseInt(offsetMatch[2]);
    const minutes = parseInt(offsetMatch[3] || '0');
    return sign * (hours + minutes / 60);
  };
  try {
    for (const tzNameOpt of ['shortOffset', 'longOffset', 'short'] as const) {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          timeZoneName: tzNameOpt,
          hour: '2-digit',
          hour12: false,
        });
        const parts = formatter.formatToParts(at);
        const tzName = parts.find(p => p.type === 'timeZoneName')?.value || '';
        const parsed = parseOffset(tzName);
        if (parsed !== null) return parsed;
      } catch {
        // Try next timeZoneName style
      }
    }

    // Fallback for common timezone abbreviations
    const fallback: Record<string, number> = {
      'IST': 5.5,
      'Asia/Kolkata': 5.5,
      'EST': -5,
      'America/New_York': -5,
      'PST': -8,
      'America/Los_Angeles': -8,
      'GMT': 0,
      'UTC': 0,
      'Europe/London': 0,
    };
    if (fallback[timezone] !== undefined) return fallback[timezone];
    return 0;
  } catch (e) {
    // Unknown timezone, defaulting to UTC
    return 0;
  }
}

/**
 * Calculate Rahu Kaal (inauspicious period)
 * Why: Important for panchang calculations
 * Each weekday has a specific 90-minute period (1/8th of daytime)
 */
export function calculateRahuKaal(date: Date, sunrise: Date, sunset: Date): { start: Date; end: Date } {
  const weekday = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Day duration in minutes
  const dayDuration = (sunset.getTime() - sunrise.getTime()) / (1000 * 60);
  const partDuration = dayDuration / 8;
  
  // Multipliers for each weekday (which 1/8th part is Rahu Kaal)
  const multipliers: Record<number, number> = {
    0: 7, // Sunday - 8th part
    1: 1, // Monday - 2nd part
    2: 6, // Tuesday - 7th part
    3: 4, // Wednesday - 5th part
    4: 5, // Thursday - 6th part
    5: 3, // Friday - 4th part
    6: 2, // Saturday - 3rd part
  };
  
  const startMinutes = multipliers[weekday] * partDuration;
  
  return {
    start: addMinutes(sunrise, startMinutes),
    end: addMinutes(sunrise, startMinutes + partDuration)
  };
}

/**
 * Calculate Yamagandam (inauspicious period)
 */
export function calculateYamagandam(date: Date, sunrise: Date, sunset: Date): { start: Date; end: Date } {
  const weekday = date.getDay();
  
  const dayDuration = (sunset.getTime() - sunrise.getTime()) / (1000 * 60);
  const partDuration = dayDuration / 8;
  
  const multipliers: Record<number, number> = {
    0: 4, // Sunday
    1: 3, // Monday
    2: 2, // Tuesday
    3: 1, // Wednesday
    4: 7, // Thursday
    5: 6, // Friday
    6: 5, // Saturday
  };
  
  const startMinutes = multipliers[weekday] * partDuration;
  
  return {
    start: addMinutes(sunrise, startMinutes),
    end: addMinutes(sunrise, startMinutes + partDuration)
  };
}

/**
 * Calculate Gulika Kaal (inauspicious period)
 */
export function calculateGulikaKaal(date: Date, sunrise: Date, sunset: Date): { start: Date; end: Date } {
  const weekday = date.getDay();
  
  const dayDuration = (sunset.getTime() - sunrise.getTime()) / (1000 * 60);
  const partDuration = dayDuration / 8;
  
  const multipliers: Record<number, number> = {
    0: 6, // Sunday
    1: 5, // Monday
    2: 4, // Tuesday
    3: 3, // Wednesday
    4: 2, // Thursday
    5: 1, // Friday
    6: 7, // Saturday
  };
  
  const startMinutes = multipliers[weekday] * partDuration;
  
  return {
    start: addMinutes(sunrise, startMinutes),
    end: addMinutes(sunrise, startMinutes + partDuration)
  };
}
