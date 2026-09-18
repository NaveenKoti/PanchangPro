# Color Refactoring Guide - Hardcoded to Theme Variables

## Overview

**Status:** In Progress  
**Total Instances Found:** ~937 hardcoded colors  
**Priority:** Replace top 50-100 most common instances

## Common Hardcoded Color Patterns

### 1. Saffron/Primary Color (Most Common - ~300 instances)
```typescript
// Current (Hardcoded)
rgba(199, 91, 18, X.XX)  // #C75B12 with various opacities
'rgba(199, 91, 18, 0.1)'
'rgba(199, 91, 18, 0.15)'
'rgba(199, 91, 18, 0.2)'

// Replacement Theme Variable
(theme) => theme.palette.primary.main + withOpacity
// Or use theme.variables if we add support
```

### 2. White with Opacity
```typescript
// Current
'rgba(255, 255, 255, 0.X)'

// Replacement
(theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.X)' : 'rgba(0,0,0,0.X)'
// Use theme-specific variables
```

### 3. Black with Opacity
```typescript
// Current
'rgba(0, 0, 0, 0.X)'

// Replacement
(theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.0X)' : 'rgba(0,0,0,0.X)'
```

### 4. Specific Colors
```typescript
// Hex colors like #C75B12, #FF6B35, #2C3E6B
// Replace with: (theme) => theme.palette.primary.main
```

## Refactoring Strategy

### Phase 1: Create Utility Functions
Add helper functions to the theme for common opacity combinations.

### Phase 2: Replace Top Occurrences
Focus on the most common colors first (~50-100 instances).

### Phase 3: Remaining Cleanup
Systematically replace remaining hardcoded colors.

## Files with Most Hardcoded Colors

1. **SettingsScreen.tsx** - ~25 instances
2. **FestivalShareCard.tsx** - ~20 instances
3. **PanchangShareCard.tsx** - ~30 instances
4. **CalendarScreen.tsx** - ~15 instances
5. **Various component files** - distributed

## Implementation Example

### Before:
```typescript
<Box sx={{ bgcolor: 'rgba(199, 91, 18, 0.1)' }}>
```

### After:
```typescript
<Box sx={{ bgcolor: (theme) => theme.palette.primary.main + '1A' }}>
// 1A = 10% opacity in hex
```

Or better, add a helper:
```typescript
// In theme file:
export const withOpacity = (color: string, opacity: number) => {
  const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return color + opacityHex;
};

// Usage:
bgcolor: (theme) => withOpacity(theme.palette.primary.main, 0.1)
```

## Tracking Progress

| Color Pattern | Instances | Replaced | Remaining |
|--------------|-----------|----------|-----------|
| rgba(199,91,18,...) | ~300 | 0 | ~300 |
| rgba(255,255,255,...) | ~200 | 0 | ~200 |
| rgba(0,0,0,...) | ~150 | 0 | ~150 |
| Hex colors | ~287 | 0 | ~287 |
| **Total** | **~937** | **0** | **~937** |

## Next Steps

1. ✅ Create mapping document (completed)
2. ⏳ Add utility functions to theme
3. ⏳ Replace top 50-100 instances
4. ⏳ Update todo list with progress
5. ⏳ Test visual regression
