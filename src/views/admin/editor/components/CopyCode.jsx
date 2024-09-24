'use client';

import { IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[900]}`,
  backgroundColor: 'transparent',
  padding: theme.spacing(1),
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: theme.palette.grey[900],
  },
}));

const StyledIcon = styled('svg')({
  height: 16,
  width: 16,
  color: '#fafafa',
});

export const CopyCode = ({ code }) => {
  const [hasCheckIcon, setHasCheckIcon] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setHasCheckIcon(true);

    setTimeout(() => {
      setHasCheckIcon(false);
    }, 1000);
  };

  return (
    <StyledIconButton onClick={onCopy}>
      {hasCheckIcon ? (
        <StyledIcon as={CheckIcon} />
      ) : (
        <StyledIcon as={CopyIcon} />
      )}
    </StyledIconButton>
  );
};

export default CopyCode;
