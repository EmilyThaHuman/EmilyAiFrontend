import { useEffect, useState } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import ErrorPage from 'views/error/NotFound';

export function RootBoundary() {
  const error = useRouteError();
  const [errorInfo, setErrorInfo] = useState(null);

  if (isRouteErrorResponse(error)) {
    const {
      status,
      errorStatus,
      statusText,
      data,
      stack,
      path,
      name,
      message,
      componentStack,
      cause,
    } = error;
    setErrorInfo({
      status,
      errorStatus,
      statusText,
      data,
      stack,
      path,
      name,
      message,
      componentStack,
      cause,
    });
    console.log(errorInfo);
    if (!error.status) {
      console.log('No status');
    }
    if (error.status === 500) {
      console.log('418');
    }
    if (error.status === 404) {
      console.log('404');
    }

    if (error.status === 401) {
      console.log('401');
    }

    if (error.status === 503) {
      console.log('503');
    }

    if (error.status === 418) {
      console.log('418');
    }
  }

  return <ErrorPage error={error} errorInfo={errorInfo} />;
}

export default RootBoundary;
