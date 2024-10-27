import { Box, Typography, Button } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { OpenAISVG } from 'assets/humanIcons';
import { useMode } from 'hooks/app';

export const HomePage = () => {
  const navigate = useNavigate();
  const { theme } = useMode();

  return (
    <Box
      display="flex"
      height="100vh"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box>
        <OpenAISVG theme={theme === 'dark' ? 'dark' : 'light'} scale={0.3} />
      </Box>

      <Typography variant="h4" fontWeight="bold" marginTop={2}>
        ReedAi LLM
      </Typography>

      {/* <NavLink href="/login" passHref> */}
      <NavLink to="/auth/sign-in">
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            mt: 2,
            width: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Start Chatting
          <ArrowRight style={{ marginLeft: '8px' }} size={20} />
        </Button>
      </NavLink>
    </Box>
  );
};

export default HomePage;
// import {
//   Alert,
//   Box,
//   Button,
//   CircularProgress,
//   Stepper,
//   Step,
//   StepLabel,
//   TextField,
//   Typography,
// } from '@mui/material';
// import axios from 'axios';
// import { useFormik } from 'formik';
// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';

// import { userApi } from 'api/user';
// import { authConfigs } from 'config/form-configs';
// import { useUserStore } from 'contexts/UserProvider';
// import { useMode } from 'hooks/app';
// import { Brand } from 'layouts/navigation';

// import APIStep from './APIStep'; // Assuming you have APIStep component
// import FinishStep from './FinishStep'; // Assuming you have FinishStep component
// import ProfileStep from './ProfileStep';

// export const metadata = {
//   title: 'Login',
// };

// export const Login = ({ searchParams = {} }) => {
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeStep, setActiveStep] = useState(0);
//   const [isSignup, setIsSignup] = useState(false);
//   const navigate = useNavigate();

//   const {
//     state: { profile, authSession, isAuthenticated },
//     actions: { handleAuthSubmit, setProfile, setAuthSession },
//   } = useUserStore();

//   const { theme } = useMode();

//   const steps = ['Profile Information', 'API Configuration', 'Finish'];

//   const formik = useFormik({
//     initialValues: {
//       username: '',
//       password: '',
//       email: '',
//       isSignup: false,
//       displayName: '',
//       // Add other fields required for API Configuration
//       useAzureOpenai: false,
//       openaiAPIKey: '',
//       // ... other API fields
//     },
//     onSubmit: async values => {
//       setIsLoading(true);
//       setErrorMessage('');

//       try {
//         if (isSignup) {
//           if (activeStep === steps.length - 1) {
//             await handleSignUp(values);
//           } else {
//             setActiveStep(prev => prev + 1);
//           }
//         } else {
//           await handleSignIn(values);
//         }
//       } catch (error) {
//         console.error('Authentication failed:', error);
//         setErrorMessage(
//           `Operation failed: ${error.response?.data?.message || 'Unknown error'}`
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     },
//   });

//   // Function to handle sign-in
//   const handleSignIn = async values => {
//     try {
//       await handleAuthSubmit(values);
//       if (authSession) {
//         navigate(`/${authSession.workspaceId}/chat`);
//       }
//     } catch (error) {
//       setErrorMessage(
//         `Login failed: ${error.response?.data?.message || 'Unknown error'}`
//       );
//     }
//   };

//   // Function to handle sign-up
//   const handleSignUp = async values => {
//     try {
//       await handleAuthSubmit(values);
//       if (authSession) {
//         navigate('/setup');
//       }
//     } catch (error) {
//       setErrorMessage(
//         `Sign Up failed: ${error.response?.data?.message || 'Unknown error'}`
//       );
//     }
//   };

//   // Check session on component mount
//   useEffect(() => {
//     const handleSessionRetrieval = async () => {
//       setIsLoading(true);
//       setErrorMessage('');

