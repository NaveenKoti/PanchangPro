# 🔧 PanchangPro - Critical Fix Plan

## Issues Identified

### 1. ❌ Theme Modes Not Working
**Problem:** CSS variables in `globals.css` don't sync with MUI theme in `ThemeProvider.tsx`

**Root Cause:**
- `globals.css` uses different saffron/temple values than `ThemeProvider.tsx`
- `globals.css` line 11: `--veda-saffron-500: #C75B12` (light mode)
- `ThemeProvider.tsx` line 28: `primary.main: '#F0A060'` (light mode)
- Theme switching changes MUI theme but CSS variables remain mismatched

**Files to Fix:**
- `/src/styles/globals.css` (lines 7-25, 92-110)
- `/src/theme/vedaTheme.ts` (already correct)
- `/src/components/ThemeProvider.tsx` (needs sync)

---

### 2. ❌ Icons Not Visible
**Problem:** Lucide icons in BottomNav using inline styles that override theme

**Root Cause:**
- `BottomNav.tsx` line 89: Icons use inline `style` prop
- `style={{ color: isActive ? theme.palette.primary.main : theme.palette.text.secondary }}`
- But `theme.palette.primary.main` = `#F0A060` (from ThemeProvider.tsx)
- While CSS expects `--veda-saffron-500` which is `#C75B12`
- Color mismatch makes icons appear invisible/wrong

**Files to Fix:**
- `/src/components/BottomNav.tsx` (lines 60-68, 89)

---

### 3. ❌ CSS Rounding Breaking
**Problem:** Inconsistent border-radius values across components

**Root Cause:**
- `globals.css` line 50: `--veda-border-radius: 8px`
- `ThemeProvider.tsx` line 115: `borderRadius: 8`
- But components use random values: 2, 3, 4, 1.5, etc.
- No standardization = visual inconsistency

**Files to Fix:**
- All components using non-standard radius values (see list below)

---

## 🔨 Fix Implementation Plan

### Step 1: Fix Theme Color Synchronization

**File:** `src/styles/globals.css`

**Change lines 7-15** (Light mode saffron colors):
```css
/* OLD - Line 7-15 */
--veda-saffron-100: #fff3e0;
--veda-saffron-200: #ffe0b2;
--veda-saffron-300: #ffcc80;
--veda-saffron-400: #ffb74d;
--veda-saffron-500: #C75B12;
--veda-saffron-600: #7A3008;
--veda-saffron-700: #5A2406;
--veda-saffron-800: #3A1804;
--veda-saffron-900: #1A0C02;

/* NEW - Match ThemeProvider.tsx lightThemeColors */
--veda-saffron-100: rgba(199, 91, 18, 0.05);
--veda-saffron-200: rgba(199, 91, 18, 0.10);
--veda-saffron-300: rgba(199, 91, 18, 0.15);
--veda-saffron-400: rgba(199, 91, 18, 0.30);
--veda-saffron-500: #F0A060; /* Match ThemeProvider primary.main */
--veda-saffron-600: #E8944A;
--veda-saffron-700: #7A3008;
--veda-saffron-800: #5A2406;
--veda-saffron-900: #3A1804;
```

**Change lines 17-25** (Light mode temple colors):
```css
/* OLD - Line 17-25 */
--veda-temple-100: #e8f5e8;
--veda-temple-200: #c8e6c9;
--veda-temple-300: #a5d6a7;
--veda-temple-400: #7db356;
--veda-temple-500: #3D6B24;
--veda-temple-600: #2A4A19;
--veda-temple-700: #1F3A14;
--veda-temple-800: #142A0F;
--veda-temple-900: #091A09;

/* NEW - Match ThemeProvider secondary */
--veda-temple-100: rgba(61, 107, 36, 0.05);
--veda-temple-200: rgba(61, 107, 36, 0.10);
--veda-temple-300: rgba(61, 107, 36, 0.15);
--veda-temple-400: rgba(61, 107, 36, 0.30);
--veda-temple-500: #3D6B24; /* Match ThemeProvider secondary.main */
--veda-temple-600: #2A4D18;
--veda-temple-700: #7DB356;
--veda-temple-800: #A5D67C;
--veda-temple-900: #EBF5E3;
```

