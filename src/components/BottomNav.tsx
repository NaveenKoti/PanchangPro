/**
 * BottomNav - Premium Minimal Redesign
 *
 * Design Principles:
 * - Clean, unobtrusive (5 tabs max for good UX)
 * - "More" tab opens a bottom sheet for less-frequent features
 * - Icon-primary on mobile, labels shown on larger screens
 * - Proper 48px+ touch targets
 * - Subtle active indicator with smooth animation
 */

import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, useTheme } from '@mui/material';
import { Sunrise, CalendarDays, Clock, MoreHorizontal, Star } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { triggerHapticIfSupported } from '../utils/haptics';

export type NavTab = 'today' | 'calendar' | 'muhurta' | 'fasts' | 'myTithis' | 'more' | 'stories';

interface BottomNavProps {
  value: number;
  onChange: (value: number) => void;
  onShowMore: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ value, onChange, onShowMore }) => {
  const { t } = useI18n();
  const theme = useTheme();
  const { isMobile } = useBreakpoints();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    // Tab 4 is "More" - open sheet instead
    if (newValue === 4) {
      triggerHapticIfSupported('selection');
      onShowMore();
      return;
    }
    triggerHapticIfSupported('selection');
    onChange(newValue);
  };

  // 5 tabs: Today, Calendar, Muhurta, My Tithis, More (Fasts moved to More —
  // auspicious-timings is daily utility, fasting is periodic)
  const navItems = [
    { key: 'today', label: t('navigation.today'), icon: Sunrise },
    { key: 'calendar', label: t('navigation.calendar'), icon: CalendarDays },
    { key: 'muhurta', label: t('navigation.muhurta'), icon: Clock },
    { key: 'myTithis', label: t('myTithis.title'), icon: Star },
    { key: 'more', label: t('navigation.more'), icon: MoreHorizontal },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        // Glass blur + translucent background.paper (mirrors AppBar treatment)
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(36, 32, 25, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
        borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
        // Safe-area inset for gesture-bar devices, with fallback
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <BottomNavigation
        value={value}
        onChange={handleTabChange}
        showLabels={true}
        sx={{
          height: isMobile ? 64 : 72,
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minHeight: 48,
            minWidth: 'auto',
            padding: isMobile ? '8px 4px' : '10px 8px',
            color: theme.palette.text.secondary,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            },
          },
          '& .Mui-selected': {
            color: `${theme.palette.primary.main} !important`,
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: isMobile ? '0.6875rem' : '0.75rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          },
        }}
      >
        {navItems.map((item, index) => {
          const isActive = value === index;
          return (
            <BottomNavigationAction
              key={item.key}
              label={item.label}
              icon={
                <item.icon
                  size={isMobile ? 22 : 24}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    display: 'block',
                  }}
                />
              }
            />
          );
        })}
      </BottomNavigation>

      {/* Subtle active indicator */}
      <Paper
        elevation={0}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          bgcolor: 'transparent',
          overflow: 'visible',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '20%',
            height: '100%',
            ml: `${value * 20}%`,
            bgcolor: theme.palette.primary.main,
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '0 0 2px 2px',
          }}
        />
      </Paper>
    </Paper>
  );
};

export default BottomNav;
