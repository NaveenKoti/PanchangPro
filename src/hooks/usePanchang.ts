/**
 * usePanchang Hook - Panchang Calculations
 * Why: Provides reactive panchang data with loading and error states
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { PanchangEngine } from '../engine/panchang';
import { Panchang } from '../types';
import { useAppStore } from '../stores/appStore';

export interface UsePanchangReturn {
  panchangData: Panchang | null;
  loading: boolean;
  error: string | null;
  recalculate: (date?: Date) => void;
}

/**
 * Hook for panchang calculations
 * @param initialDate - Optional initial date (defaults to today)
 * @returns Panchang data with loading state and recalculate function
 */
export function usePanchang(initialDate?: Date): UsePanchangReturn {
  const [panchangData, setPanchangData] = useState<Panchang | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get location from app store
  const preferences = useAppStore((state) => state.preferences);
  const location = preferences.location;

  // Use ref for engine to maintain instance across renders
  const engineRef = useRef<PanchangEngine | null>(null);

  // Initialize or update engine when location changes
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new PanchangEngine(location);
    } else {
      engineRef.current.setLocation(location);
    }
  }, [location]);

  // Calculate panchang for a given date
  const calculatePanchang = useCallback((date: Date): Panchang | null => {
    if (!engineRef.current) {
      engineRef.current = new PanchangEngine(location);
    }

    try {
      // Ensure we're working with local midnight
      const localDate = new Date(date);
      localDate.setHours(0, 0, 0, 0);

      // Calculate base panchang
      const panchang = engineRef.current.calculate(localDate);

      // Enrich with festivals from data layer
      // Note: The engine returns festivals as empty array, would need festival service
      return panchang;
    } catch (err) {
      throw err;
    }
  }, [location]);

  // Recalculate function that can be called to refresh data
  const recalculate = useCallback((date?: Date) => {
    setLoading(true);
    setError(null);

    try {
      const targetDate = date ?? new Date();
      const result = calculatePanchang(targetDate);
      setPanchangData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate panchang';
      setError(errorMessage);
      setPanchangData(null);
    } finally {
      setLoading(false);
    }
  }, [calculatePanchang]);

  // Initial calculation on mount and when location changes
  useEffect(() => {
    recalculate(initialDate);
  }, [initialDate, recalculate, location]);

  return {
    panchangData,
    loading,
    error,
    recalculate
  };
}

export default usePanchang;
