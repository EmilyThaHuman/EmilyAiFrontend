// RCSelect.js

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import RCSelectRoot from './RCSelectRoot';
export const RCSelect = React.forwardRef(
  (
    {
      value = '',
      onChange,
      label = '',
      options = [],
      variant = 'standard',
      placeholder = '',
      ...rest
    },
    ref
  ) => {
    const selectProps = {
      value,
      onChange,
      label,
      placeholder,
      variant: variant === 'textfield' ? 'outlined' : undefined,
      fullWidth: true,
      displayEmpty: true,
      renderValue: selected => selected || placeholder,
      ...rest,
    };

    const renderPlaceholder = () => (
      <MenuItem value="" disabled>
        {placeholder || `Select a ${label.toLowerCase()}...`}
      </MenuItem>
    );

    return (
      <RCSelectRoot ref={ref} variant={variant} {...selectProps}>
        {renderPlaceholder()}
        {options.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </RCSelectRoot>
    );
  }
);

RCSelect.displayName = 'RCSelect';

RCSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  variant: PropTypes.oneOf(['standard', 'textfield']),
  placeholder: PropTypes.string,
};

export default RCSelect;
// export const RCSelect = React.forwardRef(
//   (
//     {
//       value = '',
//       onChange,
//       label = '',
//       options = [],
//       variant = 'standard',
//       placeholder = '',
//       ...rest
//     },
//     ref
//   ) => {
//     const selectProps = {
//       value,
//       onChange,
//       label,
//       placeholder,
//       ...rest,
//     };

//     const renderPlaceholder = () => (
//       <MenuItem value="" disabled>
//         {placeholder || `Select a ${label.toLowerCase()}...`}
//       </MenuItem>
//     );

//     if (variant === 'textfield') {
//       return (
//         <TextField
//           ref={ref}
//           select
//           variant="outlined"
//           fullWidth
//           SelectProps={{
//             displayEmpty: true,
//             renderValue: selected => selected || placeholder,
//           }}
//           {...selectProps}
//         >
//           {renderPlaceholder()}
//           {options.map(option => (
//             <MenuItem key={option} value={option}>
//               {option}
//             </MenuItem>
//           ))}
//         </TextField>
//       );
//     }

//     return (
//       <RCSelectRoot
//         ref={ref}
//         {...selectProps}
//         displayEmpty
//         renderValue={selected => selected || placeholder}
//       >
//         {renderPlaceholder()}
//         {options.map(option => (
//           <MenuItem key={option} value={option}>
//             {option}
//           </MenuItem>
//         ))}
//       </RCSelectRoot>
//     );
//   }
// );

// RCSelect.displayName = 'RCSelect';

// RCSelect.propTypes = {
//   value: PropTypes.string,
//   onChange: PropTypes.func,
//   label: PropTypes.string,
//   options: PropTypes.arrayOf(PropTypes.string),
//   variant: PropTypes.oneOf(['standard', 'textfield']),
//   placeholder: PropTypes.string,
// };

// export default RCSelect;
