// Updated ToastProvider.jsx with corrected import order
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useDispatch } from 'react-redux';

import { ToastViewport } from '@/components/ToastViewport';
import { setShowToast } from '@/services';
import { addToast } from '@/store/Slices';

export const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

export const ToastProvider = ({ children }) => {
  const dispatch = useDispatch();

  /**
   * Function to show a toast.
   * @param {Object} toast - Toast details.
   */
  const showToast = useCallback(
    toast => {
      dispatch(addToast(toast));
    },
    [dispatch]
  );

  useEffect(() => {
    // Set the showToast function in the toastService when the provider mounts
    setShowToast(showToast);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastViewport /> {/* Render Toasts within the provider */}
    </ToastContext.Provider>
  );
};

export const useToastStore = () => useContext(ToastContext);

export default ToastProvider;
