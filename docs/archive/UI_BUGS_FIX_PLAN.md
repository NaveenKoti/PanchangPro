# PanchangPro - Critical UI Bugs & Fix Plan

**Date:** April 9, 2026  
**Priority:** CRITICAL - App not usable in current state  
**Status:** Fixes in Progress

---

## 🐛 Critical Bugs Found

### 1. **Solar Timings Graph Not Visible** ❌
**Severity:** CRITICAL  
**Root Cause:** TodayGuidanceCard.tsx has hardcoded colors that don't adapt to theme
- Line 74-77: `#059669`, `#D97706`, `#DC2626` (Tailwind colors)
- Line 170: `#fff` hardcoded text
- Line 204, 221-222: `#059669` green hardcoded
- Line 240, 257-258: `#DC2626` red hardcoded
- Line 274: `rgba(0,0,0,0.02)` invisible in dark mode

**Impact:** Graph/indicators completely invisible or unreadable

**Fix:** Replace all with `theme.palette.success/warning/error.main`

---

### 2. **Black/White Elements Mixing** ❌
**Severity:** CRITICAL  
**Root Cause:** TodayScreen.css has NO dark mode overrides
- All CSS variables defined only in `:root` (light mode)
- No `:root.dark` block exists
- Backgrounds stay white in dark mode
- Text stays black in dark mode

**Impact:** Blinding white backgrounds on dark mode, invisible text

**Fix:** Add complete `:root.dark { ... }` block with all variable overrides

---

### 3. **Icons Not Visible** ❌
**Severity:** CRITICAL  
**Root Cause:** 
- AyurvedicClock.tsx: `#7C4DFF`, `#F4511E`, `#3D6B24`, `#5C6BC0` hardcoded
- TodayGuidanceCard: Icon colors not theme-aware
- CSS icons use `var(--saffron-500)` which doesn't change in dark mode

**Impact:** All icons invisible or hard to see

**Fix:** Use `theme.palette.primary/secondary/main` for icon colors

---

### 4. **Not Responsive** ⚠️
**Severity:** HIGH  
**Root Cause:**
- TodayScreen.tsx: FAB overlaps bottom nav on small screens
- AyurvedicClock: No responsive breakpoints
- Some sections hide on mobile without alternatives

**Impact:** Poor mobile experience

**Fix:** Add proper responsive breakpoints and mobile alternatives

---

## 🔧 Files That Need Fixing

### Critical (Must Fix Now)
1. ✅ **TodayGuidanceCard.tsx** - Started (theme imported, needs full refactor)
2. ❌ **AyurvedicClock.tsx** - DOSHA_CONFIG hardcoded, 10+ rgba() backgrounds
3. ❌ **TodayScreen.css** - NO dark mode overrides (443 lines)
4. ❌ **TithiCard.tsx** - Minor: rgba() shadows

### High Priority (Should Fix)
5. ⚠️ **BottomNav.tsx** - `#9CA3AF` inactive gray
6. ⚠️ **EkadashiDetailCard.tsx** - Hardcoded colors
7. ⚠️ **CalendarScreen.tsx** - Some hardcoded colors

### Lower Priority (Nice to Have)
8. 📝 Various components with `rgba(0,0,0,...)` shadows

---

## ✅ Fixes Applied So Far

1. ✅ **TodayGuidanceCard.tsx**
   - Imported `useTheme`
   - Replaced `getColor()` function with theme-aware version
   - Added `isDark` detection
   - **REMAINING:** 8 hardcoded color instances in JSX (lines 170, 204, 221-222, 240, 257-258, 274)

---

## 📋 Immediate Action Plan

### Step 1: Fix TodayGuidanceCard.tsx (15 min)
Replace these lines:
```tsx
// Line 170
color: '#fff' → color: theme.palette.primary.contrastText

// Lines 204, 221-222 (Good section)
color: '#059669' → color: theme.palette.success.main
bgcolor: 'rgba(5, 150, 105, 0.06)' → bgcolor: `${theme.palette.success.main}10`

// Lines 240, 257-258 (Avoid section)  
color: '#DC2626' → color: theme.palette.error.main
bgcolor: 'rgba(220, 38, 38, 0.06)' → bgcolor: `${theme.palette.error.main}10`

// Line 274 (Why box)
bgcolor: 'rgba(0,0,0,0.02)' → bgcolor: theme.palette.action.hover
```

### Step 2: Fix AyurvedicClock.tsx (20 min)
Replace DOSHA_CONFIG with theme-aware function:
```tsx
const getDoshaConfig = (theme: Theme) => ({
  vata: {
    color: theme.palette.info.main,
    bg: `${theme.palette.info.main}15`,
    // ...
  },
  pitta: {
    color: theme.palette.warning.main,
    bg: `${theme.palette.warning.main}15`,
    // ...
  },
  kapha: {
    color: theme.palette.success.main,
    bg: `${theme.palette.success.main}15`,
    // ...
  },
});
```

Replace all `rgba(0,0,0,...)` with:
```tsx
bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
```

### Step 3: Add Dark Mode to TodayScreen.css (30 min)
Add this at the TOP of the file:
```css
:root.dark {
  --sacred-white: #1A1612;
  --warm-neutral: #2D241C;
  --text-primary: #F5F0E8;
  --text-secondary: #C4B8A8;
  --saffron-50: rgba(255, 154, 92, 0.05);
  --saffron-100: rgba(255, 154, 92, 0.1);
  --saffron-200: rgba(255, 154, 92, 0.2);
  --saffron-500: #FF9A5C;
  --temple-50: rgba(123, 140, 222, 0.05);
  --temple-100: rgba(123, 140, 222, 0.1);
  --temple-200: rgba(123, 140, 222, 0.2);
  --border-color: rgba(255, 240, 224, 0.1);
}
```

### Step 4: Test in Both Modes (10 min)
```bash
npm run dev
# Toggle light/dark mode in app
# Check all screens
# Verify icons visible
# Verify text readable
# Verify graphs/charts visible
```

---

## 🎯 Expected Result After Fixes

✅ Solar timings graph visible with proper colors  
✅ All icons visible in both light and dark modes  
✅ No black/white mixing - proper contrast  
✅ Text readable on all backgrounds  
✅ Responsive on mobile, tablet, desktop  
✅ Professional, pleasant appearance  

---

## ⏱️ Estimated Time: 75 minutes

All fixes are straightforward theme color replacements. No logic changes needed.

---

**Next Step:** Apply Step 1-3 fixes, then test thoroughly.
