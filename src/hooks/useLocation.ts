/**
 * useLocation Hook - Geolocation Management
 * Why: Provides device geolocation with fallback to default location
 */

import { useState, useEffect, useCallback } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
}

export interface UseLocationReturn {
  location: LocationData;
  loading: boolean;
  error: string | null;
  refreshLocation: () => void;
}

// Default location (Ujjain, India)
const DEFAULT_LOCATION: LocationData = {
  latitude: 23.1765,
  longitude: 75.7885,
  name: 'Ujjain, India'
};

/**
 * Hook for geolocation management
 * Gets current device location using browser geolocation API
 * Falls back to default location (Ujjain, India) if denied or unavailable
 * @returns Location data with loading state and refresh function
 */
export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get current position using browser geolocation API
  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (err) => reject(err),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // 1 minute cache
        }
      );
    });
  }, []);

  // Fetch location name from coordinates using reverse geocoding
  const fetchLocationName = useCallback(async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    try {
      // Try to get location name using OpenStreetMap Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location name');
      }

      const data = await response.json();

      // Extract city/locality from response
      const address = data.address;
      const city = address.city ||
        address.town ||
        address.village ||
        address.suburb ||
        address.locality ||
        address.district;
      const state = address.state;
      const country = address.country;

      if (city && state) {
        return `${city}, ${state}`;
      } else if (city && country) {
        return `${city}, ${country}`;
      } else if (state && country) {
        return `${state}, ${country}`;
      } else if (country) {
        return country;
      }

      return 'Unknown Location';
    } catch {
      return 'Current Location';
    }
  }, []);

  // Refresh location function
  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Fetch location name
      const name = await fetchLocationName(latitude, longitude);

      setLocation({
        latitude,
        longitude,
        name
      });
    } catch (err) {
      // Determine error message
      let errorMessage: string;
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Using default location (Ujjain, India).';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Using default location (Ujjain, India).';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Using default location (Ujjain, India).';
            break;
          default:
            errorMessage = 'Unknown geolocation error. Using default location (Ujjain, India).';
        }
      } else {
        errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      }

      setError(errorMessage);
      setLocation(DEFAULT_LOCATION);
    } finally {
      setLoading(false);
    }
  }, [getCurrentPosition, fetchLocationName]);

  // Get location on mount
  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return {
    location,
    loading,
    error,
    refreshLocation
  };
}

export default useLocation;
