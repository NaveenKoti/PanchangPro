import { useMemo, useRef, useEffect } from 'react';

interface PerformanceOptions {
  measure?: boolean;
  label?: string;
}

export function usePerformanceMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  options: PerformanceOptions = {}
): T {
  const { measure = false, label } = options;
  const measureRef = useRef<PerformanceMeasure | null>(null);

  useEffect(() => {
    if (measure && label && typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${label}-start`);
    }

    return () => {
      if (measure && label && performance.mark && performance.measure) {
        performance.mark(`${label}-end`);
        
        try {
          measureRef.current = performance.measure(
            label,
            `${label}-start`,
            `${label}-end`
          );
        } catch (e) {
          // Ignore measurement errors
        }
      }
    };
  }, [measure, label, ...deps]);

  return useMemo(() => {
    return factory();
  }, deps);
}
