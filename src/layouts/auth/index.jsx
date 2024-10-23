// LAYOUTS: auth/index.js
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';

import { useUserStore } from 'contexts/UserProvider';

// =========================================================
// [AuthLayout] | This code provides the auth layout for the app
// =========================================================
export const AuthLayout = () => {
  const blackestBG = '#000000';
  const {
    state: { isSettingUp, isAuthenticated, isAuthLoading },
  } = useUserStore();
  if (isSettingUp) {
    // User is authenticated but still setting up, redirect to /auth/setup
    return <Navigate to="/auth/setup" replace />;
  }

  if (!isSettingUp && isAuthenticated) {
    // User is authenticated, redirect to admin/dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

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
  return (
    <Box>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: blackestBG,
          float: 'right',
          minHeight: '100vh',
          height: '100%',
          position: 'relative',
          width: '100%',
          transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
          transitionDuration: '.2s, .2s, .35s',
          transitionProperty: 'top, bottom, width',
          transitionTimingFunction: 'linear, linear, ease',
        }}
      >
        <Box mx="auto" minHeight="100vh">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;
