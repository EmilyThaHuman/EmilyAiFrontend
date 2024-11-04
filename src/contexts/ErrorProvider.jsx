// client/src/contexts/ErrorContext.js
import React, { createContext, useCallback, useContext } from 'react';

import { useToastStore } from './ToastProvider';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const { addToast } = useToastStore();

  const showError = useCallback(
    message => {
      addToast({
        message,
        severity: 'error',
        timeout: 6000, // Duration in milliseconds
      });
    },
    [addToast]
  );

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
    </ErrorContext.Provider>
  );
};

/*
 * Custom hook to access the color context
 * @returns {Object} The color context
 */
export const useErrorStore = () => useContext(ErrorContext);

export default ErrorProvider;
