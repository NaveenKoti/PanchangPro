/**
 * Haptic Feedback Utility
 *
 * Provides type-safe haptic feedback using the navigator.vibrate API
 * with graceful fallback for unsupported browsers and settings toggle.
 */

// ============================================================================
// Types
// ============================================================================

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection';

// ============================================================================
// Constants
// ============================================================================

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: [10],
  medium: [20],
  heavy: [40],
  success: [10, 50, 10],
  error: [40, 30, 40],
  selection: [5],
};

const HAPTICS_STORAGE_KEY = 'panchangpro_haptics_enabled';

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Check if haptic feedback is supported by the current browser.
 */
export function isHapticSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * Check if haptic feedback is enabled in user settings.
 * Defaults to true if not explicitly set.
 */
function isHapticEnabled(): boolean {
  try {
    const stored = localStorage.getItem(HAPTICS_STORAGE_KEY);
    if (stored === null) return true; // Default to enabled
    return stored === 'true';
  } catch {
    // localStorage may be unavailable (private mode, etc.)
    return true;
  }
}

/**
 * Trigger haptic feedback with the specified pattern.
 * Gracefully falls back to no-op if not supported or disabled.
 */
export function triggerHaptic(pattern: HapticPattern): void {
  if (!isHapticSupported()) return;
  if (!isHapticEnabled()) return;

  try {
    const vibrationPattern = HAPTIC_PATTERNS[pattern];
    navigator.vibrate(vibrationPattern);
  } catch {
    // Silently fail if vibrate throws (e.g., invalid pattern)
  }
}

/**
 * Trigger haptic feedback only if supported and enabled.
 * Convenience wrapper that combines support + enabled checks.
 */
export function triggerHapticIfSupported(pattern: HapticPattern): void {
  triggerHaptic(pattern);
}

// ============================================================================
// Settings Helpers
// ============================================================================

/**
 * Enable haptic feedback in settings.
 */
export function enableHaptics(): void {
  try {
    localStorage.setItem(HAPTICS_STORAGE_KEY, 'true');
  } catch {
    // Silently fail
  }
}

/**
 * Disable haptic feedback in settings.
 */
export function disableHaptics(): void {
  try {
    localStorage.setItem(HAPTICS_STORAGE_KEY, 'false');
  } catch {
    // Silently fail
  }
}

/**
 * Toggle haptic feedback setting and return the new state.
 */
export function toggleHaptics(): boolean {
  const newState = !isHapticEnabled();
  if (newState) {
    enableHaptics();
  } else {
    disableHaptics();
  }
  return newState;
}

/**
 * Get current haptics enabled state from settings.
 */
export function getHapticsSetting(): boolean {
  return isHapticEnabled();
}
