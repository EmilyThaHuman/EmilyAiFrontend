import { Box, Avatar, Card, styled } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  textAlign: 'center',
  p: 16,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  position: 'relative',
  borderRadius: '20px',
  minWidth: '0px',
  wordWrap: 'break-word',
  bg: theme.palette.secondary.main,
  backgroundClip: 'border-box',
  minHeight: '100%',
}));

export const DropzoneContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.grey[100],
  border: `1px dashed ${theme.palette.grey[300]}`,
  borderRadius: 16,
  width: '100%',
  height: 'max-content',
  minHeight: '100%',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
}));

export const BannerImage = styled(Box)(({ theme, src }) => ({
  background: `url(${src}) no-repeat center center`,
  backgroundSize: 'cover',
  borderRadius: '0.75rem',
  height: '8rem',
  width: '100%',
  justifyContent: 'center',
  marginTop: '0.25rem',
}));

export const AvatarWrapper = styled(Avatar)(({ theme }) => ({
  height: 87,
  width: 87,
  marginTop: '-43px',
  border: `4px solid ${theme.palette.background.paper}`,
  margin: 'auto',
}));
