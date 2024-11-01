// components/GuestInfoPanel.js
import { Box, Typography, styled } from '@mui/material';
import React, { memo } from 'react';

import { useMode } from 'hooks';

/**
 * Creates a styled InfoPanel component using Material-UI's styled API and Box component.
 * @param {Object} theme - The theme object provided by Material-UI's ThemeProvider.
 * @returns {Component} A styled Box component with custom styling for an info panel.
 */
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

/**
 * Renders a guest information panel component.
 * This component displays information for first-time visitors,
 * including guest account credentials for exploration.
 * @returns {JSX.Element} A styled panel with typography elements
 * containing guest information and credentials.
 */
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
