import FormControlLabel from '@mui/material/FormControlLabel';
import PropTypes from 'prop-types';
import React from 'react';
import RCSwitchControlRoot from './RCSwitchControlRoot';

/**
 * The ReusableSwitchControl component is a styled wrapper around the Material-UI Switch.
 *
 * @component ReusableSwitchControl
 * @param {Object} props - The component props.
 * @param {boolean} [props.checked] - Whether the switch is checked.
 * @param {Function} [props.onChange] - The function to call when the switch is toggled.
 * @param {string} [props.label] - The label for the switch.
 * @param {string} [props.variant] - The variant for the switch ('light' or 'dark').
 * @returns {React.Element} The rendered ReusableSwitchControl component.
 */
export const RCSwitchControl = ({
  label,
  checked,
  onChange,
  variant = 'light',
}) => (
  <FormControlLabel
    control={
      <RCSwitchControlRoot.Switch
        checked={checked}
        onChange={onChange}
        ownerState={{ checked, variant }}
        // variant={variant}
      />
    }
    label={label}
  />
);

RCSwitchControl.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  variant: PropTypes.oneOf(['light', 'dark']),
};

export default RCSwitchControl;
