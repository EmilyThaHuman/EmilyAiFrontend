import { CircularProgress, Box } from '@mui/material';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useUserStore } from 'contexts/UserProvider';

const PublicRoute = ({ children }) => {
  const {
    state: { isSettingUp, isAuthenticated, isAuthLoading },
  } = useUserStore();

  if (isAuthLoading) {
    // Show a loading indicator while checking authentication
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isSettingUp) {
    // User is authenticated but still setting up, redirect to /auth/setup
    return <Navigate to="/auth/setup" replace />;
  }

  if (!isSettingUp && isAuthenticated) {
    // User is authenticated, redirect to admin/dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  // User is not authenticated, allow access to auth routes
  return children ? children : <Outlet />;
};

export default PublicRoute;
