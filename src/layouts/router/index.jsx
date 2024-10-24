import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';

import { HistoryTracker, LoadingContainer } from 'components';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 0.95,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

export const RouterLayout = () => {
  const navigation = useNavigation();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Update loading state based on navigation state
  useEffect(() => {
    setIsLoading(navigation.state === 'loading');
  }, [navigation.state]);

  return (
    <LoadingContainer isLoading={isLoading}>
      <HistoryTracker /> {/* Include the HistoryTracker here */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{ height: '100%' }} // Ensure full height for smoother transitions
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </LoadingContainer>
  );
};

export default RouterLayout;

// / import { AnimatePresence, motion } from 'framer-motion';
// import React, {
//   Suspense,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import {
//   Outlet,
//   useLocation,
//   useNavigate,
//   useNavigation,
// } from 'react-router-dom';
// import { toast } from 'sonner';

// import './transition-styles.css';
// import { LoadingContainer } from 'components/index';

// const useDebounce = (func, delay) => {
//   const debounceRef = useRef(null);

//   return useCallback(
//     (...args) => {
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//       debounceRef.current = setTimeout(() => func(...args), delay);
//     },
//     [delay, func]
//   );
// };

// // Authentication Routes for redirection logic
// const AUTH_ROUTES = [
//   '/auth',
//   '/auth/sign-in',
//   '/auth/sign-up',
//   '/auth/reset-password',
// ];

// // Page transition settings
// const pageVariants = {
//   initial: { opacity: 0, x: '-100%' },
//   in: { opacity: 1, x: 0 },
//   out: { opacity: 0, x: '100%' },
// };

// const pageTransition = {
//   type: 'tween',
//   ease: 'anticipate',
//   duration: 0.5,
// };

// export const RouterLayout = props => {
//   const { ...rest } = props;
//   const prevPathRef = useRef(null);
//   const navigation = useNavigation();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isLoading, setIsLoading] = useState(false);

//   const debounceSetLoading = useDebounce(setIsLoading, 300);

//   const handleNavigation = useCallback(() => {
//     const previousPath = prevPathRef.current;
//     const currentPath = location.pathname;

//     if (previousPath !== currentPath) {
//       toast.success(`Navigated to ${currentPath}`);
//       prevPathRef.current = currentPath;
//     }

//     debounceSetLoading(true);
//     requestAnimationFrame(() => debounceSetLoading(false));
//   }, [debounceSetLoading, location.pathname]);

//   const handleLoading = useCallback(() => {
//     if (navigation.state === 'loading') {
//       toast.info('Loading...');
//       debounceSetLoading(true);
//     } else {
//       debounceSetLoading(false);
//     }
//   }, [debounceSetLoading, navigation.state]);

//   // Apply navigation and loading state logic
//   useEffect(() => {
//     handleNavigation();
//     handleLoading();
//   }, [handleNavigation, handleLoading]);

//   return (
//     <LoadingContainer isLoading={isLoading}>
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={location.pathname}
//           initial="initial"
//           animate="in"
//           exit="out"
//           variants={pageVariants}
//           transition={pageTransition}
//         >
//           <Outlet {...rest} />
//         </motion.div>
//       </AnimatePresence>
//     </LoadingContainer>
//   );
// };

// // Metadata export for app configuration
// export const appMetadata = {
//   appName: 'EmilyAiFrontend',
//   version: '1.0.0',
//   environment: process.env.NODE_ENV || 'development',
//   main: 'src/index.jsx',
//   browserslist: {
//     production: ['>0.2%', 'not dead', 'not op_mini all'],
//     development: [
//       'last 1 chrome version',
//       'last 1 firefox version',
//       'last 1 safari version',
//     ],
//   },
// };

// export default RouterLayout;
// // Custom hook to manage authentication and routing transitions
// // const useAuthNavigation = navigate => {
// //   const isAuthenticated = useMemo(
// //     () => !!sessionStorage.getItem('accessToken'),
// //     []
// //   );
// //   const isWorkspaceValid = useMemo(
// //     () => !!sessionStorage.getItem('workspaceId'),
// //     []
// //   );
// //   const isChatValid = useMemo(() => !!sessionStorage.getItem('sessionId'), []);

// //   useEffect(() => {
// //     const accessToken = sessionStorage.getItem('accessToken');
// //     const workspaceId = sessionStorage.getItem('workspaceId');
// //     const sessionId = sessionStorage.getItem('sessionId');

// //     // Wait until session storage values are loaded
// //     if (!accessToken || !workspaceId || !sessionId) return;

// //     if (!accessToken && !AUTH_ROUTES.includes(window.location.pathname)) {
// //       navigate('/auth/auth-default');
// //     } else if (accessToken && !workspaceId) {
// //       navigate('/');
// //     } else if (accessToken && workspaceId && !sessionId) {
// //       navigate(`/admin/workspace/${workspaceId}`);
// //     } else if (accessToken && workspaceId && sessionId) {
// //       if (
// //         window.location.pathname.includes(`/admin/workspace/${workspaceId}`)
// //       ) {
// //         navigate(`/chat/${sessionId}`);
// //       } else {
// //         navigate(window.location.pathname);
// //       }
// //     }
// //   }, [navigate, isAuthenticated, isWorkspaceValid, isChatValid]);
// // };
