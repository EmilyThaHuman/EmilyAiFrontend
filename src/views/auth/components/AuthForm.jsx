// components/AuthForm.js
import {
  Box,
  Button,
  Alert,
  Typography,
  TextField,
  useTheme,
  styled,
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import {
  RCButton,
  RCTextField,
  StyledButton,
  TextFieldSection,
} from 'components/index';

const SocialButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  width: '100%',
  justifyContent: 'flex-start',
  paddingLeft: theme.spacing(2),
}));

export const AuthForm = ({
  isSignup,
  onSubmit,
  errorMessage,
  handleResetPassword,
  formFieldsConfigs,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
      isSignup,
    },
    onSubmit: async values => {
      await onSubmit(values);
    },
  });
  const handleToggle = () => {
    navigate(isSignup ? '/auth/sign-in' : '/auth/sign-up');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        mt: 5,
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        flexGrow: 1,
        transition: 'transform 0.5s ease-in-out',
        transform: 'scale(1)',
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        {formFieldsConfigs
          .filter(field => isSignup || field.name !== 'email')
          .map(field => (
            <TextFieldSection
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              fullWidth={field.fullWidth}
              margin={field.margin || 'normal'}
              InputLabelProps={{
                shrink: Boolean(formik.values[field.name]),
              }}
              variant="outlined"
              sx={{
                transition: 'background-color 0.3s ease-in-out',
                mx: 'auto',
                color: '#fff',
                '& .MuiInputBase-input': {
                  color: '#fff',
                  transition: 'color 0.3s ease-in-out',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#fff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                },
              }}
            />
          ))}

        <StyledButton type="submit" variant="outlined" fullWidth sx={{ mt: 2 }}>
          {formik.values.isSignup ? 'Sign Up' : 'Login'}
        </StyledButton>

        <StyledButton onClick={handleToggle} variant="outlined" fullWidth>
          {formik.values.isSignup
            ? 'Already have an account? Login'
            : 'Sign up for full access'}
        </StyledButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <StyledButton
            startIcon={<FaGoogle />}
            variant="outlined"
            fullwidth
            sx={{
              mx: 'auto',
            }}
          >
            Google
          </StyledButton>
          <StyledButton
            startIcon={<FaFacebook />}
            variant="outlined"
            fullwidth
            sx={{
              mx: 'auto',
            }}
          >
            Facebook
          </StyledButton>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Typography variant="body2">Forgot your password?</Typography>
          <StyledButton
            type="button"
            onClick={handleResetPassword}
            color="primary"
            sx={{ ml: 1 }}
          >
            Reset
          </StyledButton>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </form>
    </Box>
  );
};

AuthForm.propTypes = {
  isSignup: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  handleResetPassword: PropTypes.func.isRequired,
  formFieldsConfigs: PropTypes.array.isRequired,
};

export default AuthForm;
