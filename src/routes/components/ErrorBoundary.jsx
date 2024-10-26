// components/ErrorBoundary.jsx
import React from 'react';
import { useRouteError } from 'react-router-dom';

import Loadable from '@/routes/utils/Loadable';
import { NotFoundPage } from 'views/error';

const RootErrorBoundaryComponent = Loadable(
  React.lazy(() => import('utils/app/RouterErrorBoundary.jsx'))
);

export const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <RootErrorBoundaryComponent>
      <NotFoundPage error={error} />
    </RootErrorBoundaryComponent>
  );
};

export default ErrorBoundary;
