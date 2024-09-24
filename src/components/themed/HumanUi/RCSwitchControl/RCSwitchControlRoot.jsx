import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const RCSwitchControlRoot = styled(FormControlLabel)(({
  theme,
  ownerState,
}) => {
  const { variant } = ownerState;

  const baseStyles = {
    '& .MuiSwitch-switchBase': {
      color: '#18b984',
      '&:hover': {
        backgroundColor: 'rgba(24, 185, 132, 0.08)',
      },
      '&.Mui-checked': {
        color: '#18b984',
        '&:hover': {
          backgroundColor: 'rgba(24, 185, 132, 0.08)',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#18b984',
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#ffffff',
      opacity: 1,
    },
  };

  const lightStyles = {
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#ffffff',
    },
  };

  const darkStyles = {
    '& .MuiSwitch-switchBase': {
      color: '#ffffff',
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#ffffff',
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#333333',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#333333',
    },
  };

  return {
    ...baseStyles,
    ...(variant === 'light' ? lightStyles : darkStyles),
  };
});

RCSwitchControlRoot.Switch = styled(Switch)({});

export default RCSwitchControlRoot;
