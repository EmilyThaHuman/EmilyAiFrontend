import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import { LoadingIndicator } from 'components/themed';
import { store } from 'store'; // Assuming you have configured your store here

import 'styles/index.css';

const App = lazy(() => import('app/App'));

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
    console.error('Error:', error);
    if (errorInfo?.componentStack) {
      console.error('Component Stack:', errorInfo.componentStack);
    }
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
      <Suspense fallback={<LoadingIndicator />}>
        <App />
      </Suspense>
    </ReduxProvider>
  </React.StrictMode>
);
