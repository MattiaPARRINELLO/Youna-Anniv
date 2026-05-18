import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MusicProvider } from './context/MusicContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((e) => console.warn('SW registration:', e));
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
