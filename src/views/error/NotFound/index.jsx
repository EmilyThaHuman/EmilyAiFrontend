import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import errorAnimationData from 'assets/error-animation.json';

// Styled Components

const MotionBox = motion.create(Box);
const MotionButton = motion.create(Button);

const Container = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: '#fff',
  color: '#000',
  padding: '20px',
});

const AnimationWrapper = styled(Box)({
  width: '250px',
  height: '250px',
  marginBottom: '20px',
});

const Message = styled(MotionBox)(({ theme }) => ({
  maxWidth: '600px',
  padding: '30px 40px',
  background:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.8)',
  borderRadius: '15px',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 4px 20px rgba(255, 255, 255, 0.1)'
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  transition: 'background 0.5s ease, box-shadow 0.5s ease',
}));

const StyledButton = styled(MotionButton)(({ theme }) => ({
  padding: '12px 24px',
  fontSize: '1rem',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  border: 'none',
  borderRadius: '25px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 4px 15px rgba(255, 255, 255, 0.1)'
      : '0 4px 15px rgba(0, 0, 0, 0.1)',

  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0 6px 20px rgba(255, 255, 255, 0.15)'
        : '0 6px 20px rgba(0, 0, 0, 0.2)',
  },

  '&:focus': {
    outline: `2px solid ${theme.palette.primary.light}`,
    outlineOffset: '2px',
  },
}));

const Title = styled('h1')({
  fontSize: '3rem',
  marginBottom: '10px',
  fontWeight: 800,
  color: '#000',
});

const Subtitle = styled('p')({
  fontSize: '1.2rem',
  color: '#555',
  marginBottom: '30px',
});

const ToggleButton = styled(Button)({
  textTransform: 'none',
  marginBottom: '20px',
  fontSize: '1rem',
  color: '#000',
  '&:hover': {
    color: '#555',
  },
});

const DetailsBox = styled(Box)({
  background: '#f5f5f5',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'left',
  marginTop: '20px',
  width: '100%',
  maxWidth: '500px',
});

const NotFoundPage = ({ error }) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const handleToggleDetails = () => setShowDetails(prev => !prev);

  const errorStatus = error?.status || 404;
  const errorMessage = error?.message || 'Page not found';
  const pathname = window.location.pathname;

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AnimationWrapper>
        <Lottie
          animationData={errorAnimationData}
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </AnimationWrapper>
      <Title>{errorStatus}</Title>
      <Subtitle>{errorMessage}</Subtitle>

      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Go Home
      </Button>

      <ToggleButton onClick={handleToggleDetails}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </ToggleButton>

      <AnimatePresence>
        {showDetails && (
          <DetailsBox>
            <Typography variant="body1">
              <strong>Status:</strong> {errorStatus}
            </Typography>
            <Typography variant="body1">
              <strong>Path:</strong> {pathname}
            </Typography>
            <Typography variant="body1">
              <strong>Message:</strong> {errorMessage}
            </Typography>
          </DetailsBox>
        )}
      </AnimatePresence>
    </Container>
  );
};

// export default NotFoundPage;

const WrappedNotFoundPage = props => (
  <ResponsiveStyles>
    <NotFoundPage {...props} />
  </ResponsiveStyles>
);

export const ErrorFallBack = props => <WrappedNotFoundPage {...props} />;

export default WrappedNotFoundPage;
const ResponsiveStyles = styled('div')(({ theme }) => ({
  '@media (max-width: 768px)': {
    [`& ${Container}`]: {
      padding: '15px',
    },

    [`& ${AnimationWrapper}`]: {
      width: '250px',
      height: '250px',
      marginBottom: '30px',
    },

    [`& ${Message}`]: {
      padding: '25px 30px',
    },

    [`& ${Title}`]: {
      fontSize: '2.5rem',
    },

    [`& ${Subtitle}`]: {
      fontSize: '1rem',
    },

    [`& ${StyledButton}`]: {
      padding: '10px 20px',
      fontSize: '0.9rem',
    },

    [`& ${ToggleButton}`]: {
      fontSize: '0.9rem',
    },
  },
}));
// // src/pages/NotFoundPage.jsx

// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { Box, Typography, IconButton, Button } from '@mui/material';
// import { styled, useTheme } from '@mui/system';
// import { motion, AnimatePresence } from 'framer-motion';
// import Lottie from 'lottie-react';
// import React, { useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';

// import errorAnimationData from 'assets/error-animation.json';
// import { FlexBetween } from 'components/index';
// import { buttonsData, errorProps } from 'config/data';

