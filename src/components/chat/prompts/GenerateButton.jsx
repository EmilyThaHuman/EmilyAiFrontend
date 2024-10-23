// GenerateButton.jsx
import { Button, Box, Typography, useTheme } from '@mui/material';
import { Wand } from 'lucide-react';
import React, { useState } from 'react';

export const GenerateButton = ({
  onClick,
  text = 'Generate',
  isLoading = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        transition: 'width 0.3s ease-in-out',
        width: isHovered ? 'auto' : '50px',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        startIcon={<Wand />}
        sx={{
          padding: theme.spacing(1),
          minWidth: isHovered ? '100px' : '50px',
          justifyContent: 'center',
          transition: 'min-width 0.3s ease-in-out',
        }}
      >
        {isHovered && (
          <Typography variant="button" sx={{ marginLeft: theme.spacing(1) }}>
            {isLoading ? 'Generating...' : text}
          </Typography>
        )}
      </Button>
    </Box>
  );
};

export default GenerateButton;