//       try {
//         const sessionResponse = await userApi.getSession();
//         console.log('Current session:', sessionResponse.data);
//       } catch (error) {
//         console.error('Failed to retrieve session:', error);
//         setErrorMessage('Session retrieval failed. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (isAuthenticated === 'true') {
//       handleSessionRetrieval();
//     }
//   }, [isAuthenticated]);

//   // Toggle between Login and Signup
//   const toggleSignup = () => {
//     setIsSignup(prev => !prev);
//     setActiveStep(0);
//     formik.resetForm();
//     setErrorMessage('');
//   };

//   // Render step content
//   const renderStepContent = step => {
//     switch (step) {
//       case 0:
//         return (
//           <ProfileStep
//             username={formik.values.username}
//             setUsername={value => formik.setFieldValue('username', value)}
//             usernameAvailable={formik.values.usernameAvailable}
//             setUsernameAvailable={available =>
//               formik.setFieldValue('usernameAvailable', available)
//             }
//             displayName={formik.values.displayName}
//             setDisplayName={value => formik.setFieldValue('displayName', value)}
//           />
//         );
//       case 1:
//         return (
//           <APIStep
//             values={formik.values}
//             setFieldValue={formik.setFieldValue}
//           />
//         );
//       case 2:
//         return <FinishStep values={formik.values} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       justifyContent="center"
//       width="100%"
//       maxWidth={600}
//       mx="auto"
//       px={3}
//       py={5}
//     >
//       <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
//         <Brand />

//         {isSignup && (
//           <Stepper
//             activeStep={activeStep}
//             alternativeLabel
//             sx={{ mt: 3, mb: 5 }}
//           >
//             {steps.map(label => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//         )}

//         {isSignup ? (
//           renderStepContent(activeStep)
//         ) : (
//           <>
//             {/* Login Fields */}
//             <Box mb={3}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 margin="normal"
//                 required
//               />
//             </Box>
//             <Box mb={3}>
//               <TextField
//                 fullWidth
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 margin="normal"
//                 required
//               />
//             </Box>
//           </>
//         )}

//         {/* Submit Button */}
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           disabled={isLoading}
//           sx={{ mt: 2 }}
//         >
//           {isLoading ? (
//             <CircularProgress size={24} color="inherit" />
//           ) : isSignup ? (
//             activeStep === steps.length - 1 ? (
//               'Finish Signup'
//             ) : (
//               'Next'
//             )
//           ) : (
//             'Login'
//           )}
//         </Button>

//         {/* Toggle between Login and Signup */}
//         <Button onClick={toggleSignup} variant="text" fullWidth sx={{ mt: 2 }}>
//           {isSignup
//             ? 'Already have an account? Login'
//             : "Don't have an account? Sign Up"}
//         </Button>

//         {/* Reset Password */}
//         {!isSignup && (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             mt={2}
//           >
//             <Typography variant="body2">Forgot your password?</Typography>
//             <Button
//               type="button"
//               onClick={() => navigate('/reset-password')}
//               color="primary"
//               sx={{ ml: 1 }}
//             >
//               Reset
//             </Button>
//           </Box>
//         )}

//         {/* Messages */}
//         {searchParams?.message && (
//           <Alert severity="info" sx={{ mt: 2 }}>
//             {searchParams.message}
//           </Alert>
//         )}

//         {errorMessage && (
//           <Alert severity="error" sx={{ mt: 2 }}>
//             {errorMessage}
//           </Alert>
//         )}
//       </form>
//     </Box>
//   );
// };

// export default Login;

// // import Alert from '@mui/material/Alert';
// // import Box from '@mui/material/Box';
// // import Button from '@mui/material/Button';
// // import TextField from '@mui/material/TextField';
// // import Typography from '@mui/material/Typography';
// // import axios from 'axios';
// // import { useFormik } from 'formik';
// // import React, { useState, useEffect } from 'react';
// // import { redirect, useNavigate } from 'react-router-dom';

// // import { userApi } from 'api/user';
// // import { authConfigs } from 'config/form-configs';
// // import { useUserStore } from 'contexts/UserProvider';
// // import { useMode } from 'hooks/app';
// // import { Brand } from 'layouts/navigation';

