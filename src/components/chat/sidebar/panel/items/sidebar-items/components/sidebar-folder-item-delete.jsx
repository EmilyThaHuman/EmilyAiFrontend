import { Delete as IconTrash } from '@mui/icons-material'; // Material-UI icons
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useContext, useRef, useState } from 'react';
import { toast } from 'sonner';

import { workspacesApi } from 'api/workspaces';
import { useChatStore } from 'contexts/ChatProvider';

export const DeleteFolder = ({ folder, contentType }) => {
  const {
    actions: {
      setChatSessions,
      setFolders,
      setPresets,
      setPrompts,
      setFiles,
      setCollections,
      setAssistants,
      setTools,
      setModels,
    },
  } = useChatStore();

  const buttonRef = useRef(null);
  const [showFolderDialog, setShowFolderDialog] = useState(false);

  const stateUpdateFunctions = {
    chats: setChatSessions,
    presets: setPresets,
    prompts: setPrompts,
    files: setFiles,
    collections: setCollections,
    assistants: setAssistants,
    tools: setTools,
    models: setModels,
  };

  const handleDeleteFolderOnly = async () => {
    await workspacesApi.deleteFolder(folder.id);
    setFolders(prevState => prevState.filter(c => c.id !== folder.id));
    setShowFolderDialog(false);

    const setStateFunction = stateUpdateFunctions[contentType];
    if (!setStateFunction) return;

    setStateFunction(prevItems =>
      prevItems.map(item => {
        if (item.folder_id === folder.id) {
          return { ...item, folder_id: null };
        }
        return item;
      })
    );
  };

  const handleDeleteFolderAndItems = async () => {
    const setStateFunction = stateUpdateFunctions[contentType];
    if (!setStateFunction) return;

    setStateFunction(prevItems =>
      prevItems.filter(item => item.folder_id !== folder.id)
    );

    handleDeleteFolderOnly();
  };

  return (
    <>
      <IconButton onClick={() => setShowFolderDialog(true)}>
        <IconTrash />
      </IconButton>

      <Dialog
        open={showFolderDialog}
        onClose={() => setShowFolderDialog(false)}
      >
        <DialogTitle>Delete {folder.name}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this folder?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFolderDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            ref={buttonRef}
            onClick={handleDeleteFolderAndItems}
            color="error"
            variant="contained"
          >
            Delete Folder & Included Items
          </Button>
          <Button
            ref={buttonRef}
            onClick={handleDeleteFolderOnly}
            color="error"
            variant="contained"
          >
            Delete Folder Only
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteFolder;
