import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';

import { HistoryTracker } from 'components/HistoryTracker';
import { Transition } from 'components/Transition';
import { useAppStore } from 'contexts/AppProvider';
import { useLoadingStore } from 'contexts/LoadingProvider';

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

export const metadata = {
  title: 'ReedAi',
  description: ' * insert description * ',
};

export const RouterLayout = () => {
  const navigation = useNavigation();
  const appContext = useAppStore();
  const location = useLocation();
  const { startLoading, stopLoading } = useLoadingStore();

  // Update loading state based on navigation state
  useEffect(() => {
    if (navigation.state === 'loading') {
      startLoading();
    } else {
      stopLoading();
    }
  }, [navigation.state, startLoading, stopLoading]);

  return (
    <Transition>
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
    </Transition>
  );
};

export default RouterLayout;