// // Create motion-enhanced MUI components
// const MotionBox = motion.create(Box);
// const MotionButton = motion.create(Button);

// // Styled Components
// const Container = styled(MotionBox)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center',
//   height: '100vh',
//   background:
//     theme.palette.mode === 'dark'
//       ? 'linear-gradient(135deg, #1e3c72, #2a5298)'
//       : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
//   textAlign: 'center',
//   padding: '20px',
//   transition: 'background 0.5s ease',
// }));

// const AnimationWrapper = styled(Box)(({ theme }) => ({
//   width: '300px',
//   height: '300px',
//   marginBottom: '40px',
//   borderRadius: '50%',
//   overflow: 'hidden',
//   boxShadow:
//     theme.palette.mode === 'dark'
//       ? '0 4px 15px rgba(255, 255, 255, 0.1)'
//       : '0 4px 15px rgba(0, 0, 0, 0.1)',
//   background: theme.palette.mode === 'dark' ? '#2a5298' : '#ffffff',
//   transition: 'background 0.5s ease, box-shadow 0.5s ease',

//   '@media (max-width: 600px)': {
//     width: '200px',
//     height: '200px',
//   },
// }));

// const Title = styled('h1')(({ theme }) => ({
//   fontSize: '3rem',
//   color: theme.palette.text.primary,
//   marginBottom: '10px',
//   fontWeight: 800,
//   textShadow:
//     theme.palette.mode === 'dark'
//       ? '2px 2px 4px rgba(255, 255, 255, 0.2)'
//       : '2px 2px 4px rgba(0, 0, 0, 0.1)',

//   '@media (max-width: 480px)': {
//     fontSize: '2.5rem',
//   },
// }));

// const Subtitle = styled('p')(({ theme }) => ({
//   fontSize: '1.2rem',
//   color: theme.palette.text.secondary,
//   marginBottom: '30px',
//   fontWeight: 500,
// }));

// const StyledButton = styled(MotionButton)(({ theme }) => ({
//   padding: '12px 24px',
//   fontSize: '1rem',
//   backgroundColor: theme.palette.primary.main,
//   color: theme.palette.primary.contrastText,
//   border: 'none',
//   borderRadius: '25px',
//   cursor: 'pointer',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
//   boxShadow:
//     theme.palette.mode === 'dark'
//       ? '0 4px 15px rgba(255, 255, 255, 0.1)'
//       : '0 4px 15px rgba(0, 0, 0, 0.1)',

//   '&:hover': {
//     backgroundColor: theme.palette.primary.dark,
//     boxShadow:
//       theme.palette.mode === 'dark'
//         ? '0 6px 20px rgba(255, 255, 255, 0.15)'
//         : '0 6px 20px rgba(0, 0, 0, 0.2)',
//   },

//   '&:focus': {
//     outline: `2px solid ${theme.palette.primary.light}`,
//     outlineOffset: '2px',
//   },
// }));

// const ToggleButton = styled('button')(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   background: 'none',
//   border: 'none',
//   color: theme.palette.primary.main,
//   fontSize: '1rem',
//   cursor: 'pointer',
//   marginBottom: '20px',
//   transition: 'color 0.3s ease',

//   '&:hover': {
//     color: theme.palette.primary.dark,
//     textDecoration: 'underline',
//   },

//   '&:focus': {
//     outline: `2px solid ${theme.palette.primary.light}`,
//     outlineOffset: '2px',
//   },
// }));

// const AnimatedIcon = styled(motion.div)(({ theme }) => ({
//   marginLeft: '8px',
// }));

// const DetailsContainer = styled(motion.div)(({ theme }) => ({
//   overflow: 'hidden',
//   width: '100%',
//   marginBottom: '20px',
// }));

// const DetailsBox = styled(Box)(({ theme }) => ({
//   background:
//     theme.palette.mode === 'dark'
//       ? 'rgba(255, 255, 255, 0.1)'
//       : 'rgba(0, 0, 0, 0.05)',
//   padding: '20px',
//   borderRadius: '10px',
//   textAlign: 'left',
//   boxShadow:
//     theme.palette.mode === 'dark'
//       ? '0 2px 10px rgba(255, 255, 255, 0.05)'
//       : '0 2px 10px rgba(0, 0, 0, 0.05)',
//   backdropFilter: 'blur(5px)',
//   transition: 'background 0.5s ease, box-shadow 0.5s ease',
// }));

// const ErrorDetail = styled('p')(({ theme }) => ({
//   fontSize: '0.95rem',
//   color: theme.palette.text.secondary,
//   margin: '8px 0',
//   lineHeight: '1.5',
// }));

