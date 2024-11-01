import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * @typedef {Object} RCSnippetRootProps
 * @property {React.ReactNode} children - The content of the snippet.
 * @property {string} variant - The variant style for the snippet.
 */

/**
 * RCSnippetRoot component that provides different styling variants for the snippet.
 * @param {RCSnippetRootProps} props
 * @returns {JSX.Element}
 */
const RCSnippetRoot = ({ children, variant }) => {
  const variantStyles = {
    default: {
      backgroundColor: '#f5f5f5',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      padding: '16px',
    },
    dark: {
      backgroundColor: '#333',
      color: '#fff',
      border: '1px solid #444',
      borderRadius: '4px',
      padding: '16px',
    },
    light: {
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '16px',
    },
    // Add more variants as needed
  };

  const styles = variantStyles[variant] || variantStyles.default;

  return <Box sx={styles}>{children}</Box>;
};

RCSnippetRoot.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'dark', 'light']), // Add more variants as needed
};

export default RCSnippetRoot;
