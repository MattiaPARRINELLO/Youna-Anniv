import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MusicProvider } from './context/MusicContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MusicProvider>
      <App />
    </MusicProvider>
  </React.StrictMode>
);
