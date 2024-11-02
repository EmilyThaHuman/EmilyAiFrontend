// components/GuestInfoPanel.js
import { Box, Typography, styled } from '@mui/material';
import React, { memo } from 'react';

import { useMode } from '@/hooks';

export const StyledInfoPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.borders.borderRadius.md,
  boxShadow: theme.shadows[4],
  position: 'absolute',
  right: 15,
  top: 15,
  width: 280,
  zIndex: 1500,
}));

export const GuestInfoPanel = () => {
  const { theme } = useMode();
  return (
    <StyledInfoPanel theme={theme}>
      <Typography variant="h6" color="textPrimary" gutterBottom>
        First Time Here?
      </Typography>
      <Typography variant="body1" color={theme.palette.text.secondary}>
        Use the guest account to explore:
      </Typography>
      <Typography
        variant="body2"
        color={theme.palette.text.secondary}
        sx={{ mt: 1 }}
      >
        Username: <strong>guestUsername</strong>
      </Typography>
      <Typography variant="body2" color={theme.palette.text.secondary}>
        Password: <strong>password123</strong>
      </Typography>
    </StyledInfoPanel>
  );
};

export default memo(GuestInfoPanel);