// // export const metadata = {
// //   title: 'Login',
// // };

// // export const Login = (searchParams = {}) => {
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const [errorMessage, setErrorMessage] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);
// //   const navigate = useNavigate();
// //   const {
// //     state: { profile, authSession, isAuthenticated, userRequest },
// //     actions: { handleAuthSubmit, setProfile, setAuthSession },
// //   } = useUserStore();
// //   const { theme } = useMode();
// //   const [error, setError] = useState('');
// //   const [activeStep, setActiveStep] = useState(1);
// //   const [isSignup, setIsSignup] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const formik = useFormik({
// //     initialValues: {
// //       username: '',
// //       password: '',
// //       email: '',
// //       isSignup: false,
// //     },
// //     onSubmit: async values => {
// //       try {
// //         if (values.isSignup) {
// //           await handleSignUp(values);
// //         } else {
// //           await handleSignIn(values);
// //         }
// //       } catch (error) {
// //         console.error('Authentication failed:', error);
// //       }
// //     },
// //   });

// //   // Function to check session from MongoDB through Axios
// //   // Check session status on component mount
// //   useEffect(() => {
// //     const handleSessionRetrieval = async () => {
// //       setIsLoading(true);
// //       setErrorMessage('');

// //       try {
// //         const sessionResponse = await userApi.getSession();
// //         console.log('Current session:', sessionResponse.data);
// //       } catch (error) {
// //         console.error('Failed to retrieve session:', error);
// //         setErrorMessage('Session retrieval failed. Please try again.');
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     if (isAuthenticated === 'true') {
// //       handleSessionRetrieval();
// //     }
// //   }, [isAuthenticated]);

// //   const handleSubmit = React.useCallback(
// //     async values => {
// //       setIsLoading(true);
// //       try {
// //         await handleAuthSubmit(values);
// //       } catch (error) {
// //         console.error('Authentication error:', error);
// //         // Handle error (e.g., show error message)
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     },
// //     [handleAuthSubmit]
// //   );
// //   const handleSignIn = async values => {
// //     try {
// //       await handleSubmit(values);
// //       if (authSession) {
// //         redirect(`/${authSession.workspaceId}/chat`);
// //       }
// //     } catch (error) {
// //       setErrorMessage(
// //         `Login failed: ${error.response?.data?.message || 'Unknown error'}`
// //       );
// //     }
// //   };

// //   const handleSignUp = async values => {
// //     try {
// //       await handleSubmit(values);
// //       if (authSession) {
// //         redirect('/setup');
// //       }
// //     } catch (error) {
// //       setErrorMessage(
// //         `Sign Up failed: ${error.response?.data?.message || 'Unknown error'}`
// //       );
// //     }
// //   };

// //   const handleResetPassword = async formData => {
// //     const email = formData.get('email');

// //     try {
// //       await axios.post('/api/reset-password', { email });
// //       redirect('/login?message=Check your email to reset password');
// //     } catch (error) {
// //       setErrorMessage(
// //         `Password reset failed: ${error.response?.data?.message || 'Unknown error'}`
// //       );
// //     }
// //   };
// //   const pageRef = React.createRef();
// //   const formRef = React.createRef();
// //   const formFieldsConfigs = React.useMemo(
// //     () => ({
// //       authConfigs: authConfigs,
// //     }),
// //     []
// //   );
// //   const renderFormFields = () => {
// //     return formFieldsConfigs['authConfigs'].map(field => {
// //       if (field.conditional && !formik.values[field.conditional]) {
// //         return null;
// //       }
// //       return (
// //         <TextField
// //           key={field.name}
// //           label={field.label}
// //           name={field.name}
// //           type={field.type}
// //           value={formik.values[field.name]}
// //           onChange={formik.handleChange}
// //           fullWidth={field.fullWidth}
// //           margin={field.margin}
// //           InputLabelProps={{
// //             shrink: Boolean(formik.values[field.name]),
// //           }}
// //           sx={{
// //             backgroundColor: formik.values[field.name]
// //               ? 'transparent'
// //               : 'inherit',
// //             '& .MuiInputBase-input': {
// //               backgroundColor: formik.values[field.name]
// //                 ? 'transparent'
// //                 : 'inherit',
// //             },
// //           }}
// //         />
// //       );
// //     });
// //   };

