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
  Fade,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react';

import { RCDialog } from 'components/themed';

// Styled Components with Black and White Theme
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#121212', // Dark background
    color: '#FFFFFF', // White text
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#000000',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#FFFFFF',
  },
}));

export const CreateItemDialog = React.memo(
  ({
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
    const theme = useTheme();
    const { name = '', type = '.txt', content = '' } = itemData || {};

    const [useFileUpload, setUseFileUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Handler Functions with useCallback
    const handleNameChange = useCallback(
      event => {
        setItemData(prevData => ({ ...prevData, name: event.target.value }));
      },
      [setItemData]
    );

    const handleTypeChange = useCallback(
      event => {
        setItemData(prevData => ({ ...prevData, type: event.target.value }));
      },
      [setItemData]
    );

    const handleContentChange = useCallback(
      event => {
        setItemData(prevData => ({ ...prevData, content: event.target.value }));
      },
      [setItemData]
    );

    const handleFileUploadChange = useCallback(
      async event => {
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
      },
      [itemData, setItemData]
    );

    const handleUseFileUploadToggle = useCallback(
      event => {
        const checked = event.target.checked;
        setUseFileUpload(checked);
        if (!checked) {
          // Reset itemData and selectedFile when switching back to manual entry
          setItemData(prevData => ({
            ...prevData,
            name: '',
            type: '.txt',
            content: '',
          }));
          setSelectedFile(null);
        }
      },
      [setItemData]
    );

    const dialogTitle = `Create New ${isDirectory ? 'Folder' : 'File'}`;

    const handleCreate = useCallback(() => {
      onCreateItem(selectedFile);
    }, [onCreateItem, selectedFile]);

    const dialogActions = (
      <>
        <StyledButton onClick={onClose} disabled={isUploading}>
          Cancel
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={handleCreate}
          disabled={!name.trim() || !!error || isUploading}
        >
          Create {isDirectory ? 'Folder' : 'File'}
        </StyledButton>
      </>
    );

    return (
      <StyledDialog
        open={open}
        onClose={onClose}
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <StyledDialogContent>
          {!isDirectory && (
            <FormControlLabel
              control={
                <StyledSwitch
                  checked={useFileUpload}
                  onChange={handleUseFileUploadToggle}
                  color="default"
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
            sx={{
              mb: 2,
              input: { color: '#FFFFFF' },
              label: { color: '#FFFFFF' },
            }}
            disabled={useFileUpload && !isDirectory}
            InputLabelProps={{
              style: { color: '#FFFFFF' },
            }}
            InputProps={{
              style: { color: '#FFFFFF' },
            }}
          />
          {!isDirectory && (
            <>
              {useFileUpload ? (
                <>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ mb: 2, color: '#FFFFFF', borderColor: '#FFFFFF' }}
                    disabled={isUploading}
                  >
                    Choose File
                    <input
                      type="file"
                      hidden
                      onChange={handleFileUploadChange}
                    />
                  </Button>
                  {selectedFile && (
                    <Typography variant="body2" sx={{ color: '#FFFFFF' }}>
                      Selected File: {selectedFile.name}
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel sx={{ color: '#FFFFFF' }}>File Type</InputLabel>
                    <Select
                      value={type}
                      onChange={handleTypeChange}
                      label="File Type"
                      sx={{
                        color: '#FFFFFF',
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: '#FFFFFF',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#FFFFFF',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#FFFFFF',
                        },
                        '.MuiSvgIcon-root ': {
                          fill: '#FFFFFF',
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: '#121212',
                            color: '#FFFFFF',
                          },
                        },
                      }}
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
                    sx={{
                      mb: 2,
                      input: { color: '#FFFFFF' },
                      label: { color: '#FFFFFF' },
                      textarea: { color: '#FFFFFF' },
                    }}
                    InputLabelProps={{
                      style: { color: '#FFFFFF' },
                    }}
                    InputProps={{
                      style: { color: '#FFFFFF' },
                    }}
                  />
                </>
              )}
            </>
          )}
          {isUploading && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#333333',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#FFFFFF',
                    transition: 'width 0.3s ease-in-out',
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: '#FFFFFF', mt: 1 }}>
                Upload Progress: {uploadProgress}%
              </Typography>
            </Box>
          )}
        </StyledDialogContent>
        <DialogActions>{dialogActions}</DialogActions>
      </StyledDialog>
    );
  }
);

CreateItemDialog.displayName = 'CreateItemDialog';

CreateItemDialog.propTypes = {
  error: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  itemData: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    content: PropTypes.string,
    isDirectory: PropTypes.bool.isRequired,
    metadata: PropTypes.shape({
      space: PropTypes.string.isRequired,
    }),
  }).isRequired,
  setItemData: PropTypes.func.isRequired,
  onCreateItem: PropTypes.func.isRequired,
  onUploadItem: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  uploadProgress: PropTypes.number.isRequired,
};

export default CreateItemDialog;
