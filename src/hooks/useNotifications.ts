/**
 * useNotifications Hook - React hook for notification management
 * Why: Provides a React-friendly interface to the notificationService
 * Integrates with appStore for notification preferences
 */

import { useState, useEffect, useCallback } from 'react';
import {
  notificationService,
  NotificationPermission,
  ScheduledNotification
} from '../services/notificationService';
import { useAppStore } from '../stores/appStore';
import { Festival, CustomTithi } from '../types';

export interface UseNotificationsReturn {
  /** Current notification permission status */
  permission: NotificationPermission;
  /** Request notification permission from user */
  requestPermission: () => Promise<boolean>;
  /** Schedule a festival reminder */
  scheduleFestivalReminder: (festival: Festival, daysBefore?: number) => string | null;
  /** Schedule a custom tithi reminder */
  scheduleCustomTithiReminder: (tithi: CustomTithi, reminderTime?: string) => string | null;
  /** Schedule daily panchang reminder */
  scheduleDailyPanchangReminder: (time?: string) => string | null;
  /** Cancel a scheduled notification */
  cancelNotification: (id: string) => boolean;
  /** Get all scheduled notifications */
  getScheduledNotifications: () => ScheduledNotification[];
  /** Check if notifications are enabled in preferences */
  areNotificationsEnabled: boolean;
  /** Show an immediate notification */
  showNotification: (title: string, body?: string) => void;
}

/**
 * Hook for managing browser notifications
 * Integrates with notificationService and appStore for seamless notification management
 * @returns Notification state and methods
 */
export function useNotifications(): UseNotificationsReturn {
  // Get notification preferences from store
  const notifications = useAppStore((state) => state.preferences.notifications);

  // Local state for permission
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return notificationService.checkPermission();
  });

  // Update permission state periodically and on mount
  useEffect(() => {
    const checkPermission = () => {
      const currentPermission = notificationService.checkPermission();
      setPermission(currentPermission);
    };

    // Check immediately
    checkPermission();

    // Check periodically (in case user changes permission in browser settings)
    const interval = setInterval(checkPermission, 5000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await notificationService.requestPermission();
    setPermission(granted ? 'granted' : 'denied');
    return granted;
  }, []);

  /**
   * Schedule a festival reminder
   */
  const scheduleFestivalReminder = useCallback(
    (festival: Festival, daysBefore: number = 1): string | null => {
      if (!notifications.festivalAlerts) {
        return null;
      }
      return notificationService.scheduleFestivalReminder(festival, daysBefore);
    },
    [notifications.festivalAlerts]
  );

  /**
   * Schedule a custom tithi reminder
   */
  const scheduleCustomTithiReminder = useCallback(
    (tithi: CustomTithi, reminderTime: string = '07:00'): string | null => {
      if (!notifications.customTithiReminders) {
        return null;
      }
      return notificationService.scheduleCustomTithiReminder(tithi, reminderTime);
    },
    [notifications.customTithiReminders]
  );

  /**
   * Schedule daily panchang reminder
   */
  const scheduleDailyPanchangReminder = useCallback(
    (time: string = '07:00'): string | null => {
      if (!notifications.dinacharyaReminders) {
        return null;
      }
      return notificationService.scheduleDailyPanchangReminder(time);
    },
    [notifications.dinacharyaReminders]
  );

  /**
   * Cancel a scheduled notification
   */
  const cancelNotification = useCallback((id: string): boolean => {
    return notificationService.cancelNotification(id);
  }, []);

  /**
   * Get all scheduled notifications
   */
  const getScheduledNotifications = useCallback((): ScheduledNotification[] => {
    return notificationService.getScheduledNotifications();
  }, []);

  /**
   * Show an immediate notification
   */
  const showNotification = useCallback((title: string, body?: string): void => {
    notificationService.showNotification(title, { body });
  }, []);

  // Determine if any notifications are enabled
  const areNotificationsEnabled =
    notifications.fastingReminders ||
    notifications.festivalAlerts ||
    notifications.dinacharyaReminders ||
    notifications.customTithiReminders;

  return {
    permission,
    requestPermission,
    scheduleFestivalReminder,
    scheduleCustomTithiReminder,
    scheduleDailyPanchangReminder,
    cancelNotification,
    getScheduledNotifications,
    areNotificationsEnabled,
    showNotification,
  };
}

export default useNotifications;
