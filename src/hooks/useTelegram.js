// Telegram Mini App Hook
// Provides user data and initData for secure backend validation

import { useMemo } from 'react'

/**
 * Hook to access Telegram Mini App data
 * Returns user info and initData for n8n validation
 */
export function useTelegram() {
  const webApp = window.Telegram?.WebApp
  const isTelegram = !!webApp?.initData

  const user = useMemo(() => {
    if (!isTelegram) {
      // Dev mode fallback
      return {
        id: 'dev_user',
        first_name: 'Dev',
        last_name: 'User',
        username: 'devuser',
      }
    }
    return webApp.initDataUnsafe?.user || null
  }, [isTelegram, webApp])

  const initData = useMemo(() => {
    if (!isTelegram) return null
    return webApp.initData
  }, [isTelegram, webApp])

  // Telegram UI helpers
  const expand = () => webApp?.expand()
  const close = () => webApp?.close()
  const showAlert = (message) => webApp?.showAlert(message)
  const showConfirm = (message, callback) => webApp?.showConfirm(message, callback)
  
  // Haptic feedback
  const haptic = {
    impact: (style = 'medium') => webApp?.HapticFeedback?.impactOccurred(style),
    notify: (type = 'success') => webApp?.HapticFeedback?.notificationOccurred(type),
    select: () => webApp?.HapticFeedback?.selectionChanged(),
  }

  // Main button control
  const mainButton = {
    show: (text, callback) => {
      if (!webApp?.MainButton) return
      webApp.MainButton.text = text
      webApp.MainButton.onClick(callback)
      webApp.MainButton.show()
    },
    hide: () => webApp?.MainButton?.hide(),
    showProgress: () => webApp?.MainButton?.showProgress(),
    hideProgress: () => webApp?.MainButton?.hideProgress(),
  }

  // Theme
  const theme = useMemo(() => ({
    colorScheme: webApp?.colorScheme || 'dark',
    bgColor: webApp?.backgroundColor || '#1a1a1a',
    textColor: webApp?.themeParams?.text_color || '#ffffff',
    buttonColor: webApp?.themeParams?.button_color || '#8b5cf6',
    buttonTextColor: webApp?.themeParams?.button_text_color || '#ffffff',
  }), [webApp])

  return {
    isTelegram,
    user,
    initData,
    webApp,
    theme,
    expand,
    close,
    showAlert,
    showConfirm,
    haptic,
    mainButton,
  }
}

export default useTelegram
