import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MusicProvider } from './context/MusicContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(async (reg) => {
      try {
        const existingSub = await reg.pushManager.getSubscription();
        if (existingSub) return;
        const res = await fetch('https://tab.mprnl.fr/api/push/public-key');
        const { publicKey } = await res.json();
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: Uint8Array.from(atob(publicKey), c => c.charCodeAt(0)),
        });
        await fetch('https://tab.mprnl.fr/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub.toJSON()),
        });
      } catch (e) {
        console.warn('Push subscription:', e);
      }
    }).catch((e) => console.warn('SW registration:', e));
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MusicProvider>
        <App />
      </MusicProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
