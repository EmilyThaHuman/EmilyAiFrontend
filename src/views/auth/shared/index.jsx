import {
  Box,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Link as MuiLink,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacebookIcon, GitHubIcon, GoogleIcon } from 'assets/humanIcons';
import { StyledIconContainer } from 'components/styled';
import {
  RCBox,
  RCButton,
  RCSwitchControl,
  RCTypography,
} from 'components/themed';
import { authConfigs } from 'config/form-configs';
import { useUserStore } from 'contexts';
import { useDialog, useMode } from 'hooks';
const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 2000,
}));
const StyledInfoPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.borders.borderRadius.md,
  boxShadow: theme.shadows[4],
  position: 'absolute',
  right: 15, // Align to the right edge of the parent dialog
  top: 15, // Align to the top of the dialog
  width: 280,
  zIndex: 1500, // Ensure it is above the dialog
}));
const LoadingSpinner = memo(() => (
  <LoadingOverlay>
    <CircularProgress />
  </LoadingOverlay>
));
LoadingSpinner.displayName = 'LoadingSpinner';

const GuestInfoPanel = memo(() => {
  const { theme } = useMode();
  return (
    <StyledInfoPanel theme={theme}>
      <Typography variant="h6" color="textPrimary" gutterBottom>
        First Time Here?
      </Typography>
      <Typography variant="body1" color={theme.palette.text.secondary}>
        Use the guest account to explore:
      </Typography>
      <Typography
        variant="body2"
        color={theme.palette.text.secondary}
        sx={{ mt: 1 }}
      >
        Username: <strong>guestUsername</strong>
      </Typography>
      <Typography variant="body2" color={theme.palette.text.secondary}>
        Password: <strong>password123</strong>
      </Typography>
    </StyledInfoPanel>
  );
});

GuestInfoPanel.displayName = 'GuestInfoPanel';

const MemoizedLoadingSpinner = React.memo(LoadingSpinner);
const MemoizedGuestInfoPanel = React.memo(GuestInfoPanel);

