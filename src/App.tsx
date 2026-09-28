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
import { Box, AppBar, Toolbar, Typography, Snackbar, Alert, IconButton, Menu, MenuItem, Fade, CssBaseline, useTheme, alpha, Button } from '@mui/material';
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
import { PWAInstallPrompt } from './components/pwa/PWAInstallPrompt';
import { BackupPrompt } from './components/BackupPrompt';
import { parseDayParam } from './utils/dayLink';
import { requestPersistentStorage } from './services/storageGuard';
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
  // Share-tithi deep link (?d=YYYY-MM-DD): day the recipient was sent.
  const [sharedDay, setSharedDay] = useState<Date | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { t, currentLanguage } = useI18n();
  const sharedDayLocale =
    currentLanguage === 'hi'
      ? 'hi-IN'
      : currentLanguage === 'sa'
        ? 'sa-IN'
        : currentLanguage === 'kn'
          ? 'kn-IN'
          : currentLanguage === 'te'
            ? 'te-IN'
            : currentLanguage === 'ta'
              ? 'ta-IN'
              : 'en-IN';
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
    calculatePanchang,
    selectedDate,
    setSelectedDate,
    requestedTab,
    clearTabRequest,
  } = useAppStore();

  // Share-tithi deep link (?d=YYYY-MM-DD): open the sent day on Today,
  // show the shared-day banner + install nudge, then clean the URL.
  // Invalid/absent params boot normally (parseDayParam returns null).
  // App-shortcut entry (?shortcut=today|calendar|fasts|myTithis|muhurta|stories):
  // Android long-press launcher shortcuts land on the right view.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linked = parseDayParam(window.location.search);
    const shortcut = params.get('shortcut');
    if (linked) {
      setSelectedDate(linked);
      setTab(0);
      setSharedDay(linked);
    } else if (shortcut) {
      const tabFor: Record<string, number> = { today: 0, calendar: 1, fasts: 2, myTithis: 3 };
      if (shortcut in tabFor) {
        setTab(tabFor[shortcut]);
      } else if (shortcut === 'muhurta' || shortcut === 'stories') {
        setInlineScreen(shortcut);
      }
    }
    if (linked || shortcut) {
      setInlineScreen((prev) => (linked ? null : prev));
      setFestivalDetail(null);
      setShowSettings(false);
      window.history.replaceState(null, '', window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Home-screen badge (iOS 16.4+ installed PWA, Android no-op): today's
  // tithi number on the app icon. Refreshes on open (no background sync
  // on iOS); failures are silent by design.
  useEffect(() => {
    try {
      const nav = navigator as Navigator & { setAppBadge?: (n: number) => Promise<void> };
      if (typeof nav.setAppBadge === 'function') {
        const n = calculatePanchang(new Date()).tithi.number;
        if (n >= 1 && n <= 30) void nav.setAppBadge(n).catch(() => undefined);
      }
    } catch {
      // Badge unsupported or denied — never block boot.
    }
    // Ask the browser to keep our storage (Safari evicts unused site data
    // after ~2 weeks; installed + persisted origins are protected first).
    // Fire-and-forget; denial changes nothing about the app.
    void requestPersistentStorage().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Store-requested tab switch (e.g. Today digest "View My Tithis" CTA,
  // quick links, timing clock): tab ids map to indices; 'muhurta' opens the
  // full timing screen inline (it lives in More, not on the tab bar).
  useEffect(() => {
    if (!requestedTab) return;
    const tabIndex: Record<string, number> = { today: 0, calendar: 1, fasts: 2, myTithis: 3 };
    const next = tabIndex[requestedTab];
    if (next !== undefined) {
      setInlineScreen(null);
      setTab(next);
    } else if (requestedTab === 'muhurta') {
      setFestivalDetail(null);
      setShowSettings(false);
      setInlineScreen('muhurta');
      setTab(-1); // Deselect bottom nav
    }
    clearTabRequest();
  }, [requestedTab, clearTabRequest]);

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
          const newTab = Math.max(0, Math.min(3, prev + delta));
          return newTab;
        });
        return;
      }

      // 1-4: jump to specific tab
      if (event.key >= '1' && event.key <= '4') {
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
        <Box sx={{ minHeight: '100vh', '@supports (min-height: 100dvh)': { minHeight: '100dvh' }, bgcolor: 'background.default' }}>
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.92),
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid',
              borderColor: 'divider',
              color: 'text.primary',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Toolbar sx={{ minHeight: 56, px: 2, paddingTop: 'env(safe-area-inset-top, 0px)' }}>
              <IconButton
                onClick={handleSettingsBack}
                edge="start"
                aria-label="Back"
                sx={{
                  mr: 1,
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
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
      <Box sx={{ minHeight: '100vh', '@supports (min-height: 100dvh)': { minHeight: '100dvh' }, bgcolor: 'background.default' }}>
        {/* Modern App Bar with Glassmorphism Effect */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.92),
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
            transition: 'background-color 0.3s ease',
          }}
        >
          <Toolbar sx={{ minHeight: 56, px: 2, paddingTop: 'env(safe-area-inset-top, 0px)' }}>
            <Typography
              variant="h6"
              sx={{
                flex: 1,
                color: 'primary.main',
                fontWeight: 500,
                fontSize: '1.25rem',
                letterSpacing: '-0.03em',
              }}
            >
              {t('common.appName')}
            </Typography>

            {/* Action Menu */}
            <IconButton
              onClick={handleMenuOpen}
              aria-label="More options"
              sx={{
                color: 'text.primary',
                width: 48,
                height: 48,
                minWidth: 48,
                minHeight: 48,
                '&:hover': { 
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  transform: 'rotate(90deg)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <MoreVertical size={20} />
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
                  borderRadius: 1,
                  boxShadow: (theme) => theme.shadows[8],
                  border: '1px solid',
                  borderColor: 'divider',
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
                  '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <Share2 size={16} color={theme.palette.primary.main} />
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
                  '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08) },
                }}
              >
                <SettingsIcon size={16} color={theme.palette.text.secondary} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t('navigation.settings')}
                </Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box sx={{ pb: 10, minHeight: 'calc(100vh - 120px)', '@supports (min-height: 100dvh)': { minHeight: 'calc(100dvh - 120px)' } }}>
          {/* Floating back button for inline screens */}
          {(inlineScreen || festivalDetail) && (
            <IconButton
              aria-label="Back to previous screen"
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
                width: 48,
                height: 48,
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
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
            <Suspense key="muhurta-inline" fallback={<MuhurtaSkeleton />}>
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
              {/* Shared-tithi banner: visible on Today until dismissed or the
                  user navigates to another day. Install CTA opens the PWA
                  prompt — the self-marketing loop for link recipients. */}
              {tab === 0 && sharedDay && (() => {
                const sharedPanchang = calculatePanchang(sharedDay);
                const tithiName = currentLanguage === 'hi' ? sharedPanchang.tithi.nameHindi : sharedPanchang.tithi.name;
                const fest = sharedPanchang.festivals?.[0];
                const festName = fest ? (currentLanguage === 'hi' ? fest.nameHindi : fest.name) : null;
                return (
                  <Alert
                    severity="info"
                    onClose={() => setSharedDay(null)}
                    sx={{ mb: 1.5, borderRadius: 1, alignItems: 'center' }}
                    action={
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setShowInstallPrompt(true)}
                        sx={{ borderRadius: 1, whiteSpace: 'nowrap', ml: 1 }}
                      >
                        {t('app.installApp')}
                      </Button>
                    }
                  >
                    {t('app.sharedTithi', {
                      tithi: tithiName,
                      fest: festName ? ` · ${festName}` : '',
                      date: sharedDay.toLocaleDateString(sharedDayLocale),
                    })}
                  </Alert>
                );
              })()}
              {tab === 0 && <TodayScreen key="today" onFestivalOpen={(id) => setFestivalDetail({ id })} />}
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

        {/* PWA install prompt (deep-link recipients via the shared-day banner) */}
        <PWAInstallPrompt
          open={showInstallPrompt || undefined}
          onDismiss={() => setShowInstallPrompt(false)}
        />

        {/* Backup re-export nudge (Safari eviction guard) */}
        <BackupPrompt />
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
