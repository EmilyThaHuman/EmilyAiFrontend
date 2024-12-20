/* eslint-disable no-unused-vars */
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import RCDialogRoot from './RCDialogRoot';

/**
 * A customizable dialog component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.variant - The dialog variant.
 * @param {string} props.bgColor - The dialog background color.
 * @param {string} props.color - The dialog color.
 * @param {string} props.opacity - The dialog opacity.
 * @param {string} props.borderRadius - The dialog border radius.
 * @param {string} props.shadow - The dialog box shadow.
 * @param {string} props.coloredShadow - The dialog colored box shadow.
 * @param {React.ReactNode} children - The dialog children.
 * @returns {React.Element} The rendered RCDialog component.
 */
export const RCDialog = React.forwardRef(
  (
    {
      // STYLE PROPERTIES
      variant = 'contained',
      bgColor = 'white',
      color = 'text',
      borderRadius = 'rounded',
      shadow = 'none',
      coloredShadow = 'none',
      opacity = 0.2,
      transition = 'slide',
      // CONTENT PROPERTIES
      title = null,
      subtitle = null,
      content = null,
      actions = null,
      children = null,
      // EVENTS
      open = false,
      onClose = () => {},
      onOpen = () => {},
      onCancel = () => {},
      onConfirm = () => {},
      ...rest
    },
    ref
  ) => (
    <RCDialogRoot
      {...rest}
      ref={ref}
      open={open}
      // fullWidth
      maxWidth="md"
      onClose={onClose}
      // onOpen={onOpen}
      TransitionComponent={transition === 'slide' ? Slide : undefined}
      ownerState={{
        variant,
        bgColor,
        color,
        borderRadius,
        shadow,
        coloredShadow,
        opacity,
        transition,
      }}
    >
      <Dialog
        // fullWidth
        maxWidth="md"
        open={open}
        onClose={onClose}
        // onEnter={onOpen}
        TransitionComponent={transition === 'slide' ? Slide : undefined}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#1a1a1a',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          '& .MuiDialogTitle-root': {
            borderBottom: '1px solid #333',
          },
          '& .MuiDialogContentText-root': {
            color: '#ccc',
          },
          '& .MuiTextField-root': {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#777',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#999',
              },
              '& input': {
                color: '#fff',
              },
            },
          },
        }}
        {...rest}
      >
        {title && (
          <DialogTitle
            sx={{
              // color: 'text.primary',
              color: '#ccc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {title}
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
              sx={{ ml: 2 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
        )}
        <DialogContent
          sx={{
            color: 'text.primary',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {subtitle && (
            <>
              <DialogContentText>{subtitle}</DialogContentText>
              <Divider sx={{ my: 2 }} />
            </>
          )}{' '}
          {content && <Box>{content}</Box>}
          {children}
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            '& button': {
              padding: '10px 15px',
              cursor: 'pointer',
              color: '#fff',
            },
          }}
        >
          {actions}
        </DialogActions>
      </Dialog>
    </RCDialogRoot>
  )
);
RCDialog.displayName = 'RCDialog';
// Typechecking props for the RCDialog
RCDialog.propTypes = {
  variant: PropTypes.oneOf([
    'contained',
    'gradient',
    'dashboard',
    'none',
    'darkMode',
  ]),
  bgColor: PropTypes.string,
  color: PropTypes.string,
  borderRadius: PropTypes.string,
  shadow: PropTypes.string,
  coloredShadow: PropTypes.string,
  opacity: PropTypes.number,
  transition: PropTypes.oneOf(['slide', 'fade', 'grow', 'zoom', 'none']),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  content: PropTypes.node,
  actions: PropTypes.node,
  children: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default RCDialog;
