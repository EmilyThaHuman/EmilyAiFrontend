import { Box } from '@mui/material';
import { styled } from '@mui/system';

const PlaygroundWrapper = styled(Box)(({ theme, isCentered }) => ({
  minHeight: '200px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.black,
  border: `1px solid ${theme.palette.grey[900]}`,
  padding: theme.spacing(4),
  ...(isCentered && {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
}));

const BackgroundGrid = styled(Box)({
  position: 'absolute',
  height: '100%',
  width: '100%',
  backgroundImage: `
    linear-gradient(to right, rgba(177, 177, 177, 0.18) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(177, 177, 177, 0.18) 1px, transparent 1px)
  `,
  backgroundSize: '14px 24px',
  maskImage:
    'radial-gradient(ellipse 50% 50% at 50% 50%, #000 10%, transparent 100%)',
});

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 0,
});

export const ComponentPlayground = ({ children, isCentered, className }) => {
  return (
    <PlaygroundWrapper isCentered={isCentered} className={className}>
      <BackgroundGrid />
      <ContentWrapper>{children}</ContentWrapper>
    </PlaygroundWrapper>
  );
};

export default ComponentPlayground;
