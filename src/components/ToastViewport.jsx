// src/components/ui/toast/ToastViewport.js
import React from 'react';
import { useSelector } from 'react-redux';

import { Toast } from './Toast';

export const ToastViewport = () => {
  const toasts = useSelector(state => state.toast.toasts);
  console.log('TOASTS', toasts);
  return (
    <>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} open={toast.open} />
      ))}
    </>
  );
};

export default ToastViewport;
