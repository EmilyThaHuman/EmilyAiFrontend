import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

export const RCSliderRoot = styled(Slider, {
  shouldForwardProp: prop => prop !== 'variant',
})(({ theme, variant, disabled }) => {
  const baseStyles = {
    width: '100%',
  };

  const standardStyles = {
    color: '#ffffff',
    '& .MuiSlider-thumb': {
      border: `2px solid #18b984`,
    },
    '& .MuiSlider-track': {
      color: '#18b984', // Valid color format for the track
      opacity: 0.75,
    },
  };

  // const darkModeStyles = {
  //   color: '#ffffff',
  //   '& .MuiSlider-root': {
  //     color: '#ffffff',
  //   },
  //   '& .MuiSlider-thumb': {
  //     color: '#ffffff',
  //   },
  //   '& .MuiSlider-track': {
  //     // color: '#ffffff',
  //     color: '#18b984', // Slider button color
  //   },
  //   '& .MuiSlider-rail': {
  //     color: '#ffffff',
  //   },
  // };
  const darkModeStyles = {
    color: '#ffffff',
    '& .MuiSlider-thumb': {
      color: '#ffffff',
    },
    '& .MuiSlider-track': {
      color: '#18b984', // Valid color format for the track
    },
    '& .MuiSlider-rail': {
      color: '#999999', // Adjusted rail color for better contrast
    },
  };
  // const prettoStyles = {
  //   color: '#52af77',
  //   height: 8,
  //   '& .MuiSlider-track': {
  //     border: 'none',
  //   },
  //   '& .MuiSlider-thumb': {
  //     height: 24,
  //     width: 24,
  //     backgroundColor: '#fff',
  //     border: '2px solid currentColor',
  //     '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
  //       boxShadow: 'inherit',
  //     },
  //     '&::before': {
  //       display: 'none',
  //     },
  //   },
  //   '& .MuiSlider-valueLabel': {
  //     lineHeight: 1.2,
  //     fontSize: 12,
  //     background: 'unset',
  //     padding: 0,
  //     width: 32,
  //     height: 32,
  //     borderRadius: '50% 50% 50% 0',
  //     backgroundColor: '#52af77',
  //     transformOrigin: 'bottom left',
  //     transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
  //     '&::before': { display: 'none' },
  //     '&.MuiSlider-valueLabelOpen': {
  //       transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
  //     },
  //     '& > *': {
  //       transform: 'rotate(45deg)',
  //     },
  //   },
  // };

  return {
    ...baseStyles,
    ...(variant === 'default' && standardStyles),
    ...(variant === 'darkMode' && darkModeStyles),
  };
});

export default RCSliderRoot;