// const ButtonStack = styled('div')(({ theme }) => ({
//   display: 'flex',
//   gap: '15px',
//   justifyContent: 'center',
//   flexWrap: 'wrap',
// }));

// const ResponsiveStyles = styled('div')(({ theme }) => ({
//   '@media (max-width: 768px)': {
//     [`& ${Container}`]: {
//       padding: '15px',
//     },

//     [`& ${AnimationWrapper}`]: {
//       width: '250px',
//       height: '250px',
//       marginBottom: '30px',
//     },

//     [`& ${Message}`]: {
//       padding: '25px 30px',
//     },

//     [`& ${Title}`]: {
//       fontSize: '2.5rem',
//     },

//     [`& ${Subtitle}`]: {
//       fontSize: '1rem',
//     },

//     [`& ${StyledButton}`]: {
//       padding: '10px 20px',
//       fontSize: '0.9rem',
//     },

//     [`& ${ToggleButton}`]: {
//       fontSize: '0.9rem',
//     },
//   },

//   '@media (max-width: 480px)': {
//     [`& ${Container}`]: {
//       padding: '10px',
//     },

//     [`& ${AnimationWrapper}`]: {
//       width: '180px',
//       height: '180px',
//       marginBottom: '25px',
//     },

//     [`& ${Message}`]: {
//       padding: '20px 25px',
//     },

//     [`& ${Title}`]: {
//       fontSize: '2rem',
//     },

//     [`& ${Subtitle}`]: {
//       fontSize: '0.9rem',
//     },

//     [`& ${StyledButton}`]: {
//       padding: '8px 16px',
//       fontSize: '0.8rem',
//     },

//     [`& ${ToggleButton}`]: {
//       fontSize: '0.8rem',
//     },
//   },
// }));

// // Reusable Components
// const ErrorText = ({ variant, content, sx = {} }) => (
//   <Typography variant={variant} sx={{ ...sx }} gutterBottom>
//     {content}
//   </Typography>
// );

// const ActionButton = ({
//   startIcon,
//   variant,
//   color,
//   component,
//   to,
//   onClick,
//   children,
// }) => (
//   <StyledButton
//     startIcon={startIcon}
//     variant={variant}
//     color={color}
//     component={component}
//     to={to}
//     onClick={onClick}
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//     aria-label={children}
//   >
//     {children}
//   </StyledButton>
// );

// const RenderErrorContent = ({ theme, errorDetails }) => {
//   const { statusText, message, mainText, subTextA, subTextB } = errorDetails;

//   return (
//     <>
//       <ErrorText
//         variant="h1"
//         content={statusText}
//         sx={{ fontWeight: 700, fontSize: '6rem' }}
//       />
//       <ErrorText variant="h4" content={message} />
//       <ErrorText
//         variant="subtitle1"
//         content={mainText}
//         sx={{ mb: 4, textAlign: 'center', color: theme.palette.text.primary }}
//       />
//       <FlexBetween sx={{ justifyContent: 'center', mb: 4 }}>
//         <ErrorText
//           variant="subtitle1"
//           content={subTextA}
//           sx={{ textAlign: 'center', color: theme.palette.text.tertiary }}
//         />
//         <ErrorText
//           variant="subtitle1"
//           content={subTextB}
//           sx={{ ml: 1, fontWeight: 700, color: theme.palette.error.main }}
//         />
//       </FlexBetween>
//     </>
//   );
// };

// const RenderButtonStack = ({ buttons }) =>
//   buttons.map(
//     ({ startIcon, variant, color, component, to, onClick, children }) => (
//       <ActionButton
//         key={children}
//         startIcon={startIcon}
//         variant={variant}
//         color={color}
//         component={component}
//         to={to}
//         onClick={onClick}
//       >
//         {children}
//       </ActionButton>
//     )
//   );

// // Main NotFoundPage Component
// const NotFoundPage = ({ error, resetErrorBoundary }) => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const [showDetails, setShowDetails] = useState(false); // State to manage collapse

//   const handleToggleDetails = () => {
//     setShowDetails(prev => !prev);
//   };

//   const errorStatus = error.status || 404;
//   const pathname = window.location.pathname;

//   const clickHandlers = {
//     goHome: () => navigate('/'),
//     goBack: () => navigate(-1),
//     retry: () => window.location.reload(),
//     copy: () => navigator.clipboard.writeText(window.location.href),
//     refresh: () => window.location.reload(),
//   };

//   const buttonProps = buttonsData.map(btn => ({
//     ...btn,
//     component: btn.handler === 'goHome' ? NavLink : 'button',
//     to: btn.handler === 'goHome' ? '/' : undefined,
//     onClick: clickHandlers[btn.handler],
//   }));

