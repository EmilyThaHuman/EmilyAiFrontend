// RCSelectRoot.js
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const commonStyles = {
  '& .MuiSelect-select, & .MuiInputBase-input': {
    color: '#ffffff',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ffffff',
  },
  '& .MuiSvgIcon-root': {
    color: '#ffffff',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ffffff',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#ffffff',
  },
};

export const RCSelectRoot = styled(FormControl)(({ theme }) => ({
  fullWidth: true,
  width: '100%',
  ...commonStyles,
}));

export const StyledSelect = styled(Select)({
  ...commonStyles,
  '& .MuiSelect-select': {
    // paddingRight: '32px',
    color: '#ffffff', // Ensure the text is white
  },
  '& .MuiSelect-select.MuiSelect-select': {
    color: '#ffffff', // This ensures the placeholder text is also white
  },
  '& .MuiSelect-icon': {
    color: '#ffffff', // Ensure the dropdown icon is white
  },
});

export const StyledTextField = styled(TextField)({
  fullWidth: true,
  ...commonStyles,
  '& .MuiInputBase-input': {
    color: '#ffffff', // Ensure the text is white
  },
});

const RCSelectRootComponent = ({ children, variant, ...props }) => {
  if (variant === 'textfield') {
    return (
      <StyledTextField select {...props}>
        {children}
      </StyledTextField>
    );
  }
  return (
    <RCSelectRoot>
      <StyledSelect {...props}>{children}</StyledSelect>
    </RCSelectRoot>
  );
};

export default RCSelectRootComponent;
