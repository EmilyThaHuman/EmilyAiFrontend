// src/components/ui/toast/Toast.js
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
import Slide from '@mui/material/Slide';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import { dismissToast, removeToast } from '@/store/Slices';

const SlideTransition = props => {
  return <Slide {...props} direction="up" />;
};

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
    borderRadius: theme.shape.borderRadius,
  })
);

export const Toast = ({
  id,
  severity = 'info',
  title,
  description,
  action,
  open,
}) => {
  const dispatch = useDispatch();
  const Icon = severityIconMap[severity];

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    dispatch(dismissToast({ id }));
  };

  const handleExited = () => {
    dispatch(removeToast({ id }));
  };

  return (
    <Snackbar
      key={id}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      onExited={handleExited}
    >
      <StyledSnackbarContent
        severity={severity}
        message={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {Icon && <Icon style={{ marginRight: 8 }} />}
            <div>
              {title && (
                <Typography variant="subtitle1" component="div">
                  {title}
                </Typography>
              )}
              {description && (
                <Typography variant="body2" component="div">
                  {description}
                </Typography>
              )}
            </div>
          </div>
        }
        action={
          <>
            {action && action.onClick && (
              <Button color="inherit" size="small" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => dispatch(dismissToast({ id }))}
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
  id: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  }),
  open: PropTypes.bool.isRequired,
};

export default Toast;
