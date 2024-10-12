import { ChevronRight, ChevronDown } from '@mui/icons-material'; // Material UI icons
import { Box, IconButton, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';

import { DeleteFolder } from './sidebar-folder-item-delete';
import { UpdateFolder } from './sidebar-folder-item-update';

const Folder = ({ folder, contentType, children, onUpdateFolder }) => {
  const itemRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleDragEnter = e => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragOver = e => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragOver(false);
    const itemId = e.dataTransfer.getData('text/plain');
    onUpdateFolder(itemId, folder.id);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      itemRef.current?.click();
    }
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      ref={itemRef}
      id="folder"
      sx={{
        borderRadius: 1,
        outline: 'none',
        backgroundColor: isDragOver ? 'rgba(0,0,0,0.1)' : 'transparent',
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Box
        tabIndex={0}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
          borderRadius: 1,
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)', opacity: 0.8 },
          '&:focus': { backgroundColor: 'rgba(0,0,0,0.1)' },
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small">
            {isExpanded ? <ChevronDown /> : <ChevronRight />}
          </IconButton>
          <Typography sx={{ marginLeft: 1 }}>{folder.name}</Typography>
        </Box>

        {isHovering && (
          <Box
            sx={{ display: 'flex', gap: 2, marginLeft: 2 }}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <UpdateFolder folder={folder} />
            <DeleteFolder folder={folder} contentType={contentType} />
          </Box>
        )}
      </Box>

      {isExpanded && (
        <Box
          sx={{
            marginLeft: 5,
            marginTop: 2,
            borderLeft: '2px solid rgba(0,0,0,0.1)',
            paddingLeft: 4,
            gap: 2,
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default Folder;
