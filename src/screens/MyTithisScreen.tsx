/**
 * MyTithisScreen - Custom Tithi Management (REVAMPED)
 * 
 * Modern design with:
 * - Clean card-based layout
 * - Easy CRUD operations
 * - Reminder management
 * - Export/Import functionality
 * - Ad integration
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Chip,
  Alert,
  Tooltip,
  Fab,
  Zoom,
  Fade,
  useTheme as useMuiTheme,
  Divider,
  Collapse,
  Snackbar,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Plus,
  Delete,
  Edit,
  Bell,
  BellOff,
  Calendar,
  Download,
  Upload,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  Share2,
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { notificationService } from '../services/notificationService';
import { shareContent } from '../utils/share';
import { buildDayLink } from '../utils/dayLink';
import { useI18n } from '../hooks/useI18n';
import { CustomTithi } from '../types';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionCard } from '../components/layout/SectionCard';
import { AlertStack } from '../components/layout/AlertStack';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { LUNAR_MONTHS, LUNAR_MONTHS_HINDI } from '../engine/constants';
import { format, differenceInDays } from 'date-fns';

export const MyTithisScreen: React.FC = () => {
  const { t, currentLanguage } = useI18n();
  const muiTheme = useMuiTheme();
  const { isMobile } = useBreakpoints();
  // Preserve legacy up('sm') semantics (>=600) previously read via useMediaQuery.
  const isTablet = !isMobile;
  void isMobile;
  const isHindi = currentLanguage === 'hi';

  const {
    customTithis, 
    addCustomTithi, 
    updateCustomTithi, 
    deleteCustomTithi, 
    getNextOccurrences, 
    exportCustomTithis, 
    importCustomTithis,
    preferences,
    calculatePanchang,
  } = useAppStore();
  const locationTimeZone = preferences.location.timezone;
  
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CustomTithi | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importResult, setImportResult] = useState<{ success: boolean; imported: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    nameHindi: '',
    tithiNumber: 1,
    paksha: 'Shukla' as 'Shukla' | 'Krishna',
    month: 0,
    isRecurring: true,
    customDate: '',
    notes: '',
    reminderEnabled: false,
    reminderTime: '06:00',
    reminderDaysBefore: 1,
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const [formErrors, setFormErrors] = useState<{ name?: string; customDate?: string }>({});
  // "Pick from date": user chose a past/present/future Gregorian date instead
  // of knowing the tithi — resolved summary shown under the picker.
  const [pickDate, setPickDate] = useState('');
  const [pickedSummary, setPickedSummary] = useState<string | null>(null);

  const handlePickDate = (value: string) => {
    setPickDate(value);
    if (!value) {
      setPickedSummary(null);
      return;
    }
    try {
      const d = new Date(value + 'T12:00:00');
      if (isNaN(d.getTime())) {
        setPickedSummary(null);
        return;
      }
      const p = calculatePanchang(d);
      setFormData((f) => ({
        ...f,
        tithiNumber: p.tithi.number,
        paksha: p.tithi.paksha,
        month: (p.lunarMonth ?? 1) - 1,
        customDate: value,
      }));
      const monthName = isHindi
        ? LUNAR_MONTHS_HINDI[(p.lunarMonth ?? 1) - 1]
        : LUNAR_MONTHS[(p.lunarMonth ?? 1) - 1];
      const tithiName = isHindi ? p.tithi.nameHindi : p.tithi.name;
      setPickedSummary(
        isHindi
          ? `उस दिन: ${p.tithi.paksha === 'Shukla' ? 'शुक्ल' : 'कृष्ण'} ${tithiName}, ${monthName} मास`
          : `That day: ${p.tithi.paksha} ${tithiName}, ${monthName} Maas`
      );
    } catch {
      setPickedSummary(null);
    }
  };

  // Sacred times render in the LOCATION timezone (never the device default):
  // engine instants are untouched; only this display formatter threads
  // `timeZone: preferences.location.timezone`.
  const formatOccurrence = (date: Date) => {
    try {
      return new Intl.DateTimeFormat([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: locationTimeZone,
      }).format(date);
    } catch {
      return format(date, 'EEE, MMM d, yyyy');
    }
  };
  const deviceTimeZone = (() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ''; }
  })();
  const showTzNote = !!deviceTimeZone && !!locationTimeZone && deviceTimeZone !== locationTimeZone;

  const showMessage = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Ensure browser notification permission before enabling a reminder.
  // Returns true when reminders can actually be scheduled.
  const ensureReminderPermission = async (): Promise<boolean> => {
    const permission = notificationService.checkPermission();
    if (permission === 'granted') return true;
    if (permission === 'denied') {
      showMessage(
        t('notifications.permissionDenied') || 'Notifications are blocked — enable them in browser settings to use reminders',
        'error'
      );
      return false;
    }
    const granted = await notificationService.requestPermission();
    if (!granted) {
      showMessage(
        t('notifications.permissionRequired') || 'Notification permission is required to schedule reminders',
        'error'
      );
      return false;
    }
    return true;
  };

  const handleOpen = (tithi?: CustomTithi) => {
    setFormErrors({});
    // Reset the date-picker helper (edit mode pre-fills it from customDate).
    setPickDate(tithi?.customDate ? new Date(tithi.customDate).toISOString().split('T')[0] : '');
    setPickedSummary(null);
    if (tithi) {
      setEditing(tithi);
      setFormData({
        name: tithi.name,
        nameHindi: tithi.nameHindi || '',
        tithiNumber: tithi.tithiNumber,
        paksha: tithi.paksha,
        month: tithi.month,
        isRecurring: tithi.isRecurring,
        customDate: tithi.customDate ? tithi.customDate.toISOString().split('T')[0] : '',
        notes: tithi.notes || '',
        reminderEnabled: tithi.reminderEnabled,
        reminderTime: tithi.reminderTime || '06:00',
        reminderDaysBefore: tithi.reminderDaysBefore ?? 1,
      });
    } else {
      setEditing(null);
      setFormData({
        name: '',
        nameHindi: '',
        tithiNumber: 1,
        paksha: 'Shukla',
        month: 0,
        isRecurring: true,
        customDate: '',
        notes: '',
        reminderEnabled: false,
        reminderTime: '06:00',
        reminderDaysBefore: 1,
      });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    // Empty-name validation (after trim) + one-time date required when
    // non-recurring. Inline errors en+hi; never save invalid.
    const nextErrors: { name?: string; customDate?: string } = {};
    if (formData.name.trim() === '') {
      nextErrors.name = isHindi ? 'कृपया नाम भरें' : 'Please enter a name';
    }
    if (!formData.isRecurring && formData.customDate.trim() === '') {
      nextErrors.customDate = isHindi ? 'एक बार की तिथि के लिए तारीख चुनें' : 'Pick a date for a one-time tithi';
    }
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const data = {
      ...formData,
      month: Number(formData.month),
      tithiNumber: Number(formData.tithiNumber),
      reminderDaysBefore: Math.min(7, Math.max(0, Number(formData.reminderDaysBefore) || 0)),
      customDate: formData.customDate ? new Date(formData.customDate) : undefined,
    };

    // Request notification permission inline: without it the reminder would
    // silently never fire. On denial, save with the reminder off and tell the user.
    if (data.reminderEnabled) {
      const allowed = await ensureReminderPermission();
      if (!allowed) {
        data.reminderEnabled = false;
      }
    }

    if (editing) {
      updateCustomTithi(editing.id, data);
    } else {
      addCustomTithi(data);
    }
    if (data.reminderEnabled) {
      showMessage(t('myTithis.reminderSet') || 'Reminder scheduled', 'success');
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(t('myTithis.deleteConfirm') || 'Delete this tithi?')) {
      deleteCustomTithi(id);
    }
  };

  const handleToggleReminder = async (tithi: CustomTithi) => {
    // Enabling needs permission first — otherwise scheduling silently drops.
    if (!tithi.reminderEnabled) {
      const allowed = await ensureReminderPermission();
      if (!allowed) return;
    }
    updateCustomTithi(tithi.id, { reminderEnabled: !tithi.reminderEnabled });
  };

  // Share a saved tithi: next occurrence date + day deep link (?d=), so the
  // recipient opens the exact tithi day in the app with an install nudge.
  const handleShareTithi = async (tithi: CustomTithi) => {
    const occurrences = getNextOccurrences(tithi.id);
    const next = occurrences[0] ?? tithi.customDate ?? null;
    if (!next) {
      showMessage(
        isHindi ? 'साझा करने के लिए कोई आगामी तारीख नहीं है' : 'No upcoming date to share',
        'info'
      );
      return;
    }
    const nextDate = next instanceof Date ? next : new Date(next);
    const tithiLine = isHindi
      ? `तिथि ${tithi.tithiNumber} - ${tithi.paksha} पक्ष`
      : `Tithi ${tithi.tithiNumber} - ${tithi.paksha} Paksha`;
    const dateLabel = nextDate.toLocaleDateString(isHindi ? 'hi-IN' : undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const text = isHindi
      ? `${tithiLine}\nअगली: ${dateLabel}\n\nयह तिथि खोलें: ${buildDayLink(nextDate)}`
      : `${tithiLine}\nNext: ${dateLabel}\n\nOpen this tithi: ${buildDayLink(nextDate)}`;
    await shareContent({ title: tithi.name, text });
    showMessage(isHindi ? 'साझा किया!' : 'Shared!', 'success');
  };

  const handleExport = async () => {
    if (customTithis.length === 0) {
      showMessage(
        isHindi ? 'निर्यात करने के लिए कोई तिथि नहीं है — पहले एक तिथि जोड़ें' : 'Nothing to export yet — add a tithi first',
        'info'
      );
      return;
    }
    const json = exportCustomTithis();
    // Download as a file; fall back to clipboard when download fails.
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vedatime-tithis.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showMessage(t('myTithis.exported') || 'Tithis exported', 'success');
    } catch {
      try {
        await navigator.clipboard.writeText(json);
        showMessage(t('myTithis.exportCopied') || 'Export copied to clipboard', 'success');
      } catch {
        showMessage(t('myTithis.exportFailed') || 'Export failed', 'error');
      }
    }
  };

  const handleImportFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        handleImportText(text);
      };
      reader.readAsText(file);
    }
    // Reset so the same file can be picked again.
    event.target.value = '';
  };

  const handleImportText = (text: string) => {
    try {
      const result = importCustomTithis(text);
      setImportResult(result);
      if (result.success) {
        setTimeout(() => setImportDialogOpen(false), 2000);
      }
    } catch (error) {
      setImportResult({ success: false, imported: 0, errors: ['Invalid JSON format'] });
    }
  };

  return (
    <ScreenContainer sx={{ pt: 2 }}>
      {/* Header */}
      <Zoom in timeout={500}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={22} color={muiTheme.palette.primary.main} />
              </Box>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 500, 
                    color: 'text.primary',
                    fontSize: isTablet ? '1.5rem' : '1.25rem',
                  }}
                >
                  {t('myTithis.title')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {customTithis.length} {t('myTithis.saved') || 'saved'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => handleOpen()}
              sx={{
                borderRadius: 1,
                px: 2.5,
                py: 1,
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: (theme) => `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {t('myTithis.addNew')}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Download size={18} />}
              onClick={handleExport}
              sx={{
                borderRadius: 1,
                px: 2.5,
                py: 1,
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              {t('myTithis.export')}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Upload size={18} />}
              onClick={() => setImportDialogOpen(true)}
              sx={{
                borderRadius: 1,
                px: 2.5,
                py: 1,
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              {t('myTithis.import')}
            </Button>
          </Box>
        </Box>
      </Zoom>

      {/* Tithi List */}
      {customTithis.length === 0 ? (
        <Fade in timeout={500}>
          <SectionCard>
            <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Calendar size={40} color={muiTheme.palette.primary.main} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
              {t('myTithis.empty') || 'No Custom Tithis Yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('myTithis.emptySubtitle') || 'Add your family rituals, regional festivals, or personal observances'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, lineHeight: 1.6 }}>
              {isHindi
                ? 'कोई लॉगिन नहीं — तिथि जोड़ें, रिमाइंडर चालू करें, ऐप खोलते ही याद पाएँ। सब कुछ आपके फ़ोन पर रहता है (आपके शहर का नाम जानने के लिए एक बार का मानचित्र अनुरोध छोड़कर)।'
                : 'No login needed — add a tithi, turn on its reminder, and you’ll be reminded when you open the app. Everything stays on your phone (apart from a one-time map lookup that names your city).'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => handleOpen()}
              sx={{
                borderRadius: 1,
                px: 3,
                py: 1,
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              {t('myTithis.addFirst')}
            </Button>
            </Box>
          </SectionCard>
        </Fade>
      ) : (
        <List sx={{ px: 0 }}>
          {customTithis.map((tithi, index) => {
            const isExpanded = expandedId === tithi.id;
            const occurrences = getNextOccurrences(tithi.id);

            return (
              <Fade in timeout={500 + (index * 50)} key={tithi.id}>
                <SectionCard>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Sparkles size={24} color={muiTheme.palette.primary.main} />
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 500,
                              color: 'text.primary',
                              fontSize: '1rem',
                            }}
                          >
                            {tithi.name}
                          </Typography>
                          {tithi.isRecurring && (
                            <Chip
                              label={t('myTithis.recurring') || 'Recurring'}
                              size="small"
                              sx={{
                                fontSize: '0.65rem',
                                fontWeight: 500,
                                bgcolor: 'success.light',
                                color: 'success.main',
                                height: 22,
                              }}
                            />
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Tithi {tithi.tithiNumber} - {tithi.paksha} Paksha
                        </Typography>

                        {tithi.notes && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ 
                              display: 'block', 
                              mb: 1,
                              lineHeight: 1.5,
                            }}
                          >
                            {tithi.notes.substring(0, 80)}{tithi.notes.length > 80 ? '...' : ''}
                          </Typography>
                        )}

                        {/* Reminder Status */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {tithi.reminderEnabled ? (
                            <Chip
                              icon={<Bell size={14} />}
                              label={tithi.reminderTime}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                bgcolor: 'success.light',
                                color: 'success.main',
                                height: 26,
                              }}
                            />
                          ) : (
                            <Chip
                              icon={<BellOff size={14} />}
                              label={t('myTithis.noReminder') || 'No reminder'}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                height: 26,
                              }}
                            />
                          )}
                        </Box>

                        {/* Plain-language reminder line (reuses the form's option labels) */}
                        {tithi.reminderEnabled && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, minWidth: 0 }}>
                            <Bell size={14} color={muiTheme.palette.text.secondary} />
                            <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tithi.reminderTime} · {(tithi.reminderDaysBefore ?? 1) === 0
                                ? (isHindi ? 'उसी दिन' : 'On the day')
                                : isHindi
                                  ? `${tithi.reminderDaysBefore} दिन पहले`
                                  : `${tithi.reminderDaysBefore} day${(tithi.reminderDaysBefore ?? 1) > 1 ? 's' : ''} before`}
                            </Typography>
                          </Box>
                        )}

                        {/* Next Occurrences with Countdown */}
                        {isExpanded && occurrences.length > 0 && (
                          <Fade in timeout={300}>
                            <Box sx={{ mt: 1.5, p: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04), borderRadius: 1, border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.15)}` }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                <Clock size={16} color={muiTheme.palette.primary.main} />
                <Typography variant="caption" sx={{ fontWeight: 500, color: muiTheme.palette.primary.main }}>
                                  {t('myTithis.nextOccurrences') || 'Next Occurrences'}:
                                </Typography>
                              </Box>
                              {occurrences.slice(0, 5).map((date, i) => {                                const daysUntil = differenceInDays(date, new Date());
                                const comingInText = daysUntil === 0 
                                  ? (isHindi ? 'आज' : 'Today')
                                  : daysUntil === 1 
                                    ? (isHindi ? 'कल' : 'Tomorrow')
                                    : (isHindi ? `${daysUntil} दिन में` : `In ${daysUntil} days`);
                                
                                return (
                                  <Box
                                    key={i}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      mb: 0.5,
                                      p: 0.75,
                                      bgcolor: 'background.paper',
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: daysUntil <= 3 ? muiTheme.palette.primary.main : muiTheme.palette.success.main,
                                        }}
                                      />
                                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                        {formatOccurrence(date)}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      label={comingInText}
                                      size="small"
                                      sx={{
                                        fontSize: '0.65rem',
                                        fontWeight: 500,
                                        bgcolor: daysUntil <= 3 ? 'warning.light' : 'success.light',
                                        color: daysUntil <= 3 ? 'warning.dark' : 'success.main',
                                        height: 22,
                                      }}
                                    />
                                  </Box>
                                );
                              })}
                              {showTzNote && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                  {isHindi
                                    ? `तिथियाँ ${locationTimeZone} समय में दिख रही हैं`
                                    : `Dates shown in ${locationTimeZone} time`}
                                </Typography>
                              )}
                            </Box>
                          </Fade>
                        )}
                      </Box>

                      {/* Actions */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Tooltip title={tithi.reminderEnabled ? 'Disable reminder' : 'Enable reminder'}>
                          <IconButton
                            aria-label={tithi.reminderEnabled ? 'Disable reminder' : 'Enable reminder'}
                            size="small"
                            onClick={() => handleToggleReminder(tithi)}
                            sx={{
                              width: 48,
                              height: 48,
                              color: tithi.reminderEnabled ? 'primary.main' : 'text.secondary',
                            }}
                          >
                            {tithi.reminderEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={isHindi ? 'साझा करें' : 'Share'}>
                          <IconButton
                            aria-label={isHindi ? 'तिथि साझा करें' : 'Share tithi'}
                            size="small"
                            onClick={() => handleShareTithi(tithi)}
                            sx={{
                              width: 48,
                              height: 48,
                              color: 'primary.main',
                            }}
                          >
                            <Share2 size={16} />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={isExpanded ? 'Show less' : 'Show more'}>
                          <IconButton
                            aria-label={isExpanded ? 'Show less' : 'Show more'}
                            size="small"
                            onClick={() => setExpandedId(isExpanded ? null : tithi.id)}
                            sx={{ width: 48, height: 48 }}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            aria-label="Edit tithi"
                            size="small"
                            onClick={() => handleOpen(tithi)}
                            sx={{ width: 48, height: 48, color: 'info.main' }}
                          >
                            <Edit size={16} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            aria-label="Delete tithi"
                            size="small"
                            onClick={() => handleDelete(tithi.id)}
                            sx={{ width: 48, height: 48, color: 'error.main' }}
                          >
                            <Delete size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                </SectionCard>
              </Fade>
            );
          })}
        </List>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 1, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 500, pb: 1 }}>
          {editing ? t('myTithis.edit') : t('myTithis.addNew')}
          <IconButton
            aria-label={isHindi ? 'बंद करें' : 'Close'}
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {/* Event Type Selection */}
            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'text.primary' }}>
              {isHindi ? 'किस प्रकार का आयोजन है?' : 'What type of observance?'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {['Shraddha', 'Punya Tithi', 'Fasting', 'Festival', 'Other'].map((type) => (
                <Chip
                  key={type}
                  label={type}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFormData({ ...formData, name: type }); } }}
                  onClick={() => setFormData({ ...formData, name: type })}
                sx={{
                  bgcolor: formData.name === type ? 'primary.light' : 'action.hover',
                  color: formData.name === type ? 'primary.main' : 'text.secondary',
                  fontWeight: formData.name === type ? 500 : 400,
                }}
                />
              ))}
            </Box>

            {/* Event Name */}
            <TextField
              fullWidth
              label={isHindi ? 'विस्तृत नाम' : 'Full Name'}
              placeholder={isHindi ? 'जैसे: रामेश्वर शास्त्री जी की पुण्यतिथि' : 'e.g., Rameshwar Shastri Ji Punyatithi'}
              value={formData.name}
              onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined })); }}
              sx={{ mb: 2 }}
              error={!!formErrors.name}
              helperText={formErrors.name ?? (isHindi ? 'जिसके नाम का आयोजन है' : 'In whose name is this observance?')}
            />
            
            {/* Pick from date — for users who know the Gregorian date but not the tithi */}
            <Box sx={{ mb: 2, p: 1.5, borderRadius: 1.5, bgcolor: 'action.hover' }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                {isHindi ? 'तारीख से चुनें (तिथि पता न हो तो)' : 'Pick from a date (if you don’t know the tithi)'}
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={pickDate}
                onChange={(e) => handlePickDate(e.target.value)}
                sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
                inputProps={{ 'aria-label': isHindi ? 'तारीख चुनें' : 'Pick a date' }}
              />
              {pickedSummary && (
                <Typography variant="body2" color="primary.main" sx={{ mt: 1, fontWeight: 500, lineHeight: 1.6 }}>
                  {pickedSummary}
                </Typography>
              )}
            </Box>

            {/* Date Selection — Tithi full-width (names like Purnima/Amavasya
                must never truncate), Paksha + Month side by side below. */}
            <TextField
              fullWidth
              label={isHindi ? 'तिथि' : 'Tithi'}
              select
              SelectProps={{ native: true }}
              value={formData.tithiNumber}
              onChange={(e) => setFormData({ ...formData, tithiNumber: Number(e.target.value) })}
              sx={{ mb: 2 }}
              helperText={isHindi ? 'कौन सी तिथि?' : 'Which tithi?'}
            >
              {[
                'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
                'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
              ].map((t, i) => (
                <option key={t} value={i + 1}>{t}</option>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label={isHindi ? 'पक्ष' : 'Paksha'}
                select
                SelectProps={{ native: true }}
                value={formData.paksha}
                onChange={(e) => setFormData({ ...formData, paksha: e.target.value as 'Shukla' | 'Krishna' })}
                sx={{ flex: 1, minWidth: 0 }}
              >
                <option value="Shukla">Shukla</option>
                <option value="Krishna">Krishna</option>
              </TextField>

              {/* Month Selection */}
              <TextField
                fullWidth
                label={isHindi ? 'महीना' : 'Month'}
                select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
                sx={{ flex: 1, minWidth: 0 }}
                helperText={isHindi ? 'किस महीने में?' : 'Which month?'}
              >
                {['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwin', 'Kartik', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'].map((month, i) => (
                  <option key={month} value={i}>{month}</option>
                ))}
              </TextField>
            </Box>
            
            {/* Recurring Toggle */}
            <Box sx={{ 
              p: 1.5, 
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              borderRadius: 1.5,
              mb: 2,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {isHindi ? 'हर साल दोहराएं' : 'Repeat Every Year'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isHindi ? 'इस तिथि को हर साल याद दिलाएं' : 'Remind on this tithi every year'}
                  </Typography>
                </Box>
                <Switch
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                />
              </Box>
            </Box>

            {/* One-time date picker — shown only when repeat is OFF, wired to
                formData.customDate; occurrences/reminders follow existing paths. */}
            {!formData.isRecurring && (
              <TextField
                fullWidth
                type="date"
                label={isHindi ? 'तारीख चुनें' : 'Pick a date'}
                value={formData.customDate}
                onChange={(e) => { setFormData({ ...formData, customDate: e.target.value }); if (formErrors.customDate) setFormErrors((p) => ({ ...p, customDate: undefined })); }}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 1.5, minHeight: 48 } }}
                error={!!formErrors.customDate}
                helperText={formErrors.customDate ?? (isHindi ? 'यह तिथि सिर्फ इसी तारीख को आएगी' : 'This tithi occurs only on this date')}
              />
            )}
            
            {/* Notes for Details */}
            <TextField
              fullWidth
              label={isHindi ? 'अतिरिक्त जानकारी' : 'Additional Details'}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
              placeholder={isHindi ? 'गोत्र, समय, स्थान, या अन्य जानकारी...' : 'Gotra, time, location, or other details...'}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Switch
                checked={formData.reminderEnabled}
                onChange={(e) => setFormData({ ...formData, reminderEnabled: e.target.checked })}
              />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {isHindi ? 'रिमाइंडर चालू करें' : 'Enable Reminder'}
              </Typography>
            </Box>
            {formData.reminderEnabled && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontWeight: 500 }}>
                  {isHindi ? 'समय चुनें' : 'Select Time'}
                </Typography>
                <TextField
                  fullWidth
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                  {isHindi ? 'इस समय हम आपको याद दिलाएंगे' : 'We will remind you at this time'}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1.5, mb: 0.5, color: 'text.secondary', fontWeight: 500 }}>
                  {isHindi ? 'कितने दिन पहले याद दिलाएं' : 'Remind how many days before'}
                </Typography>
                <TextField
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  value={formData.reminderDaysBefore}
                  onChange={(e) => setFormData({ ...formData, reminderDaysBefore: Number(e.target.value) })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <option key={d} value={d}>
                      {d === 0 ? (isHindi ? 'उसी दिन' : 'On the day') : isHindi ? `${d} दिन पहले` : `${d} day${d > 1 ? 's' : ''} before`}
                    </option>
                  ))}
                </TextField>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: 1 }}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            startIcon={<Save size={18} />}
            sx={{ borderRadius: 1 }}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog 
        open={importDialogOpen} 
        onClose={() => setImportDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 1, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 500, pb: 1 }}>
          {t('myTithis.import')}
          <IconButton
            aria-label={isHindi ? 'बंद करें' : 'Close'}
            onClick={() => setImportDialogOpen(false)}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {importResult && (
              <AlertStack
                alerts={
                  importResult.success
                    ? [{
                        key: 'import-success',
                        severity: 'success',
                        children: `${isHindi ? 'सफलतापूर्वक आयात' : 'Successfully imported'} ${importResult.imported} ${isHindi ? 'तिथियाँ' : 'tithis'}${importResult.errors.length > 0 ? ` (${importResult.errors.length} ${isHindi ? 'छूटी' : 'skipped'}: ${importResult.errors[0]})` : ''}`,
                      }]
                    : importResult.errors.map((e, i) => ({ key: `import-error-${i}`, severity: 'error' as const, children: e }))
                }
              />
            )}
            <TextField
              fullWidth
              multiline
              rows={8}
              placeholder="Paste JSON here or click Upload File"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              style={{ display: 'none' }}
            />
            <Button
              variant="outlined"
              startIcon={<Upload size={18} />}
              onClick={handleImportFile}
              fullWidth
              sx={{ borderRadius: 1 }}
            >
              {t('myTithis.uploadFile')}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setImportDialogOpen(false)} variant="outlined" sx={{ borderRadius: 1 }}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={() => handleImportText(importText)} 
            variant="contained"
            sx={{ borderRadius: 1 }}
          >
            {t('myTithis.import')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback toast (permission denials, export/import status) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 1 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ScreenContainer>
  );
};

export default MyTithisScreen;
