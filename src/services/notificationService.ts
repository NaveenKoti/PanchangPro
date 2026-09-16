/**
 * Notification Service - Browser Notification Management (ENHANCED)
 * Why: Manages notification scheduling using browser Notifications API
 * Stores scheduled notifications in localStorage for persistence
 * Features:
 *  - Schedule festival reminders (1 day before)
 *  - Schedule fasting day reminders (evening before)
 *  - Schedule morning panchang reminders
 *  - Better permission request UX
 *  - Store scheduled notification IDs in localStorage to avoid duplicates
 *  - 30-day ahead scheduler on app startup
 *  - NotificationScheduler for scanning festivals/fasts
 *  - Fallback to daily check if scheduled notifications not supported
 */

import { Festival, CustomTithi } from '../types';
import { FESTIVALS } from '../data/festivals';
import { EKADASHIS, OTHER_FASTS } from '../data/fastings';

// Storage keys
const SCHEDULED_NOTIFICATIONS_KEY = 'panchangpro_scheduled_notifications';
const SCHEDULED_IDS_KEY = 'panchangpro_scheduled_ids';
const LAST_SCHEDULE_DATE_KEY = 'panchangpro_last_schedule_date';
const NOTIFICATION_ENABLED_KEY = 'panchangpro_notifications_enabled';

// Type for notification permission
export type NotificationPermission = 'default' | 'granted' | 'denied';

// Interface for scheduled notification stored in localStorage
export interface ScheduledNotification {
  id: string;
  type: 'festival' | 'customTithi' | 'dailyPanchang' | 'fasting';
  title: string;
  body: string;
  scheduledTime: string; // ISO date string
  data?: Record<string, unknown>;
  createdAt?: string;
}

// Interface for notification service options
export interface NotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: Record<string, unknown>;
}

// Result of the scheduling operation
export interface ScheduleResult {
  scheduled: number;
  skipped: number;
  errors: number;
}

