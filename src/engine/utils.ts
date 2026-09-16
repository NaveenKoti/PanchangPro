/**
 * Astronomical Utility Functions
 * Why: Helper functions for date conversions and math operations
 */

import { J2000 } from './constants';

/**
 * Convert degrees to radians
 */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Normalize angle to 0-360 range
 */
export function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) normalized += 360;
  return normalized;
}

/**
 * Calculate Julian Day Number from Date
 * Why: Julian Day is the standard for astronomical calculations
 * Algorithm: Based on Jean Meeus "Astronomical Algorithms"
 */
export function getJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // 1-12
  const day = date.getUTCDate();
  
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  
  let julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) 
                  - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  // Add fractional day
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const fractionalDay = (hours - 12 + minutes / 60 + seconds / 3600) / 24;
  
  return julianDay + fractionalDay;
}

/**
 * Convert Julian Day to Date
 */
export function fromJulianDay(julianDay: number): Date {
  const jd = julianDay + 0.5;
  const z = Math.floor(jd);
  const f = jd - z;
  
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  
  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  
  // Convert fractional day to time
  const totalSeconds = f * 86400;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  return new Date(Date.UTC(year, month - 1, day, hours + 12, minutes, seconds));
}

/**
 * Calculate Julian Centuries since J2000.0
 */
export function getJulianCenturies(julianDay: number): number {
  return (julianDay - J2000) / 36525;
}

/**
 * Interpolate between two values
 */
export function interpolate(y1: number, y2: number, n: number): number {
  return y1 + n * (y2 - y1);
}

/**
 * Calculate sine of angle in degrees
 */
export function sinDeg(degrees: number): number {
  return Math.sin(toRadians(degrees));
}

/**
 * Calculate cosine of angle in degrees
 */
export function cosDeg(degrees: number): number {
  return Math.cos(toRadians(degrees));
}

/**
 * Calculate tangent of angle in degrees
 */
export function tanDeg(degrees: number): number {
  return Math.tan(toRadians(degrees));
}

/**
 * Calculate arcsine, result in degrees
 */
export function asinDeg(value: number): number {
  return toDegrees(Math.asin(value));
}

/**
 * Calculate arccosine, result in degrees
 */
export function acosDeg(value: number): number {
  return toDegrees(Math.acos(value));
}

/**
 * Calculate arctangent, result in degrees
 */
export function atanDeg(value: number): number {
  return toDegrees(Math.atan(value));
}

/**
 * Calculate arctangent2, result in degrees
 */
export function atan2Deg(y: number, x: number): number {
  return toDegrees(Math.atan2(y, x));
}

/**
 * Round to specified decimal places
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Convert local time to UT (Universal Time)
 * Why: Astronomical calculations use UT
 */
export function localToUT(date: Date, timezoneOffset: number): Date {
  // timezoneOffset in minutes (e.g., IST = +330 minutes = +5:30)
  return new Date(date.getTime() - timezoneOffset * 60000);
}

/**
 * Convert UT to local time
 */
export function utToLocal(date: Date, timezoneOffset: number): Date {
  return new Date(date.getTime() + timezoneOffset * 60000);
}

/**
 * Get timezone offset in minutes for a given date
 */
export function getTimezoneOffset(date: Date, timezone: string): number {
  // For now, return fixed offset. In real app, use Intl.DateTimeFormat
  const offsets: Record<string, number> = {
    'Asia/Kolkata': 330,     // IST +5:30
    'Asia/Dubai': 240,       // +4:00
    'Asia/Singapore': 480,   // +8:00
    'America/New_York': -300, // EST -5:00
    'America/Los_Angeles': -480, // PST -8:00
    'Europe/London': 0,      // GMT
    'UTC': 0,
  };
  return offsets[timezone] || 0;
}

/**
 * Format time difference as readable string
 * Why: For showing countdowns (e.g., "Ends in 23 minutes")
 */
export function formatTimeRemaining(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ''}`;
  }
  
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}

/**
 * Check if two dates are the same calendar day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Subtract days from a date
 */
export function subDays(date: Date, days: number): Date {
  return addDays(date, -days);
}

/**
 * Add minutes to a date
 */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

/**
 * Subtract minutes from a date
 */
export function subMinutes(date: Date, minutes: number): Date {
  return addMinutes(date, -minutes);
}

/**
 * Check if a date falls within an interval
 */
export function isWithinInterval(date: Date, interval: { start: Date; end: Date }): boolean {
  return date >= interval.start && date <= interval.end;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

/**
 * Clamp a number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
