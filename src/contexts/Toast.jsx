import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { styled } from '@mui/system';
import React from 'react';

const StyledToast = styled('div')(
  ({ theme, severity }) => `
  display: flex;
  gap: 8px;
  overflow: hidden;
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? `0 2px 16px rgba(0,0,0, 0.5)`
      : `0 2px 16px ${grey[200]}`
  };
  padding: 0.75rem;
  color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  text-align: start;
  position: relative;

  .snackbar-message {
    flex: 1 1 0%;
    max-width: 100%;
  }

  .snackbar-title {
    margin: 0;
    line-height: 1.5rem;
    margin-right: 0.5rem;
    color: ${theme.palette[severity].main};
  }

  .snackbar-description {
    margin: 0;
    line-height: 1.5rem;
    font-weight: 400;
    color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
  }

  .snackbar-close-icon {
    cursor: pointer;
    flex-shrink: 0;
    padding: 2px;
    border-radius: 4px;

    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    }
  }
`
);

const IconMap = {
  success: CheckCircleIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

export const Toast = ({ message, severity, onClose }) => {
  const Icon = IconMap[severity] || InfoIcon;

  return (
    <StyledToast severity={severity}>
      <Icon
        sx={{
          color: theme => theme.palette[severity].main,
          flexShrink: 0,
          width: '1.25rem',
          height: '1.5rem',
        }}
      />
      <div className="snackbar-message">
        <p className="snackbar-title">
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </p>
        <p className="snackbar-description">{message}</p>
      </div>
      <CloseIcon onClick={onClose} className="snackbar-close-icon" />
    </StyledToast>
  );
};

export default Toast;