//   const errorDetails = {
//     theme: theme,
//     statusText:
//       error.status ||
//       404 ||
//       errorProps?.errorTypes[error.statusText]?.statusText ||
//       'Error',
//     message:
//       error?.message ||
//       errorProps?.errorTypes[error.statusText]?.message ||
//       'Something went wrong.',
//     mainText:
//       error?.message ||
//       errorProps?.errorTypes[error.statusText]?.mainText ||
//       'Please try the following:',
//     subTextA:
//       error?.message ||
//       errorProps?.errorTypes[error.statusText]?.subTextA ||
//       '',
//     subTextB: JSON.stringify(pathname) || error.path || '',
//   };

//   return (
//     <Container
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       role="alert"
//       aria-live="assertive"
//     >
//       <AnimationWrapper>
//         <Lottie
//           animationData={errorAnimationData}
//           loop={true}
//           style={{ width: '100%', height: '100%' }}
//         />
//       </AnimationWrapper>
//       <Message>
//         <Title>{`{${errorDetails.statusText}}`}</Title>

//         <Subtitle>
//           Sorry, the page you&apos;re looking for doesn&apos;t exist.
//         </Subtitle>
//         <Box sx={{ mb: 2 }}>
//           <RenderErrorContent theme={theme} errorDetails={errorDetails} />
//         </Box>

//         {/* Toggle Button for Collapsible Details */}
//         <ToggleButton
//           onClick={handleToggleDetails}
//           aria-expanded={showDetails}
//           aria-controls="error-details"
//         >
//           {showDetails ? 'Hide Details' : 'Show Details'}
//           <AnimatedIcon
//             as={IconButton}
//             aria-label="Toggle Details"
//             initial={{ rotate: 0 }}
//             animate={{ rotate: showDetails ? 180 : 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//           </AnimatedIcon>
//         </ToggleButton>

//         {/* Collapsible Error Details */}
//         <AnimatePresence>
//           {showDetails && (
//             <DetailsContainer
//               id="error-details"
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <DetailsBox>
//                 <ErrorDetail>
//                   <strong>Status:</strong> {errorStatus}
//                 </ErrorDetail>
//                 <ErrorDetail>
//                   <strong>Path:</strong> {pathname}
//                 </ErrorDetail>
//                 <ErrorDetail>
//                   <strong>Message:</strong> {errorDetails.message}
//                 </ErrorDetail>
//                 {/* Add more detailed error information as needed */}
//               </DetailsBox>
//             </DetailsContainer>
//           )}
//         </AnimatePresence>

//         {/* Action Buttons */}
//         <ButtonStack>
//           <RenderButtonStack buttons={buttonProps} />
//         </ButtonStack>
//       </Message>
//     </Container>
//   );
// };

// // const ResponsiveStyles = styled.div(({ theme }) => ({
// //   '@media (max-width: 768px)': {
// //     [`& ${Container}`]: {
// //       padding: '15px',
// //     },

// //     [`& ${AnimationWrapper}`]: {
// //       width: '250px',
// //       height: '250px',
// //       marginBottom: '30px',
// //     },

// //     [`& ${Message}`]: {
// //       padding: '25px 30px',
// //     },

// //     [`& ${Title}`]: {
// //       fontSize: '2.5rem',
// //     },

// //     [`& ${Subtitle}`]: {
// //       fontSize: '1rem',
// //     },

// //     [`& ${StyledButton}`]: {
// //       padding: '10px 20px',
// //       fontSize: '0.9rem',
// //     },

// //     [`& ${ToggleButton}`]: {
// //       fontSize: '0.9rem',
// //     },
// //   },

// //   '@media (max-width: 480px)': {
// //     [`& ${Container}`]: {
// //       padding: '10px',
// //     },

// //     [`& ${AnimationWrapper}`]: {
// //       width: '180px',
// //       height: '180px',
// //       marginBottom: '25px',
// //     },

// //     [`& ${Message}`]: {
// //       padding: '20px 25px',
// //     },

// //     [`& ${Title}`]: {
// //       fontSize: '2rem',
// //     },

// //     [`& ${Subtitle}`]: {
// //       fontSize: '0.9rem',
// //     },

// //     [`& ${StyledButton}`]: {
// //       padding: '8px 16px',
// //       fontSize: '0.8rem',
// //     },

// //     [`& ${ToggleButton}`]: {
// //       fontSize: '0.8rem',
// //     },
// //   },
// // }));

// // Wrap the entire component with ResponsiveStyles
