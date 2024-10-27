// import Alert from '@mui/material/Alert';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import axios from 'axios';
// import { redirect } from 'next/navigation';
// import React, { useState, useEffect } from 'react';

// import { userApi } from 'api/user';

// import { Brand } from '@/components/ui/brand';
// import { useNavigate } from 'react-router-dom';

// export const metadata = {
//   title: 'Login',
// };

// export default function Login({ searchParams }) {
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const {
//     state: { profile, isAuthenticated, userRequest },
//     actions: { handleAuthSubmit, setProfile },
//   } = useUserStore();
//   const { theme } = useMode();
//   const [error, setError] = useState('');
//   const [activeStep, setActiveStep] = useState(1);
//   const [isSignup, setIsSignup] = useState(false);
//   const [loading, setLoading] = useState(false);

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

//   const signIn = async formData => {
//     const email = formData.get('email');
//     const password = formData.get('password');

//     try {
//       const response = await axios.post('/api/login', { email, password });
//       if (response.data && response.data.session) {
//         redirect(`/${response.data.session.homeWorkspaceId}/chat`);
//       }
//     } catch (error) {
//       setErrorMessage(
//         `Login failed: ${error.response?.data?.message || 'Unknown error'}`
//       );
//     }
//   };

//   const signUp = async formData => {
//     const email = formData.get('email');
//     const password = formData.get('password');

//     try {
//       const response = await axios.post('/api/signup', { email, password });
//       if (response.data && response.data.success) {
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
//       <form
//         onSubmit={e => {
//           e.preventDefault();
//           const formData = new FormData(e.target);
//           signIn(formData);
//         }}
//       >
//         <Brand />

//         <Typography variant="h6" component="label" htmlFor="email" mt={4}>
//           Email
//         </Typography>
//         <TextField
//           fullWidth
//           margin="normal"
//           id="email"
//           name="email"
//           type="email"
//           placeholder="you@example.com"
//           required
//         />

//         <Typography variant="h6" component="label" htmlFor="password">
//           Password
//         </Typography>
//         <TextField
//           fullWidth
//           margin="normal"
//           id="password"
//           name="password"
//           type="password"
//           placeholder="••••••••"
//           required
//         />

//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Login
//         </Button>

//         <Button
//           onClick={e => {
//             e.preventDefault();
//             const formData = new FormData(e.target.form);
//             signUp(formData);
//           }}
//           variant="outlined"
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Sign Up
//         </Button>

//         <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
//           <Typography variant="body2">Forgot your password?</Typography>
//           <Button
//             onClick={e => {
//               e.preventDefault();
//               const formData = new FormData(e.target.form);
//               handleResetPassword(formData);
//             }}
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
