import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Paper,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';

import { userApi } from 'api/user';
import { useChatStore } from 'contexts/ChatProvider';
import { useUserStore } from 'contexts/UserProvider';
import { useWorkspaceHandler } from 'hooks/chat';

import { Login } from './Login';
import { Signup } from './Signup';
import { APIStep } from '../components/ApiStep';
import { FinishStep } from '../components/FinishStep';
import { ProfileStep } from '../components/ProfileStep';
import { SETUP_STEP_COUNT, StepContainer } from '../components/StepContainer';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  maxWidth: 600,
  margin: 'auto',
  marginTop: theme.spacing(4),
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));

export const AuthStepper = () => {
  const {
    state: { user },
    actions: { setProfile },
  } = useUserStore();
  const {
    actions: { setApiKey },
  } = useChatStore();
  const { setupWorkspaceAndNavigate } = useWorkspaceHandler();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const isSignup = location.pathname === '/auth/sign-up';

  // Profile and API keys state
  const [profileData, setProfileData] = useState({
    avatarUrl: user.profile.avatarPath || '',
    displayName: user.profile.displayName || '',
    username: user.profile.username || '',
    openaiApiKey: user.profile?.openaiApiKey || '',
    openaiOrgId: user.profile?.openaiOrgId || '',
    anthropicApiKey: '',
    googleGeminiApiKey: '',
    mistralApiKey: '',
    groqApiKey: '',
    perplexityApiKey: '',
    openrouterApiKey: '',
  });
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  /* Api Setup */
  const steps = ['Profile', 'API Setup', 'Finish'];

  const handleNext = useCallback(() => {
    setActiveStep(prevStep =>
      prevStep < steps.length - 1 ? prevStep + 1 : prevStep
    );
  }, [steps.length]);

  const handleBack = useCallback(() => {
    setActiveStep(prevStep => (prevStep > 0 ? prevStep - 1 : prevStep));
  }, []);

  const handleSaveSetupSetting = useCallback(async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      console.log('userId', userId);
      console.log('profileData', profileData);

      const updatedProfile = await userApi.updateProfile(userId, profileData);
      setProfile(updatedProfile);
      setApiKey(updatedProfile.openai.apiKey);
      await setupWorkspaceAndNavigate(userId);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }, [profileData, setProfile, setApiKey, setupWorkspaceAndNavigate]);

  const handleShouldProceed = useCallback(
    proceed => {
      if (proceed) {
        console.log(`Proceeding to step ${activeStep + 1}`);
        if (activeStep === steps.length - 1) {
          console.log('Saving setup settings');
          handleSaveSetupSetting(); // Call the save settings function at the last step
        } else {
          handleNext();
        }
      } else {
        handleBack();
      }
    },
    [activeStep, steps.length, handleSaveSetupSetting, handleNext, handleBack]
  );

  const renderStepContent = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <ProfileStep
            {...profileData}
            setProfileData={setProfileData}
            usernameAvailable={usernameAvailable}
            setUsernameAvailable={setUsernameAvailable}
          />
        );
      case 1:
        return (
          <APIStep profileData={profileData} setProfileData={setProfileData} />
        );
      case 2:
        return (
          <FinishStep
            displayName={profileData.displayName}
            username={profileData.username}
          />
        );
      default:
        return <Typography variant="body1">Unknown step</Typography>;
    }
  }, [activeStep, profileData, usernameAvailable]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      {window.location.pathname === '/auth/setup' ? (
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Setup
            </Typography>
            <StepContainer
              stepNum={activeStep + 1} // Updated to be 1-based
              stepTitle={steps[activeStep]}
              onShouldProceed={handleShouldProceed}
            >
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box mt={3}>{renderStepContent}</Box>
              <Box mt={2} display="flex" justifyContent="space-between">
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleShouldProceed(true)}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </StepContainer>
          </Box>
        </Container>
      ) : isSignup ? (
        <StyledPaper>
          <Signup />
        </StyledPaper>
      ) : (
        <StyledPaper>
          <Login />
        </StyledPaper>
      )}
    </>
  );
};
export default AuthStepper;
