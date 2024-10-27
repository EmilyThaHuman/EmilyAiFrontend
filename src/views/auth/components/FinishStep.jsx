import { Box, Typography } from '@mui/material';
import React from 'react';

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
