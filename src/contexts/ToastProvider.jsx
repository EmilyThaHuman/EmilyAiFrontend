// toastContext.js
import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext({
  toasts: [],
  showToast: () => {},
  hideToast: () => {},
});

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = toast => {
    const id = ++toastId;
    setToasts(prevToasts => [...prevToasts, { id, ...toast }]);
  };

  const hideToast = id => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastStore = () => useContext(ToastContext);

export default ToastProvider;

// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CloseIcon from '@mui/icons-material/Close';
// import ErrorIcon from '@mui/icons-material/Error';
// import InfoIcon from '@mui/icons-material/Info';
// import WarningIcon from '@mui/icons-material/Warning';
// import {
//   Button,
//   IconButton,
//   Snackbar,
//   SnackbarContent,
//   Typography,
// } from '@mui/material';
// import { styled } from '@mui/system';
// import React, { createContext, useContext, useState } from 'react';
// import { toast } from 'sonner';

// const StyledToast = styled(SnackbarContent)(
//   ({ theme, severity }) => `
//   display: flex;
//   gap: 8px;
//   background-color: ${theme.palette.mode === 'dark' ? '#424242' : '#fff'};
//   border-radius: 8px;
//   border: 1px solid ${theme.palette[severity].main};
//   box-shadow: 0 2px 16px rgba(0,0,0,0.2);
//   padding: 0.75rem;
//   color: ${theme.palette.text.primary};
// `
// );

// const IconMap = {
//   success: CheckCircleIcon,
//   info: InfoIcon,
//   warning: WarningIcon,
//   error: ErrorIcon,
// };

// const ToastContext = createContext();

// export const ToastProvider = ({ children }) => {
//   const [toasts, setToasts] = useState([]);

//   const addToast = (toast) => {
//     setToasts((prev) => [...prev, { ...toast, id: Date.now() }]);
//   };

//   const removeToast = (id) => {
//     setToasts((prev) => prev.filter((toast) => toast.id !== id));
//   };

//   return (
//     <ToastContext.Provider value={{ addToast }}>
//       {children}
//       {toasts.map(({ id, title, description, severity }) => (
//         <Snackbar
//           key={id}
//           open={true}
//           autoHideDuration={6000}
//           onClose={() => removeToast(id)}
//           anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//         >
//           <StyledToast severity={severity}>
//             <IconMap[severity] />
//             <div>
//               {title && <Typography variant="subtitle1">{title}</Typography>}
//               {description && (
//                 <Typography variant="body2">{description}</Typography>
//               )}
//             </div>
//             <IconButton
//               size="small"
//               aria-label="close"
//               onClick={() => removeToast(id)}
//             >
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </StyledToast>
//         </Snackbar>
//       ))}
//     </ToastContext.Provider>
//   );
// };

// export const useToast = () => {
//   return useContext(ToastContext);
// };

// export default ToastProvider;
