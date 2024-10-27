import { Box, Button } from '@mui/material';
import React from 'react';

import { StyledButton } from '../styled';
// import SidebarDeleteItem from './SidebarDeleteItem'; // Assuming you already have this component

export const SidebarContentFooter = ({
  item,
  contentType,
  onCancel,
  onSave,
  buttonRef,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        // display: 'flex',
        // justifyContent: 'space-between',
        // borderTop: '1px solid #e0e0e0',
        // ml: '100%',
        // max
      }}
    >
      {/* Delete button for the sidebar item */}
      {/* <SidebarDeleteItem item={item} contentType={contentType} /> */}

      {/* Action buttons: Cancel and Save */}
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <StyledButton
          variant="outlined"
          onClick={onCancel}
          style={{ marginRight: '10px' }}
        >
          Cancel
        </StyledButton>

        <StyledButton variant="outlined" ref={buttonRef} onClick={onSave}>
          Save
        </StyledButton>
        <Box></Box>
      </Box>
    </Box>
  );
};

export default SidebarContentFooter;
