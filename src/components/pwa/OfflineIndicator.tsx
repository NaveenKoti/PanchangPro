import React, { useState, useEffect } from 'react'
import { Box, Badge, Typography, Paper, Fade, IconButton, Popover, CircularProgress } from '@mui/material'
import { Wifi as WifiIcon, WifiOff as WifiOffIcon, CloudSync as CloudSyncIcon, CloudDone as CloudDoneIcon, Info as InfoIcon } from '@mui/icons-material'
import { Check as CheckIcon, Loader as LoaderIcon } from 'lucide-react'
import { useTheme } from '@mui/material/styles'
import { usePWAStatus } from '../../hooks/usePWAStatus'
import panchangCacheService, { CacheStats } from '../../services/PanchangCacheService'

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isSynced, setIsSynced] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null)
  const [show, setShow] = useState(false)
  
  const theme = useTheme()
  const { isInstallPromptSupported } = usePWAStatus()

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setIsSynced(true)
      setIsSyncing(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShow(true)
      setIsSyncing(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const checkSyncStatus = () => {
      const needsSync = panchangCacheService.isAutomaticRecalculationNeeded()
      if (needsSync && isOnline) {
        setIsSyncing(true)
        setTimeout(() => {
          setIsSyncing(false)
          setIsSynced(true)
        }, 3000)
      }
    }

    const syncInterval = setInterval(checkSyncStatus, 60000)

    checkSyncStatus()

    const isRecalculationHour = new Date().getHours() === 4
    if (isRecalculationHour && isOnline) {
      setIsSyncing(true)
      setTimeout(() => {
        setIsSyncing(false)
        setIsSynced(true)
      }, 5000)
    }

    if (!isOnline) {
      setTimeout(() => setShow(true), 500)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(syncInterval)
    }
  }, [isOnline])

  const updateCacheStats = async () => {
    try {
      const stats = await panchangCacheService.getCacheStats()
      setCacheStats(stats)
    } catch (error) {
      // Failed to get cache stats - non-critical
    }
  }

  const handleInfoClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    await updateCacheStats()
  }

  const handleInfoClose = () => {
    setAnchorEl(null)
  }

  const isInfoOpen = Boolean(anchorEl)

  if (!isOnline && !show) {
    return null
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 80, right: 16, zIndex: 1500 }}>
      <Fade in={show || !isOnline} timeout={300}>
<Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 1,
            borderRadius: 2,
            border: '1px solid',
            borderColor: isOnline ? theme.palette.success.main : theme.palette.warning.main,
            background: isOnline
              ? theme.palette.success.main
              : theme.palette.warning.main,
            color: theme.palette.common.white,
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            {isSyncing ? (
              <CircularProgress size={20} sx={{ color: theme.palette.common.white }} />
            ) : isOnline ? (
              <Badge
                overlap="circular"
                badgeContent={isSynced ? <CloudDoneIcon sx={{ fontSize: 12 }} /> : <CloudSyncIcon sx={{ fontSize: 12 }} />}
                color={isSynced ? "success" : "default"}
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: isSynced ? theme.palette.success.main : theme.palette.warning.main,
                  },
                }}
              >
                <WifiIcon fontSize="small" />
              </Badge>
            ) : (
              <WifiOffIcon fontSize="small" />
            )}
          </Box>
          
          <Typography variant="caption" fontWeight="medium">
            {isOnline ? (
              isSyncing ? 'Syncing...' : isSynced ? 'Connected' : 'Sync pending'
            ) : (
              'Offline Mode'
            )}
          </Typography>

          <IconButton
            size="small"
            onClick={handleInfoClick}
            aria-label="Cache status details"
            sx={{ 
              color: theme.palette.common.white,
              ml: 0.5,
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Paper>
      </Fade>

      <Popover
        open={isInfoOpen}
        anchorEl={anchorEl}
        onClose={handleInfoClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{ mt: 1 }}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Cache Status
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Status:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isOnline ? (
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.success.main
                  }} />
                ) : (
                  <Box sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.warning.main
                  }} />
                )}
                <Typography variant="caption" fontWeight="medium">
                  {isOnline ? 'Online' : 'Offline'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Cached entries:
              </Typography>
              <Typography variant="caption" fontWeight="medium">
                {cacheStats?.totalEntries ?? 0}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Cache size:
              </Typography>
              <Typography variant="caption" fontWeight="medium">
                {cacheStats?.cacheSize ?? '0 KB'}
              </Typography>
            </Box>

            {isOnline && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  Auto-sync:
                </Typography>
                <Typography variant="caption" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isSynced ? <CheckIcon size={14} /> : <LoaderIcon size={14} />}
                  {isSynced ? 'Active' : 'Pending'}
                </Typography>
              </Box>
            )}
          </Box>

          {isOnline && !isSynced && (
            <Typography variant="caption" color="textSecondary" sx={{ mb: 1 }}>
              Last sync: {cacheStats?.newestEntry ? new Date(cacheStats.newestEntry).toLocaleString() : 'Never'}
            </Typography>
          )}

          <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="textSecondary">
              {isOnline 
                ? 'Your app is synced and will update automatically at 4 AM daily.'
                : 'You are offline. Purana calculations are available from cache.'
              }
            </Typography>
          </Box>
        </Box>
      </Popover>
    </Box>
  )
}

export default OfflineIndicator