export const AuthPages = () => {
  const navigate = useNavigate();
  const {
    state: { isAuthenticated, userRequest },
    actions: { handleAuthSubmit },
  } = useUserStore();
  const { theme } = useMode();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = React.useCallback(
    async values => {
      setIsLoading(true);
      try {
        await handleAuthSubmit(values);
      } catch (error) {
        console.error('Authentication error:', error);
        // Handle error (e.g., show error message)
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSubmit]
  );
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
      isSignup: false,
    },
    onSubmit: handleSubmit,
  });
  const ICON_STYLES = {
    borderRadius: `${theme.spacing(8)} !important`,
    borderColor: theme.palette.text.outline,
    color: theme.palette.text.secondary,
    '& svg': {
      color: theme.palette.text.secondary,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary?.main,
      borderRadius: `${theme.spacing(12)} !important`,
      borderColor: theme.palette.text.tertiary,
      '& svg': {
        color: theme.palette.info.contrastText,
      },
    },
  };

  const pageRef = React.createRef();
  const formRef = React.createRef();
  const searchParams = {};
  const formFieldsConfigs = React.useMemo(
    () => ({
      authConfigs: authConfigs,
    }),
    []
  );
  const renderFormFields = () => {
    return formFieldsConfigs['authConfigs'].map(field => {
      if (field.conditional && !formik.values[field.conditional]) {
        return null;
      }
      return (
        <TextField
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          value={formik.values[field.name]}
          onChange={formik.handleChange}
          fullWidth={field.fullWidth}
          margin={field.margin}
          InputLabelProps={{
            shrink: Boolean(formik.values[field.name]),
          }}
          sx={{
            backgroundColor: formik.values[field.name]
              ? 'transparent'
              : 'inherit',
            '& .MuiInputBase-input': {
              backgroundColor: formik.values[field.name]
                ? 'transparent'
                : 'inherit',
            },
          }}
        />
      );
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated');
      setIsLoading(false);
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate, setIsLoading]);

  return (
    <div style={{ position: 'relative' }}>
      {isLoading && <LoadingSpinner />}
      <GuestInfoPanel />
      <RCBox
        theme={theme}
        ref={pageRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: 3,
          mt: 5,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Card
          sx={{
            maxWidth: 600,
            width: '100%',
            borderRadius: 'lg',
            boxShadow: theme.shadows[3],
          }}
        >
          <RCBox
            theme={theme}
            ref={formRef}
            variant="outlined"
            bgColor="primary"
            borderRadius="lg"
            coloredShadow="primary"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderColor: theme.palette.primary.main,
              gap: 2,
              zIndex: 1900,
              position: 'relative',
              textAlign: 'center',
              p: 2,
              m: 1,
            }}
          >
            <RCTypography variant="h2" fontWeight="medium" color="white" mt={1}>
              {formik.values.isSignup ? 'Sign Up' : 'Login'}
            </RCTypography>
            <Grid
              container
              spacing={3}
              justifyContent="center"
              sx={{ mt: 1, mb: 2 }}
            >
              <Grid item xs={2}>
                <RCTypography
                  component={MuiLink}
                  href="#"
                  variant="body1"
                  color="white"
                >
                  <StyledIconContainer theme={theme} sx={ICON_STYLES}>
                    <FacebookIcon color="white" fontSize="inherit" />
                  </StyledIconContainer>
                </RCTypography>
              </Grid>
              <Grid item xs={2}>
                <RCTypography
                  component={MuiLink}
                  href="#"
                  variant="body1"
                  color="white"
                >
                  <StyledIconContainer theme={theme} sx={ICON_STYLES}>
                    <GitHubIcon color="white" fontSize="inherit" />
                  </StyledIconContainer>
                </RCTypography>
              </Grid>
              <Grid item xs={2}>
                <RCTypography
                  component={MuiLink}
                  href="#"
                  variant="body1"
                  color="white"
                >
                  <StyledIconContainer theme={theme} sx={ICON_STYLES}>
                    <GoogleIcon color="white" />
                  </StyledIconContainer>
                </RCTypography>
              </Grid>
            </Grid>
          </RCBox>
          <RCBox pt={4} pb={3} px={3}>
            <RCBox component="form" role="form" onSubmit={formik.handleSubmit}>
              <CardContent>
                {renderFormFields()}
                <RCSwitchControl
                  label={
                    formik.values.isSignup
                      ? 'Switch to Login'
                      : 'Switch to Signup'
                  }
                  checked={formik.values.isSignup}
                  onChange={() =>
                    formik.setFieldValue('isSignup', !formik.values.isSignup)
                  }
                  variant="dark"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flextStart' }}>
                  <Typography variant="body2" color="text.secondary">
                    Forgot your password?
                  </Typography>
                  <MuiLink
                    component="button"
                    variant="body2"
                    // onClick={handleResetPassword}
                    sx={{ ml: 1 }}
                  >
                    Reset
                  </MuiLink>
                </Box>
              </CardContent>
              {searchParams?.message && (
                <Typography
                  variant="body2"
                  color="error"
                  align="center"
                  sx={{ mt: 2, p: 1, bgcolor: 'background.paper' }}
                >
                  {searchParams.message}
                </Typography>
              )}
              <CardActions
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 2,
                  justifyContent: 'space-between',
                }}
              >
                <RCBox p={2}></RCBox>
                <RCBox p={2} justifyContent="space-around">
                  <RCButton
                    variant="outlined"
                    type="submit"
                    color="success"
                    sx={{ mx: theme.spacing(1), color: '#5CDB95' }}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? 'Processing...'
                      : formik.values.isSignup
                        ? 'Sign Up'
                        : 'Login'}
                  </RCButton>
                </RCBox>
              </CardActions>
            </RCBox>
          </RCBox>
        </Card>
      </RCBox>
    </div>
  );
};

AuthPages.displayName = 'AuthPages';

export default AuthPages;
