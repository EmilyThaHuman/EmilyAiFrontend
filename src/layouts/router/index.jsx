import { AnimatePresence, motion } from 'framer-motion';
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { toast } from 'sonner';
import './transition-styles.css';
import { LoadingContainer } from 'components/index';
// Memoize the debounceLoading function
const useDebounce = delay => {
  return useMemo(() => {
    return func => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
      };
    };
  }, [delay]);
};
// Function to check if the current path is an auth route
const authRoutesSet = new Set([
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/reset-password',
]);
const isAuthRoute = path => authRoutesSet.has(path);

const pageVariants = {
  initial: { opacity: 0, x: '-100%' },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: '100%' },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

export const RouterLayout = props => {
  const { ...rest } = props;
  const prevPathRef = useRef(null);
  const nodeRef = useRef(null);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const debounce = useDebounce(300);
  const debouncedSetLoading = useCallback(debounce(setIsLoading), [debounce]);
  const isAuthenticated = useMemo(
    () => !!sessionStorage.getItem('accessToken'),
    []
  );

  const handleNavigation = useCallback(() => {
    const previousPath = prevPathRef.current;
    const currentPath = location.pathname;

    if (previousPath !== currentPath) {
      toast.success(`Navigated to ${currentPath}`);
      prevPathRef.current = currentPath;
    }
    debouncedSetLoading(true);
    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => debouncedSetLoading(false));
  }, [debouncedSetLoading, location.pathname]);

  const handleLoading = useCallback(() => {
    if (navigation.state === 'loading') {
      localStorage.setItem('NavHistory', JSON.stringify(navigation.history));
      toast.info('Loading...');
      debouncedSetLoading(true);
    } else {
      debouncedSetLoading(false);
    }
  }, [debouncedSetLoading, navigation.history, navigation.state]);

  useEffect(() => {
    handleNavigation();
    handleLoading();

    if (!isAuthenticated && !isAuthRoute(location.pathname)) {
      navigate('/auth/sign-in');
    }
  }, [
    location.pathname,
    navigation.state,
    handleNavigation,
    handleLoading,
    isAuthenticated,
    navigate,
  ]);

  return (
    <LoadingContainer isLoading={isLoading}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Outlet {...rest} />
        </motion.div>
      </AnimatePresence>
      {/* <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          classNames="slide"
          // classNames="page"
          timeout={700}
          nodeRef={nodeRef}
          // onEnter={() => debouncedSetLoading(true)}
          // onExited={() => debouncedSetLoading(false)}
          // enter={true}
          // exit={true}
        >
          <div ref={nodeRef} className="page">
            <Outlet {...rest} />
          </div>
        </CSSTransition>
      </TransitionGroup> */}
    </LoadingContainer>
  );
};

export default RouterLayout;
