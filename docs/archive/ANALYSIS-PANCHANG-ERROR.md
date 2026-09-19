# Panchang Calculation Error Analysis

## Problem Statement
The app shows **Ekadashi on April 14, 2026**, but it should be on **April 13, 2026** according to Drik Panchang and traditional Hindu calendars.

## Root Cause: Tithi Calculation at Wrong Time

### The Issue
The current engine calculates tithi at **midnight (00:00:00)** instead of at **sunrise**.

**Location**: `/src/engine/panchang.ts`, line ~100 in `calculate()` method:
```typescript
const localDate = new Date(date);
localDate.setHours(0, 0, 0, 0);  // ← Sets to midnight

// Then calculates tithi using this midnight time
const sunLongitude = toSidereal(getSunLongitude(localDate), ayanamsa);
const moonLongitude = toSidereal(getMoonLongitude(localDate), ayanamsa);
const tithiIndex = calculateTithiIndex(sunLongitude, moonLongitude);
```

### Why This Is Wrong

In the **Hindu calendar system**, the tithi for a day is determined by the **tithi present at SUNRISE** (called **Udaya Tithi**), not at midnight. This is a fundamental principle of Hindu calendar calculations.

**Rules for Tithi Assignment**:
1. The tithi that is **running at sunrise** determines the tithi for that day
2. If a tithi **begins after sunrise** but before next sunrise, it belongs to the current day
3. If a tithi **ends before sunrise**, it may cause **kshaya** (loss) of that tithi - meaning that tithi doesn't get a day assigned
4. If a tithi **spans two sunrises**, it causes **vriddhi** (increase) - the same tithi appears on consecutive days

### Evidence from Test Data