// //   return (
// //     <Box
// //       display="flex"
// //       flexDirection="column"
// //       alignItems="center"
// //       justifyContent="center"
// //       width="100%"
// //       maxWidth={400}
// //       mx="auto"
// //       px={3}
// //       py={5}
// //     >
// //       <form onSubmit={formik.handleSubmit}>
// //         <Brand />

// //         {renderFormFields()}

// //         <Button
// //           type="submit"
// //           variant="contained"
// //           color="primary"
// //           fullWidth
// //           sx={{ mt: 2 }}
// //         >
// //           {formik.values.isSignup ? 'Sign Up' : 'Login'}
// //         </Button>

// //         <Button
// //           onClick={() =>
// //             formik.setFieldValue('isSignup', !formik.values.isSignup)
// //           }
// //           variant="outlined"
// //           fullWidth
// //           sx={{ mt: 2 }}
// //         >
// //           {formik.values.isSignup
// //             ? 'Already have an account? Login'
// //             : 'Sign Up'}
// //         </Button>

// //         <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
// //           <Typography variant="body2">Forgot your password?</Typography>
// //           <Button
// //             onClick={() => handleResetPassword(formik.values)}
// //             color="primary"
// //             sx={{ ml: 1 }}
// //           >
// //             Reset
// //           </Button>
// //         </Box>

// //         {searchParams?.message && (
// //           <Alert severity="info" sx={{ mt: 2 }}>
// //             {searchParams.message}
// //           </Alert>
// //         )}

// //         {errorMessage && (
// //           <Alert severity="error" sx={{ mt: 2 }}>
// //             {errorMessage}
// //           </Alert>
// //         )}
// //       </form>
// //     </Box>
// //   );
// // };

// // export default Login;

// // import {
// //   Box,
// //   Card,
// //   CardActions,
// //   CardContent,
// //   CircularProgress,
// //   Grid,
// //   Link as MuiLink,
// //   styled,
// //   TextField,
// //   Typography,
// // } from '@mui/material';
// // import { useFormik } from 'formik';
// // import React, { memo, useEffect, useMemo, useState } from 'react';
// // import { redirect, useNavigate } from 'react-router-dom';

// // import { FacebookIcon, GitHubIcon, GoogleIcon } from 'assets/humanIcons';
// // import { StyledIconContainer } from 'components/styled';
// // import {
// //   RCBox,
// //   RCButton,
// //   RCSwitchControl,
// //   RCTypography,
// // } from 'components/themed';
// // import { authConfigs } from 'config/form-configs';
// // import { useUserStore } from 'contexts';
// // import { useDialog, useMode } from 'hooks';
// // import { userApi } from 'api/user';
// // const LoadingOverlay = styled(Box)(({ theme }) => ({
// //   position: 'absolute',
// //   top: 0,
// //   left: 0,
// //   right: 0,
// //   bottom: 0,
// //   display: 'flex',
// //   alignItems: 'center',
// //   justifyContent: 'center',
// //   backgroundColor: 'rgba(255, 255, 255, 0.7)',
// //   zIndex: 2000,
// // }));
// // const StyledInfoPanel = styled(Box)(({ theme }) => ({
// //   padding: theme.spacing(1),
// //   backgroundColor: theme.palette.background.paper,
// //   borderRadius: theme.borders.borderRadius.md,
// //   boxShadow: theme.shadows[4],
// //   position: 'absolute',
// //   right: 15, // Align to the right edge of the parent dialog
// //   top: 15, // Align to the top of the dialog
// //   width: 280,
// //   zIndex: 1500, // Ensure it is above the dialog
// // }));
// // const LoadingSpinner = memo(() => (
// //   <LoadingOverlay>
// //     <CircularProgress />
// //   </LoadingOverlay>
// // ));
// // LoadingSpinner.displayName = 'LoadingSpinner';

