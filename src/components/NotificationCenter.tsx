/**
 * NotificationCenter - Shows upcoming scheduled notifications
 *
 * Features:
 *  - List of all upcoming notifications grouped by type
 *  - Ability to cancel individual notifications
 *  - Toggle to enable/disable all notifications
 *  - "Schedule Now" button to re-run the 30-day scheduler
 *  - Permission status indicator
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  Button,
  Chip,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Fade,
  useTheme as useMuiTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Bell,
  BellOff,
  Calendar,
  Moon,
  Sun,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { alpha } from '@mui/material/styles';
import {
  notificationService,
  notificationScheduler,
  ScheduledNotification,
  NotificationPermission,
  ScheduleResult,
} from '../services/notificationService';
import { useBreakpoints } from '../hooks/useBreakpoints';

// Type labels and icons
const getTYPE_CONFIG = (theme: any): Record<ScheduledNotification['type'], { icon: typeof Sun; color: string; label: string }> => ({
  festival: { icon: Calendar, color: theme.palette.primary.main, label: 'Festival' },
  fasting: { icon: Moon, color: theme.palette.secondary.main, label: 'Fasting' },
  dailyPanchang: { icon: Sun, color: theme.palette.warning.main, label: 'Daily Panchang' },
  customTithi: { icon: Moon, color: theme.palette.success.main, label: 'Custom Tithi' },
});

// Group notifications by type
function groupByType(notifications: ScheduledNotification[]): Record<string, ScheduledNotification[]> {
  const groups: Record<string, ScheduledNotification[]> = {};
  for (const n of notifications) {
    if (!groups[n.type]) groups[n.type] = [];
    groups[n.type].push(n);
  }
  return groups;
}

// Format a date for display
function formatScheduledTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours < 1) return 'Very soon';
  if (diffHours < 24) return `In ${Math.round(diffHours)}h`;
  if (diffDays < 2) return 'Tomorrow';
  if (diffDays < 7) return `In ${Math.round(diffDays)} days`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const muiTheme = useMuiTheme();
  const { isMobile } = useBreakpoints();
  const TYPE_CONFIG = getTYPE_CONFIG(muiTheme);

  const [notifications, setNotifications] = useState<ScheduledNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [globallyEnabled, setGloballyEnabled] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Load state on open
  const refreshState = useCallback(() => {
    setNotifications(notificationService.getScheduledNotifications());
    setPermission(notificationService.checkPermission());
    setGloballyEnabled(notificationService.isGloballyEnabled());
  }, []);

  useEffect(() => {
    if (open) {
      refreshState();
    }
  }, [open, refreshState]);

  // Request permission
  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      notificationService.setGloballyEnabled(true);
      setGloballyEnabled(true);
      setPermission('granted');
      // Run scheduler immediately
      setScheduling(true);
      const result = await notificationScheduler.runScheduler();
      setScheduling(false);
      refreshState();
      setSnackbar({
        open: true,
        message: `Scheduled ${result.scheduled} notifications for the next 30 days.`,
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Notification permission was not granted.',
        severity: 'error',
      });
    }
  };

  // Toggle global enabled
  const handleToggleAll = (enabled: boolean) => {
    notificationService.setGloballyEnabled(enabled);
    setGloballyEnabled(enabled);
    if (!enabled) {
      setNotifications([]);
      setSnackbar({
        open: true,
        message: 'All notifications disabled.',
        severity: 'info',
      });
    } else {
      refreshState();
    }
  };

  // Re-run scheduler
  const handleReschedule = async () => {
    setScheduling(true);
    // Clear last schedule date so scheduler runs again
    localStorage.removeItem('panchangpro_last_schedule_date');
    const result = await notificationScheduler.runScheduler();
    setScheduling(false);
    refreshState();
    setSnackbar({
      open: true,
      message: result.scheduled > 0
        ? `Scheduled ${result.scheduled} notifications. Skipped ${result.skipped}, errors ${result.errors}.`
        : 'No new notifications to schedule.',
      severity: result.scheduled > 0 ? 'success' : 'info',
    });
  };

  // Cancel a specific notification (with confirmation)
  const handleCancelNotification = (id: string) => {
    setCancelConfirmId(id);
  };

  const confirmCancel = () => {
    if (cancelConfirmId) {
      notificationService.cancelNotification(cancelConfirmId);
      setCancelConfirmId(null);
      refreshState();
      setSnackbar({
        open: true,
        message: 'Notification cancelled.',
        severity: 'success',
      });
    }
  };

  // Cancel all notifications by type
  const handleCancelByType = (type: ScheduledNotification['type']) => {
    notificationService.cancelNotificationsByType(type);
    refreshState();
    setSnackbar({
      open: true,
      message: `All ${TYPE_CONFIG[type].label} notifications cancelled.`,
      severity: 'info',
    });
  };

  const grouped = groupByType(notifications);
  const totalScheduled = notifications.length;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 1,
            maxWidth: 500,
            width: '100%',
            maxHeight: isMobile ? '100vh' : '85vh',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Bell size={22} color={muiTheme.palette.primary.main} />
            Notification Center
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ ml: 1 }} aria-label="Close notifications">
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 2, pb: 2 }}>
          {/* Global Toggle */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 1,
              bgcolor: globallyEnabled ? alpha(muiTheme.palette.primary.main, 0.06) : alpha(muiTheme.palette.text.primary, muiTheme.palette.mode === 'dark' ? 0.05 : 0.03),
              border: (t) => `1px solid ${globallyEnabled ? alpha(muiTheme.palette.primary.main, 0.18) : t.palette.divider}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {globallyEnabled ? 'Notifications Active' : 'Notifications Disabled'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {permission === 'granted'
                    ? `${totalScheduled} notifications scheduled`
                    : permission === 'denied'
                      ? 'Permission denied — enable in browser settings'
                      : 'Tap "Enable" to get reminders'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {permission === 'granted' ? (
                  <CheckCircle size={18} color={muiTheme.palette.success.main} />
                ) : permission === 'denied' ? (
                  <AlertCircle size={18} color={muiTheme.palette.error.main} />
                ) : (
                  <AlertCircle size={18} color={muiTheme.palette.warning.main} />
                )}
                <Switch
                  checked={globallyEnabled && permission === 'granted'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleEnableNotifications();
                    } else {
                      handleToggleAll(false);
                    }
                  }}
                  disabled={scheduling}
                  color="primary"
                />
              </Box>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<RefreshCw size={14} />}
                onClick={handleReschedule}
                disabled={scheduling || !globallyEnabled || permission !== 'granted'}
                sx={{ borderRadius: 2 }}
              >
                {scheduling ? <CircularProgress size={16} /> : 'Refresh Schedule'}
              </Button>
              {!globallyEnabled && permission !== 'granted' && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Bell size={14} />}
                  onClick={handleEnableNotifications}
                  sx={{ borderRadius: 2 }}
                >
                  Enable Notifications
                </Button>
              )}
            </Box>
          </Paper>

          {/* Scheduled Notifications List */}
          {totalScheduled === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 6,
                color: 'text.secondary',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box sx={{ width: 56, height: 56, borderRadius: 1, bgcolor: alpha(muiTheme.palette.primary.main, 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                <BellOff size={28} strokeWidth={1.5} color={muiTheme.palette.primary.main} />
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                No notifications scheduled
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {globallyEnabled
                  ? 'Tap "Refresh Schedule" to scan the next 30 days.'
                  : 'Enable notifications to get started.'}
              </Typography>
            </Box>
          ) : (
            Object.entries(grouped).map(([type, notifs]) => {
              const config = TYPE_CONFIG[type as ScheduledNotification['type']];
              if (!config) return null;
              const Icon = config.icon;

              return (
                <Paper
                  key={type}
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: 1,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    overflow: 'hidden',
                  }}
                >
                  {/* Group header */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: alpha(config.color, 0.07),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: alpha(config.color, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} strokeWidth={1.5} color={config.color} />
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, color: config.color }}>
                        {config.label}
                      </Typography>
                      <Chip label={notifs.length} size="small" sx={{ height: 20, fontSize: 11, minWidth: 24 }} />
                    </Box>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleCancelByType(type as ScheduledNotification['type'])}
                      sx={{ fontSize: 11, minWidth: 'auto', px: 1 }}
                    >
                      Clear All
                    </Button>
                  </Box>

                  <Divider />

                  {/* Items */}
                  <List disablePadding>
                    {notifs.slice(0, 10).map((notif) => (
                      <ListItem
                        key={notif.id}
                        sx={{ py: 1, '&:hover': { bgcolor: alpha(config.color, 0.04) }, '&:active': { transform: 'scale(0.99)' } }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleCancelNotification(notif.id)}
                            aria-label={`Cancel notification: ${notif.title}`}
                            sx={{ color: 'text.disabled', width: 48, height: 48 }}
                          >
                            <X size={16} />
                          </IconButton>
                        }
                      >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: alpha(config.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronRight size={18} color={config.color} />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
                              {notif.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                              <Chip
                                label={formatScheduledTime(notif.scheduledTime)}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: 10,
                                  bgcolor: alpha(config.color, 0.1),
                                  color: config.color,
                                }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                    {notifs.length > 10 && (
                      <ListItem sx={{ py: 0.5, justifyContent: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          +{notifs.length - 10} more
                        </Typography>
                      </ListItem>
                    )}
                  </List>
                </Paper>
              );
            })
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelConfirmId !== null}
        onClose={() => setCancelConfirmId(null)}
        PaperProps={{ sx: { borderRadius: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 500 }}>Cancel Notification?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This notification will be removed and you won&apos;t receive the reminder.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelConfirmId(null)} variant="outlined" sx={{ borderRadius: 2 }}>
            Keep
          </Button>
          <Button onClick={confirmCancel} variant="contained" color="error" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
}
