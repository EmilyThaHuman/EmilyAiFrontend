// components/Login.js
import { Box, CircularProgress } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';

import { userApi } from 'api/user';
import { authConfigs } from 'config/form-configs';
import { useChatStore } from 'contexts/ChatProvider';
import { useUserStore } from 'contexts/UserProvider';
import { useWorkspaceHandler } from 'hooks/chat';

import { AuthForm } from '../components/AuthForm';

export const Login = props => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    state: { isAuthenticated },
    actions: { handleAuthSubmit },
  } = useUserStore();
  const {
    state: { workspaces },
  } = useChatStore();
  const list = JSON.parse(sessionStorage.getItem('dataPopulationChecklist'));
  const workspaceId = sessionStorage.getItem('workspaceId');
  const { setupWorkspaceAndNavigate } = useWorkspaceHandler();

  const handleSignIn = useCallback(
    async values => {
      setLoading(true);
      try {
        await handleAuthSubmit(values);
      } catch (error) {
        setErrorMessage(
          `Login failed: ${error.response?.data?.message || 'Unknown error'}`
        );
      } finally {
        setLoading(false);
      }
    },
    [handleAuthSubmit]
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

  useEffect(() => {
    const triggerWorkspaceTransition = async () => {
      const userId = sessionStorage.getItem('userId');

      return await setupWorkspaceAndNavigate(userId);
    };
    if (isAuthenticated && !workspaces) {
      triggerWorkspaceTransition();
    }
  }, [
    isAuthenticated,
    list,
    setupWorkspaceAndNavigate,
    workspaceId,
    workspaces,
  ]);

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
      isSignup={false}
      onSubmit={handleSignIn}
      errorMessage={errorMessage}
      handleResetPassword={handleResetPassword}
      formFieldsConfigs={authConfigs}
    />
  );
};

export default Login;
