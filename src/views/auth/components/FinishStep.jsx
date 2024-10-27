import { Box, Typography } from '@mui/material';
import React from 'react';

/**
 * Renders a welcome message component for Reed AI
 * @param {Object} props - The component props
 * @param {string} props.displayName - The name to display in the welcome message
 * @returns {JSX.Element} A Box component containing Typography elements with the welcome message
 */
export const FinishStep = ({ displayName }) => {
  return (
    <Box mb={4}>
      <Typography variant="body1">
        Welcome to Reed AI
        {displayName.length > 0 ? `, ${displayName.split(' ')[0]}` : null}!
      </Typography>
      <Typography variant="body1">Click next to start chatting.</Typography>
    </Box>
  );
};

export default FinishStep;