// // const GuestInfoPanel = memo(() => {
// //   const { theme } = useMode();
// //   return (
// //     <StyledInfoPanel theme={theme}>
// //       <Typography variant="h6" color="textPrimary" gutterBottom>
// //         First Time Here?
// //       </Typography>
// //       <Typography variant="body1" color={theme.palette.text.secondary}>
// //         Use the guest account to explore:
// //       </Typography>
// //       <Typography
// //         variant="body2"
// //         color={theme.palette.text.secondary}
// //         sx={{ mt: 1 }}
// //       >
// //         Username: <strong>guestUsername</strong>
// //       </Typography>
// //       <Typography variant="body2" color={theme.palette.text.secondary}>
// //         Password: <strong>password123</strong>
// //       </Typography>
// //     </StyledInfoPanel>
// //   );
// // });

// // GuestInfoPanel.displayName = 'GuestInfoPanel';

// // const MemoizedLoadingSpinner = React.memo(LoadingSpinner);
// // const MemoizedGuestInfoPanel = React.memo(GuestInfoPanel);

// // export const AuthPages = () => {
// //   const navigate = useNavigate();
// //   const {
// //     state: { profile, isAuthenticated, userRequest },
// //     actions: { handleAuthSubmit, setProfile },
// //   } = useUserStore();
// //   const { theme } = useMode();
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [activeStep, setActiveStep] = useState(1);
// //   const [isSignup, setIsSignup] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   // Profile Step
// //   const [displayName, setDisplayName] = useState('');
// //   const [username, setUsername] = useState(profile?.username || '');
// //   const [usernameAvailable, setUsernameAvailable] = useState(true);

// //   // API Step
// //   const [openaiAPIKey, setOpenaiAPIKey] = useState('');
// //   const [openaiOrgID, setOpenaiOrgID] = useState('');
// //   const [anthropicAPIKey, setAnthropicAPIKey] = useState('');
// //   const [googleGeminiAPIKey, setGoogleGeminiAPIKey] = useState('');
// //   const [mistralAPIKey, setMistralAPIKey] = useState('');
// //   const [groqAPIKey, setGroqAPIKey] = useState('');
// //   const [perplexityAPIKey, setPerplexityAPIKey] = useState('');
// //   const [openrouterAPIKey, setOpenrouterAPIKey] = useState('');

// //   // Check authentication status on component mount
// //   useEffect(() => {
// //     const handleSessionRetrieval = async () => {
// //       setLoading(true);
// //       setError('');

// //       try {
// //         const sessionResponse = await userApi.getSession();
// //         console.log('Current session:', sessionResponse.data);
// //         setActiveStep(activeStep + 1);
// //       } catch {
// //         setError('Signup failed. Please try again.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     if (isAuthenticated === 'true') {
// //       handleSessionRetrieval();
// //     }
// //   }, [activeStep, isAuthenticated]);

// //   const handleSubmit = React.useCallback(
// //     async values => {
// //       setIsLoading(true);
// //       try {
// //         await handleAuthSubmit(values);
// //       } catch (error) {
// //         console.error('Authentication error:', error);
// //         // Handle error (e.g., show error message)
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     },
// //     [handleAuthSubmit]
// //   );
// //   const handleSignIn = async values => {
// //     try {
// //       await handleSubmit(values);
// //       if (authSession) {
// //         redirect(`/${authSession.workspaceId}/chat`);
// //       }
// //     } catch (error) {
// //       setErrorMessage(
// //         `Login failed: ${error.response?.data?.message || 'Unknown error'}`
// //       );
// //     }
// //   };