**Change lines 92-110** (Dark mode colors):
```css
/* OLD - Dark mode saffron (lines 92-100) */
--veda-saffron-100: #2A1810;
--veda-saffron-200: #3D2418;
--veda-saffron-300: #5A3323;
--veda-saffron-400: #834F38;
--veda-saffron-500: #FFB380;
--veda-saffron-600: #FFCC99;
--veda-saffron-700: #FDDCB5;
--veda-saffron-800: #FFF3E7;
--veda-saffron-900: #FFF8F0;

/* NEW - Match darkThemeColors */
--veda-saffron-100: rgba(240, 160, 96, 0.05);
--veda-saffron-200: rgba(240, 160, 96, 0.10);
--veda-saffron-300: rgba(240, 160, 96, 0.15);
--veda-saffron-400: rgba(240, 160, 96, 0.30);
--veda-saffron-500: #F0A060; /* Match darkThemeColors.primary.main */
--veda-saffron-600: #FDDCB5;
--veda-saffron-700: #E8884A;
--veda-saffron-800: #7A3008;
--veda-saffron-900: #5A2406;

/* OLD - Dark mode temple (lines 102-110) */
--veda-temple-100: #122712;
--veda-temple-200: #1A361A;
--veda-temple-300: #274F27;
--veda-temple-400: #7DB356;
--veda-temple-500: #A5D67C;
--veda-temple-600: #95D068;
--veda-temple-700: #F8FBF6;
--veda-temple-800: #FFFFFF;
--veda-temple-900: #FFFFFF;

/* NEW */
--veda-temple-100: rgba(61, 107, 36, 0.05);
--veda-temple-200: rgba(61, 107, 36, 0.10);
--veda-temple-300: rgba(61, 107, 36, 0.15);
--veda-temple-400: rgba(61, 107, 36, 0.30);
--veda-temple-500: #7DB356; /* Match darkThemeColors.secondary.main */
--veda-temple-600: #A5D67C;
--veda-temple-700: #3D6B24;
--veda-temple-800: #2A4D18;
--veda-temple-900: #1F3A14;
```

---

### Step 2: Fix Icon Visibility

**File:** `src/components/BottomNav.tsx`

**Change lines 60-68** (Remove hardcoded color, use CSS variables):
```tsx
/* OLD - Lines 60-68 */
'& .MuiBottomNavigationAction-root': {
  minWidth: 'auto',
  padding: isMobile ? '6px 4px 8px' : '8px 4px 10px',
  color: '#9CA3AF', // Neutral gray for inactive
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    bgcolor: 'transparent',
  },
},
'& .Mui-selected': {
  color: '#C75B12 !important',
},

/* NEW - Use theme colors */
'& .MuiBottomNavigationAction-root': {
  minWidth: 'auto',
  padding: isMobile ? '6px 4px 8px' : '8px 4px 10px',
  color: 'var(--veda-text-secondary)', // Use CSS variable
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    bgcolor: 'transparent',
  },
},
'& .Mui-selected': {
  color: 'var(--veda-saffron-500) !important', // Use CSS variable
},
```

**Change line 89** (Icon color):
```tsx
/* OLD - Line 89 */
style={{ color: isActive ? theme.palette.primary.main : theme.palette.text.secondary }}

/* NEW - Use CSS variables via inline style or remove inline style */
/* Option A: Remove inline style completely (recommended) */
style={{}}

/* Option B: Use CSS variables */
style={{ 
  color: isActive 
    ? 'var(--veda-saffron-500)' 
    : 'var(--veda-text-secondary)' 
}}
```

---

### Step 3: Standardize Border Radius

**Standard Values:**
- `borderRadius: 0` → Use `0`
- `borderRadius: 1` → Use `4px` (sm)
- `borderRadius: 1.5` → Use `6px` (between sm/md)
- `borderRadius: 2` → Use `8px` (md - default)
- `borderRadius: 2.5` → Use `10px` (between md/lg)
- `borderRadius: 3` → Use `12px` (lg)
- `borderRadius: 4` → Use `16px` (xl)

