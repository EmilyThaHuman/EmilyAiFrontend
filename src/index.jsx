import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import { LoadingIndicator } from 'components/themed';
import { store } from 'store'; // Assuming you have configured your store here

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import 'styles/index.css'; // Assuming you have a global.css file

// Dynamically import the App component for performance optimization
const App = lazy(() => import('app/App'));

// ========================================================
// [index] | This is the entry point for the application
// =========================================================
const reportRecoverableError = ({ error, cause, componentStack }) => {
  console.error('Recoverable Error:', error);
  console.error('Error Cause:', cause);
  console.error('Component Stack:', componentStack);

  // Optionally, send error information to a logging server
  // fetch('/log', { method: 'POST', body: JSON.stringify({ error, cause, componentStack }) });
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

// Add a Suspense fallback while the App component is loading
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      {/* <ColorModeProvider>
        <CssBaseline />
        <ToastProvider> */}
      <Suspense fallback={<LoadingIndicator />}>
        <App />
      </Suspense>
      {/* </ToastProvider>
      </ColorModeProvider> */}
    </ReduxProvider>
  </React.StrictMode>
);

// Register service worker and notify user on new updates
serviceWorkerRegistration.register({
  onUpdate: registration => {
    // Notify user about the new version
    const updateAvailable = window.confirm(
      'New content is available, would you like to refresh?'
    );
    if (updateAvailable && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  },
  onSuccess: registration => {
    console.log('Service Worker successfully registered:', registration);
  },
});

// Log service worker registration success or failure
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch(registrationError => {
        console.log('Service Worker registration failed:', registrationError);
      });
  });
}
