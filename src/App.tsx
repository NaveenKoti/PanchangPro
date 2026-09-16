/**
 * VedaTime - Main App Component
 *
 * Sacred Rhythms of Time — a Hindu Panchang application with:
 * - Accurate panchang calculations (fully offline)
 * - World-class Vedic design system
 * - Ayurvedic clock and dinacharya guidance
 * - Multi-language support (EN/HI/SA)
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Box, AppBar, Toolbar, Typography, Snackbar, Alert, IconButton, Menu, MenuItem, Fade, CssBaseline, useTheme } from '@mui/material';
import { MoreVertical, Share2, Settings as SettingsIcon, ChevronLeft, ArrowLeft } from 'lucide-react';
import { TodayScreen } from './screens/TodayScreen';
import { MyTithisScreen } from './screens/MyTithisScreen';
import SettingsScreen from './screens/SettingsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import { BottomNav } from './components/BottomNav';
import { MoreMenu } from './components/MoreMenu';
import ErrorBoundary from './components/ErrorBoundary';
import { useI18n } from './hooks/useI18n';
import { ThemeProvider } from './components/ThemeProvider';
import { notificationService, notificationScheduler } from './services/notificationService';
import { useAppStore } from './stores/appStore';
import { PanchangShareCard } from './components/PanchangShareCard';
import GestureHandler from './components/GestureHandler';

// Lazy-loaded screens with code-splitting for performance
const CalendarScreen = lazy(() => import('./screens/CalendarScreen'));
const FastsScreen = lazy(() => import('./screens/FastsScreen'));
const MuhurtaScreen = lazy(() => import('./screens/MuhurtaScreen'));
const StoriesScreen = lazy(() => import('./screens/StoriesScreen'));
const FestivalDetailScreen = lazy(() => import('./screens/FestivalDetailScreen').then(m => ({ default: m.FestivalDetailScreen })));

// Skeleton loaders for each lazy screen
import { CalendarSkeleton } from './components/skeletons/CalendarSkeleton';
import { FastsSkeleton } from './components/skeletons/FastsSkeleton';
import { MuhurtaSkeleton } from './components/skeletons/MuhurtaSkeleton';
import { StoriesSkeleton } from './components/skeletons/StoriesSkeleton';

const App: React.FC = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [inlineScreen, setInlineScreen] = useState<'muhurta' | 'stories' | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [festivalDetail, setFestivalDetail] = useState<{ id: string } | null>(null);
  const { t } = useI18n();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Get state from store
  const {
    hasCompletedOnboarding,
    completeOnboarding,
    preferences,
    sharePanchang,
    premium,
    calculatePanchang,
    selectedDate,
  } = useAppStore();

  // Calculate current panchang for sharing
  const panchang = calculatePanchang(selectedDate);

  const notifications = preferences.notifications;

  // Initialize notification service on app startup
  useEffect(() => {
    const initNotifications = async () => {
      try {
        const permission = notificationService.checkPermission();
        if (permission === 'granted' && notificationService.isGloballyEnabled()) {
          // Run the 30-day scheduler
          const result = await notificationScheduler.runScheduler();
          if (result.scheduled > 0) {
            setSnackbar({
              open: true,
              message: `${result.scheduled} reminders scheduled for the next 30 days.`,
              severity: 'success',
            });
          }
        } else if (permission === 'granted') {
          // Permission granted but not globally enabled — schedule daily panchang if enabled
          if (notifications.dinacharyaReminders) {
            notificationService.scheduleDailyPanchangReminder('07:00');
          }
        }
      } catch {
        // Notification init failure is non-critical
      }
    };
    initNotifications();
  }, [notifications.dinacharyaReminders]);

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle settings click
  const handleSettingsClick = () => {
    handleMenuClose();
    setShowSettings(true);
  };

  // Handle share click
  const handleShareClick = () => {
    handleMenuClose();
    setShowShareCard(true);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    completeOnboarding();
  };

  // Handle back from settings
  const handleSettingsBack = () => {
    setShowSettings(false);
  };

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't capture keys when user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Escape: close dialogs, close More menu, go back from settings/inline screens
      if (event.key === 'Escape') {
        if (showShareCard) {
          setShowShareCard(false);
          return;
        }
        if (showMoreMenu) {
          setShowMoreMenu(false);
          return;
        }
        if (Boolean(anchorEl)) {
          setAnchorEl(null);
          return;
        }
        if (festivalDetail) {
          setFestivalDetail(null);
          return;
        }
        if (showSettings) {
          setShowSettings(false);
          return;
        }
        if (inlineScreen) {
          setInlineScreen(null);
          setTab(0);
          return;
        }
      }

      // ArrowLeft / ArrowRight: navigate between tabs
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        setTab((prev) => {
          const delta = event.key === 'ArrowLeft' ? -1 : 1;
          const newTab = Math.max(0, Math.min(4, prev + delta));
          return newTab;
        });
        return;
      }

      // 1-5: jump to specific tab
      if (event.key >= '1' && event.key <= '5') {
        const tabNum = parseInt(event.key, 10) - 1;
        setTab(tabNum);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShareCard, showMoreMenu, anchorEl, showSettings, inlineScreen]);

  // Show onboarding if not completed
  if (!hasCompletedOnboarding) {
    return (
      <ThemeProvider>
        <CssBaseline />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </ThemeProvider>
    );
  }

  // Show settings screen
  if (showSettings) {
    return (
      <ThemeProvider>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              bgcolor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(15, 14, 12, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid',
              borderColor: 'divider',
              color: 'text.primary',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Toolbar sx={{ minHeight: 56, px: 2 }}>
              <IconButton
                onClick={handleSettingsBack}
                edge="start"
                sx={{
                  mr: 1,
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'rgba(199, 91, 18, 0.08)',
                    transform: 'translateX(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronLeft size={24} />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  color: 'text.primary',
                  flex: 1,
                }}
              >
                {t('navigation.settings')}
              </Typography>
            </Toolbar>
          </AppBar>
          <SettingsScreen />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Modern App Bar with Glassmorphism Effect */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(15, 14, 12, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
            transition: 'background-color 0.3s ease',
          }}
        >
          <Toolbar sx={{ minHeight: 56, px: 2 }}>
            <Typography
              variant="h6"
              sx={{
                flex: 1,
                color: 'primary.main',
                fontWeight: 500,
                fontSize: '1.25rem',
                letterSpacing: '-0.03em',
                background: theme.palette.mode === 'dark' 
                  ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
                  : 'linear-gradient(135deg, #E8722A 0%, #FF9A5C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              🙏 {t('common.appName')}
            </Typography>

            {/* Action Menu */}
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                color: 'text.primary',
                width: 40,
                height: 40,
                '&:hover': { 
                  bgcolor: 'rgba(199, 91, 18, 0.08)',
                  transform: 'rotate(90deg)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <MoreVertical size={22} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                  borderRadius: 2.5,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(0,0,0,0.05)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem 
                onClick={handleShareClick} 
                sx={{ 
                  gap: 1.5, 
                  py: 1.25,
                  mx: 1,
                  borderRadius: 1.5,
                  '&:hover': { bgcolor: 'rgba(199, 91, 18, 0.08)' },
                }}
              >
                <Share2 size={18} color={theme.palette.primary.main} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t('common.share')}
                </Typography>
              </MenuItem>
              <MenuItem 
                onClick={handleSettingsClick} 
                sx={{ 
                  gap: 1.5, 
                  py: 1.25,
                  mx: 1,
                  borderRadius: 1.5,
                  '&:hover': { bgcolor: 'rgba(199, 91, 18, 0.08)' },
                }}
              >
                <SettingsIcon size={18} color="#5C4033" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t('navigation.settings')}
                </Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box sx={{ pb: 10, minHeight: 'calc(100vh - 120px)' }}>
          {/* Floating back button for inline screens */}
          {(inlineScreen || festivalDetail) && (
            <IconButton
              onClick={() => {
                if (festivalDetail) {
                  setFestivalDetail(null);
                } else {
                  setInlineScreen(null);
                  setTab(0);
                }
              }}
              sx={{
                position: 'fixed',
                top: 64,
                left: 8,
                zIndex: 1100,
                bgcolor: 'background.paper',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                border: '1px solid',
                borderColor: 'divider',
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: 'rgba(199, 91, 18, 0.08)',
                  transform: 'translateX(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowLeft size={20} />
            </IconButton>
          )}

          {/* Festival Detail Screen */}
          {festivalDetail && (
            <Suspense key={`festival-${festivalDetail.id}`} fallback={<CalendarSkeleton />}>
              <FestivalDetailScreen
                festivalId={festivalDetail.id}
                onBack={() => setFestivalDetail(null)}
              />
            </Suspense>
          )}

          {/* Inline screens from More menu */}
          {!festivalDetail && inlineScreen === 'muhurta' && (
            <Suspense key="muhurta" fallback={<MuhurtaSkeleton />}>
              <MuhurtaScreen />
            </Suspense>
          )}
          {!festivalDetail && inlineScreen === 'stories' && (
            <Suspense key="stories" fallback={<StoriesSkeleton />}>
              <StoriesScreen />
            </Suspense>
          )}

          {/* Tab-based screens */}
          {!festivalDetail && !inlineScreen && !showSettings && (
            <>
              {tab === 0 && <TodayScreen key="today" />}
              {tab === 1 && (
                <Suspense key="calendar" fallback={<CalendarSkeleton />}>
                  <CalendarScreen onFestivalOpen={(id) => setFestivalDetail({ id })} />
                </Suspense>
              )}
              {tab === 2 && (
                <Suspense key="fasts" fallback={<FastsSkeleton />}>
                  <FastsScreen onFestivalOpen={(id) => setFestivalDetail({ id })} />
                </Suspense>
              )}
              {tab === 3 && <MyTithisScreen key="mytithis" />}
              {/* Tab 4 is "More" - no content, opens sheet */}
            </>
          )}
        </Box>

        {/* Bottom Navigation */}
        <BottomNav
          value={tab}
          onChange={(newTab) => {
            setInlineScreen(null);
            setTab(newTab);
          }}
          onShowMore={() => setShowMoreMenu(true)}
        />

        {/* More Menu Bottom Sheet */}
        <MoreMenu
          open={showMoreMenu}
          onClose={() => setShowMoreMenu(false)}
          onSelectItem={(item) => {
            if (item === 'settings') {
              setShowSettings(true);
            } else if (item === 'muhurta' || item === 'stories') {
              setInlineScreen(item);
              setTab(-1); // Deselect bottom nav
            }
          }}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ mb: 8 }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ borderRadius: 2, fontWeight: 500 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Panchang Share Card */}
        <PanchangShareCard
          isOpen={showShareCard}
          onClose={() => setShowShareCard(false)}
          panchang={panchang}
          locationName={preferences.location.name || 'Unknown Location'}
        />
      </Box>
    </ThemeProvider>
  );
};

const AppWithErrorBoundary: React.FC = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
