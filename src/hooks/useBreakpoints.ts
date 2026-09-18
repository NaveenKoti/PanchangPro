/**
 * useBreakpoints - Responsive breakpoint detection (SINGLE SOURCE OF TRUTH)
 *
 * Canonical MUI-based hook. All responsive logic must consume this hook —
 * do NOT create competing window-width systems (see src/theme/breakpoints.ts
 * shim). Breakpoint values live in the MUI theme (vedaTheme.ts
 * `breakpointValues`: xs 0 / sm 600 / md 960 / lg 1280 / xl 1920) so `sx`
 * props + `useMediaQuery` agree.
 *
 * Semantics:
 * - isMobile = down('sm') i.e. <600
 * - isTablet = between sm-md (600–959)
 * - isDesktop = up('md') i.e. >=960
 * - isLargeDesktop = up('lg') i.e. >=1280
 */

import { useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

export interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  currentBreakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const useBreakpoints = (): BreakpointState => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // Largest-first: isDesktop (md+) overlaps isLargeDesktop (lg+)
  const currentBreakpoint = useMemo(() => {
    if (isMobile) return 'xs';
    if (isTablet) return 'sm';
    if (isLargeDesktop) return 'lg';
    if (isDesktop) return 'md';
    return 'xl';
  }, [isMobile, isTablet, isDesktop, isLargeDesktop]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    currentBreakpoint,
  };
};

export default useBreakpoints;
