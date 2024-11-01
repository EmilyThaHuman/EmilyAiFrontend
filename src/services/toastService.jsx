// src/services/toastService.js
let showToastRef = null;

/**
 * Sets the showToast function reference.
 * This should be called once by the ToastProvider.
 * @param {Function} showToast - The function to display a toast.
 */
export const setShowToast = showToast => {
  showToastRef = showToast;
};

/**
 * Toast helper functions.
 * These functions can be imported and used anywhere in the app.
 */
export const toast = {
  success: (message, title = 'Success') => {
    if (showToastRef) {
      showToastRef({
        severity: 'success',
        title,
        description: message,
      });
    } else {
      console.warn('ToastProvider is not initialized yet.');
    }
  },
  error: (message, title = 'Error') => {
    if (showToastRef) {
      showToastRef({
        severity: 'error',
        title,
        description: message,
      });
    } else {
      console.warn('ToastProvider is not initialized yet.');
    }
  },
  warning: (message, title = 'Warning') => {
    if (showToastRef) {
      showToastRef({
        severity: 'warning',
        title,
        description: message,
      });
    } else {
      console.warn('ToastProvider is not initialized yet.');
    }
  },
  info: (message, title = 'Info') => {
    if (showToastRef) {
      showToastRef({
        severity: 'info',
        title,
        description: message,
      });
    } else {
      console.warn('ToastProvider is not initialized yet.');
    }
  },
};

export default toast;
