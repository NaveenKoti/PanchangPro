/**
 * GestureHandler - Central gesture management component
 * Why: Provides consistent gesture handling across the app using @use-gesture/react
 *
 * Features:
 * - Global swipe navigation between tabs
 * - Edge swipe detection for back navigation
 * - Swipe interception and routing
 * - Multi-gesture coordination
 * - Haptic feedback integration
 */

import React, { createContext, useContext, useCallback, useRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';
import { Box, useTheme } from '@mui/material';

export interface GestureConfig {
  swipeThreshold: number;
  edgeThreshold: number;
  pinchThreshold: number;
  enableHaptics: boolean;
}

export interface GestureCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onLongPress?: (position: { x: number; y: number }) => void;
  onEdgeSwipeLeft?: () => void;
  onEdgeSwipeRight?: () => void;
  onPullToRefresh?: () => void;
}

interface GestureHandlerProps {
  children: React.ReactNode;
  config?: Partial<GestureConfig>;
  callbacks?: GestureCallbacks;
  isEnabled?: boolean;
}

interface GestureContextValue {
  setCallbacks: (callbacks: Partial<GestureCallbacks>) => void;
  triggerHaptic: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
  isGestureEnabled: boolean;
}

const defaultConfig: GestureConfig = {
  swipeThreshold: 50,
  edgeThreshold: 30,
  pinchThreshold: 1.2,
  enableHaptics: true,
};

const GestureContext = createContext<GestureContextValue | null>(null);

export const useGestureHandlers = () => {
  const context = useContext(GestureContext);
  if (!context) {
    throw new Error('useGestureHandlers must be used within a GestureHandler');
  }
  return context;
};

/**
 * Trigger haptic feedback based on the gesture type
 */
const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  const patterns = {
    light: [50],
    medium: [100],
    heavy: [200],
    success: [50, 100, 50],
    error: [200, 100, 200],
  };

  navigator.vibrate(patterns[type]);
};

