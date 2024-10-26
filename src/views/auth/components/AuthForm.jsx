// components/AuthForm.js
import {
  Box,
  Button,
  Alert,
  Typography,
  useTheme,
  styled,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const SocialButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  width: '48%',
  justifyContent: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const AuthForm = React.memo(
  ({
    isSignup,
    onSubmit,
    errorMessage,
    handleResetPassword,
    formFieldsConfigs,
  }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const validationSchema = Yup.object(
      formFieldsConfigs.reduce((schema, field) => {
        if (field.validation) {
          schema[field.name] = field.validation;
        }
        return schema;
      }, {})
    );

    const formik = useFormik({
      initialValues: formFieldsConfigs.reduce((values, field) => {
        values[field.name] = '';
        return {
          ...values,
          isSignup: isSignup,
        }
      }, {}),
      validationSchema,
      onSubmit: async values => {
        await onSubmit(values);
      },
    });

    const handleToggle = useCallback(() => {
      navigate(isSignup ? '/auth/sign-in' : '/auth/sign-up');
    }, [isSignup, navigate]);

    return (
      <motion.div
        initial={{ opacity: 0, y: isSignup ? -50 : 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: isSignup ? 50 : -50 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            mt: 5,
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
          }}
        >
          <Typography variant="h4" gutterBottom>
            {isSignup ? 'Sign Up' : 'Login'}
          </Typography>
          <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
            {formFieldsConfigs.map(field => (
              <Box key={field.name} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formik.values[field.name]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched[field.name] &&
                    Boolean(formik.errors[field.name])
                  }
                  helperText={
                    formik.touched[field.name] && formik.errors[field.name]
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: theme.palette.text.primary,
                    },
                  }}
                />
              </Box>
            ))}

            <StyledButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </StyledButton>

            <Button
              onClick={handleToggle}
              variant="text"
              fullWidth
              sx={{ mt: 1 }}
            >
              {isSignup
                ? 'Already have an account? Login'
                : "Don't have an account? Sign Up"}
            </Button>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
              }}
            >
              <SocialButton
                startIcon={<FaGoogle />}
                variant="outlined"
                onClick={() => alert('Google Auth')}
              >
                Google
              </SocialButton>
              <SocialButton
                startIcon={<FaFacebook />}
                variant="outlined"
                onClick={() => alert('Facebook Auth')}
              >
                Facebook
              </SocialButton>
            </Box>

            {!isSignup && (
              <Button
                onClick={handleResetPassword}
                variant="text"
                fullWidth
                sx={{ mt: 2 }}
              >
                Forgot your password?
              </Button>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
          </form>
        </Box>
      </motion.div>
    );
  }
);

AuthForm.displayName = 'AuthForm';

AuthForm.propTypes = {
  isSignup: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  handleResetPassword: PropTypes.func.isRequired,
  formFieldsConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      validation: PropTypes.object,
    })
  ).isRequired,
};

export default AuthForm;
