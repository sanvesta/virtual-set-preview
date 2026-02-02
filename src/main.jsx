import React from 'react'
import ReactDOM from 'react-dom/client'
import { SDKProvider } from '@telegram-apps/sdk-react'
import App from './App.jsx'
import './index.css'

// Telegram Mini App wrapper with fallback for development
function Root() {
  // Check if running inside Telegram
  const isTelegram = window.Telegram?.WebApp?.initData !== ''

  if (isTelegram) {
    return (
      <SDKProvider acceptCustomStyles>
        <App />
      </SDKProvider>
    )
  }

  // Dev mode fallback
  return (
    <div>
      <div className="bg-yellow-500/20 text-yellow-300 text-sm px-4 py-2 text-center">
        ⚠️ Dev Mode — Not running in Telegram
      </div>
      <App />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