**Files to Update:**

1. **`src/screens/SettingsScreen.tsx`** (12 occurrences)
   - Line 216, 249, 262, 284, 310, 381, 459, 507, 562: `borderRadius: 3` → `borderRadius: 2`
   - Line 589, 608, 701, 707, 718, 741, 752, 774, 781, 798: `borderRadius: 2` → `borderRadius: 2` (keep)

2. **`src/screens/MyTithisScreen.tsx`** (15 occurrences)
   - Lines with `borderRadius: 2` → Keep as `2` (8px)
   - Lines with `borderRadius: 3` → Change to `2` (12px → 8px)
   - Lines with `borderRadius: 1.5` → Change to `1` (6px → 4px)

3. **`src/screens/CalendarScreen.tsx`** (20+ occurrences)
   - Standardize all radius values to use 1, 2, or 3

4. **`src/components/TithiExplanationDialog.tsx`**
5. **`src/components/EkadashiDetailCard.tsx`**
6. **`src/App.tsx`**
7. **`src/components/PanchangShareCard.tsx`**
8. **`src/screens/MuhurtaScreen.tsx`**

**Recommended Approach:**
Instead of fixing each file individually, update the theme's shape.borderRadius and use MUI's Box/sx prop with standard values:
- `borderRadius: 1` = 4px
- `borderRadius: 2` = 8px (default)
- `borderRadius: 3` = 12px
- `borderRadius: 4` = 16px

---

## ✅ Verification Steps

### 1. Test Theme Switching
```bash
# Run dev server
npm run dev

# Test:
1. Open app in browser
2. Toggle theme (light/dark)
3. Verify colors change immediately
4. Check saffron color matches #F0A060 (light) / #F0A060 (dark)
5. Verify CSS variables update (use DevTools → Computed styles)
```

### 2. Test Icon Visibility
```bash
# Test:
1. Open app
2. Check bottom navigation icons
3. Verify icons visible in light mode (saffron color)
4. Verify icons visible in dark mode (lighter saffron)
5. Switch themes - icons should remain visible
```

### 3. Test Border Radius Consistency
```bash
# Test:
1. Open DevTools
2. Inspect cards, buttons, dialogs
3. Verify border-radius is consistent:
   - Cards: 16px (xl)
   - Buttons: 8px (md)
   - Chips: 4px (sm)
   - Dialogs: 16px (xl)
```

### 4. Build Verification
```bash
# Run production build
npm run build

# Verify:
- No TypeScript errors
- No CSS warnings
- Build completes successfully
- dist/ folder generated
```

---

## 📋 Quick Fix Checklist

- [ ] Update `globals.css` light mode saffron colors (lines 7-15)
- [ ] Update `globals.css` light mode temple colors (lines 17-25)
- [ ] Update `globals.css` dark mode colors (lines 92-110)
- [ ] Fix `BottomNav.tsx` icon colors (lines 60-68, 89)
- [ ] Standardize border-radius in SettingsScreen.tsx
- [ ] Standardize border-radius in MyTithisScreen.tsx
- [ ] Standardize border-radius in CalendarScreen.tsx
- [ ] Run `npm run build` and verify 0 errors
- [ ] Test theme switching in browser
- [ ] Test icon visibility in both themes
- [ ] Verify border radius consistency

---

## 🎯 Expected Results

After fixes:
1. ✅ Theme switching works instantly and correctly
2. ✅ Icons visible in both light and dark modes
3. ✅ Consistent border-radius across all components
4. ✅ Colors match between CSS and MUI theme
5. ✅ Production build succeeds with 0 errors

---

## 📝 Notes

- All color values should come from `ThemeProvider.tsx` constants
- CSS variables should mirror MUI theme values
- Use theme spacing unit (8px) as base for border-radius
- Avoid magic numbers - use theme values or CSS variables
- Test in both light and dark modes after each change
