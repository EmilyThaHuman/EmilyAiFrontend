// RCMenuItem.js

import PropTypes from 'prop-types';
import React from 'react';

import RCMenuItemRoot from './RCMenuItemRoot';

/**
 * The RCMenuItem component is a styled wrapper around the Material-UI MenuItem.
 *
 * @component RCMenuItem
 * @param {Object} props - The component props.
 * @param {string} [props.value] - The value of the menu item.
 * @param {boolean} [props.disabled] - Whether the menu item is disabled.
 * @param {React.ReactNode} props.children - The content of the menu item.
 * @returns {React.Element} The rendered RCMenuItem component.
 */

export const RCMenuItem = React.forwardRef(
  ({ value = '', disabled = false, children, ...rest }, ref) => {
    return (
      <RCMenuItemRoot ref={ref} value={value} disabled={disabled} {...rest}>
        {children}
      </RCMenuItemRoot>
    );
  }
);

RCMenuItem.displayName = 'RCMenuItem';

RCMenuItem.propTypes = {
  value: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default RCMenuItem;