const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  config = {},
  callbacks = {},
  isEnabled = true,
}) => {
  const theme = useTheme();
  const configRef = useRef({ ...defaultConfig, ...config });
  const callbacksRef = useRef<GestureCallbacks>(callbacks);
  const isEnabledRef = useRef(isEnabled);
  
  const [{ x, y, scale, opacity }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
  }));

  // Pull-to-refresh state
  const pullRef = useRef({
    startY: 0,
    currentY: 0,
    isPulling: false,
    threshold: 120,
  });

  const setCallbacks = useCallback((newCallbacks: Partial<GestureCallbacks>) => {
    callbacksRef.current = { ...callbacksRef.current, ...newCallbacks };
  }, []);

  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    if (configRef.current.enableHaptics) {
      triggerHapticFeedback(type);
    }
  }, []);

  const bind = useGesture({
    // Drag gesture for swipes and pull-to-refresh
    onDrag: (state) => {
      if (!isEnabledRef.current) return;

      const [mx, my] = state.movement;
      const [vx, vy] = state.velocity;
      const isHorizontal = Math.abs(mx) > Math.abs(my);
      const { edgeThreshold } = configRef.current;

      // Edge detection
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
      const isLeftEdge = state.xy[0] < edgeThreshold;
      const isRightEdge = state.xy[0] > screenWidth - edgeThreshold;

      // Pull-to-refresh detection (top of screen, vertical drag)
      if (state.xy[1] < 100 && Math.abs(my) > Math.abs(mx) && my > 0) {
        if (!pullRef.current.isPulling) {
          pullRef.current.isPulling = true;
          pullRef.current.startY = state.xy[1];
        }
        
        pullRef.current.currentY = state.xy[1];
        const pullDistance = pullRef.current.currentY - pullRef.current.startY;
        
        if (pullDistance > 0) {
          api.start({ y: Math.min(pullDistance / 3, 40) });
        }

        if (state.last && pullDistance > pullRef.current.threshold) {
          // Threshold reached, trigger refresh
          triggerHaptic('success');
          callbacksRef.current.onPullToRefresh?.();
        } else if (state.last) {
          // Reset position
          pullRef.current.isPulling = false;
          api.start({ y: 0 });
        }
        return;
      }

      // Edge swipe right (go back)
      if (isLeftEdge && isHorizontal && mx > configRef.current.swipeThreshold && state.last) {
        triggerHaptic('light');
        callbacksRef.current.onEdgeSwipeRight?.();
        return;
      }

      // Edge swipe left
      if (isRightEdge && isHorizontal && mx < -configRef.current.swipeThreshold && state.last) {
        triggerHaptic('light');
        callbacksRef.current.onEdgeSwipeLeft?.();
        return;
      }

      // Swipe gestures
      if (state.last) {
        const absX = Math.abs(mx);
        const absY = Math.abs(my);
        const absV = Math.abs(vx);
        
        if (absX > absY && absX > configRef.current.swipeThreshold && absV > 0.5) {
          if (mx > 0) {
            triggerHaptic('light');
            callbacksRef.current.onSwipeRight?.();
          } else {
            triggerHaptic('light');
            callbacksRef.current.onSwipeLeft?.();
          }
        } else if (absY > absX && absY > configRef.current.swipeThreshold && absV > 0.5) {
          if (my > 0) {
            triggerHaptic('light');
            callbacksRef.current.onSwipeDown?.();
          } else {
            triggerHaptic('light');
            callbacksRef.current.onSwipeUp?.();
          }
        }
        
        // Reset position
        api.start({ x: 0, y: 0 });
      } else {
        // Real-time position update during drag
        api.start({ x: mx, y: 0 });
      }
    },

    // Pinch gesture for zoom
    onPinch: (state) => {
      if (!isEnabledRef.current) return;

      const scale = state.offset[0];
      api.start({ scale });

      if (state.last) {
        const delta = state.offset[0];
        
        if (delta > configRef.current.pinchThreshold) {
          triggerHaptic('medium');
          callbacksRef.current.onPinch?.(delta);
        } else if (delta < 1 / configRef.current.pinchThreshold) {
          triggerHaptic('medium');
          callbacksRef.current.onPinch?.(delta);
        }
        
        api.start({ scale: 1 });
      }
    },
  });

  return (
    <GestureContext.Provider value={{ setCallbacks, triggerHaptic, isGestureEnabled: isEnabled }}>
      <animated.div style={{ x, y, scale, opacity }}>
        <Box
          {...bind()}
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            touchAction: 'none',
            '&::before': {
              content: '""',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: theme.palette.mode === 'dark' 
                ? `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`
                : `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              opacity: pullRef.current.isPulling ? 1 : 0,
              transition: 'opacity 0.3s ease',
              zIndex: 1400,
            },
          }}
        >
          {children}
        </Box>
      </animated.div>
    </GestureContext.Provider>
  );
};

/**
 * Enhanced gesture hook for individual screens with screen-specific handlers
 */
export const useScreenGestures = (handlers: Partial<GestureCallbacks>) => {
  const { triggerHaptic } = useGestureHandlers();
  const isPullingRef = React.useRef(false);

  const bind = useGesture({
    onDrag: (state) => {
      const [mx, my] = state.movement;
      const [vx, vy] = state.velocity;

      if (state.last) {
        const absX = Math.abs(mx);
        const absY = Math.abs(my);
        const absV = Math.abs(vx);
        
        if (absX > absY && absX > 50 && absV > 0.5) {
          if (mx > 0) {
            triggerHaptic('light');
            handlers.onSwipeRight?.();
          } else {
            triggerHaptic('light');
            handlers.onSwipeLeft?.();
          }
        } else if (absY > absX && absY > 50 && absV > 0.5) {
          if (my > 0) {
            triggerHaptic('light');
            handlers.onSwipeDown?.();
          } else {
            triggerHaptic('light');
            handlers.onSwipeUp?.();
          }
        }
      }
    },

    onPinch: (state) => {
      if (state.last) {
        handlers.onPinch?.(state.offset[0]);
      }
    },
  });

  const longPressBind = useGesture({
    onDragStart: (state) => {
      // Reset long press detection on start
      isPullingRef.current = false;
    },
    onDrag: (state) => {
      // Long press detection (500ms threshold)
      const buttons = (state as any).buttons || 0;
      const holdTime = new Date().getTime() - state.startTime;
      
      // Detect long press if held for > 500ms with minimal movement
      if (holdTime > 500 && !isPullingRef.current && Math.abs(state.movement[0]) < 10 && Math.abs(state.movement[1]) < 10) {
        isPullingRef.current = true;
        triggerHaptic('medium');
        handlers.onLongPress?.({ x: state.xy[0], y: state.xy[1] });
      }
    },
    onDragEnd: (state) => {
      // Reset after gesture ends
      isPullingRef.current = false;
    },
  });

  return { bind, longPressBind };
};

export default GestureHandler;
