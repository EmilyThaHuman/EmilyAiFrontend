import { Edit as IconEdit } from '@mui/icons-material'; // Material-UI icons
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';
import React, { useContext, useRef, useState } from 'react';

import { workspacesApi } from 'api/workspaces';
import { useChatStore } from 'contexts/ChatProvider';

export const UpdateFolder = ({ folder }) => {
  const {
    actions: { setFolders },
  } = useChatStore();

  const buttonRef = useRef(null);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [name, setName] = useState(folder.name);

  const handleUpdateFolder = async () => {
    const updatedFolder = await workspacesApi.updateFolder(folder.id, { name });
    setFolders(prevState =>
      prevState.map(c => (c.id === folder.id ? updatedFolder : c))
    );
    setShowFolderDialog(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      buttonRef.current?.click();
    }
  };

  return (
    <>
      <IconButton onClick={() => setShowFolderDialog(true)}>
        <IconEdit />
      </IconButton>

      <Dialog
        open={showFolderDialog}
        onClose={() => setShowFolderDialog(false)}
      >
        <DialogTitle>Edit Folder</DialogTitle>
        <DialogContent onKeyDown={handleKeyDown}>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFolderDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            ref={buttonRef}
            onClick={handleUpdateFolder}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateFolder;
