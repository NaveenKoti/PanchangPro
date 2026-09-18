/**
 * OnboardingScreen - First-time user onboarding (shows once)
 * 4-step flow: Welcome → Learn (what is Panchang) → Setup (location + language) → Ready
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
import { MapPin, CheckCircle, Sun, Moon, Monitor, ShieldCheck } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { useAppStore } from '../stores/appStore';
import { GeoLocation } from '../types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { PANCHANG_GLOSSARY } from '../data/panchangGlossary';

type Step = 0 | 1 | 2 | 3;

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
  const isHindiOnboarding = selectedLanguage === 'hi';
  const limbs = PANCHANG_GLOSSARY.filter((e) => e.id !== 'panchang');
  const panchangIntro = PANCHANG_GLOSSARY[0];

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
              color: 'primary.contrastText',
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
              color: 'primary.contrastText',
              opacity: 0.75,
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
              color: 'primary.contrastText',
              opacity: 0.85,
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
              bgcolor: 'primary.contrastText',
              color: theme.palette.primary.main,
              fontWeight: 500,
              fontSize: '1rem',
              px: 5,
              py: 1.5,
              minHeight: 48,
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: 'primary.contrastText',
                opacity: 0.95,
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
            sx={{ mt: 2, color: 'primary.contrastText', opacity: 0.6, fontSize: '0.85rem', minHeight: 48 }}
          >
            Skip setup
          </Button>
        </OnboardingLayout>
      )}

      {step === 1 && (
        <OnboardingLayout variant="setup" step={1}>
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 0.75, color: 'text.primary' }}>
            {isHindiOnboarding ? 'पंचांग क्या है?' : 'What is Panchang?'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            {isHindiOnboarding ? panchangIntro.meaningHindi : panchangIntro.meaning}
          </Typography>

          {/* Five limbs — one line each */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            {limbs.map((limb) => (
              <Box
                key={limb.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 1.5,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'primary.main', mb: 0.25 }}>
                  {isHindiOnboarding ? limb.nameHindi : limb.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {isHindiOnboarding ? limb.meaningHindi : limb.meaning}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* No-login + reminders note */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start',
              border: '1px solid',
              borderColor: 'success.main',
              borderRadius: 2,
              p: 1.5,
              mb: 4,
              bgcolor: 'background.paper',
            }}
          >
            <ShieldCheck size={20} color={theme.palette.success.main} style={{ flexShrink: 0, marginTop: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {isHindiOnboarding
                ? 'कोई खाता नहीं, कोई लॉगिन नहीं — सब कुछ आपके फ़ोन पर रहता है। My Tithis में पारिवारिक तिथियाँ जोड़ें और सूचनाएँ चालू करें; ऐप खोलते ही VedaTime याद दिलाएगा।'
                : 'No account, no login — everything stays on your phone. Add family tithis in My Tithis and allow notifications; VedaTime reminds you when you open the app.'}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => setStep(2)}
            fullWidth
            sx={{ py: 1.5, minHeight: 48, borderRadius: 2, fontWeight: 500, fontSize: '1rem' }}
          >
            {isHindiOnboarding ? 'आगे बढ़ें' : 'Continue'}
          </Button>

          <Button
            variant="text"
            onClick={() => setStep(0)}
            sx={{ mt: 1.5, color: 'text.secondary', fontSize: '0.85rem' }}
          >
            {isHindiOnboarding ? 'पीछे' : 'Back'}
          </Button>
        </OnboardingLayout>
      )}

      {step === 2 && (
        <OnboardingLayout variant="setup" step={2}>
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
              borderRadius: 2,
              p: 2,
              mb: 3,
              bgcolor: 'background.paper',
              transition: 'all 0.3s',
            }}
          >
            {detectedLocation ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircle size={20} color={theme.palette.success.main} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
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
                  <MapPin size={20} color={locationError ? theme.palette.error.main : theme.palette.primary.main} />
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
            sx={{
              mb: 3,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
              gap: 1,
            }}
          >
            <ToggleButton value="en" sx={{ minHeight: 48, py: 1.5, fontWeight: 500 }}>English</ToggleButton>
            <ToggleButton value="hi" sx={{ minHeight: 48, py: 1.5, fontWeight: 500 }}>हिंदी</ToggleButton>
            <ToggleButton value="sa" sx={{ minHeight: 48, py: 1.5, fontWeight: 500 }}>संस्कृत</ToggleButton>
            <ToggleButton value="kn" sx={{ minHeight: 48, py: 1.5, fontWeight: 500 }}>ಕನ್ನಡ</ToggleButton>
            <ToggleButton value="te" sx={{ minHeight: 48, py: 1.5, fontWeight: 500 }}>తెలుగు</ToggleButton>
            <ToggleButton value="ta" sx={{ minHeight: 48, py: 1.5, fontWeight: 500 }}>தமிழ்</ToggleButton>
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
            <ToggleButton value="light" sx={{ minHeight: 48, py: 1.5, gap: 0.75, fontWeight: 500 }}>
              <Sun size={16} /> Light
            </ToggleButton>
            <ToggleButton value="dark" sx={{ minHeight: 48, py: 1.5, gap: 0.75, fontWeight: 500 }}>
              <Moon size={16} /> Dark
            </ToggleButton>
            <ToggleButton value="system" sx={{ minHeight: 48, py: 1.5, gap: 0.75, fontWeight: 500 }}>
              <Monitor size={16} /> Auto
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            size="large"
            onClick={() => setStep(3)}
            fullWidth
            sx={{ py: 1.5, minHeight: 48, borderRadius: 2, fontWeight: 500, fontSize: '1rem' }}
          >
            Continue
          </Button>

          <Button
            variant="text"
            onClick={() => setStep(1)}
            sx={{ mt: 1.5, color: 'text.secondary', fontSize: '0.85rem' }}
          >
            Back
          </Button>
        </OnboardingLayout>
      )}

      {step === 3 && (
        <OnboardingLayout variant="ready" step={3}>
          <Box
            sx={{
              width: 80, height: 80, borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 3,
              boxShadow: '0 8px 24px rgba(199,91,18,0.35)',
            }}
          >
            <CheckCircle size={36} color={theme.palette.primary.contrastText} />
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
              px: 6, py: 1.5, minHeight: 48, borderRadius: 2,
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
            onClick={() => setStep(2)}
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
