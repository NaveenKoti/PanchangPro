/**
 * theme/breakpoints — DEPRECATED compatibility shim.
 *
 * The canonical responsive API is `src/hooks/useBreakpoints.ts` (MUI-based,
 * single source of truth). This file exists ONLY so existing imports
 * (`BottomNav` already repointed; `TithiCard`, `MoreMenu`, etc. owned by
 * other agents) keep compiling. Do NOT add window-width logic here.
 *
 * REMOVED: the legacy `useState(window.innerWidth)` system and
 * `getResponsiveValue`/`useResponsiveValue` (its tablet boundary
 * `< md → tablet` disagreed with the canonical `between sm-md` semantics).
 */

export { useBreakpoints, default } from '../hooks/useBreakpoints';
import { useBreakpoints as useCanonicalBreakpoints } from '../hooks/useBreakpoints';
export type { BreakpointState as UseBreakpointsReturn } from '../hooks/useBreakpoints';

export const useDeviceType = (): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
} => {
  const { isMobile, isTablet, isDesktop } = useCanonicalBreakpoints();

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
};

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
} as const;

export type BreakpointKey = keyof typeof breakpoints;

export interface BreakpointValues {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export const up = (key: BreakpointKey | number) => {
  const value = typeof key === 'number' ? key : breakpoints[key];
  return `@media (min-width: ${value}px)`;
};

export const down = (key: BreakpointKey | number) => {
  const value = typeof key === 'number' ? key : breakpoints[key];
  return `@media (max-width: ${value - 1}px)`;
};

export const between = (start: BreakpointKey | number, end: BreakpointKey | number) => {
  const startValue = typeof start === 'number' ? start : breakpoints[start];
  const endValue = typeof end === 'number' ? end : breakpoints[end];
  return `@media (min-width: ${startValue}px) and (max-width: ${endValue - 1}px)`;
};

export const only = (key: BreakpointKey) => {
  if (key === 'xl') {
    return up(key);
  }
  const keys = Object.keys(breakpoints) as BreakpointKey[];
  const keyIndex = keys.indexOf(key);
  const nextKey = keys[keyIndex + 1];
  return between(key, nextKey);
};
