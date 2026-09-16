import { useState, useEffect } from 'react';

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

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

export interface UseBreakpointsReturn {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  up: (key: BreakpointKey | number) => boolean;
  down: (key: BreakpointKey | number) => boolean;
  between: (start: BreakpointKey | number, end: BreakpointKey | number) => boolean;
  width: number;
  height: number;
}

export const useBreakpoints = (): UseBreakpointsReturn => {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [height, setHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const xs = width >= breakpoints.xs && width < breakpoints.sm;
  const sm = width >= breakpoints.sm && width < breakpoints.md;
  const md = width >= breakpoints.md && width < breakpoints.lg;
  const lg = width >= breakpoints.lg && width < breakpoints.xl;
  const xl = width >= breakpoints.xl;

  const isMobile = xs || sm;
  const isTablet = md;
  const isDesktop = lg || xl;

  const checkUp = (key: BreakpointKey | number) => {
    const value = typeof key === 'number' ? key : breakpoints[key];
    return width >= value;
  };

  const checkDown = (key: BreakpointKey | number) => {
    const value = typeof key === 'number' ? key : breakpoints[key];
    return width < value;
  };

  const checkBetween = (start: BreakpointKey | number, end: BreakpointKey | number) => {
    const startValue = typeof start === 'number' ? start : breakpoints[start];
    const endValue = typeof end === 'number' ? end : breakpoints[end];
    return width >= startValue && width < endValue;
  };

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    isMobile,
    isTablet,
    isDesktop,
    up: checkUp,
    down: checkDown,
    between: checkBetween,
    width,
    height,
  };
};

export const useDeviceType = (): {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
} => {
  const { isMobile, isTablet, isDesktop } = useBreakpoints();

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
  };
};

export const getResponsiveValue = <T>(
  mobile: T,
  tablet: T,
  desktop: T,
  width?: number
): T => {
  const currentWidth = width ?? (typeof window !== 'undefined' ? window.innerWidth : 0);

  if (currentWidth < breakpoints.sm) return mobile;
  if (currentWidth < breakpoints.md) return tablet;
  return desktop;
};

export const useResponsiveValue = <T>(mobile: T, tablet: T, desktop: T): T => {
  const { width } = useBreakpoints();
  return getResponsiveValue(mobile, tablet, desktop, width);
};

export default {
  breakpoints,
  up,
  down,
  between,
  only,
  useBreakpoints,
  useDeviceType,
  useResponsiveValue,
  getResponsiveValue,
};
