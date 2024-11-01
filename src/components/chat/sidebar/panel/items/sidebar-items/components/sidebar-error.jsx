import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

export const ErrorDisplay = ({ error }) => {
  return (
    <Box sx={{ p: 2, color: 'error.main', textAlign: 'center' }}>
      <Typography variant="h6">An error occurred</Typography>
      <Typography variant="body2">{error}</Typography>
    </Box>
  );
};

ErrorDisplay.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorDisplay;
