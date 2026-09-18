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
  Card,
  CardContent,
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
  useMediaQuery,
  useTheme as useMuiTheme,
  Paper,
  Divider,
  Collapse,
  Snackbar,
} from '@mui/material';
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
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { notificationService } from '../services/notificationService';
import { useI18n } from '../hooks/useI18n';
import { CustomTithi } from '../types';
import { AdCarousel } from '../components/AdCarousel';
import { ScreenContainer } from '../components/ScreenContainer';
import { useAdManager } from '../components/AdManager';
import { format, differenceInDays } from 'date-fns';

export const MyTithisScreen: React.FC = () => {
  const { t, currentLanguage } = useI18n();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.up('sm'));
  const { showAds, shouldShowAds } = useAdManager();
  const isHindi = currentLanguage === 'hi';
  
  // My Tithis ads are disabled (premium feature area)
  const showMyTithisAds = shouldShowAds('myTithis');

  const {
    customTithis, 
    addCustomTithi, 
    updateCustomTithi, 
    deleteCustomTithi, 
    getNextOccurrences, 
    exportCustomTithis, 
    importCustomTithis 
  } = useAppStore();
  
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

  const handleExport = async () => {
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
    <ScreenContainer maxWidth={isTablet ? 900 : undefined} sx={{ pt: 2 }}>
      {/* Top Ad */}
      {showAds && (
        <Fade in timeout={600}>
          <Box sx={{ mb: 2 }}>
            <AdCarousel />
          </Box>
        </Fade>
      )}

      {/* Header */}
      <Zoom in timeout={500}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: 'rgba(199, 91, 18, 0.1)',
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
                borderRadius: 2,
                px: 2.5,
                py: 1,
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(199, 91, 18, 0.3)',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(199, 91, 18, 0.4)',
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
                borderRadius: 2,
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
                borderRadius: 2,
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
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(199, 91, 18, 0.08)',
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
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              {t('myTithis.addFirst')}
            </Button>
          </Paper>
        </Fade>
      ) : (
        <List sx={{ px: 0 }}>
          {customTithis.map((tithi, index) => {
            const isExpanded = expandedId === tithi.id;
            const occurrences = getNextOccurrences(tithi.id);

            return (
              <Fade in timeout={500 + (index * 50)} key={tithi.id}>
                <Card
                  elevation={0}
                  sx={{
                    mb: 1.5,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: 'rgba(199, 91, 18, 0.1)',
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

                        {/* Next Occurrences with Countdown */}
                        {isExpanded && occurrences.length > 0 && (
                          <Fade in timeout={300}>
                            <Box sx={{ mt: 1.5, p: 1.5, bgcolor: 'rgba(199, 91, 18, 0.04)', borderRadius: 2, border: '1px solid rgba(199, 91, 18, 0.15)' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                <Clock size={16} color={muiTheme.palette.primary.main} />
                <Typography variant="caption" sx={{ fontWeight: 500, color: muiTheme.palette.primary.main }}>
                                  {t('myTithis.nextOccurrences') || 'Next Occurrences'}:
                                </Typography>
                              </Box>
                              {occurrences.slice(0, 5).map((date, i) => {
                                const daysUntil = differenceInDays(date, new Date());
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
                                      borderRadius: 2,
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
                                        {format(date, 'EEE, MMM d, yyyy')}
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
                            </Box>
                          </Fade>
                        )}
                      </Box>

                      {/* Actions */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Tooltip title={tithi.reminderEnabled ? 'Disable reminder' : 'Enable reminder'}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleReminder(tithi)}
                            sx={{
                              width: 32,
                              height: 32,
                              color: tithi.reminderEnabled ? 'primary.main' : 'text.secondary',
                            }}
                          >
                            {tithi.reminderEnabled ? <Bell size={16} /> : <BellOff size={16} />}
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={isExpanded ? 'Show less' : 'Show more'}>
                          <IconButton
                            size="small"
                            onClick={() => setExpandedId(isExpanded ? null : tithi.id)}
                            sx={{ width: 32, height: 32 }}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(tithi)}
                            sx={{ width: 32, height: 32, color: 'info.main' }}
                          >
                            <Edit size={16} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(tithi.id)}
                            sx={{ width: 32, height: 32, color: 'error.main' }}
                          >
                            <Delete size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            );
          })}
        </List>
      )}

      {/* Bottom Ad - Disabled for My Tithis (premium feature) */}
      {showMyTithisAds && (
        <Fade in timeout={600}>
          <Box sx={{ mt: 2 }}>
            <AdCarousel />
          </Box>
        </Fade>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 2, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 500, pb: 1 }}>
          {editing ? t('myTithis.edit') : t('myTithis.addNew')}
          <IconButton
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              helperText={isHindi ? 'जिसके नाम का आयोजन है' : 'In whose name is this observance?'}
            />
            
            {/* Date Selection */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label={isHindi ? 'तिथि' : 'Tithi'}
                select
                SelectProps={{ native: true }}
                value={formData.tithiNumber}
                onChange={(e) => setFormData({ ...formData, tithiNumber: Number(e.target.value) })}
                sx={{ flex: 1 }}
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
              
              <TextField
                fullWidth
                label={isHindi ? 'पक्ष' : 'Paksha'}
                select
                SelectProps={{ native: true }}
                value={formData.paksha}
                onChange={(e) => setFormData({ ...formData, paksha: e.target.value as 'Shukla' | 'Krishna' })}
                sx={{ width: 140 }}
              >
                <option value="Shukla">Shukla</option>
                <option value="Krishna">Krishna</option>
              </TextField>
            </Box>

            {/* Month Selection */}
            <TextField
              fullWidth
              label={isHindi ? 'महीना' : 'Month'}
              select
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
              sx={{ mb: 2 }}
              helperText={isHindi ? 'किस महीने में आता है?' : 'Which month does it fall in?'}
            >
              {['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwin', 'Kartik', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'].map((month, i) => (
                <option key={month} value={i}>{month}</option>
              ))}
            </TextField>
            
            {/* Recurring Toggle */}
            <Box sx={{ 
              p: 1.5, 
              bgcolor: 'rgba(199, 91, 18, 0.04)',
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
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            startIcon={<Save size={18} />}
            sx={{ borderRadius: 2 }}
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
          sx: { borderRadius: 2, p: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 500, pb: 1 }}>
          {t('myTithis.import')}
          <IconButton
            onClick={() => setImportDialogOpen(false)}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {importResult && (
              <Alert 
                severity={importResult.success ? 'success' : 'error'} 
                sx={{ mb: 2 }}
              >
                {importResult.success 
                  ? `Successfully imported ${importResult.imported} tithis!` 
                  : importResult.errors.join(', ')}
              </Alert>
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
              sx={{ borderRadius: 2 }}
            >
              {t('myTithis.uploadFile')}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setImportDialogOpen(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={() => handleImportText(importText)} 
            variant="contained"
            sx={{ borderRadius: 2 }}
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
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ScreenContainer>
  );
};

export default MyTithisScreen;
