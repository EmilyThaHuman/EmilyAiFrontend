import { TextField, Button } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo } from 'react';

import { RCButton, RCDialog } from 'components/themed';
// import { RCDialog, FileUploadTextField, ContentTextField } from './components';

export const ErrorMessage = ({ error }) => (
  <AnimatePresence>
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        style={{ color: 'red', marginTop: '5px' }}
      >
        {error}
      </motion.div>
    )}
  </AnimatePresence>
);
export const FileUploadTextField = ({
  value,
  onChange,
  fileInputRef,
  existingNames,
  handleFileUpload,
}) => {
  const handleTextFieldClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <TextField
        fullWidth
        value={value}
        onClick={handleTextFieldClick}
        placeholder="Select a file"
        InputProps={{
          readOnly: true,
          endAdornment: (
            <Button
              variant="contained"
              component="span"
              onClick={handleTextFieldClick}
            >
              Upload
            </Button>
          ),
        }}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </>
  );
};
export const FileCreationContent = ({
  existingNames,
  setExistingNames,
  handleFileUpload,
  handleNameChange,
}) => {
  return (
    <TextField
      fullWidth
      margin="dense"
      label="File Name"
      placeholder="Enter file name"
      value={existingNames[0]}
      onChange={e => handleNameChange(e.target.value)}
    />
  );
};
export const AssistantCreationContent = ({
  assistantName,
  setAssistantName,
}) => {
  return (
    <TextField
      fullWidth
      margin="dense"
      label="Assistant Name"
      placeholder="Enter assistant name"
      value={assistantName}
      onChange={e => setAssistantName(e.target.value)}
    />
  );
};
export const PromptCreationContent = ({ promptText, setPromptText }) => {
  return (
    <TextField
      fullWidth
      margin="dense"
      label="Prompt Text"
      placeholder="Enter prompt text"
      value={promptText}
      onChange={e => setPromptText(e.target.value)}
    />
  );
};
export const ChatSessionCreationContent = ({
  chatSessionName,
  setChatSessionName,
}) => {
  return (
    <TextField
      fullWidth
      margin="dense"
      label="Chat Session Name"
      placeholder="Enter chat session name"
      value={chatSessionName}
      onChange={e => setChatSessionName(e.target.value)}
    />
  );
};
const ContentTextField = ({ label, value, onChange, placeholder }) => (
  <TextField
    fullWidth
    margin="dense"
    label={label}
    placeholder={placeholder}
    value={value}
    onChange={e => onChange(e.target.value)}
  />
);

const useFileNameValidation = (newFileName, existingNames) => {
  return useMemo(() => {
    if (!newFileName) return '';
    if (existingNames.includes(newFileName)) return 'File name already exists';
    if (!/^[a-zA-Z0-9_.-]+$/.test(newFileName))
      return 'Invalid characters in file name';
    return '';
  }, [newFileName, existingNames]);
};

export const NewFileDialog = ({
  newFileDialog,
  handleCloseNewFileDialog,
  newFileName,
  setNewFileName,
  fileInputRef,
  existingNames,
  handleFileUpload,
  handleNewFileNameChange,
  handleCreateNewFile,
  fileToUpload,
  space,
}) => {
  const fileNameError = useFileNameValidation(newFileName, existingNames);

  const dialogConfig = useMemo(
    () => ({
      files: {
        title: 'Create New File',
        actionText: fileToUpload ? 'Upload' : 'Create',
        content: (
          <>
            <FileUploadTextField
              value={newFileName}
              onChange={setNewFileName}
              fileInputRef={fileInputRef}
              existingNames={existingNames}
              handleFileUpload={handleFileUpload}
            />
            <ContentTextField
              label="File Name"
              value={newFileName}
              onChange={handleNewFileNameChange}
              placeholder="Enter file name"
            />
          </>
        ),
      },
      assistants: {
        title: 'Create Assistant',
        actionText: 'Create Assistant',
        content: (
          <ContentTextField
            label="Assistant Name"
            value={newFileName}
            onChange={setNewFileName}
            placeholder="Enter assistant name"
          />
        ),
      },
      prompts: {
        title: 'Create Prompt',
        actionText: 'Create Prompt',
        content: (
          <ContentTextField
            label="Prompt Text"
            value={newFileName}
            onChange={setNewFileName}
            placeholder="Enter prompt text"
          />
        ),
      },
      'chat sessions': {
        title: 'Create Chat Session',
        actionText: 'Create Chat Session',
        content: (
          <ContentTextField
            label="Chat Session Name"
            value={newFileName}
            onChange={setNewFileName}
            placeholder="Enter chat session name"
          />
        ),
      },
    }),
    [
      newFileName,
      setNewFileName,
      fileInputRef,
      existingNames,
      handleFileUpload,
      handleNewFileNameChange,
      fileToUpload,
    ]
  );

  const { title, actionText, content } = dialogConfig[space] || {
    title: 'Create Item',
    actionText: 'Create',
    content: <p>Unknown space type.</p>,
  };

  return (
    <RCDialog
      open={newFileDialog.open}
      onClose={handleCloseNewFileDialog}
      title={title}
      content={content}
      actions={
        <>
          <RCButton
            variant="outlined"
            // colorVariant="darkMode"
            color="success"
            onClick={handleCloseNewFileDialog}
          >
            Cancel
          </RCButton>
          <Button
            onClick={handleCreateNewFile}
            disabled={!newFileName || !!fileNameError}
          >
            {actionText}
          </Button>
        </>
      }
    />
  );
};

export const NewFolderDialog = ({
  newFolderDialog,
  handleCloseNewFolderDialog,
  newFolderName,
  handleNewFolderNameChange,
  folderNameError,
  handleCreateNewFolder,
}) => {
  return (
    <RCDialog
      open={newFolderDialog.open}
      onClose={handleCloseNewFolderDialog}
      title="Create New Folder"
      variant="darkMode"
      content={
        <>
          <TextField
            margin="dense"
            label="Folder Name"
            placeholder="Enter folder name"
            fullWidth
            value={newFolderName}
            onChange={handleNewFolderNameChange}
            error={!!folderNameError}
            helperText={folderNameError}
          />
          <ErrorMessage error={folderNameError} />
        </>
      }
      actions={
        <>
          <Button
            onClick={handleCloseNewFolderDialog}
            sx={{
              background: '#353740',
              color: '#ffffff',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewFolder}
            disabled={!!folderNameError || !newFolderName}
          >
            Create
          </Button>
        </>
      }
    />
  );
};
