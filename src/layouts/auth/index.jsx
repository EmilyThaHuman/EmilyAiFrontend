// LAYOUTS: auth/index.js
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';

// =========================================================
// [AuthLayout] | This code provides the auth layout for the app
// =========================================================
export const AuthLayout = () => {
  const blackestBG = '#000000';
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