// //   const handleSignUp = async values => {
// //     try {
// //       await handleSubmit(values);
// //       if (authSession) {
// //         redirect('/setup');
// //       }
// //     } catch (error) {
// //       setErrorMessage(
// //         `Sign Up failed: ${error.response?.data?.message || 'Unknown error'}`
// //       );
// //     }
// //   };
// //   const formik = useFormik({
// //     initialValues: {
// //       username: '',
// //       password: '',
// //       email: '',
// //       isSignup: false,
// //     },
// //     onSubmit: async values => {
// //       // Set profile and navigate to next step
// //       setProfile({ ...profile, ...values });
// //       setActiveStep(2);
// //     },
// //     // onSubmit: handleSubmit,
// //   });
// //   const handleShouldProceed = proceed => {
// //     if (proceed) {
// //       if (currentStep === SETUP_STEP_COUNT) {
// //         handleSaveSetupSetting();
// //       } else {
// //         setCurrentStep(currentStep + 1);
// //       }
// //     } else {
// //       setCurrentStep(currentStep - 1);
// //     }
// //   };

// //   const handleSaveSetupSetting = async () => {
// //     const session = (await supabase.auth.getSession()).data.session;
// //     if (!session) {
// //       return router.push('/login');
// //     }

// //     const user = session.user;
// //     const profile = await getProfileByUserId(user.id);
// //     const updateProfilePayload = {
// //       ...profile,
// //       has_onboarded: true,
// //       display_name: displayName,
// //       username,
// //       openai_api_key: openaiAPIKey,
// //       openai_organization_id: openaiOrgID,
// //       anthropic_api_key: anthropicAPIKey,
// //       google_gemini_api_key: googleGeminiAPIKey,
// //       mistral_api_key: mistralAPIKey,
// //       groq_api_key: groqAPIKey,
// //       perplexity_api_key: perplexityAPIKey,
// //       openrouter_api_key: openrouterAPIKey,
// //     };

// //     const updatedProfile = await updateProfile(
// //       profile.id,
// //       updateProfilePayload
// //     );
// //     setProfile(updatedProfile);
// //     const workspaces = await getWorkspacesByUserId(profile.user_id);
// //     const homeWorkspace = workspaces.find(w => w.is_home);
// //     setSelectedWorkspace(homeWorkspace);
// //     setWorkspaces(workspaces);
// //     return router.push(`/${homeWorkspace?.id}/chat`);
// //   };
// //   const ICON_STYLES = {
// //     borderRadius: `${theme.spacing(8)} !important`,
// //     borderColor: theme.palette.text.outline,
// //     color: theme.palette.text.secondary,
// //     '& svg': {
// //       color: theme.palette.text.secondary,
// //     },
// //     '&:hover': {
// //       backgroundColor: theme.palette.primary?.main,
// //       borderRadius: `${theme.spacing(12)} !important`,
// //       borderColor: theme.palette.text.tertiary,
// //       '& svg': {
// //         color: theme.palette.info.contrastText,
// //       },
// //     },
// //   };

// //   const pageRef = React.createRef();
// //   const formRef = React.createRef();
// //   const searchParams = {};
// //   const formFieldsConfigs = React.useMemo(
// //     () => ({
// //       authConfigs: authConfigs,
// //     }),
// //     []
// //   );
// //   const renderFormFields = () => {
// //     return formFieldsConfigs['authConfigs'].map(field => {
// //       if (field.conditional && !formik.values[field.conditional]) {
// //         return null;
// //       }
// //       return (
// //         <TextField
// //           key={field.name}
// //           label={field.label}
// //           name={field.name}
// //           type={field.type}
// //           value={formik.values[field.name]}
// //           onChange={formik.handleChange}
// //           fullWidth={field.fullWidth}
// //           margin={field.margin}
// //           InputLabelProps={{
// //             shrink: Boolean(formik.values[field.name]),
// //           }}
// //           sx={{
// //             backgroundColor: formik.values[field.name]
// //               ? 'transparent'
// //               : 'inherit',
// //             '& .MuiInputBase-input': {
// //               backgroundColor: formik.values[field.name]
// //                 ? 'transparent'
// //                 : 'inherit',
// //             },
// //           }}
// //         />
// //       );
// //     });
// //   };

