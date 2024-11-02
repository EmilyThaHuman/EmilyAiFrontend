/* eslint-disable no-unused-vars */
import { Button, Input } from '@mui/material';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { useMode } from '@/hooks';

import { DropzoneContainer } from './styled';

export const Dropzone = props => {
  const { content, ...rest } = props;
  const { getRootProps, getInputProps } = useDropzone();
  const { theme } = useMode();

  return (
    <DropzoneContainer theme={theme} {...getRootProps()} {...rest}>
      <Input {...getInputProps()} style={{ display: 'none' }} />
      <Button variant="contained" disableElevation>
        {content}
      </Button>
    </DropzoneContainer>
  );
};

export default Dropzone;
