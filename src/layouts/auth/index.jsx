// LAYOUTS: auth/index.js
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

import { useUserStore } from 'contexts/UserProvider';

// =========================================================
// [AuthLayout] | This code provides the auth layout for the app
// =========================================================
export const AuthLayout = () => {
  const blackestBG = '#000000';
  const navigate = useNavigate();

  const {
    state: {
      isSigningUp,
      isSignedUp,
      isSettingUp,
      isSetup,
      isAuthenticated,
      isAuthLoading,
      redirects,
    },
  } = useUserStore();

  useEffect(() => {
    // Redirect logic based on authentication and setup status
    if (isSignedUp && isSettingUp && !isSetup) {
      // User is authenticated but still setting up, redirect to /auth/setup
      navigate('/auth/setup', { replace: true });
    } else if (isSignedUp && isSetup) {
      navigate('/admin/dashboard', { replace: true });
    } else if (!isSettingUp && isAuthenticated) {
      // User is authenticated, redirect to admin/dashboard
      navigate('/admin/workspaces', { replace: true });
    }
  }, [isSettingUp, isAuthenticated, redirects, navigate, isSignedUp, isSetup]);

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
