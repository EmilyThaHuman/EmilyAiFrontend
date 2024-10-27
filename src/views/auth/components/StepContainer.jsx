// components/StepContainer.js
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import React, { useRef } from 'react';

export const SETUP_STEP_COUNT = 3;

/**
 * Renders a container for a setup step with a title, description, and content.
 * @param {Object} props - The component props
 * @param {string} props.stepDescription - The description of the current step
 * @param {number} props.stepNum - The current step number
 * @param {string} props.stepTitle - The title of the current step
 * @param {function} props.onShouldProceed - Callback function to determine if the step should proceed
 * @param {React.ReactNode} props.children - The content to be rendered inside the container
 * @returns {JSX.Element} A Card component containing the step information and content
 */
export const StepContainer = ({
  stepDescription,
  stepNum,
  stepTitle,
  onShouldProceed,
  children,
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
