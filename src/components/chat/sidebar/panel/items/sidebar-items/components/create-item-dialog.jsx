import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  styled,
  Switch,
  FormControlLabel,
  LinearProgress,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { RCDialog } from 'components/themed';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledDialogContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

export const CreateItemDialog = ({
  open,
  onClose,
  itemData,
  setItemData,
  onCreateItem,
  error,
  isDirectory,
  onUploadItem,
  isUploading,
  uploadProgress,
}) => {
  const { name = '', type = '.txt', content = '' } = itemData || {};

  const [useFileUpload, setUseFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handlers to update itemData state
  const handleNameChange = event => {
    setItemData({ ...itemData, name: event.target.value });
  };

  const handleTypeChange = event => {
    setItemData({ ...itemData, type: event.target.value });
  };

  const handleContentChange = event => {
    setItemData({ ...itemData, content: event.target.value });
  };

  const handleFileUploadChange = async event => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileContent = await file.text();
      const fileType = '.' + file.name.split('.').pop();
      setItemData({
        ...itemData,
        name: file.name.replace(fileType, ''),
        type: fileType,
        content: fileContent,
      });
    }
  };

  const handleUseFileUploadToggle = event => {
    setUseFileUpload(event.target.checked);
    if (!event.target.checked) {
      // Reset itemData and selectedFile when switching back to manual entry
      setItemData({ ...itemData, name: '', type: '.txt', content: '' });
      setSelectedFile(null);
    }
  };

  const dialogTitle = `Create New ${isDirectory ? 'Folder' : 'File'}`;

  const dialogActions = (
    <>
      <Button onClick={onClose} disabled={isUploading}>
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={() => onCreateItem(selectedFile)}
        disabled={!name.trim() || !!error || isUploading}
      >
        Create {isDirectory ? 'Folder' : 'File'}
      </Button>
    </>
  );

  return (
    <RCDialog
      open={open}
      onClose={onClose}
      title={dialogTitle}
      actions={dialogActions}
    >
      {!isDirectory && (
        <FormControlLabel
          control={
            <Switch
              checked={useFileUpload}
              onChange={handleUseFileUploadToggle}
              color="primary"
            />
          }
          label="Upload File"
          sx={{ mb: 2 }}
        />
      )}
      <TextField
        fullWidth
        label={isDirectory ? 'Folder Name' : 'File Name'}
        value={name}
        onChange={handleNameChange}
        error={!!error}
        helperText={error}
        sx={{ mb: 2 }}
        disabled={useFileUpload && !isDirectory}
      />
      {!isDirectory && (
        <>
          {useFileUpload ? (
            <>
              <Button
                variant="contained"
                component="label"
                sx={{ mb: 2 }}
                disabled={isUploading}
              >
                Choose File
                <input type="file" hidden onChange={handleFileUploadChange} />
              </Button>
              {selectedFile && (
                <Typography variant="body2">
                  Selected File: {selectedFile.name}
                </Typography>
              )}
            </>
          ) : (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>File Type</InputLabel>
                <Select
                  value={type}
                  onChange={handleTypeChange}
                  label="File Type"
                >
                  <MenuItem value=".txt">.txt</MenuItem>
                  <MenuItem value=".js">.js</MenuItem>
                  <MenuItem value=".jsx">.jsx</MenuItem>
                  {/* Add more file types as needed */}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="File Content"
                multiline
                rows={4}
                value={content}
                onChange={handleContentChange}
                sx={{ mb: 2 }}
              />
            </>
          )}
        </>
      )}
      {isUploading && (
        <LinearProgress variant="determinate" value={uploadProgress} />
      )}
    </RCDialog>
  );
};

CreateItemDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemData: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  setItemData: PropTypes.func.isRequired,
  onCreateItem: PropTypes.func.isRequired,
  error: PropTypes.string,
  isDirectory: PropTypes.bool.isRequired,
  onUploadItem: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  uploadProgress: PropTypes.number.isRequired,
};

export default CreateItemDialog;
