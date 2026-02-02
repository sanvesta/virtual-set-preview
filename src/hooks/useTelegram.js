// Telegram Mini App Hook
// Provides user data, initData, and Telegram-specific utilities

import { useMemo } from 'react';

/**
 * Hook to access Telegram Mini App data
 * Falls back to mock data in dev mode (outside Telegram)
 */
export function useTelegram() {
  const telegram = useMemo(() => {
    // Check if running in Telegram
    const webApp = window.Telegram?.WebApp;
    
    if (webApp?.initData) {
      // Real Telegram environment
      const user = webApp.initDataUnsafe?.user;
      
      return {
        isInTelegram: true,
        initData: webApp.initData, // Signed string for backend validation
        user: user ? {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name || '',
          username: user.username || '',
          languageCode: user.language_code || 'en',
          photoUrl: user.photo_url || null,
        } : null,
        colorScheme: webApp.colorScheme || 'dark',
        viewportHeight: webApp.viewportHeight,
        // Methods
        ready: () => webApp.ready(),
        expand: () => webApp.expand(),
        close: () => webApp.close(),
        showAlert: (message) => webApp.showAlert(message),
        showConfirm: (message) => webApp.showConfirm(message),
        hapticFeedback: webApp.HapticFeedback,
        mainButton: webApp.MainButton,
        backButton: webApp.BackButton,
      };
    }
    
    // Dev mode fallback
    return {
      isInTelegram: false,
      initData: 'dev_mode',
      user: {
        id: 12345678,
        firstName: 'Dev',
        lastName: 'User',
        username: 'devuser',
        languageCode: 'en',
        photoUrl: null,
      },
      colorScheme: 'dark',
      viewportHeight: window.innerHeight,
      // Mock methods
      ready: () => console.log('[Dev] Telegram ready'),
      expand: () => console.log('[Dev] Telegram expand'),
      close: () => console.log('[Dev] Telegram close'),
      showAlert: (msg) => alert(msg),
      showConfirm: (msg) => confirm(msg),
      hapticFeedback: {
        impactOccurred: (style) => console.log('[Dev] Haptic:', style),
        notificationOccurred: (type) => console.log('[Dev] Notification:', type),
        selectionChanged: () => console.log('[Dev] Selection changed'),
      },
      mainButton: null,
      backButton: null,
    };
  }, []);

  return telegram;
}

/**
 * Get display name from Telegram user
 */
export function getDisplayName(user) {
  if (!user) return 'Guest';
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.firstName || user.username || 'User';
}

export default useTelegram;
