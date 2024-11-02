import { alpha } from '@mui/material/styles';

import { borders, colors, typography } from 'assets/themes/base';
import { pxToRem } from 'assets/themes/functions';

const { info, grey, background, action, black } = colors;
const { borderRadius } = borders;
const { size } = typography;

export default {
  styleOverrides: {
    root: {
      border: '1px solid #808080',
      '&:hover': {
        border: '1px solid #3d3d3d',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3d3d3d',
      },
    },
    input: {
      bg: '#ffffff',
    },
    inputSizeSmall: {
      fontSize: size.xs,
      padding: pxToRem(10),
    },
    multiline: {
      color: grey[700],
      padding: 0,
    },
  },
};
