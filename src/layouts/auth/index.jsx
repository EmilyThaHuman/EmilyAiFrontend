// layouts/auth/index.js
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useUserStore } from 'contexts/UserProvider';

export const AuthLayout = () => {
  const navigate = useNavigate();
  const {
    state: { isAuthenticated, isAuthLoading },
  } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/admin/dashboard`, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthLoading) {
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Outlet />
      </motion.div>
    </Box>
  );
};

export default AuthLayout;
