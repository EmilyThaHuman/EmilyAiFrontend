import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import App from 'app/App';
import { store } from 'store'; // Assuming you have configured your store here
import { ColorModeProvider, ToastProvider } from './contexts';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'styles/index.css'; // Assuming you have a global.css file

// ========================================================
// [index] | This is the entry point for the application
// =========================================================
const reportRecoverableError = ({ error, cause, componentStack }) => {
  console.error('Recoverable Error:', error);
  console.error('Error Cause:', cause);
  console.error('Component Stack:', componentStack);
};

const container = document.getElementById('root');
const root = createRoot(container, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack,
    });
  },
});

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ColorModeProvider>
        <CssBaseline />
        <ToastProvider>
          <App />
        </ToastProvider>
      </ColorModeProvider>
    </ReduxProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
