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
    actions: { setProfile, setIsSetup, setIsSettingUp, setIsAuthLoading },
  } = useUserStore();
  const {
    actions: { setApiKey },
  } = useChatStore();
  const { setupWorkspaceAndNavigate } = useWorkspaceHandler();
  const [activeStep, setActiveStep] = useState(0);

  // Memoize initial profile data
  const initialProfileData = useMemo(
    () => ({
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
    }),
    [user.profile]
  );

  const [profileData, setProfileData] = useState(initialProfileData);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const userId = sessionStorage.getItem('userId');

  const handleSaveSetupSetting = useCallback(async () => {
    setIsAuthLoading(true);
    try {
      const updatedProfile = await userApi.updateProfile(userId, profileData);
      setProfile(updatedProfile);
      setApiKey(updatedProfile.openai.apiKey);
      setIsSettingUp(false);
      setIsSetup(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Add user feedback for error
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  }, [profileData, setProfile, setApiKey, setIsSetup, setIsSettingUp, userId]);

  const steps = ['Profile', 'API Setup', 'Finish'];

  const handleNext = useCallback(async () => {
    if (activeStep === steps.length - 1) {
      await handleSaveSetupSetting();
      await setupWorkspaceAndNavigate(userId);
    } else {
      setActiveStep(prev => prev + 1);
    }
  }, [activeStep, handleSaveSetupSetting, setupWorkspaceAndNavigate, userId]);

  const handleBack = useCallback(() => {
    setActiveStep(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const renderStepContent = useCallback(() => {
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
  }, [activeStep, profileData]);

  return (
    <>
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <StyledPaper>
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
        </StyledPaper>
      </Container>
    </>
  );
};

export default AuthStepper;
