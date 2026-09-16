/**
 * useBreakpoints - Responsive breakpoint detection
 *
 * Replaces manual useMediaQuery calls with a unified hook
 * Returns booleans for each breakpoint (isMobile, isTablet, isDesktop)
 * Uses theme breakpoints defined in design system
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
  const isDesktop = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const currentBreakpoint = useMemo(() => {
    if (isMobile) return 'xs';
    if (isTablet) return 'sm';
    if (isDesktop) return 'md';
    if (isLargeDesktop) return 'lg';
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
