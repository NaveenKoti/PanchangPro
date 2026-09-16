/**
 * Privacy-First Analytics Service
 * 
 * Lightweight, local-only analytics for PanchangPro.
 * - No PII collected
 * - No external API calls
 * - All data stored in localStorage
 * - 7-day rolling window with auto-cleanup
 */

// ============================================================================
// Types
// ============================================================================

export type AnalyticsEventType = 'page_view' | 'feature_use' | 'error' | 'performance';

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  name: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'panchangpro_analytics';
const RETENTION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const MAX_EVENTS = 5000; // Safety cap to prevent localStorage overflow

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Load all events from localStorage
 */
function loadEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AnalyticsEvent[];
  } catch {
    // Corrupted data - start fresh
    return [];
  }
}

/**
 * Save events to localStorage
 */
function saveEvents(events: AnalyticsEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    // localStorage full or unavailable - silently fail
    console.warn('[Analytics] Failed to save events:', e);
  }
}

/**
 * Remove events older than 7 days
 */
function cleanupOldEvents(events: AnalyticsEvent[]): AnalyticsEvent[] {
  const cutoff = Date.now() - RETENTION_MS;
  return events.filter((e) => e.timestamp >= cutoff);
}

/**
 * Record an analytics event
 */
function recordEvent(event: AnalyticsEvent): void {
  let events = loadEvents();

  // Auto-cleanup old events
  events = cleanupOldEvents(events);

  // Safety cap
  if (events.length >= MAX_EVENTS) {
    // Remove oldest 20% of events
    events = events.slice(Math.floor(MAX_EVENTS * 0.2));
  }

  events.push(event);
  saveEvents(events);
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Track a page view
 * @param page - Page identifier (e.g., 'home', 'calendar', 'festivals')
 * @param metadata - Optional additional context
 */
export function trackPageView(page: string, metadata?: Record<string, any>): void {
  recordEvent({
    type: 'page_view',
    name: page,
    timestamp: Date.now(),
    metadata: {
      ...metadata,
      referrer: document.referrer || undefined,
      screenWidth: window.innerWidth,
    },
  });
}

/**
 * Track feature usage (which screens/features are used most)
 * @param feature - Feature identifier (e.g., 'tithi-calculator', 'panchang-export')
 * @param metadata - Optional additional context
 */
export function trackFeatureUse(feature: string, metadata?: Record<string, any>): void {
  recordEvent({
    type: 'feature_use',
    name: feature,
    timestamp: Date.now(),
    metadata,
  });
}

/**
 * Track an error that occurred in the app
 * @param error - The Error object
 * @param context - Optional context about where/what happened
 */
export function trackError(error: Error, context?: string): void {
  recordEvent({
    type: 'error',
    name: error.name,
    timestamp: Date.now(),
    metadata: {
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href,
    },
  });
}

/**
 * Track a performance metric
 * @param metric - Metric name (e.g., 'page-load', 'search-duration')
 * @param value - Numeric value
 * @param unit - Unit of measurement (e.g., 'ms', 'count')
 */
export function trackPerformance(metric: string, value: number, unit: string): void {
  recordEvent({
    type: 'performance',
    name: metric,
    timestamp: Date.now(),
    metadata: { value, unit },
  });
}

/**
 * Retrieve all stored analytics events
 * @returns Array of analytics events (within the retention window)
 */
export function getAnalytics(): AnalyticsEvent[] {
  const events = loadEvents();
  return cleanupOldEvents(events);
}

/**
 * Clear all analytics data
 */
export function clearAnalytics(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get analytics summary with useful stats
 */
export function getAnalyticsSummary(): {
  totalEvents: number;
  pageViews: number;
  featureUses: number;
  errors: number;
  performanceMetrics: number;
  topPages: { page: string; count: number }[];
  topFeatures: { feature: string; count: number }[];
  recentErrors: { name: string; message?: string; timestamp: number }[];
} {
  const events = getAnalytics();

  const pageViews = events.filter((e) => e.type === 'page_view');
  const featureUses = events.filter((e) => e.type === 'feature_use');
  const errors = events.filter((e) => e.type === 'error');
  const perfMetrics = events.filter((e) => e.type === 'performance');

  // Count page views by name
  const pageCount: Record<string, number> = {};
  pageViews.forEach((e) => {
    pageCount[e.name] = (pageCount[e.name] || 0) + 1;
  });
  const topPages = Object.entries(pageCount)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Count feature uses by name
  const featureCount: Record<string, number> = {};
  featureUses.forEach((e) => {
    featureCount[e.name] = (featureCount[e.name] || 0) + 1;
  });
  const topFeatures = Object.entries(featureCount)
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Recent errors
  const recentErrors = errors
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map((e) => ({
      name: e.name,
      message: e.metadata?.message,
      timestamp: e.timestamp,
    }));

  return {
    totalEvents: events.length,
    pageViews: pageViews.length,
    featureUses: featureUses.length,
    errors: errors.length,
    performanceMetrics: perfMetrics.length,
    topPages,
    topFeatures,
    recentErrors,
  };
}

/**
 * Initialize analytics service
 * Call once on app startup. Sets up automatic error tracking and page view tracking.
 */
export function initAnalytics(): void {
  // Track initial page load
  trackPageView('app-init', {
    userAgent: navigator.userAgent,
    language: navigator.language,
  });

  // Track page views on route changes (for SPA)
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    trackPageView(window.location.pathname + window.location.hash);
  };

  // Also track hash changes (common in SPAs)
  window.addEventListener('hashchange', () => {
    trackPageView(window.location.pathname + window.location.hash);
  });

  // Global error handler
  window.addEventListener('error', (event: ErrorEvent) => {
    const error = new Error(event.message);
    error.stack = event.error?.stack;
    trackError(error, `Global error at ${event.filename}:${event.lineno}:${event.colno}`);
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason));
    trackError(error, 'Unhandled promise rejection');
  });

  // Capture page load performance timing
  if (window.performance?.timing) {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    if (loadTime > 0) {
      trackPerformance('page-load', loadTime, 'ms');
    }

    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
    if (domReady > 0) {
      trackPerformance('dom-ready', domReady, 'ms');
    }
  }
}
