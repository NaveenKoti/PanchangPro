/**
 * OnboardingScreen - First-time user onboarding (shows once)
 * 3-step flow: Welcome → Setup (location + language) → Ready
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { MapPin, CheckCircle, Sun, Moon, Monitor } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useAppStore } from '../stores/appStore';
import { GeoLocation } from '../types';
import { OnboardingLayout } from '../components/OnboardingLayout';

type Step = 0 | 1 | 2;

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useI18n();

  const { setLocation, setLanguage, setTheme: setAppTheme } = useAppStore();

  const [step, setStep] = useState<Step>(0);
  const [detectedLocation, setDetectedLocation] = useState<GeoLocation | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'sa' | 'kn' | 'te' | 'ta'>('en');
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('system');

  const handleDetectLocation = useCallback(() => {
    setIsDetecting(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: GeoLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          name: t('onboarding.location.detected') || 'Your Location',
        };
        setDetectedLocation(loc);
        setLocation(loc);
        setIsDetecting(false);
      },
      () => {
        setLocationError(t('onboarding.location.permissionDenied') || 'Location access denied — using Mumbai');
        setIsDetecting(false);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [setLocation, t]);

  const handleComplete = useCallback(() => {
    setLanguage(selectedLanguage);
    setAppTheme(selectedTheme);
    onComplete();
  }, [selectedLanguage, selectedTheme, setLanguage, setAppTheme, onComplete]);

  return (
    <>
      {step === 0 && (
        <OnboardingLayout variant="welcome">
          {/* Decorative circles */}
          <Box sx={{
            position: 'absolute', top: -80, right: -80,
            width: 300, height: 300, borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.06)',
          }} />
          <Box sx={{
            position: 'absolute', bottom: -60, left: -60,
            width: 240, height: 240, borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.05)',
          }} />

          {/* Logo mark */}
          <Box
            sx={{
              width: 96, height: 96, borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 4,
            }}
          >
            <Typography sx={{ fontSize: '2.8rem', lineHeight: 1 }}>🕉️</Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 500,
              fontSize: isMobile ? '2.4rem' : '3rem',
              color: '#FFF8F0',
              letterSpacing: '-0.02em',
              mb: 1,
              textAlign: 'center',
            }}
          >
            VedaTime
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,248,240,0.75)',
              fontWeight: 400,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: '0.85rem',
              mb: 5,
              textAlign: 'center',
            }}
          >
            Sacred Rhythms of Time
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,248,240,0.85)',
              textAlign: 'center',
              maxWidth: 320,
              lineHeight: 1.7,
              mb: 6,
              fontWeight: 400,
            }}
          >
            Your daily Vedic companion — accurate Panchang, lunar calendar, and Ayurvedic guidance in one app.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => setStep(1)}
            sx={{
              bgcolor: '#FFF8F0',
              color: theme.palette.primary.main,
              fontWeight: 500,
              fontSize: '1rem',
              px: 5,
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: '#FFFFFF',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Get Started
          </Button>

          <Button
            variant="text"
            onClick={handleComplete}
            sx={{ mt: 2, color: 'rgba(255,248,240,0.6)', fontSize: '0.85rem' }}
          >
            Skip setup
          </Button>
        </OnboardingLayout>
      )}

      {step === 1 && (
        <OnboardingLayout variant="setup">
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 0.75, color: 'text.primary' }}>
            Quick Setup
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Takes 30 seconds — you can always change these in Settings.
          </Typography>

          {/* Location */}
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
            Your Location
          </Typography>
          <Box
            sx={{
              border: '1px solid',
              borderColor: detectedLocation ? 'success.main' : 'divider',
              borderRadius: 2.5,
              p: 2,
              mb: 3,
              bgcolor: detectedLocation ? 'rgba(61,107,36,0.04)' : 'background.paper',
              transition: 'all 0.3s',
            }}
          >
            {detectedLocation ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle size={20} color="#3D6B24" />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#3D6B24' }}>
                    Location detected
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {detectedLocation.latitude.toFixed(3)}, {detectedLocation.longitude.toFixed(3)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <MapPin size={20} color={locationError ? '#A33030' : theme.palette.primary.main} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {locationError ? 'Using Mumbai (default)' : 'Allow location access'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {locationError || 'For accurate sunrise & timings'}
                    </Typography>
                  </Box>
                </Box>
                {!locationError && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleDetectLocation}
                    disabled={isDetecting}
                    startIcon={isDetecting ? <CircularProgress size={14} /> : undefined}
                    sx={{ borderColor: 'primary.main', color: 'primary.main', borderRadius: 2, minWidth: 80 }}
                  >
                    {isDetecting ? '' : 'Allow'}
                  </Button>
                )}
              </Box>
            )}
          </Box>

          {/* Language */}
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
            Language
          </Typography>
          <ToggleButtonGroup
            value={selectedLanguage}
            exclusive
            onChange={(_e, val) => { if (val) setSelectedLanguage(val); }}
            fullWidth
            sx={{ mb: 3 }}
          >
            <ToggleButton value="en" sx={{ py: 1.25, fontWeight: 500 }}>English</ToggleButton>
            <ToggleButton value="hi" sx={{ py: 1.25, fontWeight: 500 }}>हिंदी</ToggleButton>
            <ToggleButton value="sa" sx={{ py: 1.25, fontWeight: 500 }}>संस्कृत</ToggleButton>
            <ToggleButton value="kn" sx={{ py: 1.25, fontWeight: 500 }}>ಕನ್ನಡ</ToggleButton>
            <ToggleButton value="te" sx={{ py: 1.25, fontWeight: 500 }}>తెలుగు</ToggleButton>
            <ToggleButton value="ta" sx={{ py: 1.25, fontWeight: 500 }}>தமிழ்</ToggleButton>
          </ToggleButtonGroup>

          {/* Theme */}
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
            Appearance
          </Typography>
          <ToggleButtonGroup
            value={selectedTheme}
            exclusive
            onChange={(_e, val) => { if (val) { setSelectedTheme(val); setAppTheme(val); } }}
            fullWidth
            sx={{ mb: 5 }}
          >
            <ToggleButton value="light" sx={{ py: 1.25, gap: 0.75, fontWeight: 500 }}>
              <Sun size={16} /> Light
            </ToggleButton>
            <ToggleButton value="dark" sx={{ py: 1.25, gap: 0.75, fontWeight: 500 }}>
              <Moon size={16} /> Dark
            </ToggleButton>
            <ToggleButton value="system" sx={{ py: 1.25, gap: 0.75, fontWeight: 500 }}>
              <Monitor size={16} /> Auto
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            size="large"
            onClick={() => setStep(2)}
            fullWidth
            sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 500, fontSize: '1rem' }}
          >
            Continue
          </Button>

          <Button
            variant="text"
            onClick={() => setStep(0)}
            sx={{ mt: 1.5, color: 'text.secondary', fontSize: '0.85rem' }}
          >
            Back
          </Button>
        </OnboardingLayout>
      )}

      {step === 2 && (
        <OnboardingLayout variant="ready">
          <Box
            sx={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #C75B12 0%, #E8944A 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 3,
              boxShadow: '0 8px 24px rgba(199,91,18,0.35)',
            }}
          >
            <CheckCircle size={36} color="#FFF8F0" />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 500, mb: 1, color: 'text.primary' }}>
            You're all set
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300, lineHeight: 1.7, mb: 5 }}>
            VedaTime is ready. Your daily Panchang, lunar calendar, and sacred timings await.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleComplete}
            sx={{
              px: 6, py: 1.5, borderRadius: 3,
              fontWeight: 500, fontSize: '1rem',
              boxShadow: '0 6px 20px rgba(199,91,18,0.3)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 28px rgba(199,91,18,0.4)' },
              transition: 'all 0.2s ease',
            }}
          >
            Enter VedaTime
          </Button>

          <Button
            variant="text"
            onClick={() => setStep(1)}
            sx={{ mt: 2, color: 'text.secondary', fontSize: '0.85rem' }}
          >
            Back
          </Button>
        </OnboardingLayout>
      )}
    </>
  );
};

export default OnboardingScreen;
