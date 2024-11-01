// ToastViewport.js
import React from 'react';

import { Toast } from './Toast';
import { useToast } from './ToastProvider';

export const ToastViewport = () => {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  );
};

export default ToastViewport;
