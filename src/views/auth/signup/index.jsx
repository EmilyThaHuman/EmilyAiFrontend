// components/Signup.js
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom'; // Added useNavigate

import { userApi } from 'api/user';
import { authConfigs } from 'config/form-configs';
import { useUserStore } from 'contexts/UserProvider';

import { AuthForm } from '../components/AuthForm';

export const Signup = props => {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    state: { isAuthenticated, isAuthLoading },
    actions: { handleAuthSubmit, setIsSettingUp },
  } = useUserStore();

  const navigate = useNavigate();

  const handleSignUp = useCallback(
    async values => {
      try {
        await handleAuthSubmit(values);
        setIsSettingUp(true);
        navigate('/auth/setup');
      } catch (error) {
        setErrorMessage(`Sign Up failed: ${error.message || 'Unknown error'}`);
      }
    },
    [handleAuthSubmit, navigate, setIsSettingUp]
  );

  const handleResetPassword = async email => {
    try {
      await userApi.resetPassword({ email });
      redirect('/login?message=Check your email to reset password');
    } catch (error) {
      setErrorMessage(
        `Password reset failed: ${error.response?.data?.message || 'Unknown error'}`
      );
    }
  };

  if (isAuthLoading) {
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
    <AuthForm
      isSignup={true}
      errorMessage={errorMessage}
      formFieldsConfigs={authConfigs}
      onSubmit={handleSignUp}
      handleResetPassword={handleResetPassword}
    />
  );
};

export default Signup;
