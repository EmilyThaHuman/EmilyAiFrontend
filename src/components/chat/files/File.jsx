import { Box, IconButton, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { FiX } from 'react-icons/fi';

import { useFileProcesser } from '@/hooks';
import { FileIcon } from '@/lib/fileUtils';

export const File = React.memo(props => {
  const { file, hidden } = props;
  const { handleRemoveFile } = useFileProcesser();

  // Memoize the isImage calculation
  const isImage = useCallback(() => {
    return [
      'image',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ].includes(file.type);
  }, [file.type]);

  // Memoize the handleRemove function
  const handleRemove = useCallback(() => {
    handleRemoveFile(file._id);
  }, [handleRemoveFile, file._id]);

  // Check if file object is valid
  if (!file || !file.name || !file.data) {
    console.error('Invalid file object:', file);
    return <Typography variant="body2">Invalid file</Typography>;
  }

  return (
    <Box
      position="relative"
      color={'#BDBDBD'}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: hidden ? 'flex-start' : 'center',
        p: hidden ? 0.5 : 1,
        width: hidden ? 'auto' : '100%',
        maxWidth: hidden ? 'auto' : 400,
        maxHeight: hidden ? 'auto' : 200,
        ml: hidden ? '-48px' : 0,
        '&:hover .delete-button': {
          visibility: 'visible',
        },
        borderRadius: 2,
        gap: 4,
        zIndex: hidden ? 1 : 'auto',
        border: '1px solid #BDBDBD',
      }}
    >
      {isImage() ? (
        <Box
          component="img"
          src={file.data}
          alt={file.name}
          sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
        />
      ) : (
        <Box flexGrow={1} flexDirection="row" display="flex">
          <FileIcon
            sx={{ fontSize: 40, color: 'grey.600', mr: 2 }}
            type={file.type}
            size={40}
            iconColor="grey.400"
          />
          {!hidden && (
            <Box flexGrow={1} flexDirection="row" height={20}>
              <Typography variant="body2">{file.name}</Typography>
            </Box>
          )}
        </Box>
      )}
      <IconButton
        className="delete-button"
        onClick={handleRemove}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          visibility: 'hidden',
          zIndex: 10,
        }}
      >
        <FiX />
      </IconButton>
    </Box>
  );
});

File.displayName = 'File';

export default File;
