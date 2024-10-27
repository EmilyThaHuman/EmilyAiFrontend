// // components/Login.js
// import { Box, CircularProgress } from '@mui/material';
// import React, { useCallback, useEffect, useState } from 'react';
// import { redirect, useNavigate } from 'react-router-dom'; // Added useNavigate

// import { userApi } from 'api/user';
// import { authConfigs } from 'config/form-configs';
// import { useChatStore } from 'contexts/ChatProvider';
// import { useUserStore } from 'contexts/UserProvider';
// import { useWorkspaceHandler } from 'hooks/chat';

// import { AuthForm } from '../src/views/auth/components/AuthForm';

// export const Login = props => {
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const {
//     state: { isAuthenticated },
//     actions: { handleAuthSubmit },
//   } = useUserStore();
//   const {
//     state: { workspaces },
//   } = useChatStore();
//   const list = JSON.parse(sessionStorage.getItem('dataPopulationChecklist'));
//   const workspaceId = sessionStorage.getItem('workspaceId');
//   const { setupWorkspaceAndNavigate } = useWorkspaceHandler();

//   const navigate = useNavigate(); // Use navigate

//   const handleSignIn = useCallback(
//     async values => {
//       setLoading(true);
//       try {
//         await handleAuthSubmit(values);
//         navigate('/admin/dashboard'); // Navigate to '/admin/dashboard' on successful login
//       } catch (error) {
//         setErrorMessage(
//           `Login failed: ${error.response?.data?.message || 'Unknown error'}`
//         );
//       } finally {
//         setLoading(false);
//       }
//     },
//     [handleAuthSubmit, navigate] // Added navigate to dependencies
//   );

//   const handleResetPassword = async email => {
//     try {
//       await userApi.resetPassword({ email });
//       redirect('/login?message=Check your email to reset password');
//     } catch (error) {
//       setErrorMessage(
//         `Password reset failed: ${error.response?.data?.message || 'Unknown error'}`
//       );
//     }
//   };

//   useEffect(() => {
//     const triggerWorkspaceTransition = async () => {
//       const userId = sessionStorage.getItem('userId');

//       return await setupWorkspaceAndNavigate(userId);
//     };
//     if (isAuthenticated && !workspaces) {
//       triggerWorkspaceTransition();
//     }
//   }, [
//     isAuthenticated,
//     list,
//     setupWorkspaceAndNavigate,
//     workspaceId,
//     workspaces,
//   ]);

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="100vh"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <AuthForm
//       isSignup={false}
//       onSubmit={handleSignIn}
//       errorMessage={errorMessage}
//       handleResetPassword={handleResetPassword}
//       formFieldsConfigs={authConfigs}
//     />
//   );
// };

// export default Login;
