// components/Signup.js
import { Box, CircularProgress } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom'; // Added useNavigate

import { userApi } from 'api/user';
import { authConfigs } from 'config/form-configs';
import { useUserStore } from 'contexts/UserProvider';

import { AuthForm } from '../../src/views/auth/components/AuthForm';

export const Signup = props => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    actions: { handleAuthSubmit },
  } = useUserStore();

  const navigate = useNavigate(); // Use navigate

  const handleSignUp = useCallback(
    async values => {
      setLoading(true);
      try {
        await handleAuthSubmit(values);
        navigate('/auth/setup'); // Navigate to '/auth/setup' on successful signup
      } catch (error) {
        setErrorMessage(
          `Sign Up failed: ${error.response?.data?.message || 'Unknown error'}`
        );
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSubmit, navigate] // Added navigate to dependencies
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
    <AuthForm
      isSignup={true}
      onSubmit={handleSignUp}
      errorMessage={errorMessage}
      handleResetPassword={handleResetPassword}
      formFieldsConfigs={authConfigs}
    />
  );
};

export default Signup;
