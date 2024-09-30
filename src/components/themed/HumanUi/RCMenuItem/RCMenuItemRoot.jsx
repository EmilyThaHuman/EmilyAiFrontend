// RCMenuItemRoot.js

import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

export const RCMenuItemRoot = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  '&.Mui-disabled': {
    opacity: 0.5,
  },
}));

export default RCMenuItemRoot;
