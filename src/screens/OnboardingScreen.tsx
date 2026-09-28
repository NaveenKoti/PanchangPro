/**
 * OnboardingScreen - First-time user onboarding (shows once)
 * 4-step flow: Welcome → Learn (what is Panchang) → Setup (location + language) → Ready
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { MapPin, CheckCircle, Sun, Moon, Monitor, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../stores/appStore';
import { GeoLocation } from '../types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { useBreakpoints } from '../hooks/useBreakpoints';
import { PANCHANG_GLOSSARY } from '../data/panchangGlossary';

type Step = 0 | 1 | 2 | 3;

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const theme = useTheme();
  const { isMobile } = useBreakpoints();

  const { setLocation, setLanguage, setTheme: setAppTheme } = useAppStore();

  const [step, setStep] = useState<Step>(0);
  const [detectedLocation, setDetectedLocation] = useState<GeoLocation | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationTimedOut, setLocationTimedOut] = useState(false);
  // Default to Hindi when the browser locale is Hindi — Hindi-first users
  // then see Hindi from the very first explainer step, not just after setup.
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'sa' | 'kn' | 'te' | 'ta'>(() =>
    typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('hi') ? 'hi' : 'en'
  );
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { t, i18n } = useTranslation();
  // Render copy in the picked language immediately (before the choice is
  // saved to the store on completion) so all 6 locales preview live.
  useEffect(() => {
    if (i18n.language !== selectedLanguage) void i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);
  const isHindiOnboarding = selectedLanguage === 'hi';
  const limbs = PANCHANG_GLOSSARY.filter((e) => e.id !== 'panchang');
  const panchangIntro = PANCHANG_GLOSSARY[0];

  const handleDetectLocation = useCallback(() => {
    setIsDetecting(true);
    setLocationError(null);
    setLocationTimedOut(false);

    if (!navigator.geolocation) {
      setLocationError(t('onboarding.geolocationNotSupported'));
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: GeoLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          name: t('onboarding.yourLocation'),
        };
        setDetectedLocation(loc);
        setLocation(loc);
        setIsDetecting(false);
      },
      (err: GeolocationPositionError) => {
        // Timeout (code 3) is retryable — keep Allow mounted; denial is final.
        const timedOut = err.code === err.TIMEOUT;
        setLocationError(
          timedOut
            ? t('onboarding.locationTimedOut')
            : t('onboarding.locationDeniedMumbai')
        );
        setLocationTimedOut(timedOut);
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
            bgcolor: alpha(theme.palette.common.white, 0.06),
          }} />
          <Box sx={{
            position: 'absolute', bottom: -60, left: -60,
            width: 240, height: 240, borderRadius: '50%',
            bgcolor: alpha(theme.palette.common.white, 0.05),
          }} />

          {/* Logo mark */}
          <Box
            sx={{
              width: 96, height: 96, borderRadius: '50%',
              bgcolor: alpha(theme.palette.common.white, 0.15),
              backdropFilter: 'blur(8px)',
              border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 4,
            }}
          >
            <Sun size={48} color={theme.palette.primary.contrastText} strokeWidth={1.5} />
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
            {t('onboarding.tagline')}
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
            {t('onboarding.introDescription')}
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
              borderRadius: 1,
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
            {t('onboarding.welcome.getStarted')}
          </Button>

          <Button
            variant="text"
            onClick={handleComplete}
            sx={{ mt: 2, color: 'primary.contrastText', opacity: 0.6, fontSize: '0.85rem', minHeight: 48 }}
          >
            {t('onboarding.skipSetup')}
          </Button>
        </OnboardingLayout>
      )}

      {step === 1 && (
        <OnboardingLayout variant="setup" step={1}>
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 0.75, color: 'text.primary' }}>
            {t('onboarding.whatIsPanchang')}
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
                  borderRadius: 1,
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
              borderRadius: 1,
              p: 1.5,
              mb: 4,
              bgcolor: 'background.paper',
            }}
          >
            <ShieldCheck size={20} color={theme.palette.success.main} style={{ flexShrink: 0, marginTop: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {t('onboarding.privacyNote')}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => setStep(2)}
            fullWidth
            sx={{ py: 1.5, minHeight: 48, borderRadius: 1, fontWeight: 500, fontSize: '1rem' }}
          >
            {t('onboarding.continue')}
          </Button>

          <Button
            variant="text"
            onClick={() => setStep(0)}
            sx={{ mt: 1.5, color: 'text.secondary', fontSize: '0.85rem' }}
          >
            {t('onboarding.back')}
          </Button>
        </OnboardingLayout>
      )}

      {step === 2 && (
        <OnboardingLayout variant="setup" step={2}>
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 0.75, color: 'text.primary' }}>
            {t('onboarding.quickSetup')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {t('onboarding.quickSetupSubtitle')}
          </Typography>

          {/* Location */}
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
            {t('onboarding.yourLocation')}
          </Typography>
          <Box
            sx={{
              border: '1px solid',
              borderColor: detectedLocation ? 'success.main' : 'divider',
              borderRadius: 1,
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
                    {t('onboarding.locationDetected')}
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
                      {locationError ? t('onboarding.usingMumbaiDefault') : t('onboarding.allowLocationAccess')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {locationError || t('onboarding.accurateSunriseNote')}
                    </Typography>
                  </Box>
                </Box>
                {(!locationError || locationTimedOut) && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleDetectLocation}
                    disabled={isDetecting}
                    startIcon={isDetecting ? <CircularProgress size={14} /> : undefined}
                    sx={{ borderColor: 'primary.main', color: 'primary.main', borderRadius: 1, minWidth: 80, minHeight: 48 }}
                  >
                    {isDetecting ? '' : (locationTimedOut ? t('onboarding.retry') : t('onboarding.allow'))}
                  </Button>
                )}
              </Box>
            )}
          </Box>

          {/* Language */}
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
            {t('onboarding.preferences.language')}
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
            {t('settings.appearance')}
          </Typography>
          <ToggleButtonGroup
            value={selectedTheme}
            exclusive
            onChange={(_e, val) => { if (val) { setSelectedTheme(val); setAppTheme(val); } }}
            fullWidth
            sx={{ mb: 5 }}
          >
            <ToggleButton value="light" sx={{ minHeight: 48, py: 1.5, gap: 0.75, fontWeight: 500 }}>
              <Sun size={16} /> {t('theme.light')}
            </ToggleButton>
            <ToggleButton value="dark" sx={{ minHeight: 48, py: 1.5, gap: 0.75, fontWeight: 500 }}>
              <Moon size={16} /> {t('theme.dark')}
            </ToggleButton>
            <ToggleButton value="system" sx={{ minHeight: 48, py: 1.5, gap: 0.75, fontWeight: 500 }}>
              <Monitor size={16} /> {t('onboarding.themeAuto')}
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            size="large"
            onClick={() => setStep(3)}
            fullWidth
            sx={{ py: 1.5, minHeight: 48, borderRadius: 1, fontWeight: 500, fontSize: '1rem' }}
          >
            {t('onboarding.continue')}
          </Button>

          <Button
            variant="text"
            onClick={() => setStep(1)}
            sx={{ mt: 1.5, color: 'text.secondary', fontSize: '0.85rem' }}
          >
            {t('onboarding.back')}
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
            {t('onboarding.allSet')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300, lineHeight: 1.7, mb: 5 }}>
            {t('onboarding.readyDescription')}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleComplete}
            sx={{
              px: 6, py: 1.5, minHeight: 48, borderRadius: 1,
              fontWeight: 500, fontSize: '1rem',
              boxShadow: '0 6px 20px rgba(199,91,18,0.3)',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 28px rgba(199,91,18,0.4)' },
              transition: 'all 0.2s ease',
            }}
          >
            {t('onboarding.enterVedaTime')}
          </Button>

          <Button
            variant="text"
            onClick={() => setStep(2)}
            sx={{ mt: 2, color: 'text.secondary', fontSize: '0.85rem' }}
          >
            {t('onboarding.back')}
          </Button>
        </OnboardingLayout>
      )}
    </>
  );
};

export default OnboardingScreen;
