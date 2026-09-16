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
  const theme = useTheme()

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen

  useEffect(() => {
    if (installInProgress) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [installInProgress])

  const handleInstall = async () => {
    setInstallInProgress(true)
    setSuccessVisible(false)

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
          }, 3000)
        } else {
          setInstallInProgress(false)
        }
      } else if (result !== false) {
        setTimeout(() => {
          setSuccessVisible(true)
          setTimeout(() => {
            setSuccessVisible(false)
            setInstallInProgress(false)
            handleDismiss()
          }, 2000)
        }, 3000)
      } else {
        setInstallInProgress(false)
      }
    } else {
      setTimeout(() => {
        setSuccessVisible(true)
        setTimeout(() => {
          setSuccessVisible(false)
          setInstallInProgress(false)
          setInternalOpen(false)
        }, 2000)
      }, 3000)
    }
  }

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss()
    }
    setInternalOpen(false)
    setSuccessVisible(false)
    setInstallInProgress(false)
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
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #F5F3F0 0%, #FEFEFE 100%)',
          overflow: 'hidden'
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
              <IconButton onClick={handleDismiss} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
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
                  <Box component="span" sx={{ color: theme.palette.primary.main }}>⚡</Box>
                  One-click installation • Takes only 2 seconds
                </Typography>
              </Paper>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2, pt: 1 }}>
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
                fontWeight: 'bold',
                color: theme.palette.getContrastText(theme.palette.primary.main),
                '&:hover': { background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})` },
                '&:disabled': { background: 'linear-gradient(135deg, #ccc, #999)' }
              }}
            >
              {installInProgress ? 'Installing...' : 'Install Now'}
            </Button>
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
        fontWeight: 'bold',
        '&:hover': {
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(199, 91, 18, 0.2)' : 'rgba(199, 91, 18, 0.1)',
          borderColor: theme.palette.primary.dark
        }
      }}
    />
  )
}

export default PWAInstallPrompt
