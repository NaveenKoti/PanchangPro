/**
 * SettingsScreen - App Preferences (REVAMPED)
 * 
 * Modern design with:
 * - Clean sectioned layout
 * - Better visual hierarchy
 * - Intuitive controls
 * - Ad-free experience indicator
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Snackbar,
  Alert,
  TextField,
  Paper,
  Fade,
  Zoom,
  useMediaQuery,
  useTheme as useMuiTheme,
  Chip,
  IconButton,
} from '@mui/material';
import {
  MapPin,
  Bell,
  Palette,
  Languages,
  Info,
  Share2,
  UserPlus,
  Moon,
  Sun,
  Monitor,
  Trash2,
  AlertTriangle,
  Lock,
  Globe,
  Clock,
  CheckCircle,
  X,
} from 'lucide-react';
import { useAppStore, clearAllData } from '../stores/appStore';
import { useI18n } from '../hooks/useI18n';
import { SupportedLanguage } from '../i18n';
import { notificationService, notificationScheduler } from '../services/notificationService';
import { buildPushReminders, disablePush, enablePush, getPushStatus, type PushStatus } from '../services/pushService';
import { useThemeManager } from '../components/ThemeProvider';
import { ScreenContainer } from '../components/ScreenContainer';
import NotificationCenter from '../components/NotificationCenter';
import { PANCHANG_GLOSSARY } from '../data/panchangGlossary';

// Indian cities for location selection
const CITIES = [
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Delhi', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Chennai', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
  { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
  { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
  { name: 'Pune', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' },
  { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
];

export default function SettingsScreen() {
  const { t, currentLanguage } = useI18n();
  const isHindi = currentLanguage === 'hi';
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.up('sm'));

  const {
    preferences,
    customTithis,
    getNextOccurrences,
    setLocation,
    setLanguage,
    setTheme,
    toggleNotification,
    sharePanchang,
    inviteFamilyMember,
  } = useAppStore();

  const { setImmediateThemeMode, resetImmediateThemeMode } = useThemeManager();

  const [aboutDialog, setAboutDialog] = useState(false);
  const [privacyDialog, setPrivacyDialog] = useState(false);
  const [phone, setPhone] = useState('');
  const [inviteDialog, setInviteDialog] = useState(false);
  const [manualCoords, setManualCoords] = useState(false);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [notifGloballyEnabled, setNotifGloballyEnabled] = useState(false);
  const [pushStatus, setPushStatus] = useState<PushStatus>('off');
  const [pushBusy, setPushBusy] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleInvite = () => {
    if (phone) {
      inviteFamilyMember(phone, 'Family');
      setPhone('');
      setInviteDialog(false);
      setSnackbar({
        open: true,
        message: t('invite.sentSuccess') || 'Invitation sent successfully!',
        severity: 'success',
      });
    }
  };

  // Sync notification global state
  React.useEffect(() => {
    setNotifGloballyEnabled(notificationService.isGloballyEnabled());
  }, []);

  // Sync killed-app push status
  React.useEffect(() => {
    getPushStatus().then(setPushStatus).catch(() => undefined);
  }, []);

  const handleLanguageChange = (language: SupportedLanguage) => {
    setLanguage(language);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    const themeMode = theme === 'system' ? 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
      : theme;
    
    setImmediateThemeMode(themeMode);
    
    setTimeout(() => {
      setTheme(theme);
      resetImmediateThemeMode();
    }, 100);
  };

  const handleNotificationToggle = async (key: keyof typeof preferences.notifications) => {
    if (!preferences.notifications[key]) {
      const permission = notificationService.checkPermission();
      if (permission === 'default') {
        const granted = await notificationService.requestPermission();
        if (!granted) {
          setSnackbar({
            open: true,
            message: t('notifications.permissionRequired') || 'Notification permission required',
            severity: 'error',
          });
          return;
        }
        notificationService.setGloballyEnabled(true);
        setNotifGloballyEnabled(true);
        // Run scheduler immediately after granting permission
        notificationScheduler.runScheduler().then((result) => {
          if (result.scheduled > 0) {
            setSnackbar({
              open: true,
              message: `Enabled! Scheduled ${result.scheduled} reminders for the next 30 days.`,
              severity: 'success',
            });
          }
        });
      } else if (permission === 'denied') {
        setSnackbar({
          open: true,
          message: t('notifications.permissionDenied') || 'Notifications are blocked in browser settings',
          severity: 'error',
        });
        return;
      }
    }
    toggleNotification(key);
  };

  const handlePushToggle = async () => {
    if (pushBusy) return;
    if (pushStatus === 'unsupported' || pushStatus === 'unconfigured') {
      setSnackbar({
        open: true,
        message: pushStatus === 'unconfigured'
          ? (isHindi ? 'पुश अभी सेटअप नहीं है' : 'Push is not set up yet')
          : (isHindi ? 'इस डिवाइस पर समर्थित नहीं' : 'Not supported on this device'),
        severity: 'info',
      });
      return;
    }
    setPushBusy(true);
    if (pushStatus === 'on') {
      const result = await disablePush();
      if (result.ok) setPushStatus('off');
      setSnackbar({
        open: true,
        message: result.ok
          ? (isHindi ? 'बंद ऐप रिमाइंडर बंद' : 'Killed-app reminders off')
          : (result.error || 'Error'),
        severity: result.ok ? 'success' : 'error',
      });
    } else {
      const buildDeviceReminders = () => {
        const occurrences: Record<string, Date[]> = {};
        for (const tithi of customTithis) occurrences[tithi.id] = getNextOccurrences(tithi.id);
        return buildPushReminders(customTithis, occurrences);
      };
      const result = await enablePush(buildDeviceReminders);
      if (result.ok) setPushStatus('on');
      setSnackbar({
        open: true,
        message: result.ok
          ? (isHindi ? 'बंद ऐप रिमाइंडर चालू' : 'Killed-app reminders on')
          : (result.error || 'Error'),
        severity: result.ok ? 'success' : 'error',
      });
    }
    setPushBusy(false);
  };

  const handleManualLocationSave = () => {
    if (lat && lng) {
      setLocation({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        timezone: 'Asia/Kolkata',
        name: `Custom (${lat}, ${lng})`,
      });
      setManualCoords(false);
      setSnackbar({
        open: true,
        message: t('settings.locationUpdated') || 'Location updated!',
        severity: 'success',
      });
    }
  };

  const handleClearData = () => {
    if (confirm(t('settings.clearDataConfirm') || 'Clear all data? This cannot be undone.')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <ScreenContainer maxWidth={800} sx={{ pt: 2 }}>
      {/* Header */}
      <Zoom in timeout={500}>
        <Box sx={{ mb: 3, textAlign: 'center', px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
            <Box
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: 2,
                bgcolor: 'rgba(199, 91, 18, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Palette size={22} color={muiTheme.palette.primary.main} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                color: 'text.primary',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              {t('navigation.settings')}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            {t('settings.subtitle') || 'Customize your experience'}
          </Typography>
        </Box>
      </Zoom>

      {/* Settings Sections */}
      <List sx={{ px: 0 }}>
        {/* Location Section */}
        <Fade in timeout={700}>
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: 'rgba(199, 91, 18, 0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin size={20} color={muiTheme.palette.primary.main} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {t('settings.location')}
                </Typography>
              </Box>
            </Box>
            <List sx={{ p: 0 }}>
              {CITIES.map((city) => (
                <ListItem
                  key={city.name}
                  onClick={() => setLocation({ latitude: city.latitude, longitude: city.longitude, timezone: city.timezone, name: city.name })}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: preferences.location.name === city.name ? 'rgba(199, 91, 18, 0.04)' : 'transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(199, 91, 18, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                <MapPin
                  size={20}
                  color={preferences.location.name === city.name ? muiTheme.palette.primary.main : muiTheme.palette.text.disabled}
                />
                  </ListItemIcon>
                  <ListItemText
                    primary={city.name}
                    secondary={`${city.latitude.toFixed(2)}°N, ${city.longitude.toFixed(2)}°E`}
                  />
                {preferences.location.name === city.name && (
                  <ListItemSecondaryAction>
                    <CheckCircle size={20} color={muiTheme.palette.primary.main} />
                  </ListItemSecondaryAction>
                )}
                </ListItem>
              ))}
              <Divider />
              <ListItem
                onClick={() => setManualCoords(true)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(199, 91, 18, 0.08)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
            <MapPin size={20} color={muiTheme.palette.primary.main} />
                </ListItemIcon>
                <ListItemText
                  primary={t('settings.enterManual') || 'Enter coordinates manually'}
                  secondary={`${t('settings.latitude')}, ${t('settings.longitude')}`}
                />
              </ListItem>
            </List>
          </Paper>
        </Fade>

        {/* Appearance Section */}
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 164, 215, 0.06)' : 'rgba(44, 62, 107, 0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Palette size={20} color={muiTheme.palette.info.main} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {t('settings.appearance')}
                </Typography>
              </Box>
            </Box>
            <List sx={{ p: 0 }}>
              {/* Theme */}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Palette size={20} color={muiTheme.palette.info.main} />
                </ListItemIcon>
                <ListItemText
                  primary={t('settings.theme')}
                  secondary={t(`theme.${preferences.theme}`)}
                />
      <Select
        value={preferences.theme}
        onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'system')}
        size="small"
        sx={{ minWidth: { xs: 100, sm: 120 }, maxHeight: 44 }}
      >
                  <MenuItem value="light">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Sun size={16} /> {t('theme.light')}
                    </Box>
                  </MenuItem>
                  <MenuItem value="dark">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Moon size={16} /> {t('theme.dark')}
                    </Box>
                  </MenuItem>
                  <MenuItem value="system">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Monitor size={16} /> {t('theme.system')}
                    </Box>
                  </MenuItem>
                </Select>
              </ListItem>
              <Divider />
              {/* Language */}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Globe size={20} color={muiTheme.palette.info.main} />
                </ListItemIcon>
                <ListItemText
                  primary={t('settings.language')}
                  secondary={t(`language.${preferences.language}`)}
                />
                <Select
                  value={preferences.language}
                  onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                  size="small"
                  sx={{ minWidth: { xs: 100, sm: 120 }, maxHeight: 44 }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">हिन्दी (Hindi)</MenuItem>
                  <MenuItem value="sa">संस्कृत (Sanskrit)</MenuItem>
                </Select>
              </ListItem>
            </List>
          </Paper>
        </Fade>

        {/* Notifications Section */}
        <Fade in timeout={900}>
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(144, 164, 215, 0.06)' : 'rgba(44,62,107,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Bell size={20} color={muiTheme.palette.info.main} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {t('settings.notifications')}
                </Typography>
              </Box>
            </Box>
            <List sx={{ p: 0 }}>
              {/* Manage Notifications row */}
              <ListItem
                onClick={() => setNotificationCenterOpen(true)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(199, 91, 18, 0.06)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Bell size={20} color={muiTheme.palette.info.main} />
                </ListItemIcon>
                <ListItemText
                  primary="Manage Notifications"
                  secondary={`${notificationService.getScheduledNotifications().length} scheduled`}
                />
                <ListItemSecondaryAction>
                  <Chip
                    label="Open"
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 2, borderColor: muiTheme.palette.divider }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              {Object.entries(preferences.notifications).map(([key, enabled]) => (
                <React.Fragment key={key}>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Bell size={20} color={enabled ? muiTheme.palette.info.main : muiTheme.palette.text.disabled} />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(`notifications.${key}`) || key}
                      secondary={enabled ? t('common.enabled') : t('common.disabled')}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={enabled}
                        onChange={() => handleNotificationToggle(key as keyof typeof preferences.notifications)}
                        color="primary"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              <Divider />
              {/* Killed-app push reminders row */}
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Bell size={20} color={pushStatus === 'on' ? muiTheme.palette.info.main : muiTheme.palette.text.disabled} />
                </ListItemIcon>
                <ListItemText
                  primary={isHindi ? 'बंद ऐप रिमाइंडर (पुश)' : 'Killed-app reminders (push)'}
                  secondary={
                    pushStatus === 'on' ? t('common.enabled')
                      : pushStatus === 'unconfigured' ? (isHindi ? 'अभी सेटअप नहीं है' : 'Not set up yet')
                      : pushStatus === 'unsupported' ? (isHindi ? 'इस डिवाइस पर समर्थित नहीं' : 'Not supported on this device')
                      : t('common.disabled')
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={pushStatus === 'on'}
                    disabled={pushBusy || pushStatus === 'unsupported' || pushStatus === 'unconfigured'}
                    onChange={handlePushToggle}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Fade>

        {/* Data & Privacy Section */}
        <Fade in timeout={1100}>
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239, 154, 154, 0.06)' : 'rgba(244, 67, 54, 0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AlertTriangle size={20} color={muiTheme.palette.error.main} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {t('settings.dataPrivacy')}
                </Typography>
              </Box>
            </Box>
            <List sx={{ p: 0 }}>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Share2 size={20} color={muiTheme.palette.success.main} />
                </ListItemIcon>
                <ListItemText
                  primary={t('settings.sharePanchang')}
                  secondary={t('settings.sharePanchangDesc')}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={sharePanchang}
                  sx={{ borderRadius: 2 }}
                >
                  {t('common.share')}
                </Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Trash2 size={20} color={muiTheme.palette.error.main} />
                </ListItemIcon>
                <ListItemText
                  primary={t('settings.clearData')}
                  secondary={t('settings.clearDataDesc')}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearData}
                  color="error"
                  sx={{ borderRadius: 2 }}
                >
                  {t('settings.clear')}
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Fade>

        {/* About Section */}
        <Fade in timeout={1200}>
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
            }}
          >
            <Box sx={{ px: 2, py: 1.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(158, 158, 158, 0.06)' : 'rgba(158, 158, 158, 0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info size={20} color={muiTheme.palette.text.secondary} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {t('settings.about')}
                </Typography>
              </Box>
            </Box>
            <List sx={{ p: 0 }}>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Info size={20} color={muiTheme.palette.text.secondary} />
                </ListItemIcon>
                <ListItemText
                  primary={t('settings.version')}
                  secondary="3.7.0"
                />
              </ListItem>
              <Divider />
              <ListItem
                onClick={() => setAboutDialog(true)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Info size={20} color={muiTheme.palette.info.main} />
                </ListItemIcon>
                <ListItemText
                  primary={t('settings.aboutApp')}
                  secondary={t('settings.aboutAppDesc')}
                />
              </ListItem>
              <Divider />
              <ListItem
                onClick={() => setPrivacyDialog(true)}
                sx={{ cursor: 'pointer', minHeight: 48, '&:hover': { bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' } }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Lock size={20} color={muiTheme.palette.info.main} />
                </ListItemIcon>
                <ListItemText
                  primary={isHindi ? 'गोपनीयता' : 'Privacy'}
                  secondary={isHindi ? 'आपका डेटा कहाँ रहता है' : 'Where your data stays'}
                />
              </ListItem>
            </List>
          </Paper>
        </Fade>
      </List>

      {/* Manual Coordinates Dialog */}
      <Dialog 
        open={manualCoords} 
        onClose={() => setManualCoords(false)}
        PaperProps={{ sx: { borderRadius: 2, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 500 }}>
          {t('settings.enterManual')}
          <IconButton
            onClick={() => setManualCoords(false)}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('settings.latitude')}
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            placeholder="e.g., 19.0760"
          />
          <TextField
            fullWidth
            label={t('settings.longitude')}
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            sx={{ mb: 1 }}
            placeholder="e.g., 72.8777"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setManualCoords(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleManualLocationSave} 
            variant="contained" 
            sx={{ borderRadius: 2 }}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* About Dialog */}
      <Dialog 
        open={aboutDialog} 
        onClose={() => setAboutDialog(false)}
        PaperProps={{ sx: { borderRadius: 2, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 500, textAlign: 'center' }}>
          🙏 {t('common.appName')}
          <IconButton
            onClick={() => setAboutDialog(false)}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('settings.aboutContent') || 'Your complete Hindu calendar companion'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            {isHindi
              ? 'कोई खाता नहीं, कोई लॉगिन नहीं — सब कुछ आपके फ़ोन पर रहता है।'
              : 'No account, no login — everything stays on your phone.'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Version 3.8.0
          </Typography>

          {/* Permanent glossary reference — same copy as onboarding */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 500, textAlign: 'left', mb: 1 }}>
            {isHindi ? 'पंचांग के अंग — क्या है?' : 'Parts of the Panchang — what do they mean?'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
            {PANCHANG_GLOSSARY.map((entry) => (
              <Box key={entry.id}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'primary.main' }}>
                  {isHindi ? entry.nameHindi : entry.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {isHindi ? entry.meaningHindi : entry.meaning}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center' }}>
          <Button 
            onClick={() => setAboutDialog(false)} 
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog
        open={privacyDialog}
        onClose={() => setPrivacyDialog(false)}
        PaperProps={{ sx: { borderRadius: 2, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 500, textAlign: 'center' }}>
          {isHindi ? 'गोपनीयता' : 'Privacy'}
          <IconButton
            onClick={() => setPrivacyDialog(false)}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {isHindi
              ? 'आपकी तिथियाँ, रिमाइंडर और सेटिंग्स आपके डिवाइस पर (स्थानीय संग्रहण में) रहती हैं — कोई खाता नहीं, कोई लॉगिन नहीं। विश्लेषण, यदि कोई हो, केवल स्थानीय है। सूर्योदय का समय निकालने के लिए आपका स्थान आपके डिवाइस पर ही उपयोग होता है। एकमात्र नेटवर्क अनुरोध आपके शहर का नाम जानने के लिए OpenStreetMap से एक बार का मानचित्र अनुरोध है। ऐप खुला रहने पर रिमाइंडर चलते हैं।'
              : 'Your tithis, reminders and settings stay on your device (local storage) — no account, no login. Analytics, if any, are local-only. Your location is used on-device to compute sunrise timings. The only network call is a one-time map lookup to OpenStreetMap to name your city. Reminders fire while the app is open.'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'center' }}>
          <Button
            onClick={() => setPrivacyDialog(false)}
            variant="contained"
            sx={{ borderRadius: 2, px: 3 }}
          >
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog 
        open={inviteDialog} 
        onClose={() => setInviteDialog(false)}
        PaperProps={{ sx: { borderRadius: 2, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 500 }}>
          {t('invite.familyMember')}
          <IconButton
            onClick={() => setInviteDialog(false)}
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('invite.phone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mt: 1 }}
            placeholder="+91 98765 43210"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setInviteDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleInvite} 
            variant="contained" 
            startIcon={<UserPlus size={18} />}
            sx={{ borderRadius: 2 }}
          >
            {t('invite.send')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* NotificationCenter */}
      <NotificationCenter
        open={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />

      {/* Snackbar */}
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
}
