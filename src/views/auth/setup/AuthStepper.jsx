// src/components/AuthStepper.jsx

import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const StepsContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  margin: '0 auto',
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const AuthStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSignup, setIsSignup] = useState(false);

  const steps = ['Login', 'Signup'];

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
    setIsSignup((prev) => !prev);
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
    setIsSignup((prev) => !prev);
  };

  return (
    <StepsContainer>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box mt={3}>
        {activeStep === 0 ? (
          <LoginForm onSwitch={handleNext} />
        ) : (
          <SignupForm onSwitch={handleBack} />
        )}
      </Box>
    </StepsContainer>
  );
};

export default AuthStepper;