// // const renderStep = stepNum => {
// //   switch (stepNum) {
// //     case 1:
// //       return (
// //         <ProfileStep
// //           displayName={displayName}
// //           setDisplayName={setDisplayName}
// //           username={username}
// //           setUsername={setUsername}
// //           usernameAvailable={usernameAvailable}
// //           setUsernameAvailable={setUsernameAvailable}
// //         />
// //       );
// //     case 2:
// //       return (
// //         <APIStep
// //           useAzureOpenai={useAzureOpenai}
// //           setUseAzureOpenai={setUseAzureOpenai}
// //           openaiAPIKey={openaiAPIKey}
// //           setOpenaiAPIKey={setOpenaiAPIKey}
// //           openaiOrgID={openaiOrgID}
// //           setOpenaiOrgID={setOpenaiOrgID}
// //           azureOpenaiAPIKey={azureOpenaiAPIKey}
// //           setAzureOpenaiAPIKey={setAzureOpenaiAPIKey}
// //           azureOpenaiEndpoint={azureOpenaiEndpoint}
// //           setAzureOpenaiEndpoint={setAzureOpenaiEndpoint}
// //           azureOpenai35TurboID={azureOpenai35TurboID}
// //           setAzureOpenai35TurboID={setAzureOpenai35TurboID}
// //           azureOpenai45TurboID={azureOpenai45TurboID}
// //           setAzureOpenai45TurboID={setAzureOpenai45TurboID}
// //           azureOpenai45VisionID={azureOpenai45VisionID}
// //           setAzureOpenai45VisionID={setAzureOpenai45VisionID}
// //           azureOpenaiEmbeddingsID={azureOpenaiEmbeddingsID}
// //           setAzureOpenaiEmbeddingsID={setAzureOpenaiEmbeddingsID}
// //           anthropicAPIKey={anthropicAPIKey}
// //           setAnthropicAPIKey={setAnthropicAPIKey}
// //           googleGeminiAPIKey={googleGeminiAPIKey}
// //           setGoogleGeminiAPIKey={setGoogleGeminiAPIKey}
// //           mistralAPIKey={mistralAPIKey}
// //           setMistralAPIKey={setMistralAPIKey}
// //           groqAPIKey={groqAPIKey}
// //           setGroqAPIKey={setGroqAPIKey}
// //           perplexityAPIKey={perplexityAPIKey}
// //           setPerplexityAPIKey={setPerplexityAPIKey}
// //           openrouterAPIKey={openrouterAPIKey}
// //           setOpenrouterAPIKey={setOpenrouterAPIKey}
// //         />
// //       );
//     case 3:
//       return <FinishStep />;
//     default:
//       return null;
//   }
// };

//   useEffect(() => {
//     if (isAuthenticated) {
//       console.log('User is authenticated');
//       setIsLoading(false);
//       navigate('/admin/dashboard');
//     }
//   }, [isAuthenticated, navigate, setIsLoading]);

