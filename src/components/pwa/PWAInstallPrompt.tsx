import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Paper, 
  Typography, 
  Slide, 
  IconButton,
  Fade,
  useTheme,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { 
  Close as CloseIcon,
  AddToHomeScreen as InstallIcon,
  OfflinePin as OfflineIcon,
  NotificationsActive as NotificationIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Celebration as CelebrationIcon,
  Circle as CircleIcon
} from '@mui/icons-material'
import './PWAInstall.css'
import { usePWAStatus } from '../../hooks/usePWAStatus'

interface PWAInstallPromptProps {
  open?: boolean
  onAccept?: () => void | Promise<void> | boolean | Promise<boolean>
  onDismiss?: () => void
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ 
  open: controlledOpen,
  onAccept,
  onDismiss
}) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const [installInProgress, setInstallInProgress] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  // Manual steps view: shown when the browser has no install prompt
  // (iOS Safari, in-app browsers) — the honest fallback path.
  const [showSteps, setShowSteps] = useState(false)
  const theme = useTheme()
  const { platform, isStandalone, isInstallPromptSupported, promptInstall } = usePWAStatus()

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  useEffect(() => {
    if (installInProgress) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [installInProgress])

  const handleInstall = async () => {
    // No native prompt (iOS Safari, in-app browsers, already-installed):
    // show the manual steps instead of faking an installation.
    if (!isInstallPromptSupported) {
      setShowSteps(true)
      return
    }
    setInstallInProgress(true)
    setSuccessVisible(false)

    // Real browser prompt (Chrome/Edge/Samsung): only celebrate acceptance.
    const accepted = await promptInstall()
    setInstallInProgress(false)
    if (!accepted) return

    if (onAccept) {
      const result = onAccept()
      if (result instanceof Promise) {
        const awaitedResult = await result
        if (awaitedResult !== false) {
          setTimeout(() => {
            setSuccessVisible(true)
            setTimeout(() => {
              setSuccessVisible(false)
              setInstallInProgress(false)
              handleDismiss()
            }, 2000)
          }, 1000)
        }
      } else if (result !== false) {
        setTimeout(() => {
          setSuccessVisible(true)
          setTimeout(() => {
            setSuccessVisible(false)
            setInstallInProgress(false)
            handleDismiss()
          }, 2000)
        }, 1000)
      }
    } else {
      setTimeout(() => {
        setSuccessVisible(true)
        setTimeout(() => {
          setSuccessVisible(false)
          setInstallInProgress(false)
          setInternalOpen(false)
        }, 2000)
      }, 1000)
    }
  }

  // Manual install steps per platform (no native prompt available).
  const installSteps: { title: string; titleHi: string; detail: string; detailHi: string }[] =
    platform === 'iOS'
      ? [
          { title: 'Tap the Share button in Safari', titleHi: 'Safari में शेयर बटन दबाएं', detail: 'Bottom toolbar, square with arrow', detailHi: 'नीचे टूलबार में तीर वाला बटन' },
          { title: 'Tap “Add to Home Screen”', titleHi: '“होम स्क्रीन में जोड़ें” चुनें', detail: 'Scroll the share sheet if needed', detailHi: 'जरूरत हो तो शेयर शीट स्क्रॉल करें' },
          { title: 'Tap Add (top right)', titleHi: 'Add दबाएं (ऊपर दाएं)', detail: 'VedaTime appears on your home screen', detailHi: 'VedaTime होम स्क्रीन पर आ जाएगा' },
        ]
      : platform === 'Android'
        ? [
            { title: 'Tap the ⋮ menu in Chrome', titleHi: 'Chrome में ⋮ मेनू खोलें', detail: 'Top-right corner of the browser', detailHi: 'ब्राउज़र के ऊपर दाएं कोने में' },
            { title: 'Tap “Add to Home screen”', titleHi: '“होम स्क्रीन में जोड़ें” चुनें', detail: 'Or “Install app” if shown', detailHi: 'या “ऐप इंस्टॉल करें” दिखे तो वही' },
            { title: 'Confirm Add / Install', titleHi: 'जोड़ें / इंस्टॉल की पुष्टि करें', detail: 'VedaTime appears on your home screen', detailHi: 'VedaTime होम स्क्रीन पर आ जाएगा' },
          ]
        : [
            { title: 'Click the install icon in the address bar', titleHi: 'एड्रेस बार में इंस्टॉल आइकन क्लिक करें', detail: 'Computer / monitor symbol at the right end', detailHi: 'दाएं छोर पर कंप्यूटर जैसा निशान' },
            { title: 'Click Install in the popup', titleHi: 'पॉपअप में Install दबाएं', detail: 'Works in Chrome and Edge', detailHi: 'Chrome और Edge में काम करता है' },
          ]
  const iosNote =
    platform === 'iOS'
      ? { en: 'Open this page in Safari — Chrome and in-app browsers cannot install.', hi: 'यह पेज Safari में खोलें — Chrome से इंस्टॉल नहीं होगा।' }
      : null

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss()
    }
    setInternalOpen(false)
    setSuccessVisible(false)
    setInstallInProgress(false)
    setShowSteps(false)
  }

  const benefits = [
    {
      icon: <OfflineIcon color="primary" />,
      title: 'Offline Access',
      description: 'View Panchang anytime, even without internet'
    },
    {
      icon: <NotificationIcon color="secondary" />,
      title: 'Smart Notifications',
      description: 'Get timely alerts for festivals and fasts'
    },
    {
      icon: <SpeedIcon sx={{ color: theme.palette.primary.main }} />,
      title: 'Lightning Fast',
      description: 'Native app performance with instant loading'
    },
    {
      icon: <SecurityIcon sx={{ color: theme.palette.success.main }} />,
      title: 'Secure & Private',
      description: 'Your data stays on your device'
    }
  ]

  return (
    <Dialog
      open={open}
      onClose={handleDismiss}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
        }
      }}
      className="pwa-install-dialog"
    >
      {successVisible ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: 400
          }}
        >
          <Fade in={successVisible} timeout={{ enter: 1000 }}>
            <Box sx={{ textAlign: 'center' }}>
              <CelebrationIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />
              <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                Success! 🎉
              </Typography>
              <Typography variant="body1" color="textSecondary">
                VedaTime is now installed on your device!
              </Typography>
            </Box>
          </Fade>
        </Box>
      ) : (
        <>
          <DialogTitle sx={{ pb: 1, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <InstallIcon sx={{ fontSize: 32, position: 'relative', zIndex: 2 }} />
                <Box 
                  className="pwa-install-anim-bg"
                  sx={{ 
                    position: 'absolute', 
                    inset: 0,
                    opacity: 0.1 
                  }}
                >
                  {[...Array(3)].map((_, i) => (
                    <CircleIcon key={i} sx={{
                      position: 'absolute',
                      fontSize: `${20 + i * 20}px`,
                      top: `${i * 20}%`,
                      left: `${i * 20}%`,
                      color: 'white'
                    }} />
                  ))}
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="span" sx={{ mb: 0.5 }}>
                  Install VedaTime
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Add VedaTime to your home screen for the best experience
                </Typography>
              </Box>
              <IconButton onClick={handleDismiss} size="small" aria-label="Dismiss install prompt">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              {isStandalone ? (
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                  You are already using the installed VedaTime app. Add it to more home screens from your device settings if you like.
                </Typography>
              ) : showSteps ? (
                <>
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                    Your browser needs a manual step — it takes 20 seconds:
                  </Typography>
                  <List disablePadding>
                    {installSteps.map((step, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 1.5, alignItems: 'flex-start' }}>
                        <Box
                          sx={{
                            width: 28, height: 28, borderRadius: '50%', flexShrink: 0, mr: 1.5, mt: 0.25,
                            bgcolor: 'primary.main', color: (theme) => theme.palette.getContrastText(theme.palette.primary.main),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.875rem', fontWeight: 500,
                          }}
                        >
                          {index + 1}
                        </Box>
                        <ListItemText
                          primary={<Typography variant="body2" fontWeight="medium">{step.title}</Typography>}
                          secondary={<><Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>{step.titleHi}</Typography><Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>{step.detail} · {step.detailHi}</Typography></>}
                        />
                      </ListItem>
                    ))}
                  </List>
                  {iosNote && (
                    <Typography variant="caption" color="warning.main" sx={{ textAlign: 'center', display: 'block' }}>
                      {iosNote.en} {iosNote.hi}
                    </Typography>
                  )}
                </>
              ) : (
              <>
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                Get all these amazing features when you install:
              </Typography>
              
              <List disablePadding>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {benefit.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {benefit.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="textSecondary">
                          {benefit.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(199, 91, 18, 0.1)' : 'rgba(199, 91, 18, 0.05)',
                  borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(199, 91, 18, 0.3)' : 'rgba(199, 91, 18, 0.2)'
                }}
              >
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box component="span" sx={{ color: theme.palette.primary.main, display: 'flex' }}><SpeedIcon fontSize="small" /></Box>
                  One-click installation • Takes only 2 seconds
                </Typography>
              </Paper>
              </>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2, pt: 1 }}>
            {showSteps || isStandalone ? (
              <Button onClick={handleDismiss} variant="contained" fullWidth sx={{ borderRadius: 1, py: 1.25, fontWeight: 500 }}>
                Done
              </Button>
            ) : (
            <>
            <Button
              onClick={handleDismiss}
              variant="text"
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.05)' }
              }}
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleInstall}
              variant="contained"
              disabled={installInProgress}
              startIcon={installInProgress ? null : <InstallIcon />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                fontWeight: 500,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                '&:hover': { background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})` },
                '&:disabled': { background: theme.palette.action.disabledBackground }
              }}
            >
              {installInProgress ? 'Installing...' : 'Install Now'}
            </Button>
            </>
            )}
          </DialogActions>
        </>
      )}

 {installInProgress && !successVisible && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{ animation: 'pulse 1.5s infinite' }}>
            <CircleIcon sx={{ fontSize: 100, color: 'rgba(255, 255, 255, 0.9)' }} />
          </Box>
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            Installing VedaTime...
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Please wait while we set up your app
          </Typography>
        </Box>
      </Box>
    )}
    </Dialog>
  )
}

export const PWAInstallButton: React.FC<{ 
  onClick?: () => void,
  variant?: 'icon' | 'button' | 'fab',
  color?: 'primary' | 'secondary'
}> = ({ onClick, variant = 'button', color = 'primary' }) => {
  const theme = useTheme()

  if (variant === 'fab') {
    return (
      <Box 
        sx={{ 
          position: 'fixed', 
          bottom: 100, 
          right: 16, 
          zIndex: 1000,
          '@media (min-width: 960px)': {
            display: 'none'
          }
        }}
      >
        <Box
          onClick={onClick}
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: color === 'primary'
              ? theme.palette.primary.main
              : theme.palette.secondary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: (theme) => color === 'primary'
              ? `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(199, 91, 18, 0.4)' : 'rgba(199, 91, 18, 0.3)'}`
              : `0 4px 12px rgba(0,0,0,0.3)`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: (theme) => color === 'primary'
                ? `0 6px 16px ${theme.palette.mode === 'dark' ? 'rgba(199, 91, 18, 0.5)' : 'rgba(199, 91, 18, 0.4)'}`
                : '0 6px 16px rgba(0,0,0,0.4)'
            },
            '&:active': {
              transform: 'scale(0.95)'
            },
            '& .MuiSvgIcon-root': {
              color: 'white'
            }
          }}
        >
          <InstallIcon />
        </Box>
      </Box>
    )
  }

  if (variant === 'icon') {
    return (
      <IconButton
        onClick={onClick}
        className="pwa-install-icon"
        aria-label="Install app"
        sx={{
          color: theme.palette.primary.main,
          '&:hover': {
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(199, 91, 18, 0.2)' : 'rgba(199, 91, 18, 0.1)'
          }
        }}
      >
        <InstallIcon />
      </IconButton>
    )
  }

  return (
    <Chip
      onClick={onClick}
      label="Install App"
      icon={<InstallIcon />}
      variant="outlined"
      className="pwa-install-chip"
      sx={{
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        fontWeight: 500,
        '&:hover': {
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(199, 91, 18, 0.2)' : 'rgba(199, 91, 18, 0.1)',
          borderColor: theme.palette.primary.dark
        }
      }}
    />
  )
}

export default PWAInstallPrompt