// Whether the browser supports the Notification API
function hasNotificationSupport(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

// Whether the browser supports scheduled notifications via Service Worker
function supportsScheduledNotifications(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'Notification' in window;
}

/**
 * Show a better permission request dialog before triggering the browser prompt.
 * Returns true if the user clicked "Allow" and the browser granted permission.
 */
export async function requestPermissionWithUX(): Promise<boolean> {
  if (!hasNotificationSupport()) {
    return false;
  }

  const current = Notification.permission;
  if (current === 'granted') return true;
  if (current === 'denied') return false;

  // Show an explainer dialog before the browser prompt
  const granted = await showPermissionExplainer();
  if (!granted) return false;

  try {
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      localStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Show a custom explainer dialog before the browser permission prompt.
 * Uses a lightweight HTML dialog rather than relying on any UI framework.
 */
function showPermissionExplainer(): Promise<boolean> {
  return new Promise((resolve) => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.2s ease;
    `;

    // Create dialog card
    const card = document.createElement('div');
    card.style.cssText = `
      background: white; border-radius: 16px; padding: 32px; max-width: 380px; width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; font-family: system-ui, -apple-system, sans-serif;
    `;

    card.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 16px;">🔔</div>
      <h2 style="margin: 0 0 8px; font-size: 20px; color: #1a1a1a; font-weight: 600;">Stay Updated with Panchang</h2>
      <p style="margin: 0 0 24px; font-size: 14px; color: #666; line-height: 1.5;">
        Get timely reminders for:<br/>
        <strong>Festivals</strong> · <strong>Fasting days</strong> · <strong>Daily Panchang</strong>
      </p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button id="notif-deny-btn" style="
          padding: 10px 24px; border-radius: 8px; border: 1px solid #ddd;
          background: white; color: #666; font-size: 14px; font-weight: 500; cursor: pointer;
        ">Not Now</button>
        <button id="notif-allow-btn" style="
          padding: 10px 24px; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #C75B12, #E8944A); color: white;
          font-size: 14px; font-weight: 500; cursor: pointer;
        ">Allow Notifications</button>
      </div>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const denyBtn = document.getElementById('notif-deny-btn')!;
    const allowBtn = document.getElementById('notif-allow-btn')!;

    const cleanup = () => document.body.removeChild(overlay);

    denyBtn.addEventListener('click', () => {
      cleanup();
      resolve(false);
    });

    allowBtn.addEventListener('click', () => {
      cleanup();
      resolve(true);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        cleanup();
        resolve(false);
      }
    });
  });
}

/**
 * NotificationScheduler - Scans upcoming days and schedules notifications
 */
class NotificationScheduler {
  /**
   * Run the full 30-day scheduler.
   * Scans the next 30 days for festivals and fasting days, scheduling
   * notifications for each based on user preferences.
   */
  async runScheduler(): Promise<ScheduleResult> {
    const result: ScheduleResult = { scheduled: 0, skipped: 0, errors: 0 };

    if (!hasNotificationSupport()) return result;
    if (Notification.permission !== 'granted') return result;

    const isEnabled = localStorage.getItem(NOTIFICATION_ENABLED_KEY) === 'true';
    if (!isEnabled) return result;

    // Avoid running scheduler more than once per day
    const today = new Date().toDateString();
    const lastRun = localStorage.getItem(LAST_SCHEDULE_DATE_KEY);
    if (lastRun === today) {
      // Already ran today — skip
      return result;
    }

    const now = new Date();
    const thirtyDaysLater = new Date(now);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    // --- Festival reminders (1 day before) ---
    const festivalIds = this.getLoadedScheduledIds();
    for (let d = new Date(now); d <= thirtyDaysLater; d.setDate(d.getDate() + 1)) {
      const checkDate = new Date(d);
      const month = checkDate.getMonth() + 1;

      // Check festivals for this date (simplified: match by month + approximate tithi)
      for (const festivalData of FESTIVALS) {
        if (festivalData.month === month) {
          // Approximate the festival date within the month based on tithi
          // Shukla paksha: days 1-15, Krishna paksha: days 16-30
          const approxDay = festivalData.tithiNumber + (festivalData.paksha === 'Krishna' ? 15 : 0);
          const festivalDate = new Date(checkDate.getFullYear(), checkDate.getMonth(), approxDay);

          // Skip if the festival date is out of range or in the past
          if (festivalDate <= now) continue;

          const id = `festival-${festivalData.id}-${festivalDate.toISOString().split('T')[0]}`;
          if (festivalIds.has(id)) {
            result.skipped++;
            continue;
          }

          const reminderDate = new Date(festivalDate);
          reminderDate.setDate(reminderDate.getDate() - 1);
          reminderDate.setHours(8, 0, 0, 0);

          if (reminderDate <= now) continue;

          const notif: ScheduledNotification = {
            id,
            type: 'festival',
            title: `\u{1F389} ${festivalData.name}`,
            body: `${festivalData.name} is tomorrow! ${festivalData.description}`,
            scheduledTime: reminderDate.toISOString(),
            data: { festivalId: festivalData.id, festivalDate: festivalDate.toISOString() },
          };

          if (this.scheduleInternal(notif)) {
            result.scheduled++;
          } else {
            result.errors++;
          }
        }
      }
    }

    // --- Fasting reminders (evening before) ---
    // Ekadashis: fast is on a specific tithi; remind at 18:00 the evening before
    for (let m = 0; m < 2; m++) {
      const monthOffset = m;
      const year = now.getFullYear();
      const month = now.getMonth() + monthOffset;

      for (const ekadashi of EKADASHIS) {
        if (ekadashi.month === month + 1) {
          // Approximate the Ekadashi date
          const tithiNum = ekadashi.tithiNumber ?? 11;
          const pakshaOffset = ekadashi.paksha === 'Krishna' ? 15 : 0;
          const approxDay = tithiNum + pakshaOffset;
          const fastDate = new Date(year, month, approxDay);

          if (fastDate <= now) continue;

          const id = `fasting-${ekadashi.id}-${fastDate.toISOString().split('T')[0]}`;
          if (festivalIds.has(id)) {
            result.skipped++;
            continue;
          }

          const reminderDate = new Date(fastDate);
          reminderDate.setDate(reminderDate.getDate() - 1);
          reminderDate.setHours(18, 0, 0, 0);

          if (reminderDate <= now) continue;

          const notif: ScheduledNotification = {
            id,
            type: 'fasting',
            title: `\u{1F64F} Fasting Reminder`,
            body: `Tomorrow is ${ekadashi.name}. Prepare for your fast!`,
            scheduledTime: reminderDate.toISOString(),
            data: { fastId: ekadashi.id, fastDate: fastDate.toISOString(), fastName: ekadashi.name },
          };

          if (this.scheduleInternal(notif)) {
            result.scheduled++;
          } else {
            result.errors++;
          }
        }
      }
    }

    // --- Other fasts (Pradosh, Sankashti, Purnima, Amavasya) ---
    for (const fast of Object.values(OTHER_FASTS)) {
      // For monthly fasts, schedule the next occurrence
      const nextFastDate = this.estimateNextFastDate(fast);
      if (!nextFastDate || nextFastDate <= now) continue;

      const id = `fasting-${fast.id}-${nextFastDate.toISOString().split('T')[0]}`;
      if (festivalIds.has(id)) {
        result.skipped++;
        continue;
      }

      const reminderDate = new Date(nextFastDate);
      reminderDate.setDate(reminderDate.getDate() - 1);
      reminderDate.setHours(18, 0, 0, 0);

      if (reminderDate <= now) continue;

      const notif: ScheduledNotification = {
        id,
        type: 'fasting',
        title: `\u{1F64F} Fasting Reminder`,
        body: `Tomorrow is ${fast.name}. Prepare for your fast!`,
        scheduledTime: reminderDate.toISOString(),
        data: { fastId: fast.id, fastDate: nextFastDate.toISOString(), fastName: fast.name },
      };

      if (this.scheduleInternal(notif)) {
        result.scheduled++;
      } else {
        result.errors++;
      }
    }

    // --- Daily morning panchang reminder ---
    this.scheduleDailyPanchangReminderInternal('07:00');

    // Mark scheduler as run for today
    localStorage.setItem(LAST_SCHEDULE_DATE_KEY, new Date().toDateString());
    this.saveScheduledIds();

    return result;
  }

  /**
   * Estimate the next occurrence of a monthly fast.
   * Simplified — uses tithi-based approximation.
   */
  private estimateNextFastDate(fast: { id: string; type?: string; paksha?: 'Shukla' | 'Krishna'; tithiNumber?: number; month?: number }): Date | null {
    const now = new Date();
    const { tithiNumber, paksha } = fast;
    if (tithiNumber == null || !paksha) return null;

    const offset = paksha === 'Krishna' ? 15 : 0;
    const approxDay = tithiNumber + offset;

    // Current month's occurrence
    let date = new Date(now.getFullYear(), now.getMonth(), approxDay);
    if (date > now) return date;

    // Next month
    date = new Date(now.getFullYear(), now.getMonth() + 1, approxDay);
    return date;
  }

  /**
   * Schedule a daily morning panchang reminder.
   */
  scheduleDailyPanchangReminderInternal(time: string = '07:00'): string | null {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

    if (scheduledTime.getTime() <= Date.now()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const id = 'daily-panchang-reminder';
    const notif: ScheduledNotification = {
      id,
      type: 'dailyPanchang',
      title: '\u{1F64F} Good Morning!',
      body: "Check today's Panchang — Tithi, Nakshatra, and auspicious timings.",
      scheduledTime: scheduledTime.toISOString(),
      data: { reminderTime: time, recurring: true },
    };

    return this.scheduleInternal(notif) ? id : null;
  }

  /**
   * Internal scheduling (no permission check — caller is responsible).
   */
  private scheduleInternal(notification: ScheduledNotification): boolean {
    const service = notificationService;

    // Cancel any existing notification with the same ID
    service.cancelNotification(notification.id);

    const scheduledTime = new Date(notification.scheduledTime);
    const delay = scheduledTime.getTime() - Date.now();

    if (delay <= 0) return false;

    notification.createdAt = new Date().toISOString();
    service.addScheduledNotification(notification.id, notification);

    const timeout = setTimeout(() => {
      service.showNotification(notification.title, {
        body: notification.body,
        tag: notification.id,
        data: notification.data,
      });

      service.removeScheduledNotification(notification.id);

      // Reschedule if recurring
      if (notification.data?.recurring) {
        this.rescheduleRecurring(notification);
      }
    }, delay);

    service.setTimeoutForNotification(notification.id, timeout);
    this.saveScheduledIds();

    return true;
  }

  /**
   * Reschedule a recurring notification.
   */
  private rescheduleRecurring(notification: ScheduledNotification): void {
    if (notification.type === 'dailyPanchang') {
      const nextDate = new Date(notification.scheduledTime);
      nextDate.setDate(nextDate.getDate() + 1);
      const newNotif: ScheduledNotification = {
        ...notification,
        scheduledTime: nextDate.toISOString(),
        id: notification.id, // same ID — will replace
      };
      this.scheduleInternal(newNotif);
    }
  }

  /**
   * Get the set of already-scheduled notification IDs (from localStorage).
   */
  private getLoadedScheduledIds(): Set<string> {
    try {
      const stored = localStorage.getItem(SCHEDULED_IDS_KEY);
      if (stored) return new Set(JSON.parse(stored));
    } catch { /* ignore */ }
    return new Set();
  }

  /**
   * Persist the set of scheduled notification IDs.
   */
  private saveScheduledIds(): void {
    try {
      const service = notificationService;
      const ids = Array.from(service.getScheduledNotifications().map((n) => n.id));
      localStorage.setItem(SCHEDULED_IDS_KEY, JSON.stringify(ids));
    } catch { /* ignore */ }
  }
}

// Singleton scheduler
const scheduler = new NotificationScheduler();

/**
 * Notification Service
 * Provides methods for scheduling and managing browser notifications
 */
class NotificationService {
  private scheduledNotifications: Map<string, ScheduledNotification>;
  private activeTimeouts: Map<string, ReturnType<typeof setTimeout>>;

  constructor() {
    this.scheduledNotifications = new Map();
    this.activeTimeouts = new Map();
    this.loadFromStorage();
    this.restoreScheduledNotifications();
  }

  // ─── Accessors for the scheduler ────────────────────────────────

  /** Add a notification directly (used by scheduler) */
  addScheduledNotification(id: string, notification: ScheduledNotification): void {
    this.scheduledNotifications.set(id, notification);
    this.saveToStorage();
  }

  /** Remove a notification directly (used by scheduler) */
  removeScheduledNotification(id: string): void {
    this.scheduledNotifications.delete(id);
    this.activeTimeouts.delete(id);
    this.saveToStorage();
  }

  /** Set the timeout for a notification (used by scheduler) */
  setTimeoutForNotification(id: string, timeout: ReturnType<typeof setTimeout>): void {
    this.activeTimeouts.set(id, timeout);
  }

  /** Get the scheduler instance */
  getScheduler(): NotificationScheduler {
    return scheduler;
  }

  /**
   * Check notification permission status
   * @returns Current permission status
   */
  checkPermission(): NotificationPermission {
    if (!hasNotificationSupport()) {
      return 'denied';
    }
    return Notification.permission as NotificationPermission;
  }

  /**
   * Request notification permission from the user (with better UX)
   * @returns Promise resolving to true if permission granted
   */
  async requestPermission(): Promise<boolean> {
    return requestPermissionWithUX();
  }

  /**
   * Show an immediate notification
   * @param title Notification title
   * @param options Notification options
   * @returns The Notification instance or null
   */
  showNotification(title: string, options?: NotificationOptions): Notification | null {
    if (!hasNotificationSupport() || Notification.permission !== 'granted') {
      return null;
    }

    try {
      const notification = new Notification(title, {
        body: options?.body,
        icon: options?.icon || '/vedatime-icon.png',
        badge: options?.badge || '/vedatime-icon.png',
        tag: options?.tag || 'vedatime-notification',
        requireInteraction: options?.requireInteraction || false,
        data: options?.data,
      });

      if (!options?.requireInteraction) {
        setTimeout(() => { notification.close(); }, 10000);
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch {
      return null;
    }
  }

  /**
   * Schedule a festival reminder notification
   * @param festival Festival to remind about
   * @param daysBefore Number of days before the festival to send reminder
   * @returns Notification ID if scheduled, null otherwise
   */
  scheduleFestivalReminder(festival: Festival, daysBefore: number = 1): string | null {
    if (this.checkPermission() !== 'granted') {
      return null;
    }

    const festivalDate = new Date(festival.date);
    const reminderDate = new Date(festivalDate);
    reminderDate.setDate(reminderDate.getDate() - daysBefore);
    reminderDate.setHours(8, 0, 0, 0);

    if (reminderDate.getTime() <= Date.now()) {
      return null;
    }

    const id = `festival-${festival.id}-${daysBefore}d`;
    const title = `\u{1F389} ${festival.name}`;
    const body = `${festival.name} is in ${daysBefore} day${daysBefore > 1 ? 's' : ''}! ${festival.description}`;

    this.scheduleNotification({
      id,
      type: 'festival',
      title,
      body,
      scheduledTime: reminderDate.toISOString(),
      data: {
        festivalId: festival.id,
        festivalDate: festival.date,
        daysBefore,
      },
    });

    return id;
  }

  /**
   * Schedule a custom tithi reminder
   * The occurrence date comes from the Panchang engine for the user's
   * location (explicit argument, or tithi.nextOccurrence kept engine-computed
   * by the store). The calendar approximation below is a last-resort fallback.
   * @param tithi Custom tithi to remind about
   * @param reminderTime Time of day for the reminder (HH:MM format)
   * @param occurrence Engine-computed next occurrence (user's location)
   * @returns Notification ID if scheduled, null otherwise
   */
  scheduleCustomTithiReminder(tithi: CustomTithi, reminderTime: string = '07:00', occurrence?: Date): string | null {
    if (this.checkPermission() !== 'granted') {
      return null;
    }

    const [hours, minutes] = reminderTime.split(':').map(Number);

    // Prefer the engine-computed occurrence for the user's location (passed
    // in, or via tithi.nextOccurrence which the store keeps engine-computed).
    // The calendar approximation in calculateNextTithiDate is last resort.
    const rawOccurrence = occurrence ?? tithi.nextOccurrence;
    const nextDate = rawOccurrence ? new Date(rawOccurrence) : this.calculateNextTithiDate(tithi);
    if (!nextDate) {
      return null;
    }

    // Fire reminderDaysBefore (0-7, default 0 = on the day) ahead of the
    // occurrence, at the requested time of day.
    const daysBefore = Math.min(7, Math.max(0, tithi.reminderDaysBefore ?? 0));
    nextDate.setDate(nextDate.getDate() - daysBefore);
    nextDate.setHours(hours, minutes, 0, 0);

    // If the time has passed for today, schedule for next occurrence
    if (nextDate.getTime() <= Date.now()) {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    const id = `tithi-${tithi.id}`;
    const title = `🌙 ${tithi.name}`;
    const body = daysBefore > 0
      ? `${tithi.name} is in ${daysBefore} day${daysBefore > 1 ? 's' : ''}. ${tithi.notes || 'Don\'t forget your special tithi!'}`
      : `Today is ${tithi.name}. ${tithi.notes || 'Don\'t forget your special tithi!'}`;

    this.scheduleNotification({
      id,
      type: 'customTithi',
      title,
      body,
      scheduledTime: nextDate.toISOString(),
      data: {
        tithiId: tithi.id,
        tithiName: tithi.name,
        recurring: tithi.isRecurring,
        daysBefore,
      },
    });

    return id;
  }

  /**
   * Schedule daily panchang reminder
   * @param time Time of day for the reminder (HH:MM format)
   * @returns Notification ID if scheduled, null otherwise
   */
  scheduleDailyPanchangReminder(time: string = '07:00'): string | null {
    return scheduler.scheduleDailyPanchangReminderInternal(time);
  }

  /**
   * Schedule a fasting reminder
   * @param fastName Name of the fast
   * @param fastDate Date of the fast
   * @param reminderTime Time for reminder
   * @returns Notification ID if scheduled, null otherwise
   */
  scheduleFastingReminder(
    fastName: string,
    fastDate: Date,
    reminderTime: string = '18:00'
  ): string | null {
    if (this.checkPermission() !== 'granted') {
      return null;
    }

    const [hours, minutes] = reminderTime.split(':').map(Number);
    const reminderDate = new Date(fastDate);
    reminderDate.setHours(hours, minutes, 0, 0);

    // If time has passed, don't schedule
    if (reminderDate.getTime() <= Date.now()) {
      return null;
    }

    const id = `fasting-${fastDate.toISOString().split('T')[0]}`;

    this.scheduleNotification({
      id,
      type: 'fasting',
      title: `\u{1F64F} Fasting Reminder`,
      body: `Tomorrow is ${fastName}. Prepare for your fast!`,
      scheduledTime: reminderDate.toISOString(),
      data: {
        fastName,
        fastDate: fastDate.toISOString(),
      },
    });

    return id;
  }

  /**
   * Cancel a scheduled notification
   * @param id Notification ID to cancel
   * @returns True if cancelled successfully
   */
  cancelNotification(id: string): boolean {
    // Clear the timeout
    const timeout = this.activeTimeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.activeTimeouts.delete(id);
    }

    // Remove from scheduled notifications
    const removed = this.scheduledNotifications.delete(id);

    if (removed) {
      this.saveToStorage();
      // Update the stored IDs set
      try {
        const ids = Array.from(this.scheduledNotifications.keys());
        localStorage.setItem(SCHEDULED_IDS_KEY, JSON.stringify(ids));
      } catch { /* ignore */ }
    }

    return removed;
  }

  /**
   * Get all scheduled notifications
   * @returns Array of scheduled notifications
   */
  getScheduledNotifications(): ScheduledNotification[] {
    return Array.from(this.scheduledNotifications.values());
  }

  /**
   * Get scheduled notifications by type
   * @param type Type of notifications to filter
   * @returns Array of matching scheduled notifications
   */
  getScheduledNotificationsByType(type: ScheduledNotification['type']): ScheduledNotification[] {
    return this.getScheduledNotifications().filter((n) => n.type === type);
  }

  /**
   * Cancel all scheduled notifications
   */
  cancelAllNotifications(): void {
    this.activeTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.activeTimeouts.clear();
    this.scheduledNotifications.clear();
    this.saveToStorage();
    try {
      localStorage.removeItem(SCHEDULED_IDS_KEY);
    } catch { /* ignore */ }
  }

  /**
   * Cancel notifications by type
   * @param type Type of notifications to cancel
   */
  cancelNotificationsByType(type: ScheduledNotification['type']): void {
    const toCancel = this.getScheduledNotificationsByType(type);
    toCancel.forEach((notification) => {
      this.cancelNotification(notification.id);
    });
  }

  /**
   * Schedule a notification internally
   * @param notification Scheduled notification data
   */
  private scheduleNotification(notification: ScheduledNotification): void {
    // Cancel existing notification with same ID
    this.cancelNotification(notification.id);

    const scheduledTime = new Date(notification.scheduledTime);
    const delay = scheduledTime.getTime() - Date.now();

    if (delay <= 0) {
      return;
    }

    // Store the notification
    notification.createdAt = new Date().toISOString();
    this.scheduledNotifications.set(notification.id, notification);
    this.saveToStorage();

    // Set up the timeout
    const timeout = setTimeout(() => {
      this.showNotification(notification.title, {
        body: notification.body,
        tag: notification.id,
        data: notification.data,
      });

      // Remove from scheduled after showing
      this.scheduledNotifications.delete(notification.id);
      this.activeTimeouts.delete(notification.id);
      this.saveToStorage();

      // If it's a recurring notification, reschedule it
      if (notification.data?.recurring) {
        this.rescheduleRecurringNotification(notification);
      }
    }, delay);

    this.activeTimeouts.set(notification.id, timeout);
  }

  /**
   * Reschedule a recurring notification
   * @param notification The notification to reschedule
   */
  private rescheduleRecurringNotification(notification: ScheduledNotification): void {
    if (notification.type === 'dailyPanchang') {
      // Schedule for next day at same time
      const nextDate = new Date(notification.scheduledTime);
      nextDate.setDate(nextDate.getDate() + 1);

      this.scheduleNotification({
        ...notification,
        scheduledTime: nextDate.toISOString(),
      });
    } else if (notification.type === 'customTithi' && notification.data?.recurring) {
      // Convention: recurring custom tithis (e.g. Shraddha, Punya Tithi)
      // repeat ANNUALLY per Hindu lunar month — the `month` field on
      // CustomTithi selects that lunar month — not monthly. Advance one
      // lunar/calendar year; the exact tithi date is re-resolved by the
      // engine at schedule time for the user's location.
      const nextDate = new Date(notification.scheduledTime);
      nextDate.setFullYear(nextDate.getFullYear() + 1);

      this.scheduleNotification({
        ...notification,
        scheduledTime: nextDate.toISOString(),
      });
    }
  }

  /**
   * Calculate the next date for a custom tithi
   * LAST-RESORT fallback only: prefers the engine-computed nextOccurrence
   * (user's location) stored on the tithi. The calendar approximation below
   * ignores paksha and the lunar engine — never use it when an engine date
   * is available (scheduleCustomTithiReminder passes it explicitly).
   * @param tithi Custom tithi
   * @returns Date object for next occurrence or null
   */
  private calculateNextTithiDate(tithi: CustomTithi): Date | null {
    if (tithi.nextOccurrence) {
      const engineDate = new Date(tithi.nextOccurrence);
      if (!isNaN(engineDate.getTime())) {
        return engineDate;
      }
    }
    if (tithi.customDate && !tithi.isRecurring) {
      return new Date(tithi.customDate);
    }

    // For recurring tithis, calculate based on lunar calendar
    // This is a simplified calculation - in a real app, you'd use proper lunar calendar logic
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Create a date in the current month
    // Note: This is an approximation. Real implementation would use lunar calendar calculations
    const estimatedDate = new Date(currentYear, currentMonth, tithi.tithiNumber);

    // If the date has passed this month, move to next month
    if (estimatedDate.getTime() < now.getTime()) {
      estimatedDate.setMonth(estimatedDate.getMonth() + 1);
    }

    return estimatedDate;
  }

  /**
   * Load scheduled notifications from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
      if (stored) {
        const notifications: ScheduledNotification[] = JSON.parse(stored);
        notifications.forEach((n) => {
          this.scheduledNotifications.set(n.id, n);
        });
      }
    } catch {
      // Storage read failure — start fresh
    }
  }

  /**
   * Save scheduled notifications to localStorage
   */
  private saveToStorage(): void {
    try {
      const notifications = Array.from(this.scheduledNotifications.values());
      localStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch {
      // Storage write failure — non-critical
    }
  }

  /**
   * Restore scheduled notifications from storage on startup
   */
  private restoreScheduledNotifications(): void {
    const now = Date.now();

    this.scheduledNotifications.forEach((notification) => {
      const scheduledTime = new Date(notification.scheduledTime).getTime();

      if (scheduledTime <= now) {
        // Notification time has passed, remove it
        this.scheduledNotifications.delete(notification.id);
      } else {
        // Reschedule the notification
        const delay = scheduledTime - now;
        const timeout = setTimeout(() => {
          this.showNotification(notification.title, {
            body: notification.body,
            tag: notification.id,
            data: notification.data,
          });

          this.scheduledNotifications.delete(notification.id);
          this.activeTimeouts.delete(notification.id);
          this.saveToStorage();

          // Reschedule if recurring
          if (notification.data?.recurring) {
            this.rescheduleRecurringNotification(notification);
          }
        }, delay);

        this.activeTimeouts.set(notification.id, timeout);
      }
    });

    // Clean up expired notifications from storage
    this.saveToStorage();
  }

  /**
   * Check whether notifications are globally enabled.
   */
  isGloballyEnabled(): boolean {
    return localStorage.getItem(NOTIFICATION_ENABLED_KEY) === 'true';
  }

  /**
   * Toggle the global notification enabled flag.
   */
  setGloballyEnabled(enabled: boolean): void {
    if (enabled) {
      localStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');
    } else {
      localStorage.removeItem(NOTIFICATION_ENABLED_KEY);
      this.cancelAllNotifications();
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export scheduler for direct use
export { NotificationScheduler, scheduler as notificationScheduler };

export default notificationService;
