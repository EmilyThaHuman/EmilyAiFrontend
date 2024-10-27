import { Box, Typography } from '@mui/material';
import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define your bluish-green color palette
const colors = {
  primary: '#00bfa5', // Teal
  secondary: '#008c7e', // Darker teal
  highlight: '#00e5ff', // Bright blue
  light: 'rgba(0, 191, 165, 0.2)', // Light teal with opacity
  medium: 'rgba(0, 140, 126, 0.5)', // Medium teal with opacity
  dark: 'rgba(0, 140, 126, 0.7)', // Darker teal with higher opacity
};

export const mulShdSpin = keyframes`
  0%, 100% {
    box-shadow:
      0em -2.6em 0em 0em ${colors.primary},
      1.8em -1.8em 0 0em ${colors.light},
      2.5em 0em 0 0em ${colors.light},
      1.75em 1.75em 0 0em ${colors.light},
      0em 2.5em 0 0em ${colors.light},
      -1.8em 1.8em 0 0em ${colors.light},
      -2.6em 0em 0 0em ${colors.medium},
      -1.8em -1.8em 0 0em ${colors.dark};
  }
  12.5% {
    box-shadow:
      0em -2.6em 0em 0em ${colors.dark},
      1.8em -1.8em 0 0em ${colors.primary},
      2.5em 0em 0 0em ${colors.light},
      1.75em 1.75em 0 0em ${colors.light},
      0em 2.5em 0 0em ${colors.light},
      -1.8em 1.8em 0 0em ${colors.light},
      -2.6em 0em 0 0em ${colors.light},
      -1.8em -1.8em 0 0em ${colors.medium};
  }
  /* ... (remaining keyframes unchanged) ... */
`;

const Loader = styled.div`
  font-size: 10px;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: ${mulShdSpin} 1.1s infinite ease;
  transform: translateZ(0);
  display: inline-block;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  background: rgba(
    255,
    255,
    255,
    0.2
  ); /* Optional: Semi-transparent background */
  /* Optional: Additional styling */
  /* border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px); */
`;

export const LoadingIndicator = () => (
  <Container>
    <Box display="flex" flexDirection="column" alignItems="center">
      {/* Optional: Uncomment to add a loading label */}
      {/* <Typography variant="body1" gutterBottom style={{ color: colors.primary }}>
        Loading...
      </Typography> */}
      <Loader />
      {/* Optional: Uncomment to add multiple loaders */}
      {/* <Loader /> */}
    </Box>
  </Container>
);

export default LoadingIndicator;
