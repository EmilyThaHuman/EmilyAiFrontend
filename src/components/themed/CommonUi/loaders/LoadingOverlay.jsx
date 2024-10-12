// components/LoadingSpinner.js
import { Box, CircularProgress, styled } from '@mui/material';
import React, { memo } from 'react';

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 2000,
}));

const LoadingSpinner = () => (
  <LoadingOverlay>
    <CircularProgress />
  </LoadingOverlay>
);

export default memo(LoadingSpinner);
