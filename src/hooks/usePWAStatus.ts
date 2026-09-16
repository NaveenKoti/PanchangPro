import { useState, useEffect } from 'react'

interface PWAInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export interface PWAStatus {
  isInstallPromptSupported: boolean
  isAppInstalled: boolean
  isStandalone: boolean
  platform: 'iOS' | 'Android' | 'Windows' | 'Mac' | 'Other'
  serviceWorkerRegistered: boolean
  serviceWorkerError: Error | null
}

export const usePWAStatus = () => {
  const [status, setStatus] = useState<PWAStatus>({
    isInstallPromptSupported: false,
    isAppInstalled: false,
    isStandalone: false,
    platform: 'Other',
    serviceWorkerRegistered: false,
    serviceWorkerError: null
  })

  const [installPrompt, setInstallPrompt] = useState<PWAInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const checkPWAStatus = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isWindows = /Windows/.test(navigator.userAgent)
      const isMac = /Mac/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      
      const platform = isIOS ? 'iOS' : isAndroid ? 'Android' : isWindows ? 'Windows' : isMac ? 'Mac' : 'Other' as const

      setStatus(prev => ({
        ...prev,
        isStandalone,
        platform,
        isAppInstalled: isStandalone || window.navigator.userAgent.includes('wv')
      }))
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as PWAInstallPromptEvent)
      setStatus(prev => ({
        ...prev,
        isInstallPromptSupported: true
      }))
      
      const dismissedCount = parseInt(localStorage.getItem('vedatime_install_dismissed_count') || '0')
      if (dismissedCount < 3) {
        setTimeout(() => setShowInstallButton(true), 3000)
      }
    }

    const checkServiceWorkerRegistration = async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()
        setStatus(prev => ({
          ...prev,
          serviceWorkerRegistered: !!registration,
          serviceWorkerError: null
        }))
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    checkPWAStatus()
    checkServiceWorkerRegistration()

    const checkStandalone = window.matchMedia('(display-mode: standalone)')
    checkStandalone.addEventListener('change', checkPWAStatus)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      checkStandalone.removeEventListener('change', checkPWAStatus)
    }
  }, [])

  const promptInstall = async () => {
    if (!installPrompt) {
      setShowInstallButton(false)
      return false
    }

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        localStorage.setItem('vedatime_install_accepted', 'true')
        setShowInstallButton(false)
        return true
      } else if (outcome === 'dismissed') {
        const currentCount = parseInt(localStorage.getItem('vedatime_install_dismissed_count') || '0')
        localStorage.setItem('vedatime_install_dismissed_count', String(currentCount + 1))
        setShowInstallButton(false)
        
        setTimeout(() => {
          const newCount = parseInt(localStorage.getItem('vedatime_install_dismissed_count') || '0')
          if (newCount < 3) {
            setShowInstallButton(true)
          }
        }, 86400000) // 24 hours in milliseconds
      }
      
      return false
    } catch (error) {
      // Install prompt failed - user may have dismissed or not supported
      setShowInstallButton(false)
      return false
    }
  }

  const dismissInstall = () => {
    const currentCount = parseInt(localStorage.getItem('vedatime_install_dismissed_count') || '0')
    localStorage.setItem('vedatime_install_dismissed_count', String(currentCount + 1))
    setShowInstallButton(false)
  }

  return {
    ...status,
    installPrompt,
    showInstallButton,
    promptInstall,
    dismissInstall
  }
}

export const useServiceWorker = () => {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          if (import.meta.env.DEV) {
            console.log('Service Worker registered:', registration)
          }
          setRegistration(registration)

          if (registration.installing) {
            if (import.meta.env.DEV) console.log('Service worker installing')
          } else if (registration.waiting) {
            if (import.meta.env.DEV) console.log('Service worker installed')
          } else if (registration.active) {
            if (import.meta.env.DEV) console.log('Service worker active')
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Service Worker registration failed:', error)
          }
        }
      }
    }

    registerServiceWorker()

    const handleUpdateFound = () => {
      if (import.meta.env.DEV) console.log('New Service Worker update found')
    }

    const handleControllerChange = () => {
      if (import.meta.env.DEV) console.log('Service Worker controller changed')
      window.location.reload()
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('updatefound', handleUpdateFound)
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('updatefound', handleUpdateFound)
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
      }
    }
  }, [])

  const updateServiceWorker = async () => {
    try {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        return true
      }
      return false
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Service Worker update failed:', error)
      }
      return false
    }
  }

  return {
    registration,
    updateServiceWorker
  }
}

export default usePWAStatus