//   return (
//     <div style={{ position: 'relative' }}>
//       {isLoading && <LoadingSpinner />}
//       <GuestInfoPanel />
//       <RCBox
//         theme={theme}
//         ref={pageRef}
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           minHeight: '100vh',
//           padding: 3,
//           mt: 5,
//           backgroundColor: theme.palette.background.default,
//         }}
//       >
//         <Card
//           sx={{
//             maxWidth: 600,
//             width: '100%',
//             borderRadius: 'lg',
//             boxShadow: theme.shadows[3],
//           }}
//         >
//           <RCBox
//             theme={theme}
//             ref={formRef}
//             variant="outlined"
//             bgColor="primary"
//             borderRadius="lg"
//             coloredShadow="primary"
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               borderColor: theme.palette.primary.main,
//               gap: 2,
//               zIndex: 1900,
//               position: 'relative',
//               textAlign: 'center',
//               p: 2,
//               m: 1,
//             }}
//           >
//             <RCTypography variant="h2" fontWeight="medium" color="white" mt={1}>
//               {formik.values.isSignup ? 'Sign Up' : 'Login'}
//             </RCTypography>
//             <Grid
//               container
//               spacing={3}
//               justifyContent="center"
//               sx={{ mt: 1, mb: 2 }}
//             >
//               <Grid item xs={2}>
//                 <RCTypography
//                   component={MuiLink}
//                   href="#"
//                   variant="body1"
//                   color="white"
//                 >
//                   <StyledIconContainer theme={theme} sx={ICON_STYLES}>
//                     <FacebookIcon color="white" fontSize="inherit" />
//                   </StyledIconContainer>
//                 </RCTypography>
//               </Grid>
//               <Grid item xs={2}>
//                 <RCTypography
//                   component={MuiLink}
//                   href="#"
//                   variant="body1"
//                   color="white"
//                 >
//                   <StyledIconContainer theme={theme} sx={ICON_STYLES}>
//                     <GitHubIcon color="white" fontSize="inherit" />
//                   </StyledIconContainer>
//                 </RCTypography>
//               </Grid>
//               <Grid item xs={2}>
//                 <RCTypography
//                   component={MuiLink}
//                   href="#"
//                   variant="body1"
//                   color="white"
//                 >
//                   <StyledIconContainer theme={theme} sx={ICON_STYLES}>
//                     <GoogleIcon color="white" />
//                   </StyledIconContainer>
//                 </RCTypography>
//               </Grid>
//             </Grid>
//           </RCBox>
//           <RCBox pt={4} pb={3} px={3}>
//             <RCBox component="form" role="form" onSubmit={formik.handleSubmit}>
//               <CardContent>
//                 {renderFormFields()}
//                 <RCSwitchControl
//                   label={
//                     formik.values.isSignup
//                       ? 'Switch to Login'
//                       : 'Switch to Signup'
//                   }
//                   checked={formik.values.isSignup}
//                   onChange={() =>
//                     formik.setFieldValue('isSignup', !formik.values.isSignup)
//                   }
//                   variant="dark"
//                 />
//                 <Box sx={{ display: 'flex', justifyContent: 'flextStart' }}>
//                   <Typography variant="body2" color="text.secondary">
//                     Forgot your password?
//                   </Typography>
//                   <MuiLink
//                     component="button"
//                     variant="body2"
//                     // onClick={handleResetPassword}
//                     sx={{ ml: 1 }}
//                   >
//                     Reset
//                   </MuiLink>
//                 </Box>
//               </CardContent>
//               {searchParams?.message && (
//                 <Typography
//                   variant="body2"
//                   color="error"
//                   align="center"
//                   sx={{ mt: 2, p: 1, bgcolor: 'background.paper' }}
//                 >
//                   {searchParams.message}
//                 </Typography>
//               )}
//               <CardActions
//                 sx={{
//                   display: 'flex',
//                   flexDirection: 'row',
//                   gap: 2,
//                   justifyContent: 'space-between',
//                 }}
//               >
//                 <RCBox p={2}></RCBox>
//                 <RCBox p={2} justifyContent="space-around">
//                   <RCButton
//                     variant="outlined"
//                     type="submit"
//                     color="success"
//                     sx={{ mx: theme.spacing(1), color: '#5CDB95' }}
//                     disabled={isLoading}
//                   >
//                     {isLoading
//                       ? 'Processing...'
//                       : formik.values.isSignup
//                         ? 'Sign Up'
//                         : 'Login'}
//                   </RCButton>
//                 </RCBox>
//               </CardActions>
//             </RCBox>
//           </RCBox>
//         </Card>
//       </RCBox>
//     </div>
//   );
// };

// // AuthPages.displayName = 'AuthPages';

// // export default AuthPages;
