import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW, initInstallPrompt } from './pwa'
import { LocalizationProvider } from './hooks/useLocalization'

// Initialize PWA functionality
registerSW();
initInstallPrompt();

createRoot(document.getElementById("root")!).render(
  <LocalizationProvider>
    <App />
  </LocalizationProvider>
);