**April 13, 2026 (Bangalore)**:
- **At Midnight (00:00)**: Tithi = Krishna Paksha Dashami (#10) ❌
- **At Sunrise (05:30)**: Tithi = Krishna Paksha Ekadashi (#11) ✅
- **Engine Reports**: Krishna Dashami (#10) ← **WRONG**

**April 14, 2026 (Bangalore)**:
- **At Midnight (00:00)**: Tithi = Krishna Paksha Ekadashi (#11) ❌
- **At Sunrise (05:30)**: Tithi = Krishna Paksha Dwadashi (#12) ✅
- **Engine Reports**: Krishna Ekadashi (#11) ← **WRONG**

**Conclusion**: The Ekadashi tithi **begins** between midnight and sunrise on April 13th. Since the engine checks at midnight, it sees Dashami and assigns April 13 as Dashami. But the correct method (checking at sunrise) would show Ekadashi is running at sunrise, making April 13 the Ekadashi day.

## What's Missing in the Current Implementation

### 1. **No Tithi at Sunrise Calculation**
The engine calculates tithi at midnight instead of sunrise.

**File**: `/src/engine/panchang.ts`, `calculate()` method
```typescript
// CURRENT (WRONG):
const localDate = new Date(date);
localDate.setHours(0, 0, 0, 0);  // Midnight
const sunLongitude = getSunLongitude(localDate);  // At midnight

// SHOULD BE:
const sunrise = calculateSunrise(localDate, this.location);
const sunLongitude = getSunLongitude(sunrise);  // At sunrise
const moonLongitude = getMoonLongitude(sunrise);  // At sunrise
```

### 2. **No Tithi Boundary Calculation**
The engine doesn't calculate when a tithi **starts** or **ends**. This is needed for:
- Detecting **kshaya tithi** (when a tithi is skipped)
- Detecting **vriddhi tithi** (when a tithi spans two days)
- Showing accurate tithi start/end times in the UI

**Current code** (in `calculateTithi()` method, line ~232):
```typescript
// Estimate start/end times (simplified)
// In a full implementation, we would iterate to find exact change times
const tithiDuration = (24 * 60 * 60 * 1000) / 30; // ~48 minutes per tithi degree
const endTime = addMinutes(date, fractionRemaining * 720); // Rough estimate
```

This is a **rough approximation**. The actual tithi duration varies because:
- Moon's speed is not constant (elliptical orbit)
- Sun also moves (~1 degree per day)
- Tithi = (Moon longitude - Sun longitude) / 12 degrees

### 3. **No Kshaya/Vriddhi Detection**
The engine has fields for these but always sets them to `false`:
```typescript
return {
  // ...
  isKshaya: false, // Would require checking adjacent days
  isVriddhi: false
};
```

To detect these, you need to:
1. Calculate tithi at sunrise for day N
2. Calculate tithi at sunrise for day N+1
3. Compare to see if any tithi was skipped or repeated

### 4. **Simplified Moon Position Algorithm**
The current moon position calculation uses only ~35 perturbation terms from Meeus Chapter 47. The full algorithm has **60+ terms**. This can cause errors of **0.5-1 degree** in Moon position, which translates to **~1-2 hours** in tithi timing.

**File**: `/src/engine/astronomy.ts`, `getMoonLongitude()` function

### 5. **No Iterative Tithi Change Time Calculation**
To find the **exact time** when a tithi changes, you need to:
1. Calculate Moon-Sun difference at time T
2. Iterate forward in small increments (e.g., 1 minute)
3. Check when `(moonLongitude - sunLongitude) / 12` crosses an integer boundary

The current implementation uses a simple fraction estimate which can be off by **hours**.

## Impact on Accuracy

### Tithi Date Errors
- **Ekadashi, Trayodashi, Purnima, Amavasya** can all be off by 1 day
- This affects **festival detection**, **fasting day detection**, and **auspicious timing** calculations
- Error occurs when tithi changes near sunrise (between 00:00 and ~06:00)

### Tithi Time Errors
- Tithi start/end times shown in UI can be off by **±90 minutes** (as noted in test tolerances)
- This affects muhurta calculations and panchang display

### Festival Detection Errors
Festivals that depend on specific tithi + nakshatra combinations can be assigned to wrong dates:
- Ekadashi (all 24 occurrences per year)
- Pradosh Vrat (Trayodashi)
- Purnima festivals
- Amavasya festivals
- Chaturthi (Sankashti)

## Solutions Required

### **Critical Fix** (Must Do)
1. **Calculate tithi at sunrise, not midnight**
   - Change `calculate()` method to use sunrise time for tithi calculation
   - This will fix the 1-day offset error for Ekadashi and other tithis

2. **Implement iterative tithi boundary calculation**
   - Find exact time when tithi changes by iterating in small time steps
   - Use binary search or Newton's method for efficiency
   - This will fix tithi start/end time accuracy

### **Important Fix** (Should Do)
3. **Detect kshaya and vriddhi tithis**
   - Compare tithi at sunrise for consecutive days
   - Mark tithis as kshaya (skipped) or vriddhi (doubled)

4. **Improve Moon position calculation**
   - Add remaining perturbation terms from Meeus Chapter 47 (full 60+ terms)
   - Or integrate a proper ephemeris library (e.g., Swiss Ephemeris, AstroJS)

### **Nice to Have** (Optional)
5. **Implement full festival detection with tithi boundaries**
   - Some festivals require specific tithi to be present during specific parts of the day
   - Example: Maha Shivaratri requires Chaturdashi to be present during both day and night

6. **Add timezone-aware calculations**
   - Currently uses simplified timezone offset table
   - Should use full IANA timezone database for accuracy worldwide

## Files That Need Changes

### Primary Files
- `/src/engine/panchang.ts` - Main calculation engine (CRITICAL)
- `/src/engine/astronomy.ts` - Moon/Sun position algorithms (IMPORTANT)
- `/src/engine/utils.ts` - Add binary search / iteration utilities

### Secondary Files
- `/src/engine/__tests__/referenceData.ts` - Update test tolerances after fixes
- `/src/data/festivals.ts` - May need updates if festival detection logic changes
- `/src/data/fastings.ts` - May need updates if fasting detection logic changes

### Test Files to Add
- `/src/engine/__tests__/tithi-boundaries.test.ts` - Test exact tithi change times
- `/src/engine/__tests__/kshaya-vriddhi.test.ts` - Test skipped/doubled tithis
- `/src/engine/__tests__/ekadashi-2026.test.ts` - Test known Ekadashi dates in 2026

## References

### Algorithms
- **Jean Meeus, "Astronomical Algorithms"** (2nd Edition)
  - Chapter 25: Solar Coordinates
  - Chapter 47: Lunar Coordinates (full 60+ terms)
  - Chapter 48: Illuminated Fraction of Moon's Disk

- **Hindu Calendar Algorithms**:
  - Udaya Tithi (Tithi at Sunrise) principle
  - Kshaya Tithi detection
  - Vriddhi Tithi detection

### Verification Sources
- **Drik Panchang**: https://www.drikpanchang.com
- **Prokerala Panchang**: https://www.prokerala.com
- **MyPanchang**: https://www.mypanchang.com

### Example: Kamada Ekadashi 2026
- **Drik Panchang**: April 13, 2026
- **Current Engine**: April 14, 2026 ❌
- **After Fix**: Should show April 13, 2026 ✅

## Summary

The **primary issue** is that the engine calculates tithi at **midnight** instead of **sunrise**. This causes a 1-day offset when tithis change during the night/early morning hours.

**Secondary issues** include simplified tithi boundary calculations, incomplete Moon position algorithm, and no kshaya/vriddhi detection.

**Fix priority**:
1. 🚨 **CRITICAL**: Change tithi calculation to use sunrise time
2. 🔴 **HIGH**: Implement iterative tithi boundary calculation
3. 🟡 **MEDIUM**: Add kshaya/vriddhi detection
4. 🟢 **LOW**: Improve Moon position accuracy (add more terms)

The fix for #1 alone will resolve most of the Ekadashi date errors.
