import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
 Box,
 Typography,
 Paper,
 IconButton,
 Chip,
 Fade,
  Zoom,
  useTheme as useMuiTheme,
 Skeleton,
 Snackbar,
 Alert,
 Divider,
} from '@mui/material';
import { useSpring, animated, config } from '@react-spring/web';
import { useDrag, usePinch } from '@use-gesture/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  MoonIcon,
  SunIcon,
  LeafIcon,
  StarIcon,
  ClockIcon,
  XIcon,
  Share2Icon,
  PlusIcon,
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useI18n } from '../hooks/useI18n';
import { CalendarDay } from '../types';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionCard } from '../components/layout/SectionCard';
import { triggerHapticIfSupported } from '../utils/haptics';
import { useBreakpoints } from '../hooks/useBreakpoints';

interface CalendarScreenProps {
  /** Callback when user taps a festival to view its full story */
  onFestivalOpen?: (festivalId: string) => void;
}

interface GestureState {
 isSwiping: boolean;
 direction: 'left' | 'right' | null;
 velocity: number;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onFestivalOpen }) => {
 const { t, currentLanguage } = useI18n();
 const muiTheme = useMuiTheme();
 const isDark = muiTheme.palette.mode === 'dark';
  const { isMobile, isTablet } = useBreakpoints();

  const { getCalendarMonth, setSelectedDate, preferences } = useAppStore();
  // Sacred times render in the LOCATION timezone (engine instants are
  // absolute; device-local formatting corrupts them when traveling).
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: preferences.location.timezone,
    });
 const [currentMonth, setCurrentMonth] = useState(new Date());
 const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
 const [expandedFestivalId, setExpandedFestivalId] = useState<string | null>(null);
 const [gestureState, setGestureState] = useState<GestureState>({
 isSwiping: false,
 direction: null,
 velocity: 0,
 });
 const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
 const [monthTransition, setMonthTransition] = useState<'none' | 'left' | 'right'>('none');

 const [snackbar, setSnackbar] = useState<{
 open: boolean;
 message: string;
 severity: 'info' | 'success' | 'error';
 }>({ open: false, message: '', severity: 'info' });

  const firstMountRef = useRef(true);

  useEffect(() => {
  setMonthTransition('none');
  const days = getCalendarMonth(
  currentMonth.getFullYear(),
  currentMonth.getMonth()
  );
  setCalendarDays(days);
  setSelectedDay(null);
  // Skeleton ONLY on first mount: compute synchronously, no artificial
  // timer (removes month-nav flicker). Never true again on month change.
  if (firstMountRef.current) {
  firstMountRef.current = false;
  setIsLoading(false);
  }
  }, [currentMonth, getCalendarMonth]);

  const getTithiColors = (tithiName: string, day: CalendarDay) => {
    const isAuspicious = tithiName.includes('Purnima') || tithiName.includes('Ekadashi');
    const isFast = tithiName.includes('Ekadashi') || tithiName.includes('Chaturdashi') || tithiName.includes('Trayodashi');

    if (day.isFestival) {
      return {
        bg: isDark ? `${muiTheme.palette.primary.main}40` : `${muiTheme.palette.primary.main}30`,
        color: muiTheme.palette.primary.main,
        borderColor: `${muiTheme.palette.primary.main}80`,
      };
    }

    if (day.isFasting || isFast) {
      return {
        bg: `${muiTheme.palette.success.main}25`,
        color: muiTheme.palette.success.main,
        borderColor: `${muiTheme.palette.success.main}60`,
      };
    }

    if (isAuspicious) {
      return {
        bg: `${muiTheme.palette.warning.main}25`,
        color: muiTheme.palette.warning.main,
        borderColor: `${muiTheme.palette.warning.main}60`,
      };
    }

    if (tithiName.includes('Amavasya')) {
      return {
        bg: `${muiTheme.palette.secondary.main}25`,
        color: muiTheme.palette.secondary.main,
        borderColor: `${muiTheme.palette.secondary.main}60`,
      };
    }

    return {
      bg: `${muiTheme.palette.success.main}15`,
      color: muiTheme.palette.success.main,
      borderColor: `${muiTheme.palette.success.main}40`,
    };
  };

  const handlePrevMonth = () => {
 setMonthTransition('right');
 setCurrentMonth(
 new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
 );
 };

  const handleNextMonth = () => {
 setMonthTransition('left');
 setCurrentMonth(
 new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
 );
 };

  const handleDayClick = useCallback((day: CalendarDay) => {
    triggerHapticIfSupported('light');
    setSelectedDate(day.date);
    setExpandedFestivalId(null); // Reset expanded state when changing day
    setSelectedDay((prev) => {
      // Toggle: if same day clicked, deselect; otherwise select new day
      if (prev && prev.date.toDateString() === day.date.toDateString()) {
        return null;
      }
      return day;
    });
  }, [setSelectedDate]);

  const handleToday = () => {
 setMonthTransition('none');
 setCurrentMonth(new Date());
 setSelectedDay(null);
 };

 const handleShareDay = async () => {
 if (!selectedDay) return;

 try {
 const shareText = `${selectedDay.date.toDateString()} - ${selectedDay.panchang.tithi.name}`;
 if (navigator.share) {
 await navigator.share({
 title: 'Panchang',
 text: shareText,
 });
 } else {
 await navigator.clipboard.writeText(shareText);
 setSnackbar({
 open: true,
 message: 'Date copied to clipboard',
 severity: 'success',
 });
 }
 } catch (error) {
 setSnackbar({
 open: true,
 message: 'Share failed',
 severity: 'error',
 });
 }
 };

 const getFirstDayOfMonth = () =>
 new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

 const emptyDays = Array(getFirstDayOfMonth()).fill(null);

 const getWeekdays = () => {
 const weekdays = [
 t('vaar.sunday'),
 t('vaar.monday'),
 t('vaar.tuesday'),
 t('vaar.wednesday'),
 t('vaar.thursday'),
 t('vaar.friday'),
 t('vaar.saturday'),
 ];
  return weekdays.map((d) => d.slice(0, 2));
 };

 const getMonthName = (date: Date) => {
 const locale =
 currentLanguage === 'hi'
 ? 'hi-IN'
 : currentLanguage === 'sa'
 ? 'sa-IN'
 : 'en-IN';
 return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
 };

  const calendarCellMinHeight = isTablet ? 72 : 88;
  const calendarCellPadding = isTablet ? 0.75 : 1;
  const dayNumberFontSize = isTablet ? '0.9rem' : '1rem';
  const tithiTextFontSize = isTablet ? '0.6rem' : '0.7rem';
  const festivalTextFontSize = isTablet ? '0.55rem' : '0.65rem';

  // Agenda for xs: next 3 upcoming days with markers (replaces crushed 7-col grid).
  const agendaDays = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return calendarDays
      .filter((d) => d.date.getTime() >= start.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3);
  }, [calendarDays]);

 const monthAnimation = useSpring({
 transform: monthTransition === 'left' ? 'translateX(-100%)' :
 monthTransition === 'right' ? 'translateX(100%)' : 'translateX(0)',
 opacity: monthTransition === 'none' ? 1 : 0.7,
 from: { transform: 'translateX(0)', opacity: 1 },
 config: config.stiff,
 onRest: () => setMonthTransition('none'),
 });

 const bindCalendar = useDrag(
 (state) => {
 if (Math.abs(state.velocity[0]) > 0.2 && state.direction[0] !== 0) {
 if (state.direction[0] > 0) {
 handlePrevMonth();
 } else {
 handleNextMonth();
 }
 }
 },
 { axis: 'x', filterTaps: true }
 );

 const bindCalendarPinch = usePinch(
 (state) => {
 if (Math.abs(state.delta[0]) > 0.3) {
 setViewMode(viewMode === 'month' ? 'week' : 'month');
 }
 }
 );  if (isLoading) {
    return (
      <ScreenContainer sx={{ pt: 1.5 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 1.5, mx: 'auto' }} animation="wave" />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, maxHeight: '70vh' }} animation="wave" />
      </ScreenContainer>
    );
  }

  return (    <ScreenContainer
      sx={{ pt: 1.5 }}
  >
  <Zoom in timeout={400}>
 <Paper
 elevation={0}
  sx={{
  mb: 1.5,
  borderRadius: 2,
  bgcolor: 'background.paper',
  background: `linear-gradient(135deg, ${muiTheme.palette.primary.main}1F 0%, ${muiTheme.palette.primary.light}14 45%, ${muiTheme.palette.background.paper} 100%)`,
  border: '1px solid',
  borderColor: 'divider',
  }}
  >
  <Box
  sx={{
  px: 1.5,
  py: 1.25,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bgcolor: 'transparent',
  }}
  >
  <IconButton
  onClick={handlePrevMonth}
  size="small"
  aria-label="previous month"
  sx={{
  width: 48,
  height: 48,
 color: 'primary.main',
 '&:hover': { bgcolor: `${muiTheme.palette.primary.main}20` },
 }}
 >
 <ChevronLeftIcon size={20} />
 </IconButton>

      <Box sx={{ textAlign: 'center', flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
          <CalendarIcon size={18} color={muiTheme.palette.primary.main} />
  <Typography
  variant="h6"
   sx={{ fontWeight: 500, fontSize: { xs: '1.1rem', sm: '1.25rem' }, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.3 }}
 >
 {getMonthName(currentMonth)}
 </Typography>
  </Box>
  </Box>

  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Chip
          label={t('calendar.today') || 'Today'}
          size="small"
          onClick={handleToday}
          sx={{
            minHeight: 48,
            minWidth: 48,
            fontSize: '0.72rem',
            fontWeight: 500,
            cursor: 'pointer',
            bgcolor: `${muiTheme.palette.primary.main}15`,
            color: muiTheme.palette.primary.main,
            border: `1px solid ${muiTheme.palette.primary.main}30`,
            '&:hover': { bgcolor: `${muiTheme.palette.primary.main}25` },
          }}
        />
  <IconButton
  onClick={handleNextMonth}
  size="small"
  aria-label="next month"
  sx={{
  width: 48,
  height: 48,
 color: 'primary.main',
 '&:hover': { bgcolor: `${muiTheme.palette.primary.main}20` },
 }}
 >
 <ChevronRightIcon size={20} />
 </IconButton>
 </Box>
 </Box>
 </Paper>
 </Zoom>

 <Fade in timeout={500}>
 <animated.div {...bindCalendar()} {...bindCalendarPinch()} style={{ ...monthAnimation, touchAction: 'none' }}>
 <Paper
 elevation={0}
 sx={{
 borderRadius: 2,
 overflow: 'hidden',
 bgcolor: 'background.paper',
 border: '1px solid',
 borderColor: 'divider',
 }}
  >
  {!isMobile && (
  <Box
  sx={{
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  bgcolor: `${muiTheme.palette.primary.main}08`,
 borderBottom: '1px solid',
 borderBottomColor: 'divider',
 }}
 >
  {getWeekdays().map((day, index) => (
  <Box
  key={index}
  sx={{
  py: 1,
  minWidth: 0,
  textAlign: 'center',
 color:
 index === 0
 ? 'error.main'
 : index === 6
 ? muiTheme.palette.primary.main
 : 'text.secondary',
  fontWeight: 500,
  fontSize: '0.75rem',
  letterSpacing: '0.03em',
  }}
  >
  {day}
  </Box>
  ))}
  </Box>
  )}

  {isMobile ? (
  <Box
  sx={{
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
  p: 1,
  width: '100%',
  boxSizing: 'border-box',
  }}
  >
  {agendaDays.map((day) => {
  const tithiName = day.panchang.tithi.name;
  const tithiColors = getTithiColors(tithiName, day);
  const isSelected =
  selectedDay?.date.toDateString() === day.date.toDateString();
  const festivalName = day.panchang?.festivals?.[0]?.name || '';
  return (
  <Paper
  key={day.date.toISOString()}
  onClick={() => handleDayClick(day)}
  elevation={0}
  role="button"
  tabIndex={0}
  aria-label={`${day.date.getDate()} ${day.panchang.tithi.name}`}
  aria-pressed={isSelected}
  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDayClick(day); }}
  sx={{
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
  p: 1,
  minHeight: 48,
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 2,
  cursor: 'pointer',
  bgcolor: isSelected
  ? `${muiTheme.palette.primary.main}30`
  : day.isToday
  ? `${muiTheme.palette.primary.main}1A`
  : tithiColors.bg,
  border: isSelected || day.isToday
  ? `2px solid ${muiTheme.palette.primary.main}`
  : `1px solid ${tithiColors.borderColor}`,
  }}
  >
  <Box
  sx={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 48,
  minHeight: 48,
  justifyContent: 'center',
  flexShrink: 0,
  }}
  >
  <Typography sx={{ fontWeight: 500, fontSize: '1rem', lineHeight: 1.2, color: 'text.primary' }}>
  {day.date.getDate()}
  </Typography>
  <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', lineHeight: 1.2 }}>
  {day.date.toLocaleDateString('en-IN', { month: 'short' })}
  </Typography>
  </Box>
  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0, minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}>
  {day.isFestival && (
  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
  )}
  {day.isFasting && (
  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'success.main' }} />
  )}
  {!day.isFestival && !day.isFasting && (
  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: tithiColors.color }} />
  )}
  </Box>
  <Box sx={{ flex: 1, minWidth: 0 }}>
  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
  {day.date.toLocaleDateString('en-IN', { weekday: 'long' })}
  </Typography>
  <Typography variant="caption" sx={{ color: tithiColors.color, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
  {festivalName || tithiName}
  </Typography>
  </Box>
  </Paper>
  );
  })}
  </Box>
  ) : (
  <Box
  sx={{
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: { sm: '6px', md: '8px' },
  p: { sm: '6px', md: '8px' },
  width: '100%',
  overflow: 'visible',
  boxSizing: 'border-box',
  }}
  >
  {emptyDays.map((_, i) => (
  <Box key={`empty-${i}`} />
         ))}

        {calendarDays.map((day) => {
 const tithiName = day.panchang.tithi.name;
 const tithiColors = getTithiColors(tithiName, day);
 const isSelected =
 selectedDay?.date.toDateString() === day.date.toDateString();
 const isTodayDate = day.isToday;
 const dayOfWeek = day.date.getDay();
 const isSunday = dayOfWeek === 0;
 const isSaturday = dayOfWeek === 6;
 const isImportant = day.isFestival || day.isFasting || day.customTithis.length > 0 ||
 tithiName.includes('Purnima') || tithiName.includes('Amavasya') || tithiName.includes('Ekadashi');
 const festivalName = day.panchang?.festivals?.[0]?.name || '';

 return (
 <Paper
 key={day.date.toISOString()}
 onClick={() => handleDayClick(day)}
  onTouchStart={() => setGestureState({ isSwiping: false, direction: null, velocity: 0 })}
  onTouchMove={() => {}}
  elevation={0}
 role="button"
 tabIndex={0}
 aria-label={`${day.date.getDate()} ${day.panchang.tithi.name}`}
 aria-pressed={isSelected}
 onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDayClick(day); }}
 sx={{
 position: 'relative',
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
 justifyContent: 'flex-start',
 cursor: 'pointer',
 p: calendarCellPadding,
 minHeight: calendarCellMinHeight,
 minWidth: 0,
 width: '100%',
 borderRadius: 2,
  bgcolor: isSelected
  ? `${muiTheme.palette.primary.main}30`
  : isTodayDate
  ? `${muiTheme.palette.primary.main}1A`
  : tithiColors.bg,
  border: isSelected
  ? `2px solid ${muiTheme.palette.primary.main}`
  : isTodayDate
  ? `2px solid ${muiTheme.palette.primary.main}`
  : `1px solid ${tithiColors.borderColor}`,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: isSelected ? 'scale(1.04)' : 'scale(1)',
  boxShadow: isSelected
  ? (isDark ? `0 0 12px ${muiTheme.palette.primary.main}60, 0 4px 12px rgba(0,0,0,0.3)` : `0 0 12px ${muiTheme.palette.primary.main}40, 0 4px 12px rgba(0,0,0,0.12)`)
  : isTodayDate
  ? (isDark ? `0 2px 8px ${muiTheme.palette.primary.main}40` : `0 2px 8px ${muiTheme.palette.primary.main}30`)
  : undefined,
 overflow: 'hidden',
 '&:hover': {
 bgcolor: isSelected
 ? `${muiTheme.palette.primary.main}40`
 : isTodayDate
 ? `${muiTheme.palette.primary.main}20`
 : `${muiTheme.palette.primary.main}12`,
 transform: isSelected ? 'scale(1.04)' : 'scale(1.03)',
 },
 '&:active': {
 transform: 'scale(0.97)',
 },
 }}
 >
  {/* Festival dot — theme-token saffron marker */}
  {day.isFestival && (
  <Box
  sx={{
  position: 'absolute',
  top: 4,
  left: 4,
  width: 6,
  height: 6,
  borderRadius: '50%',
  bgcolor: 'primary.main',
  }}
  />
  )}

  {/* Day number */}
  <Typography
  sx={{
  fontWeight: 500,
  fontSize: dayNumberFontSize,
  lineHeight: 1,
  mt: 0,
  mb: 0.25,
 color: isTodayDate
 ? muiTheme.palette.primary.main
 : isSunday
 ? 'error.main'
 : isSaturday
 ? muiTheme.palette.primary.main
 : 'text.primary',
 }}
 >
 {day.date.getDate()}
 </Typography>

 {/* Festival name - visible on the calendar cell */}
 {day.isFestival && festivalName && (
 <Typography
 sx={{
  fontSize: festivalTextFontSize,
  fontWeight: 500,
  color: muiTheme.palette.primary.main,
 lineHeight: 1.1,
 textAlign: 'center',
 maxWidth: '100%',
 overflow: 'hidden',
 textOverflow: 'ellipsis',
 whiteSpace: 'nowrap',
 mb: 0.25,
 }}
 >
  {festivalName}
 </Typography>
 )}

 {/* Tithi name */}
 <Typography
 sx={{
 fontSize: tithiTextFontSize,
 fontWeight: 500,
 color: tithiColors.color,
 bgcolor: 'transparent',
 px: 0.25,
 py: 0.1,
 borderRadius: 0.75,
 lineHeight: 1.2,
 maxWidth: '100%',
 overflow: 'hidden',
 textOverflow: 'ellipsis',
 whiteSpace: 'nowrap',
 textAlign: 'center',
 }}
 >
  {tithiName.split(' ')[0]}
 </Typography>

 {day.customTithis.length > 0 && (
 <Box
 sx={{
 position: 'absolute',
 bottom: 3,
 right: 3,
 width: 6,
 height: 6,
  borderRadius: '50%',
  bgcolor: 'warning.main',
 }}
 />
 )}

  {day.isFasting && !day.isFestival && (
  <Box
  sx={{
  position: 'absolute',
  top: 4,
  right: 4,
  width: 6,
  height: 6,
  borderRadius: '50%',
  bgcolor: 'success.main',
  }}
  />
  )}
 </Paper>
  );
  })}
  </Box>
  )}
  </Paper>
  </animated.div>
  </Fade>

 {/* Day Details Panel - bottom sheet on mobile, inline panel on desktop */}
 {selectedDay && (
 <Fade in timeout={400}>
 <Box
 sx={{
 position: isMobile ? 'fixed' : 'relative',
 bottom: isMobile ? 0 : 'auto',
 left: isMobile ? 0 : 'auto',
 right: isMobile ? 0 : 'auto',
   zIndex: isMobile ? 1300 : 'auto',
   mt: { sm: 1.5 },
  mx: { sm: 0 },
  // No nested scroller on desktop: the page scrolls, so the sticky header
  // below sticks to the viewport. Single scroller only in the mobile sheet.
  maxHeight: isMobile ? '85vh' : 'none',
  overflow: 'visible',
  }}
  >
 {/* Backdrop on mobile */}
 {isMobile && (
 <Box
 onClick={() => setSelectedDay(null)}
 sx={{
 position: 'fixed',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 bgcolor: 'rgba(0,0,0,0.45)',
 zIndex: 1299,
 }}
 />
 )}
 <Paper
 elevation={0}
 sx={{
 position: isMobile ? 'relative' : 'relative',
 zIndex: isMobile ? 1301 : 'auto',
  borderRadius: isMobile ? '16px 16px 0 0' : 2,
 bgcolor: 'background.paper',
 border: '1px solid',
 borderColor: 'divider',
  maxHeight: isMobile ? '85vh' : 'none',
  overflowY: isMobile ? 'auto' : 'visible',
  overflowX: 'clip',
  pb: isMobile ? 'env(safe-area-inset-bottom, 8px)' : 0,
  }}
  >
 {/* Drag handle on mobile */}
 {isMobile && (
 <Box
 sx={{
 display: 'flex',
 justifyContent: 'center',
 pt: 1,
 pb: 0.5,
 }}
 >
 <Box
 sx={{
 width: 36,
 height: 4,
 borderRadius: 2,
 bgcolor: muiTheme.palette.action.disabled,
 }}
 />
 </Box>
 )}
  {/* Sticky header - stays visible while scrolling */}
  <Box
  sx={{
   position: 'sticky',
   // Token-derived offset: 0 inside the mobile bottom sheet (own scroller),
   // theme.spacing(7) (= AppBar Toolbar minHeight) on sm+ where the page scrolls.
   top: { xs: 0, sm: muiTheme.spacing(7) },
  zIndex: 10,
  px: { xs: 1.5, sm: 2 },
  py: { xs: 1, sm: 1.25 },
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 bgcolor: `${muiTheme.palette.primary.main}15`,
 borderBottom: '1px solid',
 borderColor: `${muiTheme.palette.primary.main}25`,
 backdropFilter: 'blur(8px)',
 flexWrap: 'wrap',
 gap: 1,
 }}
 >
 <Box sx={{ minWidth: 0, flex: 1 }}>
  <Typography
  variant="h6"
  sx={{ fontWeight: 500, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.15rem' }, wordBreak: 'break-word', letterSpacing: '-0.02em', lineHeight: 1.3 }}
 >
 {selectedDay.date.toLocaleDateString('en-IN', {
 weekday: 'long',
 day: 'numeric',
 month: 'long',
 })}
 </Typography>
 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', mt: 0.25 }}>
 {selectedDay.panchang?.var?.name || ''}
 {selectedDay.panchang?.samvatsara && ` · ${selectedDay.panchang.samvatsara}`}
 </Typography>
 </Box>
 <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
 <IconButton
 size="medium"
 onClick={handleShareDay}
 aria-label="Share selected day"
 sx={{
  color: 'success.main',
  minWidth: 48,
  minHeight: 48,
 '&:hover': { bgcolor: `${muiTheme.palette.success.main}15` },
 }}
 >
 <Share2Icon size={20} />
 </IconButton>
 <IconButton
 size="medium"
 onClick={() => setSelectedDay(null)}
 aria-label="Close day details"
 sx={{
  color: 'error.main',
  minWidth: 48,
  minHeight: 48,
 '&:hover': { bgcolor: `${muiTheme.palette.error.main}15` },
 }}
 >
 <XIcon size={20} />
 </IconButton>
 </Box>
 </Box>

  {/* Scrollable content */}
  <Box sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1.5, sm: 1.5 } }}>
 {/* Auspiciousness badge */}
 {(() => {
 const tithiName = selectedDay.panchang?.tithi?.name || '';
 const isAuspicious = tithiName.includes('Purnima') || tithiName.includes('Ekadashi') || selectedDay.isFestival;
 const isFasting = tithiName.includes('Ekadashi') || tithiName.includes('Chaturdashi') || selectedDay.isFasting;
 let badgeLabel = 'Normal';
 let badgeColor = `${muiTheme.palette.success.main}20`;
 let badgeTextColor = muiTheme.palette.success.main;
 if (isAuspicious) {
 badgeLabel = 'Auspicious';
 badgeColor = `${muiTheme.palette.warning.main}20`;
 badgeTextColor = muiTheme.palette.warning.main;
 }
 if (isFasting) {
 badgeLabel = 'Fasting Day';
 badgeColor = `${muiTheme.palette.success.main}25`;
 badgeTextColor = muiTheme.palette.success.main;
 }
 return (
 <Chip
 label={badgeLabel}
 size="small"
  sx={{
  mb: 1.5,
  height: 24,
  fontSize: '0.7rem',
 fontWeight: 500,
 bgcolor: badgeColor,
 color: badgeTextColor,
 border: `1px solid ${badgeTextColor}40`,
 letterSpacing: '0.03em',
 }}
 />
 );
 })()}

  {/* Tithi & Nakshatra — icon-led rows matching Today timings pattern */}
  <Box
  sx={{
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: { xs: 1, sm: 1.5 },
  mb: 1.5,
  }}
  >
  <Box
  sx={{
  p: 1.5,
  bgcolor: `${muiTheme.palette.primary.main}08`,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  }}
  >
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
  <Box
  sx={{
  width: 36,
  height: 36,
  borderRadius: 1.5,
  bgcolor: `${muiTheme.palette.primary.main}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  }}
  >
  <MoonIcon size={18} color={muiTheme.palette.primary.main} />
 </Box>
 <Typography
 sx={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: 'primary.main', fontWeight: 500, textTransform: 'uppercase' }}
 >
 Tithi
 </Typography>
 </Box>
 <Typography
 variant="body2"
 sx={{ fontWeight: 500, color: 'text.primary', mb: 0.25, fontSize: '0.95rem' }}
 >
 {selectedDay.panchang?.tithi?.name || '--'}
 </Typography>
 {selectedDay.panchang?.tithi?.nameHindi && (
 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
 {selectedDay.panchang.tithi.nameHindi}
 </Typography>
 )}
 {selectedDay.panchang?.tithi?.paksha && (
 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
 {selectedDay.panchang.tithi.paksha} Paksha
 </Typography>
 )}
 {selectedDay.panchang?.tithi?.endTime && (
 <Box sx={{ mt: 0.75, px: 1, py: 0.5, bgcolor: muiTheme.palette.action.hover, borderRadius: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
 <ClockIcon size={11} color={muiTheme.palette.text.secondary} />
 <Typography variant="caption" sx={{ color: muiTheme.palette.text.secondary, fontSize: '0.7rem', fontWeight: 500 }}>
 Ends {formatTime(selectedDay.panchang.tithi.endTime)}
 </Typography>
 </Box>
 )}
 </Box>

  <Box
  sx={{
  p: 1.5,
  bgcolor: `${muiTheme.palette.secondary.main}08`,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  }}
  >
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
  <Box
  sx={{
  width: 36,
  height: 36,
  borderRadius: 1.5,
  bgcolor: `${muiTheme.palette.secondary.main}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  }}
  >
  <StarIcon size={18} color={muiTheme.palette.secondary.main} />
 </Box>
 <Typography
 sx={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: 'secondary.main', fontWeight: 500, textTransform: 'uppercase' }}
 >
 {t('panchang.nakshatra') || 'Nakshatra'}
 </Typography>
 </Box>
 <Typography
 variant="body2"
 sx={{ fontWeight: 500, color: 'text.primary', mb: 0.25, fontSize: '0.95rem' }}
 >
 {selectedDay.panchang?.nakshatra?.name || '--'}
 </Typography>
 {selectedDay.panchang?.nakshatra?.nameHindi && (
 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
 {selectedDay.panchang.nakshatra.nameHindi}
 </Typography>
 )}
 {selectedDay.panchang?.nakshatra?.ruler && (
 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
 Ruler: {selectedDay.panchang.nakshatra.ruler}
 </Typography>
 )}
 {selectedDay.panchang?.nakshatra?.endTime && (
 <Box sx={{ mt: 0.75, px: 1, py: 0.5, bgcolor: muiTheme.palette.action.hover, borderRadius: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
 <ClockIcon size={11} color={muiTheme.palette.text.secondary} />
 <Typography variant="caption" sx={{ color: muiTheme.palette.text.secondary, fontSize: '0.7rem', fontWeight: 500 }}>
 Ends {formatTime(selectedDay.panchang.nakshatra.endTime)}
 </Typography>
 </Box>
 )}
 </Box>
 </Box>

  {/* Yoga, Karana & Solar — icon-led, Today timings rhythm */}
  <Box
  sx={{
  display: 'grid',
  gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
  gap: { xs: 1, sm: 1.5 },
  mb: 1.5,
  }}
  >
  <Box
  sx={{
  p: 1.25,
  bgcolor: `${muiTheme.palette.warning.main}08`,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  }}
  >
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: `${muiTheme.palette.warning.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
  <SunIcon size={16} color={muiTheme.palette.warning.main} />
  </Box>
  <Typography
  sx={{ fontSize: '0.65rem', letterSpacing: '0.08em', color: 'warning.main', fontWeight: 500, textTransform: 'uppercase' }}
  >
  {t('panchang.yoga') || 'Yoga'}
  </Typography>
  </Box>
 <Typography
 variant="body2"
 sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.85rem' }}
 >
 {selectedDay.panchang?.yoga?.name || '--'}
 </Typography>
 {selectedDay.panchang?.yoga?.nameHindi && (
 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
 {selectedDay.panchang.yoga.nameHindi}
 </Typography>
 )}
 </Box>

  <Box
  sx={{
  p: 1.25,
  bgcolor: `${muiTheme.palette.info.main}08`,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  }}
  >
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: `${muiTheme.palette.info.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
  <ClockIcon size={16} color={muiTheme.palette.info.main} />
  </Box>
  <Typography
  sx={{ fontSize: '0.65rem', letterSpacing: '0.08em', color: 'info.main', fontWeight: 500, textTransform: 'uppercase' }}
  >
  {t('panchang.karana') || 'Karana'}
  </Typography>
  </Box>
 <Typography
 variant="body2"
 sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.85rem' }}
 >
 {selectedDay.panchang?.karana?.name || '--'}
 </Typography>
 {selectedDay.panchang?.karana?.nameHindi && (
 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
 {selectedDay.panchang.karana.nameHindi}
 </Typography>
 )}
 {selectedDay.panchang?.karana?.type && (
 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
 {selectedDay.panchang.karana.type}
 </Typography>
 )}
 </Box>

  <Box
  sx={{
  p: 1.25,
  gridColumn: { xs: 'span 2', sm: 'span 1' },
  bgcolor: `${muiTheme.palette.warning.main}10`,
  borderRadius: 2,
  border: '1px solid',
  borderColor: `${muiTheme.palette.warning.main}30`,
  }}
  >
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: `${muiTheme.palette.warning.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
  <SunIcon size={16} color={muiTheme.palette.warning.main} />
  </Box>
  <Typography
  sx={{ fontSize: '0.65rem', letterSpacing: '0.08em', color: 'warning.main', fontWeight: 500, textTransform: 'uppercase' }}
  >
  {t('calendar.solar') || 'Solar'}
  </Typography>
  </Box>
 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <Box>
 <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', display: 'block' }}>Sunrise</Typography>
 <Typography variant="body2" sx={{ fontWeight: 500, color: 'warning.main', fontSize: '0.85rem' }}>
 {selectedDay.panchang?.sunrise ? formatTime(selectedDay.panchang.sunrise) : '--'}
 </Typography>
 </Box>
 <Box sx={{ textAlign: 'right' }}>
 <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', display: 'block' }}>Sunset</Typography>
 <Typography variant="body2" sx={{ fontWeight: 500, color: 'warning.main', fontSize: '0.85rem' }}>
 {selectedDay.panchang?.sunset ? formatTime(selectedDay.panchang.sunset) : '--'}
 </Typography>
 </Box>
 </Box>
 </Box>
 </Box>

  {/* Festivals — icon-led rows */}
  {selectedDay.panchang?.festivals && selectedDay.panchang.festivals.length > 0 && (
  <>
  <Divider sx={{ my: 1.5, borderColor: 'divider' }} />
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
 <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: 'success.main', fontWeight: 500, textTransform: 'uppercase' }}>
 Festivals
 </Typography>
 <Chip
 label={selectedDay.panchang.festivals.length}
 size="small"
 sx={{
 height: 18,
 fontSize: '0.6rem',
 fontWeight: 500,
 minWidth: 18,
 bgcolor: `${muiTheme.palette.success.main}20`,
 color: 'success.main',
 }}
 />
 </Box>
 {selectedDay.panchang.festivals.map((festival: any) => {
          const isExpanded = expandedFestivalId === (festival.id || festival.name);
          const festivalId = festival.id || festival.name;
          const hasFullStory = !!festivalId && onFestivalOpen;
          return (
 <Box
 key={festivalId}
  sx={{
  mb: 1,
  p: 1.5,
  bgcolor: `${muiTheme.palette.primary.main}08`,
 borderRadius: 2,
 border: '1px solid',
 borderColor: isExpanded
 ? `${muiTheme.palette.primary.main}50`
 : `${muiTheme.palette.primary.main}20`,
 transition: 'all 0.2s ease',
 }}
 >
 {/* Festival header - tap to open full story */}
 <Box
 onClick={() => {
 if (hasFullStory) {
 triggerHapticIfSupported('light');
 onFestivalOpen!(festivalId);
 }
 }}
  sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5, minHeight: 48, cursor: hasFullStory ? 'pointer' : 'default' }}
  >
  <Box
  sx={{
  width: 36,
  height: 36,
  borderRadius: 1.5,
  bgcolor: `${muiTheme.palette.primary.main}12`,
  border: `1px solid ${muiTheme.palette.primary.main}25`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  }}
  >
  <StarIcon size={18} color={muiTheme.palette.primary.main} />
  </Box>
 <Box sx={{ flex: 1, minWidth: 0 }}>
 <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main', lineHeight: 1.3 }}>
 {festival.name}
 </Typography>
 {festival.type && (
 <Chip
 label={festival.type}
 size="small"
 sx={{
 mt: 0.5,
 height: 18,
 fontSize: '0.6rem',
 fontWeight: 500,
 bgcolor: `${muiTheme.palette.success.main}15`,
 color: 'success.main',
 border: `1px solid ${muiTheme.palette.success.main}30`,
 }}
 />
 )}
 </Box>
 {/* View Story button when onFestivalOpen is available */}
 {hasFullStory && (
 <Chip
 label="View Story"
 size="small"
 onClick={() => {
 triggerHapticIfSupported('light');
 onFestivalOpen!(festivalId);
 }}
  sx={{
  minHeight: 48,
  fontSize: '0.65rem',
  fontWeight: 500,
  flexShrink: 0,
  mt: 0.25,
  cursor: 'pointer',
 bgcolor: `${muiTheme.palette.primary.main}25`,
 color: 'primary.main',
 border: `1px solid ${muiTheme.palette.primary.main}40`,
 '&:hover': {
 bgcolor: `${muiTheme.palette.primary.main}35`,
 },
 '&:active': {
 transform: 'scale(0.96)',
 },
 }}
 />
 )}
 </Box>

 {/* Expandable significance text - tap to expand/collapse */}
 {festival.significance && (
 <Box
 onClick={() => setExpandedFestivalId(isExpanded ? null : festivalId)}
 sx={{
 cursor: 'pointer',
 '&:hover': { opacity: 0.85 },
 }}
 >
 <Typography
 variant="body2"
 color="text.secondary"
 sx={{
 fontSize: '0.8rem',
 lineHeight: 1.65,
 mt: 0.75,
 pl: 0.25,
 maxHeight: isExpanded ? 'none' : '4.8em',
 overflow: 'hidden',
 textOverflow: 'ellipsis',
 display: '-webkit-box',
 WebkitLineClamp: isExpanded ? 'unset' : 3,
 WebkitBoxOrient: 'vertical',
 }}
 >
 {festival.significance}
 </Typography>
 <Typography sx={{ fontSize: '0.65rem', color: 'success.main', fontWeight: 500, mt: 0.5 }}>
 {isExpanded ? 'Show less' : 'Read More'}
 </Typography>
 </Box>
 )}
 {festival.description && isExpanded && festival.description !== festival.significance && (
 <Typography
 variant="body2"
 color="text.secondary"
 sx={{ fontSize: '0.8rem', lineHeight: 1.65, mt: 0.75, pl: 0.25 }}
 >
 {festival.description}
 </Typography>
 )}
 {festival.region && isExpanded && (
 <Typography
 variant="caption"
 sx={{ fontSize: '0.7rem', color: 'secondary.main', mt: 0.75, pl: 0.25, display: 'block' }}
 >
 Regions: {Array.isArray(festival.region) ? festival.region.join(', ') : festival.region}
 </Typography>
 )}
 </Box>
 );
        })}
 </>
 )}

  {/* Fasting — icon-led header */}
  {selectedDay.panchang?.fasting && (
  <>
  <Divider sx={{ my: 1.5, borderColor: 'divider' }} />
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: `${muiTheme.palette.success.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
  <LeafIcon size={16} color={muiTheme.palette.success.main} />
  </Box>
  <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: 'success.main', fontWeight: 500, textTransform: 'uppercase' }}>
  Fasting
  </Typography>
  </Box>
 <Box
 sx={{
 p: 1.5,
 bgcolor: `${muiTheme.palette.success.main}08`,
 borderRadius: 2,
 border: '1px solid',
 borderColor: `${muiTheme.palette.success.main}30`,
 }}
 >
 <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main', mb: 0.5, fontSize: '0.95rem' }}>
 {selectedDay.panchang.fasting.name}
 </Typography>
 {selectedDay.panchang.fasting.significance && (
 <Typography
 variant="body2"
 color="text.secondary"
 sx={{ fontSize: '0.8rem', lineHeight: 1.65 }}
 >
 {selectedDay.panchang.fasting.significance}
 </Typography>
 )}
 {selectedDay.panchang.fasting.paranaTime && (
 <Box sx={{ mt: 1, px: 1, py: 0.75, bgcolor: `${muiTheme.palette.success.main}10`, borderRadius: 1.5, border: '1px dashed', borderColor: `${muiTheme.palette.success.main}25` }}>
 <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 500, fontSize: '0.7rem', display: 'block', mb: 0.25 }}>
 Parana Time (Break Fast)
 </Typography>
 <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500, fontSize: '0.85rem' }}>
 {formatTime(selectedDay.panchang.fasting.paranaTime.start)} – {formatTime(selectedDay.panchang.fasting.paranaTime.end)}
 </Typography>
 </Box>
 )}
 </Box>
 </>
 )}

  {/* Rahu Kaal, Yamagandam, Gulika — icon-led timings rows (Today pattern) */}
  <Divider sx={{ my: 1.5, borderColor: 'divider' }} />
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
  <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: 'error.main', fontWeight: 500, textTransform: 'uppercase' }}>
  Inauspicious Periods
  </Typography>
  </Box>
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.75, sm: 1 } }}>
  <Box
  sx={{
  p: 1.25,
  bgcolor: `${muiTheme.palette.error.main}08`,
  borderRadius: 2,
  border: '1px solid',
  borderColor: `${muiTheme.palette.error.main}25`,
  flex: '1 1 calc(50% - 8px)',
  minWidth: { xs: 120, sm: 140 },
  }}
  >
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: `${muiTheme.palette.error.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
  <ClockIcon size={16} color={muiTheme.palette.error.main} />
  </Box>
  <Typography variant="caption" sx={{ color: 'error.main', fontSize: '0.65rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
  Rahu Kaal
  </Typography>
  </Box>
 <Typography variant="body2" sx={{ fontWeight: 500, color: 'error.main', fontSize: '0.85rem' }}>
 {selectedDay.panchang?.rahuKaal ? `${formatTime(selectedDay.panchang.rahuKaal.start)} – ${formatTime(selectedDay.panchang.rahuKaal.end)}` : '--'}
 </Typography>
 </Box>
  <Box
  sx={{
  p: 1.25,
  bgcolor: muiTheme.palette.action.hover,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  flex: '1 1 calc(50% - 8px)',
  minWidth: { xs: 120, sm: 140 },
  }}
  >
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: `${muiTheme.palette.text.secondary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
  <ClockIcon size={16} color={muiTheme.palette.text.secondary} />
  </Box>
  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
  Yamagandam
  </Typography>
  </Box>
 <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.85rem' }}>
 {selectedDay.panchang?.yamagandam ? `${formatTime(selectedDay.panchang.yamagandam.start)} – ${formatTime(selectedDay.panchang.yamagandam.end)}` : '--'}
 </Typography>
 </Box>
  {selectedDay.panchang?.gulikaKaal && (
  <Box
  sx={{
  p: 1.25,
  bgcolor: `${muiTheme.palette.secondary.main}08`,
  borderRadius: 2,
  border: '1px solid',
  borderColor: `${muiTheme.palette.secondary.main}25`,
  flex: '1 1 calc(50% - 8px)',
  minWidth: { xs: 120, sm: 140 },
  }}
  >
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
  <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: `${muiTheme.palette.secondary.main}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
  <ClockIcon size={16} color={muiTheme.palette.secondary.main} />
  </Box>
  <Typography variant="caption" sx={{ color: 'secondary.main', fontSize: '0.65rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
  Gulika Kaal
  </Typography>
  </Box>
 <Typography variant="body2" sx={{ fontWeight: 500, color: 'secondary.main', fontSize: '0.85rem' }}>
 {formatTime(selectedDay.panchang.gulikaKaal.start)} – {formatTime(selectedDay.panchang.gulikaKaal.end)}
 </Typography>
 </Box>
 )}
 </Box>

  {/* Close button on mobile */}
  {isMobile && (
  <Box sx={{ mt: 1.5, pb: 1 }}>
 <Box
 onClick={() => setSelectedDay(null)}
 sx={{
 width: '100%',
 py: 1.5,
 borderRadius: 2,
 bgcolor: muiTheme.palette.action.hover,
 color: 'text.primary',
 fontWeight: 500,
 fontSize: '0.9rem',
  textAlign: 'center',
  cursor: 'pointer',
  minHeight: 48,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 '&:active': { transform: 'scale(0.98)' },
 transition: 'transform 0.1s',
 }}
 >
 Close
 </Box>
 </Box>
 )}
 </Box>
 </Paper>
 </Box>
 </Fade>
 )}

  <Fade in timeout={600}>
  <Box sx={{ mt: 1.5 }}>
  <SectionCard>
   {/* Legend wraps (and scrolls horizontally if needed) — never clips. */}
   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', overflow: 'visible', maxWidth: '100%' }}>
   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minHeight: 48, minWidth: 48 }}>
   <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
   <Typography variant="caption" color="text.secondary">{t('calendar.legend.festival') || 'Festival'}</Typography>
   </Box>
   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minHeight: 48, minWidth: 48 }}>
   <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
  <Typography variant="caption" color="text.secondary">{t('calendar.legend.fast') || 'Fast'}</Typography>
  </Box>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minHeight: 48, minWidth: 48 }}>
  <Box
  sx={{
  px: 0.75,
  py: 0.1,
  borderRadius: 0.75,
  bgcolor: `${muiTheme.palette.warning.main}20`,
  }}
  >
  <Typography sx={{ fontSize: '0.55rem', fontWeight: 500, color: 'warning.main' }}>{t('calendar.legend.purnima') || 'Purnima'}</Typography>
  </Box>
  </Box>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minHeight: 48, minWidth: 48 }}>
  <Box
  sx={{
  px: 0.75,
  py: 0.1,
  borderRadius: 0.75,
  bgcolor: `${muiTheme.palette.secondary.main}20`,
  }}
  >
  <Typography sx={{ fontSize: '0.55rem', fontWeight: 500, color: 'secondary.main' }}>{t('calendar.legend.amavasya') || 'Amavasya'}</Typography>
  </Box>
  </Box>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minHeight: 48, minWidth: 48 }}>
  <Box
  sx={{
  px: 0.75,
  py: 0.1,
  borderRadius: 0.75,
  bgcolor: `${muiTheme.palette.success.main}15`,
  }}
  >
  <Typography sx={{ fontSize: '0.55rem', fontWeight: 500, color: 'success.main' }}>{t('calendar.legend.ekadashi') || 'Ekadashi'}</Typography>
  </Box>
  </Box>
  <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', fontStyle: 'italic' }}>
  {t('calendar.legend.tapForDetails') || 'Tap a day for details'}
  </Typography>
  </Box>
   </SectionCard>
   </Box>
   </Fade>

  <Snackbar
 open={snackbar.open}
 autoHideDuration={4000}
 onClose={() => setSnackbar({ ...snackbar, open: false })}
 anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
 sx={{ mb: 9 }}
 >
 <Alert
 severity={snackbar.severity}
 onClose={() => setSnackbar({ ...snackbar, open: false })}
 sx={{ borderRadius: 2, fontWeight: 500 }}
 >
 {snackbar.message}
 </Alert>
 </Snackbar>  </ScreenContainer>
 );
};

export default CalendarScreen;
