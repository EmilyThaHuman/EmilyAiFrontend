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
import { motion } from 'framer-motion';
import React, { useCallback, useMemo, useState } from 'react';

import { userApi } from 'api/user';
import { useChatStore } from 'contexts/ChatProvider';
import { useUserStore } from 'contexts/UserProvider';
import { useWorkspaceHandler } from 'hooks/chat';

import { APIStep } from '../components/ApiStep';
import { FinishStep } from '../components/FinishStep';
import { ProfileStep } from '../components/ProfileStep';
import { StepContainer } from '../components/StepContainer';

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
    actions: { setProfile, setIsSetup },
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

  const handleSaveSetupSetting = useCallback(async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      console.log('userId', userId);
      console.log('profileData', profileData);

      const updatedProfile = await userApi.updateProfile(userId, profileData);
      setProfile(updatedProfile);
      setApiKey(updatedProfile.openai.apiKey);
      setIsSetup(true);
      await setupWorkspaceAndNavigate(userId);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }, [
    profileData,
    setProfile,
    setApiKey,
    setIsSetup,
    setupWorkspaceAndNavigate,
  ]);

  const steps = ['Profile', 'API Setup', 'Finish'];

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Save settings
      await setProfile(profileData);
      setIsSetup(true);
      await setupWorkspaceAndNavigate();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => (prev > 0 ? prev - 1 : prev));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ProfileStep
            profileData={profileData}
            setProfileData={setProfileData}
          />
        );
      case 1:
        return (
          <APIStep profileData={profileData} setProfileData={setProfileData} />
        );
      case 2:
        return <FinishStep profileData={profileData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Paper variant="outlined" sx={{ my: { xs: 3 }, p: { xs: 2 } }}>
          <Typography component="h1" variant="h4" align="center">
            Setup
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <motion.div
            key={activeStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ width: '100%' }}
          >
            <StepContainer
              stepDescription=""
              stepNum={activeStep + 1}
              stepTitle={steps[activeStep]}
              onShouldProceed={handleNext}
            >
              {renderStepContent()}
              <Box mt={2} display="flex" justifyContent="space-between">
                {activeStep !== 0 && (
                  <Button variant="contained" onClick={handleBack}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ ml: 'auto' }}
                >
                  {activeStep === steps.length - 1 ? 'Save & Finish' : 'Next'}
                </Button>
              </Box>
            </StepContainer>
          </motion.div>
        </Paper>
      </Container>
    </>
  );
};

export default AuthStepper;
