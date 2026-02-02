import React from 'react';
import ReactDOM from 'react-dom/client';
import { SDKProvider } from '@telegram-apps/sdk-react';
import App from './App.jsx';
import './index.css';

// Error boundary for Telegram SDK issues
function TelegramErrorBoundary({ children }) {
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Check if we're in Telegram
    const isTelegram = window.Telegram?.WebApp?.initData;
    if (!isTelegram && import.meta.env.PROD) {
      setError('Please open this app from Telegram');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center max-w-md">
          <div className="text-4xl mb-4">📱</div>
          <h1 className="text-xl font-semibold text-gray-100 mb-2">Telegram Required</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return children;
}

// Check if running in Telegram
const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp?.initData;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isTelegram ? (
      <SDKProvider acceptCustomStyles>
        <TelegramErrorBoundary>
          <App />
        </TelegramErrorBoundary>
      </SDKProvider>
    ) : (
      // Dev mode - run without Telegram
      <App />
    )}
  </React.StrictMode>,
);
