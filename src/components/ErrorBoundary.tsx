/**
 * ErrorBoundary — Catches React rendering errors and shows a graceful fallback
 *
 * Prevents the app from showing a blank white screen when an uncaught error
 * occurs in a child component. Logs errors to the analytics service.
 *
 * IMPORTANT: The fallback UI must NOT depend on MUI theme context, because
 * the ErrorBoundary wraps the entire app (including ThemeProvider). If an
 * error occurs inside ThemeProvider's children, the fallback renders without
 * any MUI context available.
 */

import React from 'react';
import { trackError } from '../services/analytics';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Report to analytics
    try {
      trackError(error, `React ErrorBoundary caught: ${errorInfo.componentStack || 'unknown component'}`);
    } catch {
      // Analytics failure is non-critical
    }

    // Call optional onError handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultFallback error={this.state.error} onRetry={this.handleReset} />;
    }

    return this.props.children;
  }
}

// Inline styles — no MUI theme dependency (works without ThemeProvider context)
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 24,
    textAlign: 'center',
    backgroundColor: '#fefefe',
    color: '#2c2c2c',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  icon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  heading: {
    fontWeight: 500 as const,
    fontSize: '1.25rem',
    marginBottom: 8,
    margin: 0,
  },
  text: {
    fontSize: '0.875rem',
    color: '#6b6b6b',
    marginBottom: 24,
    // Responsive: was fixed 360px, now shrinks on narrow screens.
    maxWidth: 'min(360px, calc(100vw - 48px))',
    width: '100%',
    lineHeight: 1.5,
    margin: '0 0 24px 0',
  },
  pre: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    fontSize: '0.75rem',
    textAlign: 'left' as const,
    overflow: 'auto',
    maxHeight: 200,
    maxWidth: 'min(560px, calc(100vw - 48px))',
    width: '100%',
    boxSizing: 'border-box' as const,
    color: '#6b6b6b',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap' as const,
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 32px',
    borderRadius: 20,
    border: 'none',
    backgroundColor: '#C75B12',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
};

interface DefaultFallbackProps {
  error: Error | null;
  onRetry: () => void;
}

const DefaultFallback: React.FC<DefaultFallbackProps> = ({ error, onRetry }) => {
  // Dark mode via CSS media query (no MUI dependency)
  const prefersDark = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const darkStyles: Record<string, React.CSSProperties> = prefersDark ? {
    container: { ...styles.container, backgroundColor: '#121212', color: '#e0e0e0' },
    text: { ...styles.text, color: '#9e9e9e' },
    pre: { ...styles.pre, backgroundColor: 'rgba(255,255,255,0.05)', color: '#9e9e9e' },
    button: { ...styles.button, backgroundColor: '#FFB380' },
  } : {};

  return (
    <div style={{ ...styles.container, ...darkStyles.container }}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={prefersDark ? '#FFB380' : '#C75B12'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={styles.icon}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>

      <h1 style={styles.heading}>Something went wrong</h1>

      <p style={{ ...styles.text, ...darkStyles.text }}>
        An unexpected error occurred. The app has been logged for diagnosis.
        {process.env.NODE_ENV === 'development' && error && (
          <>
            <br />
            <code style={{ ...styles.pre, ...darkStyles.pre }}>
              {error.message}
              {'\n\n'}
              {error.stack}
            </code>
          </>
        )}
      </p>

      <button
        onClick={onRetry}
        style={{ ...styles.button, ...darkStyles.button }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${prefersDark ? 'rgba(255,179,128,0.3)' : 'rgba(199,91,18,0.3)'}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.97)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        Try Again
      </button>
    </div>
  );
};

export default ErrorBoundary;
