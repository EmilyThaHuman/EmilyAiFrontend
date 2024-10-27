import React, { useState, useCallback, useMemo } from 'react';
import { Toaster, toast } from 'sonner';

import Toast from './Toast'; // Import the updated Toast component

export const ToastContext = React.createContext({
  toasts: null,
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(toastData => {
    const toastId = toastData.__id ?? new Date().getTime();
    const newToast = { ...toastData, __id: toastId };
    setToasts(prevToasts => [...prevToasts, newToast]);

    toast.custom(
      t => (
        <Toast
          message={newToast.message}
          severity={newToast.severity}
          onClose={() => toast.dismiss(t)}
        />
      ),
      {
        id: toastId,
        duration: toastData.timeout || 3000,
      }
    );

    return toastId;
  }, []);

  const removeToast = useCallback(toast => {
    setToasts(prevToasts => prevToasts.filter(t => t.__id !== toast.__id));
    toast.dismiss(toast.__id);
  }, []);

  const contextValue = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToastStore = timeout => {
  const {
    toasts,
    addToast: originalAddToast,
    removeToast,
  } = React.useContext(ToastContext);

  const addToast = useCallback(
    toastData => {
      const id = originalAddToast(toastData);
      const appliedTimeout = toastData.timeout ?? timeout;
      if (appliedTimeout > 0) {
        setTimeout(() => removeToast({ __id: id }), appliedTimeout);
      }
      return id;
    },
    [originalAddToast, removeToast, timeout]
  );

  return useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  );
};

export default ToastProvider;
