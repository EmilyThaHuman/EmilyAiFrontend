// App.jsx
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from 'react-router-dom';

import { CustomThemeProvider } from '@/contexts';
import { Providers } from 'contexts/Providers';
import { NotFoundPage } from 'views/error';

import { Router } from '../routes';

function ErrorFallback(props) {
  return (
    <div className={'error-page'}>
      <NotFoundPage {...props} />
      <p>{props.error.message}</p>
      <button onClick={props.resetErrorBoundary}>Try again</button>
    </div>
  );
}
// =========================================================
// [App] | This code provides the app with the router and renders it
// =========================================================

export const App = () => {
  const [someKey, setSomeKey] = React.useState(null);

  if (import.meta.hot) {
    import.meta.hot.dispose(() => Router.dispose());
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={details => {
        console.log(
          'reloading the page...',
          details.reason,
          window.location.reload()
        );
      }}
      resetKeys={[someKey]} // Reset error boundary when someKey changes
      onError={(error, errorInfo) => {
        console.log('Error caught!');
        console.error(error);
        console.error(errorInfo);
      }}
    >
      <CustomThemeProvider>
        {/* <CssBaseline /> Ensure global styles are applied */}
        <Providers>
          <RouterProvider router={Router} />
        </Providers>
      </CustomThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
