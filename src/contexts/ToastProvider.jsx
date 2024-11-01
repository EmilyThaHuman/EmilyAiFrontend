// Updated ToastProvider.jsx with corrected import order
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Snackbar, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setShowToast } from '@/services';
import { addToast } from '@/store/Slices';

import ToastViewport from './ToastViewport';

const StyledToast = styled(Snackbar)(({ theme, severity }) => ({
  display: 'flex',
  gap: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
  borderRadius: '8px',
  border: `1px solid ${theme.palette[severity].main}`,
  boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
  padding: '0.75rem',
  color: theme.palette.text.primary,
}));

const IconMap = {
  success: CheckCircleIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

export const ToastProvider = ({ children }) => {
  const dispatch = useDispatch();

  /**
   * Function to show a toast.
   * @param {Object} toast - Toast details.
   */
  const showToast = (toast) => {
    dispatch(addToast(toast));
  };

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
