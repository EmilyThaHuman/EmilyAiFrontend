import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Button,
  Box,
} from '@mui/material';
import React, { useRef } from 'react';

export const SETUP_STEP_COUNT = 3;

export const StepContainer = ({
  stepDescription,
  stepNum,
  stepTitle,
  onShouldProceed,
  children,
  showBackButton = false,
  showNextButton = true,
}) => {
  const buttonRef = useRef(null);

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  return (
    <Card
      sx={{
        maxHeight: 'calc(100vh - 60px)',
        width: 600,
        overflow: 'auto',
        backgroundColor: 'black',
        color: 'white',
        p: 4,
        borderRadius: 2,
        maxWidth: 500,
        mx: 'auto',
        border: '1px solid white',
      }}
      onKeyDown={handleKeyDown}
    >
      <CardHeader
        title={
          <Box display="flex" justifyContent="space-between" color="#fff">
            <Typography variant="h6" color="#fff">
              {stepTitle}
            </Typography>
            <Typography variant="body2" color="#fff">
              {stepNum} / {SETUP_STEP_COUNT}
            </Typography>
          </Box>
        }
        subheader={stepDescription}
      />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default StepContainer;
