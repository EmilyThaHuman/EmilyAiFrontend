// Dialog.jsx
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import FocusTrap from 'focus-trap-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

/**
 * Custom Dialog Component
 *
 * @param {boolean} open - Controls the visibility of the dialog.
 * @param {function} onClose - Function to handle closing the dialog.
 * @param {React.ReactNode} children - Content to be displayed inside the dialog.
 */
export const Dialog = ({ open, onClose, children }) => {
  // Handle clicks on the overlay to close the dialog
  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent background scrolling when dialog is open
  useEffect(() => {
    let scrollPosition = 0;
    if (open) {
      scrollPosition = window.pageYOffset;
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      const currentScroll = parseInt(document.body.style.top || '0') * -1;
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, currentScroll);
    }

    /**
     * Returns a function that resets the body's position and top style properties.
     * @returns {Function} A function that when called, removes the 'position' and 'top' styles from the document's body.
     */
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
    };
  }, [open]);

  /**
   * Sets up an effect to handle the 'Escape' key press event for closing a component.
   * This effect adds a keydown event listener to the document when the component mounts,
   * and removes it when the component unmounts to prevent memory leaks.
   *
   * @param {function} onClose - The function to be called when the 'Escape' key is pressed
   * @returns {function} A cleanup function that removes the event listener
   */
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FocusTrap>
            <motion.div
              className="bg-white rounded-lg p-6 relative max-w-lg w-full mx-4 sm:mx-0 shadow-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <IconButton
                onClick={onClose}
                aria-label="Close Dialog"
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                size="large"
              >
                <Close />
              </IconButton>

              {/* Dialog Content */}
              <div className="mt-2">{children}</div>
            </motion.div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Define prop types for better type checking
Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Dialog;
