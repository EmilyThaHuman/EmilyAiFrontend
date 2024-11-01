// Toast.js
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Button,
  IconButton,
  Snackbar,
  SnackbarContent,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';

import { useToast } from './toastContext';
import PropTypes from 'prop-types';

const severityIconMap = {
  success: CheckCircleIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const StyledSnackbarContent = styled(SnackbarContent)(
  ({ theme, severity }) => ({
    backgroundColor: theme.palette[severity]?.main || theme.palette.grey[800],
    color: theme.palette.getContrastText(
      theme.palette[severity]?.main || theme.palette.grey[800]
    ),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  })
);

export const Toast = ({
  id,
  severity = 'info',
  title,
  description,
  action,
}) => {
  const { hideToast } = useToast();
  const Icon = severityIconMap[severity];

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={true}
      autoHideDuration={6000}
      onClose={() => hideToast(id)}
    >
      <StyledSnackbarContent
        severity={severity}
        message={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {Icon && <Icon style={{ marginRight: 8 }} />}
            <div>
              {title && <Typography variant="subtitle1">{title}</Typography>}
              {description && (
                <Typography variant="body2">{description}</Typography>
              )}
            </div>
          </div>
        }
        action={
          <>
            {action && (
              <Button color="inherit" size="small" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => hideToast(id)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </Snackbar>
  );
};

Toast.propTypes = {
  id: PropTypes.number.isRequired,
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  }),
};
export default Toast;
