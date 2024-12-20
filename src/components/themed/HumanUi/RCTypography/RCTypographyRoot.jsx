import Typography from '@mui/material/Typography';
import styledDefault from 'styled-components';
// import { useMode } from '@/hooks';

const RCTypographyRoot = styledDefault(Typography)(({ theme, ownerState }) => {
  // const { theme } = useMode();
  const { palette, typography, functions } = theme;
  const {
    color,
    textTransform,
    verticalAlign,
    fontWeight,
    opacity,
    textGradient,
    darkMode,
    variant,
  } = ownerState;
  const { gradients, transparent, white } = palette;
  const {
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold,
  } = typography;
  const fontWeights = {
    light: fontWeightLight,
    regular: fontWeightRegular,
    medium: fontWeightMedium,
    bold: fontWeightBold,
  };
  const { linearGradient } = functions;
  const darkModeFormLabelStyles = {
    color: '#ffffff',
  };
  const gradientStyles = () => ({
    backgroundImage:
      color !== 'inherit' &&
      color !== 'text' &&
      color !== 'white' &&
      gradients[color]
        ? linearGradient(gradients[color].main, gradients[color].state)
        : linearGradient(gradients.dark.main, gradients.dark.state),
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: transparent.main,
    position: 'relative',
    zIndex: 1,
  });
  const darkGradient = {
    display: 'inline-flex',
    backgroundImage: 'linear-gradient(to right, #b2a8fd, #8678f9, #c7d2fe)',
    backgroundSize: '200% auto',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'textGradient 1.5s linear infinite',
    '@keyframes textGradient': {
      to: {
        backgroundPosition: '200% center',
      },
    },
  };
  let colorValue =
    color === 'inherit' || !palette[color] ? 'inherit' : palette[color].main;
  if (darkMode && (color === 'inherit' || !palette[color])) {
    colorValue = 'inherit';
  } else if (darkMode && color === 'dark') colorValue = white.main;
  if (color === 'textPrimary') colorValue = palette.text.primary;
  if (color === 'textSecondary') colorValue = palette.text.secondary;
  if (color === 'textTertiary') colorValue = palette.text.tertiary;
  return {
    textDecoration: 'none',
    color: colorValue,
    fontWeight: fontWeights[fontWeight] && fontWeights[fontWeight],
    ...(textGradient && gradientStyles()),
    ...(variant === 'darkModeFormLabel' && darkModeFormLabelStyles),
    ...(variant === 'darkGradient' && darkGradient),
  };
});

export default RCTypographyRoot;
