// import Alert from '@mui/material/Alert';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import axios from 'axios';
// import { useFormik } from 'formik';
// import React, { useState, useEffect } from 'react';
// import { redirect, useNavigate } from 'react-router-dom';

// import { userApi } from 'api/user';
// import { authConfigs } from 'config/form-configs';
// import { useUserStore } from 'contexts/UserProvider';
// import { useMode } from 'hooks/app';
// import { Brand } from 'layouts/navigation';

// export const metadata = {
//   title: 'Login',
// };

// export default function Login({ searchParams = {} }) {
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const {
//     state: { profile, authSession, isAuthenticated, userRequest },
//     actions: { handleAuthSubmit, setProfile, setAuthSession },
//   } = useUserStore();
//   const { theme } = useMode();
//   const [error, setError] = useState('');
//   const [activeStep, setActiveStep] = useState(1);
//   const [isSignup, setIsSignup] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const formik = useFormik({
//     initialValues: {
//       username: '',
//       password: '',
//       email: '',
//       isSignup: false,
//     },
//     onSubmit: async values => {
//       try {
//         if (values.isSignup) {
//           await handleSignUp(values);
//         } else {
//           await handleSignIn(values);
//         }
//       } catch (error) {
//         console.error('Authentication failed:', error);
//       }
//     },
//   });

//   // Function to check session from MongoDB through Axios
//   // Check session status on component mount
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

//   const handleSubmit = React.useCallback(
//     async values => {
//       setIsLoading(true);
//       try {
//         await handleAuthSubmit(values);
//       } catch (error) {
//         console.error('Authentication error:', error);
//         // Handle error (e.g., show error message)
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [handleAuthSubmit]
//   );
//   const handleSignIn = async values => {
//     try {
//       await handleSubmit(values);
//       if (authSession) {
//         redirect(`/${authSession.workspaceId}/chat`);
//       }
//     } catch (error) {
//       setErrorMessage(
//         `Login failed: ${error.response?.data?.message || 'Unknown error'}`
//       );
//     }
//   };

//   const handleSignUp = async values => {
//     try {
//       await handleSubmit(values);
//       if (authSession) {
//         redirect('/setup');
//       }
//     } catch (error) {
//       setErrorMessage(
//         `Sign Up failed: ${error.response?.data?.message || 'Unknown error'}`
//       );
//     }
//   };

//   const handleResetPassword = async formData => {
//     const email = formData.get('email');

//     try {
//       await axios.post('/api/reset-password', { email });
//       redirect('/login?message=Check your email to reset password');
//     } catch (error) {
//       setErrorMessage(
//         `Password reset failed: ${error.response?.data?.message || 'Unknown error'}`
//       );
//     }
//   };
//   const pageRef = React.createRef();
//   const formRef = React.createRef();
//   const formFieldsConfigs = React.useMemo(
//     () => ({
//       authConfigs: authConfigs,
//     }),
//     []
//   );
//   const renderFormFields = () => {
//     return formFieldsConfigs['authConfigs'].map(field => {
//       if (field.conditional && !formik.values[field.conditional]) {
//         return null;
//       }
//       return (
//         <TextField
//           key={field.name}
//           label={field.label}
//           name={field.name}
//           type={field.type}
//           value={formik.values[field.name]}
//           onChange={formik.handleChange}
//           fullWidth={field.fullWidth}
//           margin={field.margin}
//           InputLabelProps={{
//             shrink: Boolean(formik.values[field.name]),
//           }}
//           sx={{
//             backgroundColor: formik.values[field.name]
//               ? 'transparent'
//               : 'inherit',
//             '& .MuiInputBase-input': {
//               backgroundColor: formik.values[field.name]
//                 ? 'transparent'
//                 : 'inherit',
//             },
//           }}
//         />
//       );
//     });
//   };

//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       justifyContent="center"
//       width="100%"
//       maxWidth={400}
//       mx="auto"
//       px={3}
//       py={5}
//     >
//       <form onSubmit={formik.handleSubmit}>
//         <Brand />

//         {renderFormFields()}

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           {formik.values.isSignup ? 'Sign Up' : 'Login'}
//         </Button>

//         <Button
//           onClick={() =>
//             formik.setFieldValue('isSignup', !formik.values.isSignup)
//           }
//           variant="outlined"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           {formik.values.isSignup
//             ? 'Already have an account? Login'
//             : 'Sign Up'}
//         </Button>

//         <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
//           <Typography variant="body2">Forgot your password?</Typography>
//           <Button
//             onClick={() => handleResetPassword(formik.values)}
//             color="primary"
//             sx={{ ml: 1 }}
//           >
//             Reset
//           </Button>
//         </Box>

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
// }
